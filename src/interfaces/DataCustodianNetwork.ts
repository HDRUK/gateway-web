import { Collection } from "./Collection";
import { DataProvider } from "./DataProvider";
import { DataCustodianDataset } from "./Dataset";
import { Publication, ReducedPublication } from "./Publication";
import { ReducedTool, Tool } from "./Tool";

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

export interface EntitiesSummaryData {
    id: number;
    datasets_total: number;
    datasets: DataCustodianDataset[];
    tools_total: number;
    tools: Tool[] | ReducedTool[];
    publications_total: number;
    publications: Publication[] | ReducedPublication[];
    collections_total: number;
    collections:  Collection[];
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