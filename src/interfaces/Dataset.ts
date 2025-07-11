import type { Publication, PublicationHasDatasetVersion } from "./Publication";
import type { Team } from "./Team";

type DatasetStatus = "ARCHIVED" | "ACTIVE" | "DRAFT";
type CreateOrigin = "GMI" | "MANUAL" | "API";

interface StructuralMetadataValue {
    name: string;
    frequency: number;
    description: string | null;
}

interface StructuralMetadataColumn {
    name: string;
    description: string;
    dataType: string;
    sensitive: boolean;
    values: StructuralMetadataValue[];
}

interface StructuralMetadata {
    name: string;
    description: string;
    columns: StructuralMetadataColumn[];
}

interface StructuralMetadataPublicSchema {
    tables: StructuralMetadata[];
    syntheticDataWebLink: string[];
}

interface DemographicGeneric {
    bin: string;
    count: number;
}

interface DemographicDisease {
    diseaseCode: string;
    diseaseCodeVocabulary?: string;
    count: number;
}

interface Demographics {
    age: DemographicGeneric[] | null;
    ethnicity: DemographicGeneric[] | null;
    disease: DemographicDisease[] | null;
}

interface Revision {
    version: string;
    url: string;
}

interface Metadata {
    summary: {
        abstract: string;
        contactPoint: string;
        controlledKeywords: string;
        description: string;
        doiName: string;
        keywords: string[];
        shortTitle: string;
        title: string;
        populationSize: number | null;
        publisher: {
            gatewayId: string | number;
            publisherName: string;
            name?: string;
        };
    };
    required: {
        version: string;
    };
    accessibility: {
        access: {
            deliveryLeadTime: string;
            jurisdiction: string;
            dataController: string;
            dataProcessor: string;
            accessRights: string;
            accessService: string;
            accessRequestCost: string;
        };
        usage: {
            dataUseLimitation: string;
            dataUseRequirement: string;
            resourceCreator: string;
        };
        formatAndStandards: {
            vocabularyEncodingSchemes: string;
            conformsTo: string;
            languages: string;
            formats: string;
        };
    };
    provenance: {
        origin: {
            collectionSituation: string | undefined;
            datasetType: string[];
            datasetSubType: string[];
        };
        temporal: {
            startDate: string | undefined;
            endDate: string | undefined;
        };
    };
    enrichmentAndLinkage: {
        associatedMedia: string;
        isReferenceIn: string;
        tools: string[];
        datasetLinkage: {
            isDerivedFrom: string;
            isPartOf: string;
            linkedDatasets: string[];
            isMemberOf: string;
        };
        investigations: string[];
        isGeneratedUsing: string;
        dataUses: string[];
    };
    observations?: [
        {
            disambiguatingDescription: string;
            measuredProperty: string;
            measuredValue: number;
            observationDate: string;
            observedNode: string;
        }
    ];
    structuralMetadata?: StructuralMetadataPublicSchema;
    revisions: Revision[];
    demographicFrequency: Demographics;
    coverage: {
        datasetCompleteness: string;
    };
}

export interface ReducedLinkedDatasetVersions {
    id: number;
    dataset_id: number;
    title: string;
    shortTitle: string;
    pivot: {
        dataset_version_source_id: number;
        dataset_version_target_id: number;
        linkage_type: string;
    };
}

interface LinkedDatasetVersions {
    id: string;
    pivot: {
        linkage_type: string;
    };
    metadata: Metadata;
}

interface MetadataMax {
    metadata: Metadata;
    gwdmVersion: string;
}
interface VersionItem {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    dataset_id: number;
    metadata: MetadataMax;
    version: number;
    publications: Publication[];
    linked_dataset_versions: LinkedDatasetVersions[];
    reduced_linked_dataset_versions: ReducedLinkedDatasetVersions[];
    shortTitle?: string;
    dataCustodian?: string;
}

export interface ReducedDataset {
    id: number;
    dataset_id: number; // always show this
    shortTitle: string;
    populationSize: number;
    datasetType: string;
    dataCustodian: string;
}

interface Linkage {
    title: string;
    url?: string;
    dataset_id?: number;
    linkage_type: string;
}

interface Dataset {
    id: number;
    team_id: number;
    user_id: number;
    status: DatasetStatus;
    pid: string | null;
    versions: VersionItem[];
    updated: string;
    updated_at: string;
    create_origin: CreateOrigin;
    latest_metadata?: VersionItem;
    durs_count: number;
    publications_count: number;
    tools_count: number;
    collections_count: number;
    publications: PublicationHasDatasetVersion[];
    team: Team;
    name?: string;
    is_cohort_discovery: boolean;
    linkages?: Linkage[];
}

interface DataCustodianDataset {
    id: number;
    populationSize: number;
    title: string;
    datasetType: string;
}

interface NewDataset extends Omit<Dataset, "versions" | "id"> {
    metadata: { metadata: Metadata };
}

export type {
    DataCustodianDataset,
    Dataset,
    DatasetStatus,
    Metadata,
    MetadataMax,
    NewDataset,
    VersionItem,
    StructuralMetadata,
    StructuralMetadataColumn,
    StructuralMetadataPublicSchema,
    CreateOrigin,
    Revision,
    Demographics,
    DemographicDisease,
    DemographicGeneric,
    Linkage,
};
