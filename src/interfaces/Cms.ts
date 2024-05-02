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

interface NewsPost {
    node: {
        id: string;
        title: string;
        content: string;
        newsFields: {
            headline: string;
            date: string;
            text: string;
            content: string;
            image: {
                node: {
                    mediaItemUrl: string;
                    altText: string;
                };
            };
            link: {
                url: string;
                title: string;
            };
        };
    };
}
interface PageTemplateHome {
    page: {
        id: string;
        title: string;
        content: string;
        template: {
            homeFields: {
                newsHeader: string;
                gatewayVideo: string;
                gatewayVideoHeader: string;
                affiliateLink: {
                    url: string;
                    title: string;
                };
                logos: {
                    organisationCharity: string;
                    websiteAddress: string;
                    imageLocation: { node: { mediaItemUrl: string } };
                }[];
                newsletterSignupHeader: string;
                newsletterSignupDescription: string;
                newsletterSignupLink: string;
            };
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
    };
    posts: {
        edges: NewsPost[];
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
    NewsPost,
};
