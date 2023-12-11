import { User } from "@/interfaces/User";
import { CohortRequestStatus } from "@/interfaces/CohortRequest";

interface Log {
    id: number;
    user_id: number;
    details: string;
    request_status: CohortRequestStatus;
    created_at: string;
    updated_at: string;
    user: User;
}

export type { Log };
