import ERROR_CODES from '../const/errorCodes.js';
import { createError } from '../utils/createError.js';
import { createCategory } from './createCategory.js';
import { categories } from './categories.js';
import { products } from '../products/products.js';
import { filterProducts } from '../products/filterProducts.js';

export class CategoryModel {
  static async getAll() {
    return categories;
  }

  static async getById({ id }) {
    const category = categories.find((category) => category.id === id);
    if (!category) {
      throw createError({
        code: ERROR_CODES.CATEGORY_NOT_FOUND,
        message: 'Category not found',
        status: 404,
      });
    }
    return category;
  }

  static async getProductsByCategoryId({ id, filters }) {
    const category = categories.find((category) => category.id === id);
    if (!category) {
      throw createError({
        code: ERROR_CODES.CATEGORY_NOT_FOUND,
        message: 'Category not found',
        status: 404,
      });
    }

    const newProducts = products.filter((product) => product.category.id === id);
    const productsFilter = filterProducts(newProducts, filters);
    return productsFilter;
  }

  static async getBySlug({ slug }) {
    const category = categories.find((category) => category.slug === slug);
    if (!category) {
      throw createError({
        code: ERROR_CODES.CATEGORY_NOT_FOUND,
        message: 'Category not found',
        status: 404,
      });
    }
    return category;
  }

  static async getProductsByCategorySlug({ slug, filters }) {
    const category = categories.find((category) => category.slug === slug);
    if (!category) {
      throw createError({
        code: ERROR_CODES.CATEGORY_NOT_FOUND,
        message: 'Category not found',
        status: 404,
      });
    }

    const newProducts = products.filter((product) => product.category.slug === slug);
    const productsFilter = filterProducts(newProducts, filters);
    return productsFilter;
  }

  static async create({ body }) {
    const newCategory = createCategory(body);

    if (categories.some((cat) => cat.slug === newCategory.slug)) {
      throw createError({
        code: ERROR_CODES.TITLE_ALREADY_EXIST,
        message: 'The category name already exist',
        status: 400,
      });
    }

    categories.push(newCategory);
    return newCategory;
  }

  static async update({ id, body }) {
    // Verifying if the category exist
    const prevCategoryIndex = categories.findIndex((category) => category.id === id);
    if (prevCategoryIndex === -1) {
      throw createError({
        code: ERROR_CODES.CATEGORY_NOT_FOUND,
        message: 'Category not found',
        status: 404,
      });
    }

    const newObject = {
      ...categories[prevCategoryIndex],
      ...body,
    };
    const newCategory = createCategory(newObject);

    // Verifying if the slug is unique
    if (categories.find((category, i) => category.slug === newCategory.slug && i !== prevCategoryIndex)) {
      throw createError({
        code: ERROR_CODES.TITLE_ALREADY_EXIST,
        message: 'The category name already exist',
        status: 400,
      });
    }

    categories[prevCategoryIndex] = newCategory;
    for (const product of products) {
      if (product.category.id === id) {
        product.category = newCategory;
      }
    }
    return newCategory;
  }

  static async delete({ id }) {
    const categoryIndex = categories.findIndex((category) => category.id === id);

    if (categoryIndex === -1) {
      throw createError({
        code: ERROR_CODES.CATEGORY_NOT_FOUND,
        message: 'Category not found',
        status: 404,
      });
    }

    categories.splice(categoryIndex, 1);
    for (let i = products.length - 1; i >= 0; i--) {
      if (products[i].category.id === id) {
        products.splice(i, 1);
      }
    }
  }
}
