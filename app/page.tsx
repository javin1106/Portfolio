import { Hero } from "@/components/hero";
import { Screen } from "@/components/screen";
import { getProfilePhoto, getSlides } from "@/lib/banner";
import { getLatestPush } from "@/lib/github";

/** The latest push refreshes every 30 minutes. */
export const revalidate = 1800;

export default async function Home() {
  const [push, slides, photo] = await Promise.all([getLatestPush(), getSlides(), getProfilePhoto()]);
  return (
    <Screen className="!pt-20 sm:!pt-[4.5rem]">
      <Hero push={push} slides={slides} photo={photo} />
    </Screen>
  );
}
