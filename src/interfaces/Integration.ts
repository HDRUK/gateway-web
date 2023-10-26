import { Notification } from "@/interfaces/Notification";

export type FederationType = "DATASETS" | "DUR" | "TOOLS";
export type AuthType = "API_KEY" | "BEARER" | "NO_AUTH";

interface Integration {
    id: number;
    federation_type: FederationType;
    auth_type: AuthType;
    auth_secret_key?: string;
    endpoint_baseurl: string;
    endpoint_datasets: string;
    endpoint_dataset: string;
    run_time_hour: string;
    run_time_minute: string;
    enabled: boolean;
    tested: boolean;
    notifications: Notification[] | undefined;
}

interface IntegrationPayload extends Omit<Integration, "notifications"> {
    notifications: string[] | undefined;
}

export type { Integration, IntegrationPayload };
