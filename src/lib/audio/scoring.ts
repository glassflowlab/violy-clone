// Practice engine: combines pitch detection with score-following and scoring.
// Used by /practice page as a React hook.

import { useCallback, useEffect, useRef, useState } from "react";
import { PitchEngine, type PitchSample } from "../audio/pitch";
import { parseMusicXml } from "../score/parser";
import { centsBetween } from "../music";
import type { AuditionResult, DetectedNote, NoteResult, Piece, ScoreNote } from "../types";

export type EnginePhase = "idle" | "starting" | "running" | "finishing" | "done" | "error";

export interface EngineState {
  phase: EnginePhase;
  /** Elapsed seconds in the current audition (clamped to piece duration). */
  elapsed: number;
  /** Current expected note index (closest note whose onset <= elapsed). */
  currentNoteIndex: number;
  /** MIDI of the current expected note, or null when before/after the score. */
  currentNoteMidi: number | null;
  /** Live pitch sample for the meter UI. */
  live: PitchSample | null;
  /** RMS history for the small loudness sparkline. */
  loudness: number[];
  /** Last computed result when phase === "done". */
  result: AuditionResult | null;
  error: string | null;
}

export interface UsePracticeEngineOptions {
  piece: Piece;
  /** Tempo multiplier (0.5 = half speed). Default 1.0. */
  tempo?: number;
}

const ONSET_TOLERANCE_SEC = 0.5;     // how wide a window around expected onset counts as a "hit"
const PITCH_TOLERANCE_CENTS = 50;    // 50 cents = quarter-tone
const RHYTHM_TOLERANCE_SEC = 0.3;    // 300ms window for rhythm accuracy

