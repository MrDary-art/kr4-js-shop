export function filterAndSortProducts(products, state) {
  const query = state.search.trim().toLocaleLowerCase("ru-RU");
  const priceRanges = {
    all: () => true,
    "up-to-4000": (price) => price < 4000,
    "4000-5500": (price) => price >= 4000 && price < 5500,
    "5500-plus": (price) => price >= 5500
  };
  const filtered = products.filter((product) => {
    const matchesSearch = !query || `${product.name} ${product.composition}`.toLocaleLowerCase("ru-RU").includes(query);
    const matchesCategory = state.category === "all" || product.category === state.category;
    const matchesOccasion = state.occasion === "all" || product.occasions.includes(state.occasion);
    const matchesPrice = (priceRanges[state.price] || priceRanges.all)(product.price);
    return matchesSearch && matchesCategory && matchesOccasion && matchesPrice;
  });

  return [...filtered].sort((a, b) => {
    if (state.sort === "price-asc") return a.price - b.price;
    if (state.sort === "price-desc") return b.price - a.price;
    if (state.sort === "name") return a.name.localeCompare(b.name, "ru");
    return a.featured - b.featured;
  });
}
