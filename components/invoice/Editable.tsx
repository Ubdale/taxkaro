"use client";

import { useId } from "react";

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
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${base} tnum px-1 py-0.5 text-right`}
      />
    </>
  );
}
