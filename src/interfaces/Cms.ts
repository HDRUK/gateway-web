interface CMSResponse<T> {
    posts: { edges: T[] };
}

export type { CMSResponse };
