import { Collection } from "@/interfaces/Collection";
import { Dataset } from "@/interfaces/Dataset";
import { DataUse } from "@/interfaces/DataUse";
import { Notification } from "@/interfaces/Notification";
import { Publication } from "@/interfaces/Publication";
import { Tool } from "@/interfaces/Tool";
import { User } from "@/interfaces/User";

interface Team {
    id: number;
    name: string;
    enabled: boolean;
    allows_messaging: boolean;
    workflow_enabled: boolean;
    access_requests_management: boolean;
    uses_5_safes: boolean;
    is_admin: boolean;
    is_question_bank: boolean;
    member_of: string;
    contact_point: string;
    updated_at: string;
    application_form_updated_by: string;
    application_form_updated_on: string;
    users: User[];
    notification_status: boolean;
    notifications: Notification[];
}

interface TeamSummary {
    id: number;
    name: string;
    is_provider: boolean;
    datasets: Dataset[];
    durs: DataUse[];
    tools: Tool[];
    publications: Publication[];
    collections: Collection[];
}

interface TeamForm
    extends Pick<
        Team,
        | "notifications"
        | "enabled"
        | "allows_messaging"
        | "workflow_enabled"
        | "access_requests_management"
        | "uses_5_safes"
        | "name"
        | "member_of"
        | "contact_point"
        | "is_question_bank"
    > {
    users: number[];
}

export type { Team, TeamSummary, TeamForm };
