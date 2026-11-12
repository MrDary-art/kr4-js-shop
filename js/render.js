import { formatPrice, getProduct, occasionLabels } from "./data.js";

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function heartIcon(filled = false) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z");
  path.setAttribute("fill", filled ? "currentColor" : "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
}

function cartIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6.1M10 20.1h.01M17 20.1h.01");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
}

function trashIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M5 7h14M10 11v6M14 11v6M9 7l1-2h4l1 2M7 7l.7 13h8.6L17 7");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "1.8");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.append(path);
  return svg;
}

const bouquetPalettes = [
  ["#dea0b1", "#f6d2d7", "#8e9d72", "#b25b75", "#fff5f1"],
  ["#fff6d7", "#f2ead0", "#9da777", "#d2b878", "#fffcf2"],
  ["#d999a6", "#f3c2cc", "#667957", "#a3516c", "#fff4f4"],
  ["#eee6cf", "#fffaf0", "#93a074", "#cdb98a", "#fffdf8"],
  ["#e88572", "#f4b6a8", "#6f8f69", "#b85e62", "#fff0eb"],
  ["#b298c8", "#e1c2da", "#75906e", "#8965a0", "#fbf2ff"],
  ["#eca0b7", "#f5d3dc", "#768f67", "#bc6381", "#fff5f7"],
  ["#fff6db", "#f8edd0", "#79916a", "#c9ab6d", "#fffdf1"],
  ["#e497ac", "#f1c5d2", "#738c70", "#a84e6d", "#fff5f7"],
  ["#f0cf6c", "#fff5bd", "#85a176", "#d79b4d", "#fffdf2"],
  ["#9d2943", "#e198a7", "#69795c", "#70152b", "#fff3f4"],
  ["#c6a4d6", "#f0bdd1", "#759976", "#9a689d", "#fff5fb"]
];

function svgElement(tag, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, String(value)));
  return node;
}

function flower(svg, x, y, size, colors, petalFill, rotation = 0) {
  const group = svgElement("g", { transform: `rotate(${rotation} ${x} ${y})` });
  for (let petal = 0; petal < 12; petal += 1) {
    group.append(svgElement("ellipse", {
      cx: x,
      cy: y - size * .34,
      rx: size * .265,
      ry: size * .51,
      fill: petalFill,
      opacity: .9,
      stroke: colors[0],
      "stroke-opacity": .17,
      "stroke-width": 1.2,
      transform: `rotate(${petal * 30} ${x} ${y})`
    }));
  }
  for (let petal = 0; petal < 10; petal += 1) {
    group.append(svgElement("ellipse", {
      cx: x,
      cy: y - size * .18,
      rx: size * .15,
      ry: size * .31,
      fill: colors[1],
      opacity: .92,
      transform: `rotate(${petal * 36 + 18} ${x} ${y})`
    }));
  }
  group.append(svgElement("circle", { cx: x, cy: y, r: size * .19, fill: colors[0], opacity: .9 }));
  group.append(svgElement("circle", { cx: x, cy: y, r: size * .115, fill: colors[3] }));
  group.append(svgElement("circle", { cx: x - size * .035, cy: y - size * .05, r: size * .043, fill: colors[4], opacity: .86 }));
  svg.append(group);
}

