const CART_KEY = "flora-cart-v1";
const FAVORITES_KEY = "flora-favorites-v1";
const PROMO_KEY = "flora-promo-v1";

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("Не удалось прочитать локальные данные", error);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Не удалось сохранить локальные данные", error);
  }
}

export function getCart() {
  const cart = read(CART_KEY, []);
  return Array.isArray(cart) ? cart.filter((item) => Number.isInteger(item.id) && item.quantity > 0) : [];
}

export function setCart(cart) {
  write(CART_KEY, cart);
  window.dispatchEvent(new CustomEvent("flora:cart-change", { detail: cart }));
}

export function addToCart(id, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === Number(id));
  if (existing) existing.quantity += quantity;
  else cart.push({ id: Number(id), quantity });
  setCart(cart);
  return cart;
}

export function changeQuantity(id, delta) {
  const cart = getCart()
    .map((item) => item.id === Number(id) ? { ...item, quantity: item.quantity + delta } : item)
    .filter((item) => item.quantity > 0);
  setCart(cart);
  return cart;
}

export function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== Number(id));
  setCart(cart);
  return cart;
}

export function getFavorites() {
  const favorites = read(FAVORITES_KEY, []);
  return Array.isArray(favorites) ? favorites.map(Number) : [];
}

export function toggleFavorite(id) {
  const numericId = Number(id);
  const favorites = getFavorites();
  const next = favorites.includes(numericId)
    ? favorites.filter((item) => item !== numericId)
    : [...favorites, numericId];
  write(FAVORITES_KEY, next);
  window.dispatchEvent(new CustomEvent("flora:favorites-change", { detail: next }));
  return next;
}

export const getPromo = () => read(PROMO_KEY, "");
export const setPromo = (code) => write(PROMO_KEY, code);

export function cartCount(cart = getCart()) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
