interface SupportPage {
    id: string;
    title: string;
}

interface SupportCohortDiscoveryPageFAQs {
    question: string;
    answer: string;
}

interface SupportCohortDiscoveryPage {
    title: string;
    supportCohortDiscovery: {
        documentation?: string;
        explainer?: {
            node: {
                sourceUrl: string;
            };
        };
        faqs?: SupportCohortDiscoveryPageFAQs[];
    };
}

export type {
    SupportCohortDiscoveryPage,
    SupportCohortDiscoveryPageFAQs,
    SupportPage,
};
