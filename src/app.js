import express from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { productsRouter } from './products/product.routes.js';
import { categoriesRouter } from './categories/category.routes.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(corsMiddleware());

app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);

app.use((req, res) => {
  const url = req.url;
  res.status(404).json({
    error: {
      code: 'error_404',
      message: 'Error 404',
      url,
    },
  });
});
app.use(errorMiddleware);

export default app;
