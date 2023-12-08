import { User } from "./User";

type CohortRequestStatus =
    | "APPROVED"
    | "REJECTED"
    | "PENDING"
    | "BANNED"
    | "SUSPENDED"
    | "EXPIRED";

interface CohortRequest {
    id: number;
    updated_at: string;
    created_at: string;
    details: string;
    request_status: CohortRequestStatus;
    user: User;
}

interface CohortRequestForm {
    details: string;
    request_status: CohortRequestStatus;
}

export type { CohortRequest, CohortRequestStatus, CohortRequestForm };
