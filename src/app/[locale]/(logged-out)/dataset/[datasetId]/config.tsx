export enum FieldType {
    TEXT = "text",
    LIST = "list",
    DATE = "date",
    LINK = "link",
    TAG = "tag",
    LINK_LIST = "link-list",
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
                    "DOI for the specific dataset or dataset version. NOTE: This is not the DOI of the publication(s) associated with the dataset, but rather the DOI of the metadata describing the dataset.",
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
                type: FieldType.LIST,
                label: "Dataset type",
                tooltip:
                    "The topic areas to which the dataset content relates.",
            },
            {
                path: "metadata.metadata.provenance.origin.datasetSubType",
                type: FieldType.LIST,
                label: "Dataset sub-type",
                tooltip: "The sub-type of the dataset content.",
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
                type: FieldType.TEXT,
                label: "Associated media",
                tooltip:
                    "Media that might provide additional context for researchers wanting to understand more about the dataset and its relevance to their research question.",
            },
            {
                path: "metadata.metadata.structuralMetadata.syntheticDataWebLink",
                type: FieldType.LINK,
                label: "Synthetic data web link",
                tooltip:
                    "Website with information on your synthetic dataset creation, or the location where a synthetic version of the dataset can be accessed.",
            },
        ],
    },
    {
        sectionName: "Keywords",
        fields: [
            {
                path: "metadata.metadata.summary.keywords",
                type: FieldType.LIST,
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
                path: "metadata.metadata.provenance.coverage.pathway",
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
                path: "metadata.metadata.provenance.coverage.materialType",
                type: FieldType.TEXT,
                label: "Biological sample availability",
                tooltip:
                    "Type of biospeciment saved from a biological entity, and indication of the specimen availability.",
            },
        ],
    },
    {
        sectionName: "Structural Metadata",
        fields: [
            {
                path: "metadata.metadata.structuralMetadata",
                type: FieldType.TAG,
            },
        ],
    },
    {
        sectionName: "Details",
        fields: [
            {
                path: "metadata.metadata.provenance.temporal.publishingFrequency",
                type: FieldType.TEXT,
                label: "Publishing frequency",
                tooltip:
                    "The frequency of publishing new data for this dataset.",
            },
            {
                path: "metadata.metadata.version",
                type: FieldType.TEXT,
                label: "version",
                tooltip: "Dataset metadata version",
            },
            {
                path: "metadata.metadata.modified",
                type: FieldType.DATE,
                label: "modified",
                tooltip:
                    "The most recent date when the information about this dataset was updated.",
            },
            {
                path: "metadata.metadata.provenance.temporal.distributionReleaseDate",
                type: FieldType.DATE,
                label: "Distribution release date",
                tooltip:
                    "Date this version of the dataset was released for research purposes.",
            },
            {
                path: "metadata.metadata.accessibility.usage.resourceCreator",
                type: FieldType.TEXT,
                label: "Citation Requirements",
                tooltip:
                    "The text that you would like included as part of any citation that credits this dataset.",
            },
        ],
    },
    {
        sectionName: "Coverage",
        fields: [
            {
                path: "metadata.metadata.provenance.temporal.startDate",
                type: FieldType.DATE,
                label: "Start date",
                tooltip:
                    "The start of the time period for which the dataset provides coverage.",
            },
            {
                path: "metadata.metadata.provenance.temporal.endDate",
                type: FieldType.DATE,
                label: "End date",
                tooltip:
                    "The last date of the time period for which the dataset provides coverage.",
            },
            {
                path: "metadata.metadata.provenance.temporal.timeLag",
                type: FieldType.TEXT,
                label: "Time lag",
                tooltip:
                    "The typical time-lag between an event and the data for that event appearing in the dataset.",
            },
            {
                path: "metadata.metadata.coverage.spatial",
                type: FieldType.LIST,
                label: "Geographic coverage",
                tooltip:
                    "The geographical area covered by the dataset population or data.",
            },
            {
                path: "metadata.metadata.coverage.typicalAgeRangeMin",
                type: FieldType.TEXT,
                label: "Typical age range min",
                tooltip: "The minimum age of dataset participants.",
            },
            {
                path: "metadata.metadata.coverage.typicalAgeRangeMax",
                type: FieldType.TEXT,
                label: "Typical age range max",
                tooltip:
                    "The maximum age of dataset participants. NOTE: a value of 150 indicates the dataset contains all ages",
            },
            {
                path: "metadata.metadata.coverage.followup",
                type: FieldType.TEXT,
                label: "Follow-up",
                tooltip:
                    "The typical time span that a patient appears in the dataset (follow up period).",
            },
        ],
    },
    {
        sectionName: "Omics",
        fields: [
            {
                path: "metadata.metadata.omics.assay",
                type: FieldType.TEXT,
                label: "Assay",
            },
            {
                path: "metadata.metadata.omics.platform",
                type: FieldType.TEXT,
                label: "Platform",
            },
        ],
    },
    {
        sectionName: "Accessibility",
        fields: [
            {
                path: "metadata.metadata.accessibility.formatandstandards.language",
                type: FieldType.TEXT,
                label: "Language",
                tooltip:
                    "All the languages in which the dataset metadata and underlying data are made available.",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.conformsTo",
                type: FieldType.TEXT,
                label: "Alignment with standardised data models",
                tooltip:
                    "Standardised data models that the dataset has been stored in or transformed to (e.g. OMOP, FHIR), or if the data is only available in a local format.",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.vocabularyEncodingScheme",
                type: FieldType.TEXT,
                label: "Controlled vocabulary",
                tooltip:
                    "Relevant terminologies/ontologies/controlled vocabularies that are being used in the dataset. (e.g. ICD-10 codes, NHS Data Dictionary national codes, SNOMED CT International)",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.format",
                type: FieldType.TEXT,
                label: "Format",
                tooltip:
                    "Format(s) in which the dataset is available. (e.g. application, audio, image, message, model, multipart, text, video)",
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
                type: FieldType.TEXT,
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
                path: "metadata.metadata.accessibility.usage.investigations",
                type: FieldType.LIST,
                label: "Investigations",
                tooltip: "Weblink to any active projects using the dataset.",
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
