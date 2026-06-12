export type DashboardEntity =
    | "datasets"
    | "datauses"
    | "tools"
    | "collections"
    | "publications"
    | "general-enquires"
    | "fesability-enquires"
    | "data-access-requests";

export interface DashboardEntityCount {
    total: number;
    total_by_interval: number;
}
