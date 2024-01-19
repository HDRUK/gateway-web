import { Notification } from "@/interfaces/Notification";
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
    application_form_updated_by: string;
    application_form_updated_on: string;
    users: User[];
    notification_status: boolean;
    notifications: Notification[];
}

interface TeamForm extends Pick<Team, "name" | "member_of" | "contact_point"> {
    notifications: string[];
}

export type { Team, TeamForm };
