export const validateBody = (schema) => (req, res, next) => {
  try {
    const validatation = schema.parse(req.body);
    req.body = validatation;
    next();
  } catch (e) {
    next(e);
  }
};
export const validatePartialBody = (schema) => (req, res, next) => {
  try {
    const validatation = schema.partial().parse(req.body);
    req.body = validatation;
    next();
  } catch (e) {
    next(e);
  }
};
