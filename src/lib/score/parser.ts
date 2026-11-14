// MusicXML parser focused on extracting a flat note sequence with timing.
// Handles partwise MusicXML 4.0 (the common case). Ignores ties, beams, slurs,
// chord-stacking beyond the top note — MVP scope.

import type { ScoreNote } from "../types";

interface ParsedMeasure {
  number: number;
  notes: Array<{
    /** "note" or "rest" */
    kind: "note" | "rest";
    /** Step + alter + octave → MIDI. null for rests. */
    midi: number | null;
    /** Duration in divisions. */
    durationDiv: number;
    voice: number;
  }>;
}

interface ParsedPart {
  id: string;
  name: string;
  measures: ParsedMeasure[];
}

/** Convert "C", "C#", "Db", etc. + octave to MIDI. */
function pitchToMidi(step: string, alter: number | null, octave: string | number): number {
  const map: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const base = map[step.toUpperCase()] ?? 0;
  const a = alter ?? 0;
  const oct = typeof octave === "string" ? parseInt(octave, 10) : octave;
  return base + a + (oct + 1) * 12;
}

/** Parse an XML attribute string with simple extraction. We do NOT pull in a full XML library —
 *  MusicXML for our sample pieces is well-formed and small. */
function attr(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`\\b${name}="([^"]*)"`, "i"));
  return m ? m[1] : null;
}

/** Extract inner contents of the first tag matching name. */
function inner(xml: string, name: string): string | null {
  const openIdx = xml.indexOf(`<${name}`);
  if (openIdx === -1) return null;
  const closeSelf = xml.indexOf("/>", openIdx);
  if (closeSelf !== -1 && (xml.indexOf(`</${name}`, openIdx) === -1 || closeSelf < xml.indexOf(`</${name}`, openIdx))) {
    return xml.slice(openIdx, closeSelf + 2);
  }
  const openEnd = xml.indexOf(">", openIdx) + 1;
  const closeIdx = xml.indexOf(`</${name}`, openEnd);
  if (closeIdx === -1) return xml.slice(openEnd);
  return xml.slice(openEnd, closeIdx);
}

/**
 * Extract all top-level <tag>...</tag> blocks. Tracks depth to avoid confusing
 * a nested self-closing tag (e.g. <sound tempo="100"/>) with the closing of the parent block.
 */
function extractBlocks(xml: string, tag: string): string[] {
  const out: string[] = [];
  const openRe = new RegExp(`<${tag}(\\s|>)`, "g");
  let m: RegExpExecArray | null;
  while ((m = openRe.exec(xml)) !== null) {
    const open = m.index;
    const openEnd = xml.indexOf(">", open);
    if (openEnd === -1) break;
    // Detect immediate self-close: <tag/> or <tag attr="..."/>
    const openTagText = xml.slice(open, openEnd + 1);
    if (openTagText.endsWith("/>")) {
      out.push(openTagText);
      openRe.lastIndex = openEnd + 1;
      continue;
    }
    // Walk forward, skipping nested tags (any name) and self-closers, looking for </tag>.
    let depth = 1;
    let cursor = openEnd + 1;
    let closed = false;
    while (cursor < xml.length) {
      const nextOpen = xml.indexOf("<", cursor);
      if (nextOpen === -1) break;
      const tagEnd = xml.indexOf(">", nextOpen);
      if (tagEnd === -1) break;
      const tagText = xml.slice(nextOpen, tagEnd + 1);
      if (tagText.startsWith(`</${tag}`)) {
        depth--;
        if (depth === 0) {
          out.push(xml.slice(open, tagEnd + 1));
          openRe.lastIndex = tagEnd + 1;
          closed = true;
          break;
        }
      } else if (tagText.startsWith(`<${tag}`) && !tagText.endsWith("/>")) {
        depth++;
      }
      cursor = tagEnd + 1;
    }
    if (!closed) break;
  }
  return out;
}

