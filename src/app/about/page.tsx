"use client";

import { Layout } from "@/components/Layout";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <section className="bg-violy-50 pt-12 pb-20">
        <div className="w-[min(calc(100%-2rem),80rem)] mx-auto max-w-3xl">
          <p className="text-violy-500 text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("about.eyebrow")}</p>
          <h1 className="mt-3 text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-[-0.04em] text-violy-ink leading-[1.05]">
            {t("about.h1")}
          </h1>

          <div className="mt-10 space-y-8 text-[1.05rem] leading-relaxed text-violy-ink-2">
            <div>
              <h2 className="text-[1.4rem] font-extrabold tracking-[-0.025em] text-violy-ink mb-3">{t("about.s1.h")}</h2>
              <p>{t("about.s1.p")}</p>
            </div>
            <div>
              <h2 className="text-[1.4rem] font-extrabold tracking-[-0.025em] text-violy-ink mb-3">{t("about.s2.h")}</h2>
              <p>{t("about.s2.p", { lib: "pitchy" })}</p>
            </div>
            <div>
              <h2 className="text-[1.4rem] font-extrabold tracking-[-0.025em] text-violy-ink mb-3">{t("about.s3.h")}</h2>
              <p>{t("about.s3.p")}</p>
            </div>
            <div>
              <h2 className="text-[1.4rem] font-extrabold tracking-[-0.025em] text-violy-ink mb-3">{t("about.s4.h")}</h2>
              <p>{t("about.s4.p")}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
