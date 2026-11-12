"use client";

import { useEffect, useRef, useState } from "react";
import type { Glyph as GlyphKind } from "@/content/profile";

/*
 * Tiny generative illustrations of what each featured project *does*,
 * drawn on canvas in the site's accent colour.
 *
 * Etiquette for anything that animates forever:
 *  - only runs while on screen and while the tab is visible;
 *  - capped at 30fps (these are slow, calm motions; 60 buys nothing);
 *  - draws one still frame for people who prefer reduced motion;
 *  - re-reads the theme colours once a second, so the accent follows the music.
 */

type Palette = { accent: string; fg: string; dim: string; faint: string };
type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, c: Palette) => void;

/*
 * The tile's four inks are set in CSS (.glyph-tile / .glyph-canvas) and read
 * back through real colour properties. getComputedStyle always resolves those
 * to plain rgb(), whatever hsl()/var() maths produced them, which a canvas
 * fillStyle can always parse.
 */
function readPalette(el: HTMLElement): Palette {
  const s = getComputedStyle(el);
  return {
    accent: s.color,
    fg: s.borderTopColor,
    dim: s.outlineColor,
    faint: s.textDecorationColor,
  };
}

function useCanvasLoop(draw: Draw) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let palette = readPalette(canvas);
    let paletteAt = 0;
    let frame = 0;
    let last = 0;
    let visible = false;
    const start = performance.now();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (now: number) => {
      if (now - paletteAt > 1000) {
        palette = readPalette(canvas);
        paletteAt = now;
      }
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, reduce ? 2.4 : (now - start) / 1000, palette);
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - last < 1000 / 30) return;
      last = now;
      paint(now);
    };

    const startLoop = () => {
      if (reduce) return paint(performance.now());
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    paint(performance.now());

    const ro = new ResizeObserver(() => {
      resize();
      paint(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) startLoop();
      else stopLoop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stopLoop() : startLoop());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [draw]);

  return ref;
}

/* ------------------------------------------------------------------------ */

const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const wave = (i: number, t: number) =>
  0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.7) * Math.cos(t * 0.53 + i * 0.6);

