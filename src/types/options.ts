import type { Author, AuthorFilter, AuthorPayload } from './author';
// import type { Blogpost, BlogpostPayload } from './blogpost';

export interface PluginOptions {
    actions: {
        authors: ActionFunctions<Author, AuthorFilter, AuthorPayload>;
        // blogposts: ActionFunctions<Blogpost, unknown, BlogpostPayload>;
    };
}

export interface ActionFunctions<TResult, TFilter, TPayload> {
    findAll: (opt: TFilter) => Promise<TResult[]>;
    findOne: (opt: TFilter) => Promise<TResult | null>;
    update: (updated: TResult) => Promise<void>;
    create: (data: TPayload) => Promise<TResult>;
}
