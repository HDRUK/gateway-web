import { Role } from "@/interfaces/Role";
import { Workgroup } from "./Workgroup";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    preferred_email: string;
    name: string;
    email: string;
    secondary_email: string;
    provider: string;
    providerId: number;
    roles: Role[];
    organisation: string;
    workgroups?: Workgroup[];
}

export type { User };
