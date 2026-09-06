"use client";

import { Download } from "./icons";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group no-print inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-1.5 font-mono text-[11px] tracking-tight text-fg-2 transition-all duration-300 hover:border-line-2 hover:text-fg"
    >
      <Download className="h-3 w-3 transition-transform duration-300 group-hover:translate-y-px" />
      Save as PDF
    </button>
  );
}
