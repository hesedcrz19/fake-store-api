import { readJSON } from '../utils/readJSON.js';

const categories = readJSON(import.meta.url, '../json/categories.json');

export const createProduct = ({
  id = crypto.randomUUID(),
  title,
  description,
  originalPrice,
  discountPercentage,
  promotion,
  shippingCost,
  rating,
  images,
  categoryId,
  createdAt = new Date().toISOString(),
  category,
}) => {
  const discount = Math.round((originalPrice * discountPercentage) / 100);
  return {
    id,
    title,
    slug: title.replace(/\s+/g, '-').toLowerCase(),
    description,
    price: Number((originalPrice - discount).toFixed(2)),
    originalPrice,
    discount,
    discountPercentage,
    promotion,
    shippingCost,
    rating,
    images,
    category: categoryId ? categories.find((category) => category.id === categoryId) : category,
    updatedAt: new Date(),
    createdAt,
  };
};
