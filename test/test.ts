import { randomUUID } from 'crypto';

import fastify from 'fastify';

import blogpostPlugin from '../src/plugin';

import authorHandler from './handler/author';
import blogpostHandler from './handler/blogpost';

// For Testing we store data in files
const main = async () => {
    const app = fastify({
        logger: true,
        requestIdLogLabel: 'trackingId',
        genReqId() {
            return randomUUID();
        },
    });

    // Register our Plugin
    await app.register(blogpostPlugin, {
        actions: {
            authors: authorHandler,
            blogposts: blogpostHandler,
        },
    });

    try {
        await app.listen({ port: 8080 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
