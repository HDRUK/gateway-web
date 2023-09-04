import { Team } from "@/interfaces/Team";

interface User {
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
    teams: Team[];
}

export type { User };
