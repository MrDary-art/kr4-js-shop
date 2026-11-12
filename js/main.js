import {
  products,
  calculateDiscount,
  createShortDescription,
  formatPrice,
  getProduct,
  getProductStatus
} from "./data.js";
import { filterAndSortProducts } from "./filters.js";
import { initOrderValidation } from "./form.js";
import {
  renderCart,
  renderOrderSummary,
  renderProductDetail,
  renderProductGrid,
  renderQuickView
} from "./render.js";
import {
  addToCart,
  cartCount,
  changeQuantity,
  getCart,
  getFavorites,
  getPromo,
  removeFromCart,
  setCart,
  setPromo,
  toggleFavorite
} from "./store.js";

let toastTimer;

function logCourseworkExamples() {
  const demoProduct = {
    name: "Пионовый сад",
    price: 5990,
    discountPercent: 10,
    available: true,
    stock: 4,
    description: "Объёмный букет розовых пионов с длинными атласными лентами."
  };
  const discountedPrice = calculateDiscount(demoProduct.price, demoProduct.discountPercent);

  console.group("Флора: демонстрация типов, операторов и функций");
  console.log("Объект товара:", demoProduct);
  console.log("Строка:", demoProduct.name);
  console.log("Число:", demoProduct.price);
  console.log("Логическое значение:", demoProduct.available);
  console.log("Цена:", formatPrice(demoProduct.price));
  console.log("Цена со скидкой:", formatPrice(discountedPrice));
  console.log("Статус:", getProductStatus(demoProduct));
  console.log("Краткое описание:", createShortDescription(demoProduct, 72));
  console.groupEnd();
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toast.classList.remove("is-leaving");
  toastTimer = window.setTimeout(() => {
    toast.classList.add("is-leaving");
    window.setTimeout(() => { toast.hidden = true; }, 220);
  }, 2800);
}

function updateCartCount(cart = getCart()) {
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    const count = cartCount(cart);
    const word = count === 1 ? "товар" : count >= 2 && count <= 4 ? "товара" : "товаров";
    node.textContent = String(count);
    node.closest(".cart-link")?.setAttribute("aria-label", `Корзина, ${count} ${word}`);
  });
}

function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const toggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".site-nav");
  if (!toggle || !nav) return;

  const links = [
    { href: "index.html", label: "Главная", page: "home" },
    { href: "catalog.html", label: "Каталог", page: "catalog" },
    { href: "saved.html", label: "Избранное", page: "favorites" },
    { href: "about.html", label: "О флористике", page: "about" },
    { href: "contacts.html", label: "Контакты", page: "contacts" }
  ];
  const navFragment = document.createDocumentFragment();
  links.forEach(({ href, label, page }) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    if (page === document.body.dataset.page) link.setAttribute("aria-current", "page");
    navFragment.append(link);
  });
  nav.replaceChildren(navFragment);

  const close = () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const open = !header.classList.contains("is-open");
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) close();
  });
  document.addEventListener("keydown", (event) => {
    document.documentElement.classList.add("using-keyboard");
    if (event.key === "Escape" && header.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });
  document.addEventListener("pointerdown", () => document.documentElement.classList.remove("using-keyboard"));
}

function initBreadcrumbs() {
  const main = document.querySelector("main");
  const currentPage = document.body.dataset.page;
  if (!main || currentPage === "home" || main.querySelector(".breadcrumbs")) return;

  const productId = Number(new URLSearchParams(location.search).get("id")) || 3;
  const product = currentPage === "product" ? getProduct(productId) : null;
  const trails = {
    catalog: [{ label: "Главная", href: "index.html" }, { label: "Каталог" }],
    favorites: [{ label: "Главная", href: "index.html" }, { label: "Избранное" }],
    about: [{ label: "Главная", href: "index.html" }, { label: "О флористике" }],
    contacts: [{ label: "Главная", href: "index.html" }, { label: "Контакты" }],
    cart: [{ label: "Главная", href: "index.html" }, { label: "Корзина" }],
    order: [{ label: "Главная", href: "index.html" }, { label: "Корзина", href: "bag.html" }, { label: "Оформление заказа" }],
    product: [{ label: "Главная", href: "index.html" }, { label: "Каталог", href: "catalog.html" }, { label: product?.name || "Букет" }]
  };
  const trail = trails[currentPage];
  if (!trail) return;

  const nav = document.createElement("nav");
  nav.className = "breadcrumbs";
  nav.setAttribute("aria-label", "Хлебные крошки");
  const list = document.createElement("ol");

  trail.forEach(({ label, href }, index) => {
    const item = document.createElement("li");
    const isCurrent = index === trail.length - 1;
    const node = document.createElement(isCurrent ? "span" : "a");
    node.textContent = label;
    if (href && node instanceof HTMLAnchorElement) node.href = href;
    if (isCurrent) {
      node.setAttribute("aria-current", "page");
      if (currentPage === "product") node.dataset.breadcrumbProduct = "";
    }
    item.append(node);
    list.append(item);
  });

  nav.append(list);
  main.prepend(nav);
}

