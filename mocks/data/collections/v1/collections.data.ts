import { faker } from "@faker-js/faker";
import { Collection } from "@/interfaces/Collection";

const generateCollectionV1 = (data = {}): Collection => {
    return {
        _id: faker.datatype.uuid(),
        _explanation: [faker.datatype.string(), faker.datatype.string()],
        _score: faker.datatype.number(),
        _source: {
            name: faker.datatype.string(),
            datasetAbstracts: [
                faker.datatype.string(),
                faker.datatype.string(),
            ],
            datasetTitles: [faker.datatype.string(), faker.datatype.string()],
            description: faker.datatype.string(),
            keywords: [faker.word.noun()],
            publisherName: faker.company.name(),
        },
        ...data,
    };
};

export { generateCollectionV1 };