function bouquetIllustration(product, variant = 0, className = "") {
  const colors = bouquetPalettes[(product.id - 1) % bouquetPalettes.length];
  const petalId = `petal-${product.id}-${variant}`;
  const leafId = `leaf-${product.id}-${variant}`;
  const viewBox = variant === 2
    ? "72 92 216 218"
    : variant === 1
      ? "48 74 270 326"
      : "34 64 292 336";
  const svg = svgElement("svg", {
    viewBox,
    class: `product-illustration product-illustration--${(product.id - 1) % bouquetPalettes.length} ${className}`.trim(),
    role: "img",
    "aria-label": product.alt,
    focusable: "false"
  });
  const title = svgElement("title");
  title.textContent = product.alt;
  svg.append(title);

  const defs = svgElement("defs");
  const petalGradient = svgElement("radialGradient", { id: petalId, cx: "34%", cy: "27%", r: "74%" });
  [["0%", colors[4]], ["44%", colors[1]], ["100%", colors[0]]].forEach(([offset, color]) => {
    petalGradient.append(svgElement("stop", { offset, "stop-color": color }));
  });
  const leafGradient = svgElement("linearGradient", { id: leafId, x1: "0", y1: "0", x2: "1", y2: "1" });
  leafGradient.append(svgElement("stop", { offset: "0%", "stop-color": colors[2] }));
  leafGradient.append(svgElement("stop", { offset: "100%", "stop-color": "#475541" }));
  defs.append(petalGradient, leafGradient);
  svg.append(defs);

  const scene = svgElement("g", { transform: `translate(-24 -18) scale(1.13) rotate(${[-3, 2, 5][variant] || 0} 180 230)` });
  scene.append(svgElement("path", { d: "M76 174 180 410 284 174 243 132 180 164 116 132Z", fill: colors[4], opacity: .95 }));
  scene.append(svgElement("path", { d: "M64 178 180 398 142 164 103 138Z", fill: colors[1], opacity: .92 }));
  scene.append(svgElement("path", { d: "M296 178 180 398 218 164 257 138Z", fill: colors[0], opacity: .9 }));
  scene.append(svgElement("path", { d: "M178 173 152 401M181 171l34 230M165 180l-36 200M194 180l38 194", stroke: colors[2], "stroke-width": 5, "stroke-linecap": "round" }));

  const leaves = [[102, 184, -28], [130, 141, 35], [226, 144, -32], [258, 190, 31], [92, 228, 24], [270, 230, -24]];
  leaves.forEach(([x, y, rotate], index) => scene.append(svgElement("ellipse", {
    cx: x,
    cy: y,
    rx: 11 + (index % 2) * 3,
    ry: 25,
    fill: `url(#${leafId})`,
    opacity: .92,
    transform: `rotate(${rotate} ${x} ${y})`
  })));

  const positions = variant === 1
    ? [[179, 142, 49, 0], [126, 176, 36, 16], [229, 181, 39, -14], [163, 211, 33, 31], [207, 224, 31, -29], [108, 220, 25, 10]]
    : variant === 2
      ? [[182, 151, 50, 7], [132, 167, 34, -12], [235, 171, 36, 17], [154, 215, 31, 27], [208, 221, 35, -23], [112, 212, 25, 0]]
      : [[180, 149, 51, 0], [126, 174, 37, 15], [232, 177, 39, -13], [157, 215, 31, 29], [210, 219, 34, -28], [108, 217, 24, 8]];
  positions.forEach(([x, y, size, rotate]) => {
    const flowerGroup = svgElement("g");
    flower(flowerGroup, x, y, size, colors, `url(#${petalId})`, rotate);
    scene.append(flowerGroup);
  });

  [[82, 151], [101, 158], [256, 151], [279, 165], [88, 203], [275, 202]].forEach(([x, y], index) => {
    scene.append(svgElement("circle", { cx: x, cy: y, r: 4 + (index % 2), fill: colors[3], opacity: .83 }));
    scene.append(svgElement("circle", { cx: x + 8, cy: y - 7, r: 3, fill: colors[0], opacity: .85 }));
  });

  scene.append(svgElement("path", { d: "M135 309c15-16 75-16 90 0-10 14-24 22-45 22s-35-8-45-22Z", fill: colors[3], opacity: .98 }));
  scene.append(svgElement("path", { d: "M180 323c-28 0-48 16-48 31 18 3 32-1 48-14 16 13 30 17 48 14 0-15-20-31-48-31Z", fill: colors[0] }));
  svg.append(scene);
  return svg;
}

function productImage(product) {
  const image = element("img", "product-card__image");
  image.src = product.cardImage || product.image;
  if (product.cardImage) {
    const responsiveName = product.cardImage.split("/").at(-1).replace(/\.png$/i, "-480.png");
    image.srcset = `${product.image} 354w, images/responsive/${responsiveName} 480w, ${product.cardImage} 1254w`;
    image.sizes = "(max-width: 41.99rem) calc(50vw - 1.5rem), (max-width: 75rem) 33vw, 24vw";
  }
  image.alt = product.alt;
  image.width = 1254;
  image.height = 1254;
  image.loading = "lazy";
  image.decoding = "async";
  return image;
}

