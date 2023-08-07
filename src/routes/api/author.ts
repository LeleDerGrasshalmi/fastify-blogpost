import {
    AuthorFilterScheme, type AuthorFilter, type AuthorPayload, AuthorPayloadScheme,
} from '../../types/author';
import NotFoundError from '../../types/errors/NotFoundError';

import type { PluginOptions } from '../../types/options';
import type { FastifyInstance } from 'fastify';

export default async (fastify: FastifyInstance, options: PluginOptions) => {
    fastify.route<{ Querystring: AuthorFilter }>({
        method: 'GET',
        url: '/authors',
        schema: {
            querystring: AuthorFilterScheme,
        },
        handler: async (req) => options.actions.authors.findAll(req.query),
    });

    fastify.route<{ Body: AuthorPayload }>({
        method: 'POST',
        url: '/authors',
        // TODO: proper schema
        schema: {
            body: AuthorPayloadScheme,
        },
        handler: async (req) => options.actions.authors.create(req.body),
    });

    fastify.route<{ Params: { id: string } }>({
        method: 'GET',
        url: '/authors/:id',
        schema: {
            params: {
                id: {
                    type: 'string',
                },
            },
        },
        handler: async (req) => {
            const { params: { id } } = req;
            // TODO: apparently the Type.Optional doesnt make all properties optional? -- investigate...
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
