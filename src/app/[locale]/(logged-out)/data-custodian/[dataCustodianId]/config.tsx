export enum FieldType {
    TEXT = "text",
    LIST_TEXT = "list",
    LIST_LINK = "list-link",
    DATE = "date",
    LINK = "link",
    TAG = "tag",
    WYSIWYG = "wysiwyg",
    CONTENT = "content",
}
export interface DataCustodianField {
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
                path: "introduction",
                type: FieldType.WYSIWYG,
            },
        ],
    },
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
    // { TODO: Post-MVP
    //     sectionName: "serviceOfferings",
    //     fields: [],
    // },
];

export { accordions, dataCustodianFields };
