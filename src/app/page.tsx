"use client";

import Link from "next/link";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();
  return (
    <Layout>
      <section className="relative overflow-hidden bg-violy-50">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-violy-100 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-violy-yellow/20 blur-3xl" />

        <div className="relative w-[min(calc(100%-2rem),84rem)] py-24 mx-auto grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="reveal in">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violy-100 border border-violy-200 text-violy-600 text-[0.78rem] font-bold">
              <span className="w-2 h-2 rounded-full bg-violy-500 animate-pulse" />
              {t("home.badge")}
            </span>
            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.2rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-violy-ink">
              {t("home.h1.a")}
              <br />
              <span className="text-violy-500">{t("home.h1.b")}</span>
            </h1>
            <p className="mt-6 max-w-xl text-[1.08rem] leading-[1.65] text-violy-ink-2">{t("home.body")}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/library"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-violy-ink text-white font-extrabold text-[0.95rem] no-underline shadow-[0_0.5rem_1.4rem_rgba(23,52,86,0.2)] hover:bg-violy-700"
              >
                {t("home.cta.primary")}
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-violy-ink font-bold text-[0.95rem] no-underline border border-violy-200 hover:bg-violy-100"
              >
                {t("home.cta.secondary")}
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-violy-ink text-[0.92rem] font-semibold">
              <li className="flex items-center gap-2">
                <span className="text-violy-500">✓</span> {t("home.bullet.feedback")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violy-500">✓</span> {t("home.bullet.scores")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violy-500">✓</span> {t("home.bullet.lessons")}
              </li>
            </ul>
          </div>

          {/* Hero preview */}
          <div className="reveal reveal-d1 in relative">
            <div className="relative rounded-[2rem] bg-white p-8 shadow-[0_1.5rem_3rem_rgba(23,52,86,0.1)] border border-violy-200/60">
              <div className="flex flex-col gap-3">
                <div className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">{t("home.preview.label")}</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[3.5rem] font-extrabold leading-none text-violy-ink tracking-[-0.04em]">92</span>
                  <span className="text-[1.1rem] font-bold text-violy-ink-2">{t("home.preview.score")}</span>
                </div>
                <div className="text-[0.95rem] text-violy-ink-2">{t("home.preview.hint")}</div>
              </div>

              {/* Mini staff preview */}
              <div className="mt-6 flex flex-col gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-px bg-violy-ink/40 relative">
                    <span className="absolute -left-3 top-1/2 -translate-y-1/2 text-violy-ink text-[1rem]">𝄞</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-violy-mint/20 text-violy-ink">
                <span className="grid place-items-center w-5 h-5 rounded-full bg-violy-mint text-white font-bold text-[0.7rem]">✓</span>
                <div className="leading-tight">
                  <strong className="block text-[0.85rem] font-extrabold">{t("home.preview.rhythm.title")}</strong>
                  <small className="block text-[0.7rem] text-violy-ink-2">{t("home.preview.rhythm.hint")}</small>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-2xl bg-violy-yellow shadow-[0_0.5rem_1rem_rgba(131,101,17,0.25)]" />
          </div>
        </div>
      </section>

      <FeatureGrid />

      <section className="bg-violy-50 py-20">
        <div className="w-[min(calc(100%-2rem),80rem)] mx-auto">
          <div className="reveal in rounded-[2rem] bg-violy-ink p-10 md:p-14 text-white relative overflow-hidden">
            <div className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-violy-500/30 blur-3xl" />
            <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
              <div>
                <p className="text-violy-yellow text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("home.cta.label")}</p>
                <h2 className="mt-4 text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
                  {t("home.cta.heading")}
                </h2>
                <p className="mt-4 text-violy-100/90 text-[1rem] max-w-md">{t("home.cta.body")}</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-violy-yellow text-violy-ink font-extrabold text-[0.95rem] no-underline hover:bg-violy-yellow-2"
                >
                  {t("home.cta.library")}
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 text-white font-bold text-[0.95rem] no-underline border border-white/20 hover:bg-white/15"
                >
                  {t("home.cta.read")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function FeatureGrid() {
  const { t } = useI18n();
  const items = [
    {
      tone: "tone-blue" as const,
      tag: "home.feature.listen.tag",
      title: "home.feature.listen.title",
      body: "home.feature.listen.body",
    },
    {
      tone: "tone-peach" as const,
      tag: "home.feature.follow.tag",
      title: "home.feature.follow.title",
      body: "home.feature.follow.body",
    },
    {
      tone: "tone-mint" as const,
      tag: "home.feature.connect.tag",
      title: "home.feature.connect.title",
      body: "home.feature.connect.body",
    },
    {
      tone: "tone-yellow" as const,
      tag: "home.feature.understand.tag",
      title: "home.feature.understand.title",
      body: "home.feature.understand.body",
    },
  ];
  return (
    <section className="bg-violy-50 py-16">
      <div className="w-[min(calc(100%-2rem),84rem)] mx-auto">
        <div className="reveal in flex items-end justify-between gap-6 mb-10 flex-wrap">
          <div>
            <p className="text-violy-500 text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("home.feature.label")}</p>
            <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold tracking-[-0.04em] text-violy-ink max-w-2xl">
              {t("home.feature.heading")}
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((it, i) => (
            <article
              key={it.title}
              className={`reveal reveal-d${(i % 4) + 1} in rounded-[1.5rem] bg-white p-7 border border-violy-200/60 shadow-[0_0.5rem_1.5rem_rgba(23,52,86,0.05)] hover:-translate-y-0.5 transition-transform`}
            >
              <span className={`inline-grid place-items-center w-11 h-11 rounded-xl text-[1.4rem] mb-5 ${
                it.tone === "tone-blue" ? "bg-violy-100 text-violy-500" :
                it.tone === "tone-peach" ? "bg-violy-peach/15 text-violy-peach" :
                it.tone === "tone-mint" ? "bg-violy-mint/15 text-violy-700" :
                "bg-violy-yellow/30 text-violy-ink"
              }`}>♪</span>
              <p className="text-[0.7rem] font-extrabold tracking-[0.13em] uppercase text-violy-ink-2">{t(it.tag)}</p>
              <h3 className="mt-3 text-[1.18rem] font-extrabold tracking-[-0.025em] text-violy-ink leading-snug">{t(it.title)}</h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-violy-ink-2">{t(it.body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
