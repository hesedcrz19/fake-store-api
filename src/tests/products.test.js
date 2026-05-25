import { test, describe } from 'node:test';
import request from 'supertest';
import assert from 'node:assert';
import app from '../app.js';
import ERROR_CODES from '../const/errorCodes.js';

describe('Products', () => {
  describe('GET /products', () => {
    test('Should return an array', async () => {
      const { status, body } = await request(app).get('/products').send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(Array.isArray(body), 'The response should be an array');
    });

    test('Should get a product by id', async () => {
      const id = '6f76662d-a667-431b-a441-187c6cb37c21';
      const { status, body } = await request(app).get(`/products/${id}`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.strictEqual(body.id, id, `Should return a product with the id: ${id}`);
    });

    test('Should get related products by id', async () => {
      const id = '6f76662d-a667-431b-a441-187c6cb37c21';
      const { status, body } = await request(app).get(`/products/${id}/related`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(Array.isArray(body), 'Should return an array');
      assert.ok(
        body.every((product) => product.category.id === body[0].category.id && product.id !== id),
        "All products should be of the same category and shouldn't include the searched id product",
      );
    });

    test('Should get a product by slug', async () => {
      const slug = 'majestic-mountain-graphic-t-shirt';
      const { status, body } = await request(app).get(`/products/slug/${slug}`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.strictEqual(body.slug, slug, `Should return a product with the slug: ${slug}`);
    });

    test('Should get related products by slug', async () => {
      const slug = 'majestic-mountain-graphic-t-shirt';
      const { status, body } = await request(app).get(`/products/slug/${slug}/related`).send();
      assert.strictEqual(status, 200, 'Should return a 200 status');
      assert.ok(Array.isArray(body), 'Should return an array');
      assert.ok(
        body.every((product) => product.category.id === body[0].category.id && product.slug !== slug),
        'All products should be of the same category',
      );
    });

    describe('Filter products', () => {
      test('Should filter by title', async () => {
        const title = 'orange';
        const { status, body } = await request(app).get(`/products?title=${title}`).send();
        assert.strictEqual(status, 200, 'Should return a 200 status');
        assert.ok(
          body.every((product) => product.title.toLowerCase().includes(title)),
          `All products should have the title: ${title}`,
        );
      });
      test('Should filter by exact price', async () => {
        const price = 10;
        const { status, body } = await request(app).get(`/products?price=${price}`).send();
        assert.strictEqual(status, 200, 'Should return a 200 status');
        assert.ok(
          body.every((product) => product.price === price),
          `All products should have the price: ${price}`,
        );
      });
      test('Should filter by price range', async () => {
        const minPrice = 10;
        const maxPrice = 20;
        const { status, body } = await request(app)
          .get(`/products?minPrice=${minPrice}&maxPrice=${maxPrice}`)
          .send();
        assert.strictEqual(status, 200, 'Should return a 200 status');
        assert.ok(
          body.every((product) => product.price >= minPrice && product.price <= maxPrice),
          'All products should be in the price range',
        );
      });
      test('Should filter by category slug', async () => {
        const slug = 'shoes';
        const { status, body } = await request(app).get(`/products?categorySlug=${slug}`).send();
        assert.strictEqual(status, 200, 'Should return a 200 status');
        assert.ok(
          body.every((product) => product.category.slug === slug),
          `All products should have the category slug: ${slug}`,
        );
      });
      test('Should filter by category id', async () => {
        const id = 'c72a053b-a33b-41aa-9e17-008651ee5f55';
        const { status, body } = await request(app).get(`/products?categoryId=${id}`).send();
        assert.strictEqual(status, 200, 'Should return a 200 status');
        assert.ok(
          body.every((product) => product.category.id === id),
          `All products should have the id: ${id}`,
        );
      });
    });
  });

  describe('POST /products', () => {
    test('Should create a product formating the title and creating a slug', async () => {
      const title = '    Mi producto   ';
      const { body } = await request(app)
        .post('/products')
        .send({
          title,
          description: 'Una descripcion',
          originalPrice: 10,
          discountPercentage: 0,
          promotion: null,
          shippingCost: 0,
          rating: 5,
          images: ['https://placehold.co/600x400'],
          categoryId: 'c72a053b-a33b-41aa-9e17-008651ee5f55',
        });
      assert.strictEqual(body.title, title.trim().replace(/\s+/g, ' '), 'Should modify and create the title');
      assert.strictEqual(body.slug, body.title.toLowerCase().replaceAll(' ', '-'), 'Should create the slug');
    });

    test('Should fail the creation and return a type error from the title', async () => {
      const response = await request(app)
        .post('/products')
        .send({
          title: '',
          description: 'Una descripcion',
          originalPrice: 10,
          discountPercentage: 0,
          promotion: null,
          shippingCost: 0,
          categoryId: 'c72a053b-a33b-41aa-9e17-008651ee5f55',
          images: ['https://placehold.co/600x400'],
        });
      const { body } = response;
      assert.strictEqual(response.status, 400, 'Should return a 400 status');
      assert.strictEqual(body.error.code, ERROR_CODES.TYPE_ERROR, 'Should return a type error code');
      assert.ok(
        body.error.errors.some((val) => val.path.includes('title')),
        'The errors should include a title error',
      );
    });
  });

  describe('PATCH /products', () => {
    test('Should modified partially a product', async () => {
      const originalPrice = 140;
      const response = await request(app)
        .patch('/products/6f76662d-a667-431b-a441-187c6cb37c21')
        .send({ originalPrice });
      assert.strictEqual(response.status, 200, 'Should return a 200 status');
      assert.strictEqual(response.body.price, originalPrice - response.body.discount, 'Should modify the price');
    });

    test('Should return an error patching a product', async () => {
      const response = await request(app)
        .patch('/products/6f76662d-a667-431b-a441-187c6cb37c21')
        .send({ originalPrice: '140' });
      assert.strictEqual(response.status, 400, 'Should return a 400 status');
      assert.strictEqual(response.body.error.code, ERROR_CODES.TYPE_ERROR, 'Should return a type error code');
    });
  });

  describe('PUT /products', async () => {
    test('Should modified completely a product', async () => {
      const title = 'Titulo';
      const response = await request(app)
        .put('/products/6f76662d-a667-431b-a441-187c6cb37c21')
        .send({
          title,
          description: 'description',
          originalPrice: 100,
          discountPercentage: 0,
          promotion: null,
          shippingCost: 0,
          rating: 5,
          categoryId: 'c72a053b-a33b-41aa-9e17-008651ee5f55',
          images: ['https://placehold.co/600x400'],
        });
      assert.strictEqual(response.status, 200, 'Shoould return 200 status');
      assert.strictEqual(response.body.title, title, 'should modified the title');
    });

    test('Should return an error putting a product', async () => {
      const response = await request(app).put('/products/6f76662d-a667-431b-a441-187c6cb37c21').send({
        title: 'title',
        description: 'description',
        originalPrice: 100,
        discountPercentage: 0,
        rating: 5,
        categoryId: 'c72a053b-a33b-41aa-9e17-008651ee5f55',
      });
      assert.strictEqual(response.status, 400, 'Should return 400 status');
      assert.strictEqual(response.body.error.code, ERROR_CODES.TYPE_ERROR, 'Should return a type error code');
    });
  });

  describe('DELETE /products', () => {
    test('Should delete a product', async () => {
      const { status } = await request(app).delete('/products/6f76662d-a667-431b-a441-187c6cb37c21').send();
      assert.strictEqual(status, 204, 'Should return a 204 status');
    });

    test('Should return an error deleting a product', async () => {
      const { status, body } = await request(app).delete('/products/6f76662d-a667-431b-a441-187c6cb37c21').send();
      assert.strictEqual(status, 404, 'Should return a 404 status');
      assert.strictEqual(body.error.code, ERROR_CODES.PRODUCT_NOT_FOUND, 'Should return a prodct not found error');
    });
  });
});