/** OnlyTrades — an order book breathing, with a match flashing at the spread. */
const orderbook: Draw = (ctx, w, h, t, c) => {
  const levels = 7;
  const pad = 10;
  const mid = w / 2;
  const rowH = (h - pad * 2) / levels;
  const max = mid - pad - 6;

  for (let i = 0; i < levels; i++) {
    const y = pad + i * rowH;
    const bid = (0.18 + 0.8 * wave(i, t)) * max * (1 - i * 0.04);
    const ask = (0.18 + 0.8 * wave(i + 11, t * 1.07)) * max * (1 - i * 0.04);
    const top = i === 0;

    ctx.globalAlpha = top ? 1 : 0.75 - i * 0.06;
    ctx.fillStyle = top ? c.accent : c.dim;
    ctx.fillRect(mid - 4 - bid, y, bid, rowH - 3);
    ctx.globalAlpha = top ? 0.7 : 0.5 - i * 0.04;
    ctx.fillStyle = top ? c.accent : c.faint;
    ctx.fillRect(mid + 4, y, ask, rowH - 3);
  }

  // The spread line, dotted
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = c.fg;
  for (let y = pad; y < h - pad; y += 4) ctx.fillRect(mid - 0.5, y, 1, 1);

  // A trade crossing the spread every ~1.8s
  const p = (t % 1.8) / 1.8;
  if (p < 0.4) {
    const k = p / 0.4;
    ctx.globalAlpha = 1 - k;
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mid, pad + rowH / 2 - 1, 3 + ease(k) * 12, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

/** FlokiDB — keys arriving over the wire into slots, then expiring (TTL). */
function makeKeyspace(): Draw {
  const cols = 8;
  const rows = 5;
  const slots = new Float64Array(cols * rows).fill(-99); // time each slot was last written
  const packets: { slot: number; start: number }[] = [];
  let nextSpawn = 0;
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  return (ctx, w, h, t, c) => {
    const padX = 30;
    const padY = 10;
    const cell = Math.min((w - padX - 8) / cols, (h - padY * 2) / rows);
    const gx = w - 8 - cell * cols;
    const gy = (h - cell * rows) / 2;

    if (t < nextSpawn - 5) nextSpawn = t; // clock reset (reduced motion / remount)
    while (t >= nextSpawn) {
      packets.push({ slot: Math.floor(rand() * slots.length), start: nextSpawn });
      nextSpawn += 0.28 + rand() * 0.3;
    }

    // Slots: lit when written, fading over a ~3s TTL
    for (let i = 0; i < slots.length; i++) {
      const x = gx + (i % cols) * cell;
      const y = gy + Math.floor(i / cols) * cell;
      const age = t - slots[i];
      const life = age < 3.2 ? 1 - age / 3.2 : 0;
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = c.faint;
      ctx.strokeRect(x + 1.5, y + 1.5, cell - 3, cell - 3);
      if (life > 0) {
        ctx.globalAlpha = 0.15 + life * 0.75;
        ctx.fillStyle = c.accent;
        ctx.fillRect(x + 2.5, y + 2.5, cell - 5, cell - 5);
      }
    }

    // The "socket" on the left edge
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = c.fg;
    ctx.fillRect(8, h / 2 - 7, 2, 14);

    // Packets in flight
    for (let i = packets.length - 1; i >= 0; i--) {
      const pk = packets[i];
      const k = (t - pk.start) / 0.55;
      const tx = gx + (pk.slot % cols) * cell + cell / 2;
      const ty = gy + Math.floor(pk.slot / cols) * cell + cell / 2;
      if (k >= 1) {
        slots[pk.slot] = pk.start + 0.55;
        packets.splice(i, 1);
        continue;
      }
      const e = ease(k);
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = c.accent;
      ctx.fillRect(10 + (tx - 10) * e - 1.5, h / 2 + (ty - h / 2) * e - 1.5, 3, 3);
    }
    ctx.globalAlpha = 1;
  };
}

/** GossipKaro — a message goes up to Redis and fans out to every subscriber. */
const pubsub: Draw = (ctx, w, h, t, c) => {
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.38;
  const n = 6;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(a) * r * 1.25, y: cy + Math.sin(a) * r };
  });

  const period = 1.6;
  const round = Math.floor(t / period);
  const p = (t % period) / period;
  const sender = (round * 5) % n;

  // Edges
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = c.faint;
  ctx.lineWidth = 1;
  for (const node of nodes) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(node.x, node.y);
    ctx.stroke();
  }

  // Message travels sender → hub (first 40%), then hub → everyone else
  ctx.fillStyle = c.accent;
  if (p < 0.4) {
    const k = ease(p / 0.4);
    const s = nodes[sender];
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(s.x + (cx - s.x) * k, s.y + (cy - s.y) * k, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (p < 0.85) {
    const k = ease((p - 0.4) / 0.45);
    ctx.globalAlpha = 1;
    nodes.forEach((node, i) => {
      if (i === sender) return;
      ctx.beginPath();
      ctx.arc(cx + (node.x - cx) * k, cy + (node.y - cy) * k, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Nodes, glowing when they receive
  nodes.forEach((node, i) => {
    const received = i !== sender && p > 0.8 ? 1 - (p - 0.8) / 0.2 : 0;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = received > 0 || (i === sender && p < 0.15) ? c.accent : c.dim;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 3.2 + received * 1.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // The hub
  ctx.globalAlpha = 1;
  ctx.fillStyle = p > 0.3 && p < 0.5 ? c.accent : c.fg;
  ctx.fillRect(cx - 4, cy - 4, 8, 8);
  ctx.globalAlpha = 1;
};

/** agent-core — a terminal session: you ask, it calls tools, it answers. */
const AGENT_SCRIPT = ["you", "tool", "tool", "tool", "answer", "gap"] as const;
const agent: Draw = (ctx, w, h, t, c) => {
  const lineH = 13;
  const padX = 12;
  const top = 12;
  const per = 0.62; // seconds per line
  const visible = Math.floor((h - top - 6) / lineH);
  const n = Math.floor(t / per);
  const first = Math.max(0, n - visible + 1);

  for (let i = first; i <= n; i++) {
    const kind = AGENT_SCRIPT[i % AGENT_SCRIPT.length];
    if (kind === "gap") continue;
    const y = top + (i - first) * lineH;
    const typed = Math.min(1, (t - i * per) / 0.4);
    const len = (0.35 + ((i * 37) % 50) / 100) * (w - padX * 2 - 26);

    if (kind === "you") {
      ctx.fillStyle = c.accent;
      ctx.fillRect(padX, y + 2, 5, 6);
      ctx.fillStyle = c.fg;
      ctx.fillRect(padX + 10, y + 3, len * 0.7 * typed, 4);
    } else if (kind === "tool") {
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = c.accent;
      ctx.lineWidth = 1;
      ctx.strokeRect(padX + 10.5, y + 1.5, 7, 7);
      ctx.fillStyle = c.dim;
      ctx.fillRect(padX + 22, y + 3, len * typed, 4);
      if (typed >= 1) {
        ctx.fillStyle = c.accent;
        ctx.fillRect(padX + 26 + len, y + 3, 4, 4);
      }
      ctx.globalAlpha = 1;
    } else {
      ctx.fillStyle = c.fg;
      ctx.fillRect(padX, y + 3, (len + 30) * typed, 4);
    }

    // blinking block cursor on the line being written
    if (i === n && typed < 1 && Math.floor(t * 3) % 2 === 0) {
      ctx.fillStyle = c.accent;
      ctx.fillRect(padX + 12 + len * typed, y + 1, 4, 8);
    }
  }
};

/**
 * Debris-preserving compression — a scan over a sea of pixels marks debris,
 * while the model below shrinks ½ → ¼; at ¼ it starts missing some.
 */
function makeDebris(): Draw {
  const cols = 30;
  const rows = 13;
  // deterministic texture + debris map
  const noise = Array.from({ length: cols * rows }, (_, i) => ((i * 9301 + 49297) % 233280) / 233280);
  const debris = new Set<number>();
  [
    [5, 3], [6, 3], [6, 4], [7, 4], [5, 4],
    [14, 8], [15, 8], [15, 9], [16, 9],
    [21, 2], [22, 2], [22, 3],
    [25, 9], [26, 10], [25, 10], [24, 10],
    [10, 10], [11, 10],
  ].forEach(([x, y]) => debris.add(y * cols + x));

  return (ctx, w, h, t, c) => {
    const barH = 16;
    const cell = Math.min((w - 20) / cols, (h - barH - 18) / rows);
    const gx = (w - cell * cols) / 2;
    const gy = 9;
    const cycle = 3.2;
    const phase = (t % cycle) / cycle;
    const round = Math.floor(t / cycle) % 3; // 0: full, 1: ½, 2: ¼
    const width = [1, 0.5, 0.25][round];
    const recall = [1, 0.95, 0.6][round];
    const scanX = phase * cols;

    for (let i = 0; i < cols * rows; i++) {
      const x = i % cols;
      const y = Math.floor(i / cols);
      const isDebris = debris.has(i);
      const scanned = x < scanX;
      const detected = isDebris && scanned && noise[i] < recall;

      if (detected) {
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = c.accent;
      } else if (isDebris) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = c.fg;
      } else {
        ctx.globalAlpha = 0.08 + noise[i] * 0.22;
        ctx.fillStyle = c.dim;
      }
      ctx.fillRect(gx + x * cell + 0.5, gy + y * cell + 0.5, cell - 1, cell - 1);
    }

    // scan line
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = c.accent;
    ctx.fillRect(gx + scanX * cell, gy - 2, 1.2, rows * cell + 4);

    // model width bar: 4.2M → 1.1M → 0.32M parameters
    const by = h - barH + 2;
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = c.dim;
    ctx.strokeRect(gx + 0.5, by + 0.5, cols * cell - 1, 5);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = c.fg;
    ctx.fillRect(gx + 1.5, by + 1.5, (cols * cell - 3) * width, 3);
    ctx.globalAlpha = 1;
  };
}

/**
 * MindMirror — journal entries arrive as lines of text; a mood curve is read
 * from them and drawn across the top, its points glowing on the brighter days.
 */
const mood: Draw = (ctx, w, h, t, c) => {
  const pad = 12;
  const top = 10;
  const graphH = h * 0.5;
  const step = 14;
  const shift = (t * 10) % step;
  const n = Math.ceil((w - pad * 2) / step) + 2;
  const valueAt = (k: number) =>
    0.5 + 0.32 * Math.sin(k * 0.55) * Math.cos(k * 0.23) + 0.12 * Math.sin(k * 1.7);
  const base = Math.floor((t * 10) / step);

  // the curve
  ctx.globalAlpha = 0.9;
  ctx.strokeStyle = c.fg;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x = pad + i * step - shift;
    const y = top + graphH * (1 - valueAt(base + i));
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // readings: bright days in the accent
  for (let i = 0; i < n; i++) {
    const v = valueAt(base + i);
    const x = pad + i * step - shift;
    const y = top + graphH * (1 - v);
    if (x < pad - 2 || x > w - pad + 2) continue;
    ctx.globalAlpha = 1;
    ctx.fillStyle = v > 0.62 ? c.accent : c.dim;
    ctx.beginPath();
    ctx.arc(x, y, v > 0.62 ? 2.6 : 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // journal lines underneath, scrolling with the curve
  const lineY = top + graphH + 10;
  for (let r = 0; r < 3; r++) {
    for (let i = 0; i < n; i++) {
      const x = pad + i * step - shift;
      const len = 5 + (((base + i) * 7 + r * 13) % 8);
      if (x < pad || x + len > w - pad) continue;
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = c.dim;
      ctx.fillRect(x, lineY + r * 7, len, 3);
    }
  }
  ctx.globalAlpha = 1;
};

/**
 * Mental Health in Tech — k-means at work: centroids start somewhere random,
 * then step toward their clusters while the points recolour around them.
 */
function makeClusters(): Draw {
  let seed = 11;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const centres = [
    [0.25, 0.4],
    [0.62, 0.68],
    [0.78, 0.3],
  ];
  const points = Array.from({ length: 54 }, (_, i) => {
    const [cx, cy] = centres[i % 3];
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.15;
    return [cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r];
  });
  const starts = Array.from({ length: 3 }, () => [0.2 + rand() * 0.6, 0.2 + rand() * 0.6]);

  return (ctx, w, h, t, c) => {
    const cycle = 4.5;
    const k = Math.min(1, ((t % cycle) / cycle) * 1.6); // converge, then hold
    const ease = 1 - Math.pow(1 - k, 3);
    const cents = starts.map(([sx, sy], i) => [
      sx + (centres[i][0] - sx) * ease,
      sy + (centres[i][1] - sy) * ease,
    ]);
    const inks = [c.accent, c.fg, c.dim];

    for (const [px, py] of points) {
      let best = 0;
      let bestD = Infinity;
      cents.forEach(([cx, cy], i) => {
        const d = (px - cx) ** 2 + (py - cy) ** 2;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = inks[best];
      ctx.beginPath();
      ctx.arc(px * w, py * h, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }

    cents.forEach(([cx, cy], i) => {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = inks[i];
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx * w - 4.5, cy * h - 4.5, 9, 9);
    });
    ctx.globalAlpha = 1;
  };
}

/* ------------------------------------------------------------------------ */

export function Glyph({ kind, label }: { kind: GlyphKind; label: string }) {
  // Keyspace keeps state between frames, so each canvas gets its own instance.
  // Stateful sketches (keyspace) get their own instance per canvas.
  const [draw] = useState<Draw>(() => {
    switch (kind) {
      case "orderbook":
        return orderbook;
      case "pubsub":
        return pubsub;
      case "agent":
        return agent;
      case "debris":
        return makeDebris();
      case "mood":
        return mood;
      case "clusters":
        return makeClusters();
      default:
        return makeKeyspace();
    }
  });
  const ref = useCanvasLoop(draw);

  return <canvas ref={ref} className="glyph-canvas block h-full w-full" role="img" aria-label={label} />;
}
