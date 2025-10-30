import { Notification } from "@/interfaces/Notification";
import { User } from "@/interfaces/User";
import { Alias } from "./Alias";

interface Team {
    id: number;
    pid: string;
    name: string;
    enabled: boolean;
    allows_messaging: boolean;
    workflow_enabled: boolean;
    access_requests_management: boolean;
    uses_5_safes: boolean;
    is_admin: boolean;
    is_question_bank: boolean;
    has_published_dar_template: boolean;
    member_of: string;
    is_dar: boolean;
    dar_modal_header: string | null;
    dar_modal_content: string | null;
    dar_modal_footer: string | null;
    contact_point: string;
    updated_at: string;
    application_form_updated_by: string;
    application_form_updated_on: string;
    users: User[];
    notification_status: boolean;
    notifications: Notification[];
    team_logo?: string;
    introduction: string;
    url?: string;
    service?: string;
    aliases?: Alias[];
}

interface TeamEditForm
    extends Pick<
        Team,
        | "name"
        | "member_of"
        | "contact_point"
        | "is_question_bank"
        | "team_logo"
        | "introduction"
        | "dar_modal_content"
    > {
    users: number[];
    aliases: number[];
}

interface TeamCreateForm
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
        | "team_logo"
        | "introduction"
        | "dar_modal_content"
    > {
    users: number[];
    aliases: number[];
}

interface TeamNames {
    id: number;
    name: string;
}

export type { Team, TeamEditForm, TeamCreateForm, TeamNames };
