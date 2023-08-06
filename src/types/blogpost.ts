import type { Author } from './author';

export interface Blogpost {
    id: string;
    header: string;
    body: string;
    author: Author;
}

export type BlogpostPayload = Omit<Omit<Blogpost, 'id'>, 'author'>;
