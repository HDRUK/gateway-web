interface DatasetWithInterestType {
    dataset_id: number;
    interest_type: string;
}

interface DatasetEnquiry {
    datasetId: number | null;
    teamId: number;
    teamName: string;
    teamMemberOf: string;
    name?: string;
}
interface Enquiry {
    from: string;
    team_id: number;
    project_title: string;
    is_dar_dialogue: boolean;
    is_dar_status: boolean;
    is_feasibility_enquiry: boolean;
    is_general_enquiry: boolean;
    datasets: DatasetWithInterestType[];
    contact_number: string;
    research_aim: string;
    other_datasets: string;
    dataset_parts_known: string;
    funding: string;
    potential_research_benefit: string;
    query: string;
}

export type { DatasetEnquiry, Enquiry };