function initFooter() {
  const footer = document.querySelector(".site-footer--unified");
  if (!footer) return;
  footer.innerHTML = `
    <div class="site-footer__grid">
      <div class="site-footer__identity">
        <a class="brand brand--footer" href="index.html">Флора</a>
        <p>Цветы к важному дню. Помогаем выбрать букет по настроению, поводу и бюджету.</p>
      </div>
      <nav class="site-footer__section" aria-label="Навигация в подвале">
        <h2 class="site-footer__heading">Навигация</h2>
        <a href="index.html" data-footer-page="home">Главная</a>
        <a href="catalog.html" data-footer-page="catalog">Каталог</a>
        <a href="saved.html" data-footer-page="favorites">Избранное</a>
        <a href="about.html" data-footer-page="about">О флористике</a>
      </nav>
      <div class="site-footer__section site-footer__contact">
        <h2 class="site-footer__heading">Связаться</h2>
        <a class="site-footer__item" href="tel:+74951283024">
          <svg class="site-footer__icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92Z"/></svg>
          <span>+7 495 128-30-24</span>
        </a>
        <span class="site-footer__item">
          <svg class="site-footer__icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          <span>Ежедневно 09:00–21:00</span>
        </span>
        <a class="site-footer__item" href="mailto:hello@flora-shop.ru">
          <svg class="site-footer__icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          <span>hello@flora-shop.ru</span>
        </a>
      </div>
      <address class="site-footer__section site-footer__address">
        <h2 class="site-footer__heading">Флора в Москве</h2>
        <span class="site-footer__item">
          <svg class="site-footer__icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
          <span class="site-footer__address-copy"><a href="https://yandex.ru/maps" rel="noopener" target="_blank">Цветной бульвар, 15</a><span>Москва, 127051</span></span>
        </span>
        <a class="site-footer__cta" href="bag.html">Перейти в корзину</a>
      </address>
    </div>
    <div class="site-footer__bottom"><p>© <span data-current-year></span> Флора. Все права защищены.</p></div>`;

  footer.querySelector(`[data-footer-page="${document.body.dataset.page}"]`)?.setAttribute("aria-current", "page");
}

function initMotion() {
  if (document.body.dataset.page === "home") {
    document.querySelectorAll("[data-reveal], [data-object-reveal], [data-shutter]").forEach((item) => {
      item.dataset.visible = "true";
    });
    return;
  }

  const footerGrid = document.querySelector(".site-footer__grid");
  if (footerGrid) {
    footerGrid.dataset.reveal = "";
    footerGrid.dataset.revealDelay = "40";
  }
  if (document.body.dataset.page === "order") {
    document.querySelectorAll(".order-form > h2, .order-form__grid, .order-summary").forEach((item) => { item.dataset.reveal = ""; });
  }
  if (document.body.dataset.page === "cart") {
    document.querySelectorAll(".cart-items, .cart-summary, .related-products > h2, .related-products > p, [data-cart-suggestions] .product-card").forEach((item) => { item.dataset.reveal = ""; });
  }
  if (document.body.dataset.page === "contacts") {
    const heroCopy = document.querySelector(".contact-hero__copy");
    heroCopy?.removeAttribute("data-reveal");
    heroCopy?.querySelectorAll("h1, p, .button").forEach((item, index) => {
      item.dataset.reveal = "";
      item.dataset.revealDelay = String(index * 70);
    });
    const marquee = document.querySelector("[data-contact-marquee]");
    if (marquee) {
      marquee.dataset.reveal = "";
      marquee.dataset.revealDelay = "110";
    }
  }
  if (document.body.dataset.page === "favorites") {
    const introCopy = document.querySelector(".favorites-intro__copy");
    introCopy?.removeAttribute("data-reveal");
    introCopy?.querySelectorAll("h1, p").forEach((item, index) => {
      item.dataset.reveal = "";
      item.dataset.revealDelay = String(index * 70);
    });
    const status = document.querySelector(".catalog-status");
    status?.removeAttribute("data-reveal");
    status?.querySelectorAll("h2, p").forEach((item, index) => {
      item.dataset.reveal = "";
      item.dataset.revealDelay = String(index * 70);
    });
  }
  const revealItems = [...document.querySelectorAll("[data-reveal], [data-object-reveal]")];
  revealItems.forEach((item) => {
    const delay = Number(item.dataset.revealDelay || 0);
    if (Number.isFinite(delay) && delay > 0) {
      item.style.setProperty("--reveal-delay", `${Math.min(delay, 240)}ms`);
    }
  });
  const shutter = document.querySelector("[data-shutter]");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealItems.forEach((item) => item.dataset.visible = "true");
    if (shutter) shutter.dataset.visible = "true";
    return;
  }
  document.documentElement.classList.add("motion-ready");
  if (shutter) requestAnimationFrame(() => { shutter.dataset.visible = "true"; });
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.dataset.visible = "true");
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.visible = "true";
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10%", threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}

function addProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  addToCart(product.id);
  showToast(`«${product.name}» добавлен в корзину.`);
}

function animateGrid(container) {
  if (!container || document.documentElement.classList.contains("using-keyboard") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  container.querySelectorAll(".product-card").forEach((card, index) => {
    card.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(.98)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ],
      { duration: 240, delay: Math.min(index * 35, 210), easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" }
    );
  });
}

function animateProductDetail(container) {
  if (!container || document.documentElement.classList.contains("using-keyboard") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const media = container.querySelector(".product-detail__media");
  media?.animate(
    [{ opacity: 0, transform: "translateX(-18px) scale(.98)" }, { opacity: 1, transform: "translateX(0) scale(1)" }],
    { duration: 460, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" }
  );
  container.querySelectorAll(".product-detail__content > *").forEach((item, index) => {
    item.animate(
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 320, delay: 70 + index * 35, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "both" }
    );
  });
}

function toggleProductFavorite(id, rerender) {
  const product = getProduct(id);
  if (!product) return;
  const favorites = toggleFavorite(id);
  const saved = favorites.includes(Number(id));
  showToast(saved ? `«${product.name}» сохранён в избранном.` : `«${product.name}» удалён из избранного.`);
  rerender?.(favorites);
}

function initHome() {
  const carousel = document.querySelector("[data-reviews-carousel]");
  const track = carousel?.querySelector("[data-reviews-track]");
  const previous = carousel?.querySelector("[data-review-prev]");
  const next = carousel?.querySelector("[data-review-next]");
  const count = carousel?.querySelector("[data-reviews-count]");
  if (!carousel || !track || !previous || !next || !count) return;

  const cards = [...track.querySelectorAll(".review-card")];
  if (cards.length < 2) return;

  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.removeAttribute("data-reveal");
    clone.removeAttribute("data-visible");
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.reviewClone = "true";
    track.append(clone);
  });

  const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const getStep = () => {
    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    return cardWidth + gap;
  };
  const updateCount = () => {
    const step = getStep() || 1;
    const activeIndex = Math.round(track.scrollLeft / step) % cards.length;
    count.textContent = `${activeIndex + 1} / ${cards.length}`;
  };
  const normalizeLoop = () => {
    const step = getStep();
    if (!step || track.scrollLeft < (step * cards.length) - 1) return;
    track.scrollLeft -= step * cards.length;
    glidePosition = track.scrollLeft;
  };
  const scrollByCard = (direction) => {
    const step = getStep();
    if (!step) return;
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    if (direction < 0 && track.scrollLeft <= 1) {
      track.scrollLeft = step * cards.length;
    }
    requestAnimationFrame(() => track.scrollBy({ left: direction * step, behavior }));
  };

  let autoplayFrame;
  let lastFrameTime = 0;
  let glidePosition = 0;
  let resumeTimer;
  let pointerInside = false;
  let focusWithin = false;
  const stopAutoplay = () => {
    cancelAnimationFrame(autoplayFrame);
    autoplayFrame = undefined;
    lastFrameTime = 0;
  };
  const startAutoplay = () => {
    if (autoplayFrame || prefersReducedMotion() || document.hidden || pointerInside || focusWithin) return;
    glidePosition = track.scrollLeft;
    const glide = (time) => {
      const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 64) : 0;
      lastFrameTime = time;
      glidePosition += elapsed * .014;
      track.scrollLeft = glidePosition;
      normalizeLoop();
      updateCount();
      autoplayFrame = requestAnimationFrame(glide);
    };
    autoplayFrame = requestAnimationFrame(glide);
  };
  const pauseAfterInteraction = () => {
    stopAutoplay();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, 6500);
  };

  previous.addEventListener("click", () => { scrollByCard(-1); pauseAfterInteraction(); });
  next.addEventListener("click", () => { scrollByCard(1); pauseAfterInteraction(); });
  track.addEventListener("scroll", () => { normalizeLoop(); updateCount(); }, { passive: true });
  track.addEventListener("pointerdown", pauseAfterInteraction, { passive: true });
  track.addEventListener("touchstart", pauseAfterInteraction, { passive: true });
  track.addEventListener("wheel", pauseAfterInteraction, { passive: true });
  carousel.addEventListener("pointerenter", () => { pointerInside = true; stopAutoplay(); });
  carousel.addEventListener("pointerleave", () => { pointerInside = false; startAutoplay(); });
  carousel.addEventListener("focusin", () => { focusWithin = true; stopAutoplay(); });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focusWithin = false;
      startAutoplay();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
  updateCount();
  startAutoplay();
}

