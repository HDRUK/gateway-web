import { User } from "./User";

type CohortRequestStatus =
    | "APPROVED"
    | "REJECTED"
    | "PENDING"
    | "BANNED"
    | "SUSPENDED"
    | "EXPIRED";

interface Log {
    id: number;
    user_id: number;
    details: string;
    request_status: CohortRequestStatus;
    created_at: string;
    updated_at: string;
    user: User;
}

interface CohortRequest {
    id: number;
    updated_at: string;
    created_at: string;
    details: string;
    request_status: CohortRequestStatus;
    user: User;
    logs: Log[];
}

interface CohortRequestForm {
    details: string;
    request_status: CohortRequestStatus;
}

interface CohortRequestUser {
    id: number;
    user_id: number;
    request_status: CohortRequestStatus;
    cohort_status: boolean;
    is_nhse_sde_approval: boolean;
    request_expire_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    accept_declaration: boolean;
}

interface CohortRequestAccess {
    redirect_url: string;
}

interface CohortResponse {
    requestStatus: string;
    redirectUrl: string;
}

export type {
    CohortRequest,
    Log,
    CohortRequestStatus,
    CohortRequestForm,
    CohortRequestUser,
    CohortRequestAccess,
    CohortResponse,
};
