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

interface PageTemplatePromo {
    id: string;
    title: string;
    template: {
        promofields: {
            bannerTitle: string;
            ctaLink?: CtaLink;
            topRightPanel?: string;
            topLeftPanel: string;
            middlePanel: string;
        };
    };
    ctaOverrideComponent?: React.ReactElement;
}

interface PageTemplateHome {
    id: string;
    title: string;
    content: string;
    template: {
        meetTheTeam: {
            sectionName: string;
            title: string;
            intro: string;
            image: {
                node: {
                    altText: string;
                    sourceUrl: string;
                };
            };
        };
    };
}

interface templateRepeatFields {
    title: string;
    subTitle: string;
    description: string;
    contents: { label: string; content: string }[];
}

interface PageTemplateRepeat {
    id: string;
    title: string;
    template: {
        repeatfields: templateRepeatFields;
    };
}

export type {
    PageTemplateRepeat,
    PageTemplateDefault,
    PageTemplateHome,
    PageTemplatePromo,
    templateRepeatFields,
    CMSPostResponse,
    CMSPageResponse,
    CMSPagesResponse,
    CtaLink,
};
