import { Application } from "./Application";
import { DataUse } from "./DataUse";
import { Dataset } from "./Dataset";
import { Team } from "./Team";
import type { Tool } from "./Tool";
import { User } from "./User";

interface Collection {
    name: string;
    description: string;
    id: string;
    enabled: boolean;
    public: number;
    create_at: string;
    updated_at: string;
    deleted_at: string;
    keywords: string[];
    datasets: Dataset[];
    team: Team;
    users: User[];
    applications: Application[];
    dur: DataUse[];
    tools: Tool[];
    counter?: number;
    team_id?: number;
}

export type { Collection };
