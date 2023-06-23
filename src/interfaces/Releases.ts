interface Release {
    id: string;
    title: string;
    date: string;
    content: string;
}
interface ReleaseNode {
    node: Release;
}

interface ReleaseNotesResponse {
    posts: { edges: ReleaseNode[] };
}

export type { ReleaseNode, Release, ReleaseNotesResponse };
