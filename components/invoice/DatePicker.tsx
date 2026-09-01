"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function toIso(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fromIso(iso: string) {
  if (!iso) return null;
  // Parsed as local time. `new Date("2026-09-01")` is parsed as UTC and lands on
  // 31 August for anyone east of Greenwich — which is everyone this site is for.
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Builds the 6x7 grid for a month, Monday-first, padded with the neighbouring
 * months' days so the grid never reflows between months.
 */
function monthGrid(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  // getDay() is Sunday-first; shift so Monday is column 0.
  const lead = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(1 - lead);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/**
 * A Material-styled calendar.
 *
 * The date fields keep a real <input type="date"> for typing and autofill, but
 * its picker is drawn by the operating system and looks nothing like the page.
 * This replaces the popup only — type into the field, or pick from here.
 */
export default function DatePicker({
  value,
  onChange,
  onClose,
  labelledBy,
}: {
  value: string;
  onChange: (iso: string) => void;
  onClose: () => void;
  labelledBy: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const selected = fromIso(value);
  const today = new Date();

  const [view, setView] = useState(() => {
    const base = selected ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [focused, setFocused] = useState<Date>(() => selected ?? today);

  const days = useMemo(() => monthGrid(view), [view]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [onClose]);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  const move = (days: number) => {
    const next = new Date(focused);
    next.setDate(next.getDate() + days);
    setFocused(next);
    if (
      next.getMonth() !== view.getMonth() ||
      next.getFullYear() !== view.getFullYear()
    ) {
      setView(new Date(next.getFullYear(), next.getMonth(), 1));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        onClose();
        break;
      case "ArrowLeft":
        e.preventDefault();
        move(-1);
        break;
      case "ArrowRight":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-7);
        break;
      case "ArrowDown":
        e.preventDefault();
        move(7);
        break;
      case "PageUp":
        e.preventDefault();
        setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
        break;
      case "PageDown":
        e.preventDefault();
        setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        onChange(toIso(focused));
        onClose();
        break;
    }
  };

  const shiftMonth = (by: number) =>
    setView(new Date(view.getFullYear(), view.getMonth() + by, 1));

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="false"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: -6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className="absolute right-0 top-[calc(100%+8px)] z-50 w-[280px] origin-top rounded-2xl border border-brand-100 bg-white p-3 text-left shadow-[0_18px_44px_-12px_rgba(7,42,29,0.32)]"
      >
        {/* Month navigation */}
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => shiftMonth(-1)}
            className="flex size-9 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50"
          >
            <Icon name="chevron_left" className="size-5" />
          </button>
          <div className="text-sm font-semibold text-brand-950">
            {view.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </div>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => shiftMonth(1)}
            className="flex size-9 items-center justify-center rounded-full text-brand-700 transition-colors hover:bg-brand-50"
          >
            <Icon name="chevron_right" className="size-5" />
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 text-center">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-500"
            >
              {w}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const outside = d.getMonth() !== view.getMonth();
            const isSelected = selected ? sameDay(d, selected) : false;
            const isToday = sameDay(d, today);
            const isFocused = sameDay(d, focused);

            return (
              <button
                key={d.toISOString()}
                type="button"
                tabIndex={-1}
                aria-current={isToday ? "date" : undefined}
                aria-pressed={isSelected}
                onClick={() => {
                  onChange(toIso(d));
                  onClose();
                }}
                onMouseEnter={() => setFocused(d)}
                className={`tnum relative m-0.5 flex size-9 items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? "bg-brand-900 font-semibold text-white"
                    : isFocused
                      ? "bg-brand-50 text-brand-900"
                      : outside
                        ? "text-brand-300"
                        : "text-brand-900 hover:bg-brand-50"
                }`}
              >
                {d.getDate()}
                {isToday && !isSelected ? (
                  <span className="absolute bottom-1.5 size-1 rounded-full bg-gold-500" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-between border-t border-brand-100 pt-2">
          <button
            type="button"
            onClick={() => {
              onChange("");
              onClose();
            }}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(toIso(new Date()));
              onClose();
            }}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
          >
            Today
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
