import { Role } from "@/interfaces/Role";

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
}

export type { User };
