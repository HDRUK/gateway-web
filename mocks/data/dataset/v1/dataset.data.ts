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

const generateDatasetMetadataV1p1 = (): { metadata: Metadata } => {
    return {
        metadata: {
            summary: {
                title: faker.datatype.string(),
                publisher: {
                    name: faker.datatype.string(),
                },
            },
        },
    };
};

const generateDatasetVersionV1 = (version: string): VersionItem => {
    return {
        id: faker.datatype.number(),
        created_at: faker.date.past().toString(),
        updated_at: faker.date.past().toString(),
        deleted_at: null,
        dataset_id: faker.datatype.number(),
        metadata:
            version === "1.0"
                ? generateDatasetMetadataV1()
                : generateDatasetMetadataV1p1(),
        version: faker.datatype.number(),
    };
};

const generateDatasetV1 = (version = "1.0", data = {}): Dataset => {
    return {
        id: faker.datatype.number(),
        team_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        create_origin: faker.helpers.arrayElement(["FMA", "API", "MANUAL"]),
        pid: faker.datatype.uuid(),
        versions: Array.from({ length: 3 }).map(() =>
            generateDatasetVersionV1(version)
        ),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const datasetVersionV1 = generateDatasetVersionV1("1.0");
const datasetVersionV1p1 = generateDatasetVersionV1("1.1");
const datasetV1 = generateDatasetV1("1.0");
const datasetV1p1 = generateDatasetV1("1.1");
const datasetsV1 = Array.from({ length: 3 }).map(() =>
    generateDatasetV1("1.0")
);
const datasetsV1p1 = Array.from({ length: 3 }).map(() =>
    generateDatasetV1("1.1")
);

export {
    generateDatasetV1,
    generateDatasetVersionV1,
    datasetsV1,
    datasetsV1p1,
    datasetV1,
    datasetV1p1,
    datasetVersionV1,
    datasetVersionV1p1,
};
