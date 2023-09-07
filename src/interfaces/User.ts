import { Role } from "@/interfaces/Role";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    provider: string;
    providerId: number;
    roles: Role[];
}

export type { User };
