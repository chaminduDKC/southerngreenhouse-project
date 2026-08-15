// errors/AppError.ts
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message); // only pass the message string to Error's constructor
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}