import BaseError from '../types/errors/BaseError';
import NotFoundError from '../types/errors/NotFoundError';
import ServerError from '../types/errors/ServerError';
import ValidationError from '../types/errors/ValidationError';

import type { AuthorFilter, AuthorPayload } from '../types/author';
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

    // TOOD: move Authors routes into own file
    fastify.route<{ Querystring: AuthorFilter }>({
        method: 'GET',
        url: '/authors',
        // TODO: proper schema
        schema: {
            querystring: {
                id: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                icon: {
                    type: 'string',
                },
            },
        },
        handler: async (req) => options.actions.authors.findAll(req.query),
    });

    fastify.route<{ Body: AuthorPayload }>({
        method: 'POST',
        url: '/authors',
        // TODO: proper schema
        schema: {
            body: {
                type: 'object',
                required: ['name', 'description', 'icon'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 1,
                    },
                    description: {
                        type: 'string',
                        minLength: 1,
                    },
                    icon: {
                        type: 'string',
                        minLength: 1,
                    },
                },
            },
        },
        handler: async (req) => options.actions.authors.create(req.body),
    });

    fastify.route<{ Params: { id: string } }>({
        method: 'GET',
        url: '/authors/:id',
        // TODO: proper schema
        schema: {
            params: {
                id: {
                    type: 'string',
                },
            },
        },
        handler: async (req) => {
            const { params: { id } } = req;
            const author = await options.actions.authors.findOne({ id });

            if (author === null) {
                throw new NotFoundError(`Author '${id}' was not found`);
            }

            return author;
        },
    });

    fastify.route<{ Params: { id: string }; Body?: AuthorPayload }>({
        method: 'PATCH',
        url: '/authors/:id',
        // TODO: proper schema
        schema: {
            body: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        minLength: 1,
                    },
                    description: {
                        type: 'string',
                        minLength: 1,
                    },
                    icon: {
                        type: 'string',
                        minLength: 1,
                    },
                },
            },
        },
        handler: async (req, res) => {
            const { body, params: { id } } = req;

            const author = await options.actions.authors.findOne({ id });

            if (author === null) {
                throw new NotFoundError(`Author '${id}' was not found`);
            }

            await options.actions.authors.update({
                id: author.id,
                name: body?.name ?? author.name,
                description: body?.description ?? author.description,
                icon: body?.icon ?? author.icon,
            });

            return res.status(204).send();
        },
    });
};
