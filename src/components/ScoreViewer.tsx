"use client";

import { useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import type { ScoreNote } from "@/lib/types";

interface Props {
  musicXml: string;
  /** Index of the currently active note (cursor). */
  activeNoteIndex: number;
  notes?: ScoreNote[];
}

/**
 * Renders MusicXML with OpenSheetMusicDisplay and shows a cursor that follows
 * the activeNoteIndex. We use OSMD's own cursor element rather than a custom
 * overlay — simpler and more reliable across versions.
 */
export function ScoreViewer({ musicXml, activeNoteIndex, notes }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const lastIndexRef = useRef<number>(-1);
  const sheetWidthRef = useRef<number>(0);

  // Init OSMD once per piece
  useEffect(() => {
    if (!containerRef.current) return;
    const osmd = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      backend: "svg",
      drawTitle: true,
      drawSubtitle: false,
      drawPartNames: false,
      drawingParameters: "default",
      followCursor: false,
    });
    osmdRef.current = osmd;
    let cancelled = false;
    osmd.load(musicXml).then(() => {
      if (cancelled) return;
      osmd.render();
      osmd.cursor.show();
      osmd.cursor.cursorElement.style.opacity = "1";
      // Make the cursor stand out
      const ce = osmd.cursor.cursorElement as unknown as HTMLElement;
      if (ce && ce.style) {
        ce.style.filter = "drop-shadow(0 0 6px rgba(47,127,245,0.85))";
      }
      // Cache sheet width for autoscroll
      const sheet = containerRef.current?.querySelector("svg") as SVGSVGElement | null;
      if (sheet) sheetWidthRef.current = sheet.clientWidth;
    }).catch((err) => {
      console.error("[OSMD] load failed", err);
    });
    return () => {
      cancelled = true;
      try {
        osmdRef.current?.clear();
      } catch {
        // ignore
      }
      osmdRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicXml]);

  // Move cursor when activeNoteIndex changes
  useEffect(() => {
    const osmd = osmdRef.current;
    if (!osmd || activeNoteIndex === lastIndexRef.current || activeNoteIndex < 0) return;

    // Reset and walk forward to the active note — simplest reliable way to seek in OSMD.
    // next() walks notes + rests; we use a separate voice-1 count via `notes` to find our target.
    const currentNotes = notes ?? [];
    if (!currentNotes.length) return;

    try {
      osmd.cursor.reset();
      // Walk until we are at activeNoteIndex-th voice-1 note. next() may also step over rests,
      // so we walk a bit ahead and then let OSMD's iterator handle it.
      for (let i = 0; i < activeNoteIndex; i++) {
        osmd.cursor.next();
      }
      lastIndexRef.current = activeNoteIndex;
    } catch (err) {
      // OSMD throws on out-of-range iterator moves; clamp quietly.
      return;
    }

    // Scroll horizontally so cursor stays centered.
    const sheet = containerRef.current?.querySelector("svg") as SVGSVGElement | null;
    const cursorEl = osmd.cursor.cursorElement as unknown as SVGGraphicsElement | null;
    if (sheet && cursorEl) {
      try {
        const cBox = cursorEl.getBBox();
        const sheetWidth = sheet.clientWidth || sheetWidthRef.current;
        const offsetX = cBox.x - sheetWidth / 2;
        if (offsetX > 0) {
          sheet.parentElement?.scrollBy({ left: offsetX, behavior: "smooth" });
        }
      } catch {
        // getBBox may throw if cursor isn't visible yet
      }
    }
  }, [activeNoteIndex, notes]);

  return (
    <div className="osmd-container">
      <div
        ref={containerRef}
        className="osmd-container-inner overflow-x-auto no-scrollbar"
        style={{ minHeight: 280 }}
      />
    </div>
  );
}
