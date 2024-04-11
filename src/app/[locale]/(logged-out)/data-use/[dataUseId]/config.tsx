export enum FieldType {
    TEXT = "text",
    LIST_TEXT = "list",
    LIST_LINK = "list-link",
    DATE = "date",
    LINK = "link",
    TAG = "tag",
}
interface DataUseField {
    path: string;
    type: FieldType;
    hideTooltip?: boolean;
}

export interface DataUseSection {
    sectionName: string;
    fields: DataUseField[];
}

const dataUseFields: DataUseSection[] = [
    {
        sectionName: "general",
        fields: [
            {
                path: "project_title",
                type: FieldType.TEXT,
                hideTooltip: true,
            },
        ],
    },
    // {
    //     sectionName: "safePeople",
    //     fields: [
    //         {
    //             path: "organisation_name",
    //             type: FieldType.LINK,
    //         },
    //         {
    //             path: "organisation_id",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "organisation_sector",
    //             type: FieldType.TEXT,
    //         },

    //         {
    //             path: "non_gateway_applicants",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "funders_and_sponsors",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "accredited_researcher_status",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "sublicence_arrangements",
    //             type: FieldType.TEXT,
    //         },
    //     ],
    // },
    // {
    //     sectionName: "safeProjects",
    //     fields: [
    //         {
    //             path: "project_id_text",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "lay_summary",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "public_benefit_statement",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "request_category_type",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "technical_summary",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "other_approval_committees",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "project_start_date",
    //             type: FieldType.DATE,
    //         },
    //         {
    //             path: "project_end_date",
    //             type: FieldType.DATE,
    //         },
    //         {
    //             path: "latest_approval_date",
    //             type: FieldType.DATE,
    //         },
    //     ],
    // },
    // {
    //     sectionName: "safeData",
    //     fields: [
    //         {
    //             path: "datasets",
    //             type: FieldType.TAG,
    //         },
    //         {
    //             path: "non_gateway_datasets",
    //             type: FieldType.LIST_TEXT,
    //         },
    //         {
    //             path: "data_sensitivity_level",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "legal_basis_for_data_article6",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "legal_basis_for_data_article9",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "duty_of_confidentiality",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "national_data_optout",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "request_frequency",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "dataset_linkage_description",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "confidential_data_description",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "access_date",
    //             type: FieldType.DATE,
    //         },
    //     ],
    // },
    // {
    //     sectionName: "safeSetting",
    //     fields: [
    //         {
    //             path: "access_type",
    //             type: FieldType.TEXT,
    //         },
    //         {
    //             path: "privacy_enhancements",
    //             type: FieldType.TEXT,
    //         },
    //     ],
    // },
    // {
    //     sectionName: "safeOutput",
    //     fields: [
    //         {
    //             path: "non_gateway_outputs",
    //             type: FieldType.LIST_LINK,
    //         },
    //     ],
    // },
];

export { dataUseFields };
