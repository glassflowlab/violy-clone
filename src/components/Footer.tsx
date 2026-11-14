"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-violy-100 text-violy-ink-2 border-t border-violy-200/60">
      <div className="w-[min(calc(100%-2rem),80rem)] py-12 mx-auto grid gap-12 md:grid-cols-3">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 no-underline text-violy-ink font-extrabold text-xl">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-violy-500 text-white font-extrabold text-lg shadow-[0_0.65rem_1.4rem_rgba(47,127,245,0.18)]">V</span>
            Violy
          </Link>
          <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed">{t("footer.body")}</p>
          <a className="mt-4 inline-block text-violy-500 text-[0.85rem] font-bold no-underline" href="mailto:support@violy.app">
            {t("footer.contact")}
          </a>
        </div>
        <div>
          <p className="m-0 mb-5 text-violy-ink text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("footer.explore")}</p>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/library" className="text-violy-ink-2 text-[0.9rem] font-semibold no-underline hover:text-violy-500">{t("nav.library")}</Link>
            <Link href="/history" className="text-violy-ink-2 text-[0.9rem] font-semibold no-underline hover:text-violy-500">{t("nav.history")}</Link>
            <Link href="/about" className="text-violy-ink-2 text-[0.9rem] font-semibold no-underline hover:text-violy-500">{t("nav.about")}</Link>
            <a href="#" className="text-violy-ink-2 text-[0.9rem] font-semibold no-underline hover:text-violy-500">{t("footer.contact.title")}</a>
          </div>
        </div>
        <div>
          <p className="m-0 mb-5 text-violy-ink text-[0.7rem] font-extrabold tracking-[0.13em] uppercase">{t("footer.app")}</p>
          <div className="flex flex-col gap-3">
            <a href="#" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violy-ink text-white font-extrabold text-[0.95rem] no-underline">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.79 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.1ZM12.03 7.25C11.88 5.02 13.69 3.18 15.77 3c.29 2.58-2.34 4.5-3.74 4.25Z"/></svg>
              {t("footer.appstore")}
            </a>
            <a href="#" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-violy-ink font-extrabold text-[0.95rem] no-underline border border-violy-200">
              <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#00D7FF" d="m3.4 2.7 10.5 9.3L3.4 21.3c-.25-.38-.4-.83-.4-1.32V4.02c0-.49.15-.94.4-1.32Z"/><path fill="#FFD54F" d="m17.25 9.03-3.35 2.97 3.35 2.97 3.8-2.12c1.27-.71 1.27-1.99 0-2.7l-3.8-2.12Z"/><path fill="#FF5A65" d="M3.4 21.3 14.9 14l2.35.97-10.9 6.08c-1.16.65-2.28.68-2.95.25Z"/><path fill="#6CEB83" d="M3.4 2.7 14.9 10l2.35-.97-10.9-6.08C5.19 2.3 4.07 2.27 3.4 2.7Z"/></svg>
              {t("footer.play")}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-violy-200/60">
        <div className="w-[min(calc(100%-2rem),80rem)] py-5 mx-auto text-violy-ink-2 text-[0.7rem] flex flex-wrap gap-4 justify-between">
          <p>{t("footer.tagline")}</p>
          <p>{t("footer.tech")}</p>
        </div>
      </div>
    </footer>
  );
}
