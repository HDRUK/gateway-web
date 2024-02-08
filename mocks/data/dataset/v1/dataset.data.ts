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
                abstract: faker.datatype.string(),
                contactPoint: faker.datatype.string(),
                controlledKeywords: faker.datatype.string(),
                datasetType: faker.datatype.string(),
                description: faker.datatype.string(),
                doiName: faker.datatype.string(),
                keywords: faker.datatype.string(),
                shortTitle: faker.datatype.string(),
            },
            provenance: {
                temporal: {
                    startDate: faker.date.past().toString(),
                    endDate: faker.date.past().toString(),
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
        team_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        create_origin: faker.helpers.arrayElement(["FMA", "API", "MANUAL"]),
        pid: faker.datatype.uuid(),
        versions: Array.from({ length: 3 }).map(() =>
            generateDatasetVersionV1()
        ),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const datasetVersionV1 = generateDatasetVersionV1();
const datasetV1 = generateDatasetV1();
const datasetsV1 = Array.from({ length: 3 }).map(() => generateDatasetV1());

export {
    generateDatasetV1,
    generateDatasetMetadataV1,
    generateDatasetVersionV1,
    datasetsV1,
    datasetV1,
    datasetVersionV1,
};
