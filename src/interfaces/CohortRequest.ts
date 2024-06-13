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

export type { CohortRequest, Log, CohortRequestStatus, CohortRequestForm };
