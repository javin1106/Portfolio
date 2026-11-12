import type { Metadata } from "next";
import { PhotoLibrary } from "@/components/photo-library";
import { Reveal } from "@/components/reveal";
import { Screen } from "@/components/screen";
import { hobbies } from "@/content/profile";
import { getPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Off the clock",
  description: "Hobbies and photographs.",
};

export default async function GalleryPage() {
  const photos = await getPhotos();

  return (
    <Screen index="04" title="Off the clock" wide>
      {hobbies.length ? (
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {hobbies.map((h, i) => {
            const body = (
              <>
                <p className="text-[15px] font-medium text-fg">{h.title}</p>
                {h.note ? <p className="mt-1.5 text-[13px] leading-[1.6] text-fg-3">{h.note}</p> : null}
              </>
            );
            return (
              <Reveal key={h.title} delay={i * 60}>
                {h.href ? (
                  <a
                    href={h.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full rounded-2xl border border-line-2 p-4 transition-colors duration-300 hover:border-accent"
                  >
                    {body}
                  </a>
                ) : (
                  <div className="h-full rounded-2xl border border-line-2 p-4">{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      ) : null}

      <p className="label mb-1 !text-[10px]">
        Photos <span className="text-fg-4">· {photos.length}</span>
      </p>
      {photos.length ? (
        <PhotoLibrary photos={photos} />
      ) : (
        <p className="font-mono text-[12px] text-fg-4">Nothing here yet.</p>
      )}
    </Screen>
  );
}
