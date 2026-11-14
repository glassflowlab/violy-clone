"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const NAV = [
  { key: "nav.home", href: "/" },
  { key: "nav.library", href: "/library" },
  { key: "nav.history", href: "/history" },
  { key: "nav.about", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-violy-50/85 border-b border-violy-200/60">
      <nav
        aria-label={t("brand.tagline")}
        className="flex items-center justify-between gap-3 w-[min(calc(100%-2rem),84rem)] h-20 mx-auto"
      >
        <Link href="/" className="inline-flex items-center gap-2.5 no-underline" aria-label="Violy home">
          <span className="grid place-items-center w-12 h-12 rounded-[0.95rem] bg-violy-500 shadow-[0_0.55rem_1.4rem_rgba(47,127,245,0.2)]">
            <span className="text-white text-2xl font-extrabold leading-none">V</span>
          </span>
          <span className="grid gap-0.5 leading-none">
            <strong className="text-[1.18rem] font-extrabold tracking-tight text-violy-ink">Violy</strong>
            <small className="text-[0.62rem] font-bold tracking-[0.08em] uppercase text-violy-ink-2">{t("brand.tagline")}</small>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 p-1 bg-violy-100 border border-violy-200/60 rounded-full">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2.5 rounded-full text-[0.84rem] font-bold transition-colors ${
                  active ? "bg-violy-500 text-white shadow-[0_0.35rem_0.9rem_rgba(47,127,245,0.18)]" : "text-violy-ink-2 hover:bg-white"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Language switcher */}
          <div
            role="group"
            aria-label={t("lang.label")}
            className="inline-flex items-center p-1 bg-white border border-violy-200 rounded-full"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`px-2.5 py-1.5 rounded-full text-[0.78rem] font-extrabold transition-colors ${
                locale === "en" ? "bg-violy-ink text-white" : "text-violy-ink-2 hover:text-violy-ink"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              aria-pressed={locale === "zh"}
              className={`px-2.5 py-1.5 rounded-full text-[0.78rem] font-extrabold transition-colors ${
                locale === "zh" ? "bg-violy-ink text-white" : "text-violy-ink-2 hover:text-violy-ink"
              }`}
            >
              中
            </button>
          </div>

          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-violy-yellow text-violy-ink font-extrabold text-[0.9rem] shadow-[0_0.5rem_1.2rem_rgba(131,101,17,0.12)] hover:bg-violy-yellow-2 transition-colors"
          >
            {t("nav.start")}
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
            </svg>
          </Link>
        </div>

        {/* Mobile: language + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <div
            role="group"
            aria-label={t("lang.label")}
            className="inline-flex items-center p-0.5 bg-white border border-violy-200 rounded-full"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`px-2 py-1 rounded-full text-[0.7rem] font-extrabold transition-colors ${
                locale === "en" ? "bg-violy-ink text-white" : "text-violy-ink-2"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              aria-pressed={locale === "zh"}
              className={`px-2 py-1 rounded-full text-[0.7rem] font-extrabold transition-colors ${
                locale === "zh" ? "bg-violy-ink text-white" : "text-violy-ink-2"
              }`}
            >
              中
            </button>
          </div>
          <Link href="/library" className="inline-flex items-center justify-center w-11 h-11 rounded-[0.9rem] bg-violy-100 text-violy-600 border border-violy-200">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
