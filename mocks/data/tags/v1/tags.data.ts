import { faker } from "@faker-js/faker";
import { Tag } from "@/interfaces/Tag";

const generateTagV1 = (data = {}): Tag => {
    return {
        created_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        deleted_at: null,
        description: faker.lorem.lines(),
        enabled: faker.datatype.boolean(),
        id: faker.datatype.number(),
        type: faker.helpers.arrayElement(["features", "topics"]),
        updated_at: faker.date
            .between("2020-04-01T00:00:00.000Z", "2030-06-01T00:00:00.000Z")
            .toISOString(),

        ...data,
    };
};

const generateTagsV1 = (length = 3, data = {}): Tag[] => {
    return Array.from({ length }).map(() => generateTagV1(data));
};

const tagV1 = generateTagV1();
const tagsV1 = Array.from({ length: 3 }).map(() => generateTagV1());

export { generateTagsV1, tagsV1, tagV1 };
