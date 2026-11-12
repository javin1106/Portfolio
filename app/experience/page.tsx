import type { Metadata } from "next";
import { Experience } from "@/components/experience";
import { Screen } from "@/components/screen";

export const metadata: Metadata = { title: "Experience" };

export default function ExperiencePage() {
  return (
    <Screen index="02" title="Experience">
      <Experience />
    </Screen>
  );
}
