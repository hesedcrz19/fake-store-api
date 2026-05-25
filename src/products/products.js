import { readJSON } from '../utils/readJSON.js';

export const products = readJSON(import.meta.url, '../json/products.json');
