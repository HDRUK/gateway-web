type DatasetStatus = "ARCHIVED" | "ACTIVE" | "DRAFT";

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
        publisher: {
            publisherName: string;
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
    observations: [
        {
            observedNode: string;
            measuredValue: number;
            observationDate: string;
            measuredProperty: string;
            disambiguatingDescription: string;
        }
    ];
    provenance: {
        temporal: {
            startDate: string | undefined;
            endDate: string | undefined;
        };
    };
}
interface VersionItem {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    dataset_id: number;
    metadata: { metadata: Metadata; gwdmVersion: string };
    version: number;
}

interface Dataset {
    id: number;
    team_id: number;
    user_id: number;
    status: DatasetStatus;
    pid: string | null;
    versions: VersionItem[];
    updated: string;
    create_origin: "FMA" | "MANUAL" | "API";
}

interface NewDataset extends Omit<Dataset, "versions" | "id"> {
    metadata: { metadata: Metadata };
}

export type { NewDataset, Dataset, DatasetStatus, VersionItem, Metadata };
