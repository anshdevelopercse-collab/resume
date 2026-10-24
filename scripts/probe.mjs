// Ad-hoc probe: node scripts/probe.mjs  (dev server on :3000)
import { chromium } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true, args: ["--use-angle=d3d11", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/?intro=1", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => document.getElementById("preloader")?.style.display === "none", null, { timeout: 30000 });
await page.waitForTimeout(1500);

const info = await page.evaluate(() => {
  const skills = document.getElementById("skills");
  const r = skills.getBoundingClientRect();
  return { skillsTop: r.top + scrollY, docH: document.body.scrollHeight, st: window.ScrollTrigger ? 1 : 0 };
});
console.log(info);
await page.evaluate((y) => window.__lenis.scrollTo(y + 500, { immediate: true }), info.skillsTop);
await page.waitForTimeout(3500);
const state = await page.evaluate(() => ({
  scrollY,
  items: [...document.querySelectorAll("[data-skill]")].slice(0, 4).map((e) => ({ op: getComputedStyle(e).opacity, vis: getComputedStyle(e).visibility, f: getComputedStyle(e).filter, r: e.getBoundingClientRect().top })),
  rowTop: document.querySelector("[data-skill-row]").getBoundingClientRect().top,
}));
console.log(JSON.stringify(state, null, 1));
await browser.close();
