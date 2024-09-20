interface Event {
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

interface EventNode {
    slug: string;
    node: { newsFields: Event };
}

export type { EventNode, Event };
