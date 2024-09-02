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
    node: { newsFields: News };
}

export type { NewsNode, News };
