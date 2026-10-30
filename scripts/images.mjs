/**
 * og:image pipeline: art/*.png → public/assets/{name}.jpg
 * Sources live in art/ (gitignored). Drop a PNG there and run `npm run images`.
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

for (const file of sources) {
  const from = join(src, file);
  const jpg = join(out, `${parse(file).name}.jpg`);
  await sharp(from).jpeg({ quality: 82, mozjpeg: true, progressive: true }).toFile(jpg);
  console.log(`  ${file.padEnd(18)} png ${kb(from)}KB → jpg ${kb(jpg)}KB`);
}
