interface Cache {
    tags: string[];
    revalidate?: number;
}

interface GetOptions {
    suppressError?: boolean;
    cache?: Cache;
    withPagination?: boolean;
}

export type { GetOptions, Cache };
