import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";

interface DataAccessRequestApplication {
    id: string;
    appliciation_id: number;
    approval_status: DarApplicationApprovalStatus;
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
    days_since_submission: string | null;
    project_title: string;
    submission_status: DarApplicationStatus;
    user: {
        id: number;
        name: string;
        organisation: string;
    };
}

export type { DataAccessRequestApplication };
