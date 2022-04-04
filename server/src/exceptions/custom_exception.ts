export class CustomError {
    originalError: Error;
    message: string;

    constructor(originalError?: Error) {
        if (originalError) {
            this.originalError = originalError
            this.message = originalError.message
        }
        else {
            this.message = "";
        }
    }
}
