export class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Llama al constructor padre (Error)
    this.statusCode = statusCode;
  }
}