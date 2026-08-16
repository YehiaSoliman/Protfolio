import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Mail, Moon, Phone, Sun } from "lucide-react";
import { about, nav, site, stats, timeline, ui } from "./data";
import Lookbook from "./Lookbook.jsx";
import { LangSwitch, useLang } from "./lang.jsx";

const spring = { type: "spring", stiffness: 300, damping: 25 };
const reveal = (reduce) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.22 },
        transition: spring,
      };

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    requestAnimationFrame(() => {
      root.offsetHeight;
      root.classList.remove("theme-switching");
    });
  }, [dark]);

  return [dark, setDark];
}

function Press({ children, className = "", onClick, type = "button", ref, ...rest }) {
  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

function MagneticCta({ children, href }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.18;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  const cls =
    "inline-flex items-center gap-2 rounded-pill bg-accent px-6 py-3 text-[15px] font-semibold text-white shadow-medium transition-transform duration-150 ease-out active:scale-[0.96]";

  return (
    <a href={href} className={cls} ref={ref} onMouseMove={onMove} onMouseLeave={reset}>
      {children}
    </a>
  );
}

function ThemeSwitch({ dark, setDark }) {
  return (
    <div
      role="group"
      aria-label="Color theme"
      className="glass relative flex h-10 w-[84px] rounded-full p-1 shadow-subtle"
      dir="ltr"
    >
      <motion.span
        className="absolute top-1 h-8 w-9 rounded-full bg-white shadow-subtle dark:bg-apple-panel"
        animate={{ x: dark ? 38 : 0 }}
        transition={spring}
      />
      <Press
        aria-pressed={!dark}
        aria-label="Light mode"
        onClick={() => setDark(false)}
        className="relative z-10 grid h-8 w-9 place-items-center text-apple-ink dark:text-apple-line"
      >
        <Sun size={15} strokeWidth={2} />
      </Press>
      <Press
        aria-pressed={dark}
        aria-label="Dark mode"
        onClick={() => setDark(true)}
        className="relative z-10 grid h-8 w-9 place-items-center text-apple-ink dark:text-apple-line"
      >
        <Moon size={15} strokeWidth={2} />
      </Press>
    </div>
  );
}

function Nav({ dark, setDark, compact }) {
  const [lang] = useLang();
  const t = ui[lang];
  const primary = lang === "ar" ? site.nameAr : site.name;
  const secondary = lang === "ar" ? site.name : site.nameAr;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-3 md:pt-4"
      animate={{ y: 0 }}
    >
      <motion.nav
        layout
        className="glass flex w-full max-w-5xl items-center justify-between gap-2 rounded-[22px] px-3 py-2 shadow-subtle md:px-4"
        animate={{
          paddingTop: compact ? 6 : 10,
          paddingBottom: compact ? 6 : 10,
        }}
        transition={spring}
        aria-label="Primary"
      >
        <a href="#top" className="flex min-w-0 items-baseline gap-2 px-2">
          <span className={`truncate text-[15px] font-bold tracking-tight ${lang === "ar" ? "font-ar" : ""}`}>
            {primary}
          </span>
          <span className={`hidden shrink-0 text-[13px] text-[var(--mute)] sm:inline ${lang === "en" ? "font-ar" : ""}`}>
            {secondary}
          </span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="rounded-pill px-3 py-2 text-[13px] font-medium text-[var(--mute)] transition-[color,background-color] duration-150 hover:bg-black/5 hover:text-[var(--ink)] dark:hover:bg-white/10"
              >
                {t[item.key]}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex shrink-0 items-center gap-2" dir="ltr">
          <ThemeSwitch dark={dark} setDark={setDark} />
          <LangSwitch />
        </div>
      </motion.nav>
    </motion.header>
  );
}

