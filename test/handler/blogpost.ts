import { randomUUID } from 'crypto';
import { readFile, writeFile } from 'fs/promises';

import NotFoundError from '../../src/types/errors/NotFoundError';
import { getBlogpostsFile } from '../path';
import { filterArray } from '../utils/array';

import authorManager from './author';

import type { Blogpost, BlogpostFilter, BlogpostPayload } from '../../src/types/blogpost';
import type { PluginOptions } from '../../src/types/options';

const readBlogposts = async (): Promise<Blogpost[]> => {
    try {
        const serializedAuthors = await readFile(getBlogpostsFile(), 'utf-8');

        return JSON.parse(serializedAuthors) as Blogpost[];
    } catch (err) {
        console.error(err);

        return [];
    }
};

const writeBlogposts = async (data: Blogpost[]): Promise<void> => {
    try {
        await writeFile(getBlogpostsFile(), JSON.stringify(data));
    } catch (err) {
        console.error(err);
        //
    }
};

export default {
    findAll: async (filter: BlogpostFilter) => {
        const blogposts = await readBlogposts();

        return filterArray(blogposts, filter);
    },
    findOne: async (filter: BlogpostFilter) => {
        const blogposts = await readBlogposts();

        // Find One - Only By Id (Unique)
        return blogposts.find((blogpost) => blogpost.id === filter.id) ?? null;
    },
    create: async (data: BlogpostPayload) => {
        const author = await authorManager.findOne({ id: data.authorId });

        if (author === null) {
            throw new NotFoundError(`Author '${data.authorId}' was not found and therefore cannot create a blogpost`);
        }

        const blogpost: Blogpost = {
            id: randomUUID(),
            author,
            ...data,
        };

        const blogposts = await readBlogposts();
        blogposts.push(blogpost);

        await writeBlogposts(blogposts);

        return blogpost;
    },
    update: async (updated: Blogpost) => {
        const blogposts = await readBlogposts();
        const blogpostIdx = blogposts.findIndex((a) => a.id === updated.id);
        blogposts[blogpostIdx] = updated;

        await writeBlogposts(blogposts);
    },
} satisfies PluginOptions['actions']['blogposts'];
