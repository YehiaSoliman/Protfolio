import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ui } from "./data";
import { gloriesSections, leafOf } from "./lookbook.js";
import { useLang } from "./lang.jsx";

const spring = { type: "spring", stiffness: 300, damping: 25 };
const morphEase = [0.77, 0, 0.175, 1];
const morph = { duration: 0.55, ease: morphEase };

export default function Lookbook({ reduce }) {
  const [lang] = useLang();
  const t = ui[lang];
  const ar = lang === "ar";
  const lookbook = gloriesSections();
  const [sectionId, setSectionId] = useState(lookbook[0].id);
  const [subId, setSubId] = useState(null);
  const [partId, setPartId] = useState(null);
  const [open, setOpen] = useState(null);

  const section = lookbook.find((s) => s.id === sectionId) ?? lookbook[0];
  const subs = section.children || [];
  const sub = subs.find((s) => s.id === subId) ?? subs[0];
  const parts = sub?.children || [];
  const part = parts.find((p) => p.id === partId) ?? parts[0];
  const leaf = leafOf(section, sub?.id, part?.id);
  const slides = useMemo(() => [...(leaf?.slides || [])], [leaf]);

  const crumb = [section, sub, part]
    .filter(Boolean)
    .filter((node, i, arr) => i === 0 || node.id !== arr[i - 1].id)
    .map((node) => (ar ? node.titleAr : node.title))
    .join(" · ");

  const openIndex = open == null ? -1 : slides.findIndex((s) => s.id === open);

  const selectSection = (id) => {
    setOpen(null);
    setSectionId(id);
    setSubId(null);
    setPartId(null);
  };

  return (
    <LayoutGroup id="lookbook-morph">
      <section id="lookbook" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className={`text-3xl font-bold tracking-[-0.03em] md:text-4xl ${ar ? "font-ar" : ""}`}>
              {t.glories}
            </h2>
            <p className={`mt-2 max-w-[48ch] text-[var(--mute)] ${ar ? "font-ar" : ""}`}>{t.gloriesLead}</p>
          </div>
          <p className={`text-sm text-accent ${ar ? "font-ar" : ""}`}>{crumb}</p>
        </div>

        <Pills
          items={lookbook}
          value={section.id}
          onChange={selectSection}
          ar={ar}
          reduce={reduce}
          layoutId="lookbook-pill"
          label={t.sections}
        />

        {subs.length > 0 ? (
          <Pills
            items={subs}
            value={sub?.id}
            onChange={(id) => {
              setOpen(null);
              setSubId(id);
              setPartId(null);
            }}
            ar={ar}
            reduce={reduce}
            layoutId="lookbook-sub"
            label={t.plays}
            quiet
          />
        ) : null}

        {parts.length > 0 ? (
          <Pills
            items={parts}
            value={part?.id}
            onChange={(id) => {
              setOpen(null);
              setPartId(id);
            }}
            ar={ar}
            reduce={reduce}
            layoutId="lookbook-part"
            label={t.partitions}
            quiet
          />
        ) : null}

        <AnimatePresence mode="wait">
          {slides.length === 0 ? (
            <motion.p
              key={`${leaf?.id}-empty`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className={`mt-8 rounded-card bg-black/[0.03] px-6 py-16 text-center text-[15px] text-[var(--mute)] dark:bg-white/[0.04] ${ar ? "font-ar" : ""}`}
            >
              {t.empty}
            </motion.p>
          ) : (
            <motion.div
              key={leaf?.id}
              initial={reduce ? false : { opacity: 0, transform: "scale(0.97)" }}
              animate={{ opacity: 1, transform: "scale(1)" }}
              exit={reduce ? undefined : { opacity: 0, transform: "scale(1.03)" }}
              transition={reduce ? { duration: 0 } : morph}
              className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4"
            >
              {slides.map((slide, i) => (
                <motion.button
                  key={slide.id}
                  type="button"
                  onClick={() => setOpen(slide.id)}
                  whileTap={{ scale: 0.96 }}
                  className={`group relative overflow-hidden rounded-card text-left shadow-subtle ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  {open !== slide.id ? (
                    <motion.img
                      layoutId={reduce ? undefined : `morph-${slide.id}`}
                      src={slide.src}
                      alt={slide.alt}
                      loading="lazy"
                      className={`w-full object-cover outline outline-1 outline-black/10 dark:outline-white/10 ${
                        i === 0 ? "h-56 md:h-[420px]" : "h-36 md:h-44"
                      }`}
                      transition={morph}
                    />
                  ) : (
                    <div className={`${i === 0 ? "h-56 md:h-[420px]" : "h-36 md:h-44"} bg-black/10`} />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {openIndex >= 0 ? (
            <MorphStage
              slides={slides}
              index={openIndex}
              sectionTitle={crumb}
              labels={{ prev: t.prev, next: t.next, close: t.close }}
              reduce={reduce}
              onClose={() => setOpen(null)}
              onIndex={(i) => setOpen(slides[i].id)}
            />
          ) : null}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  );
}

function Pills({ items, value, onChange, ar, reduce, layoutId, label, quiet }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={`${quiet ? "mt-3" : "mt-8"} flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
    >
      {items.map((s) => {
        const active = s.id === value;
        return (
          <button
            key={s.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(s.id)}
            className={`relative shrink-0 rounded-full font-semibold transition-transform duration-150 ease-out active:scale-[0.96] ${
              quiet ? "px-3.5 py-1.5 text-[12px]" : "px-4 py-2 text-[13px]"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className={`absolute inset-0 rounded-full ${quiet ? "bg-apple-ink dark:bg-white" : "bg-accent"}`}
                transition={reduce ? { duration: 0 } : spring}
              />
            ) : (
              <span className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/10" />
            )}
            <span
              className={`relative z-10 ${
                active ? (quiet ? "text-white dark:text-apple-ink" : "text-white") : ""
              } ${ar ? "font-ar" : ""}`}
            >
              {ar ? s.titleAr : s.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MorphStage({ slides, index, sectionTitle, labels, reduce, onClose, onIndex }) {
  const slide = slides[index];
  const dialogRef = useRef(null);
  const dirRef = useRef(0);

  const step = (d) => {
    dirRef.current = d;
    const next = (index + d + slides.length) % slides.length;
    onIndex(next);
  };

  useEffect(() => {
    const prev = document.activeElement;
    dialogRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        dirRef.current = 1;
        onIndex((index + 1) % slides.length);
      }
      if (e.key === "ArrowLeft") {
        dirRef.current = -1;
        onIndex((index - 1 + slides.length) % slides.length);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [index, onClose, onIndex, slides.length]);

  if (!slide) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={sectionTitle}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl"
      >
        <div className="relative overflow-hidden rounded-[28px] shadow-prominent">
          <AnimatePresence mode="popLayout" custom={dirRef.current}>
            <motion.img
              key={slide.id}
              layoutId={reduce ? undefined : `morph-${slide.id}`}
              src={slide.src}
              alt={slide.alt}
              className="max-h-[82svh] w-full object-contain bg-black"
              initial={
                reduce
                  ? false
                  : {
                      opacity: 0.55,
                      clipPath: "inset(10% 12% 10% 12% round 28px)",
                      transform: "scale(0.94)",
                    }
              }
              animate={{
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0% round 28px)",
                transform: "scale(1)",
              }}
              exit={
                reduce
                  ? undefined
                  : {
                      opacity: 0,
                      clipPath: "inset(8% 10% 8% 10% round 32px)",
                      transform: "scale(1.04)",
                    }
              }
              transition={reduce ? { duration: 0 } : morph}
            />
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-white" dir="ltr">
          <p className="text-[13px] font-medium">
            {sectionTitle} · {index + 1} / {slides.length}
          </p>
          <div className="flex items-center gap-2">
            <IconBtn label={labels.prev} onClick={() => step(-1)}>
              <ChevronLeft size={18} />
            </IconBtn>
            <IconBtn label={labels.next} onClick={() => step(1)}>
              <ChevronRight size={18} />
            </IconBtn>
            <IconBtn label={labels.close} onClick={onClose}>
              <X size={18} />
            </IconBtn>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function IconBtn({ label, onClick, children }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md"
    >
      {children}
    </motion.button>
  );
}
