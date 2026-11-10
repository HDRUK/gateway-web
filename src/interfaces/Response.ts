interface Cache {
    tags: string[];
    revalidate?: number;
}

interface GetOptions {
    suppressError?: boolean;
    cache?: Cache;
    withPagination?: boolean;
    serveRaw?: boolean;
    isPublic?: boolean;
}

export type { GetOptions, Cache };
