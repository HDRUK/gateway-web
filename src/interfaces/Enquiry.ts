interface DatasetWithInterestType {
    dataset_id: number | null;
    team_id: number;
    interest_type: string;
}

interface DatasetEnquiry {
    datasetId: number | null;
    teamId: number;
    teamName: string;
    name?: string;
}

interface EnquiryPayload {
    from: string;
    organisation: string;
    contact_number: string;
    project_title: string;
    is_dar_dialogue: boolean;
    is_dar_status: boolean;
    is_feasibility_enquiry: boolean;
    is_general_enquiry: boolean;
    datasets: DatasetWithInterestType[];
}

interface GeneralEnquiryPayload extends EnquiryPayload {
    query: string;
}

interface FeasibilityEnquiryPayload extends EnquiryPayload {
    research_aim: string;
    other_datasets: string;
    dataset_parts_known: string;
    funding: string;
    potential_research_benefit: string;
}

interface GeneralEnquiryFormValues
    extends Pick<GeneralEnquiryPayload, "from" | "organisation" | "query"> {
    name: string;
    contact_number: string | null;
}

interface FeasibilityEnquiryFormValues
    extends Pick<
        FeasibilityEnquiryPayload,
        | "from"
        | "organisation"
        | "project_title"
        | "research_aim"
        | "other_datasets"
        | "dataset_parts_known"
        | "funding"
        | "potential_research_benefit"
    > {
    name: string;
    contact_number: string | null;
    datasets: { value: number | null; label?: string }[];
}

export type {
    DatasetEnquiry,
    FeasibilityEnquiryFormValues,
    FeasibilityEnquiryPayload,
    GeneralEnquiryFormValues,
    GeneralEnquiryPayload,
};
