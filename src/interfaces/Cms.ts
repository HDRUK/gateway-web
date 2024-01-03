interface CMSPostResponse<T> {
    posts: { edges: T[] };
}
interface CMSPageResponse<T> {
    pages: { nodes: T[] };
}

interface PageTemplateDefault {
    id: string;
    title: string;
    content: string;
}

interface PageTemplate1 {
    id: string;
    title: string;
    template: {
        template1Fields: {
            bannerTitle: string;
            ctaLink?: {
                target: string;
                url: string;
                title: string;
            };
            topRightPanel?: string;
            topLeftPanel: string;
            middlePanel: string;
        };
    };
}

export type {
    CMSPostResponse,
    PageTemplateDefault,
    PageTemplate1,
    CMSPageResponse,
};
