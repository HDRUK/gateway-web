interface Releases {
    nodes: {
        title: string;
        date: string;
        content: string;
    };
}

interface ReleaseNotesResponse {
    posts: { edges: Releases[] };
}

export type { ReleaseNotesResponse };
