import { DatasetRelationship } from "@/config/forms/tool";
import { DataStatus } from "@/consts/application";
import { Category } from "./Category";
import { Collection } from "./Collection";
import { DataUse } from "./DataUse";
import { VersionItem } from "./Dataset";
import type { Publication } from "./Publication";
import { Tag } from "./Tag";
import { Team } from "./Team";
import { User } from "./User";

export interface Tool {
    id: number;
    name: string;
    url: string;
    description: string;
    license?: string;
    tech_stack?: string;
    user_id: number;
    enabled: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    category_id?: number;
    team_id: number;
    associated_authors: string;
    contact_address?: string;
    user?: User;
    tag: Tag[];
    team?: Team;
    programming_languages?: Category[];
    programming_packages?: string[];
    type_category?: Category[];
    publications: Publication[];
    collections: Collection[];
    dataset_versions: VersionItem[];
    durs: DataUse[];
    status?: DataStatus;
    user_name?: string;
    tools: Tool[];
    dataset: DatasetRelationship[];
    any_dataset?: boolean;
    mongo_object_id?: string;
    datasets?: string[];
    mongo_id?: string;
}

export type ReducedTool = Pick<
    Tool,
    "id" | "name" | "created_at" | "user_id" | "user"
>;


export interface ToolPayload {
    id?: number;
    name: string;
    url: string;
    description: string;
    user_id: number;
    enabled: boolean;
    category_id?: number;
    team_id?: number;
    associated_authors: string;
    programming_language?: number[];
    type_category?: number[];
    publications: Publication[];
    durs: DataUse[];
    status?: DataStatus;
    tools: Tool[];
    dataset: DatasetRelationship[];
    any_dataset?: boolean;
    tag: Tag[];
    dataset_versions: VersionItem[];
}

export interface ToolPayloadSubmission
    extends Omit<ToolPayload, "publications" | "durs" | "tools"> {
    publications: number[];
    durs: number[];
    tools: number[];
}
