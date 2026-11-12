"use client";

import { timeAgo } from "@/lib/client";
import { useNow } from "./clock";

/** Relative time computed in the browser, so a cached page never says "3h ago" for a week. */
export function TimeAgo({ iso }: { iso: string }) {
  const now = useNow();
  if (now === null) return <time dateTime={iso}>recently</time>;
  return <time dateTime={iso}>{timeAgo(iso, now)}</time>;
}
