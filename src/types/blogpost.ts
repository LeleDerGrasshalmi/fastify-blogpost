import { Type } from '@sinclair/typebox';

import { AuthorScheme } from './author';

import type { Static } from '@sinclair/typebox';

const BaseBlogpostSchema = Type.Object({
    header: Type.String({ minLength: 1 }),
    body: Type.String({ minLength: 1 }),
    image: Type.Object({
        small: Type.String({ format: 'uri' }),
        medium: Type.String({ format: 'uri' }),
        large: Type.String({ format: 'uri' }),
    }),
});

export const BlogpostSchema = Type.Object({
    ...BaseBlogpostSchema.properties,
    id: Type.String({ format: 'uuid' }),
    author: AuthorScheme,
});

export const BlogpostPayloadSchema = Type.Object({
    ...BaseBlogpostSchema.properties,
    authorId: Type.String({ format: 'uuid' }),
});

export const BlogpostFilterScheme = Type.Optional(BlogpostSchema);

export type Blogpost = Static<typeof BlogpostSchema>;
export type BlogpostFilter = Static<typeof BlogpostFilterScheme>;
export type BlogpostPayload = Static<typeof BlogpostPayloadSchema>;
