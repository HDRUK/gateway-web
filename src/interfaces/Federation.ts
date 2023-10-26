import { AuthType } from "./Integration";

interface FederationRunResponse {
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

export type { FederationRunResponse, Federation };
