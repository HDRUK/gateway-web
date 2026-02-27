import { DataProvider } from "./DataProvider";
import { DataCustodianDataset } from "./Dataset";

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

export interface NetworkTool {
    id: number;
    name: string;
    enabled: number;
    status: string;
    created_at: string;
    updated_at: string;
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
}

export interface NetworkCollection {
    id: number;
    name: string;
    image_link: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface EntitiesSummaryData {
    id: number;
    datasets_total: number;
    datasets: DataCustodianDataset[];
    tools_total: number;
    tools: NetworkTool[];
    publications_total: number;
    publications: NetworkPublication[];
    collections_total: number;
    collections: NetworkCollection[];
    durs: any;
}

export interface DatasetsSummaryData {
    id: number;
    datasets_total: number;
    datasets: DataCustodianDataset[];
}

export interface NetworkCustodiansSummaryData {
    id: number;
    teams_counts: DataProvider[];
}