function initContacts() {
  const carousel = document.querySelector("[data-contact-marquee]");
  const track = carousel?.querySelector("[data-contact-marquee-track]");
  if (!carousel || !track) return;

  const createSet = (isClone = false) => {
    const set = document.createElement("div");
    set.className = "contact-bouquet-marquee__set";
    if (isClone) {
      set.setAttribute("aria-hidden", "true");
      set.dataset.contactMarqueeClone = "true";
    }

    products.filter((product) => product.available).forEach((product) => {
      const card = document.createElement("article");
      card.className = "contact-bouquet-card";
      const link = document.createElement("a");
      link.href = `product.html?id=${product.id}`;
      link.setAttribute("aria-label", `Открыть букет «${product.name}»`);
      if (isClone) link.tabIndex = -1;

      const image = document.createElement("img");
      image.src = product.image;
      image.width = 354;
      image.height = 354;
      image.loading = "lazy";
      image.decoding = "async";
      image.alt = product.alt;

      const caption = document.createElement("span");
      caption.className = "contact-bouquet-card__caption";
      const name = document.createElement("strong");
      name.textContent = product.name;
      const type = document.createElement("span");
      type.textContent = product.categoryLabel;
      caption.append(name, type);
      link.append(image, caption);
      card.append(link);
      set.append(card);
    });
    return set;
  };

  const firstSet = createSet();
  track.replaceChildren(firstSet, createSet(true));
  carousel.tabIndex = 0;

  const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loopWidth = () => {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    return firstSet.getBoundingClientRect().width + gap;
  };
  const normalizeLoop = () => {
    const width = loopWidth();
    if (!width) return;
    if (carousel.scrollLeft >= width - 1) carousel.scrollLeft -= width;
    glidePosition = carousel.scrollLeft;
  };

  let animationFrame;
  let previousTime = 0;
  let glidePosition = 0;
  let resumeTimer;
  let pointerInside = false;
  let focusWithin = false;
  const stop = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
    previousTime = 0;
  };
  const start = () => {
    if (animationFrame || prefersReducedMotion() || document.hidden || pointerInside || focusWithin) return;
    glidePosition = carousel.scrollLeft;
    const glide = (time) => {
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;
      glidePosition += elapsed * .014;
      const width = loopWidth();
      if (width && glidePosition >= width - 1) glidePosition -= width;
      carousel.scrollLeft = glidePosition;
      animationFrame = requestAnimationFrame(glide);
    };
    animationFrame = requestAnimationFrame(glide);
  };
  const pauseAfterInteraction = () => {
    stop();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(start, 5200);
  };
  const scrollByCard = (direction) => {
    const card = firstSet.querySelector(".contact-bouquet-card");
    const gap = Number.parseFloat(getComputedStyle(firstSet).columnGap || getComputedStyle(firstSet).gap) || 0;
    const amount = (card?.getBoundingClientRect().width || 0) + gap;
    if (direction < 0 && carousel.scrollLeft <= 1) carousel.scrollLeft = loopWidth();
    if (amount) carousel.scrollBy({ left: amount * direction, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  carousel.addEventListener("scroll", normalizeLoop, { passive: true });
  carousel.addEventListener("pointerdown", pauseAfterInteraction, { passive: true });
  carousel.addEventListener("touchstart", pauseAfterInteraction, { passive: true });
  carousel.addEventListener("wheel", pauseAfterInteraction, { passive: true });
  carousel.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    scrollByCard(event.key === "ArrowRight" ? 1 : -1);
    pauseAfterInteraction();
  });
  carousel.addEventListener("pointerenter", () => { pointerInside = true; stop(); });
  carousel.addEventListener("pointerleave", () => { pointerInside = false; start(); });
  carousel.addEventListener("focusin", () => { focusWithin = true; stop(); });
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      focusWithin = false;
      start();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
  start();
}

function initScrollTop() {
  const button = document.querySelector("[data-scroll-top]");
  if (!button) return;
  const update = () => button.classList.toggle("is-visible", window.scrollY > 420);
  window.addEventListener("scroll", update, { passive: true });
  button.addEventListener("click", () => window.scrollTo({
    top: 0,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
  }));
  update();
}

