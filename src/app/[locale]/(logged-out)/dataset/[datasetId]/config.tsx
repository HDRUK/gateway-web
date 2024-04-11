export enum FieldType {
    TEXT = "text",
    LIST = "list",
    DATE = "date",
    LINK = "link",
    TAG = "tag",
}
interface DatasetField {
    path: string;
    type: FieldType;
    label?: string;
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
            },
            {
                path: "metadata.metadata.summary.datasetSubType",
                type: FieldType.TEXT,
                label: "Dataset Sub-type",
            },
            {
                path: "metadata.original_metadata.documentation.associatedMedia",
                type: FieldType.LINK,
                label: "Associated Media",
            },
            {
                path: "metadata.original_metadata.documentation.isPartOf",
                type: FieldType.LIST,
                label: "Group",
            },
        ],
    },
    {
        sectionName: "Keywords",
        fields: [
            {
                path: "metadata.metadata.summary.keywords",
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
            },
            {
                path: "metadata.metadata.provenance.temporal.publishingFrequency",
                type: FieldType.TEXT,
                label: "Publishing Frequency",
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
                path: "metadata.metadata.accessibility.usage.resourceCreator",
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
                type: FieldType.TEXT,
                label: "Access Rights",
            },
            {
                path: "metadata.metadata.accessibility.access.deliveryLeadTime",
                type: FieldType.TEXT,
                label: "Access Request Duration",
            },
            {
                path: "metadata.metadata.accessibility.access.accessRequestCost",
                type: FieldType.TEXT,
                label: "Organisation Access Request Cost",
            },
            {
                path: "metadata.metadata.accessibility.access.accessService",
                type: FieldType.TEXT,
                label: "Access Service",
            },
            {
                path: "metadata.metadata.accessibility.access.jurisdiction",
                type: FieldType.TEXT,
                label: "Jurisdiction",
            },
            {
                path: "metadata.metadata.accessibility.usage.dataUseLimitation",
                type: FieldType.TEXT,
                label: "Data Use Limitation",
            },
            {
                path: "metadata.metadata.accessibility.usage.dataUseRequirements",
                type: FieldType.TEXT,
                label: "Data Use Requirements",
            },
            {
                path: "metadata.metadata.accessibility.access.dataController",
                type: FieldType.LIST,
                label: "Data Controller",
            },
            {
                path: "metadata.metadata.accessibility.access.dataProcessor",
                type: FieldType.TEXT,
                label: "Data Processor",
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
            },
            {
                path: "metadata.metadata.provenance.temporal.endDate",
                type: FieldType.DATE,
                label: "End Date",
            },
            {
                path: "metadata.metadata.provenance.temporal.timeLag",
                type: FieldType.TEXT,
                label: "Time Lag",
            },
            {
                path: "metadata.metadata.coverage.spatial",
                type: FieldType.LIST,
                label: "Geographic Coverage",
            },
            {
                path: "metadata.metadata.coverage.typicalAgeRange",
                type: FieldType.TEXT,
                label: "Age Range",
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
            },
            {
                path: "metadata.metadata.coverage.pathway",
                type: FieldType.TEXT,
                label: "Pathway",
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
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.conformsTo",
                type: FieldType.TEXT,
                label: "Conforms To",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.language",
                type: FieldType.TEXT,
                label: "Language",
            },
            {
                path: "metadata.metadata.accessibility.formatandstandards.format",
                type: FieldType.TEXT,
                label: "Format",
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
            },
            {
                path: "metadata.metadata.provenance.origin.source",
                type: FieldType.LIST,
                label: "Source",
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
}

const observationTableColumns: ObservationTableColumn[] = [
    {
        header: "Observed Node",
        path: "observedNode",
    },
    {
        header: "Disambiguating Description",
        path: "disambiguatingDescription",
    },
    {
        header: "Measured Value",
        path: "measuredValue",
    },
    {
        header: "Measured Property",
        path: "measuredProperty",
    },
    {
        header: "Observation Date",
        path: "observationDate",
    },
];

export { datasetFields, observationTableColumns };
