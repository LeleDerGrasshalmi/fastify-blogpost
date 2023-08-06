export interface Author {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export type AuthorPayload = Omit<Author, 'id'>;

export type AuthorFilter = Partial<Author>;