function initCustomCatalogSelects(controls) {
  const fields = [...controls.querySelectorAll("[data-custom-select]")];
  if (!fields.length) return { sync() {} };

  const close = (field) => {
    const trigger = field.querySelector("[data-select-trigger]");
    const options = field.querySelector("[data-select-options]");
    trigger?.setAttribute("aria-expanded", "false");
    if (options) options.hidden = true;
    field.classList.remove("is-open");
  };

  const closeAll = (except) => fields.forEach((field) => {
    if (field !== except) close(field);
  });

  const syncField = (field) => {
    const select = field.querySelector("select");
    const value = field.querySelector("[data-select-value]");
    if (!select || !value) return;
    const selectedOption = select.options[select.selectedIndex];
    value.textContent = selectedOption?.textContent || "Выберите вариант";
    field.querySelectorAll("[role=option]").forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.value === select.value));
    });
  };

  fields.forEach((field) => {
    const select = field.querySelector("select");
    const trigger = field.querySelector("[data-select-trigger]");
    const options = field.querySelector("[data-select-options]");
    if (!select || !trigger || !options) return;
    trigger.setAttribute("aria-controls", options.id);

    const open = () => {
      closeAll(field);
      options.hidden = false;
      field.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", () => {
      if (field.classList.contains("is-open")) close(field);
      else open();
    });

    trigger.addEventListener("keydown", (event) => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      open();
      const optionButtons = [...options.querySelectorAll("[role=option]")];
      const selected = options.querySelector('[role=option][aria-selected="true"]');
      (event.key === "End" ? optionButtons.at(-1) : selected || optionButtons[0])?.focus();
    });

    options.addEventListener("click", (event) => {
      const option = event.target.closest("[role=option]");
      if (!option) return;
      select.value = option.dataset.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      close(field);
      trigger.focus();
    });

    options.addEventListener("keydown", (event) => {
      const optionButtons = [...options.querySelectorAll("[role=option]")];
      const current = event.target.closest("[role=option]");
      const currentIndex = optionButtons.indexOf(current);
      if (event.key === "Escape") {
        event.preventDefault();
        close(field);
        trigger.focus();
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? optionButtons.length - 1 : Math.max(0, Math.min(optionButtons.length - 1, currentIndex + (event.key === "ArrowDown" ? 1 : -1)));
        optionButtons[nextIndex]?.focus();
      }
    });

    select.addEventListener("change", () => syncField(field));
    syncField(field);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!controls.contains(event.target)) closeAll();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });

  return { sync: () => fields.forEach(syncField) };
}

function initOrderDatePicker(form) {
  const field = form.querySelector("[data-date-picker]");
  if (!field) return;
  const input = field.querySelector("input[name=date]");
  const trigger = field.querySelector("[data-date-trigger]");
  const value = field.querySelector("[data-date-value]");
  const popover = field.querySelector("[data-date-popover]");
  const month = field.querySelector("[data-calendar-month]");
  const days = field.querySelector("[data-calendar-days]");
  const previous = field.querySelector("[data-calendar-prev]");
  const next = field.querySelector("[data-calendar-next]");
  const todayButton = field.querySelector("[data-calendar-today]");
  if (!input || !trigger || !value || !popover || !month || !days) return;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let visibleMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  popover.id = "delivery-date-calendar";
  trigger.setAttribute("aria-controls", popover.id);

  const keyFor = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dateFor = (key) => key ? new Date(`${key}T12:00:00`) : null;
  const formatValue = (date) => date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" }).replace(".", "");
  const isSameDay = (first, second) => first && second && keyFor(first) === keyFor(second);
  const close = (focus = false) => {
    popover.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    field.classList.remove("is-open");
    if (focus) trigger.focus();
  };
  const open = () => {
    const selected = dateFor(input.value);
    visibleMonth = new Date((selected || today).getFullYear(), (selected || today).getMonth(), 1);
    render();
    popover.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    field.classList.add("is-open");
    days.querySelector("button:not([disabled])")?.focus();
  };
  const setDate = (date) => {
    input.value = keyFor(date);
    value.textContent = formatValue(date);
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    close(true);
  };
  const render = () => {
    const selected = dateFor(input.value);
    const year = visibleMonth.getFullYear();
    const monthIndex = visibleMonth.getMonth();
    const first = new Date(year, monthIndex, 1);
    const offset = (first.getDay() + 6) % 7;
    const total = new Date(year, monthIndex + 1, 0).getDate();
    month.textContent = visibleMonth.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    previous.disabled = new Date(year, monthIndex, 1) <= new Date(today.getFullYear(), today.getMonth(), 1);
    days.replaceChildren();
    for (let blank = 0; blank < offset; blank += 1) days.append(document.createElement("span"));
    for (let day = 1; day <= total; day += 1) {
      const date = new Date(year, monthIndex, day);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(day);
      button.dataset.date = keyFor(date);
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }));
      button.setAttribute("aria-pressed", String(isSameDay(date, selected)));
      if (isSameDay(date, today)) button.dataset.today = "true";
      if (date < today) button.disabled = true;
      button.addEventListener("click", () => setDate(date));
      days.append(button);
    }
  };

  trigger.addEventListener("click", () => popover.hidden ? open() : close());
  previous?.addEventListener("click", () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1); render(); });
  next?.addEventListener("click", () => { visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1); render(); });
  todayButton?.addEventListener("click", () => setDate(today));
  document.addEventListener("pointerdown", (event) => { if (!field.contains(event.target)) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !popover.hidden) close(true); });
  render();
}

