import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { Stats } from "@/components/stats";

export const metadata: Metadata = { title: "Activity" };

/** GitHub and LeetCode refresh a few times a day; the latest push every 30 min. */
export const revalidate = 1800;

export default function ActivityPage() {
  return (
    <Screen index="03" title="Activity" aside="live">
      <Suspense
        fallback={
          <div className="grid gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-[186px] animate-pulse rounded-xl border border-dashed border-line-2" />
            ))}
          </div>
        }
      >
        <Stats />
      </Suspense>
    </Screen>
  );
}
