import fs from "node:fs";
import path from "node:path";

const SRC = "node_modules/@material-symbols/svg-400/rounded";
const [outFile, ...names] = process.argv.slice(2);

const entries = [];
for (const n of names) {
  const f = path.join(SRC, `${n}.svg`);
  if (!fs.existsSync(f)) { console.error("MISSING", n); process.exit(1); }
  const svg = fs.readFileSync(f, "utf8");
  const d = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
  if (!d.length) { console.error("NO PATH", n); process.exit(1); }
  entries.push([n, d]);
}

const body = entries
  .map(([n, ds]) => `  "${n}": ${JSON.stringify(ds.length === 1 ? ds[0] : ds)},`)
  .join("\n");

fs.writeFileSync(outFile, `// GENERATED — do not edit by hand.
//
// Path data extracted from @material-symbols/svg-400 (Google Material Symbols,
// Apache 2.0). Inlining only the icons this site uses keeps the whole set out
// of the bundle: the package is 47MB on disk and the equivalent icon font is
// megabytes over the wire, for a handful of glyphs.
//
// Regenerate with scripts/generate-icons.mjs after adding a name here.

export type IconName = ${entries.map(([n]) => `"${n}"`).join(" | ")};

export const ICON_PATHS: Record<IconName, string | string[]> = {
${body}
};
`);
console.log("wrote", outFile, "with", entries.length, "icons");
