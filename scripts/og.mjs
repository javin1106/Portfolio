/**
 * Renders /og-preview at 1200x630 into public/og.png using headless Chrome,
 * so the share card uses the real fonts and photograph.
 *
 *   1. npm run dev          (in another terminal)
 *   2. npm run og
 *
 * Override the origin or the browser if yours live elsewhere:
 *   OG_URL=http://localhost:3111 CHROME_PATH="/path/to/chrome" npm run og
 */
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const ORIGIN = process.env.OG_URL ?? "http://localhost:3000";
const OUT = "public/og.png";
const PORT = 9444;

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const { existsSync } = await import("node:fs");
const chromePath = CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error("No Chrome/Edge found. Set CHROME_PATH to your browser binary.");
  process.exit(1);
}

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    `--remote-debugging-port=${PORT}`,
    "--window-size=1200,630",
    "about:blank",
  ],
  { stdio: "ignore" },
);

let ws;
let id = 0;
const pending = new Map();
const send = (method, params = {}) => {
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((resolve, reject) => pending.set(msgId, { resolve, reject }));
};

let wsUrl;
for (let i = 0; i < 60 && !wsUrl; i++) {
  try {
    const targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
    wsUrl = targets.find((t) => t.type === "page")?.webSocketDebuggerUrl;
  } catch {
    /* still starting */
  }
  if (!wsUrl) await sleep(250);
}
if (!wsUrl) {
  console.error("Chrome did not expose a debugging target.");
  chrome.kill();
  process.exit(1);
}

ws = new WebSocket(wsUrl);
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  const slot = msg.id && pending.get(msg.id);
  if (!slot) return;
  pending.delete(msg.id);
  if (msg.error) slot.reject(new Error(msg.error.message));
  else slot.resolve(msg.result);
};

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1200,
  height: 630,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: `${ORIGIN}/og-preview` });
await sleep(4000); // fonts + photograph

const { data } = await send("Page.captureScreenshot", {
  format: "png",
  clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 },
  captureBeyondViewport: true,
});

mkdirSync("public", { recursive: true });
writeFileSync(OUT, Buffer.from(data, "base64"));
console.log(`wrote ${OUT} (1200x630)`);

ws.close();
chrome.kill();
process.exit(0);