export function createProductCard(product, favorites = []) {
  const article = element("article", "product-card");
  article.dataset.productId = product.id;

  const media = element("div", "product-card__media");
  const imageLink = element("a");
  imageLink.href = `product.html?id=${product.id}`;
  imageLink.setAttribute("aria-label", `Открыть букет «${product.name}»`);
  imageLink.append(productImage(product));
  media.append(imageLink);

  if (product.badge) media.append(element("span", "product-card__badge", product.badge));

  const favorite = element("button", "icon-button product-card__favorite");
  const isFavorite = favorites.includes(product.id);
  favorite.type = "button";
  favorite.dataset.action = "favorite";
  favorite.dataset.id = product.id;
  favorite.setAttribute("aria-label", isFavorite ? `Убрать «${product.name}» из избранного` : `Добавить «${product.name}» в избранное`);
  favorite.setAttribute("aria-pressed", String(isFavorite));
  favorite.append(heartIcon(isFavorite));
  media.append(favorite);

  const body = element("div", "product-card__body");
  const title = element("h3");
  const titleLink = element("a", "", product.name);
  titleLink.href = `product.html?id=${product.id}`;
  title.append(titleLink);
  const meta = element("p", "product-card__meta", `${product.categoryLabel} · ${product.composition}`);
  const footer = element("div", "product-card__footer");
  footer.append(element("p", "product-card__price", formatPrice(product.price)));
  const actions = element("div", "product-card__actions");
  const quick = element("button", "button button--quiet", "Быстрый просмотр");
  quick.type = "button";
  quick.dataset.action = "quick-view";
  quick.dataset.id = product.id;
  const add = element("button", "icon-button product-card__cart");
  add.type = "button";
  add.dataset.action = "add";
  add.dataset.id = product.id;
  add.setAttribute("aria-label", `Добавить «${product.name}» в корзину`);
  add.title = "В корзину";
  add.append(cartIcon());
  actions.append(quick, add);
  footer.append(actions);
  body.append(title, meta, footer);
  article.append(media, body);
  return article;
}

export function renderProductGrid(container, items, favorites = []) {
  const fragment = document.createDocumentFragment();
  items.forEach((product) => fragment.append(createProductCard(product, favorites)));
  container.replaceChildren(fragment);
}

function factsList(product) {
  const list = element("dl", "product-detail__facts");
  const facts = [
    ["Состав", product.composition],
    ["Размер", product.size],
    ["Поводы", product.occasions.map((occasion) => occasionLabels[occasion]).join(", ")],
    ["Наличие", product.available ? "Можно заказать сегодня" : "Уточните наличие"]
  ];
  facts.forEach(([term, description]) => {
    const row = element("div");
    row.append(element("dt", "", term), element("dd", "", description));
    list.append(row);
  });
  return list;
}

function productGallery(product, className = "") {
  const gallery = element("div", `product-gallery ${className}`.trim());
  const stage = element("div", "product-gallery__stage");
  const thumbs = element("div", "product-gallery__thumbs");
  const variants = [0, 1, 2];
  const angleLabels = ["прямой ракурс", "вид сверху", "ракурс 3/4 сверху"];
  const slug = product.image.split("/").at(-1).replace(/^bouquet-/, "").replace(/\.jpg$/i, "");
  const gallerySources = [
    `images/gallery/${slug}-front.png`,
    `images/gallery/${slug}-top.png`,
    `images/gallery/${slug}-three-quarter.png`
  ];

  const galleryImage = (variant, isThumbnail = false) => {
    const image = element("img", `product-gallery__image product-gallery__image--${variant}`);
    image.src = isThumbnail
      ? `images/responsive/${slug}-${["front", "top", "three-quarter"][variant]}-640.png`
      : gallerySources[variant];
    if (!isThumbnail) {
      image.srcset = `images/responsive/${slug}-${["front", "top", "three-quarter"][variant]}-640.png 640w, ${gallerySources[variant]} 1254w`;
      image.sizes = "(max-width: 55.99rem) calc(100vw - 2rem), 48vw";
    }
    image.alt = isThumbnail ? "" : `${product.alt}, ${angleLabels[variant]}`;
    image.width = 1254;
    image.height = 1254;
    image.loading = "lazy";
    image.decoding = "async";
    if (isThumbnail) image.setAttribute("aria-hidden", "true");
    return image;
  };

  const showVariant = (variant) => {
    stage.replaceChildren(galleryImage(variant));
    thumbs.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.variant) === variant));
    });
  };

  variants.forEach((variant) => {
    const button = element("button", "product-gallery__thumb");
    button.type = "button";
    button.dataset.variant = String(variant);
    button.setAttribute("aria-label", `Показать ${angleLabels[variant]} букета «${product.name}»`);
    button.setAttribute("aria-pressed", String(variant === 0));
    button.append(galleryImage(variant, true));
    button.addEventListener("click", () => showVariant(variant));
    thumbs.append(button);
  });

  showVariant(0);
  gallery.append(stage, thumbs);
  return gallery;
}

