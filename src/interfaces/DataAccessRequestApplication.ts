import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";

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
    teams: [
        {
            approval_status: DarApplicationApprovalStatus;
            created_at: string;
            dar_application_id: number;
            id: number;
            review_id: number;
            submission_status: DarApplicationStatus;
            team_id: number;
            updated_at: string;
        }
    ];
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
}

export type { DataAccessRequestApplication };
