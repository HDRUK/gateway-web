import { Tag } from "@/interfaces";
import { faker } from "@faker-js/faker";

const generateTagV1 = (data = {}): Tag => {
    return {
        created_at: faker.date.between(
            "2020-01-01T00:00:00.000Z",
            "2020-03-01T00:00:00.000Z"
        ),
        deleted_at: null,
        description: faker.lorem.lines(),
        enabled: faker.datatype.boolean(),
        id: faker.datatype.number(),
        type: faker.helpers.arrayElement(["features", "topics"]),
        updated_at: faker.date.between(
            "2020-04-01T00:00:00.000Z",
            "2030-06-01T00:00:00.000Z"
        ),

        ...data,
    };
};

const generateTagsV1 = (length = 3, data = {}): { data: Tag[] } => {
    return { data: Array.from({ length }).map(() => generateTagV1(data)) };
};

const tagsV1 = { data: Array.from({ length: 3 }).map(() => generateTagV1()) };

export { generateTagsV1, tagsV1 };
