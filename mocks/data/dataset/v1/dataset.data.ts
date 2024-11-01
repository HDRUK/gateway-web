import { faker } from "@faker-js/faker";
import {
    Dataset,
    Metadata,
    MetadataMax,
    VersionItem,
} from "@/interfaces/Dataset";
import { Highlight } from "@/interfaces/HighlightDataset";
import { SearchResultDataset } from "@/interfaces/Search";


const generatePageDataSetV1 = (): Dataset => {
    return {
        id: faker.datatype.number(),
        mongo_object_id: faker.datatype.uuid(),
        mongo_id: faker.datatype.uuid(),
        mongo_pid: faker.datatype.uuid(),
        datasetid: faker.datatype.uuid(),
        pid: faker.datatype.uuid(),
        source: null,
        discourse_topic_id: 0,
        is_cohort_discovery: false,
        commercial_use: 0,
        state_id: 0,
        uploader_id: 0,
        metadataquality_id: 0,
        user_id: 2,
        team_id: 11,
        views_count: 0,
        views_prev_count: 0,
        has_technical_details: 1,
        created: "2024-08-21 10:56:31",
        updated: "2024-08-21 10:56:31",
        submitted: "2024-08-21 10:56:31",
        published: null,
        created_at: "2024-08-21T10:56:31.000000Z",
        updated_at: "2024-08-21T10:56:31.000000Z",
        deleted_at: null,
        create_origin: "MANUAL",
        status: "ACTIVE",
        durs_count: 0,
        publications_count: 0,
        tools_count: 0,
        collections_count: 0,
        spatialCoverage: [
            {
                id: faker.datatype.uuid(),
                created_at: "2024-08-19T13:18:01.000000Z",
                updated_at: "2024-08-19T13:18:01.000000Z",
                region: "England",
                enabled: true,
                dataset_version_ids: [faker.datatype.uuid()],
            },
        ],
        durs: [],
        publications: [],
        named_entities: [],
        collections: [],
        versions: [
            {
                id: faker.datatype.uuid(),
                created_at: "2024-08-21T10:56:31.000000Z",
                updated_at: "2024-08-21T10:56:31.000000Z",
                deleted_at: null,
                dataset_id: faker.datatype.uuid(),
                metadata: {
                    metadata: {
                        identifier: faker.datatype.uuid(),
                        issued: "2024-08-21T10:56:31.343273Z",
                        modified: "2024-08-21T10:56:31.343277Z",
                        revisions: [],
                        version: "3.0.0",
                        summary: {
                            abstract: faker.datatype.string(),
                            contactPoint: faker.internet.email(),
                            keywords: [faker.datatype.string()],
                            doiName: null,
                            title: faker.datatype.string(),
                            dataCustodian: {
                                name: faker.datatype.string(),
                                identifier: faker.datatype.string(),
                                contactPoint: faker.internet.email(),
                            },
                            populationSize: -1,
                        },
                        documentation: {
                            description: faker.datatype.string(),
                            associatedMedia: null,
                            inPipeline: null,
                        },
                        coverage: {
                            pathway: null,
                            spatial: "United Kingdom,England",
                            datasetCompleteness: null,
                            typicalAgeRangeMin: 0,
                            typicalAgeRangeMax: 150,
                            materialType: ["None/not available"],
                        },
                        provenance: {
                            origin: {
                                purpose: [],
                                source: [],
                                collectionSource: [],
                                datasetType: ["Health and disease"],
                                datasetSubType: ["Not applicable"],
                                imageContrast: null,
                            },
                            temporal: {
                                endDate: null,
                                startDate: "1960-01-01",
                                timeLag: "Other",
                                publishingFrequency: "Other",
                                distributionReleaseDate: "2019-12-11",
                            },
                        },
                        accessibility: {
                            access: {
                                deliveryLeadTime: null,
                                jurisdiction: ["GB"],
                                dataController: faker.datatype.string(),
                                dataProcessor: null,
                                accessRights: faker.datatype.string(),
                                accessService: null,
                                accessRequestCost: faker.datatype.string(),
                                accessMode: "New project",
                                accessServiceCategory: null,
                            },
                            usage: {
                                dataUseLimitation: null,
                                resourceCreator: faker.datatype.string(),
                                dataUseRequirements: null,
                            },
                            formatAndStandards: {
                                conformsTo: [],
                                vocabularyEncodingScheme: ["SNOMED CT"],
                                language: ["en"],
                                format: ["CSV – SQL - XML"],
                            },
                        },
                        enrichmentAndLinkage: {
                            tools: [],
                            investigations: [],
                            publicationAboutDataset: null,
                            publicationUsingDataset: null,
                            derivedFrom: faker.datatype.string(),
                            isPartOf: null,
                            linkableDatasets: faker.datatype.string(),
                            similarToDatasets: null,
                        },
                        observations: [],
                        structuralMetadata: {
                            tables: [
                                {
                                    name: "dbo.Event",
                                    description:
                                        "This class was created from the White Rabbit profile data in 'dbo.Event'",
                                    columns: [
                                        {
                                            name: "Compound",
                                            description: null,
                                            dataType: "varchar",
                                            sensitive: false,
                                            values: [
                                                {
                                                    name: "Male",
                                                    frequency: 50,
                                                    description: null,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                            syntheticDataWebLink: null,
                        },
                    },
                },
                version: 1,
                provider_team_id: null,
                application_type: null,
                reduced_linked_dataset_versions: [
                    {
                        id: faker.datatype.number(),
                        title: faker.datatype.string(),
                        shortTitle: faker.datatype.string(),
                        pivot: {
                            dataset_version_source_id: faker.datatype.number(),
                            dataset_version_target_id: faker.datatype.number(),
                            linkage_type: "linkedDatasets",
                        },
                    },
                ],
                linked_dataset_versions: [
                    {
                        id: faker.datatype.uuid(),
                        title: faker.datatype.string(),
                        pivot: {
                            dataset_version_source_id: faker.datatype.number(),
                            dataset_version_target_id: faker.datatype.number(),
                            linkage_type: "linkedDatasets",
                        },
                    },
                ],
            },
        ],
        team: {
            id: faker.datatype.number(),
            pid: faker.datatype.uuid(),
            created_at: "2024-08-19T14:50:47.000000Z",
            updated_at: "2024-08-19T14:50:51.000000Z",
            deleted_at: null,
            name: faker.datatype.string(),
            enabled: true,
            allows_messaging: false,
            workflow_enabled: false,
            access_requests_management: false,
            uses_5_safes: false,
            is_admin: false,
            team_logo: null,
            member_of: faker.datatype.string(),
            contact_point: null,
            application_form_updated_by: "System Generated",
            application_form_updated_on: "0001-01-01 00:00:00",
            mongo_object_id: faker.datatype.uuid(),
            notification_status: false,
            is_question_bank: false,
            is_provider: false,
            url: null,
            introduction: null,
        },
    };
};

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
            shortTitle: faker.datatype.string(3),
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
                title: faker.datatype.string(5),
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
    generatePageDataSetV1,
    datasetsV1,
    datasetsV1p1,
    datasetV1,
    datasetV1p1,
    datasetVersionV1,
    datasetVersionV1p1,
    datasetSearchResultV1,
};
