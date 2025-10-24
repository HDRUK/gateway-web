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

interface WidgetDetails {
    widget_name: string;
    size_width: number;
    size_height: number;
    unit: Unit;
    include_search_bar: number;
    include_cohort_link: number;
    keep_proportions: number;
}

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
    widget: WidgetDetails;
}
