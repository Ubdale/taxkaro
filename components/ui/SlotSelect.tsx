"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";

type Option<T extends string> = { value: T; label: string };

/**
 * An inline choice inside the sentence.
 *
 * This started as a transparent native <select> laid over a span, which is a
 * common trick and looks like one: the platform menu ignores the page's type
 * and colour entirely, and on desktop it drops a grey system list under a
 * carefully set line of text. This is a real listbox instead — styled,
 * animated, and driven from the keyboard the way the ARIA pattern expects.
 *
 * Focus stays on the trigger and the active option is tracked with
 * aria-activedescendant, which is the simpler half of the listbox pattern and
 * avoids the focus-restoration bugs that come with moving focus into the popup.
 */
export default function SlotSelect<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  label: string;
}) {
  const reduced = useReducedMotion();
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, options.findIndex((o) => o.value === value)),
  );
  const wrapRef = useRef<HTMLSpanElement>(null);
  const current = options.find((o) => o.value === value)?.label ?? "";

  // Close on outside click and on scroll — the popup is absolutely positioned
  // to the trigger, so letting it drift during a scroll looks broken.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const commit = (i: number) => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        setActive(Math.max(0, options.findIndex((o) => o.value === value)));
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActive(0);
        break;
      case "End":
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        commit(active);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <span ref={wrapRef} className="relative inline-block align-baseline">
      <button
        type="button"
        id={id}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => {
          setActive(Math.max(0, options.findIndex((o) => o.value === value)));
          setOpen((o) => !o);
        }}
        onKeyDown={onKeyDown}
        className="slot group px-1.5"
      >
        <span className="whitespace-nowrap">{current}</span>
        <motion.span
          aria-hidden
          animate={reduced ? undefined : { rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="ml-0.5 inline-flex text-brand-400 group-hover:text-brand-600"
        >
          <Icon name="keyboard_arrow_down" className="size-[0.7em]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label={label}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute left-0 top-[calc(100%+8px)] z-40 min-w-full origin-top overflow-hidden rounded-xl border border-brand-100 bg-white p-1 text-base font-normal shadow-[0_16px_40px_-12px_rgba(7,42,29,0.28)]"
          >
            {options.map((o, i) => {
              const selected = o.value === value;
              return (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(i)}
                  className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                    i === active
                      ? "bg-brand-900 text-white"
                      : "text-brand-900 hover:bg-brand-50"
                  }`}
                >
                  <Icon
                    name="check"
                    className={`size-3.5 ${
                      selected
                        ? i === active
                          ? "text-gold-400"
                          : "text-brand-500"
                        : "opacity-0"
                    }`}
                  />
                  {o.label}
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
