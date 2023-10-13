// /interfaces/Integration.ts

export type FederationType = "DATASETS" | "DUR" | "TOOLS";
export type AuthType = "API_KEY" | "BEARER" | "NO_AUTH";

interface Integration { 
    federation_type: FederationType;
    created_at: string;
    auth_type: AuthType;
    auth_secret_key: string;
    endpoint_baseurl: string;
    endpoint_datasets: string;
    endpoint_dataset: string;
    run_time_hour: number;
    enabled: boolean;
    notification: string[];
}

export type { Integration };