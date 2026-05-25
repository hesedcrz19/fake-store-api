import { SORT_OPTIONS, SORT_ORDER_OPTIONS, SORT_ORDER_OPTIONS_DEFAULT, SORT_OPTIONS_DEFAULT } from './const.js';

export const filterProducts = (
  products,
  {
    title,
    price,
    minPrice,
    maxPrice,
    categorySlug,
    categoryId,
    sortBy = SORT_OPTIONS_DEFAULT,
    sortOrder = SORT_ORDER_OPTIONS_DEFAULT,
    discountPercentage,
    minDiscountPercentage,
    maxDiscountPercentage,
    hasDiscount,
    hasPromotion,
    freeShipping,
    limit,
    offset = 0,
  },
) => {
  if (title) {
    products = products.filter((product) => product.title.toLowerCase().includes(title));
  }

  if (price) {
    products = products.filter((product) => product.price === price);
  }

  if (minPrice && !price) {
    products = products.filter((product) => product.price >= minPrice);
  }

  if (maxPrice && !price) {
    products = products.filter((product) => product.price <= maxPrice);
  }

  if (categoryId) {
    products = products.filter((product) => product.category.id === categoryId);
  }

  if (categorySlug && !categoryId) {
    products = products.filter((product) => product.category.slug === categorySlug);
  }

  if (discountPercentage) {
    products = products.filter((product) => product.discountPercentage === discountPercentage);
  }

  if (minDiscountPercentage) {
    products = products.filter((product) => product.discountPercentage >= minDiscountPercentage);
  }

  if (maxDiscountPercentage) {
    products = products.filter((product) => product.discountPercentage <= maxDiscountPercentage);
  }

  if (hasDiscount !== undefined) {
    products = products.filter((product) =>
      hasDiscount ? product.discountPercentage > 0 : product.discountPercentage === 0,
    );
  }

  if (freeShipping !== undefined) {
    products = products.filter((product) =>
      freeShipping ? product.shippingCost === 0 : product.shippingCost > 0,
    );
  }

  if (hasPromotion !== undefined) {
    products = products.filter((product) => (hasPromotion ? product.promotion : !product.promotion));
  }

  if (limit !== undefined) {
    products = products.slice(offset, offset + limit);
  } else {
    products = products.slice(offset);
  }

  // Sorting
  if (sortBy === SORT_OPTIONS.PRICE) {
    products = products.sort((a, b) => b.price - a.price);
  } else if (sortBy === SORT_OPTIONS.TITLE) {
    products = products.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === SORT_OPTIONS.RATING) {
    products = products.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === SORT_OPTIONS.NEWEST) {
    products = products.sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    });
  }

  if (sortOrder === SORT_ORDER_OPTIONS.ASC) {
    products = products.reverse();
  }

  return products;
};
