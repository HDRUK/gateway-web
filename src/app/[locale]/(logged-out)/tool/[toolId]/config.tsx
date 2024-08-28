export enum FieldType {
    TEXT = "text",
    LIST_TEXT = "list",
    LIST_LINK = "list-link",
    DATE = "date",
    LINK = "link",
    TAG = "tag",
}
interface ToolField {
    path: string;
    type: FieldType;
    label?: string;
    hideTooltip?: boolean;
}

export interface ToolSection {
    sectionName: string;
    fields: ToolField[];
}

const toolFields: ToolSection[] = [
    {
        sectionName: "description",
        fields: [
            {
                path: "description",
                type: FieldType.TEXT,
            },
        ],
    },
    {
        sectionName: "resultsInsights",
        fields: [
            {
                path: "description", // what is this suppose to be?
                type: FieldType.TEXT,
                hideTooltip: true,
            },
        ],
    },
    {
        sectionName: "details",
        fields: [
            {
                path: "url",
                type: FieldType.LINK,
                hideTooltip: false,
                label: "url",
            },
            {
                path: "license.label",
                type: FieldType.TEXT,
                hideTooltip: false,
                label: "license",
            },
            {
                path: "updated_at",
                type: FieldType.TEXT,
                hideTooltip: false,
                label: "lastUpdated",
            },
            // missing - uploaders or use associated authors?
            // missing - tool category, what is that suppose to be? I see category_id returned
            // missing - domain, what is this suppose to be?
            // missing - keywords, what is this suppose to be? tags?
        ],
    },
];

const accordions = [
    {
        sectionName: "datasets",
        fields: [],
    },
    {
        sectionName: "dataUses",
        fields: [],
    },
    {
        sectionName: "publications",
        fields: [],
    },
    {
        sectionName: "collections",
        fields: [],
    },
];

export { toolFields, accordions };
