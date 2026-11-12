import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import sharp from "sharp";
import { DEFAULT_PALETTE, paletteFromImage, type Palette } from "./accent";

/**
 * Home-page banner slides and your profile picture, read from folders:
 *
 *   public/banner/   any number of photos — they cycle as a slideshow, and each
 *                    one sets the site's colours while it's showing
 *   public/profile/  one photo (the first, alphabetically, is used)
 *
 * Everything (sizes, blurred previews, palettes) is worked out at build time.
 */

export type Slide = {
  src: string;
  width: number;
  height: number;
  blur: string;
  palette: Palette;
};

const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const publicDir = (...parts: string[]) => path.join(process.cwd(), "public", ...parts);

async function listImages(folder: string) {
  try {
    return (await readdir(publicDir(folder))).filter((f) => IMAGE.test(f)).sort();
  } catch {
    return [];
  }
}

async function describe(folder: string, file: string): Promise<Slide | null> {
  try {
    const full = publicDir(folder, file);
    const meta = await sharp(full).metadata();
    if (!meta.width || !meta.height) return null;
    const rotated = (meta.orientation ?? 1) >= 5;
    const preview = await sharp(full).rotate().resize(20).webp({ quality: 45 }).toBuffer();
    return {
      src: `/${folder}/${encodeURIComponent(file)}`,
      width: rotated ? meta.height : meta.width,
      height: rotated ? meta.width : meta.height,
      blur: `data:image/webp;base64,${preview.toString("base64")}`,
      palette: await paletteFromImage(full),
    };
  } catch {
    return null;
  }
}

export const getSlides = cache(async (): Promise<Slide[]> => {
  const files = await listImages("banner");
  const slides = await Promise.all(files.map((f) => describe("banner", f)));
  return slides.filter((s): s is Slide => s !== null);
});

export const getProfilePhoto = cache(async (): Promise<Slide | null> => {
  const [first] = await listImages("profile");
  return first ? describe("profile", first) : null;
});

/** The palette the site starts in: the first banner photo's, or the default. */
export const getInitialPalette = cache(async (): Promise<Palette> => {
  const [first] = await getSlides();
  return first?.palette ?? DEFAULT_PALETTE;
});
