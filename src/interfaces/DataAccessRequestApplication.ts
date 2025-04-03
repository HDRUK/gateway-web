import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";

interface DarTeamApplication {
    approval_status: DarApplicationApprovalStatus;
    created_at: string;
    dar_application_id: number;
    id: number;
    review_id: number;
    submission_status: DarApplicationStatus;
    submission_date: string;
    team_id: number;
    updated_at: string;
}

interface DataAccessRequestApplication {
    id: string;
    appliciation_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    datasets: [
        {
            custodian: {
                id: number;
                name: string;
            };
            dar_application_id: number;
            dataset_id: number;
            dataset_title: string;
        }
    ];
    teams: DarTeamApplication[];
    days_since_submission: string | null;
    project_title: string;
    user: {
        id: number;
        name: string;
        organisation: string;
    };
    primary_applicant: {
        name: string | null;
        organisation: string | null;
    };
    answers?: {
        question_id: string;
        answer: unknown;
    }[];
}

export type { DataAccessRequestApplication, DarTeamApplication };
