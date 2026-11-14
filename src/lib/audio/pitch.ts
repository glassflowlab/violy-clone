// YIN-style pitch detector using `pitchy`.
// Streams microphone audio via Web Audio API and emits note events.
// Designed to be paused/resumed cleanly without dropping the mic stream.

import { PitchDetector } from "pitchy";

export interface PitchSample {
  /** Detection time relative to audition start, in seconds. */
  timeSec: number;
  /** Detected frequency in Hz, or null when no confident pitch. */
  frequency: number | null;
  /** Fractional MIDI (or null). */
  midi: number | null;
  /** Clarity 0..1 — pitchy's "clarity" output. */
  clarity: number;
  /** RMS 0..1 — used as a loudness gate. */
  rms: number;
}

export interface PitchEngineOptions {
  /** Minimum clarity to accept a pitch (0..1). Defaults to 0.9. */
  clarityThreshold?: number;
  /** Minimum RMS to accept a pitch (0..1). Defaults to 0.01. */
  rmsThreshold?: number;
  /** Called for every detected frame (~60Hz). */
  onSample: (s: PitchSample) => void;
  /** Called once with an Error if mic permission fails or audio init fails. */
  onError?: (err: Error) => void;
}

export class PitchEngine {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null; // intentionally ScriptProcessor — broadly supported, no worklet bundling
  private detector: PitchDetector<Float32Array> | null = null;
  private startedAt = 0;
  private rafId: number | null = null;
  private opts: Required<PitchEngineOptions>;
  private stopped = false;

  constructor(opts: PitchEngineOptions) {
    this.opts = {
      clarityThreshold: 0.9,
      rmsThreshold: 0.01,
      onError: () => {},
      ...opts,
    };
  }

  async start(): Promise<void> {
    if (this.ctx) return;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
        },
      });
    } catch (err) {
      this.opts.onError(err instanceof Error ? err : new Error(String(err)));
      return;
    }

    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.source = this.ctx.createMediaStreamSource(this.stream);
    const bufferSize = 2048;
    this.processor = this.ctx.createScriptProcessor(bufferSize, 1, 1);
    this.detector = PitchDetector.forFloat32Array(bufferSize);

    this.source.connect(this.processor);
    // Important: ScriptProcessor needs to be connected to destination to fire onaudioprocess,
    // but we mute the output via a gain node so it doesn't feed back into the mic.
    const mute = this.ctx.createGain();
    mute.gain.value = 0;
    this.processor.connect(mute);
    mute.connect(this.ctx.destination);

    this.startedAt = this.ctx.currentTime;
    this.stopped = false;

    this.processor.onaudioprocess = (ev) => {
      if (this.stopped) return;
      const input = ev.inputBuffer.getChannelData(0);
      // Compute RMS for loudness gating
      let sum = 0;
      for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
      const rms = Math.sqrt(sum / input.length);

      const timeSec = (ev.timeStamp - this.startedAt) / 1000;

      let frequency: number | null = null;
      let midi: number | null = null;
      let clarity = 0;

      if (this.detector && rms >= this.opts.rmsThreshold) {
        const [f, c] = this.detector.findPitch(input, this.ctx!.sampleRate);
        if (c >= this.opts.clarityThreshold && f > 30 && f < 4000) {
          frequency = f;
          midi = 69 + 12 * Math.log2(f / 440);
          clarity = c;
        }
      }

      this.opts.onSample({ timeSec, frequency, midi, clarity, rms });
    };
  }

  stop(): void {
    this.stopped = true;
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    if (this.processor) {
      this.processor.onaudioprocess = null;
      this.processor.disconnect();
    }
    if (this.source) this.source.disconnect();
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    if (this.ctx) this.ctx.close().catch(() => {});
    this.ctx = null;
    this.source = null;
    this.stream = null;
    this.processor = null;
    this.detector = null;
  }

  isRunning(): boolean {
    return !!this.ctx && !this.stopped;
  }
}