export function usePracticeEngine({ piece, tempo = 1 }: UsePracticeEngineOptions) {
  const [state, setState] = useState<EngineState>({
    phase: "idle",
    elapsed: 0,
    currentNoteIndex: 0,
    currentNoteMidi: null,
    live: null,
    loudness: [],
    result: null,
    error: null,
  });

  const engineRef = useRef<PitchEngine | null>(null);
  const samplesRef = useRef<PitchSample[]>([]);
  const startedAtRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const parsedRef = useRef(parseMusicXml(piece.musicXml));

  // Re-parse when piece changes
  useEffect(() => {
    parsedRef.current = parseMusicXml(piece.musicXml);
  }, [piece.musicXml]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const finalize = useCallback(() => {
    stopRaf();
    engineRef.current?.stop();
    engineRef.current = null;

    const scoreNotes: ScoreNote[] = parsedRef.current.notes;
    const samples = samplesRef.current;

    // For each expected note, find the best matching sample within an onset window.
    const results: NoteResult[] = scoreNotes.map((expected) => {
      let best: { sample: PitchSample; timeOffset: number } | null = null;
      for (const s of samples) {
        const offset = s.timeSec - expected.startSec;
        if (Math.abs(offset) <= ONSET_TOLERANCE_SEC) {
          if (!best || Math.abs(offset) < Math.abs(best.timeOffset)) {
            best = { sample: s, timeOffset: offset };
          }
        }
      }
      const detectedSample = best?.sample ?? null;
      const detected: DetectedNote | null = detectedSample
        ? {
            timeSec: detectedSample.timeSec,
            frequency: detectedSample.frequency,
            midi: detectedSample.midi !== null ? Math.round(detectedSample.midi) : null,
            clarity: detectedSample.clarity,
            rms: detectedSample.rms,
          }
        : null;

      const hit = detected !== null && detected.midi === expected.midi;
      const pitchOffset = detected && detected.midi !== null ? centsBetween(detected.midi, expected.midi) : null;
      const timeOffset = detected ? best!.timeOffset : null;

      // Per-note score: pitch accuracy weighted 70%, rhythm accuracy 30%.
      let score = 0;
      if (hit && pitchOffset !== null) {
        const pitchScore = Math.max(0, 100 - (Math.abs(pitchOffset) / PITCH_TOLERANCE_CENTS) * 100);
        let rhythmScore = 100;
        if (timeOffset !== null) {
          rhythmScore = Math.max(0, 100 - (Math.abs(timeOffset) / RHYTHM_TOLERANCE_SEC) * 100);
        }
        score = pitchScore * 0.7 + rhythmScore * 0.3;
      }

      return {
        scoreNoteIndex: expected.index,
        expected,
        detected,
        pitchOffsetCents: pitchOffset,
        timeOffsetSec: timeOffset,
        score,
        hit,
      };
    });

    // Aggregate pitch curve: one point per 100ms window.
    const pitchCurve: AuditionResult["pitchCurve"] = [];
    const windowSec = 0.1;
    const totalSec = parsedRef.current.durationSec / tempo;
    for (let t = 0; t <= totalSec; t += windowSec) {
      const expected = scoreNotes.find((n) => n.startSec <= t && n.startSec + n.durationSec > t);
      const expectedMidi = expected?.midi ?? null;
      // Pick the sample in this window with highest clarity
      const inWindow = samples.filter((s) => s.timeSec >= t && s.timeSec < t + windowSec && s.midi !== null);
      const bestSample = inWindow.sort((a, b) => b.clarity - a.clarity)[0];
      const detectedMidi = bestSample ? Math.round(bestSample.midi!) : null;
      const offsetCents = detectedMidi !== null && expectedMidi !== null ? centsBetween(detectedMidi, expectedMidi) : null;
      pitchCurve.push({ timeSec: t, expectedMidi, detectedMidi, offsetCents });
    }

    const hitCount = results.filter((r) => r.hit).length;
    const pitchScore = scoreNotes.length ? Math.round((hitCount / scoreNotes.length) * 100) : 0;
    const rhythmDeltas = results.filter((r) => r.hit && r.timeOffsetSec !== null).map((r) => Math.abs(r.timeOffsetSec!));
    const avgRhythmDelta = rhythmDeltas.length ? rhythmDeltas.reduce((a, b) => a + b, 0) / rhythmDeltas.length : RHYTHM_TOLERANCE_SEC;
    const rhythmScore = Math.round(Math.max(0, 100 - (avgRhythmDelta / RHYTHM_TOLERANCE_SEC) * 100));

    const result: AuditionResult = {
      pieceId: piece.id,
      timestamp: Date.now(),
      tempoMultiplier: tempo,
      durationSec: totalSec,
      pitchScore,
      rhythmScore,
      noteResults: results,
      pitchCurve,
    };

    setState((s) => ({ ...s, phase: "done", result }));
  }, [piece.id, stopRaf, tempo]);

  const tick = useCallback(() => {
    const now = (performance.now() - startedAtRef.current) / 1000;
    const scaledElapsed = now * tempo; // expected playback position
    const totalSec = parsedRef.current.durationSec;
    if (scaledElapsed >= totalSec) {
      finalize();
      return;
    }

    const scoreNotes = parsedRef.current.notes;
    let currentIdx = 0;
    for (let i = 0; i < scoreNotes.length; i++) {
      if (scoreNotes[i].startSec <= scaledElapsed) currentIdx = i;
      else break;
    }

    const currentMidi = scoreNotes[currentIdx]?.midi ?? null;
    setState((s) => ({ ...s, elapsed: scaledElapsed, currentNoteIndex: currentIdx, currentNoteMidi: currentMidi }));
    rafRef.current = requestAnimationFrame(tick);
  }, [finalize, tempo]);

  const start = useCallback(async () => {
    setState({
      phase: "starting",
      elapsed: 0,
      currentNoteIndex: 0,
      currentNoteMidi: parsedRef.current.notes[0]?.midi ?? null,
      live: null,
      loudness: [],
      result: null,
      error: null,
    });
    samplesRef.current = [];
    startedAtRef.current = performance.now();

    const engine = new PitchEngine({
      onSample: (s) => {
        samplesRef.current.push(s);
        // Update the loudness sparkline (rolling 60 samples ≈ 1s of audio)
        setState((cur) => ({
          ...cur,
          live: s,
          loudness: [...cur.loudness, s.rms].slice(-60),
        }));
      },
      onError: (err) => {
        setState((cur) => ({ ...cur, phase: "error", error: err.message || "Microphone unavailable" }));
      },
    });
    engineRef.current = engine;
    await engine.start();
    if (!engine.isRunning()) {
      // engine failed during init, already reported error
      return;
    }
    setState((cur) => ({ ...cur, phase: "running" }));
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (state.phase === "running" || state.phase === "starting") {
      setState((s) => ({ ...s, phase: "finishing" }));
      finalize();
    }
  }, [finalize, state.phase]);

  useEffect(() => {
    return () => {
      stopRaf();
      engineRef.current?.stop();
    };
  }, [stopRaf]);

  return { state, start, stop };
}
