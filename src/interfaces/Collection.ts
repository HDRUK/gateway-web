import { Application } from "./Application";
import { DataUse } from "./DataUse";
import { Dataset } from "./Dataset";
import { Team } from "./Team";
import { Tool } from "./Tool";
import { User } from "./User";

interface Collection {
    name: string;
    description: string;
    id: string;
    enabled: boolean;
    public: number;
    counter: number;
    create_at: string;
    updated_at: string;
    deleted_at: string;
    team_id: number;
    keywords: string[];
    datasets: Dataset[];
    team: Team;
    users: User[];
    applications: Application[];
    dur: DataUse[];
    tools: Tool[];
}

export type { Collection };
