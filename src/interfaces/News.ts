interface News {
    id: string;
    headline: string;
    date: string;
    text: string;
    link: {
        url: string;
        title: string;
    };
    image: {
        node: {
            mediaItemUrl: string;
            altText: string;
        };
    };
}

interface NewsNode {
    node: {
        slug: string;
        newsFields: News;
        categories?: {
            nodes: {
                name: string;
            }[];
        };
    };
}

export type { NewsNode, News };