function initCatalog() {
  const controls = document.querySelector("[data-catalog-controls]");
  const grid = document.querySelector("[data-products-grid]");
  if (!controls || !grid) return;
  const count = document.querySelector("[data-results-count]");
  const empty = document.querySelector("[data-empty-state]");
  const clear = document.querySelector("[data-clear-filters]");
  const dialog = document.querySelector("[data-quick-view]");
  const dialogContent = document.querySelector("[data-quick-view-content]");
  const params = new URLSearchParams(window.location.search);
  const state = {
    search: params.get("search") || "",
    category: params.get("category") || "all",
    occasion: params.get("occasion") || "all",
    price: params.get("price") || "all",
    sort: params.get("sort") || "featured"
  };

  Object.entries(state).forEach(([key, value]) => {
    if (controls.elements[key] && [...controls.elements[key].options || []].some((option) => option.value === value)) {
      controls.elements[key].value = value;
    } else if (key === "search") controls.elements.search.value = value;
  });
  const customSelects = initCustomCatalogSelects(controls);

  const syncUrl = () => {
    const next = new URLSearchParams();
    Object.entries(state).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "featured") next.set(key, value);
    });
    history.replaceState(null, "", `${location.pathname}${next.size ? `?${next}` : ""}`);
  };

  const render = (favorites = getFavorites(), withMotion = true) => {
    const result = filterAndSortProducts(products, state);
    renderProductGrid(grid, result, favorites);
    if (withMotion) animateGrid(grid);
    count.textContent = `${result.length} из ${products.length}`;
    empty.hidden = result.length > 0;
    grid.hidden = result.length === 0;
    syncUrl();
  };

  controls.addEventListener("input", (event) => {
    if (event.target.name !== "search") return;
    state.search = event.target.value;
    render(getFavorites(), false);
  });
  controls.addEventListener("change", (event) => {
    if (!event.target.name || event.target.name === "search") return;
    state[event.target.name] = event.target.value;
    render();
  });
  controls.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      Object.assign(state, { search: "", category: "all", occasion: "all", price: "all", sort: "featured" });
      customSelects.sync();
      render();
    });
  });
  clear?.addEventListener("click", () => {
    controls.reset();
    Object.assign(state, { search: "", category: "all", occasion: "all", price: "all", sort: "featured" });
    customSelects.sync();
    render();
    controls.elements.search.focus();
  });

  grid.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const id = Number(action.dataset.id);
    if (action.dataset.action === "add") addProduct(id);
    if (action.dataset.action === "favorite") toggleProductFavorite(id);
    if (action.dataset.action === "quick-view" && dialog && dialogContent) {
      renderQuickView(dialogContent, getProduct(id));
      dialog.showModal();
    }
  });

  dialog?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action?.dataset.action === "add") addProduct(Number(action.dataset.id));
    if (event.target === dialog) dialog.close();
  });
  document.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog.close());
  window.addEventListener("flora:favorites-change", (event) => render(event.detail, false));
  render();
}

function initFavorites() {
  const grid = document.querySelector("[data-favorites-grid]");
  const empty = document.querySelector("[data-favorites-empty]");
  const count = document.querySelector("[data-favorites-count]");
  const dialog = document.querySelector("[data-quick-view]");
  const dialogContent = document.querySelector("[data-quick-view-content]");
  if (!grid || !empty || !count) return;

  const render = (favoriteIds = getFavorites()) => {
    const items = products.filter((product) => favoriteIds.includes(product.id));
    renderProductGrid(grid, items, favoriteIds);
    grid.hidden = items.length === 0;
    empty.hidden = items.length > 0;
    count.textContent = items.length ? `${items.length} ${items.length === 1 ? "сохранённый букет" : "сохранённых букета"}` : "Пока нет сохранённых букетов";
    if (items.length) animateGrid(grid);
  };

  grid.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const id = Number(action.dataset.id);
    if (action.dataset.action === "add") addProduct(id);
    if (action.dataset.action === "favorite") toggleProductFavorite(id, render);
    if (action.dataset.action === "quick-view" && dialog && dialogContent) {
      renderQuickView(dialogContent, getProduct(id));
      dialog.showModal();
    }
  });
  dialog?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action?.dataset.action === "add") addProduct(Number(action.dataset.id));
    if (event.target === dialog) dialog.close();
  });
  dialog?.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog.close());
  window.addEventListener("flora:favorites-change", (event) => render(event.detail));
  render();
}

function initProduct() {
  const detail = document.querySelector("[data-product-detail]");
  if (!detail) return;
  const id = Number(new URLSearchParams(location.search).get("id")) || 3;
  const product = getProduct(id) || products[2];
  const breadcrumb = document.querySelector("[data-breadcrumb-product]");
  const related = document.querySelector("[data-related-products]");
  const renderDetail = (favorites = getFavorites()) => renderProductDetail(detail, product, favorites.includes(product.id));
  if (breadcrumb) breadcrumb.textContent = product.name;
  document.title = `${product.name} — Флора`;
  renderDetail();
  animateProductDetail(detail);
  const relatedItems = products
    .filter((item) => item.id !== product.id && (item.category === product.category || item.occasions.some((occasion) => product.occasions.includes(occasion))))
    .slice(0, 3);
  renderProductGrid(related, relatedItems, getFavorites());
  animateGrid(related);

  document.querySelector("main").addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const actionId = Number(action.dataset.id);
    if (action.dataset.action === "add") addProduct(actionId);
    if (action.dataset.action === "favorite") toggleProductFavorite(actionId, (favorites) => {
      renderDetail(favorites);
      animateProductDetail(detail);
      renderProductGrid(related, relatedItems, favorites);
      animateGrid(related);
    });
    if (action.dataset.action === "quick-view") location.href = `product.html?id=${actionId}`;
  });
}

