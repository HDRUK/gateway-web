import { faker } from "@faker-js/faker";
import { Dataset, Metadata, VersionItem } from "@/interfaces/Dataset";

const generateDatasetMetadataV1 = (): { metadata: Metadata } => {
    return {
        metadata: {
            summary: {
                title: faker.datatype.string(),
                publisher: {
                    publisherName: faker.datatype.string(),
                },
            },
        },
    };
};

const generateDatasetVersionV1 = (): VersionItem => {
    return {
        id: faker.datatype.number(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        deleted_at: null,
        dataset_id: faker.datatype.number(),
        metadata: generateDatasetMetadataV1(),
        version: faker.datatype.number(),
    };
};

const generateDatasetV1 = (data = {}): Dataset => {
    return {
        id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        create_origin: faker.helpers.arrayElement(["FMA", "API", "MANUAL"]),
        pid: faker.datatype.uuid(),
        versions: Array.from({ length: 3 }).map(() =>
            generateDatasetVersionV1()
        ),
        label: faker.datatype.string(),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const datasetVersionV1 = generateDatasetVersionV1();
const datasetV1 = generateDatasetV1();
const datasetsV1 = Array.from({ length: 3 }).map(() => generateDatasetV1());

export {
    generateDatasetV1,
    generateDatasetVersionV1,
    datasetsV1,
    datasetV1,
    datasetVersionV1,
};
