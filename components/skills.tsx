import { stack } from "@/content/profile";

/**
 * Every tool you work with, drifting past in rows that alternate direction.
 * Pure CSS: each row's track holds the list twice and slides by exactly half
 * its width, so the loop is seamless. Only `translate` animates, which the
 * browser hands to the GPU; hovering a row pauses it so it can be read.
 */
export function Skills() {
  const groups = Object.entries(stack);

  return (
    <div className="skills">
      {/* The plain list, for screen readers and search engines */}
      <ul className="sr-only">
        {groups.flatMap(([, items]) => items).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div aria-hidden className="grid gap-1.5">
        {groups.map(([group, items], row) => (
          <div key={group} className="skills-row" data-reverse={row % 2 === 1}>
            <div
              className="skills-track"
              style={{ "--dur": `${Math.max(items.length * 2.6, 28)}s` } as React.CSSProperties}
            >
              {[...items, ...items].map((item, i) => (
                <span key={i} className="skill">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
