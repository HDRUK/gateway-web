import { DatasetRelationship } from "@/config/forms/tool";
import { DataStatus } from "@/consts/application";
import { Category } from "./Category";
import { Collection } from "./Collection";
import { DataUse } from "./DataUse";
import { VersionItem } from "./Dataset";
import { Publication } from "./Publication";
import { Tag } from "./Tag";
import { Team } from "./Team";

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
    user?: string;
    tag: Tag[];
    team?: Team;
    programming_languages?: Category[];
    programming_packages?: string[];
    type_category?: Category[];
    publications: Publication[];
    dataset_versions: VersionItem[];
    durs: DataUse[];
    collections?: Collection[];
    status?: DataStatus;
    user_name?: string;
    tools: Tool[];
    dataset: DatasetRelationship[];
    any_dataset?: boolean;
    mongo_object_id?: string;
    datasets?: string[];
    mongo_id?: string;
}

export interface ToolPayload {
    id?: number;
    name: string;
    url: string;
    description: string;
    user_id: number;
    enabled: boolean;
    category_id?: number;
    team_id: number;
    associated_authors: string;
    programming_language?: number[];
    type_category?: number[];
    publications: number[];
    durs: number[];
    status?: DataStatus;
    tools: number[];
    dataset: DatasetRelationship[];
    any_dataset?: boolean;
    tag: Tag[];
    dataset_versions: VersionItem[];
}
