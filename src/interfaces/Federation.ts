import { AuthType } from "./Integration";

interface FederationTestResponse {
    status: number;
    success: boolean;
    title: string;
}

interface Federation {
    id: number;
    auth_type: AuthType;
    auth_secret_key?: string;
    endpoint_baseurl: string;
    endpoint_datasets: string;
    endpoint_dataset: string;
    run_time_hour: number;
}

export enum FederationTestStatus {
    NOT_RUN = "NOT_RUN",
    IS_RUNNING = "IS_RUNNING",
    RUN_COMPLETE = "RUN_COMPLETE",
    TESTED_IS_TRUE = "TESTED_IS_TRUE",
}

export enum FederationRunStatus {
    IDLE = "IDLE",
    RUNNING = "RUNNING",
    COMPLETE = "COMPLETE",
}

export type { FederationTestResponse, Federation };
