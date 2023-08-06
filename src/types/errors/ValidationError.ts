import BaseError from './BaseError';

interface ValidationFailure {
    path: string;
    message: string;
}

export default class ValidationError extends BaseError {
    readonly validationFailures: ValidationFailure[];

    constructor(validationFailures: ValidationFailure[]) {
        super('VALIDATION_FAILED', 'Validation Failed', 400);

        this.validationFailures = validationFailures;
    }
}
