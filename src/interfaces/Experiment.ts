import {
    ExperimentDefinition,
    TriggerFrequency,
    TriggerOn,
} from "@hdruk/experiments";

export type ExperimentStatus = "draft" | "active" | "paused" | "archived";

export type ExperimentAudience = "all" | "logged_in" | "logged_out" | "user_ids";

export interface ExperimentTargeting {
    paths: string[];
    audience: ExperimentAudience;
    user_ids?: number[];
    percentage: number;
}

export interface ExperimentTrigger {
    on: TriggerOn;
    delaySeconds?: number;
    frequency: TriggerFrequency;
}

export interface AdminExperiment {
    id: number;
    name: string;
    status: ExperimentStatus;
    definition: ExperimentDefinition;
    targeting: ExperimentTargeting;
    trigger: ExperimentTrigger;
    starts_at: string | null;
    ends_at: string | null;
    responses_count?: number;
    created_at: string;
    updated_at: string;
}

export interface ExperimentFormValues {
    name: string;
    definition: ExperimentDefinition;
    status: ExperimentStatus;
    paths: string[];
    audience: ExperimentAudience;
    user_ids: number[];
    percentage: number;
    trigger_on: TriggerOn;
    delay_seconds: number;
    frequency: TriggerFrequency;
    starts_at: string | null;
    ends_at: string | null;
}

export interface ExperimentPayload {
    name: string;
    status: ExperimentStatus;
    definition: ExperimentDefinition;
    targeting: ExperimentTargeting;
    trigger: ExperimentTrigger;
    starts_at: string | null;
    ends_at: string | null;
}