function productJournal(product) {
  const journal = element("section", "product-detail__journal");
  const copy = [
    "Каждый стебель проверяем перед сборкой: композиция сохранит линию, объём и настроение в дороге.",
    "Флорист собирает букет после подтверждения заказа, поэтому оттенки в рамках выбранной палитры остаются живыми и свежими.",
    "Композицию можно адаптировать под получателя: добавьте пожелание к записке или укажите нежелательные цветы."
  ][(product.id - 1) % 3];
  const care = product.category === "mono" ? "Меняйте воду каждый день и обновляйте срез на 1 см." : "Поставьте в прохладную воду, меняйте её раз в 1–2 дня и держите букет вдали от батареи.";
  const title = element("h2", "", "О букете подробнее");
  const intro = element("p", "product-detail__journal-copy", copy);
  const list = element("dl", "product-detail__journal-facts");
  [
    ["Стойкость", product.category === "mono" ? "до 6 дней" : "5–7 дней"],
    ["Уход", care],
    ["Сборка", `под заказ, ориентировочно ${18 + product.id * 2} стеблей`]
  ].forEach(([term, description]) => {
    const row = element("div");
    row.append(element("dt", "", term), element("dd", "", description));
    list.append(row);
  });
  journal.append(title, intro, list);
  return journal;
}

export function renderQuickView(container, product) {
  const layout = element("div", "quick-view__layout");
  layout.append(productGallery(product, "quick-view__gallery"));
  const copy = element("div", "quick-view__copy");
  const label = element("p", "section-note", product.categoryLabel);
  const title = element("h2", "", product.name);
  title.id = "quick-view-title";
  const description = element("p", "", product.description);
  const price = element("p", "product-detail__price", formatPrice(product.price));
  const actions = element("div", "product-detail__actions");
  const iconActions = element("div", "quick-view__icon-actions");
  const details = element("a", "button button--quiet", "Подробнее");
  details.href = `product.html?id=${product.id}`;
  const add = element("button", "quick-view__add");
  add.type = "button";
  add.dataset.action = "add";
  add.dataset.id = product.id;
  add.setAttribute("aria-label", `Добавить «${product.name}» в корзину`);
  add.setAttribute("title", "Добавить в корзину");
  add.append(cartIcon());
  iconActions.append(add);
  actions.append(details, iconActions);
  copy.append(title, label, description, price, factsList(product), actions);
  layout.append(copy);
  container.replaceChildren(layout);
}

export function renderProductDetail(container, product, isFavorite = false) {
  const media = element("div", "product-detail__media");
  media.append(productGallery(product, "product-detail__gallery"));
  const content = element("div", "product-detail__content");
  content.append(element("h1", "", product.name));
  content.append(element("p", "section-note", product.categoryLabel));
  content.append(element("p", "product-detail__lead", product.description));
  const purchase = element("div", "product-detail__purchase");
  purchase.append(element("p", "product-detail__price", formatPrice(product.price)));
  const actions = element("div", "product-detail__actions product-detail__icon-actions");
  const add = element("button", "product-detail__icon-action product-detail__icon-action--cart");
  add.type = "button";
  add.dataset.action = "add";
  add.dataset.id = product.id;
  add.setAttribute("aria-label", `Добавить «${product.name}» в корзину`);
  add.setAttribute("title", "Добавить в корзину");
  add.append(cartIcon());
  const favorite = element("button", "product-detail__icon-action product-detail__icon-action--favorite");
  favorite.type = "button";
  favorite.dataset.action = "favorite";
  favorite.dataset.id = product.id;
  favorite.setAttribute("aria-pressed", String(isFavorite));
  favorite.setAttribute("aria-label", isFavorite ? `Убрать «${product.name}» из избранного` : `Добавить «${product.name}» в избранное`);
  favorite.setAttribute("title", isFavorite ? "Убрать из избранного" : "Добавить в избранное");
  favorite.append(heartIcon(isFavorite));
  actions.append(add, favorite);
  purchase.append(actions);
  content.append(purchase);
  content.append(factsList(product));
  content.append(productJournal(product));
  container.replaceChildren(media, content);
}

