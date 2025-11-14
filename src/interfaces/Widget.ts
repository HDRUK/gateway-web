export enum Unit {
    PX = "px",
    PERCENT = "%",
    rem = "rem",
}

export interface Widget {
    id: number;
    team_id: number;
    data_custodian_entities_ids: string[];
    included_datasets: number[];
    included_data_uses: number[];
    included_scripts: number[];
    included_collections: number[];
    include_search_bar: boolean;
    include_cohort_link: boolean;
    size_width: number;
    size_height: number;
    unit: Unit;
    keep_proportions: boolean;
    widget_name: string;
    permitted_domains: string[];
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface WidgetDetails {
    widget_name: string;
    size_width: number;
    size_height: number;
    unit: Unit;
    include_search_bar: number;
    include_cohort_link: number;
    keep_proportions: number;
}

export type WidgetCategory =
    | "datasets"
    | "data_uses"
    | "scripts"
    | "collections";

export interface DatasetItem {
    id: number;
    team_id: number;
    dataset_version_id: number;
    title: string;
    short_title?: string;
    description?: string;
    raw_keywords?: string;
    population_size?: string | number | null;
    start_date?: string | null;
    end_date?: string | null;
    publisher?: string | null;
}

export interface DataUseDatasetRef {
    dataset_id: number;
    dataset_title: string;
    dataset_count: number;
}

export interface DataUseItem {
    id: number;
    name: string;
    team_name?: string;
    team_id?: number;
    organisation_name?: string;
    dataset?: DataUseDatasetRef;
    member_of?: string;
}

export interface ScriptItem {
    team_id: number;
    id: number;
    name: string;
    description?: string;
}

export interface CollectionItem {
    team_id: number;
    id: number;
    name: string;
    image_link?: string;
}

export interface WidgetEntityData {
    datasets: DatasetItem[];
    data_uses: DataUseItem[];
    scripts: ScriptItem[];
    collections: CollectionItem[];
    widget: WidgetDetails;
}

export interface WidgetResponse {
    datasets: DatasetItem[];
    durs: DataUseItem[];
    tools: ScriptItem[];
    collections: CollectionItem[];
    widget: WidgetDetails;
}
