import { test, describe } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';
import app from '../app.js';
import ERROR_CODES from '../const/errorCodes.js';

describe('Categories', () => {
  describe('GET /categories', () => {
    test('Should return an array', async () => {
      const { status, body } = await request(app).get('/categories').send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(Array.isArray(body), 'Should return an array');
    });

    test('Should find a category by id', async () => {
      const id = 'c72a053b-a33b-41aa-9e17-008651ee5f55';
      const { status, body } = await request(app).get(`/categories/${id}`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(body.id === id, `Should return a category with the id: ${id}`);
    });

    test('Should find a category by slug', async () => {
      const slug = 'electronics';
      const { status, body } = await request(app).get(`/categories/slug/${slug}`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(body.slug === slug, `Should return a category with the slug: ${slug}`);
    });

    test('Should get products of a category id', async () => {
      const id = 'c72a053b-a33b-41aa-9e17-008651ee5f55';
      const { status, body } = await request(app).get(`/categories/${id}/products`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(Array.isArray(body), 'Should return an array of products');
    });

    test('Should get products of a category slug', async () => {
      const slug = 'electronics';
      const { status, body } = await request(app).get(`/categories/slug/${slug}/products`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(Array.isArray(body), 'Should return an array of products');
    });
  });

  describe('POST /categories', () => {
    test('Should create a new category', async () => {
      const { status, body } = await request(app).post('/categories').send({
        name: 'New Category',
        image: 'https://placehold.co/600x400',
      });
      assert.strictEqual(status, 201, 'Should return a 201 status');
      assert.ok(body.id, 'Should return a category with an id');
    });

    test('Should fail creating a new category', async () => {
      const { status, body } = await request(app).post('/categories').send({
        name: 'New Category',
      });
      assert.strictEqual(status, 400, 'Should return a 400 status');
      assert.strictEqual(body.error.code, ERROR_CODES.TYPE_ERROR, 'Should type error code');
    });
  });

  describe('PATCH /categories', () => {
    const id = 'c72a053b-a33b-41aa-9e17-008651ee5f55';
    const name = 'Updated category';
    test('Should create partially a new category', async () => {
      const { status, body } = await request(app).patch(`/categories/${id}`).send({
        name,
        image: 'https://placehold.co/600x400',
      });
      assert.strictEqual(status, 201, 'Should return a 201 status');
      assert.strictEqual(body.name, name, 'Should return a category with the correct name');
    });

    test('Should fail updating partially a new category', async () => {
      const { status, body } = await request(app).patch(`/categories/${id}`).send({
        name,
        image: 'das',
      });
      assert.strictEqual(status, 400, 'Should return a 400 status');
      assert.strictEqual(body.error.code, ERROR_CODES.TYPE_ERROR, 'Should type error code');
    });
  });

  describe('PUT /categories', () => {
    const id = 'c72a053b-a33b-41aa-9e17-008651ee5f55';
    const name = 'Updated category';
    test('Should create a new category', async () => {
      const { status, body } = await request(app).put(`/categories/${id}`).send({
        name,
        image: 'https://placehold.co/600x400',
      });
      assert.strictEqual(status, 201, 'Should return a 201 status');
      assert.strictEqual(body.name, name, 'Should return a category with the correct name');
    });

    test('Should fail updating a new category', async () => {
      const { status, body } = await request(app).put(`/categories/${id}`).send({
        name,
      });
      assert.strictEqual(status, 400, 'Should return a 400 status');
      assert.strictEqual(body.error.code, ERROR_CODES.TYPE_ERROR, 'Should type error code');
    });
  });

  describe('DELETE /categories', () => {
    const id = 'c72a053b-a33b-41aa-9e17-008651ee5f55';
    test('Should delete an existing category', async () => {
      const { status } = await request(app).delete(`/categories/${id}`).send();
      assert.strictEqual(status, 204, 'Should return a 204 status');
    });

    test('Should fail deleting a non-existent category', async () => {
      const { status, body } = await request(app).delete(`/categories/${id}`).send();
      assert.strictEqual(status, 404, 'Should return a 404 status');
      assert.strictEqual(
        body.error.code,
        ERROR_CODES.CATEGORY_NOT_FOUND,
        'Should return a category not found error code',
      );
    });
  });
});
