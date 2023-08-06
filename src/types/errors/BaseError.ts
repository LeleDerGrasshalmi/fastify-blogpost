export default abstract class BaseError extends Error {
    readonly errorCode: string;
    readonly responseCode: number;

    constructor(errorCode: string, errorMessage: string, responseCode: number) {
        super(errorMessage);

        this.errorCode = errorCode;
        this.responseCode = responseCode;
    }

    get errorMessage() {
        return this.message;
    }
}