function totals(cart) {
  const subtotal = cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const discount = getPromo() === "FLORA10" ? Math.round(subtotal * 0.1) : 0;
  return { subtotal, discount, total: subtotal - discount };
}

function initCart() {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  const empty = document.querySelector("[data-cart-empty]");
  const checkout = document.querySelector("[data-checkout-link]");
  const promoForm = document.querySelector("[data-promo-form]");
  const promoMessage = document.querySelector("[data-promo-message]");
  const promoInput = promoForm?.elements.promo;
  const suggestions = document.querySelector("[data-cart-suggestions]");
  const itemCount = document.querySelector("[data-cart-item-count]");
  const dialog = document.querySelector("[data-quick-view]");
  const dialogContent = document.querySelector("[data-quick-view-content]");

  const countLabel = (count) => {
    const remainder = count % 10;
    const remainderHundred = count % 100;
    const word = remainder === 1 && remainderHundred !== 11
      ? "букет"
      : remainder >= 2 && remainder <= 4 && (remainderHundred < 12 || remainderHundred > 14)
        ? "букета"
        : "букетов";
    return `${count} ${word}`;
  };

  const renderSuggestions = (favorites = getFavorites(), cart = getCart()) => {
    if (!suggestions) return;
    const cartIds = new Set(cart.map((item) => item.id));
    const available = products.filter((product) => product.available);
    const suggested = available.filter((product) => !cartIds.has(product.id));
    renderProductGrid(suggestions, (suggested.length >= 5 ? suggested : available).slice(0, 5), favorites);
    animateGrid(suggestions);
  };

  const render = (cart = getCart()) => {
    renderCart(container, cart);
    const summary = totals(cart);
    document.querySelector("[data-cart-subtotal]").textContent = formatPrice(summary.subtotal);
    document.querySelector("[data-cart-discount]").textContent = summary.discount ? `−${formatPrice(summary.discount)}` : formatPrice(0);
    document.querySelector("[data-cart-total]").textContent = formatPrice(summary.total);
    empty.hidden = cart.length > 0;
    checkout.setAttribute("aria-disabled", String(cart.length === 0));
    checkout.tabIndex = cart.length === 0 ? -1 : 0;
    if (promoInput && getPromo()) promoInput.value = getPromo();
    if (itemCount) itemCount.textContent = cart.length ? countLabel(cart.reduce((total, item) => total + item.quantity, 0)) : "";
    renderSuggestions(getFavorites(), cart);
  };

  container.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const id = Number(action.dataset.id);
    if (action.dataset.action === "increase") changeQuantity(id, 1);
    if (action.dataset.action === "decrease") changeQuantity(id, -1);
    if (action.dataset.action === "remove") {
      removeFromCart(id);
      showToast("Букет удалён из корзины.");
    }
  });
  checkout.addEventListener("click", (event) => {
    if (checkout.getAttribute("aria-disabled") === "true") event.preventDefault();
  });
  promoForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = promoInput.value.trim().toUpperCase();
    if (code === "FLORA10") {
      setPromo(code);
      promoMessage.textContent = "Скидка 10% применена.";
    } else {
      setPromo("");
      promoMessage.textContent = code ? "Промокод не найден. Проверьте написание." : "Введите промокод.";
    }
    render();
  });
  suggestions?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const id = Number(action.dataset.id);
    if (action.dataset.action === "add") addProduct(id);
    if (action.dataset.action === "favorite") toggleProductFavorite(id, renderSuggestions);
    if (action.dataset.action === "quick-view" && dialog && dialogContent) {
      renderQuickView(dialogContent, getProduct(id));
      dialog.showModal();
    }
  });
  dialog?.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    if (action?.dataset.action === "add") addProduct(Number(action.dataset.id));
    if (event.target === dialog) dialog.close();
  });
  dialog?.querySelector("[data-dialog-close]")?.addEventListener("click", () => dialog.close());
  window.addEventListener("flora:cart-change", (event) => render(event.detail));
  window.addEventListener("flora:favorites-change", () => renderSuggestions());
  render();
}

