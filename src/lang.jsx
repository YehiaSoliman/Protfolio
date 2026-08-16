import { createContext, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

const LangContext = createContext(["en", () => {}]);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "en";
    const saved = localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") return saved;
    return navigator.language?.startsWith("ar") ? "ar" : "en";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  return <LangContext.Provider value={[lang, setLang]}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

const spring = { type: "spring", stiffness: 300, damping: 25 };

export function LangSwitch() {
  const [lang, setLang] = useLang();
  const ar = lang === "ar";

  return (
    <div
      role="group"
      aria-label={ar ? "اللغة" : "Language"}
      dir="ltr"
      className="glass relative flex h-10 w-[84px] rounded-full p-1 shadow-subtle"
    >
      <motion.span
        className="absolute top-1 h-8 w-9 rounded-full bg-white shadow-subtle dark:bg-apple-panel"
        animate={{ x: ar ? 38 : 0 }}
        transition={spring}
      />
      <button
        type="button"
        aria-pressed={!ar}
        aria-label="English"
        onClick={() => setLang("en")}
        className="relative z-10 grid h-8 w-9 place-items-center text-[12px] font-bold text-apple-ink dark:text-apple-line"
      >
        EN
      </button>
      <button
        type="button"
        aria-pressed={ar}
        aria-label="العربية"
        onClick={() => setLang("ar")}
        className="relative z-10 grid h-8 w-9 place-items-center font-ar text-[13px] font-bold text-apple-ink dark:text-apple-line"
      >
        ع
      </button>
    </div>
  );
}
