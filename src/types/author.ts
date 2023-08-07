import { Type } from '@sinclair/typebox';

import type { Static } from '@sinclair/typebox';

const BaseAuthorSchema = Type.Object({
    name: Type.String({ minLength: 1 }),
    description: Type.String({ minLength: 1 }),
    icon: Type.String({ minLength: 1, format: 'uri' }),
});

export const AuthorScheme = Type.Object({
    ...BaseAuthorSchema.properties,
    id: Type.String({ format: 'uuid' }),
});

export const AuthorPayloadScheme = Type.Object({
    ...BaseAuthorSchema.properties,
});

export const AuthorFilterScheme = Type.Optional(AuthorScheme);

export type Author = Static<typeof AuthorScheme>;
export type AuthorFilter = Static<typeof AuthorFilterScheme>;
export type AuthorPayload = Static<typeof AuthorPayloadScheme>;
