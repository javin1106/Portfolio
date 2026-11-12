import type { Metadata } from "next";
import { Screen } from "@/components/screen";
import { Work } from "@/components/work";
import { getSelectedWork } from "@/lib/pinned";

export const metadata: Metadata = { title: "Work" };

/** Follows the repos pinned on GitHub; re-read every six hours. */
export const revalidate = 21600;

export default async function WorkPage() {
  const selected = await getSelectedWork();

  return (
    <Screen index="01" title="Selected work" wide>
      <Work selected={selected} />
    </Screen>
  );
}
