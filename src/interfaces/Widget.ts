export enum Unit {
    PX = "px",
    PERCENT = "%",
    rem = "rem",
}

export interface Widget {
    id: number;
    team_id: number;
    data_custodian_entities_ids: number[];
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

type EntityData = {
    id: number;
    name: string;
    team_id: number;
    team_name: string;
};

export interface WidgetEntityData {
    collections: EntityData[];
    datasets: {
        id: number;
        title: string;
        team_id: number;
        team_name: string;
    };
    durs: EntityData[];
    tools: EntityData[];
}
