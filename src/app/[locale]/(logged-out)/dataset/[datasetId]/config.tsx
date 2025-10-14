export enum FieldType {
    TEXT = "text",
    LIST = "list",
    DATE = "date",
    TAG_LIST = "tag-list",
    LINK_LIST = "link-list",
    DATASETTYPE_LIST = "dataset-type-list",
}

export interface DatasetType {
    name: string;
    subTypes: string[];
}
interface DatasetField {
    path: string;
    type: FieldType;
    label?: string;
    tooltip?: string;
}

export interface DatasetSection {
    sectionName: string;
    fields: DatasetField[];
}

const datasetFields: DatasetSection[] = [
    {
        sectionName: "Keywords",
        fields: [
            {
                path: "metadata.metadata.summary.keywords",
                type: FieldType.TAG_LIST,
            },
        ],
    },
    {
        sectionName: "Summary",
        fields: [
            {
                path: "metadata.metadata.summary.abstract",
                type: FieldType.TEXT,
            },
            {
                path: "metadata.metadata.summary.doiName",
                type: FieldType.TEXT,
                label: "DOI for dataset",
                tooltip:
                    "DOI for the specific dataset or dataset version. NOTE: This is not the DOI of the row level data within a dataset or the publication(s) associated with the dataset, but rather the DOI of the metadata describing the dataset as captured in the Gateway.",
            },
        ],
    },
    {
        sectionName: "Documentation",
        fields: [
            {
                path: "metadata.metadata.documentation.description",
                type: FieldType.TEXT,
            },
            {
                path: "metadata.metadata.provenance.origin.datasetType",
                type: FieldType.DATASETTYPE_LIST,
                label: "Dataset type",
                tooltip:
                    "The topic areas to which the dataset content relates.",
            },
            {
                path: "metadata.metadata.provenance.origin.datasetSubType",
                type: FieldType.LIST,
                label: "Dataset sub-type",
                tooltip:
                    "The sub-types of topic areas to which the dataset content relates.",
            },
            {
                path: "metadata.metadata.summary.populationSize",
                type: FieldType.TEXT,
                label: "Dataset population size",
                tooltip:
                    "The number of unique people in the dataset. NOTE: See the Observations section for further measures of the dataset size.",
            },
            {
                path: "metadata.metadata.documentation.associatedMedia",
                type: FieldType.LINK_LIST,
                label: "Associated media",
                tooltip:
                    "Media that might provide additional context for researchers wanting to understand more about the dataset and its relevance to their research question.",
            },
            {
                path: "metadata.metadata.structuralMetadata.syntheticDataWebLink",
                type: FieldType.LINK_LIST,
                label: "Synthetic data web link",
                tooltip:
                    "Website with information on your synthetic dataset creation, or the location where a synthetic version of the dataset can be accessed.",
            },
        ],
    },
    {
        sectionName: "Structural Metadata",
        fields: [
            {
                path: "metadata.metadata.structuralMetadata.tables",
                type: FieldType.TAG_LIST,
            },
        ],
    },
    {
        sectionName: "Data Access Request",
        fields: [
            {
                path: "metadata.metadata.documentation.inPipeline",
                type: FieldType.TEXT,
                label: "Dataset pipeline status",
                tooltip:
                    "Indication of whether the dataset is available for access requests, or if the Data Custodian is preparing this dataset for research use in the future.",
            },
            {
                path: "metadata.metadata.accessibility.access.accessRights",
                type: FieldType.LIST,
                label: "Access rights",
                tooltip:
                    "The webpage where the data access request process and/or guidance is provided.",
            },
            {
                path: "metadata.metadata.accessibility.access.deliveryLeadTime",
                type: FieldType.TEXT,
                label: "Time to dataset access",
                tooltip:
                    "Indication of the typical processing times based on the types of requests typically received.",
            },
            {
                path: "metadata.metadata.accessibility.access.accessRequestCost",
                type: FieldType.LIST,
                label: "Access request cost",
                tooltip:
                    "Webpage or description detailing the service or cost model for processing data access requests.",
            },
            {
                path: "metadata.metadata.accessibility.access.accessServiceCategory",
                type: FieldType.TEXT,
                label: "Access method category",
                tooltip:
                    "The method a Researcher will use to access the dataset, if approved.",
            },
            {
                path: "metadata.metadata.accessibility.access.accessMode",
                type: FieldType.TEXT,
                label: "Access mode",
                tooltip:
                    "Indication of the application type to enable research access.",
            },

            {
                path: "metadata.metadata.accessibility.access.accessService",
                type: FieldType.TEXT,
                label: "Access service description",
                tooltip:
                    "A brief description of the data access services that are available from the Data Custodian.",
            },
            {
                path: "metadata.metadata.accessibility.access.jurisdiction",
                type: FieldType.LIST,
                label: "Jurisdiction",
                tooltip:
                    "ISO 3166-1 country codes and the associated SO 3166-2 for regions, cities, states, etc. for the country/state under whose laws the data subject's data is collected, processed and stored. Multiple jurisdictions might be provided.",
            },
            {
                path: "metadata.metadata.accessibility.usage.dataUseLimitation",
                type: FieldType.TEXT,
                label: "Data use limitation",
                tooltip:
                    "Indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used.",
            },
            {
                path: "metadata.metadata.accessibility.usage.dataUseRequirements",
                type: FieldType.TEXT,
                label: "Data use requirements",
                tooltip:
                    "Indication of whether there are any additional conditions set for use if any, multiple requirements may be provided.",
            },
            {
                path: "metadata.metadata.accessibility.access.dataController",
                type: FieldType.LIST,
                label: "Data Controller",
                tooltip:
                    "The person/entity who (either alone or jointly or in common with other persons/entities) determines the purposes for which and the way any Data Subject data, specifically personal data or are to be processed.",
            },
            {
                path: "metadata.metadata.accessibility.access.dataProcessor",
                type: FieldType.LIST,
                label: "Data Processor",
                tooltip:
                    "The person(s)/entity (other than an employee of the Data Controller) who process the data on behalf of the Data Controller.",
            },
            {
                path: "metadata.metadata.enrichmentAndLinkage.investigations",
                type: FieldType.LIST,
                label: "Investigations",
                tooltip: "Weblink to any active projects using the dataset.",
            },
        ],
    },
    {
        sectionName: "Provenance",
        fields: [
            {
                path: "metadata.metadata.provenance.origin.purpose",
                type: FieldType.LIST,
                label: "Purpose of dataset collection",
                tooltip: "The purpose for which the dataset was collected.",
            },
            {
                path: "metadata.metadata.provenance.origin.source",
                type: FieldType.LIST,
                label: "Source of data extraction",
                tooltip: "The source from which the data was extracted.",
            },
            {
                path: "metadata.metadata.provenance.origin.collectionSource",
                type: FieldType.LIST,
                label: "Collection source setting",
                tooltip:
                    "The setting(s) where data was collected. Multiple settings may be provided.",
            },
            {
                path: "metadata.metadata.coverage.pathway",
                type: FieldType.LIST,
                label: "Patient pathway description",
                tooltip:
                    "Description of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.",
            },
            {
                path: "metadata.metadata.provenance.origin.imageContrast",
                type: FieldType.TEXT,
                label: "Image contrast",
                tooltip:
                    "Indication of whether usage of imaging contrast is captured within the dataset.",
            },
            {
                path: "metadata.metadata.coverage.materialType",
                type: FieldType.TEXT,
                label: "Biological sample availability",
                tooltip:
                    "Type of specimen saved from a biological entity, and indication of the specimen availability.",
            },
        ],
    },
    {
        sectionName: "Observations",
        fields: [
            {
                path: "metadata.metadata.observations",
                type: FieldType.TEXT,
            },
        ],
    },
    {
        sectionName: "Demographics",
        fields: [
            {
                path: "metadata.metadata.demographicFrequency",
                type: FieldType.TAG,
            },
        ],
    },
    {
        sectionName: "Enrichment and Linkage",
        fields: [
            {
                label: "Investigations",
                path: "metadata.metadata.enrichmentAndLinkage.investigations",
                type: FieldType.LIST,
                tooltip:
                    "Website address(es) which document information related to active projects utilising the Dataset and or BioSample(s).",
            },
            {
                label: "Tools",
                path: "metadata.metadata.enrichmentAndLinkage.tools",
                type: FieldType.LIST,
                tooltip:
                    "URL(s) of any analysis tool(s) or models that have been created for this Dataset & BioSample and are available for further use.",
            },
        ],
    },
];

export interface Observation {
    disambiguatingDescription: number;
    measuredProperty: string;
    measuredValue: number;
    observationDate: string;
    observedNode: string;
}

interface ObservationTableColumn {
    header: string;
    path: string;
    tooltip: string;
}

const observationTableColumns: ObservationTableColumn[] = [
    {
        header: "Observed Node",
        path: "observedNode",
        tooltip: "Measure by which dataset volume can be expressed.",
    },
    {
        header: "Disambiguating Description",
        path: "disambiguatingDescription",
        tooltip:
            "Description of the dataset measure and volume. This provides additional context to understand the dataset size.",
    },
    {
        header: "Measured Value",
        path: "measuredValue",
        tooltip: "Volume of dataset measure, indicating size of dataset.",
    },
    {
        header: "Measured Property",
        path: "measuredProperty",
        tooltip: "Measure by which dataset volume can be expressed.",
    },
    {
        header: "Observation Date",
        path: "observationDate",
        tooltip: "Date the measure of dataset volume was made.",
    },
];

export { datasetFields, observationTableColumns };
