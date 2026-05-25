export class AppError extends Error {
  constructor(message, status, code) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export const createError = ({ status, code, message }) => new AppError(message, status, code);
