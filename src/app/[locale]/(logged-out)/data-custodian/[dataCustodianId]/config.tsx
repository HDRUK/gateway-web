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
                path: "introduction",
                type: FieldType.TEXT,
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

export { dataCustodianFields, accordions };