function Hero({ reduce }) {
  const [lang] = useLang();
  const t = ui[lang];
  const ar = lang === "ar";

  return (
    <section
      id="top"
      className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-10 px-6 pb-24 pt-28 md:grid-cols-[1.15fr_0.85fr] md:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl dark:bg-accent/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl dark:bg-sky-500/20"
      />

      <motion.div {...reveal(reduce)}>
        <p className={`mb-3 text-lg font-semibold text-accent ${ar ? "" : "font-ar"}`}>
          {ar ? site.name : site.nameAr}
        </p>
        <h1
          className={`max-w-[14ch] text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] md:text-7xl ${ar ? "font-ar" : ""}`}
        >
          {ar ? site.nameAr : site.name}
        </h1>
        <p className={`mt-4 text-lg font-medium text-[var(--mute)] md:text-xl ${ar ? "font-ar" : ""}`}>{t.role}</p>
        <p className={`mt-5 max-w-[46ch] text-[17px] leading-8 ${ar ? "font-ar" : ""}`}>{t.tagline}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <MagneticCta href="#lookbook">
            {t.viewGlories} <ArrowUpRight size={16} />
          </MagneticCta>
          <a
            href="#contact"
            className="glass rounded-pill px-6 py-3 text-[15px] font-semibold shadow-subtle transition-transform duration-150 ease-out active:scale-[0.96]"
          >
            {t.contact}
          </a>
        </div>
      </motion.div>

      <motion.div
        className="relative mx-auto w-full max-w-sm"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.12 }}
      >
        <motion.div
          className="glass relative overflow-hidden rounded-[28px] p-2 shadow-prominent"
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={site.portrait}
            alt={site.portraitAlt[lang]}
            className="aspect-[4/5] w-full rounded-[20px] object-cover outline outline-1 outline-black/10 dark:outline-white/10"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function About({ reduce }) {
  const [lang] = useLang();
  const t = ui[lang];
  const cv = about[lang];
  const ar = lang === "ar";

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div
        {...reveal(reduce)}
        className={`grid gap-8 ${site.cvSlide ? "lg:grid-cols-[1.15fr_0.85fr]" : ""}`}
      >
        <div dir={ar ? "rtl" : "ltr"} className={ar ? "font-ar" : ""}>
          <h2 className="text-3xl font-bold tracking-[-0.02em] md:text-4xl">{cv.title}</h2>
          <p className="mt-2 text-xl font-semibold text-accent">{cv.name}</p>
          <p className="mt-3 text-[16px] leading-7 text-[var(--ink)]">{cv.job}</p>
          <p className="mt-1 text-[15px] leading-7 text-[var(--mute)]">{cv.teaching}</p>
          <p className="mt-5 text-[17px] leading-8">{cv.summary}</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats[lang].map((s) => (
              <div key={s.label} className="glass rounded-card p-4 shadow-subtle">
                <p className="text-2xl font-extrabold tabular-nums text-accent">{s.value}</p>
                <p className="mt-1 text-[12px] leading-5 text-[var(--mute)]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        {site.cvSlide ? (
          <motion.img
            src={site.cvSlide}
            alt={t.cvAlt}
            className="w-full rounded-card object-cover shadow-medium outline outline-1 outline-black/10 dark:outline-white/10"
          />
        ) : null}
      </motion.div>

      <div dir={ar ? "rtl" : "ltr"} className={`${ar ? "font-ar" : ""} mt-10 grid gap-4 md:grid-cols-2`}>
        {cv.sections.map((block) => (
          <motion.article key={block.heading} {...reveal(reduce)} className="glass rounded-card p-5 shadow-subtle">
            <h3 className="text-lg font-bold text-accent">{block.heading}</h3>
            <ul className="mt-3 space-y-2 text-[15px] leading-7">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Timeline({ reduce }) {
  const [lang] = useLang();
  const t = ui[lang];
  const ar = lang === "ar";

  return (
    <section id="path" className={`mx-auto max-w-3xl px-6 py-20 ${ar ? "font-ar" : ""}`} dir={ar ? "rtl" : "ltr"}>
      <motion.h2 {...reveal(reduce)} className="text-3xl font-bold tracking-[-0.02em] md:text-4xl">
        {t.path}
      </motion.h2>
      <ol className="relative mt-10 border-s border-[var(--line)] ps-8">
        {timeline[lang].map((item) => (
          <motion.li key={item.year + item.title} {...reveal(reduce)} className="relative mb-10 last:mb-0">
            <span className="absolute -start-[37px] top-1.5 h-3 w-3 rounded-full bg-accent" />
            <p className="text-[12px] font-semibold tabular-nums text-accent">{item.year}</p>
            <h3 className="mt-1 text-lg font-bold">{item.title}</h3>
            <p className="text-[13px] font-medium text-[var(--mute)]">{item.place}</p>
            <p className="mt-2 text-[15px] leading-7">{item.detail}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

function Contact({ reduce }) {
  const [lang] = useLang();
  const t = ui[lang];
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setError(t.formError);
      return;
    }
    setError("");
    const body = encodeURIComponent(`${message}\n\n— ${name}`);
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent("Portfolio enquiry")}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="mx-auto max-w-xl px-6 py-20">
      <motion.div {...reveal(reduce)}>
        <h2 className={`text-3xl font-bold tracking-[-0.03em] md:text-4xl ${lang === "ar" ? "font-ar" : ""}`}>
          {t.write}
        </h2>
        <p className={`mt-3 text-[var(--mute)] ${lang === "ar" ? "font-ar" : ""}`}>{t.writeLead}</p>
      </motion.div>
      <motion.form
        {...reveal(reduce)}
        onSubmit={onSubmit}
        className="glass mt-8 space-y-5 rounded-card p-6 shadow-medium"
      >
        <Field name="name" label={t.name} autoComplete="name" />
        <Field name="email" label={t.email} type="email" autoComplete="email" />
        <Field name="message" label={t.message} textarea />
        {error ? (
          <p className="text-[13px] text-accent" role="alert">
            {error}
          </p>
        ) : null}
        <Press
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-accent py-3 text-[15px] font-semibold text-white shadow-medium"
        >
          {sent ? (
            <>
              <Check size={16} /> {t.sending}
            </>
          ) : (
            t.send
          )}
        </Press>
      </motion.form>
    </section>
  );
}

function Field({ name, label, type = "text", textarea, autoComplete }) {
  const id = name;
  const cls =
    "peer w-full rounded-pill border-0 bg-black/[0.04] px-4 pb-2 pt-6 text-[15px] outline-none ring-1 ring-black/10 transition-[box-shadow] duration-150 focus:ring-2 focus:ring-accent dark:bg-white/[0.06] dark:ring-white/10";
  return (
    <label className="relative block">
      {textarea ? (
        <textarea id={id} name={name} rows={4} required className={`${cls} resize-y rounded-[16px]`} placeholder=" " />
      ) : (
        <input id={id} name={name} type={type} required autoComplete={autoComplete} className={cls} placeholder=" " />
      )}
      <span className="pointer-events-none absolute start-4 top-3 text-[12px] text-[var(--mute)] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] peer-focus:top-3 peer-focus:text-[12px] peer-focus:text-accent">
        {label}
      </span>
    </label>
  );
}

function Footer() {
  const [lang] = useLang();
  const t = ui[lang];

  return (
    <footer className="mx-auto max-w-6xl px-6 pb-28 pt-8 md:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-8">
        <p className="text-[13px] text-[var(--mute)]">
          © {new Date().getFullYear()} {site.name} · {site.nameAr}
        </p>
        <div className="flex gap-2">
          <IconLink href={`mailto:${site.email}`} label={t.email}>
            <Mail size={18} />
          </IconLink>
          <IconLink href={site.phoneHref} label={lang === "ar" ? "الهاتف" : "Phone"}>
            <Phone size={18} />
          </IconLink>
        </div>
      </div>
    </footer>
  );
}

function IconLink({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="glass grid h-11 w-11 place-items-center rounded-full shadow-subtle transition-transform duration-150 ease-out hover:scale-105 active:scale-[0.96]"
    >
      {children}
    </a>
  );
}

function MobileTabs() {
  const [lang] = useLang();
  const t = ui[lang];

  return (
    <nav
      className="glass fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-[22px] px-2 py-2 shadow-medium md:hidden"
      aria-label="Mobile"
    >
      {nav.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-pill px-3 text-[12px] font-semibold"
        >
          {t[item.key]}
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  const [dark, setDark] = useTheme();
  const [compact, setCompact] = useState(false);
  const reduce = useReducedMotion();
  const [lang] = useLang();
  const t = ui[lang];

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <a href="#lookbook" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-accent focus:px-3 focus:py-2 focus:text-white">
        {t.skip}
      </a>
      <Nav dark={dark} setDark={setDark} compact={compact} />
      <main>
        <Hero reduce={reduce} />
        <About reduce={reduce} />
        <Lookbook reduce={reduce} />
        <Timeline reduce={reduce} />
        <Contact reduce={reduce} />
      </main>
      <Footer />
      <MobileTabs />
    </>
  );
}
