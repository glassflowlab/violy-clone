"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "en" | "zh";

interface Dict {
  [k: string]: string;
}

const en: Dict = {
  // brand
  "brand.tagline": "Practice with purpose",
  "nav.home": "Home",
  "nav.library": "Library",
  "nav.history": "History",
  "nav.about": "About",
  "nav.start": "Start practicing",

  // home
  "home.badge": "Smart practice for real instruments",
  "home.h1.a": "Hear every note.",
  "home.h1.b": "See your progress.",
  "home.body":
    "Violy listens as you play, gives useful pitch and rhythm feedback, and keeps scores, demonstrations and accompaniment in one focused practice space.",
  "home.cta.primary": "Start practicing",
  "home.cta.secondary": "How it works",
  "home.bullet.feedback": "Real-time feedback",
  "home.bullet.scores": "Synced scores & demos",
  "home.bullet.lessons": "Live music lessons",
  "home.preview.label": "Live audition",
  "home.preview.score": "Pitch score",
  "home.preview.hint": "Clearer with every take",
  "home.preview.rhythm.title": "Rhythm on track",
  "home.preview.rhythm.hint": "Feedback while it matters",
  "home.feature.label": "One focused practice loop",
  "home.feature.heading": "A smarter way to move from sound to progress.",
  "home.feature.listen.tag": "Listen",
  "home.feature.listen.title": "Smart practice feedback",
  "home.feature.listen.body":
    "Violy identifies pitch and rhythm issues while you play, then turns the result into a clear next step.",
  "home.feature.follow.tag": "Follow",
  "home.feature.follow.title": "Scores with synced demos",
  "home.feature.follow.body":
    "Read from a growing score library and follow professional demonstrations that stay aligned with the music.",
  "home.feature.connect.tag": "Connect",
  "home.feature.connect.title": "Live lessons, true sound",
  "home.feature.connect.body":
    "Join remote music lessons with sound handling designed to preserve the character of real instruments.",
  "home.feature.understand.tag": "Understand",
  "home.feature.understand.title": "A clearer practice picture",
  "home.feature.understand.body":
    "Keep practice, teacher guidance and progress signals together, so effort becomes easier to understand.",
  "home.cta.label": "Ready when you are",
  "home.cta.heading": "Bring Violy to the music stand.",
  "home.cta.body": "Pick a piece, hit start, and play. The score follows along while Violy listens and reports what to fix next.",
  "home.cta.library": "Open library",
  "home.cta.read": "Read about",

  // library
  "library.eyebrow": "Music sheets cloud",
  "library.h1": "Pick a piece and start practicing.",
  "library.body":
    "Each piece opens in Audition mode: the score follows your playing in real time, and Violy reports pitch and rhythm accuracy at the end. Built-in microphone, no account needed.",

  // practice
  "practice.back": "Library",
  "practice.tempo": "Tempo",
  "practice.live.label": "Live audition",
  "practice.live.pitch": "Live pitch",
  "practice.live.expected": "Expected",
  "practice.live.listening": "Listening…",
  "practice.cents": "Cents from target",
  "practice.cents.flat": "-50¢ (flat)",
  "practice.cents.sharp": "+50¢ (sharp)",
  "practice.mic": "Mic input",
  "practice.status.ready": "Ready",
  "practice.status.starting": "Starting microphone…",
  "practice.status.running": "Audition in progress",
  "practice.status.finishing": "Finalizing…",
  "practice.status.done": "Complete",
  "practice.status.error": "Error",
  "practice.status.demo.playing": "Demo playing",
  "practice.status.demo.loading": "Loading samples…",
  "practice.demo.label": "Demo playback",
  "practice.demo.play": "Play demo",
  "practice.demo.stop": "Stop demo",
  "practice.demo.loading": "Loading violin samples…",
  "practice.demo.playing.hint": "Listen as the score plays itself.",
  "practice.demo.playing.body":
    "The cursor follows the playback. Once the demo finishes, switch to Audition to record your own take.",
  "practice.demo.fail.title": "Demo playback failed",
  "practice.demo.fail.body":
    "{error}. The SoundFont CDN may be unreachable from your network.",
  "practice.cta.start.hint": "Play your instrument along with the score.",
  "practice.cta.start.body":
    "Allow microphone access when prompted. Play from the start of the piece; the score will follow your performance.",
  "practice.cta.stop.hint": "Play your instrument along with the score.",
  "practice.cta.stop.body":
    "The cursor follows your playing. Violy will score your pitch and rhythm when you reach the end — or hit stop to finish early.",
  "practice.cta.start": "Start audition",
  "practice.cta.stop": "Stop and score",
  "practice.bpm.label": "Default tempo",
  "practice.length.label": "Total length",
  "practice.tip":
    "Tip: for best pitch detection, use headphones off or speakers at moderate volume.",
  "practice.mic.fail.title": "Microphone access failed",
  "practice.mic.fail.body":
    "{error}. Please allow microphone access in your browser settings and try again.",
  "practice.notfound.title": "Piece not found",
  "practice.notfound.body": "Try the library to pick another.",
  "practice.notfound.cta": "Back to library",

  // result
  "result.back": "Library",
  "result.eyebrow": "Audition complete",
  "result.score.pitch": "Pitch score",
  "result.score.rhythm": "Rhythm score",
  "result.score.duration": "Duration",
  "result.score.pitch.hint": "Notes hit at correct pitch",
  "result.score.rhythm.hint": "Notes hit at the right time",
  "result.score.duration.hint": "{duration} at {tempo}x",
  "result.curve.label": "Pitch curve",
  "result.curve.heading": "Cents offset over time",
  "result.curve.detected": "Detected",
  "result.curve.expected": "Expected",
  "result.curve.oof": "Out of tune (>30¢)",
  "result.curve.axis.zero": "0¢",
  "result.curve.axis.plus": "+30¢",
  "result.curve.axis.minus": "-30¢",
  "result.notes.label": "Note breakdown",
  "result.notes.heading": "What worked, what to fix",
  "result.notes.count": "{hit} / {total} notes hit",
  "result.notes.col.idx": "#",
  "result.notes.col.expected": "Expected",
  "result.notes.col.detected": "Detected",
  "result.notes.col.pitch": "Pitch",
  "result.notes.col.time": "Time",
  "result.notes.col.score": "Score",
  "result.cta.again": "Practice again",
  "result.cta.another": "Try another piece",
  "result.empty.title": "No result yet",
  "result.empty.body":
    "No audition result found. Run a practice session first.",
  "result.empty.cta": "Open library",

  // about
  "about.eyebrow": "How it works",
  "about.h1": "Real-time feedback, built for the browser.",
  "about.s1.h": "1. Pick a piece",
  "about.s1.p":
    "The library embeds small public-domain melodies in MusicXML — Twinkle Twinkle, Ode to Joy, Mary Had a Little Lamb. Each one opens straight into audition mode with the score rendered and ready to follow.",
  "about.s2.h": "2. Play along",
  "about.s2.p":
    "When you hit start, the browser asks for microphone access. We use the Web Audio API to capture raw audio, then a YIN-style pitch detector (via the {lib} library) estimates the fundamental frequency at ~60 frames per second. The detected pitch is compared against the expected note at that time slice.",
  "about.s3.h": "3. Get scored",
  "about.s3.p":
    "When you reach the end of the piece — or hit stop — the engine walks every expected note and finds the closest detected frame within a half-second onset window. A note counts as a hit if its MIDI matches the expected note; the per-note score blends pitch accuracy (70%) and timing accuracy (30%) within tolerance windows.",
  "about.s4.h": "What this MVP is not",
  "about.s4.p":
    "This is a focused slice of the real Violy product. Out of scope: live lessons, teacher classroom, accompaniment tracks, score uploads, and account / sync. Those are large surfaces; the goal here is to prove the core practice loop works end-to-end in the browser, with a real audio pipeline under the hood.",

  // history
  "history.eyebrow": "History",
  "history.h1": "Practice history lives in your session.",
  "history.body":
    "Each audition's result is held in {storage} and shown on the result page. Persistent history with charts and trends would need an account — that's outside this MVP.",
  "history.cta": "Back to library",

  // footer
  "footer.body":
    "Violy makes practice perfect — a focused practice space for musicians, teachers and families.",
  "footer.contact": "support@violy.app",
  "footer.explore": "Explore",
  "footer.contact.title": "Contact",
  "footer.app": "Get the app",
  "footer.appstore": "App Store",
  "footer.play": "Google Play",
  "footer.tagline": "Violy practice clone · MVP demo",
  "footer.tech": "Built for browser · Web Audio API",

  // language switcher
  "lang.label": "Language",
  "lang.en": "EN",
  "lang.zh": "中文",

  // misc
  "loading": "Loading…",
  "library.tempo": "BPM",
  "library.duration": "Time",
};

