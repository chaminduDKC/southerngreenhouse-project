// errors/AppError.ts
export class AppError extends Error {
    code;
    statusCode;
    constructor(code, message, statusCode = 500) {
        super(message); // only pass the message string to Error's constructor
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
//# sourceMappingURL=AppError.js.map