"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { LIBRARY } from "@/lib/score/library";
import type { AuditionResult } from "@/lib/types";
import { formatTime, midiToName } from "@/lib/music";
import { useI18n } from "@/lib/i18n";

export default function ResultPage() {
  const { t } = useI18n();
  const [result, setResult] = useState<AuditionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const key = sessionStorage.getItem("violy:lastResult");
      if (!key) {
        setError(t("result.empty.body"));
        return;
      }
      const raw = sessionStorage.getItem(key);
      if (!raw) {
        setError(t("result.empty.body"));
        return;
      }
      setResult(JSON.parse(raw) as AuditionResult);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [t]);

  if (error) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-32 text-center">
          <h1 className="text-2xl font-extrabold text-violy-ink">{t("result.empty.title")}</h1>
          <p className="mt-3 text-violy-ink-2">{error}</p>
          <Link href="/library" className="mt-6 inline-flex px-5 py-3 rounded-full bg-violy-500 text-white font-bold no-underline">
            {t("result.empty.cta")}
          </Link>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto py-32 text-center text-violy-ink-2">{t("loading")}</div>
      </Layout>
    );
  }

  const piece = LIBRARY.find((p) => p.id === result.pieceId);

  return (
    <Layout>
      <section className="bg-violy-50 pt-8 pb-16">
        <div className="w-[min(calc(100%-2rem),84rem)] mx-auto">
          <Link href="/library" className="inline-flex items-center gap-1 text-[0.85rem] text-violy-ink-2 no-underline hover:text-violy-500 font-semibold">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t("result.back")}
          </Link>

          <div className="mt-4 reveal in">
            <p className="text-violy-500 text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("result.eyebrow")}</p>
            <h1 className="mt-2 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold tracking-[-0.035em] text-violy-ink leading-tight">
              {piece?.title ?? "Practice"}
            </h1>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ScoreCard label={t("result.score.pitch")} value={result.pitchScore} hint={t("result.score.pitch.hint")} tone="blue" />
            <ScoreCard label={t("result.score.rhythm")} value={result.rhythmScore} hint={t("result.score.rhythm.hint")} tone="peach" />
            <ScoreCard
              label={t("result.score.duration")}
              value={null}
              hint={t("result.score.duration.hint", { duration: formatTime(result.durationSec), tempo: String(result.tempoMultiplier) })}
              tone="ink"
            />
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-white border border-violy-200/60 p-6 shadow-[0_0.5rem_1.5rem_rgba(23,52,86,0.05)]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">{t("result.curve.label")}</p>
                <h2 className="mt-1 text-[1.2rem] font-extrabold tracking-[-0.025em] text-violy-ink">{t("result.curve.heading")}</h2>
              </div>
              <div className="flex items-center gap-3 text-[0.78rem] font-semibold text-violy-ink-2">
                <Legend color="bg-violy-500" label={t("result.curve.detected")} />
                <Legend color="bg-violy-yellow" label={t("result.curve.expected")} />
                <Legend color="bg-violy-peach/70" label={t("result.curve.oof")} />
              </div>
            </div>
            <PitchCurve curve={result.pitchCurve} />
          </div>

          <div className="mt-8 rounded-[1.5rem] bg-white border border-violy-200/60 p-6 shadow-[0_0.5rem_1.5rem_rgba(23,52,86,0.05)]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">{t("result.notes.label")}</p>
                <h2 className="mt-1 text-[1.2rem] font-extrabold tracking-[-0.025em] text-violy-ink">{t("result.notes.heading")}</h2>
              </div>
              <div className="text-[0.85rem] text-violy-ink-2 font-semibold">
                {t("result.notes.count", { hit: result.noteResults.filter((r) => r.hit).length, total: result.noteResults.length })}
              </div>
            </div>
            <div className="mt-5 overflow-x-auto no-scrollbar">
              <table className="w-full text-[0.88rem]">
                <thead>
                  <tr className="text-left text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">
                    <th className="px-3 py-2">{t("result.notes.col.idx")}</th>
                    <th className="px-3 py-2">{t("result.notes.col.expected")}</th>
                    <th className="px-3 py-2">{t("result.notes.col.detected")}</th>
                    <th className="px-3 py-2">{t("result.notes.col.pitch")}</th>
                    <th className="px-3 py-2">{t("result.notes.col.time")}</th>
                    <th className="px-3 py-2">{t("result.notes.col.score")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.noteResults.map((r, i) => {
                    const detectedName = r.detected?.midi !== null && r.detected?.midi !== undefined ? midiToName(r.detected.midi) : "—";
                    const offsetColor = !r.hit ? "text-violy-peach" :
                      r.pitchOffsetCents === null ? "text-violy-ink-2" :
                      Math.abs(r.pitchOffsetCents) <= 15 ? "text-violy-700" :
                      Math.abs(r.pitchOffsetCents) <= 30 ? "text-violy-yellow-2" :
                      "text-violy-peach";
                    return (
                      <tr key={i} className="border-t border-violy-100">
                        <td className="px-3 py-2.5 font-semibold text-violy-ink-2 tabular-nums">{i + 1}</td>
                        <td className="px-3 py-2.5 font-extrabold text-violy-ink">{r.expected.pitch}</td>
                        <td className="px-3 py-2.5 font-bold text-violy-ink-2">{detectedName}</td>
                        <td className={`px-3 py-2.5 font-bold tabular-nums ${offsetColor}`}>
                          {r.pitchOffsetCents !== null ? `${r.pitchOffsetCents > 0 ? "+" : ""}${r.pitchOffsetCents.toFixed(0)}¢` : "—"}
                        </td>
                        <td className="px-3 py-2.5 font-bold tabular-nums text-violy-ink-2">
                          {r.timeOffsetSec !== null ? `${r.timeOffsetSec > 0 ? "+" : ""}${(r.timeOffsetSec * 1000).toFixed(0)}ms` : "—"}
                        </td>
                        <td className="px-3 py-2.5 font-extrabold tabular-nums">
                          <span className={`inline-block min-w-[3rem] text-center px-2 py-0.5 rounded-full ${
                            r.score >= 90 ? "bg-violy-mint/20 text-violy-700" :
                            r.score >= 70 ? "bg-violy-yellow/30 text-violy-ink" :
                            r.score > 0 ? "bg-violy-peach/20 text-violy-peach" :
                            "bg-violy-100 text-violy-ink-2"
                          }`}>
                            {r.score > 0 ? Math.round(r.score) : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {piece && (
              <Link href={`/practice/${piece.id}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-violy-500 text-white font-extrabold text-[0.95rem] no-underline hover:bg-violy-600">
                {t("result.cta.again")}
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
            )}
            <Link href="/library" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-violy-ink font-bold text-[0.95rem] no-underline border border-violy-200 hover:bg-violy-100">
              {t("result.cta.another")}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function ScoreCard({ label, value, hint, tone }: { label: string; value: number | null; hint: string; tone: "blue" | "peach" | "ink" }) {
  const toneClass =
    tone === "blue" ? "bg-violy-500 text-white" :
    tone === "peach" ? "bg-violy-peach text-white" :
    "bg-violy-ink text-white";
  return (
    <div className={`rounded-[1.5rem] p-6 shadow-[0_0.85rem_2rem_rgba(23,52,86,0.1)] ${toneClass} relative overflow-hidden`}>
      <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-3xl" />
      <div className="relative">
        <div className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase opacity-80">{label}</div>
        {value !== null ? (
          <div className="mt-3 flex items-baseline gap-2 score-pop">
            <span className="text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums">{value}</span>
            <span className="text-[1.1rem] font-bold opacity-80">/ 100</span>
          </div>
        ) : (
          <div className="mt-3 text-[2.2rem] font-extrabold leading-none tracking-[-0.04em]">{hint.split(" ")[0]}</div>
        )}
        <div className="mt-3 text-[0.92rem] opacity-90">{value !== null ? hint : hint}</div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
      <span>{label}</span>
    </span>
  );
}

function PitchCurve({ curve }: { curve: AuditionResult["pitchCurve"] }) {
  const w = 800;
  const h = 220;
  const padding = 28;
  const xStep = (w - padding * 2) / Math.max(1, curve.length - 1);
  const maxAbs = 50;

  function toY(cents: number | null): number {
    if (cents === null || isNaN(cents)) return h - padding;
    const clamped = Math.max(-maxAbs, Math.min(maxAbs, cents));
    const norm = (clamped + maxAbs) / (maxAbs * 2);
    return h - padding - norm * (h - padding * 2);
  }

  const detectedPath: string[] = [];
  curve.forEach((p, i) => {
    if (p.detectedMidi !== null && p.offsetCents !== null) {
      const x = padding + i * xStep;
      const y = toY(p.offsetCents);
      detectedPath.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  });

  const badDots: Array<{ x: number; y: number; key: number }> = [];
  curve.forEach((p, i) => {
    if (p.offsetCents !== null && Math.abs(p.offsetCents) > 30) {
      badDots.push({ key: i, x: padding + i * xStep, y: toY(p.offsetCents) });
    }
  });

  const y0 = toY(0);
  const y30 = toY(30);
  const yn30 = toY(-30);

  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <line x1={padding} x2={w - padding} y1={y0} y2={y0} stroke="#2f7ff5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        <line x1={padding} x2={w - padding} y1={y30} y2={y30} stroke="#b9d8fb" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
        <line x1={padding} x2={w - padding} y1={yn30} y2={yn30} stroke="#b9d8fb" strokeWidth="1" strokeDasharray="2 4" opacity="0.7" />
        <text x={padding - 4} y={y0 + 4} textAnchor="end" fontSize="11" fill="#516b85" fontWeight="700">0¢</text>
        <text x={padding - 4} y={y30 + 4} textAnchor="end" fontSize="11" fill="#516b85">+30¢</text>
        <text x={padding - 4} y={yn30 + 4} textAnchor="end" fontSize="11" fill="#516b85">-30¢</text>
        <path d={detectedPath.join(" ")} fill="none" stroke="#2f7ff5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {badDots.map((d) => (
          <circle key={d.key} cx={d.x} cy={d.y} r="3.5" fill="#ff806c" fillOpacity="0.7" />
        ))}
      </svg>
    </div>
  );
}
