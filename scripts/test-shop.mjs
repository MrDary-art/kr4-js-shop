import { mkdirSync, writeFileSync } from "node:fs";
import { Browser, sleep } from "file:///C:/Users/mrdar/.codex/skills/taste-skill/scripts/lib/cdp.mjs";

const browser = await Browser.launch({ width: 1280, height: 900 });
const checks = [];
const record = (name, pass, details = "") => checks.push({ name, pass: Boolean(pass), details });

try {
  const page = await browser.newPage({ width: 1280, height: 900 });
  await page.goto("http://127.0.0.1:4173/catalog.html", { settleMs: 700 });
  await page.eval(() => localStorage.clear());
  await page.goto("http://127.0.0.1:4173/catalog.html", { settleMs: 700 });

  let state = await page.eval(() => ({ count: document.querySelectorAll(".product-card").length }));
  record("Каталог содержит 12 товаров", state.count === 12, `Получено: ${state.count}`);

  state = await page.eval(async () => {
    const input = document.querySelector("#catalog-search");
    input.value = "пион";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 120));
    return { count: document.querySelectorAll(".product-card").length, status: document.querySelector("[data-results-count]").textContent };
  });
  record("Поиск фильтрует карточки", state.count > 0 && state.count < 12, `${state.status}; карточек: ${state.count}`);

  state = await page.eval(async () => {
    const input = document.querySelector("#catalog-search");
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    const select = document.querySelector("#catalog-category");
    select.value = "author";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 120));
    return document.querySelectorAll(".product-card").length;
  });
  record("Фильтр категории работает", state > 0 && state < 12, `Карточек: ${state}`);

  state = await page.eval(async () => {
    document.querySelector("[data-catalog-controls]").reset();
    await new Promise((resolve) => setTimeout(resolve, 120));
    document.querySelector("[data-action='quick-view']").click();
    await new Promise((resolve) => setTimeout(resolve, 80));
    return { open: document.querySelector("[data-quick-view]").open, title: document.querySelector("#quick-view-title")?.textContent };
  });
  record("Быстрый просмотр открывается как dialog", state.open && state.title, state.title || "Нет заголовка");

  state = await page.eval(() => {
    document.querySelector("[data-quick-view] [data-action='add']").click();
    const cart = JSON.parse(localStorage.getItem("flora-cart-v1") || "[]");
    return { cart, badge: document.querySelector("[data-cart-count]").textContent };
  });
  record("Добавление в корзину сохраняется", state.cart.length === 1 && state.badge === "1", JSON.stringify(state));

  await page.goto("http://127.0.0.1:4173/cart.html", { settleMs: 700 });
  state = await page.eval(() => {
    document.querySelector("[data-action='increase']").click();
    const promo = document.querySelector("#promo-code");
    promo.value = "FLORA10";
    document.querySelector("[data-promo-form]").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    return {
      quantity: document.querySelector(".quantity-control span").textContent,
      promo: document.querySelector("[data-promo-message]").textContent,
      discount: document.querySelector("[data-cart-discount]").textContent
    };
  });
  record("Количество и промокод пересчитывают корзину", state.quantity === "2" && /10%/.test(state.promo) && state.discount !== "0 ₽", JSON.stringify(state));

  await page.goto("http://127.0.0.1:4173/order.html", { settleMs: 700 });
  state = await page.eval(() => {
    document.querySelector("[data-order-form]").requestSubmit();
    return {
      invalid: document.querySelectorAll("[aria-invalid='true']").length,
      errors: [...document.querySelectorAll(".field-error")].filter((node) => node.textContent.trim()).length
    };
  });
  record("Пустая форма показывает ошибки без alert", state.invalid >= 6 && state.errors >= 6, JSON.stringify(state));

  state = await page.eval(() => {
    const values = {
      name: "Анна",
      email: "anna@example.com",
      phone: "+7 999 123-45-67",
      recipient: "Мария",
      date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
      address: "Москва, Цветной бульвар, 15"
    };
    Object.entries(values).forEach(([name, value]) => {
      const field = document.querySelector(`[name='${name}']`);
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("blur", { bubbles: true }));
    });
    document.querySelector("[name='consent']").checked = true;
    document.querySelector("[name='consent']").dispatchEvent(new Event("change", { bubbles: true }));
    document.querySelector("[data-order-form]").requestSubmit();
    return {
      successVisible: !document.querySelector("[data-order-success]").hidden,
      successText: document.querySelector("[data-success-text]").textContent
    };
  });
  record("Валидная форма формирует заявку", state.successVisible && /№\d{6}/.test(state.successText), state.successText);

  await sleep(100);
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: checks.filter((check) => check.pass).length,
  failed: checks.filter((check) => !check.pass).length,
  checks
};
mkdirSync("audit", { recursive: true });
writeFileSync("audit/functional.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
if (report.failed) process.exitCode = 1;
