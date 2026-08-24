/**
 * Screenshot pipeline: art/*.png → public/assets/{name}.webp + {name}.jpg
 *
 * WebP is what the pages load. The JPEG exists only for og:image — link
 * unfurlers are the one audience that still can't be relied on for WebP, and
 * a preview that silently fails to render is worse than a slightly larger file.
 *
 * Sources live in art/, which is gitignored: drop a full-resolution PNG in
 * there and re-run `npm run images`.
 */
import { readdirSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve, parse } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "art");
const out = join(root, "public", "assets");

mkdirSync(out, { recursive: true });

const kb = (p) => (statSync(p).size / 1024).toFixed(0).padStart(5);
const sources = readdirSync(src).filter((f) => /\.png$/i.test(f));

if (sources.length === 0) {
  console.log("  no PNGs in art/ — nothing to do");
  process.exit(0);
}

let before = 0;
let after = 0;

for (const file of sources) {
  const from = join(src, file);
  const { name } = parse(file);
  const webp = join(out, `${name}.webp`);
  const jpg = join(out, `${name}.jpg`);

  await sharp(from).webp({ quality: 82, effort: 6 }).toFile(webp);
  await sharp(from).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(jpg);

  before += statSync(from).size;
  after += statSync(webp).size;

  const { width, height } = await sharp(from).metadata();
  console.log(`  ${name.padEnd(14)} ${width}x${height}  png ${kb(from)}KB → webp ${kb(webp)}KB   (og jpg ${kb(jpg)}KB)`);
}

const saved = (1 - after / before) * 100;
console.log(
  `\n  ${sources.length} images: ${(before / 1024 / 1024).toFixed(2)}MB → ${(after / 1024 / 1024).toFixed(2)}MB webp  (${saved.toFixed(0)}% smaller)`
);
