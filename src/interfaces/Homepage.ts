interface HomepageBanner {
    homepageBanner: {
        linkUrl?: string;
        linkText?: string;
        heading?: string;
        description?: string;
    };
}

interface HomepageBannerNode {
    node: HomepageBanner;
}

export type { HomepageBanner, HomepageBannerNode };
