import { faker } from "@faker-js/faker";
import { CMSPostsResponse } from "@/interfaces/Cms";
import { EventNode } from "@/interfaces/Events";
import { HomepageBannerNode } from "@/interfaces/Homepage";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import { NewsNode } from "@/interfaces/News";
import { ReleaseNode } from "@/interfaces/Releases";

const generateEventNode = (date: string, id: string): EventNode => ({
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

const generateNewsNode = (date: string, id: string): EventNode => ({
    node: {
        slug: `news-${id}`,
        newsFields: {
            id,
            headline: `News ${id}`,
            date,
            text: `News ${id} text`,
            link: {
                url: `http://news/${id}`,
                title: `News link ${id}`,
            },
            image: {
                node: {
                    mediaItemUrl: `http://mediaItem/${id}`,
                    altText: `News media title ${id}`,
                },
            },
        },
    },
});

const generateReleaseNode = (date: string, id: string): ReleaseNode => ({
    node: {
        id,
        title: `Release ${id}`,
        date,
        content: `Release ${id} content`,
        release: {
            releaseDate: date,
        },
    },
});

const generateHomepageBannerV1 = (
    data = {}
): CMSPostsResponse<HomepageBannerNode> => {
    return {
        posts: {
            edges: [
                {
                    node: {
                        homepageBanner: {
                            heading: "Banner heading 1",
                            description: "Banner description 1",
                            linkText: "Read more 1",
                            linkUrl: "http://link1.me",
                        },
                    },
                },
                {
                    node: {
                        homepageBanner: {
                            heading: "Banner heading 2",
                            description: "Banner description 2",
                            linkText: "Read more 2",
                            linkUrl: "http://link2.me",
                        },
                    },
                },
            ],
        },
        ...data,
    };
};

const homepageBannerV1 = generateHomepageBannerV1();

const generateNewsV1 = (data = {}): CMSPostsResponse<NewsNode> => {
    return {
        posts: {
            edges: [
                generateNewsNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "1"
                ),
                generateNewsNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "2"
                ),
            ],
        },
        ...data,
    };
};

const generateEventsV1 = (data = {}): CMSPostsResponse<EventNode> => {
    return {
        posts: {
            edges: [
                generateEventNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "1"
                ),
                generateEventNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "2"
                ),
            ],
        },
        ...data,
    };
};

const generateReleaseV1 = (data = {}): CMSPostsResponse<ReleaseNode> => {
    return {
        posts: {
            edges: [
                generateReleaseNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "1"
                ),
                generateReleaseNode(
                    faker.date
                        .between(
                            "2023-01-01T00:00:00.000Z",
                            "2023-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "2"
                ),
                generateReleaseNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "3"
                ),
                generateReleaseNode(
                    faker.date
                        .between(
                            "2024-01-01T00:00:00.000Z",
                            "2024-03-01T00:00:00.000Z"
                        )
                        .toISOString(),
                    "4"
                ),
            ],
        },
        ...data,
    };
};

const releaseV1 = generateReleaseV1();

const newsV1 = generateNewsV1();

const eventsV1 = generateEventsV1();

const generateMissionV1 = (
    data = {}
): CMSPostsResponse<MissionAndPurposesNode> => {
    return {
        posts: {
            edges: [
                {
                    node: {
                        date: faker.date.past().toISOString(),
                        title: faker.lorem.lines(),
                        content: faker.lorem.lines(),
                        id: faker.datatype.string(),
                    },
                },
                {
                    node: {
                        date: faker.date.past().toISOString(),
                        title: faker.lorem.lines(),
                        content: faker.lorem.lines(),
                        id: faker.datatype.string(),
                    },
                },
            ],
        },
        ...data,
    };
};

const missionV1 = generateMissionV1();

export {
    generateEventNode,
    generateReleaseNode,
    generateHomepageBannerV1,
    generateMissionV1,
    generateNewsV1,
    generateReleaseV1,
    generateEventsV1,
    missionV1,
    newsV1,
    releaseV1,
    eventsV1,
    homepageBannerV1,
};
