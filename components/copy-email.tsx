"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = profile.links.email;
    }
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <a href={profile.links.email} className="group inline-block">
        <span className="font-mono text-[clamp(0.95rem,3.4vw,1.15rem)] tracking-tight text-fg transition-colors duration-500 group-hover:text-accent">
          {profile.email}
        </span>
        <span className="mt-1.5 block h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-md border border-dashed border-line-2 px-2.5 py-1 font-mono text-[10.5px] text-fg-3 transition-colors duration-300 hover:border-accent hover:text-accent"
        aria-live="polite"
      >
        {copied ? "copied ✓" : "copy"}
      </button>
    </div>
  );
}
