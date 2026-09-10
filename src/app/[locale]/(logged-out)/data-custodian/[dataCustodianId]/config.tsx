import { FieldType } from "@/interfaces/FieldType";

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
        sectionName: "dataUses",
        fields: [],
    },
    {
        sectionName: "tools",
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
    // { TODO: Post-MVP
    //     sectionName: "serviceOfferings",
    //     fields: [],
    // },
];

export { accordions, dataCustodianFields };
