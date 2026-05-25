import { readJSON } from '../utils/readJSON.js';

export const categories = readJSON(import.meta.url, '../json/categories.json');
