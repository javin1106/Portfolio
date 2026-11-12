import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import sharp from "sharp";

/**
 * The gallery is whatever is in /public/gallery. To add a photo, drop it in
 * and push — no code to edit.
 *
 * Naming (all optional):
 *   2026-10-03 golden hour at the lake.jpg
 *   └ date ┘ └────── caption ───────┘
 *
 * The date sorts newest first and is shown in the lightbox. Without one, files
 * sort by name. For captions that can't live in a filename (or alt text), add
 * public/gallery/captions.json:
 *   { "IMG_2041.jpg": { "caption": "Monsoon", "alt": "Rain on a window" } }
 */

export type Photo = {
  src: string;
  width: number;
  height: number;
  caption: string;
  alt: string;
  date: string | null;
  /** Tiny inline preview shown while the real image loads. */
  blur: string;
};

const DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const DATED = /^(\d{4}-\d{2}-\d{2})[\s_-]*(.*)$/;

type Overrides = Record<string, { caption?: string; alt?: string }>;

async function readOverrides(): Promise<Overrides> {
  try {
    return JSON.parse(await readFile(path.join(DIR, "captions.json"), "utf8")) as Overrides;
  } catch {
    return {};
  }
}

function captionFrom(stem: string) {
  const words = stem.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "";
}

export const getPhotos = cache(async (): Promise<Photo[]> => {
  let files: string[];
  try {
    files = (await readdir(DIR)).filter((f) => IMAGE.test(f));
  } catch {
    return [];
  }

  const overrides = await readOverrides();

  const photos = await Promise.all(
    files.map(async (file): Promise<Photo | null> => {
      try {
        const full = path.join(DIR, file);
        const meta = await sharp(full).metadata();
        if (!meta.width || !meta.height) return null;

        // EXIF orientations 5–8 are rotated 90°: the stored width is the
        // displayed height. Phone photos hit this constantly.
        const rotated = (meta.orientation ?? 1) >= 5;
        const width = rotated ? meta.height : meta.width;
        const height = rotated ? meta.width : meta.height;

        const preview = await sharp(full).rotate().resize(16).webp({ quality: 40 }).toBuffer();

        const stem = file.replace(IMAGE, "");
        const dated = stem.match(DATED);
        const caption = overrides[file]?.caption ?? captionFrom(dated ? dated[2] : stem);

        return {
          src: `/gallery/${encodeURIComponent(file)}`,
          width,
          height,
          caption,
          alt: overrides[file]?.alt ?? (caption || "Photograph"),
          date: dated ? dated[1] : null,
          blur: `data:image/webp;base64,${preview.toString("base64")}`,
        };
      } catch {
        return null;
      }
    }),
  );

  return photos
    .filter((p): p is Photo => p !== null)
    .sort((a, b) => {
      if (a.date && b.date && a.date !== b.date) return b.date.localeCompare(a.date);
      if (a.date !== b.date) return a.date ? -1 : 1;
      return a.src.localeCompare(b.src);
    });
});