function parsePart(partXml: string): ParsedPart {
  const id = attr(partXml, "id") ?? "P1";
  const nameTag = inner(partXml, "part-name");
  const name = nameTag ?? id;
  const measures: ParsedMeasure[] = [];
  const measureBlocks = extractBlocks(partXml, "measure");
  measureBlocks.forEach((mb, mi) => {
    const number = parseInt(attr(mb, "number") ?? `${mi + 1}`, 10);
    // Walk the measure's children in document order, treating <note> and <rest> as note events.
    const notes: ParsedMeasure["notes"] = [];
    const eventBlocks = [...extractBlocks(mb, "note"), ...extractBlocks(mb, "rest")];
    for (const nb of eventBlocks) {
      const isRest = nb.startsWith("<rest");
      const voiceStr = inner(nb, "voice") ?? "1";
      const voice = parseInt(voiceStr.trim() || "1", 10) || 1;
      const durStr = inner(nb, "duration");
      const durationDiv = parseInt(durStr?.trim() ?? "0", 10) || 0;
      let midi: number | null = null;
      if (!isRest) {
        const pitchXml = inner(nb, "pitch");
        if (pitchXml) {
          const step = inner(pitchXml, "step")?.trim() ?? "C";
          const alterStr = inner(pitchXml, "alter");
          const alter = alterStr ? parseInt(alterStr.trim(), 10) : 0;
          const octaveStr = inner(pitchXml, "octave")?.trim() ?? "4";
          midi = pitchToMidi(step, alter, octaveStr);
        }
      }
      notes.push({ kind: isRest ? "rest" : "note", midi, durationDiv, voice });
    }
    measures.push({ number, notes });
  });
  return { id, name, measures };
}

/** Result of parseMusicXml — full structural info plus a flat score-note timeline. */
export interface ParsedScore {
  parts: ParsedPart[];
  /** Notes flattened in time order (single voice = voice 1). */
  notes: ScoreNote[];
  /** First BPM found in the file, default 120. */
  bpm: number;
  /** Divisions per quarter note. */
  divisions: number;
  /** Total length in seconds at 1x tempo. */
  durationSec: number;
}

export function parseMusicXml(xml: string): ParsedScore {
  // Find tempo
  const tempoMatch = xml.match(/<sound\s+[^>]*tempo="([0-9.]+)"/i);
  const bpm = tempoMatch ? parseFloat(tempoMatch[1]) : 120;

  // Find all <part>...</part> blocks
  const parts: ParsedPart[] = [];
  const partBlocks: string[] = [];
  let idx = 0;
  while (true) {
    const open = xml.indexOf("<part ", idx);
    if (open === -1) break;
    const openEnd = xml.indexOf(">", open) + 1;
    const close = xml.indexOf("</part>", openEnd);
    if (close === -1) break;
    partBlocks.push(xml.slice(open, close + 7));
    idx = close + 7;
  }
  for (const pb of partBlocks) parts.push(parsePart(pb));

  // Determine divisions from first <attributes><divisions>
  let divisions = 1;
  for (const part of parts) {
    for (const m of part.measures) {
      // Re-fetch the raw XML for attributes? — we have to look at original. Cheap: regex scan.
      const re = /<divisions>(\d+)<\/divisions>/;
      const m2 = xml.match(re);
      if (m2) {
        divisions = parseInt(m2[1], 10);
        break;
      }
    }
    if (divisions !== 1) break;
  }

  // Build flat timeline
  const quarterSec = 60 / bpm;
  const divSec = quarterSec / divisions;
  const out: ScoreNote[] = [];
  let tCursorDiv = 0;
  let idx2 = 0;
  let measureNum = 1;

  for (const part of parts) {
    for (const m of part.measures) {
      measureNum = m.number;
      // Skip non-voice-1 for MVP
      for (const n of m.notes) {
        if (n.voice !== 1) continue;
        const startSec = tCursorDiv * divSec;
        const durationSec = n.durationDiv * divSec;
        if (n.kind === "note" && n.midi !== null) {
          out.push({
            index: idx2++,
            pitch: midiToName(n.midi),
            midi: n.midi,
            frequency: midiToFreq(n.midi),
            startSec,
            durationSec,
            voice: 1,
            measure: measureNum,
          });
        }
        tCursorDiv += n.durationDiv;
      }
    }
    break; // only first part
  }

  const durationSec = tCursorDiv * divSec;
  return { parts, notes: out, bpm, divisions, durationSec };
}

import { midiToFreq, midiToName } from "../music";
