import "server-only";
import sharp from "sharp";

/**
 * A site palette read out of a photograph.
 *
 *   ah/as — the accent: the photo's most characteristic vivid hue
 *   th/ts — the tint: the photo's overall mood, used (very gently) in the text
 *           and background so the whole page feels like it belongs to the photo
 *
 * Lightness is never taken from the photo; CSS fixes it per theme, so every
 * palette keeps the same reading contrast.
 */
export type Palette = { ah: number; as: number; th: number; ts: number };

export const DEFAULT_PALETTE: Palette = { ah: 22, as: 52, th: 30, ts: 10 };

export async function paletteFromImage(input: Buffer | string): Promise<Palette> {
  try {
    const { data, info } = await sharp(input)
      .rotate()
      .resize(36, 36, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const BINS = 36;
    const weight = new Float64Array(BINS);
    const sinSum = new Float64Array(BINS);
    const cosSum = new Float64Array(BINS);
    const satSum = new Float64Array(BINS);
    let total = 0;

    // overall mood: every reasonably coloured pixel, weighted by saturation
    let moodSin = 0;
    let moodCos = 0;
    let moodSat = 0;
    let moodW = 0;

    for (let i = 0; i < data.length; i += info.channels) {
      const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
      const rad = (h * Math.PI) / 180;

      if (l > 0.06 && l < 0.96) {
        moodSin += Math.sin(rad) * s;
        moodCos += Math.cos(rad) * s;
        moodSat += s;
        moodW += 1;
      }

      // The accent: vivid, mid-lightness pixels vote for their hue band. This
      // finds the colour you *notice* in a photo, not its muddy average.
      if (l < 0.1 || l > 0.94 || s < 0.12) continue;
      const w = s * s * (1 - Math.abs(l - 0.5) * 1.6);
      if (w <= 0) continue;
      const bin = Math.floor((h / 360) * BINS) % BINS;
      weight[bin] += w;
      sinSum[bin] += Math.sin(rad) * w;
      cosSum[bin] += Math.cos(rad) * w;
      satSum[bin] += s * w;
      total += w;
    }

    const th = Math.round((((Math.atan2(moodSin, moodCos) * 180) / Math.PI) + 360) % 360);
    // Text only ever gets a whisper of the photo's colour.
    const ts = Math.round(Math.min(26, Math.max(4, (moodSat / Math.max(moodW, 1)) * 45)));

    if (total < 0.6) return { ah: th, as: 18, th, ts };

    let best = 0;
    let bestScore = -1;
    for (let b = 0; b < BINS; b++) {
      const score = weight[b] + 0.5 * (weight[(b + 1) % BINS] + weight[(b - 1 + BINS) % BINS]);
      if (score > bestScore) {
        bestScore = score;
        best = b;
      }
    }

    let sin = 0;
    let cos = 0;
    let sat = 0;
    let w = 0;
    for (const b of [best - 1, best, best + 1]) {
      const k = (b + BINS) % BINS;
      sin += sinSum[k];
      cos += cosSum[k];
      sat += satSum[k];
      w += weight[k];
    }

    return {
      ah: Math.round((((Math.atan2(sin, cos) * 180) / Math.PI) + 360) % 360),
      // Clamped so a neon photo still gives a calm accent.
      as: Math.round(Math.min(64, Math.max(30, (sat / w) * 72))),
      th,
      ts,
    };
  } catch {
    return DEFAULT_PALETTE;
  }
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}
