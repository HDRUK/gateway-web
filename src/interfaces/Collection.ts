import { DataStatus } from "@/consts/application";
import { Application } from "./Application";
import { DataUse } from "./DataUse";
import { Dataset } from "./Dataset";
import { Publication } from "./Publication";
import { Team } from "./Team";
import type { Tool } from "./Tool";
import { User } from "./User";

interface Collection {
    name: string;
    description: string;
    id: string;
    enabled: boolean;
    status: DataStatus | undefined;
    public: number;
    created_at: string;
    updated_at: string;
    updated_on: string;
    deleted_at: string;
    keywords: string[] | string;
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
    extends Omit<Collection, "publications" | "dur" | "tools" | "datasets"> {
    publications: { id: number }[];
    dur: { id: number }[];
    tools: { id: number }[];
    datasets: { id: number }[];
}

export type { Collection };
