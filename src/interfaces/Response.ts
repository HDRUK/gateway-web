interface Cache {
    tag: string;
    revalidate?: number;
}

interface GetOptions {
    suppressError?: boolean;
    cache?: Cache
}

export type { GetOptions, Cache };
