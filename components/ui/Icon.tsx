import { ICON_PATHS, type IconName } from "@/lib/icon-paths";

/**
 * Google Material Symbols, inlined.
 *
 * Material ships either a multi-megabyte icon font or a 47MB SVG package; this
 * renders from a generated map holding only the glyphs the site actually uses,
 * so a handful of icons costs a handful of kilobytes and no extra request.
 *
 * Material's own artwork is drawn on a 0 -960 960 960 grid with the baseline at
 * y=0, which is why the viewBox looks unusual.
 */
export default function Icon({
  name,
  className = "",
  title,
}: {
  name: IconName;
  className?: string;
  /** Supply only when the icon carries meaning no adjacent text conveys. */
  title?: string;
}) {
  const d = ICON_PATHS[name];
  const paths = Array.isArray(d) ? d : [d];

  return (
    <svg
      viewBox="0 -960 960 960"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      className={`inline-block shrink-0 ${className}`}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}
