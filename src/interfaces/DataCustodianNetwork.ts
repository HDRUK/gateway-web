import { DataProvider } from "./DataProvider";
import { DataCustodianDataset } from "./Dataset";
import { User } from "./User";

export interface DataCustodianNetwork {
    name: string;
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    enabled: boolean;
    img_url: string | null;
    summary: string | null;
    url: string | null;
    service: string[] | null;
}

export interface DatasetsSummaryData {
    id: number;
    datasets_total: number;
    datasets: DataCustodianDataset[];
}

export interface EntityTeam {
    id: number;
    name: string;
}

export interface NetworkDur {
    id: number;
    project_title: string;
    organisation_name: string;
    status: string;
    team_id: string;
    relation?: string;
    team?: EntityTeam;
}

export interface NetworkTool {
    id: number;
    name: string;
    enabled: number;
    status: string;
    created_at: string;
    updated_at: string;
    team_id: string;
    user?: User;
    relation?: string;
    team?: EntityTeam;
}

export interface NetworkPublication {
    id: number;
    paper_title: string;
    authors: string;
    publication_type: string;
    publication_type_mk1: string;
    status: string;
    created_at: string;
    updated_at: string;
    url: string;
    team_id: string;
    year_of_publication?: string;
    relation?: string;
    team?: EntityTeam;
}

export interface NetworkCollection {
    id: number;
    name: string;
    image_link: string;
    status: string;
    created_at: string;
    updated_at: string;
    team_id: string;
    relation?: string;
    team?: EntityTeam;
}

export interface NetworkDataset {
    id: number;
    user_id: number;
    team_id: string;
    title: string;
    populationSize: number;
    datasetType: string;
    relation?: string;
    team?: EntityTeam;
}

export interface EntitiesSummaryData {
    id: number;
    datasets_total?: number;
    datasets?: NetworkDataset[];
    associated_datasets_total: number;
    associated_datasets: NetworkDataset[];
    durs_total: number;
    durs: NetworkDur[];
    associated_durs_total: number;
    associated_durs: NetworkDur[];
    tools_total: number;
    tools: NetworkTool[];
    associated_tools_total: number;
    associated_tools: NetworkTool[];
    publications_total: number;
    publications: NetworkPublication[];
    associated_publications_total: number;
    associated_publications: NetworkPublication[];
    collections_total: number;
    collections: NetworkCollection[];
    associated_collections_total: number;
    associated_collections: NetworkCollection[];
}

export interface NetworkCustodiansSummaryData {
    id: number;
    teams_counts: DataProvider[];
}
