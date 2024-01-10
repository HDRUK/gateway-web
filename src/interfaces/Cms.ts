interface CMSPostResponse<T> {
    posts: { edges: T[] };
}
interface CMSPagesResponse<T> {
    pages: { nodes: T[] };
}
interface CMSPageResponse<T> {
    page: T;
}

interface PageTemplateDefault {
    id: string;
    title: string;
    content: string;
}

interface CtaLink {
    target: string;
    url: string;
    title: string;
}

interface PageTemplate1 {
    id: string;
    title: string;
    template: {
        template1Fields: {
            bannerTitle: string;
            ctaLink?: CtaLink;
            topRightPanel?: string;
            topLeftPanel: string;
            middlePanel: string;
        };
    };
    ctaOverrideComponent?: React.ReactElement;
}

interface templateRepeatFields {
    title: string;
    subTitle: string;
    description: string;
    contents: { title: string; content: string }[];
}

interface PageTemplateRepeat {
    id: string;
    title: string;
    template: {
        repeatFields: templateRepeatFields;
    };
}

export type {
    templateRepeatFields,
    PageTemplateRepeat,
    CMSPostResponse,
    PageTemplateDefault,
    PageTemplate1,
    CMSPageResponse,
    CMSPagesResponse,
    CtaLink,
};
