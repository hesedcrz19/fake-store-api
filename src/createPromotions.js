import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createProduct } from './products/createProduct.js';

const ratings = [0.5, 1, 1.5, 2, 2.5, 3, 3, 3.5, 3.5, 3.5, 4, 4, 4, 4, 4.5, 4.5, 4.5, 4.5, 4.5, 5, 5, 5, 5, 5];

const productsJSON = await readFile(join(process.cwd(), 'src', 'json', 'products.json'), 'utf-8');
const products = JSON.parse(productsJSON);

const newProducts = products.map((product) =>
  createProduct({
    ...product,
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    createdAt: product.creationAt,
  }),
);

await writeFile(
  join(process.cwd(), 'src', 'json', 'products.json'),
  JSON.stringify(newProducts, null, 2),
  'utf-8',
);
