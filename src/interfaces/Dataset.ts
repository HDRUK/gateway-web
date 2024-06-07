import { Publication } from "./Publication";

type DatasetStatus = "ARCHIVED" | "ACTIVE" | "DRAFT";
type CreateOrigin = "FMA" | "MANUAL" | "API";

interface Metadata {
    summary: {
        abstract: string;
        contactPoint: string;
        controlledKeywords: string;
        datasetType: string;
        description: string;
        doiName: string;
        keywords: string;
        shortTitle: string;
        title: string;
        populationSize: number | null;
        publisher: {
            publisherName: string;
            name?: string;
        };
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
        temporal: {
            startDate: string | undefined;
            endDate: string | undefined;
        };
    };
    linkage: {
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
        syntheticDataWebLink: string;
    };
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
}

interface Dataset {
    id: number;
    team_id: number;
    user_id: number;
    status: DatasetStatus;
    pid: string | null;
    versions: VersionItem[];
    updated: string;
    create_origin: CreateOrigin;
    latest_metadata?: VersionItem;
}

interface NewDataset extends Omit<Dataset, "versions" | "id"> {
    metadata: { metadata: Metadata };
}

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

export type {
    Dataset,
    DatasetStatus,
    Metadata,
    MetadataMax,
    NewDataset,
    VersionItem,
    StructuralMetadata,
    StructuralMetadataColumn,
    CreateOrigin,
};
