import { get, isEmpty, pick, some } from "lodash";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { DataStatus } from "@/consts/application";
import { getDataset } from "@/utils/api";
import { getCohortDiscovery } from "@/utils/cms";
import { getLatestVersion } from "@/utils/dataset";
import metaData from "@/utils/metadata";
import ActionBar from "./components/ActionBar";
import DatasetContent from "./components/DatasetContent";
import DatasetMindMap from "./components/DatasetMindMap";
import DatasetStats from "./components/DatasetStats";
import GoogleRecommended from "./components/GoogleRecommended";
import Linkages from "./components/Linkages";
import Publications from "./components/Publications";
import Sources from "./components/Sources";
import { datasetFields } from "./config";

export const metadata = metaData({
    title: "Dataset",
    description: "",
});

const DATASET_STAT_PATHS = [
    "metadata.metadata.summary.populationSize",
    "metadata.metadata.provenance.temporal.startDate",
    "metadata.metadata.provenance.temporal.endDate",
    "metadata.metadata.coverage.materialType",
    "metadata.metadata.coverage.spatial",
    "metadata.metadata.accessibility.access.deliveryLeadTime",
];

const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "3.0.0";

export default async function DatasetItemPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const { datasetId } = params;

    const cookieStore = cookies();
    const data = {
        id: 811,
        mongo_object_id: "62ed2c695f0acfe134edc5ea",
        mongo_id: "3915859342019512",
        mongo_pid: "e73bb8ed-df18-46b1-bfc2-a91e81e5fe91",
        datasetid: "4758a079-8690-41af-a6a9-0acf6cf1ba45",
        pid: "7d452164-3fa8-4a11-b3ef-ed9ab9e732e8",
        source: null,
        discourse_topic_id: 0,
        is_cohort_discovery: false,
        commercial_use: 0,
        state_id: 0,
        uploader_id: 0,
        metadataquality_id: 0,
        user_id: 2,
        team_id: 63,
        views_count: 0,
        views_prev_count: 0,
        has_technical_details: 1,
        created: "2024-10-08 11:32:04",
        updated: "2024-10-08 11:32:04",
        submitted: "2024-10-08 11:32:04",
        published: null,
        created_at: "2024-10-08T11:32:04.000000Z",
        updated_at: "2024-10-08T11:32:04.000000Z",
        deleted_at: null,
        create_origin: "MANUAL",
        status: "ACTIVE",
        tools: [],
        tools_count: 0,
        durs: [],
        durs_count: 0,
        collections: [
            {
                collection_id: 80,
                dataset_version_id: 811,
                user_id: null,
                application_id: null,
                reason: null,
                created_at: null,
                updated_at: null,
                deleted_at: null,
            },
        ],
        collections_count: 1,
        publications: [],
        publications_count: 0,
        spatialCoverage: [
            {
                id: 3,
                created_at: "2024-10-08T11:03:10.000000Z",
                updated_at: "2024-10-08T11:03:10.000000Z",
                region: "Scotland",
                enabled: true,
                pivot: {
                    dataset_version_id: 811,
                    spatial_coverage_id: 3,
                },
            },
        ],
        named_entities: [
            {
                id: 4,
                name: "Data",
                created_at: "2024-10-08T11:28:09.000000Z",
                updated_at: "2024-10-08T11:28:09.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4,
                },
            },
            {
                id: 15,
                name: "Plant Roots",
                created_at: "2024-10-08T11:28:09.000000Z",
                updated_at: "2024-10-08T11:28:09.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 15,
                },
            },
            {
                id: 26,
                name: "C0681784",
                created_at: "2024-10-08T11:28:10.000000Z",
                updated_at: "2024-10-08T11:28:10.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 26,
                },
            },
            {
                id: 96,
                name: "Medical Records",
                created_at: "2024-10-08T11:28:16.000000Z",
                updated_at: "2024-10-08T11:28:16.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 96,
                },
            },
            {
                id: 203,
                name: "scotland",
                created_at: "2024-10-08T11:28:19.000000Z",
                updated_at: "2024-10-08T11:28:19.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 203,
                },
            },
            {
                id: 1630,
                name: "History",
                created_at: "2024-10-08T11:29:39.000000Z",
                updated_at: "2024-10-08T11:29:39.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 1630,
                },
            },
            {
                id: 2139,
                name: "Correlation of Data",
                created_at: "2024-10-08T11:31:05.000000Z",
                updated_at: "2024-10-08T11:31:05.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 2139,
                },
            },
            {
                id: 2377,
                name: "Cause of Death",
                created_at: "2024-10-08T11:32:07.000000Z",
                updated_at: "2024-10-08T11:32:07.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 2377,
                },
            },
            {
                id: 4534,
                name: "152527006",
                created_at: "2025-01-06T18:41:56.000000Z",
                updated_at: "2025-01-06T18:41:56.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4534,
                },
            },
            {
                id: 4535,
                name: "184305005",
                created_at: "2025-01-06T18:42:03.000000Z",
                updated_at: "2025-01-06T18:42:03.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4535,
                },
            },
            {
                id: 4536,
                name: "79378-6",
                created_at: "2025-01-06T18:42:08.000000Z",
                updated_at: "2025-01-06T18:42:08.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4536,
                },
            },
            {
                id: 4537,
                name: "94B..00",
                created_at: "2025-01-06T18:42:16.000000Z",
                updated_at: "2025-01-06T18:42:16.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4537,
                },
            },
            {
                id: 4538,
                name: "Cause of deaths",
                created_at: "2025-01-06T18:42:37.000000Z",
                updated_at: "2025-01-06T18:42:37.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4538,
                },
            },
            {
                id: 4539,
                name: "D002423",
                created_at: "2025-01-06T18:42:48.000000Z",
                updated_at: "2025-01-06T18:42:48.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4539,
                },
            },
            {
                id: 4540,
                name: "LA10595-9",
                created_at: "2025-01-06T18:42:49.000000Z",
                updated_at: "2025-01-06T18:42:49.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4540,
                },
            },
            {
                id: 4541,
                name: "LP269981-9",
                created_at: "2025-01-06T18:42:49.000000Z",
                updated_at: "2025-01-06T18:42:49.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4541,
                },
            },
            {
                id: 4542,
                name: "LP7122-7",
                created_at: "2025-01-06T18:42:49.000000Z",
                updated_at: "2025-01-06T18:42:49.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4542,
                },
            },
            {
                id: 4543,
                name: "LP72230-3",
                created_at: "2025-01-06T18:42:49.000000Z",
                updated_at: "2025-01-06T18:42:49.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4543,
                },
            },
            {
                id: 4544,
                name: "OMOP4976961",
                created_at: "2025-01-06T18:42:49.000000Z",
                updated_at: "2025-01-06T18:42:49.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4544,
                },
            },
            {
                id: 4998,
                name: "85057-8",
                created_at: "2025-01-07T13:00:00.000000Z",
                updated_at: "2025-01-07T13:00:00.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 4998,
                },
            },
            {
                id: 5102,
                name: "PCORnet Common Data Model set - version 3.0 [PCORnet]",
                created_at: "2025-01-07T13:00:06.000000Z",
                updated_at: "2025-01-07T13:00:06.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 5102,
                },
            },
            {
                id: 5125,
                name: "55173-9",
                created_at: "2025-01-07T13:00:10.000000Z",
                updated_at: "2025-01-07T13:00:10.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 5125,
                },
            },
            {
                id: 5128,
                name: "ED disposition and diagnosis data Set DEEDS",
                created_at: "2025-01-07T13:00:11.000000Z",
                updated_at: "2025-01-07T13:00:11.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 5128,
                },
            },
            {
                id: 5181,
                name: "PUBLICHEALTH",
                created_at: "2025-01-07T13:01:07.000000Z",
                updated_at: "2025-01-07T13:01:07.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 5181,
                },
            },
            {
                id: 5182,
                name: "Public Health",
                created_at: "2025-01-07T13:01:19.000000Z",
                updated_at: "2025-01-07T13:01:19.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 5182,
                },
            },
            {
                id: 6303,
                name: "363789004",
                created_at: "2025-01-07T14:18:27.000000Z",
                updated_at: "2025-01-07T14:18:27.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6303,
                },
            },
            {
                id: 6304,
                name: "85735-9",
                created_at: "2025-01-07T14:18:30.000000Z",
                updated_at: "2025-01-07T14:18:30.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6304,
                },
            },
            {
                id: 6305,
                name: "Congenital rubella case report panel",
                created_at: "2025-01-07T14:18:33.000000Z",
                updated_at: "2025-01-07T14:18:33.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6305,
                },
            },
            {
                id: 6306,
                name: "Death diagnosis",
                created_at: "2025-01-07T14:18:36.000000Z",
                updated_at: "2025-01-07T14:18:36.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6306,
                },
            },
            {
                id: 6307,
                name: "General characteristic of patient",
                created_at: "2025-01-07T14:18:36.000000Z",
                updated_at: "2025-01-07T14:18:36.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6307,
                },
            },
            {
                id: 6308,
                name: "H&P.HX",
                created_at: "2025-01-07T14:18:37.000000Z",
                updated_at: "2025-01-07T14:18:37.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6308,
                },
            },
            {
                id: 6309,
                name: "OMOP4976965",
                created_at: "2025-01-07T14:18:42.000000Z",
                updated_at: "2025-01-07T14:18:42.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 6309,
                },
            },
            {
                id: 14824,
                name: "89754-6",
                created_at: "2025-01-07T19:41:48.000000Z",
                updated_at: "2025-01-07T19:41:48.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14824,
                },
            },
            {
                id: 14825,
                name: "91094-3",
                created_at: "2025-01-07T19:41:52.000000Z",
                updated_at: "2025-01-07T19:41:52.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14825,
                },
            },
            {
                id: 14826,
                name: "Cause of death (observable entity)",
                created_at: "2025-01-07T19:41:57.000000Z",
                updated_at: "2025-01-07T19:41:57.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14826,
                },
            },
            {
                id: 14827,
                name: "Cause of deaths Narrative",
                created_at: "2025-01-07T19:42:01.000000Z",
                updated_at: "2025-01-07T19:42:01.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14827,
                },
            },
            {
                id: 14828,
                name: "Cause of deaths | Event | Public health",
                created_at: "2025-01-07T19:42:03.000000Z",
                updated_at: "2025-01-07T19:42:03.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14828,
                },
            },
            {
                id: 14829,
                name: "Causes of Death",
                created_at: "2025-01-07T19:42:04.000000Z",
                updated_at: "2025-01-07T19:42:04.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14829,
                },
            },
            {
                id: 14830,
                name: "Condition fatal-cause of death",
                created_at: "2025-01-07T19:42:06.000000Z",
                updated_at: "2025-01-07T19:42:06.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14830,
                },
            },
            {
                id: 14833,
                name: "Death Cause",
                created_at: "2025-01-07T19:42:13.000000Z",
                updated_at: "2025-01-07T19:42:13.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14833,
                },
            },
            {
                id: 14834,
                name: "Death Causes",
                created_at: "2025-01-07T19:42:16.000000Z",
                updated_at: "2025-01-07T19:42:16.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14834,
                },
            },
            {
                id: 14835,
                name: "Event status [CDC Emergency Operations Centers]",
                created_at: "2025-01-07T19:42:21.000000Z",
                updated_at: "2025-01-07T19:42:21.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14835,
                },
            },
            {
                id: 14838,
                name: "Fatalities; Finding; Findings; Narrative; Point in time; Public Health; PUBLICHEALTH; Random; Report",
                created_at: "2025-01-07T19:42:22.000000Z",
                updated_at: "2025-01-07T19:42:22.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14838,
                },
            },
            {
                id: 14840,
                name: "Finding; Findings; H+P; H+P.HX; Nominal; P prime; Point in time; Random",
                created_at: "2025-01-07T19:42:24.000000Z",
                updated_at: "2025-01-07T19:42:24.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14840,
                },
            },
            {
                id: 14843,
                name: "LP421557-2",
                created_at: "2025-01-07T19:42:31.000000Z",
                updated_at: "2025-01-07T19:42:31.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14843,
                },
            },
            {
                id: 14846,
                name: "死亡原因:发现:时间点:^事件:叙述型",
                created_at: "2025-01-07T19:42:39.000000Z",
                updated_at: "2025-01-07T19:42:39.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14846,
                },
            },
            {
                id: 14847,
                name: "死亡原因:发现:时间点:^患者:名义型",
                created_at: "2025-01-07T19:42:43.000000Z",
                updated_at: "2025-01-07T19:42:43.000000Z",
                deleted_at: null,
                pivot: {
                    dataset_version_id: 811,
                    named_entities_id: 14847,
                },
            },
        ],
        versions: [
            {
                id: 811,
                created_at: "2024-10-08T11:32:04.000000Z",
                updated_at: "2025-02-21T14:47:58.000000Z",
                deleted_at: null,
                active_date: null,
                dataset_id: 811,
                metadata: {
                    metadata: {
                        identifier: "7d452164-3fa8-4a11-b3ef-ed9ab9e732e8",
                        issued: "2024-10-08T11:32:04.305711Z",
                        modified: "2024-10-08T11:32:04.305720Z",
                        revisions: [
                            {
                                url: "https://web.prod.hdruk.cloud//dataset/811?version=1.0.0",
                                version: "1.0.0",
                            },
                        ],
                        version: "1.0.0",
                        summary: {
                            abstract:
                                "Nationally curated data for Scotland showing the date and cause(s) of death.",
                            contactPoint: "dataloch@ed.ac.uk",
                            keywords: [
                                "DataLoch",
                                "NRS",
                                "SIMD",
                                "Cause of Death",
                            ],
                            doiName: null,
                            title: "Deaths - National Records of Scotland",
                            dataCustodian: {
                                name: "DataLoch",
                                identifier:
                                    "6853e904-ed51-448b-b78d-55dee6d1a40f",
                                contactPoint: "dataloch@ed.ac.uk",
                                logo: null,
                                description: null,
                                memberOf: null,
                            },
                            populationSize: -1,
                            alternateIdentifiers: null,
                        },
                        documentation: {
                            description:
                                "Cause of death data from National Records Scotland (NRS, formerly General Registrar Office (GRO) including ICD-9/ICD-10 codes.  Cause of death records are subject to change potentially long after the date of death.",
                            associatedMedia:
                                "https://dataloch.org/insights/projects-delivered;,;https://dataloch.org/insights/projects-delivered",
                            inPipeline: "Not available",
                        },
                        coverage: {
                            pathway: null,
                            spatial: "United Kingdom,Scotland",
                            followUp: "Other",
                            datasetCompleteness: null,
                            typicalAgeRangeMin: 0,
                            typicalAgeRangeMax: 150,
                            materialType: ["None/not available"],
                        },
                        provenance: {
                            origin: {
                                purpose: ["Administrative"],
                                source: ["Other"],
                                collectionSource: ["Other"],
                                datasetType: ["Health and disease"],
                                datasetSubType: ["Not applicable"],
                                imageContrast: "Not stated",
                            },
                            temporal: {
                                endDate: null,
                                startDate: "1979-01-01",
                                timeLag: "1-2 months",
                                publishingFrequency: "Monthly",
                                distributionReleaseDate: null,
                            },
                        },
                        accessibility: {
                            usage: {
                                resourceCreator: "National Records of Scotland",
                                dataUseLimitation: [
                                    "Project-specific restrictions",
                                ],
                                dataUseRequirements: null,
                            },
                            access: {
                                accessRights:
                                    "https://dataloch.org/data/how-to-apply",
                                jurisdiction: ["GB-SCT"],
                                accessService:
                                    "https://dataloch.org/data/how-to-apply",
                                dataProcessor: "University of Edinburgh",
                                dataController:
                                    "National Records of Scotland, NHS Lothian",
                                deliveryLeadTime: "Variable",
                                accessRequestCost:
                                    "https://dataloch.org/data/how-to-apply",
                                accessServiceCategory: null,
                            },
                            formatAndStandards: {
                                conformsTo: [],
                                vocabularyEncodingScheme: ["ICD10"],
                                language: ["en"],
                                format: ["text/csv"],
                            },
                        },
                        enrichmentAndLinkage: {
                            tools: [],
                            investigations: [],
                            publicationAboutDataset: null,
                            publicationUsingDataset: null,
                            derivedFrom: null,
                            isPartOf: null,
                            linkableDatasets: null,
                            similarToDatasets: null,
                        },
                        observations: [],
                        structuralMetadata: {
                            tables: [],
                            syntheticDataWebLink: [],
                        },
                        demographicFrequency: null,
                        omics: null,
                    },
                },
                version: 1,
                provider_team_id: null,
                application_type: null,
                short_title: "Deaths - National Records of Scotland",
                reduced_linked_dataset_versions: [
                    {
                        id: 808,
                        dataset_id: 808,
                        title: "Lothian Primary and Secondary Care with Phenotypes",
                        shortTitle:
                            "Lothian Primary and Secondary Care with Phenotypes",
                        pivot: {
                            dataset_version_source_id: 811,
                            dataset_version_target_id: 808,
                            linkage_type: "isDerivedFrom",
                        },
                    },
                ],
            },
        ],
        linkages: [
            {
                title: "Lothian Primary and Secondary Care with Phenotypes",
                url: "https://web.dev.hdruk.cloud/en/dataset/808",
            },
        ],
        team: {
            id: 63,
            pid: "6853e904-ed51-448b-b78d-55dee6d1a40f",
            created_at: "2024-10-08T11:18:37.000000Z",
            updated_at: "2024-10-09T13:13:38.000000Z",
            deleted_at: null,
            name: "DataLoch",
            enabled: true,
            allows_messaging: true,
            workflow_enabled: true,
            access_requests_management: true,
            uses_5_safes: false,
            is_admin: false,
            team_logo: "/teams/dataloch.png",
            member_of: "ALLIANCE",
            contact_point: null,
            application_form_updated_by: "Qresearch webapp",
            application_form_updated_on: "0001-01-01 00:00:00",
            mongo_object_id: "61603974c8c15ee90b768546",
            notification_status: false,
            is_question_bank: false,
            is_provider: false,
            url: null,
            introduction: null,
            dar_modal_header: null,
            dar_modal_content:
                "# How to request access\nOrganisations and individuals wanting to use certain kinds of data need to show they meet strict data security and information governance standards by completing our application process.\n\nWe need to make sure we only provide access to sensitive patient level data to organisations that meet Information Governance (IG) requirements, and use it to improve health and care services and generate public benefit.\n\nBefore you begin completing the application form, please contact us to discuss your requirements using the ‘Make an enquiry’ messaging function. Not all enquiries progress to the application stage, for example it may be that your requirement can be satisfied through existing published data.\n\nWhen you're ready to proceed with an application click the button ‘Request Access’.\n\nOnce your data access request application has been approved, de-identified data will be made available in one of the appropriate Trusted Research Environments.\n\nPlease note: if you are requesting data as part of a National Core Study, please contact the data custodian before submitting an application.\n\n\n# Submitting an application\nOnce you’re ready to make a formal application, complete the data access request form by clicking the ‘Request Access’ button.\n\nPlease read through the pre-application checklist in the ‘About this application’ page and confirm that you have read the guidance from the data custodian. \n\nThe application form is structured following the Five Safe model (https://blog.ons.gov.uk/2017/01/27/the-five-safes-data-privacy-at-ons/). Once you start your application you will be presented with five pages (Safe people, Safe projects, Safe data, Safe settings, Safe outputs) and you will be able to scroll through the pages to view the entire form.  You will find application guidance embedded in the form.\n\nWe require you to complete all relevant sections and to upload supporting information and signatures where applicable. \nImportant elements of an application that often require further discussion include:\n* the legal basis under which you access the data\n* technical feasibility - whether we can provide what is being requested\n* the purpose for wanting the data, including what public benefit will be yielded (e.g., for health and social care in the UK)\n\nWe recommend you work closely with our teams to capture the necessary detail in your application.  The application will be referred back to you if more information is required.\n\nPlease note that once an application is submitted, the data custodian might still ask for additional information. For instance, to access data from Public Health Scotland you will need to work with the relevant team to transfer the information over to the Public Benefit and Privacy Panel for review.\n\n# Information Governance\nIf you are requesting access to data through the Office for National Statistics Secure Research Service or access to administrative data within the scope of the Digital Economy Act (DEA) through other DEA accredited processors, you need to be a DEA accredited researcher. For more information visit https://www.ons.gov.uk/aboutus/whatwedo/statistics/requestingstatistics/approvedresearcherscheme.\n\nAccreditation requires successful completion of the following course (or course of equivalent status).  \n\n* Safe Researcher Training course and online assessment – run by ONS, the UK Data Service or the Administrative Data Research UK partners.\nIf the researcher has previously undertaken and passed the Safe User of Research data Environments (SURE) training course, then this would also qualify.  \nThe following training courses are also widely accepted as evidence of appropriate Information Governance training where this is required before access to data is granted.\n* MRC’s Research, GDPR and confidentiality – what you really need to know\nWe will accept a certificate of completion for the accompanying quiz accessible here\n* MRC Regulatory Support Centre: Research Data and Confidentiality e-learning (https://byglearning.com/mrcrsc-lms/course/index.php?categoryid=1)\n\nIf you have undertaken other Information Governance training that covers similar topics to the listed courses and wish this to be accepted as evidence, you will be asked to provide the course content with your application.\n\nInformation governance training must be current. Training must be updated every 3 years (5 years for DEA accreditation) and if expiry of your training certificate occurs within the time period of your study, you will be required to renew your training.\n \n# Access\nThe Data Sharing Agreement is electronically signed by the data custodian.\n\nThe data, with patient objections upheld as appropriate, is produced, reviewed and signed-off by the data custodian, or the data service access is granted.\n\nThe data are made available through the appropriate Trusted Research Environment.\n\nThe Honest Broker Service (HBS) is the Trusted Research Environment for Northern Ireland. Following investment from HDR UK the Honest Broker Service have launched a collaboration with Swansea University who host the SAIL Databank and can now offer remote access to anonymised data for approved projects via a Health and Social Care Northern Ireland tenancy of the UK Secure e-Research Platform (UK SeRP). \n\n# Costs of data access\nWe operate on a Cost recovery model. We will request payment from you to cover the cost of administering and processing your request. Costs will be discussed during the pre-submission enquiry phase.  The costs for National Core Studies projects will be covered separately. \n\n# Useful resources\nFurther information about the pre-submission process and information governance review for each data custodian can be found below:\nOffice for National Statistics https://www.ons.gov.uk/aboutus/whatwedo/statistics/requestingstatistics/approvedresearcherscheme \nSAIL Databank: https://saildatabank.com/application-process/two-stage-process/ \nPublic Health Scotland: https://www.isdscotland.org/products-and-services/edris/use-of-the-national-safe-haven/\nNHS Digital https://digital.nhs.uk/services/data-access-request-service-dars \nHealth and Social Care Northern Ireland http://www.hscbusiness.hscni.net/services/2454.htm",
            dar_modal_footer: null,
            is_dar: false,
            service: null,
        },
    };

    // Note that the status check is only required under v1 - under v2, we can use
    // an endpoint that will not show the data if not active
    if (!data || data?.status !== DataStatus.ACTIVE) notFound();

    let googleRecommendedDataset: Dataset | undefined;

    try {
        googleRecommendedDataset = await getDataset(
            cookieStore,
            datasetId,
            "SchemaOrg",
            "GoogleRecommended"
        );
    } catch (_e) {
        // Intentionally left empty
    }

    const cohortDiscovery = data?.is_cohort_discovery
        ? await getCohortDiscovery()
        : null;

    const datasetVersion = data?.versions?.[0];

    const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);

    const populatedSections = datasetFields.filter(section =>
        section.fields.some(field => !isEmpty(get(datasetVersion, field.path)))
    );

    const linkageCounts = {
        tools: data?.tools_count,
        publications: data?.publications_count,
        publications_about: data?.publications.filter(
            pub => pub.dataset_versions?.[0].link_type === "ABOUT"
        ).length,
        publications_using: data?.publications.filter(
            pub => pub.dataset_versions?.[0].link_type === "USING"
        ).length,
        durs: data?.durs_count,
        collections: data?.collections_count,
    };

    const activeLinkList = populatedSections.map(section => {
        return { label: section.sectionName };
    });

    const datasetWithName = {
        ...data,
        name: datasetVersion.metadata?.metadata?.summary?.title,
    };

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <ActionBar dataset={datasetWithName} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        {datasetStats && (
                            <Box sx={{ p: 0, gap: 2 }}>
                                <Typography
                                    variant="h2"
                                    sx={{ pt: 0.5, pb: 0.5 }}>
                                    {
                                        datasetVersion.metadata?.metadata
                                            ?.summary?.title
                                    }
                                </Typography>
                                <div>
                                    <DatasetStats data={datasetStats} />
                                </div>
                            </Box>
                        )}
                        <BoxContainer
                            sx={{
                                gridTemplateColumns: {
                                    tablet: "2fr 1fr",
                                },
                                gap: {
                                    mobile: 1,
                                    tablet: 2,
                                },
                                p: 0,
                            }}>
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}>
                                <DatasetMindMap
                                    data={datasetVersion}
                                    teamId={data?.team_id}
                                    isCohortDiscovery={
                                        data?.is_cohort_discovery
                                    }
                                    ctaLink={
                                        cohortDiscovery?.template?.promofields
                                            ?.ctaLink || null
                                    }
                                    populatedSections={populatedSections}
                                    linkageCounts={linkageCounts}
                                    hasStructuralMetadata={
                                        !!datasetVersion.metadata?.metadata
                                            ?.structuralMetadata?.tables?.length
                                    }
                                    hasDemographics={
                                        !!some(
                                            datasetVersion.metadata?.metadata
                                                ?.demographicFrequency,
                                            value => value !== null
                                        )
                                    }
                                />

                                <DatasetContent
                                    data={datasetVersion}
                                    populatedSections={populatedSections}
                                />
                            </Box>
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}>
                                <Sources
                                    data={datasetVersion.metadata.metadata}
                                />
                                {datasetVersion?.reduced_linked_dataset_versions && (
                                    <Linkages data={data} />
                                )}

                                <Publications data={data} />
                            </Box>
                            <Box />
                        </BoxContainer>

                        {googleRecommendedDataset && (
                            <GoogleRecommended
                                metadata={getLatestVersion(
                                    googleRecommendedDataset
                                )}
                            />
                        )}
                    </Box>
                </>
            }
        />
    );
}
