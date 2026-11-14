// Shared domain types

export type Instrument = "violin" | "piano";

export interface Piece {
  id: string;
  title: string;
  composer: string;
  instrument: Instrument;
  level: "beginner" | "intermediate" | "advanced";
  /** Total length in seconds at 1x tempo (computed at parse-time). */
  durationSec: number;
  /** MusicXML source. Either an inline string or a /public path. */
  musicXml: string;
  /** Tempo (BPM) the MusicXML was authored for. */
  defaultBpm: number;
  /** Brief one-line description shown on the library card. */
  blurb: string;
}

/** A single note target extracted from MusicXML — what we expect the user to play. */
export interface ScoreNote {
  /** Sequential index inside the piece (0-based). */
  index: number;
  /** Scientific pitch notation, e.g. "A4". */
  pitch: string;
  /** Frequency in Hz. */
  frequency: number;
  /** MIDI note number. */
  midi: number;
  /** When this note should sound, in seconds from the start of the piece at 1x tempo. */
  startSec: number;
  /** Note duration in seconds at 1x tempo. */
  durationSec: number;
  /** Voice/part index — used for multi-voice pieces. */
  voice: number;
  /** Measure number (1-based). */
  measure: number;
}

/** A detection of what the user actually played. */
export interface DetectedNote {
  /** Time since audition started (sec). */
  timeSec: number;
  /** Detected frequency in Hz, or null when no confident pitch. */
  frequency: number | null;
  /** MIDI note, or null when no confident pitch. */
  midi: number | null;
  /** Confidence 0..1 from YIN clarity. */
  clarity: number;
  /** RMS loudness in 0..1. */
  rms: number;
}

/** Per-note result emitted by the scoring engine. */
export interface NoteResult {
  scoreNoteIndex: number;
  expected: ScoreNote;
  /** Closest detected event within an onset window. */
  detected: DetectedNote | null;
  /** Pitch offset in cents (-50..+50). Positive = sharp. */
  pitchOffsetCents: number | null;
  /** Time offset vs expected onset in seconds. Positive = late. */
  timeOffsetSec: number | null;
  /** Per-note score 0..100. */
  score: number;
  /** Was the note played within the window at all? */
  hit: boolean;
}

export interface AuditionResult {
  pieceId: string;
  /** When this audition happened (epoch ms). */
  timestamp: number;
  /** Tempo used for the audition, e.g. 1.0 = default. */
  tempoMultiplier: number;
  durationSec: number;
  pitchScore: number;
  rhythmScore: number;
  noteResults: NoteResult[];
  /** Aggregated pitch offset timeline (1 sample per ~100ms) for the chart. */
  pitchCurve: Array<{ timeSec: number; expectedMidi: number | null; detectedMidi: number | null; offsetCents: number | null }>;
}
