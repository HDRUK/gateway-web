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
    slug: string;
    node: { newsFields: News };
}

export type { NewsNode, News };
