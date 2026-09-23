export const slugifyCategory = (name) => {
  const raw = String(name ?? "").trim().toLowerCase();
  if (!raw) return "uncategorized";
  const slug = raw
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0980-\u09FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "uncategorized";
};

export const formatCategoryName = (name) => {
  const raw = String(name ?? "").trim();
  if (!raw) return "Uncategorized";
  return raw.replace(/-/g, " ");
};

export const groupProductsByCategory = (products) => {
  const list = Array.isArray(products) ? products : [];
  const map = new Map();

  for (const product of list) {
    const name =
      product?.category && String(product.category).trim()
        ? String(product.category).trim()
        : "Uncategorized";
    const slug = slugifyCategory(name);
    const price = Number(product?.price);
    const entry = map.get(slug) ?? {
      slug,
      name,
      count: 0,
      coverImage: null,
      minPrice: null,
    };
    // Prefer the first-seen display name (preserves original casing)
    entry.count += 1;
    if (!entry.coverImage && product?.image) entry.coverImage = product.image;
    if (Number.isFinite(price)) {
      entry.minPrice =
        entry.minPrice === null ? price : Math.min(entry.minPrice, price);
    }
    map.set(slug, entry);
  }

  return [...map.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  );
};

export const findCategoryBySlug = (products, slug) => {
  const target = String(slug ?? "").toLowerCase();
  const groups = groupProductsByCategory(products);
  const group = groups.find((g) => g.slug === target);
  if (!group) return null;
  const items = (Array.isArray(products) ? products : []).filter(
    (p) => slugifyCategory(p?.category || "Uncategorized") === target
  );
  return { group, items };
};
