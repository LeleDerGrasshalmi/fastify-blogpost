import BaseError from './BaseError';

export default class ServerError extends BaseError {
    constructor(message?: string) {
        super('SERVER_ERROR', message ?? 'Server Error', 500);
    }
}
