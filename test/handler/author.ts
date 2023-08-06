import { randomUUID } from 'crypto';
import { readFile, writeFile } from 'fs/promises';

import { getAuthorsFile } from '../path';
import { filterArray } from '../utils/array';

import type { Author, AuthorFilter, AuthorPayload } from '../../src/types/author';
import type { PluginOptions } from '../../src/types/options';

const readAuthors = async (): Promise<Author[]> => {
    try {
        const serializedAuthors = await readFile(getAuthorsFile(), 'utf-8');

        return JSON.parse(serializedAuthors) as Author[];
    } catch (err) {
        console.error(err);

        return [];
    }
};

const writeAuthors = async (data: Author[]): Promise<void> => {
    try {
        await writeFile(getAuthorsFile(), JSON.stringify(data));
    } catch (err) {
        console.error(err);
        //
    }
};

export default {
    findAll: async (filter: AuthorFilter) => {
        const authors = await readAuthors();

        return filterArray(authors, filter);
    },
    findOne: async (filter: AuthorFilter) => {
        const authors = await readAuthors();

        // Find One - Only By Id (Unique)
        return authors.find((author) => author.id === filter.id) ?? null;
    },
    create: async (data: AuthorPayload) => {
        const author: Author = {
            id: randomUUID(),
            ...data,
        };

        const authors = await readAuthors();
        authors.push(author);

        await writeAuthors(authors);

        return author;
    },
    update: async (updated: Author) => {
        const authors = await readAuthors();
        const authorIdx = authors.findIndex((a) => a.id === updated.id);
        authors[authorIdx] = updated;

        await writeAuthors(authors);
    },
} satisfies PluginOptions['actions']['authors'];
