// Music theory helpers — pure functions, no DOM.

/** A4 reference frequency. */
export const A4 = 440;

/** MIDI number of A4. */
export const A4_MIDI = 69;

/** Convert MIDI note to scientific pitch notation. e.g. 69 -> "A4", 60 -> "C4". */
export function midiToName(midi: number): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

/** Convert MIDI to frequency in Hz. */
export function midiToFreq(midi: number): number {
  return A4 * Math.pow(2, (midi - A4_MIDI) / 12);
}

/** Convert frequency to fractional MIDI. */
export function freqToMidi(freq: number): number {
  return A4_MIDI + 12 * Math.log2(freq / A4);
}

/** Pitch difference in cents between two MIDI values. Positive = detected is sharp. */
export function centsBetween(detectedMidi: number, expectedMidi: number): number {
  return (detectedMidi - expectedMidi) * 100;
}

/** Snap a fractional MIDI to the nearest integer. */
export function snapMidi(midi: number): number {
  return Math.round(midi);
}

/** Pretty-print seconds as m:ss. */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
