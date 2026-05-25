import { ZodError } from 'zod';
export const errorMiddleware = (err, req, res, _) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: 'type_error',
        message: 'Type error',
        errors: JSON.parse(err),
      },
    });
  }

  res.status(err.status || 500).json({
    error: {
      code: err.code || 'internal_error',
      message: err.message || 'Internal error',
    },
  });
};
