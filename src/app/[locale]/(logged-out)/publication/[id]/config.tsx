import { FieldType } from "@/interfaces/FieldType";

interface PublicationField {
    path: string;
    type: FieldType;
    hideTooltip?: boolean;
    hideLabel?: boolean;
}

export interface PublicationSection {
    sectionName: string;
    fields: PublicationField[];
}

const publicationFields: PublicationSection[] = [
    {
        sectionName: "abstract",
        fields: [
            {
                path: "abstract",
                type: FieldType.TEXT,
                hideTooltip: true,
                hideLabel: true,
            },
        ],
    },
    {
        sectionName: "details",
        fields: [
            {
                path: "journal_name",
                type: FieldType.TEXT,
            },
            {
                path: "authors",
                type: FieldType.TEXT,
            },
            {
                path: "publication_type",
                type: FieldType.TEXT,
            },
            {
                path: "url",
                type: FieldType.TEXT,
            },
            {
                path: "paper_doi",
                type: FieldType.LINK,
            },
            {
                path: "year_of_publication",
                type: FieldType.TEXT,
            },
        ],
    },
];

const relatedContentAccordions = [
    {
        sectionName: "datasets",
        fields: [],
    },
    {
        sectionName: "dataUses",
        fields: [],
    },
    {
        sectionName: "tools",
        fields: [],
    },
    {
        sectionName: "collections",
        fields: [],
    },
];

export { publicationFields, relatedContentAccordions };
