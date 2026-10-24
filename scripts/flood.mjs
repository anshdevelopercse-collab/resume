// Captures the flood + drain of the preloader: node scripts/flood.mjs [name]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const out = `docs/shots/${process.argv[2] ?? "flood"}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=d3d11", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/?intro=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.querySelector("#preloader span.font-mono")?.textContent === "100", null, { timeout: 30000, polling: 30 });
const t0 = Date.now();
let i = 0;
while (Date.now() - t0 < 3600) {
  await page.screenshot({ path: `${out}/f${String(i++).padStart(2, "0")}-${Date.now() - t0}ms.png` });
}
await browser.close();
console.log("frames:", i);
