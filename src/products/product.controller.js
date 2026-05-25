import { ProductModel } from './product.model.js';
import { productQuerySchema } from './schemas/productQuerySchema.js';
import { uuidSchema } from '../schemas/uuidSchema.js';

export class ProductController {
  static async getAll(req, res) {
    const products = await ProductModel.getAll(productQuerySchema.parse(req.query));
    res.json(products);
  }

  static async getById(req, res) {
    const product = await ProductModel.getById({
      id: uuidSchema.parse(req.params.id),
    });
    res.json(product);
  }

  static async getRelatedById(req, res) {
    const product = await ProductModel.getRelatedById({
      id: uuidSchema.parse(req.params.id),
      filters: productQuerySchema.parse(req.query),
    });
    res.json(product);
  }

  static async getBySlug(req, res) {
    const product = await ProductModel.getBySlug({ slug: req.params.slug });
    res.json(product);
  }

  static async getRelatedBySlug(req, res) {
    const product = await ProductModel.getRelatedBySlug({
      slug: req.params.slug,
      filters: productQuerySchema.parse(req.query),
    });
    res.json(product);
  }

  static async create(req, res) {
    const newProduct = await ProductModel.create({ body: req.body });
    res.status(201).json(newProduct);
  }

  static async update(req, res) {
    const newProduct = await ProductModel.update({
      id: uuidSchema.parse(req.params.id),
      body: req.body,
    });
    res.json(newProduct);
  }

  static async delete(req, res) {
    await ProductModel.delete({ id: uuidSchema.parse(req.params.id) });
    res.status(204).send();
  }
}
