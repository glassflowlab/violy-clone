"use client";

import Link from "next/link";
import { Layout } from "@/components/Layout";
import { useI18n } from "@/lib/i18n";

export default function HistoryPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <section className="bg-violy-50 pt-12 pb-20">
        <div className="w-[min(calc(100%-2rem),80rem)] mx-auto max-w-3xl text-center">
          <p className="text-violy-500 text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("history.eyebrow")}</p>
          <h1 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold tracking-[-0.04em] text-violy-ink leading-[1.05]">
            {t("history.h1")}
          </h1>
          <p className="mt-5 text-[1.05rem] text-violy-ink-2 max-w-xl mx-auto">
            {t("history.body", { storage: "sessionStorage" })}
          </p>
          <Link href="/library" className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-violy-500 text-white font-extrabold text-[0.95rem] no-underline hover:bg-violy-600">
            {t("history.cta")}
          </Link>
        </div>
      </section>
    </Layout>
  );
}