const zh: Dict = {
  // brand
  "brand.tagline": "有目標的練習",
  "nav.home": "首頁",
  "nav.library": "曲目庫",
  "nav.history": "歷史",
  "nav.about": "說明",
  "nav.start": "開始練習",

  // home
  "home.badge": "為真實樂器打造的聰明練習",
  "home.h1.a": "聽見每個音。",
  "home.h1.b": "看見你的進步。",
  "home.body":
    "Violy 邊聽你彈邊給出實用的音準與節奏回饋，把樂譜、示範與伴奏收在同一個專注的練習空間。",
  "home.cta.primary": "開始練習",
  "home.cta.secondary": "怎麼運作的",
  "home.bullet.feedback": "即時回饋",
  "home.bullet.scores": "樂譜與示範同步",
  "home.bullet.lessons": "遠程音樂課",
  "home.preview.label": "即時聽寫",
  "home.preview.score": "音準分數",
  "home.preview.hint": "每次都更準",
  "home.preview.rhythm.title": "節奏穩定",
  "home.preview.rhythm.hint": "回饋在最關鍵的時刻",
  "home.feature.label": "專注的練習閉環",
  "home.feature.heading": "從聲音到進步，更聰明的路徑。",
  "home.feature.listen.tag": "聆聽",
  "home.feature.listen.title": "聰明的練習回饋",
  "home.feature.listen.body":
    "Violy 在你演奏時辨識音準與節奏問題，把結果化為清楚的下一個動作。",
  "home.feature.follow.tag": "跟隨",
  "home.feature.follow.title": "樂譜與示範同步",
  "home.feature.follow.body":
    "從持續擴充的樂譜庫中選曲，跟著專業示範演奏，永遠對得上拍。",
  "home.feature.connect.tag": "連結",
  "home.feature.connect.title": "保留真實音色的遠程課",
  "home.feature.connect.body":
    "加入遠程音樂課，音訊處理專為保留真實樂器的音色而設計。",
  "home.feature.understand.tag": "理解",
  "home.feature.understand.title": "更清晰的練習面貌",
  "home.feature.understand.body":
    "把練習、教師指導、進步訊號收在一起，努力變得更容易被理解。",
  "home.cta.label": "準備好了嗎",
  "home.cta.heading": "把 Violy 帶到譜架上。",
  "home.cta.body": "選曲、按下開始、開始演奏。樂譜會跟著你彈，Violy 一邊聽一邊告訴你下一步要修哪裡。",
  "home.cta.library": "打開曲目庫",
  "home.cta.read": "閱讀說明",

  // library
  "library.eyebrow": "樂譜雲",
  "library.h1": "選首曲子，開始練習。",
  "library.body":
    "每首曲子進入聽寫模式：樂譜即時跟隨你的演奏，Violy 在結束時回報音準與節奏的準確度。內建麥克風、不需註冊。",

  // practice
  "practice.back": "曲目庫",
  "practice.tempo": "速度",
  "practice.live.label": "即時聽寫",
  "practice.live.pitch": "即時音準",
  "practice.live.expected": "目標音",
  "practice.live.listening": "聆聽中…",
  "practice.cents": "與目標的音分差",
  "practice.cents.flat": "-50¢ (偏低)",
  "practice.cents.sharp": "+50¢ (偏高)",
  "practice.mic": "麥克風音量",
  "practice.status.ready": "準備中",
  "practice.status.starting": "麥克風啟動中…",
  "practice.status.running": "聽寫進行中",
  "practice.status.finishing": "結算中…",
  "practice.status.done": "完成",
  "practice.status.error": "錯誤",
  "practice.status.demo.playing": "示範播放中",
  "practice.status.demo.loading": "載入音色中…",
  "practice.demo.label": "示範播放",
  "practice.demo.play": "播放示範",
  "practice.demo.stop": "停止示範",
  "practice.demo.loading": "載入小提琴音色中…",
  "practice.demo.playing.hint": "聽樂譜自己演奏一遍。",
  "practice.demo.playing.body":
    "游標會跟著播放走。示範播完後，點下面的開始聽寫來錄你自己的版本。",
  "practice.demo.fail.title": "示範播放失敗",
  "practice.demo.fail.body":
    "{error}。可能你的網路連不上 SoundFont CDN。",
  "practice.cta.start.hint": "按下開始，跟著樂譜演奏。",
  "practice.cta.start.body":
    "瀏覽器會詢問麥克風權限，請允許。從曲子開頭開始演奏，樂譜會跟著你。",
  "practice.cta.stop.hint": "按下停止，產生評分。",
  "practice.cta.stop.body":
    "游標跟著你演奏。彈到結束會自動評分；或按停止提前結算音準與節奏。",
  "practice.cta.start": "開始聽寫",
  "practice.cta.stop": "停止並評分",
  "practice.bpm.label": "預設速度",
  "practice.length.label": "總長度",
  "practice.tip": "提示：音準偵測效果最好時，請把耳機拿下或用中等音量播放。",
  "practice.mic.fail.title": "麥克風權限失敗",
  "practice.mic.fail.body":
    "{error}。請到瀏覽器設定允許麥克風權限後重試。",
  "practice.notfound.title": "找不到這首曲子",
  "practice.notfound.body": "回到曲目庫選另一首。",
  "practice.notfound.cta": "回到曲目庫",

  // result
  "result.back": "曲目庫",
  "result.eyebrow": "聽寫完成",
  "result.score.pitch": "音準分數",
  "result.score.rhythm": "節奏分數",
  "result.score.duration": "總長度",
  "result.score.pitch.hint": "音準正確的音符",
  "result.score.rhythm.hint": "時值正確的音符",
  "result.score.duration.hint": "{duration}・速度 {tempo}x",
  "result.curve.label": "音準曲線",
  "result.curve.heading": "音分差隨時間變化",
  "result.curve.detected": "偵測值",
  "result.curve.expected": "期望值",
  "result.curve.oof": "走音 (>30¢)",
  "result.curve.axis.zero": "0¢",
  "result.curve.axis.plus": "+30¢",
  "result.curve.axis.minus": "-30¢",
  "result.notes.label": "逐音表",
  "result.notes.heading": "哪些做到了、哪些要修",
  "result.notes.count": "{hit} / {total} 個音命中",
  "result.notes.col.idx": "#",
  "result.notes.col.expected": "期望音",
  "result.notes.col.detected": "偵測音",
  "result.notes.col.pitch": "音分差",
  "result.notes.col.time": "時值差",
  "result.notes.col.score": "得分",
  "result.cta.again": "再練一次",
  "result.cta.another": "換一首試試",
  "result.empty.title": "還沒有評分結果",
  "result.empty.body": "找不到聽寫結果，先跑一輪練習。",
  "result.empty.cta": "打開曲目庫",

  // about
  "about.eyebrow": "怎麼運作的",
  "about.h1": "瀏覽器裡的即時回饋。",
  "about.s1.h": "1. 選曲",
  "about.s1.p":
    "曲目庫內建幾首公有領域短曲的 MusicXML —— 小星星、歡樂頌、瑪莉有隻小綿羊。任選一首會直接進入聽寫模式，樂譜已渲染好等著你跟。",
  "about.s2.h": "2. 演奏",
  "about.s2.p":
    "按下開始時瀏覽器會要求麥克風權限。我們用 Web Audio API 取得原始音訊，再用 YIN 風格的音高偵測器（透過 {lib} 套件）以每秒約 60 幀估計基頻。偵測到的音高會跟該時間應有的音符比對。",
  "about.s3.h": "3. 得到評分",
  "about.s3.p":
    "彈到結束（或按停止）時，引擎會比對每個期望音符，尋找 ±0.5 秒 onset 視窗內最接近的偵測幀。MIDI 對上的算命中，單音分數按音準準確度（70%）與時值準確度（30%）在容差範圍內加權。",
  "about.s4.h": "這個 MVP 不做的事",
  "about.s4.p":
    "這只是真實 Violy 產品的一塊切片，不包含：遠程課、教師後台、伴奏軌、樂譜上傳、帳號 / 同步。那些是更大的工程面；這裡的目標是把核心練習閉環在瀏覽器裡完整跑通，而且底下是真的音訊 pipeline。",

  // history
  "history.eyebrow": "歷史",
  "history.h1": "練習紀錄存在 session 裡。",
  "history.body":
    "每次聽寫的結果存在 {storage}，結果頁會讀取。要做長期的歷史圖表需要帳號系統，已超出 MVP 範圍。",
  "history.cta": "回到曲目庫",

  // footer
  "footer.body":
    "Violy 把練習變得更好 —— 為音樂人、教師與家庭打造的專注練習空間。",
  "footer.contact": "support@violy.app",
  "footer.explore": "探索",
  "footer.contact.title": "聯絡",
  "footer.app": "下載 App",
  "footer.appstore": "App Store",
  "footer.play": "Google Play",
  "footer.tagline": "Violy 練習複刻 ・ MVP 展示",
  "footer.tech": "為瀏覽器打造 ・ Web Audio API",

  // language switcher
  "lang.label": "語言",
  "lang.en": "EN",
  "lang.zh": "中文",

  // misc
  "loading": "載入中…",
  "library.tempo": "BPM",
  "library.duration": "時長",
};

const DICTS: Record<Locale, Dict> = { en, zh };

function substitute(text: string, vars: Record<string, string | number> | undefined): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "violy:locale";

function detectInitial(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved === "en" || saved === "zh") return saved;
  } catch {
    // ignore
  }
  const navLang = (navigator.language || "").toLowerCase();
  if (navLang.startsWith("zh")) return "zh";
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(detectInitial());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // ignore
    }
    document.documentElement.lang = locale === "zh" ? "zh-Hant" : "en";
  }, [locale, mounted]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale: setLocaleState,
    t: (key, vars) => {
      const dict = DICTS[locale];
      const raw = dict[key] ?? DICTS.en[key] ?? key;
      return substitute(raw, vars);
    },
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
