import { CategoryModel } from './category.model.js';
import { uuidSchema } from '../schemas/uuidSchema.js';
import { productQuerySchema } from '../products/schemas/productQuerySchema.js';

export class CategoryController {
  static async getAll(req, res) {
    const categories = await CategoryModel.getAll();
    res.json(categories);
  }

  static async getById(req, res) {
    const category = await CategoryModel.getById({
      id: uuidSchema.parse(req.params.id),
    });
    res.json(category);
  }

  static async getProductsByCategoryId(req, res) {
    const products = await CategoryModel.getProductsByCategoryId({
      id: uuidSchema.parse(req.params.id),
      filters: productQuerySchema.parse(req.query),
    });
    res.json(products);
  }

  static async getBySlug(req, res) {
    const category = await CategoryModel.getBySlug({ slug: req.params.slug });
    res.json(category);
  }

  static async getProductsByCategorySlug(req, res) {
    const products = await CategoryModel.getProductsByCategorySlug({
      slug: req.params.slug,
      filters: productQuerySchema.parse(req.query),
    });
    res.json(products);
  }

  static async create(req, res) {
    const category = await CategoryModel.create({ body: req.body });
    res.status(201).json(category);
  }

  static async update(req, res) {
    const category = await CategoryModel.update({
      id: uuidSchema.parse(req.params.id),
      body: req.body,
    });
    res.status(201).json(category);
  }

  static async delete(req, res) {
    await CategoryModel.delete({
      id: uuidSchema.parse(req.params.id),
    });
    res.status(204).send();
  }
}
