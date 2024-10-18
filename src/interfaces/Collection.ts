import { DataStatus } from "@/consts/application";
import { Application } from "./Application";
import { DataUse, ReducedDataUse } from "./DataUse";
import { Dataset, ReducedDataset } from "./Dataset";
import { Publication, ReducedPublication } from "./Publication";
import { Team } from "./Team";
import type { ReducedTool, Tool } from "./Tool";
import { User } from "./User";

interface ReducedCollection {
    id: number;
    name: string;
    description: string;
    image_link: string | null;
    tools: ReducedTool[];
    dur: ReducedDataUse[];
    dataset_versions: ReducedDataset[];
    publications: ReducedPublication[];
}

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

export type { Collection, ReducedCollection };
