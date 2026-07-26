"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Register } from "./elevenlabs";

export type VoiceState = "idle" | "loading" | "speaking";

/**
 * How many words per minute we assume when pacing silent playback. Matches the
 * narration pace used in the bandwidth maths so the two sections agree.
 */
const WORDS_PER_MINUTE = 150;

/**
 * useElsaVoice
 * ------------
 * One hook, two modes, identical API to the caller:
 *
 *  - **Audio mode** — the deployment has ElevenLabs credentials. `/api/speak`
 *    returns MP3, we play it, and progress/level come from the real waveform
 *    via an AnalyserNode.
 *
 *  - **Silent mode** — no credentials. We pace playback from the word count at
 *    150 wpm and synthesise a plausible speech envelope. Every transcript
 *    reveal, waveform, and progress bar behaves exactly as it will with audio.
 *
 * This is why the site is finished before the API key exists: components never
 * branch on availability, they just call `speak()`.
 */
export function useElsaVoice() {
  const [state, setState] = useState<VoiceState>("idle");
  const [progress, setProgress] = useState(0);
  /** null until the first request tells us; then true (audio) or false (silent). */
  const [configured, setConfigured] = useState<boolean | null>(null);

  /** Current speech level, 0..1. A ref so the waveform can animate without re-rendering. */
  const levelRef = useRef(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const freqDataRef = useRef<Uint8Array | null>(null);
  /** Incremented on every speak()/stop() so stale async work can bail out. */
  const runIdRef = useRef(0);

  const cleanupPlayback = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    analyserRef.current = null;
    levelRef.current = 0;
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    cleanupPlayback();
    setState("idle");
    setProgress(0);
  }, [cleanupPlayback]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      cleanupPlayback();
      // Close the shared context only on unmount.
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
  }, [cleanupPlayback]);

  /** Drives level + progress from real decoded audio. */
  const trackAudio = useCallback((audio: HTMLAudioElement, runId: number) => {
    const tick = () => {
      if (runId !== runIdRef.current) return;

      const analyser = analyserRef.current;
      const data = freqDataRef.current;
      if (analyser && data) {
        analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);
        // Weight the low-mid bands where speech energy actually lives.
        const bins = Math.min(48, data.length);
        let sum = 0;
        for (let i = 0; i < bins; i += 1) sum += data[i];
        levelRef.current = Math.min(1, sum / bins / 160);
      }

      if (audio.duration > 0 && Number.isFinite(audio.duration)) {
        setProgress(Math.min(1, audio.currentTime / audio.duration));
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  /**
   * Silent mode: pace from word count and synthesise a speech-like envelope.
   * Two detuned sines plus a syllable-rate pulse reads convincingly as speech
   * without ever sounding like a fixed loop.
   */
  const trackSilent = useCallback((durationMs: number, runId: number, onDone: () => void) => {
    const start = performance.now();
    const tick = () => {
      if (runId !== runIdRef.current) return;

      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / durationMs);
      setProgress(t);

      const s = elapsed / 1000;
      // Syllable-rate carrier (~4.2 Hz is close to conversational English).
      const syllable = 0.5 + 0.5 * Math.sin(s * 2 * Math.PI * 4.2);
      const phrase = 0.55 + 0.45 * Math.sin(s * 2 * Math.PI * 0.55 + 1.1);
      const jitter = 0.85 + 0.15 * Math.sin(s * 2 * Math.PI * 11.3);
      // Fade in and out so it doesn't clip on at full amplitude.
      const envelope = Math.min(1, t * 14) * Math.min(1, (1 - t) * 14);
      levelRef.current = Math.max(0, syllable * phrase * jitter * envelope);

      if (t >= 1) {
        levelRef.current = 0;
        onDone();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const speak = useCallback(
    async (text: string, register: Register = "warm", expressive = false) => {
      runIdRef.current += 1;
      const runId = runIdRef.current;
      cleanupPlayback();
      setProgress(0);
      setState("loading");

      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const silentDuration = Math.max(1600, (words / WORDS_PER_MINUTE) * 60_000);

      const goSilent = () => {
        if (runId !== runIdRef.current) return;
        setState("speaking");
        trackSilent(silentDuration, runId, () => {
          if (runId !== runIdRef.current) return;
          setState("idle");
          setProgress(1);
        });
      };

      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, register, expressive }),
        });

        if (runId !== runIdRef.current) return;

        if (!res.ok) {
          // 503 is the expected, designed-for path with no credentials.
          setConfigured(false);
          goSilent();
          return;
        }

        const blob = await res.blob();
        if (runId !== runIdRef.current) return;
        setConfigured(true);

        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        const audio = new Audio(url);
        audio.preload = "auto";
        audioRef.current = audio;

        // Wire an analyser so the waveform reflects the actual voice.
        try {
          audioCtxRef.current ??= new AudioContext();
          const ctx = audioCtxRef.current;
          if (ctx.state === "suspended") await ctx.resume();
          const source = ctx.createMediaElementSource(audio);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.75;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          analyserRef.current = analyser;
          freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
        } catch {
          // Analyser is an enhancement; playback still works without it.
          analyserRef.current = null;
        }

        audio.addEventListener("ended", () => {
          if (runId !== runIdRef.current) return;
          setState("idle");
          setProgress(1);
          levelRef.current = 0;
        });

        await audio.play();
        if (runId !== runIdRef.current) return;
        setState("speaking");
        trackAudio(audio, runId);
      } catch {
        // Network failure, autoplay block, decode error — all land in silent mode.
        if (runId !== runIdRef.current) return;
        cleanupPlayback();
        goSilent();
      }
    },
    [cleanupPlayback, trackAudio, trackSilent],
  );

  /**
   * Play a pre-recorded local clip (e.g. an ElevenLabs export in /public) through
   * the same analyser pipeline as speak(), so the waveform and progress come from
   * the real voice. Resolves when the clip ends (or on error), so a caller can
   * chain a question clip into an answer clip.
   */
  const playUrl = useCallback(
    (url: string): Promise<void> => {
      runIdRef.current += 1;
      const runId = runIdRef.current;
      cleanupPlayback();
      setProgress(0);
      setState("loading");
      setConfigured(true);

      return new Promise<void>((resolve) => {
        const done = () => {
          if (runId === runIdRef.current) {
            setState("idle");
            setProgress(1);
            levelRef.current = 0;
          }
          resolve();
        };

        const audio = new Audio(url);
        audio.preload = "auto";
        audioRef.current = audio;
        audio.addEventListener("ended", done, { once: true });
        audio.addEventListener("error", done, { once: true });

        const begin = async () => {
          // Analyser so the waveform reflects the actual voice.
          try {
            audioCtxRef.current ??= new AudioContext();
            const ctx = audioCtxRef.current;
            if (ctx.state === "suspended") await ctx.resume();
            const source = ctx.createMediaElementSource(audio);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.75;
            source.connect(analyser);
            analyser.connect(ctx.destination);
            analyserRef.current = analyser;
            freqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
          } catch {
            // Analyser is an enhancement; playback still works without it.
            analyserRef.current = null;
          }

          try {
            await audio.play();
          } catch {
            done();
            return;
          }
          if (runId !== runIdRef.current) return;
          setState("speaking");
          trackAudio(audio, runId);
        };

        void begin();
      });
    },
    [cleanupPlayback, trackAudio],
  );

  return {
    speak,
    playUrl,
    stop,
    state,
    progress,
    levelRef,
    configured,
    isSpeaking: state === "speaking",
    isLoading: state === "loading",
  };
}
