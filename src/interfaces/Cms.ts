interface CMSPostResponse<T> {
    posts: { edges: T[] };
}
interface CMSPageResponse<T> {
    pages: { nodes: T[] };
}

interface PageTemplate1 {
    id: string;
    title: string;
    template: {
        template1Fields: {
            bannerTitle: string;
            ctaLink: {
                target: string;
                url: string;
                title: string;
            };
            topRightPanel: string;
            topLeftPanel: string;
            middlePanel: string;
        };
    };
}

export type { CMSPostResponse, PageTemplate1, CMSPageResponse };
