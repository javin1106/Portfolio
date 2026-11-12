import { Tweet } from "react-tweet";
import { profile } from "@/content/profile";

/**
 * Posts you've chosen in content/profile.ts (profile.x.posts), rendered as
 * native cards. react-tweet reads X's public embed data on the server — no API
 * key, no X script in the browser — and the cards take the site's colours.
 */
export function XPosts() {
  const ids = profile.x.posts
    .map((url) => url.match(/status\/(\d+)/)?.[1] ?? (/^\d+$/.test(url) ? url : null))
    .filter((id): id is string => Boolean(id));

  if (!ids.length) {
    return process.env.NODE_ENV === "development" ? (
      <p className="font-mono text-[11px] text-fg-4">
        add post links to <span className="text-fg-3">profile.x.posts</span> in content/profile.ts
      </p>
    ) : null;
  }

  return (
    <div className="tweets grid items-start gap-4 sm:grid-cols-2">
      {ids.map((id) => (
        <Tweet key={id} id={id} />
      ))}
    </div>
  );
}