function initOrder() {
  const form = document.querySelector("[data-order-form]");
  if (!form) return;
  const summaryContainer = document.querySelector("[data-order-summary]");
  const totalNode = document.querySelector("[data-order-total]");
  const success = document.querySelector("[data-order-success]");
  const successText = document.querySelector("[data-success-text]");
  const summary = document.querySelector(".order-summary");
  const renderSummary = (cart = getCart()) => {
    renderOrderSummary(summaryContainer, cart);
    totalNode.textContent = formatPrice(totals(cart).total);
    summary?.classList.toggle("is-empty", cart.length === 0);
    if (!cart.length) {
      const message = document.createElement("p");
      message.className = "order-summary__empty";
      message.textContent = "Корзина пока пуста. Выберите букет в каталоге — он появится здесь.";
      summaryContainer.append(message);
    }
  };
  renderSummary();
  initCustomCatalogSelects(form);
  initOrderDatePicker(form);
  summaryContainer?.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-action=remove-order-item]");
    if (!remove) return;
    const product = getProduct(Number(remove.dataset.id));
    renderSummary(removeFromCart(Number(remove.dataset.id)));
    showToast(product ? `«${product.name}» удалён из заказа.` : "Позиция удалена из заказа.");
  });
  window.addEventListener("flora:cart-change", (event) => renderSummary(event.detail));

  initOrderValidation(form, async (data) => {
    const submit = form.querySelector('[type="submit"]');
    const message = form.querySelector("[data-form-message]");
    const cart = getCart();
    submit.disabled = true;
    submit.textContent = "Отправляем…";
    message.textContent = "";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          consent: data.consent === "on",
          items: cart
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Не удалось оформить заказ.");

      successText.textContent = `Заказ №${result.orderId} для ${data.recipient} принят. Мы свяжемся с вами для подтверждения.`;
      form.hidden = true;
      success.hidden = false;
      success.focus();
      setCart([]);
    } catch (error) {
      message.textContent = `${error.message} Проверьте данные и повторите попытку.`;
      message.classList.add("is-error");
    } finally {
      submit.disabled = false;
      submit.textContent = "Подготовить заявку";
    }
  });
}

function initFloristry() {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const process = document.querySelector("[data-floristry-process]");
  if (process) {
    const steps = [...process.querySelectorAll("[data-process-step]")];
    const preview = process.querySelector("[data-process-preview]");

    steps.forEach((step) => {
      const preload = new Image();
      preload.src = step.dataset.processSrc;
    });

    const activateStep = (step) => {
      if (!step || step.getAttribute("aria-pressed") === "true") return;
      steps.forEach((item) => item.setAttribute("aria-pressed", String(item === step)));
      preview.src = step.dataset.processSrc;
      preview.alt = step.dataset.processAlt;

      if (!reduceMotion && preview.animate) {
        preview.getAnimations().forEach((animation) => animation.cancel());
        preview.animate(
          [
            { opacity: 0, transform: "scale(0.985)" },
            { opacity: 1, transform: "scale(1)" }
          ],
          { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
        );
      }
    };

    steps.forEach((step) => {
      step.addEventListener("click", () => activateStep(step));
    });
  }

  const picker = document.querySelector("[data-floristry-mood]");
  if (!picker) return;
  const image = picker.querySelector("[data-mood-image]");
  const text = picker.querySelector("[data-mood-text]");
  const link = picker.querySelector("[data-mood-link]");
  const moods = {
    gentle: {
      src: "images/bouquet-pink-peony-hq.png",
      alt: "Нежный розовый букет пионов",
      text: "Пудровые оттенки, округлые формы и мягкие переходы цвета.",
      href: "catalog.html?occasion=date"
    },
    vivid: {
      src: "images/bouquet-coral-ranunculus.jpg",
      alt: "Яркий коралловый букет ранункулюсов",
      text: "Выразительная палитра и живой ритм для заметного поздравления.",
      href: "catalog.html?occasion=birthday"
    },
    airy: {
      src: "images/bouquet-white-tulip.jpg",
      alt: "Воздушный букет белых тюльпанов",
      text: "Светлые цветы, свободный силуэт и ощущение весеннего воздуха.",
      href: "catalog.html?occasion=universal"
    }
  };

  picker.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-mood]");
    const mood = choice ? moods[choice.dataset.mood] : null;
    if (!choice || !mood) return;
    picker.querySelectorAll("[data-mood]").forEach((button) => button.setAttribute("aria-pressed", String(button === choice)));
    image.src = mood.src;
    image.alt = mood.alt;
    text.textContent = mood.text;
    link.href = mood.href;

    if (!reduceMotion && image.animate) {
      image.getAnimations().forEach((animation) => animation.cancel());
      image.animate(
        [
          { opacity: 0, transform: "scale(0.985)" },
          { opacity: 1, transform: "scale(1)" }
        ],
        { duration: 240, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
      );
      text.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: 180, easing: "ease" }
      );
    }
  });
}

function initGlobal() {
  initHeader();
  initFooter();
  initBreadcrumbs();
  document.querySelectorAll("[data-current-year]").forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  initScrollTop();
  updateCartCount();
  window.addEventListener("flora:cart-change", (event) => updateCartCount(event.detail));
}

initGlobal();

const page = document.body.dataset.page;
logCourseworkExamples();
if (page === "home") initHome();
if (page === "catalog") initCatalog();
if (page === "favorites") initFavorites();
if (page === "product") initProduct();
if (page === "cart") initCart();
if (page === "order") initOrder();
if (page === "contacts") initContacts();
if (page === "about") initFloristry();
initMotion();
