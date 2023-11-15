import { faker } from "@faker-js/faker";
import { Dataset, DatasetSchema } from "@/interfaces/Dataset";

const generateDatasetSchemaV1 = (data = {}): DatasetSchema => {
    return {
        metadata: {
            summary: {
                title: faker.datatype.string(),
                publisher: {
                    publisherName: faker.datatype.string(),
                },
            },
        },
        ...data,
    };
};

const generateDatasetV1 = (data = {}): Dataset => {
    return {
        id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["Archived", "Active", "Draft"]),
        create_origin: faker.helpers.arrayElement(["FMA", "API", "MANUAL"]),
        version: faker.helpers.arrayElement(["1.0.0", "2.0.0"]),
        pid: faker.datatype.uuid(),
        dataset: generateDatasetSchemaV1(),
        label: faker.datatype.string(),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const datasetSchemaV1 = generateDatasetSchemaV1();
const datasetV1 = generateDatasetV1();
const datasetsV1 = Array.from({ length: 3 }).map(() => generateDatasetV1());

export {
    generateDatasetV1,
    datasetsV1,
    datasetV1,
    generateDatasetSchemaV1,
    datasetSchemaV1,
};
