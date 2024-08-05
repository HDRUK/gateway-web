import { DataStatus } from "@/consts/application";
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
    license: string;
    tech_stack: string;
    user_id: number;
    enabled: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    category_id: number;
    team_id: number;
    associated_authors: string;
    contact_address: string;
    user?: string;
    tag: Tag[];
    team?: Team;
    programming_languages: string[];
    programming_packages: string[];
    type_category?: string[]; // may need updating?
    publications: Publication[];
    dataset_versions: VersionItem[];
    durs: DataUse[];
    collections: Collection[];
    status: DataStatus;
    user_name: string;
}
