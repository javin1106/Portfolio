"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { commandNames, commands, type Ctx } from "./commands";
import { Prompt, TerminalWindow } from "./window";

type Entry = { id: number; input?: string; output?: ReactNode; pending?: boolean };

let nextId = 0;

/**
 * The live terminal. Mounted once in the root layout and always present in
 * the DOM (just invisible), so it can grow out of the nav's >_ button: the
 * transform-origin is set to wherever that button is at the moment of opening.
 */
export function Terminal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [origin, setOrigin] = useState("50% 0%");
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const windowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    const trigger = document.getElementById("terminal-trigger");
    const win = windowRef.current;
    if (trigger && win) {
      const t = trigger.getBoundingClientRect();
      const w = win.getBoundingClientRect();
      setOrigin(`${t.left + t.width / 2 - w.left}px ${t.top + t.height / 2 - w.top}px`);
    }
    returnFocus.current = document.activeElement as HTMLElement | null;
    setEntries((current) =>
      current.length
        ? current
        : [
            {
              id: nextId++,
              output: (
                <span className="text-fg-4">
                  Last login: {new Date().toDateString()} on ttys001
                  <br />
                  type <span className="text-fg">help</span> to see what this can do.
                </span>
              ),
            },
          ],
    );
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [entries]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const run = useCallback(
    async (raw: string) => {
      const line = raw.trim();
      const id = nextId++;
      if (line) {
        history.current = [line, ...history.current.filter((h) => h !== line)].slice(0, 50);
      }
      historyIndex.current = -1;

      const [name, ...args] = line.split(/\s+/);
      const command = name ? commands[name.toLowerCase()] : undefined;

      const ctx: Ctx = { navigate, close, clear: () => setEntries([]) };

      if (!name) {
        setEntries((e) => [...e, { id, input: "" }]);
        return;
      }
      if (!command) {
        setEntries((e) => [
          ...e,
          {
            id,
            input: line,
            output: (
              <span>
                zsh: command not found: {name}. try <span className="text-fg">help</span>
              </span>
            ),
          },
        ]);
        return;
      }
      if (name.toLowerCase() === "clear") {
        command.run(args, ctx);
        return;
      }

      const result = command.run(args, ctx);
      if (result instanceof Promise) {
        setEntries((e) => [...e, { id, input: line, pending: true }]);
        const output = await result;
        setEntries((e) => e.map((x) => (x.id === id ? { ...x, output, pending: false } : x)));
      } else {
        setEntries((e) => [...e, { id, input: line, output: result }]);
      }
    },
    [navigate, close],
  );

  /* ⌘K / Ctrl+K anywhere, Esc to close, and the window event from the nav. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    const onOpen = (e: Event) => {
      show();
      const command = (e as CustomEvent<{ command?: string }>).detail?.command;
      if (command) setTimeout(() => void run(command), 220);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("terminal:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("terminal:open", onOpen);
    };
  }, [open, show, close, run]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex.current + 1, history.current.length - 1);
      if (next >= 0) {
        historyIndex.current = next;
        setInput(history.current[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex.current - 1;
      historyIndex.current = Math.max(next, -1);
      setInput(next >= 0 ? history.current[next] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [first, ...rest] = input.split(" ");
      if (rest.length === 0) {
        const matches = commandNames.filter((c) => c.startsWith(first.toLowerCase()));
        if (matches.length === 1) setInput(`${matches[0]} `);
        else if (matches.length > 1) {
          setEntries((x) => [
            ...x,
            { id: nextId++, input, output: <span className="text-fg-3">{matches.join("   ")}</span> },
          ]);
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] transition-[visibility] duration-300",
        open ? "visible" : "invisible delay-300",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-[color-mix(in_oklab,var(--bg)_72%,transparent)] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />

      <TerminalWindow
        ref={windowRef}
        title="javin — zsh — 80×24"
        onClose={close}
        className={cn(
          "relative w-full max-w-[640px] transition-[opacity,scale] duration-[380ms] ease-[var(--ease-out-expo)]",
          open ? "scale-100 opacity-100" : "scale-[0.35] opacity-0",
        )}
        style={{ transformOrigin: origin }}
        bodyClassName="h-[min(420px,60vh)]"
      >
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto px-4 py-3"
          onClick={() => inputRef.current?.focus()}
          role="log"
          aria-live="polite"
        >
          {entries.map((entry) => (
            <div key={entry.id} className="mb-1.5">
              {entry.input !== undefined ? (
                <div className="break-all">
                  <Prompt />
                  <span className="text-fg">{entry.input}</span>
                </div>
              ) : null}
              {entry.pending ? (
                <span className="text-fg-4">…</span>
              ) : entry.output ? (
                <div className="text-fg-2">{entry.output}</div>
              ) : null}
            </div>
          ))}

          <form
            className="flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const value = input;
              setInput("");
              void run(value);
            }}
          >
            <label htmlFor="terminal-input" className="contents">
              <Prompt />
            </label>
            <input
              id="terminal-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              tabIndex={open ? 0 : -1}
              className="min-w-0 flex-1 bg-transparent text-fg caret-[var(--accent)] outline-none"
              aria-label="Terminal input"
            />
          </form>
        </div>
      </TerminalWindow>
    </div>
  );
}
