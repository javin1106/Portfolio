/**
 * One-time Spotify setup: gets a refresh token for YOUR account so the site
 * can read what you're playing.
 *
 *   1. https://developer.spotify.com/dashboard → Create app
 *        Redirect URI:  http://127.0.0.1:8888/callback
 *        APIs used:     Web API
 *   2. Put the app's Client ID and Client Secret in .env.local:
 *        SPOTIFY_CLIENT_ID=...
 *        SPOTIFY_CLIENT_SECRET=...
 *   3. npm run spotify:token   → open the printed link, approve.
 *
 * The refresh token is written into .env.local (git-ignored). Copy all three
 * variables into Vercel → Project → Settings → Environment Variables.
 */
import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";

const ENV_FILE = ".env.local";
const PORT = 8888;
const REDIRECT = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
].join(" ");

function readEnv() {
  if (!existsSync(ENV_FILE)) return {};
  return Object.fromEntries(
    readFileSync(ENV_FILE, "utf8")
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/))
      .filter(Boolean)
      .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, "")]),
  );
}

const env = { ...readEnv(), ...process.env };
const id = env.SPOTIFY_CLIENT_ID;
const secret = env.SPOTIFY_CLIENT_SECRET;

if (!id || !secret) {
  console.error(
    `\nMissing SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.\nAdd them to ${ENV_FILE} first (see the comment at the top of this script).\n`,
  );
  process.exit(1);
}

const state = randomBytes(12).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: id,
    scope: SCOPES,
    redirect_uri: REDIRECT,
    state,
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code || url.searchParams.get("state") !== state) {
    res.writeHead(400).end("Authorisation failed or was cancelled.");
    console.error("Authorisation failed:", url.searchParams.get("error") ?? "state mismatch");
    server.close();
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT }),
  });
  const json = await tokenRes.json();

  if (!json.refresh_token) {
    res.writeHead(500).end("Spotify did not return a refresh token — see the terminal.");
    console.error("Token exchange failed:", json);
    server.close();
    return;
  }

  // Replace or append SPOTIFY_REFRESH_TOKEN in .env.local
  const current = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
  const line = `SPOTIFY_REFRESH_TOKEN=${json.refresh_token}`;
  const next = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(current)
    ? current.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line)
    : `${current.replace(/\s*$/, "")}\n${line}\n`;
  writeFileSync(ENV_FILE, next);

  res.writeHead(200, { "Content-Type": "text/html" }).end(
    "<body style='font:15px system-ui;background:#0c0b0a;color:#ece6dd;display:grid;place-items:center;height:100vh'><p>✓ Connected. You can close this tab.</p></body>",
  );
  console.log(`\n✓ Saved SPOTIFY_REFRESH_TOKEN to ${ENV_FILE}.`);
  console.log("  Restart `npm run dev`, then add all three SPOTIFY_* variables on Vercel.\n");
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("\nOpen this link and approve access:\n");
  console.log(`  ${authUrl}\n`);
});
