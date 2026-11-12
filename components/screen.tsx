import { cn } from "@/lib/utils";

type Props = {
  /** Two-digit index shown before the title, e.g. "01". */
  index?: string;
  title?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
};

/**
 * One section = one screen. Content sits in the dotted frame, clear of the top
 * bar and the dock, with the section label set like a figure caption.
 */
export function Screen({ index, title, aside, children, wide, className }: Props) {
  return (
    <main
      id="main"
      className={cn(
        "frame min-h-svh px-5 pb-32 pt-24 sm:px-8 sm:pb-32 sm:pt-24",
        wide ? "!max-w-[64rem]" : "!max-w-[52rem]",
        className,
      )}
    >
      {title ? (
        <header className="mb-9 flex items-baseline justify-between gap-4">
          <h1 className="label">
            {index ? (
              <>
                <span className="text-fg-4">{index}</span>
                <span className="mx-2 text-fg-4">—</span>
              </>
            ) : null}
            {title}
          </h1>
          {aside ? <div className="mono shrink-0 !text-[10.5px] text-fg-4">{aside}</div> : null}
        </header>
      ) : null}
      {children}
    </main>
  );
}