export function renderCart(container, cart) {
  const fragment = document.createDocumentFragment();
  cart.forEach((item) => {
    const product = getProduct(item.id);
    if (!product) return;
    const article = element("article", "cart-item");
    article.dataset.productId = product.id;
    const visual = element("div", "cart-item__visual");
    visual.append(productImage(product));
    const body = element("div", "cart-item__body");
    const copy = element("div", "cart-item__copy");
    const title = element("h3");
    const link = element("a", "", product.name);
    link.href = `product.html?id=${product.id}`;
    title.append(link);
    const category = element("p", "cart-item__category", product.categoryLabel);
    const composition = element("p", "cart-item__composition", `Состав: ${product.composition}`);
    copy.append(category, title, composition);
    const price = element("p", "cart-item__price", formatPrice(product.price * item.quantity));
    const unitPrice = element("span", "cart-item__unit-price", `${formatPrice(product.price)} за букет`);
    const priceGroup = element("div", "cart-item__price-group");
    priceGroup.append(price, unitPrice);
    const actions = element("div", "cart-item__actions");
    const quantityLabel = element("span", "cart-item__quantity-label", "Количество");
    const quantity = element("div", "quantity-control");
    quantity.setAttribute("aria-label", `Количество букета «${product.name}»`);
    const minus = element("button", "", "−");
    minus.type = "button";
    minus.dataset.action = "decrease";
    minus.dataset.id = product.id;
    minus.setAttribute("aria-label", "Уменьшить количество");
    const count = element("span", "", String(item.quantity));
    count.setAttribute("aria-live", "polite");
    const plus = element("button", "", "+");
    plus.type = "button";
    plus.dataset.action = "increase";
    plus.dataset.id = product.id;
    plus.setAttribute("aria-label", "Увеличить количество");
    quantity.append(minus, count, plus);
    actions.append(quantityLabel, quantity);
    body.append(copy, priceGroup, actions);
    const remove = element("button", "cart-item__remove");
    remove.type = "button";
    remove.dataset.action = "remove";
    remove.dataset.id = product.id;
    remove.setAttribute("aria-label", `Удалить «${product.name}» из корзины`);
    remove.setAttribute("title", "Удалить из корзины");
    remove.append(trashIcon());
    article.append(visual, body, remove);
    fragment.append(article);
  });
  container.replaceChildren(fragment);
}

export function renderOrderSummary(container, cart) {
  const fragment = document.createDocumentFragment();
  cart.forEach((item) => {
    const product = getProduct(item.id);
    if (!product) return;
    const row = element("div", "order-summary__item");
    const copy = element("div", "order-summary__copy");
    copy.append(element("strong", "", product.name), element("span", "", `${item.quantity} шт. · ${formatPrice(product.price * item.quantity)}`));
    const remove = element("button", "order-summary__remove");
    remove.type = "button";
    remove.dataset.action = "remove-order-item";
    remove.dataset.id = product.id;
    remove.setAttribute("aria-label", `Удалить «${product.name}» из заказа`);
    remove.setAttribute("title", "Удалить из заказа");
    const icon = svgElement("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" });
    icon.append(svgElement("path", { d: "M5 7h14M10 11v6M14 11v6M9 7l1-2h4l1 2M7 7l.7 13h8.6L17 7" }));
    remove.append(icon);
    row.append(copy, remove);
    fragment.append(row);
  });
  container.replaceChildren(fragment);
}
