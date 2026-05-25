import { createProduct } from './createProduct.js';
import { filterProducts } from './filterProducts.js';
import { createError } from '../utils/createError.js';
import ERROR_CODES from '../const/errorCodes.js';
import { products } from './products.js';

export class ProductModel {
  static async getAll(filters) {
    return filterProducts([...products], filters);
  }

  static async getById({ id }) {
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw createError({
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        status: 404,
      });
    }
    return product;
  }

  static async getRelatedById({ id, filters }) {
    const product = products.find((product) => product.id === id);
    if (!product) {
      throw createError({
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        status: 404,
      });
    }
    const relatedProducts = products.filter(
      (el) => el.category.id === product.category.id && el.id !== product.id,
    );
    return filterProducts(relatedProducts, filters);
  }

  static async getBySlug({ slug }) {
    const product = products.find((product) => product.slug === slug);
    if (!product) {
      throw createError({
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        status: 404,
      });
    }
    return product;
  }

  static async getRelatedBySlug({ slug, filters }) {
    const product = products.find((product) => product.slug === slug);
    if (!product) {
      throw createError({
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        status: 404,
      });
    }
    const relatedProducts = products.filter(
      (el) => el.category.id === product.category.id && el.id !== product.id,
    );
    return filterProducts(relatedProducts, filters);
  }

  static async create({ body }) {
    const newProduct = createProduct(body);

    // Cheking if the title already exist
    if (products.some((product) => product.slug === newProduct.slug)) {
      throw createError({
        code: ERROR_CODES.TITLE_ALREADY_EXIST,
        message: 'The product title already exist',
        status: 400,
      });
    }

    products.push(newProduct);
    return newProduct;
  }

  static async update({ id, body }) {
    // Verifying if the product exist
    const prevProductIndex = products.findIndex((product) => product.id === id);
    if (prevProductIndex === -1) {
      throw createError({
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        status: 404,
      });
    }

    const newObject = {
      ...products[prevProductIndex],
      ...body,
    };
    const newProduct = createProduct(newObject);

    // Verifying if the slug is unique
    if (products.find((product, i) => product.slug === newProduct.slug && i !== prevProductIndex)) {
      throw createError({
        code: ERROR_CODES.TITLE_ALREADY_EXIST,
        message: 'The product title already exist',
        status: 400,
      });
    }

    products[prevProductIndex] = newProduct;
    return newProduct;
  }

  static async delete({ id }) {
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      throw createError({
        code: ERROR_CODES.PRODUCT_NOT_FOUND,
        message: 'Product not found',
        status: 404,
      });
    }

    products.splice(productIndex, 1);
  }
}
