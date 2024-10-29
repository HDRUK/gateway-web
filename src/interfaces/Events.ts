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
    node: {
        slug: string;
        newsFields: Event;
        categories?: {
            nodes: {
                name: string;
            }[];
        };
    };
}

export type { EventNode, Event };
