import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { Browser } from "file:///C:/Users/mrdar/.codex/skills/taste-skill/scripts/lib/cdp.mjs";

const axePath = "C:/Users/mrdar/AppData/Local/npm-cache/_npx/e003b6b07d062486/node_modules/axe-core/axe.min.js";
const axeSource = readFileSync(axePath, "utf8");
const pages = ["index.html", "catalog.html", "product.html?id=1", "cart.html", "order.html", "contacts.html"];
const browser = await Browser.launch({ width: 1440, height: 900 });
const results = [];

try {
  const page = await browser.newPage({ width: 1440, height: 900 });
  for (const route of pages) {
    const url = `http://127.0.0.1:4173/${route}`;
    await page.goto(url, { settleMs: 800 });
    await page.send("Runtime.evaluate", { expression: axeSource }, 30000);
    const result = await page.eval(async () => {
      const audit = await axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }
      });
      return {
        title: document.title,
        violations: audit.violations.map((item) => ({
          id: item.id,
          impact: item.impact,
          help: item.help,
          nodes: item.nodes.map((node) => ({ target: node.target, summary: node.failureSummary }))
        }))
      };
    });
    results.push({ url, ...result });
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  standard: "WCAG 2.1 A/AA via axe-core",
  pages: results,
  totalViolations: results.reduce((sum, page) => sum + page.violations.length, 0)
};
mkdirSync("audit", { recursive: true });
writeFileSync("audit/accessibility.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ totalViolations: report.totalViolations, pages: results.map((page) => ({ url: page.url, violations: page.violations.length })) }, null, 2));
