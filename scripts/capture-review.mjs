import { mkdirSync } from "node:fs";
import { Browser } from "file:///C:/Users/mrdar/.codex/skills/taste-skill/scripts/lib/cdp.mjs";

mkdirSync(".impeccable/review", { recursive: true });
const browser = await Browser.launch({ width: 1440, height: 900 });
try {
  const desktop = await browser.newPage({ width: 1440, height: 900 });
  await desktop.goto("http://127.0.0.1:4173/index.html", { settleMs: 1000 });
  await desktop.screenshot({ path: ".impeccable/review/desktop.png", format: "png" });
  await desktop.close();

  const mobile = await browser.newPage({ width: 390, height: 844, mobile: true, dsf: 1 });
  await mobile.goto("http://127.0.0.1:4173/index.html", { settleMs: 1000 });
  await mobile.screenshot({ path: ".impeccable/review/mobile.png", format: "png" });
  await mobile.close();
} finally {
  await browser.close();
}
