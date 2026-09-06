import Image from "next/image";
import { profile } from "@/content/profile";

/**
 * Build-time only. This page exists so the real design (fonts and all) can be
 * screenshotted at 1200x630 into /public/og.png:
 *
 *   npm run og
 *
 * It is excluded from the sitemap and search engines; delete it if you would
 * rather hand-author the card.
 */
export const metadata = { robots: { index: false, follow: false } };

export default function OgPreview() {
  return (
    <div
      className="relative isolate overflow-hidden"
      style={{ width: 1200, height: 630 }}
    >
      <Image
        src={profile.hero.src}
        alt=""
        fill
        priority
        sizes="1200px"
        className="object-cover"
        style={{ objectPosition: profile.hero.position }}
      />
      <div className="absolute inset-0 bg-black/62" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(110% 90% at 30% 40%, transparent 30%, rgb(0 0 0 / 0.55) 100%)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-16">
        <p className="label !text-[13px] !tracking-[0.22em] !text-[color:rgb(245_240_232/0.6)]">
          {profile.role}
        </p>

        <div>
          <h1 className="serif text-[86px] leading-[0.98] text-[#f6f1ea]">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-[46ch] text-[21px] leading-[1.5] text-[rgb(245_240_232/0.78)]">
            {profile.tagline}
          </p>
        </div>

        <div className="flex items-center gap-5 border-t border-[rgb(245_240_232/0.16)] pt-6">
          <span className="font-mono text-[16px] text-[rgb(245_240_232/0.72)]">
            github.com/{profile.github}
          </span>
          <span className="h-3.5 w-px bg-[rgb(245_240_232/0.24)]" />
          <span className="font-mono text-[16px] text-[rgb(245_240_232/0.72)]">
            {profile.location}
          </span>
          <span className="ml-auto font-mono text-[16px] text-[#e5a077]">
            {profile.availability}
          </span>
        </div>
      </div>
    </div>
  );
}
