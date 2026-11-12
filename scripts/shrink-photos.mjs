/**
 * Shrinks oversized photos in public/banner, public/gallery and public/profile
 * so deploys stay small. Run it after dropping in new photos:
 *
 *   npm run photos:shrink
 *
 * Anything wider than 2560px (or over 1.5 MB) is resized to 2560px wide at
 * JPEG quality 85, which looks identical on screen. The untouched original is
 * copied to _originals/<folder>/ first (git-ignored), so nothing is lost.
 *
 * Stop `npm run dev` first on Windows: a running dev server can keep photos
 * open, and Windows won't let a file that's open be overwritten.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const FOLDERS = ["banner", "gallery", "profile"];
const MAX_WIDTH = 2560;
const MAX_BYTES = 1.5 * 1024 * 1024;
const IMAGE = /\.(jpe?g|png|webp)$/i;
const mb = (n) => `${(n / 1048576).toFixed(2)}MB`;

let changed = 0;
let locked = 0;

for (const folder of FOLDERS) {
  const dir = path.join("public", folder);
  if (!existsSync(dir)) continue;

  for (const file of readdirSync(dir).filter((f) => IMAGE.test(f))) {
    const src = path.join(dir, file);
    const size = statSync(src).size;
    const { width = 0 } = await sharp(src).metadata();
    if (width <= MAX_WIDTH && size <= MAX_BYTES) continue;

    const backupDir = path.join("_originals", folder);
    const backup = path.join(backupDir, file);
    mkdirSync(backupDir, { recursive: true });
    if (!existsSync(backup)) copyFileSync(src, backup);

    const out = await sharp(backup)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    try {
      writeFileSync(src, out);
      changed++;
      console.log(`✓ ${folder}/${file}  ${mb(size)} → ${mb(out.length)}`);
    } catch {
      locked++;
      console.log(`✗ ${folder}/${file}  is open in another program (close it, or stop npm run dev, and re-run)`);
    }
  }
}

console.log(changed || locked ? `\n${changed} shrunk, ${locked} locked.` : "All photos are already a sensible size.");
