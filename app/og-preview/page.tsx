import Image from "next/image";
import { profile } from "@/content/profile";
import { getInitialPalette, getProfilePhoto, getSlides } from "@/lib/banner";

/**
 * Build-time only. This page exists so the real design (fonts and all) can be
 * screenshotted at 1200x630 into /public/og.png, the image link previews show:
 *
 *   npm run og
 *
 * It mirrors the home page: the first banner photo, your profile photo, your
 * name, and the colours that photo gives the site. Re-run `npm run og` after
 * changing the banner, profile photo, title or pitch.
 *
 * Excluded from the sitemap and search engines.
 */
export const metadata = { robots: { index: false, follow: false } };

const GITHUB_AVATAR = "https://avatars.githubusercontent.com/u/108410532?v=4";

export default async function OgPreview() {
  const [slides, photo, p] = await Promise.all([getSlides(), getProfilePhoto(), getInitialPalette()]);
  const banner = slides[0];
  const pitch = profile.pitch.map((seg) => seg.text).join("");

  return (
    <div
      className="relative overflow-hidden bg-bg"
      style={
        {
          width: 1200,
          height: 630,
          // Pin this card to the first photo's palette (no cycling mid-screenshot).
          "--ah": p.ah,
          "--as": `${p.as}%`,
          "--th": p.th,
          "--ts": `${p.ts}%`,
        } as React.CSSProperties
      }
    >
      {/* Banner */}
      <div className="absolute inset-x-12 top-12 h-[230px] overflow-hidden rounded-[28px] border border-line-2 bg-bg-2">
        {banner ? (
          <Image
            src={banner.src}
            alt=""
            fill
            priority
            sizes="1100px"
            placeholder="blur"
            blurDataURL={banner.blur}
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
      </div>

      {/* Profile photo, overlapping the banner like on the home page */}
      <span className="absolute left-[84px] top-[214px] block h-[124px] w-[124px] overflow-hidden rounded-full border-[7px] border-bg bg-bg-2">
        <Image src={photo?.src ?? GITHUB_AVATAR} alt="" fill priority sizes="124px" className="object-cover" />
      </span>

      <div className="absolute inset-x-12 bottom-12 top-[352px] flex flex-col justify-between px-3">
        <div>
          <p className="flex items-baseline gap-5">
            <span className="serif text-[72px] leading-none text-fg">{profile.name}</span>
            <span className="font-mono text-[15px] uppercase tracking-[0.2em] text-accent">{profile.role}</span>
          </p>
          <p className="mt-4 max-w-[60ch] text-[22px] leading-[1.45] text-fg-2">{pitch}</p>
        </div>

        <div className="flex items-center gap-5 font-mono text-[15px] text-fg-3">
          <span>github.com/{profile.github}</span>
          <span className="h-3.5 w-px bg-line-2" />
          <span>{profile.location.split(" · ")[0]}</span>
          <span className="ml-auto flex items-center gap-2.5 text-fg-2">
            <span className="live-dot" />
            {profile.availability}
          </span>
        </div>
      </div>
    </div>
  );
}
