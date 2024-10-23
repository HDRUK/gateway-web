interface Release {
    id: string;
    title: string;
    date: string;
    content: string;
    release: {
        releaseDate: string;
    };
}
interface ReleaseNode {
    node: Release;
}

export type { ReleaseNode, Release };
