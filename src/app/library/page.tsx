"use client";

import Link from "next/link";
import { Layout } from "@/components/Layout";
import { LIBRARY } from "@/lib/score/library";
import { formatTime } from "@/lib/music";
import { useI18n } from "@/lib/i18n";

export default function LibraryPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <section className="bg-violy-50 pt-12 pb-20">
        <div className="w-[min(calc(100%-2rem),84rem)] mx-auto">
          <div className="reveal in max-w-3xl">
            <p className="text-violy-500 text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("library.eyebrow")}</p>
            <h1 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-[-0.04em] text-violy-ink leading-[1.05]">
              {t("library.h1")}
            </h1>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-violy-ink-2 max-w-2xl">{t("library.body")}</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {LIBRARY.map((p, i) => (
              <Link
                key={p.id}
                href={`/practice/${p.id}`}
                className={`reveal reveal-d${(i % 3) + 1} in group relative rounded-[1.5rem] bg-white p-7 border border-violy-200/60 shadow-[0_0.5rem_1.5rem_rgba(23,52,86,0.05)] no-underline hover:-translate-y-0.5 hover:border-violy-400 transition-all`}
              >
                <div className="flex gap-1 mb-6">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex-1 h-px bg-violy-ink/35" />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-extrabold tracking-[0.06em] uppercase ${
                    p.level === "beginner" ? "bg-violy-mint/20 text-violy-700" :
                    p.level === "intermediate" ? "bg-violy-yellow/40 text-violy-ink" :
                    "bg-violy-peach/20 text-violy-peach"
                  }`}>{p.level}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-violy-100 text-violy-600 text-[0.65rem] font-extrabold tracking-[0.06em] uppercase">{p.instrument}</span>
                </div>

                <h2 className="mt-4 text-[1.4rem] font-extrabold tracking-[-0.03em] text-violy-ink leading-tight">{p.title}</h2>
                <p className="mt-1 text-[0.88rem] text-violy-ink-2">{p.composer}</p>

                <p className="mt-4 text-[0.92rem] leading-relaxed text-violy-ink-2">{p.blurb}</p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[0.78rem] text-violy-ink-2 font-semibold">
                    <span>{formatTime(p.durationSec)}</span>
                    <span className="text-violy-300">·</span>
                    <span>{p.defaultBpm} {t("library.tempo")}</span>
                  </div>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-violy-500 text-white group-hover:bg-violy-600 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
