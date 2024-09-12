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
        sectionName: "Abstract",
        fields: [
            {
                path: "metadata.metadata.summary.abstract",
                type: FieldType.TEXT,
            },
        ],
    },
    {
        sectionName: "Documentation",
        fields: [
            {
                path: "metadata.metadata.summary.description",
                type: FieldType.TEXT,
            },
            {
                path: "metadata.metadata.summary.datasetType",
                type: FieldType.TEXT,
                label: "Dataset Type",
                tooltip:
                    "The topic areas to which the dataset content relates.",
            },
            {
                path: "metadata.metadata.summary.datasetSubType",
                type: FieldType.TEXT,
                label: "Dataset Sub-type",
                tooltip: "The sub-type of the dataset content.",
            },
            {
                path: "metadata.original_metadata.documentation.associatedMedia",
                type: FieldType.LINK_LIST,
                label: "Associated Media",
                tooltip:
                    "Media that might provide additional context for researchers wanting to understand more about the dataset and its relevance to their research question.",
            },
            {
                path: "metadata.original_metadata.documentation.isPartOf",
                type: FieldType.LIST,
                label: "Group",
                tooltip:
                    "Indication of whether the dataset is part of a group or family of datasets (i.e. Hospital Episode Statistics has several constituents).",
            },
        ],
    },
    {
        sectionName: "Keywords",
        fields: [
            {
                path: "metadata.metadata.summary.keywords",
                type: FieldType.TEXT,
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
                path: "metadata.metadata.summary.doiName",
                type: FieldType.TEXT,
                label: "DOI Name",
                tooltip:
                    "DOI for the specific dataset or dataset version. NOTE: This is not the DOI of the publication(s) associated with the dataset, but rather the DOI of the metadata describing the dataset.",
            },
            {
                path: "metadata.metadata.summary.distributionReleaseDate",
                type: FieldType.TEXT,
                label: "Distribution Release Date",
            },
            {
                path: "metadata.metadata.provenance.temporal.distributionReleaseDate",
                type: FieldType.DATE,
                label: "Release Date",
                tooltip:
                    "Date this version of the dataset was released for research purposes.",
            },
            {
                path: "metadata.metadata.provenance.temporal.publishingFrequency",
                type: FieldType.TEXT,
                label: "Publishing Frequency",
                tooltip:
                    "The frequency of publishing new data for this dataset.",
            },
            {
                path: "metadata.metadata.issued",
                type: FieldType.TEXT,
                label: "Metadata Issued Datetime",
            },
            {
                path: "metadata.metadata.version",
                type: FieldType.TEXT,
                label: "Dataset Version",
            },
            {
                path: "metadata.metadata.accessibility.usage.resourceCreator.name",
                type: FieldType.TEXT,
                label: "Citation Requirements",
            },
        ],
    },

    {
        sectionName: "Data Access Requests",
        fields: [
            {
                path: "metadata.metadata.accessibility.access.accessRights",
                type: FieldType.LIST,
                label: "Access Rights",
                tooltip:
                    "The webpage where the data access request process and/or guidance is provided.",
            },
            {
                path: "metadata.metadata.accessibility.access.deliveryLeadTime",
                type: FieldType.TEXT,
                label: "Access Request Duration",
                tooltip:
                    "Indication of the typical processing times based on the types of requests typically received.",
            },
            {
                path: "metadata.metadata.accessibility.access.accessRequestCost",
                type: FieldType.LIST,
                label: "Organisation Access Request Cost",
                tooltip:
                    "Webpage or description detailing the service or cost model for processing data access requests.",
            },
            {
                path: "metadata.metadata.accessibility.access.accessService",
                type: FieldType.TEXT,
                label: "Access Service",
                tooltip:
                    "A brief description of the data access services that are available from the Data Custodian",
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
                label: "Data Use Limitation",
                tooltip:
                    "Indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used.",
            },
            {
                path: "metadata.metadata.accessibility.usage.dataUseRequirements",
                type: FieldType.TEXT,
                label: "Data Use Requirements",
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
        sectionName: "Tissue sample",
        fields: [
            {
                path: "metadata.metadata.tissuesSampleCollection.dataCategories",
                type: FieldType.LIST,
                label: "Data Categories",
            },
            {
                path: "metadata.metadata.tissuesSampleCollection.materialType",
                type: FieldType.LIST,
                label: "Material Type",
                tooltip:
                    "Type of biospeciment saved from a biological entity, and indication of the specimen availability.",
            },
            {
                path: "metadata.metadata.tissuesSampleCollection.tissueSampleMetadata.creationDate",
                type: FieldType.DATE,
                label: "Creation Date",
            },
            {
                path: "metadata.metadata.tissuesSampleCollection.tissueSampleMetadata.AnatomicalSiteOntologyCode",
                type: FieldType.TEXT,
                label: "Anatomical Site Ontology Code",
            },
            {
                path: "metadata.metadata.tissuesSampleCollection.collectionType",
                type: FieldType.TEXT,
                label: "Collection Type",
            },
        ],
    },
    {
        sectionName: "Coverage",
        fields: [
            {
                path: "metadata.metadata.coverage.distributionReleaseDate",
                type: FieldType.DATE,
                label: "Release Date",
            },
            {
                path: "metadata.metadata.provenance.temporal.startDate",
                type: FieldType.DATE,
                label: "Start Date",
                tooltip:
                    "The start of the time period for which the dataset provides coverage.",
            },
            {
                path: "metadata.metadata.provenance.temporal.endDate",
                type: FieldType.DATE,
                label: "End Date",
                tooltip:
                    "The last date of the time period for which the dataset provides coverage.",
            },
            {
                path: "metadata.metadata.provenance.temporal.timeLag",
                type: FieldType.TEXT,
                label: "Time Lag",
                tooltip:
                    "The typical time-lag between an event and the data for that event appearing in the dataset.",
            },
            {
                path: "metadata.metadata.coverage.spatial",
                type: FieldType.LIST,
                label: "Geographic Coverage",
                tooltip:
                    "The geographical area covered by the dataset population or data.",
            },
            {
                path: "metadata.metadata.coverage.typicalAgeRange",
                type: FieldType.TEXT,
                label: "Age Range",
                tooltip: "The age range of dataset participants.",
            },
            {
                path: "metadata.metadata.coverage.gender",
                type: FieldType.LIST,
                label: "Gender",
            },
            {
                path: "metadata.metadata.coverage.psychological",
                type: FieldType.LIST,
                label: "Psychological",
            },
            {
                path: "metadata.metadata.coverage.physical",
                type: FieldType.LIST,
                label: "Physical",
            },
            {
                path: "metadata.metadata.coverage.anthropometric",
                type: FieldType.LIST,
                label: "Anthropometric",
            },
            {
                path: "metadata.metadata.coverage.lifestyle",
                type: FieldType.LIST,
                label: "Lifestyle",
            },
            {
                path: "metadata.metadata.coverage.socioeconomic",
                type: FieldType.LIST,
                label: "Socio-economic",
            },
            {
                path: "metadata.metadata.coverage.biologicalsamples",
                type: FieldType.LIST,
                label: "Biological Samples",
            },
            {
                path: "metadata.metadata.coverage.followup",
                type: FieldType.TEXT,
                label: "Followup",
                tooltip:
                    "The typical time span that a patient appears in the dataset (follow up period).",
            },
            {
                path: "metadata.metadata.coverage.pathway",
                type: FieldType.TEXT,
                label: "Pathway",
                tooltip:
                    "Description of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.",
            },
        ],
    },

    {
        sectionName: "Format And Standards",
        fields: [
            {
                path: "metadata.metadata.accessibility.formatandstandards.vocabularyEncodingScheme",
                type: FieldType.TEXT,
                label: "Vocabulary Encoding Scheme",
                tooltip:
                    "Relevant terminologies/ontologies/controlled vocabularies that are being used in the dataset. (e.g. ICD-10 codes, NHS Data Dictionary national codes, SNOMED CT International)",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.conformsTo",
                type: FieldType.TEXT,
                label: "Conforms To",
                tooltip:
                    "Standardised data models that the dataset has been stored in or transformed to (e.g. OMOP, FHIR), or if the data is only available in a local format.",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.language",
                type: FieldType.TEXT,
                label: "Language",
                tooltip:
                    "All the languages in which the dataset metadata and underlying data are made available.",
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
        sectionName: "Provenance",
        fields: [
            {
                path: "metadata.metadata.provenance.origin.purpose",
                type: FieldType.LIST,
                label: "Purpose",
                tooltip: "The purpose for which the dataset was collected.",
            },
            {
                path: "metadata.metadata.provenance.origin.source",
                type: FieldType.LIST,
                label: "Source",
                tooltip: "The source from which the data was extracted.",
            },
            {
                path: "metadata.metadata.provenance.origin.collectionSituation",
                type: FieldType.LIST,
                label: "Collection Situation Setting",
            },
            {
                path: "metadata.metadata.accessibility.enrichmentAndLinkage.derivation",
                type: FieldType.TEXT,
                label: "Derivations",
            },
        ],
    },

    {
        sectionName: "Related resources",
        fields: [
            {
                path: "metadata.metadata.accessibility.usage.isReferencedBy",
                type: FieldType.TEXT,
                label: "Citations",
            },
            {
                path: "metadata.metadata.accessibility.usage.investigations",
                type: FieldType.TEXT,
                label: "Investigations",
                tooltip: "Weblink to any active projects using the dataset.",
            },
            {
                path: "metadata.metadata.accessibility.enrichmentAndLinkage.tools",
                type: FieldType.TEXT,
                label: "Tools",
            },
            {
                path: "metadata.metadata.accessibility.enrichmentAndLinkage.qualifiedRelation",
                type: FieldType.TEXT,
                label: "Linked Datasets",
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
