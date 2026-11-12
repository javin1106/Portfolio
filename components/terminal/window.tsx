import { cn } from "@/lib/utils";

type Props = {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
};

/** macOS-style window chrome, shared by the onboarding and the live terminal. */
export function TerminalWindow({
  title,
  children,
  onClose,
  className,
  bodyClassName,
  style,
  ref,
}: Props) {
  return (
    <div
      ref={ref}
      style={style}
      className={cn(
        "overflow-hidden rounded-xl border border-line-2 bg-bg-1 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55),0_0_0_1px_rgb(0_0_0/0.25)]",
        className,
      )}
    >
      <div className="relative flex h-9 items-center border-b border-line px-3.5">
        <div className="flex items-center gap-[7px]">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close terminal"
              className="group grid h-3 w-3 place-items-center rounded-full bg-[#ec6a5e]"
            >
              <span className="text-[8px] leading-none text-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                ×
              </span>
            </button>
          ) : (
            <span className="h-3 w-3 rounded-full bg-[#ec6a5e]" />
          )}
          <span className="h-3 w-3 rounded-full bg-[#f4bf4f]" />
          <span className="h-3 w-3 rounded-full bg-[#61c554]" />
        </div>
        <p className="pointer-events-none absolute inset-x-0 text-center font-mono text-[11px] text-fg-3">
          {title}
        </p>
      </div>
      <div className={cn("font-mono text-[12.5px] leading-[1.7] text-fg-2", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}

/** The coloured prompt: user@host ~ % */
export function Prompt() {
  return (
    <span className="select-none">
      <span className="text-accent">javin</span>
      <span className="text-fg-4">@portfolio</span> <span className="text-fg-3">~</span>{" "}
      <span className="text-fg-4">%</span>{" "}
    </span>
  );
}
