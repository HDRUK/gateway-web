import { EventNode } from "@/interfaces/Events";

const mockedEventNode = (date: string, id: string): EventNode => ({
    node: {
        slug: `event-${id}`,
        newsFields: {
            id,
            headline: `Event ${id}`,
            date,
            text: `Event ${id} text`,
            link: {
                url: `http://event/${id}`,
                title: `Event link ${id}`,
            },
            image: {
                node: {
                    mediaItemUrl: `http://mediaItem/${id}`,
                    altText: `Event media title ${id}`,
                },
            },
        },
    },
});

export { mockedEventNode };
