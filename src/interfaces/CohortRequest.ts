import { User } from "./User";
import { Log } from "./Log";

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
    logs: Log[];
}

interface CohortRequestForm {
    details: string;
    request_status: CohortRequestStatus;
}

export type { CohortRequest, CohortRequestStatus, CohortRequestForm };
