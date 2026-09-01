"use client";

import { useId, useRef } from "react";
import Icon from "@/components/ui/Icon";

/**
 * A field that reads as document text until you touch it.
 *
 * The invoice page used to render a form beside a preview, which meant every
 * value existed twice on screen and you edited the copy that was not the
 * deliverable. Here the sheet *is* the form: these look like the finished
 * invoice, and reveal themselves as editable on hover and focus.
 *
 * They stay real inputs with real labels rather than contenteditable, so
 * tabbing, autofill, mobile keyboards and screen readers all behave normally.
 */

const base =
  "w-full bg-transparent outline-none rounded-[3px] transition-colors " +
  "hover:bg-brand-50/70 focus:bg-brand-50 " +
  "placeholder:text-brand-300 placeholder:font-normal";

export function EditableText({
  value,
  onChange,
  label,
  placeholder,
  className = "",
  align = "left",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
}) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${base} ${align === "right" ? "text-right" : ""} px-1 py-0.5 ${className}`}
      />
    </>
  );
}

export function EditableArea({
  value,
  onChange,
  label,
  placeholder,
  rows = 3,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${base} resize-none px-1 py-0.5 ${className}`}
      />
    </>
  );
}

export function EditableDate({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);

  // The native picker indicator is a browser-drawn glyph that ignores the
  // page's colour and weight entirely. It is hidden in globals.css and replaced
  // with the Material calendar, which opens the same platform picker through
  // showPicker() — so the control still behaves exactly like a date input.
  const openPicker = () => {
    const el = ref.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      try {
        el.showPicker();
        return;
      } catch {
        // Safari and some embedded views throw here; focusing is the fallback.
      }
    }
    el.focus();
  };

  return (
    <span className="relative flex items-center">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${base} date-field tnum py-0.5 pl-1 pr-7 text-right`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={openPicker}
        className="absolute right-1 flex items-center text-brand-400 transition-colors hover:text-brand-600"
      >
        <Icon name="calendar_month" className="size-4" />
      </button>
    </span>
  );
}
