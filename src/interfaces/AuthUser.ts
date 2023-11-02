import { AuthTeam } from "@/interfaces/AuthTeam";
import { Role } from "@/interfaces/Role";

interface AuthUser {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    secondary_email?: string;
    preferred_email: "secondary" | "primary";
    sector_id: string;
    organisation: string;
    bio: string;
    domain: string;
    provider: string;
    providerId: number;
    link: string;
    orcid: string;
    terms: boolean;
    contact_news: boolean;
    contact_feedback: boolean;
    teams: AuthTeam[];
    roles: Role[];
}

export type { AuthUser };
