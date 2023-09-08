import { AuthTeam } from "@/interfaces/AuthTeam";

interface AuthUser {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    sector_id: string;
    organisation: string;
    bio: string;
    domain: string;
    link: string;
    orcid: string;
    terms: boolean;
    contact_news: boolean;
    contact_feedback: boolean;
    teams: AuthTeam[];
}

export type { AuthUser };
