interface Release {
    node: {
        title: string;
        date: string;
        content: string;
    };
}

interface ReleaseNotesResponse {
    posts: { edges: Release[] };
}

export type { Release, ReleaseNotesResponse };
