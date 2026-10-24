// Visual verification: drives the locally installed Chrome, saves screenshots to docs/shots/<name>/.
// Usage: node scripts/shoot.mjs [name] [width] [height]   (dev server must be running on :3000)
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const name = process.argv[2] ?? "run";
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);
const base = process.env.BASE ?? "http://localhost:3000";
const out = `docs/shots/${name}`;
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--use-angle=d3d11", "--ignore-gpu-blocklist", "--enable-gpu-rasterization", "--enable-webgl"],
});
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => (m.type() === "error" ? errors.push(m.text()) : null));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(`${base}/?intro=1`, { waitUntil: "domcontentloaded" });

// Loader frames
const t0 = Date.now();
for (const ms of [600, 1500, 2600, 3600, 4300, 4900, 5600, 6500]) {
  const wait = ms - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.screenshot({ path: `${out}/loader-${String(ms).padStart(4, "0")}.png` });
}
await page.waitForFunction(() => document.getElementById("preloader")?.style.display === "none", null, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(2500);
await page.screenshot({ path: `${out}/hero.png` });

// Sections
const fps = await page.evaluate(
  () =>
    new Promise((r) => {
      let n = 0;
      const t = performance.now();
      const f = () => (performance.now() - t > 1500 ? r(n / 1.5) : (n++, requestAnimationFrame(f)));
      requestAnimationFrame(f);
    }),
);
console.log("fps (idle, hero):", fps.toFixed(1));

const ids = ["profile", "experience", "work", "skills", "education", "contact"];
for (const id of ids) {
  await page.evaluate((i) => {
    const el = document.getElementById(i);
    const y = el.getBoundingClientRect().top + window.scrollY;
    (window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y));
  }, id);
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/${id}-a.png` });
  await page.mouse.wheel(0, Math.round(height * 0.7));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${out}/${id}-b.png` });
}

console.log("console/page errors:", errors.length ? errors : "none");
await browser.close();
