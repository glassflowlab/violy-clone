"use client";

// Dev-only helper that seeds sessionStorage with a fake audition result
// and navigates to /result so the UI can be visually verified without a mic.
//
// Visit /dev/seed-result to populate and redirect.

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuditionResult, NoteResult, ScoreNote } from "@/lib/types";
import { midiToFreq, midiToName } from "@/lib/music";

function makeResult(): AuditionResult {
  const notes: ScoreNote[] = [];
  const t0 = 0;
  let cursorDiv = 0;
  const divisions = 2;
  const quarterSec = 60 / 100;
  const divSec = quarterSec / divisions;
  // Build a 16-note melody (1 octave scale)
  const midis = [62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 74, 72, 71, 69, 67];
  midis.forEach((m, i) => {
    notes.push({
      index: i,
      pitch: midiToName(m),
      midi: m,
      frequency: midiToFreq(m),
      startSec: cursorDiv * divSec,
      durationSec: 2 * divSec,
      voice: 1,
      measure: Math.floor(i / 4) + 1,
    });
    cursorDiv += 2;
  });
  const durationSec = notes[notes.length - 1].startSec + notes[notes.length - 1].durationSec;

  const noteResults: NoteResult[] = notes.map((n, i) => {
    const detMidi = i === 7 ? n.midi + 1 : i === 11 ? n.midi - 1 : n.midi;
    const expectedMidi = n.midi;
    const detected = {
      timeSec: n.startSec + 0.02,
      frequency: midiToFreq(detMidi),
      midi: detMidi,
      clarity: 0.94,
      rms: 0.05,
    };
    const pitchOffset = detMidi !== null ? (detMidi - expectedMidi) * 100 : null;
    const timeOffset = i === 3 ? 0.15 : i === 9 ? -0.08 : 0.02;
    const hit = i !== 5;
    const score = hit ? (i === 7 || i === 11 ? 55 : 88) : 0;
    return {
      scoreNoteIndex: i,
      expected: n,
      detected: hit ? detected : null,
      pitchOffsetCents: pitchOffset,
      timeOffsetSec: hit ? timeOffset : null,
      score,
      hit,
    };
  });

  const pitchCurve: AuditionResult["pitchCurve"] = [];
  const windowSec = 0.1;
  for (let t = 0; t <= durationSec; t += windowSec) {
    const expected = notes.find((n) => n.startSec <= t && n.startSec + n.durationSec > t);
    const expectedMidi = expected?.midi ?? null;
    // Simulated offset curve — mostly close, with a couple of bad spots
    let detectedMidi = expectedMidi;
    let offsetCents = 0;
    if (expectedMidi !== null) {
      const idx = notes.findIndex((n) => n.startSec <= t && n.startSec + n.durationSec > t);
      if (idx === 7) {
        detectedMidi = expectedMidi + 1;
        offsetCents = 100;
      } else if (idx === 11) {
        detectedMidi = expectedMidi - 1;
        offsetCents = -100;
      } else {
        // Small noise
        const noise = Math.sin(t * 7) * 8;
        offsetCents = noise;
        detectedMidi = Math.round(expectedMidi + noise / 100);
      }
    }
    pitchCurve.push({ timeSec: t, expectedMidi, detectedMidi, offsetCents });
  }

  return {
    pieceId: "twinkle",
    timestamp: Date.now(),
    tempoMultiplier: 1,
    durationSec,
    pitchScore: 78,
    rhythmScore: 84,
    noteResults,
    pitchCurve,
  };
}

export default function SeedResultPage() {
  const router = useRouter();
  useEffect(() => {
    try {
      const result = makeResult();
      const key = `violy:result:${result.timestamp}`;
      sessionStorage.setItem(key, JSON.stringify(result));
      sessionStorage.setItem("violy:lastResult", key);
      router.replace("/result");
    } catch {
      // ignore
    }
  }, [router]);
  return (
    <div className="min-h-screen grid place-items-center bg-violy-50">
      <div className="text-violy-ink-2 font-semibold">Seeding result…</div>
    </div>
  );
}
