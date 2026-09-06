import { now } from "@/content/profile";
import { Reveal } from "./reveal";

export function Now() {
  return (
    <ul className="-mt-1">
      {now.items.map((item, i) => {
        const Tag = item.href ? "a" : "div";

        return (
          <Reveal as="li" key={item.title} delay={i * 50}>
            <Tag
              {...(item.href
                ? { href: item.href, target: "_blank", rel: "noreferrer" }
                : {})}
              className="row group !py-4"
            >
              <div className="flex items-baseline gap-4">
                <span className="label w-[76px] shrink-0 !text-[9.5px] !text-fg-4 transition-colors duration-400 group-hover:!text-accent">
                  {item.label}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="row-title flex items-baseline gap-2 text-[14px]">
                    <span className="min-w-0">{item.title}</span>
                    {item.href ? (
                      <span className="row-arrow shrink-0 text-[12px]">→</span>
                    ) : null}
                  </h3>
                  <p className="mt-1 max-w-[58ch] text-[13px] leading-[1.65] text-fg-3">
                    {item.note}
                  </p>
                </div>
              </div>
            </Tag>
          </Reveal>
        );
      })}
    </ul>
  );
}
