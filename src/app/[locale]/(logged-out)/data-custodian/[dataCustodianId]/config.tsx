export enum FieldType {
    TEXT = "text",
    LIST_TEXT = "list",
    LIST_LINK = "list-link",
    DATE = "date",
    LINK = "link",
    TAG = "tag",
}
interface DataCustodianField {
    path: string;
    type: FieldType;
    label?: string;
    hideTooltip?: boolean;
}

export interface DataCustodianSection {
    sectionName: string;
    fields: DataCustodianField[];
}

const dataCustodianFields: DataCustodianSection[] = [
    {
        sectionName: "introduction",
        fields: [
            {
                path: "Introduction",
                type: FieldType.TEXT,
            },
        ],
    },
    // {
    //     sectionName: "resultsInsights",
    //     fields: [
    //         {
    //             path: "description", // what is this suppose to be?
    //             type: FieldType.TEXT,
    //             hideTooltip: true,
    //         },
    //     ],
    // },
    // {
    //     sectionName: "details",
    //     fields: [
    //         {
    //             path: "url",
    //             type: FieldType.LINK,
    //             hideTooltip: false,
    //             label: "url",
    //         },
    //         {
    //             path: "license",
    //             type: FieldType.TEXT,
    //             hideTooltip: false,
    //             label: "license",
    //         },
    //         {
    //             path: "updated_at",
    //             type: FieldType.TEXT,
    //             hideTooltip: false,
    //             label: "lastUpdated",
    //         },
    //         // missing - uploaders or use associated authors?
    //         // missing - tool category, what is that suppose to be? I see category_id returned
    //         // missing - domain, what is this suppose to be?
    //         // missing - keywords, what is this suppose to be? tags?
    //     ],
    // },
];

const accordions = [
    {
        sectionName: "datasets",
        fields: [],
    },
    {
        sectionName: "collections",
        fields: [],
    },
    {
        sectionName: "tools",
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
        sectionName: "serviceOfferings",
        fields: [],
    },
];

export { dataCustodianFields, accordions };
