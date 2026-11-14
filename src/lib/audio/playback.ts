// Playback engine — synthesizes a violin demo of the score using Tone.js.
// Loads a few SoundFont samples from nbrosowsky's tonejs-instruments CDN and
// pitch-shifts the rest. Sample buffer covers C3..C6 which comfortably fits
// every note we ship.

import * as Tone from "tone";
import type { ScoreNote } from "../types";

/** Note names to pre-load into the Sampler. Covers C3..C6 with enough density that pitch-shifting stays musical. */
const SAMPLE_URLS: Record<string, string> = {
  C3: "C3.mp3",
  E3: "E3.mp3",
  A3: "A3.mp3",
  C4: "C4.mp3",
  E4: "E4.mp3",
  A4: "A4.mp3",
  C5: "C5.mp3",
  E5: "E5.mp3",
  A5: "A5.mp3",
  C6: "C6.mp3",
};

const SAMPLE_BASE = "https://nbrosowsky.github.io/tonejs-instruments/samples/violin/";

export type PlaybackPhase = "idle" | "loading" | "ready" | "playing" | "stopped" | "error";

interface ScheduledEvent {
  /** Absolute Tone.now()-relative time when the note should sound. */
  time: number;
  /** Frequency in Hz. */
  frequency: number;
  /** Duration in seconds. */
  duration: number;
}

export class PlaybackEngine {
  private sampler: Tone.Sampler | null = null;
  private scheduledIds: number[] = [];
  private startedAt = 0;
  private currentPieceId: string | null = null;
  private phaseListeners = new Set<(p: PlaybackPhase) => void>();

  private _phase: PlaybackPhase = "idle";
  get phase(): PlaybackPhase {
    return this._phase;
  }

  onPhase(listener: (p: PlaybackPhase) => void) {
    this.phaseListeners.add(listener);
    listener(this._phase);
    return () => {
      this.phaseListeners.delete(listener);
    };
  }

  private setPhase(p: PlaybackPhase) {
    this._phase = p;
    this.phaseListeners.forEach((l) => l(p));
  }

  /** Lazy-load the sampler. Idempotent — returns the same instance after first load. */
  private async ensureSampler(): Promise<Tone.Sampler> {
    if (this.sampler) return this.sampler;
    this.setPhase("loading");
    try {
      // Tone.start() must be called inside a user gesture for some browsers.
      await Tone.start();
      const sampler = new Tone.Sampler({
        urls: SAMPLE_URLS,
        baseUrl: SAMPLE_BASE,
        release: 0.6,
      });
      // Reasonable default master volume — sample-level dynamics are already loud
      sampler.volume.value = -8;
      await Tone.loaded();
      this.sampler = sampler;
      this.setPhase("ready");
      return sampler;
    } catch (err) {
      this.setPhase("error");
      throw err;
    }
  }

  /**
   * Start playback for the given notes. Notes are scheduled at their absolute
   * start times (adjusted by tempo). The caller should listen to `onTick` or
   * `currentTime` to drive UI cursors.
   */
  async start(
    pieceId: string,
    notes: ScoreNote[],
    tempoMultiplier: number,
    onTick: (elapsedSec: number, currentNoteIndex: number) => void
  ): Promise<void> {
    if (this._phase === "playing" && this.currentPieceId === pieceId) return;
    if (this._phase === "playing") this.stop();

    const sampler = await this.ensureSampler();
    this.currentPieceId = pieceId;
    this.startedAt = Tone.now() + 0.05; // tiny lead-in so first note lands cleanly

    const sortedNotes = [...notes].sort((a, b) => a.startSec - b.startSec);
    const totalSec = notes.length
      ? Math.max(...notes.map((n) => n.startSec + n.durationSec)) / tempoMultiplier
      : 0;

    // Schedule audio events on Tone.js's transport
    const events: ScheduledEvent[] = [];
    sortedNotes.forEach((n) => {
      events.push({
        time: this.startedAt + n.startSec / tempoMultiplier,
        frequency: n.frequency,
        duration: Math.max(0.05, n.durationSec / tempoMultiplier),
      });
    });
    events.forEach((e) => {
      sampler.triggerAttackRelease(e.frequency, e.duration, e.time);
    });

    // Schedule UI tick — requestAnimationFrame loop driven from audio clock
    let rafId = 0;
    const tick = () => {
      const elapsed = Tone.now() - this.startedAt;
      if (this._phase !== "playing" || elapsed > totalSec + 0.2) {
        // Auto-stop when piece ends
        this.stop();
        return;
      }
      // Find the note whose onset is closest to (but not after) current elapsed
      const scaledElapsed = elapsed * tempoMultiplier;
      let idx = 0;
      for (let i = 0; i < sortedNotes.length; i++) {
        if (sortedNotes[i].startSec <= scaledElapsed) idx = i;
        else break;
      }
      onTick(elapsed, idx);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    this.scheduledIds.push(rafId);

    this.setPhase("playing");
  }

  stop(): void {
    this.scheduledIds.forEach((id) => cancelAnimationFrame(id));
    this.scheduledIds = [];
    if (this.sampler) {
      this.sampler.releaseAll();
    }
    this.startedAt = 0;
    this.currentPieceId = null;
    if (this._phase !== "idle" && this._phase !== "ready" && this._phase !== "error") {
      this.setPhase("stopped");
    }
  }

  setVolume(db: number) {
    if (this.sampler) this.sampler.volume.value = db;
  }

  /** Best-effort teardown — releases Web Audio resources. */
  dispose() {
    this.stop();
    if (this.sampler) {
      this.sampler.dispose();
      this.sampler = null;
    }
    this.phaseListeners.clear();
  }
}