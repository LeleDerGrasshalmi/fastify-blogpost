import BaseError from '../types/errors/BaseError';
import ServerError from '../types/errors/ServerError';
import ValidationError from '../types/errors/ValidationError';

import author from './api/author';

import type { PluginOptions } from '../types/options';
import type { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance, options: PluginOptions) => {
    fastify.setSchemaErrorFormatter((errors) => new ValidationError(errors.map((e) => ({
        path: e.instancePath,
        message: e.message ?? `${e.keyword} Mismatch`,
    }))));

    fastify.setErrorHandler((err, req, res) => {
        req.log.error(err);

        if (err instanceof ValidationError) {
            const {
                errorCode, errorMessage, responseCode, validationFailures,
            } = err;

            return res.status(responseCode).send({
                errorCode,
                errorMessage,
                validationFailures,
            });
        }

        const { errorCode, errorMessage, responseCode } = err instanceof BaseError
            ? err
            : new ServerError(err.message);

        return res.status(responseCode).send({
            errorCode,
            errorMessage,
        });
    });

    await fastify.register(author, {
        ...options,
        prefix: '/authors',
    });
};
