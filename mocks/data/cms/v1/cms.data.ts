import { faker } from "@faker-js/faker";
import { CMSPostResponse } from "@/interfaces/Cms";
import { ReleaseNode } from "@/interfaces/Releases";
import { MissionAndPurposesNode } from "@/interfaces/MissionAndPurposes";

const generateReleaseV1 = (data = {}): CMSPostResponse<ReleaseNode> => {
    return {
        posts: {
            edges: [
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
                                "2022-01-01T00:00:00.000Z",
                                "2022-03-01T00:00:00.000Z"
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
            ],
        },
        ...data,
    };
};

const releaseV1 = generateReleaseV1();

const generateMissionV1 = (
    data = {}
): CMSPostResponse<MissionAndPurposesNode> => {
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

export { generateReleaseV1, releaseV1, missionV1, generateMissionV1 };
