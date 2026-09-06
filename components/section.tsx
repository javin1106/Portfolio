import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  /** Two-digit index shown before the title, e.g. "01". */
  index: string;
  title: string;
  /** Optional trailing element — a count, a link, a timestamp. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Section({ id, index, title, aside, children, className }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-24 pt-20 sm:pt-28", className)}>
      <Reveal>
        <div className="mb-7 flex items-center gap-4">
          <h2 className="label shrink-0">
            <span className="text-fg-4">{index}</span>
            <span className="mx-2 text-fg-4">/</span>
            {title}
          </h2>
          <span className="h-px min-w-6 flex-1 bg-line" />
          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>
      </Reveal>
      {children}
    </section>
  );
}
