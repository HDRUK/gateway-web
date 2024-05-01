import { Publication } from "./Publication";
import { Tag } from "./Tag";

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
    team?: string;
    programming_languages: string[];
    programming_packages: string[];
    type_category?: string[]; // may need updating?
    publications: Publication[];
}
