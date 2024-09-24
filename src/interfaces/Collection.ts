import { DataStatus } from "@/consts/application";
import { Application } from "./Application";
import { DataUse } from "./DataUse";
import { Dataset } from "./Dataset";
import type { Keyword } from "./Keyword";
import { Publication } from "./Publication";
import { Team } from "./Team";
import type { Tool } from "./Tool";
import { User } from "./User";

interface Collection {
    name: string;
    description: string;
    id: string;
    enabled: boolean;
    status: DataStatus;
    public: number;
    create_at: string;
    updated_at: string;
    deleted_at: string;
    keywords: Keyword[] | string[];
    datasets: Dataset[];
    team: Team;
    users: User[];
    applications: Application[];
    dur: DataUse[];
    tools: Tool[];
    publications: Publication[];
    counter?: number;
    team_id?: number;
    image_link: string;
}

export interface CollectionSubmission
    extends Omit<Collection, "publications" | "durs" | "tools" | "datasets"> {
    publications: number[];
    durs: number[];
    tools: number[];
    datasets: number[];
}

export type { Collection };
