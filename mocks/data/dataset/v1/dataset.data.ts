import { faker } from "@faker-js/faker";
import {
    Dataset,
    Metadata,
    MetadataMax,
    VersionItem,
} from "@/interfaces/Dataset";
import { Highlight } from "@/interfaces/HighlightDataset";
import { SearchResultDataset } from "@/interfaces/Search";

const generateDatasetMetadataV1 = (): MetadataMax => {
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
                populationSize: faker.datatype.number(),
            },
            required: {
                version: "1.0.0",
            },
            provenance: {
                temporal: {
                    startDate: faker.date.past().toString(),
                    endDate: faker.date.past().toString(),
                },
            },
        },
        gwdmVersion: "1.0",
    };
};

const generateDatasetMetadataMiniV1 = (): Metadata => {
    return {
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
            populationSize: faker.datatype.number(),
        },
        provenance: {
            temporal: {
                startDate: faker.date.past().toString(),
                endDate: faker.date.past().toString(),
            },
        },
    };
};

const generateDatasetMetadataV1p1 = (): MetadataMax => {
    return {
        metadata: {
            summary: {
                title: faker.datatype.string(),
                publisher: {
                    name: faker.datatype.string(),
                },
            },
        },
        gwdmVersion: "1.1",
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
        create_origin: faker.helpers.arrayElement(["GMI", "API", "MANUAL"]),
        pid: faker.datatype.uuid(),
        versions: Array.from({ length: 3 }).map(() =>
            generateDatasetVersionV1(version)
        ),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const generateDatasetHighlightsV1 = (): Highlight => {
    return {
        abstract: [faker.datatype.string(), faker.datatype.string()],
        description: [faker.datatype.string(), faker.datatype.string()],
    };
};

const generateSearchResultV1 = (
    data?: Partial<SearchResultDataset>
): SearchResultDataset => ({
    _id: faker.datatype.uuid(),
    highlight: generateDatasetHighlightsV1(),
    metadata: generateDatasetMetadataMiniV1(),
    team: {
        id: faker.datatype.number(),
        member_of: faker.company.name(),
        name: faker.datatype.string(),
        is_question_bank: false,
    },
    ...data,
});

const datasetSearchResultV1 = generateSearchResultV1();
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
    generateDatasetHighlightsV1,
    generateDatasetMetadataV1,
    generateDatasetMetadataMiniV1,
    generateDatasetVersionV1,
    datasetsV1,
    datasetsV1p1,
    datasetV1,
    datasetV1p1,
    datasetVersionV1,
    datasetVersionV1p1,
    datasetSearchResultV1,
};
