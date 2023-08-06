import apiRouter from './routes/api';

import type { PluginOptions } from './types/options';
import type { FastifyInstance } from 'fastify';

const blogpostPlugin = async (fastify: FastifyInstance, options: PluginOptions, done: () => void) => {
    await fastify.register(apiRouter, {
        prefix: '/api',
        ...options,
    });

    done();
};

export default blogpostPlugin;
