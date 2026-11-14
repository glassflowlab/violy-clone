// Sample score library — embeds small public-domain pieces as MusicXML.
// Kept tiny and self-contained so the app has zero external assets at runtime.

import type { Piece } from "../types";

// ---- MusicXML strings --------------------------------------------------------

// Twinkle Twinkle Little Star — violin-friendly melody in G major.
// One octave (G4 to G5), simple 4/4. Each note = 1 quarter (divisions=2 → 1 half = 4 divs).
const TWINKLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <work><work-title>Twinkle Twinkle Little Star</work-title></work>
  <identification><creator type="composer">Traditional</creator></identification>
  <part-list>
    <score-part id="P1"><part-name>Violin</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>2</divisions>
        <key><fifths>1</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>100</per-minute></metronome></direction-type><sound tempo="100"/></direction>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="5">
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="6">
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="7">
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="8">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
  </part>
</score-partwise>`;

// Ode to Joy — Beethoven. C major, 4/4. Same conventions.
const ODE_TO_JOY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <work><work-title>Ode to Joy</work-title></work>
  <identification><creator type="composer">L. v. Beethoven</creator></identification>
  <part-list>
    <score-part id="P1"><part-name>Violin</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>2</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>96</per-minute></metronome></direction-type><sound tempo="96"/></direction>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>3</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><voice>1</voice><type>eighth</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <rest><duration>2</duration><voice>1</voice></rest>
    </measure>
    <measure number="5">
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="6">
      <note><pitch><step>A</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="7">
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>F</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="8">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>3</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>1</duration><voice>1</voice><type>eighth</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <rest><duration>2</duration><voice>1</voice></rest>
    </measure>
  </part>
</score-partwise>`;

// Mary Had a Little Lamb — for variety, mixed rhythm (quarter + eighth).
const MARY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <work><work-title>Mary Had a Little Lamb</work-title></work>
  <identification><creator type="composer">Traditional</creator></identification>
  <part-list>
    <score-part id="P1"><part-name>Violin</part-name></score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>2</divisions>
        <key><fifths>0</fifths></key>
        <time><beats>4</beats><beat-type>4</beat-type></time>
        <clef><sign>G</sign><line>2</line></clef>
      </attributes>
      <direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>110</per-minute></metronome></direction-type><sound tempo="110"/></direction>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="2">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>4</duration><voice>1</voice><type>half</type></note>
    </measure>
    <measure number="3">
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>4</duration><voice>1</voice><type>half</type></note>
    </measure>
    <measure number="4">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>G</step><octave>5</octave></pitch><duration>4</duration><voice>1</voice><type>half</type></note>
    </measure>
    <measure number="5">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>C</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
    <measure number="6">
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
      <note><pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><voice>1</voice><type>eighth</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>1</duration><voice>1</voice><type>eighth</type></note>
      <note><pitch><step>D</step><octave>5</octave></pitch><duration>2</duration><voice>1</voice><type>quarter</type></note>
    </measure>
  </part>
</score-partwise>`;

export const LIBRARY: Piece[] = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    composer: "Traditional",
    instrument: "violin",
    level: "beginner",
    durationSec: 0, // computed at parse-time below
    musicXml: TWINKLE_XML,
    defaultBpm: 100,
    blurb: "Eight bars of the most famous melody ever written. Easy, clean, and great for warming up.",
  },
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    composer: "Ludwig van Beethoven",
    instrument: "violin",
    level: "beginner",
    durationSec: 0,
    musicXml: ODE_TO_JOY_XML,
    defaultBpm: 96,
    blurb: "Beethoven's 9th — the universal theme. Steady quarter notes, perfect for pitch tracking.",
  },
  {
    id: "mary-lamb",
    title: "Mary Had a Little Lamb",
    composer: "Traditional",
    instrument: "violin",
    level: "intermediate",
    durationSec: 0,
    musicXml: MARY_XML,
    defaultBpm: 110,
    blurb: "Mixed rhythm with half and eighth notes. Pairs nicely with Twinkle for tempo variety.",
  },
];

import { parseMusicXml } from "./parser";

/** Fill durationSec on each library entry. Done once at module load. */
for (const piece of LIBRARY) {
  const parsed = parseMusicXml(piece.musicXml);
  piece.durationSec = parsed.durationSec;
}
