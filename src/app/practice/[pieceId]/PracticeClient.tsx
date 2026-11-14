"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { ScoreViewer } from "@/components/ScoreViewer";
import { LIBRARY } from "@/lib/score/library";
import { usePracticeEngine } from "@/lib/audio/scoring";
import { PlaybackEngine, type PlaybackPhase } from "@/lib/audio/playback";
import { centsBetween, formatTime, midiToName } from "@/lib/music";
import { parseMusicXml } from "@/lib/score/parser";
import { useI18n } from "@/lib/i18n";

type DemoPhase = "idle" | "loading" | "playing" | "stopped" | "error";

export default function PracticeClient({ pieceId }: { pieceId: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const piece = useMemo(() => LIBRARY.find((p) => p.id === pieceId), [pieceId]);

  const [tempo, setTempo] = useState(1);
  const { state, start, stop } = usePracticeEngine({ piece: piece!, tempo });

  // Demo playback state
  const [demoPhase, setDemoPhase] = useState<DemoPhase>("idle");
  const [demoNoteIndex, setDemoNoteIndex] = useState(0);
  const [demoElapsed, setDemoElapsed] = useState(0);
  const [demoError, setDemoError] = useState<string | null>(null);
  const playbackRef = useRef<PlaybackEngine | null>(null);

  // Lazy init the engine on first use
  const getEngine = useCallback(() => {
    if (!playbackRef.current) {
      const e = new PlaybackEngine();
      e.onPhase((p) => {
        setDemoPhase(p as DemoPhase);
        if (p === "error") setDemoError("Failed to load violin samples — check network");
      });
      playbackRef.current = e;
    }
    return playbackRef.current;
  }, []);

  // Cleanup on unmount / piece change
  useEffect(() => {
    return () => {
      playbackRef.current?.dispose();
      playbackRef.current = null;
    };
  }, [pieceId]);

  // When audition finishes, navigate to Result
  useEffect(() => {
    if (state.phase === "done" && state.result) {
      try {
        const key = `violy:result:${state.result.timestamp}`;
        sessionStorage.setItem(key, JSON.stringify(state.result));
        sessionStorage.setItem("violy:lastResult", key);
      } catch {
        // ignore
      }
      router.push("/result");
    }
  }, [state.phase, state.result, router]);

  // Determine which cursor index to display
  // Demo wins while playing; otherwise audition
  const activeNoteIndex = demoPhase === "playing" ? demoNoteIndex : state.currentNoteIndex;
  const elapsed = demoPhase === "playing" ? demoElapsed : state.elapsed;
  const duration = useMemo(() => {
    if (!piece) return 0;
    const parsed = parseMusicXml(piece.musicXml);
    return parsed.durationSec / tempo;
  }, [piece, tempo]);

  const handleDemoToggle = useCallback(async () => {
    if (!piece) return;
    const engine = getEngine();
    if (demoPhase === "playing") {
      engine.stop();
      setDemoPhase("stopped");
      return;
    }
    setDemoError(null);
    setDemoNoteIndex(0);
    setDemoElapsed(0);
    const parsed = parseMusicXml(piece.musicXml);
    try {
      await engine.start(
        piece.id,
        parsed.notes,
        tempo,
        (el, idx) => {
          setDemoElapsed(el);
          setDemoNoteIndex(idx);
        }
      );
    } catch (err) {
      setDemoError((err as Error).message || "Playback failed");
      setDemoPhase("error");
    }
  }, [demoPhase, getEngine, piece, tempo]);

  if (!piece) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-32 text-center">
          <h1 className="text-2xl font-extrabold text-violy-ink">{t("practice.notfound.title")}</h1>
          <p className="mt-3 text-violy-ink-2">{t("practice.notfound.body")}</p>
          <Link href="/library" className="mt-6 inline-flex px-5 py-3 rounded-full bg-violy-500 text-white font-bold no-underline">
            {t("practice.notfound.cta")}
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-violy-50 pt-8 pb-16">
        <div className="w-[min(calc(100%-2rem),84rem)] mx-auto">
          <Link href="/library" className="inline-flex items-center gap-1 text-[0.85rem] text-violy-ink-2 no-underline hover:text-violy-500 font-semibold">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("practice.back")}
          </Link>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[clamp(1.7rem,3vw,2.4rem)] font-extrabold tracking-[-0.035em] text-violy-ink leading-tight">
                {piece.title}
              </h1>
              <p className="mt-1 text-violy-ink-2 text-[0.95rem]">{piece.composer} · {piece.defaultBpm} {t("library.tempo")}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-[0.85rem] font-semibold text-violy-ink-2">
                {t("practice.tempo")}
                <select
                  value={tempo}
                  onChange={(e) => setTempo(parseFloat(e.target.value))}
                  disabled={state.phase === "running" || state.phase === "starting" || demoPhase === "playing"}
                  className="px-3 py-1.5 rounded-full border border-violy-200 bg-white text-violy-ink font-bold text-[0.85rem]"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <ScoreViewer musicXml={piece.musicXml} activeNoteIndex={activeNoteIndex} />
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <LivePanel state={state} duration={duration} elapsed={elapsed} demoPhase={demoPhase} />
            <ControlPanel
              state={state}
              start={start}
              stop={stop}
              piece={piece}
              demoPhase={demoPhase}
              demoError={demoError}
              onDemoToggle={handleDemoToggle}
            />
          </div>

          {state.phase === "error" && (
            <div className="mt-6 rounded-2xl bg-violy-peach/15 border border-violy-peach/40 p-5 text-violy-ink">
              <strong className="block font-extrabold">{t("practice.mic.fail.title")}</strong>
              <span className="block text-[0.92rem] mt-1">{t("practice.mic.fail.body", { error: state.error ?? "" })}</span>
            </div>
          )}
          {demoPhase === "error" && (
            <div className="mt-6 rounded-2xl bg-violy-peach/15 border border-violy-peach/40 p-5 text-violy-ink">
              <strong className="block font-extrabold">{t("practice.demo.fail.title")}</strong>
              <span className="block text-[0.92rem] mt-1">{t("practice.demo.fail.body", { error: demoError ?? "" })}</span>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

function LivePanel({
  state,
  duration,
  elapsed,
  demoPhase,
}: {
  state: ReturnType<typeof usePracticeEngine>["state"];
  duration: number;
  elapsed: number;
  demoPhase: DemoPhase;
}) {
  const { t } = useI18n();
  const liveMidi = state.live?.midi ?? null;
  const expectedMidi = state.currentNoteMidi;
  const isDemo = demoPhase === "playing" || demoPhase === "loading";

  return (
    <div className="rounded-[1.5rem] bg-white border border-violy-200/60 p-6 shadow-[0_0.5rem_1.5rem_rgba(23,52,86,0.05)]">
      <div className="flex items-center justify-between">
        <span className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">
          {isDemo ? t("practice.demo.label") : t("practice.live.label")}
        </span>
        <span className="text-[0.78rem] text-violy-ink-2 font-bold tabular-nums">{formatTime(elapsed)} / {formatTime(duration)}</span>
      </div>

      <div className="mt-3 h-2 bg-violy-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-[width] duration-100 ${isDemo ? "bg-violy-yellow" : "bg-violy-500"}`}
          style={{ width: `${Math.min(100, (elapsed / duration) * 100)}%` }}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">{t("practice.live.pitch")}</div>
            <div className="mt-2 text-[2.2rem] font-extrabold leading-none text-violy-ink tracking-[-0.04em] tabular-nums">
              {liveMidi !== null ? midiToName(Math.round(liveMidi)) : "—"}
            </div>
            <div className="mt-1 text-[0.85rem] text-violy-ink-2 font-semibold">
              {state.live && state.live.frequency ? `${state.live.frequency.toFixed(1)} Hz` : t("practice.live.listening")}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">{t("practice.live.expected")}</div>
            <div className="mt-2 text-[2.2rem] font-extrabold leading-none text-violy-500 tracking-[-0.04em] tabular-nums">
              {expectedMidi !== null ? midiToName(expectedMidi) : "—"}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2 mb-2">{t("practice.cents")}</div>
          <div className="relative h-10 rounded-full bg-violy-100 overflow-hidden">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-violy-ink/40" />
            {liveMidi !== null && expectedMidi !== null && (
              <div
                className="absolute top-0 bottom-0 w-1.5 bg-violy-500 rounded-full pitch-bar"
                style={{
                  left: `calc(50% + ${Math.max(-50, Math.min(50, centsBetween(liveMidi, expectedMidi))) * 0.85}%)`,
                  transform: "translateX(-50%)",
                }}
              />
            )}
          </div>
          <div className="mt-1 flex justify-between text-[0.72rem] font-bold text-violy-ink-2">
            <span>{t("practice.cents.flat")}</span>
            <span>0</span>
            <span>{t("practice.cents.sharp")}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2 mb-2">{t("practice.mic")}</div>
          <div className="flex items-end gap-[2px] h-10">
            {state.loudness.length === 0 ? (
              Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="flex-1 bg-violy-100 rounded-full" style={{ height: "20%" }} />
              ))
            ) : (
              state.loudness.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 bg-violy-300 rounded-full transition-[height] duration-75"
                  style={{ height: `${Math.min(100, v * 350)}%` }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlPanel({
  state,
  start,
  stop,
  piece,
  demoPhase,
  demoError,
  onDemoToggle,
}: {
  state: ReturnType<typeof usePracticeEngine>["state"];
  start: () => Promise<void>;
  stop: () => void;
  piece: { id: string; title: string; durationSec: number; defaultBpm: number };
  demoPhase: DemoPhase;
  demoError: string | null;
  onDemoToggle: () => Promise<void>;
}) {
  const { t } = useI18n();
  const running = state.phase === "running" || state.phase === "starting";
  const demoLoading = demoPhase === "loading";
  const demoPlaying = demoPhase === "playing";
  const statusKey =
    demoPlaying ? "practice.status.demo.playing" :
    demoLoading ? "practice.status.demo.loading" :
    state.phase === "idle" ? "practice.status.ready" :
    state.phase === "starting" ? "practice.status.starting" :
    state.phase === "running" ? "practice.status.running" :
    state.phase === "finishing" ? "practice.status.finishing" :
    state.phase === "done" ? "practice.status.done" :
    state.phase === "error" ? "practice.status.error" : "practice.status.ready";

  return (
    <div className="rounded-[1.5rem] bg-violy-ink text-white p-6 shadow-[0_1rem_2rem_rgba(23,52,86,0.15)] relative overflow-hidden">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-violy-500/30 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className={`inline-flex w-2.5 h-2.5 rounded-full ${demoPlaying ? "bg-violy-yellow animate-pulse" : running ? "bg-violy-mint animate-pulse" : "bg-violy-300"}`} />
          <span className="text-[0.78rem] font-extrabold tracking-[0.08em] uppercase text-violy-100/80">
            {t(statusKey)}
          </span>
        </div>

        <h3 className="mt-4 text-[1.4rem] font-extrabold tracking-[-0.03em] leading-tight">
          {demoPlaying
            ? t("practice.demo.playing.hint")
            : running
              ? t("practice.cta.start.hint")
              : t("practice.cta.stop.hint")}
        </h3>
        <p className="mt-3 text-[0.92rem] text-violy-100/85 leading-relaxed">
          {demoPlaying
            ? t("practice.demo.playing.body")
            : running
              ? t("practice.cta.stop.body")
              : t("practice.cta.start.body")}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-[0.78rem] text-violy-100/80">
          <div className="rounded-xl bg-white/5 p-3 border border-white/10">
            <div className="font-bold text-white">{piece.defaultBpm} {t("library.tempo")}</div>
            <div>{t("practice.bpm.label")}</div>
          </div>
          <div className="rounded-xl bg-white/5 p-3 border border-white/10">
            <div className="font-bold text-white">{formatTime(piece.durationSec)}</div>
            <div>{t("practice.length.label")}</div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {/* Demo button */}
          {!demoPlaying && !demoLoading && (
            <button
              onClick={onDemoToggle}
              disabled={running}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-violy-ink font-extrabold text-[0.95rem] border border-violy-200 hover:bg-violy-100 disabled:opacity-60"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              {t("practice.demo.play")}
            </button>
          )}
          {demoLoading && (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white font-extrabold text-[0.95rem] border border-white/20 cursor-wait"
            >
              <span className="w-2 h-2 rounded-full bg-violy-yellow animate-pulse" />
              {t("practice.demo.loading")}
            </button>
          )}
          {demoPlaying && (
            <button
              onClick={onDemoToggle}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-violy-yellow text-violy-ink font-extrabold text-[0.95rem] border-0 hover:bg-violy-yellow-2"
            >
              <span className="w-2 h-2 rounded-full bg-violy-peach" />
              {t("practice.demo.stop")}
            </button>
          )}

          {/* Audition button */}
          {!running && !demoPlaying && !demoLoading && (
            <button
              onClick={start}
              disabled={state.phase === "finishing"}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-violy-yellow text-violy-ink font-extrabold text-[1rem] border-0 hover:bg-violy-yellow-2 disabled:opacity-60"
            >
              <span className="w-2 h-2 rounded-full bg-violy-peach" />
              {t("practice.cta.start")}
            </button>
          )}
          {running && (
            <button
              onClick={stop}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-violy-peach text-white font-extrabold text-[1rem] border-0 hover:opacity-90"
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              {t("practice.cta.stop")}
            </button>
          )}

          <p className="text-[0.7rem] text-violy-100/60 text-center">{t("practice.tip")}</p>
        </div>
      </div>
    </div>
  );
}