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
    request_status: CohortRequestStatus;
    user: User;
}

export type { CohortRequest, CohortRequestStatus };
