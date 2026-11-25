// Records the ASCII Paper fluid wallpaper as a seamless, looping banner.
//   node record-banner.mjs            -> frames/banner.webp + frames/banner.gif + still.png
// Frames come from the real engine: the page in wall.html runs asciipaper.ascii with the
// fluid-field wake, driven along a slow path so it animates with nobody at the mouse.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, rmSync, readdirSync, copyFileSync } from "node:fs";

const HS = "/home/gustvmar/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell";
const DIR = new URL(".", import.meta.url).pathname;
const OUT = new URL("../assets/", import.meta.url).pathname;
const W = Number(process.env.W || 1000), H = Number(process.env.H || 280);
const FPS = Number(process.env.FPS || 12), SECONDS = Number(process.env.SEC || 3.2);
const CELL = Number(process.env.CELL || 8), Q = process.env.Q || "62", COLORS = process.env.COLORS || "40";
const fetch_n = Math.round(FPS * SECONDS);
const sleep = ms => new Promise(r => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });
const frames = `${DIR}/frames`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const port = 9310;
const chrome = spawn(HS, [`--remote-debugging-port=${port}`, "--no-sandbox", "--allow-file-access-from-files",
  "--force-color-profile=srgb", `--window-size=${W + 20},${H + 20}`, "about:blank"], { stdio: "ignore" });
await sleep(1800);

const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const ws = new WebSocket(tabs.find(t => t.type === "page").webSocketDebuggerUrl);
let id = 0; const pending = new Map(); const logs = [];
const onFrame = [];

ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
  if (m.method === "Page.screencastFrame") {
    onFrame.push(m.params.data);
    ws.send(JSON.stringify({ id: ++id, method: "Page.screencastFrameAck", params: { sessionId: m.params.sessionId } }));
  }
  if (m.method === "Runtime.exceptionThrown") logs.push("EXC " + JSON.stringify(m.params.exceptionDetails).slice(0, 300));
  if (m.method === "Log.entryAdded" && m.params.entry.level === "error") logs.push("LOG " + m.params.entry.text.slice(0, 200));
};
await new Promise(r => ws.onopen = r);
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Runtime.enable"); await send("Log.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: `file://${DIR}/wall.html?cell=${CELL}` });
await sleep(1200);   // let the font load and the first strokes build up

const ready = await send("Runtime.evaluate", { returnByValue: true, expression: "JSON.stringify({ready: !!window.__ready, err: window.__err || null, cols: (window.asciipaper&&1)||0})" });
console.log("page:", JSON.stringify(ready.result?.result?.value), logs.join(" | "));

await send("Page.startScreencast", { format: "png", maxWidth: W, maxHeight: H, everyNthFrame: 1 });
const t0 = Date.now();
while (onFrame.length < fetch_n && Date.now() - t0 < 40000) await sleep(60);
await send("Page.stopScreencast");

const shot = await send("Page.captureScreenshot", { format: "png" });
writeFileSync(`${DIR}/still.png`, Buffer.from(shot.result.data, "base64"));

// keep at most fetch_n frames, then ping-pong so the loop has no seam
const seq = onFrame.slice(0, fetch_n);
console.log("frames captured:", seq.length);
seq.forEach((b64, i) => writeFileSync(`${frames}/f${String(i).padStart(3, "0")}.png`, Buffer.from(b64, "base64")));
[...seq.slice(1, -1).reverse()].forEach((b64, i) => writeFileSync(`${frames}/f${String(seq.length + i).padStart(3, "0")}.png`, Buffer.from(b64, "base64")));

const total = readdirSync(frames).filter(f => f.endsWith(".png")).length;
console.log("ping-pong frames:", total);

const run = (args) => new Promise((res, rej) => {
  const p = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "pipe"] });
  let err = ""; p.stderr.on("data", d => err += d);
  p.on("close", c => c === 0 ? res() : rej(new Error(err.slice(-800))));
});

const input = ["-framerate", String(FPS), "-i", `${frames}/f%03d.png`];
await run(["-y", ...input, "-c:v", "libwebp_anim", "-loop", "0", "-q:v", Q, "-compression_level", "6", `${OUT}/banner.webp`]);
await run(["-y", ...input, "-vf", "split[a][b];[a]palettegen=max_colors=" + COLORS + ":stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
  "-loop", "0", `${OUT}/banner.gif`]);
copyFileSync(`${DIR}/still.png`, `${OUT}/still.png`);

ws.close(); chrome.kill();
console.log("done");
process.exit(0);
