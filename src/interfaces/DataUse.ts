import { Dayjs } from "dayjs";
import type { Dataset } from "./Dataset";
import { Keyword } from "./Keyword";
import { Team } from "./Team";
import { User } from "./User";

export type DatasetWithTitle = Dataset & { shortTitle: string };

export interface ReducedDataUse {
    id: number;
    project_title: string;
    organisation_name: string;
}

export interface DataUse {
    id: number;
    created_at: Date | Dayjs | string;
    updated_at: Date | Dayjs | string;
    non_gateway_datasets: string[];
    non_gateway_applicants: string[];
    funders_and_sponsors: string[] | string;
    other_approval_committees: string[];
    gateway_outputs_tools: string[];
    gateway_outputs_papers: string[];
    non_gateway_outputs: string[];
    project_title: string;
    project_id_text: string;
    organisation_name: string;
    organisation_sector: string;
    lay_summary: string;
    technical_summary: string | null;
    latest_approval_date: Date | Dayjs | string | null;
    manual_upload: boolean;
    sublicence_arrangements: string;
    public_benefit_statement: string;
    data_sensitivity_level: string;
    project_start_date: Date | Dayjs | string | null;
    project_end_date: Date | Dayjs | string | null;
    access_date: Date | Dayjs | string | null;
    accredited_researcher_status: string;
    confidential_data_description: string;
    dataset_linkage_description: string;
    duty_of_confidentiality: string;
    legal_basis_for_data_article6: string;
    legal_basis_for_data_article9: string;
    national_data_optout: string;
    organisation_id: string;
    privacy_enhancements: string;
    request_category_type: string;
    request_frequency: string;
    access_type: string;
    datasets: DatasetWithTitle[] | string[];
    keywords: Keyword[] | string[];
    applicant_id: number;
    status: string;
    team_id: number;
    team: Team;
    user: User;
}
