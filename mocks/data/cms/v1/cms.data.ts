import { faker } from "@faker-js/faker";
import { CMSPostsResponse } from "@/interfaces/Cms";
import { EventNode } from "@/interfaces/Events";
import { HomepageBannerNode } from "@/interfaces/Homepage";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";
import { NewsNode } from "@/interfaces/News";
import { ReleaseNode } from "@/interfaces/Releases";

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
                {
                    node: {
                        newsFields: {
                            id: "1",
                            headline: "News article 1 headline",
                            link: {
                                url: "https://www.hdruk.ac.uk/news_1",
                                title: "read more",
                            },
                            text: "News article 1 text",
                            date: "2024-03-27T00:00:00+00:00",
                            image: {
                                node: {
                                    mediaItemUrl:
                                        "https://www.hdruk.ac.uk/news_1/img.jpg",
                                    altText: "",
                                },
                            },
                        },
                    },
                },
                {
                    node: {
                        newsFields: {
                            id: "1",
                            headline: "News article 2 headline",
                            link: {
                                url: "https://www.hdruk.ac.uk/news_2",
                                title: "read more",
                            },
                            text: "News article 2 text",
                            date: "2024-03-27T00:00:00+00:00",
                            image: {
                                node: {
                                    mediaItemUrl:
                                        "https://www.hdruk.ac.uk/news_2/img.jpg",
                                    altText: "",
                                },
                            },
                        },
                    },
                },
            ],
        },
        ...data,
    };
};

const generateEventsV1 = (data = {}): CMSPostsResponse<EventNode> => {
    return {
        posts: {
            edges: [
                {
                    node: {
                        newsFields: {
                            id: "1",
                            headline: "Event article 1 headline",
                            link: {
                                url: "https://www.hdruk.ac.uk/event_1",
                                title: "read more",
                            },
                            text: "Event article 1 text",
                            date: "2024-03-27T00:00:00+00:00",
                            image: {
                                node: {
                                    mediaItemUrl:
                                        "https://www.hdruk.ac.uk/event_1/img.jpg",
                                    altText: "",
                                },
                            },
                        },
                    },
                },
                {
                    node: {
                        newsFields: {
                            id: "1",
                            headline: "Event article 2 headline",
                            link: {
                                url: "https://www.hdruk.ac.uk/event_2",
                                title: "read more",
                            },
                            text: "Event article 2 text",
                            date: "2024-03-27T00:00:00+00:00",
                            image: {
                                node: {
                                    mediaItemUrl:
                                        "https://www.hdruk.ac.uk/event_2/img.jpg",
                                    altText: "",
                                },
                            },
                        },
                    },
                },
            ],
        },
        ...data,
    };
};

const generateReleaseV1 = (data = {}): CMSPostsResponse<ReleaseNode> => {
    return {
        posts: {
            edges: [
                {
                    node: {
                        date: faker.date
                            .between(
                                "2024-01-01T00:00:00.000Z",
                                "2024-03-01T00:00:00.000Z"
                            )
                            .toISOString(),
                        title: faker.lorem.words(5),
                        content: faker.lorem.lines(),
                        id: faker.datatype.string(),
                    },
                },
                {
                    node: {
                        date: faker.date
                            .between(
                                "2023-01-01T00:00:00.000Z",
                                "2023-03-01T00:00:00.000Z"
                            )
                            .toISOString(),
                        title: faker.lorem.words(5),
                        content: faker.lorem.lines(),
                        id: faker.datatype.string(),
                    },
                },
                {
                    node: {
                        date: faker.date
                            .between(
                                "2024-01-01T00:00:00.000Z",
                                "2024-03-01T00:00:00.000Z"
                            )
                            .toISOString(),
                        title: faker.lorem.words(5),
                        content: faker.lorem.lines(),
                        id: faker.datatype.string(),
                    },
                },
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
