import { DatasetRelationship } from "@/config/forms/tool";
import type { DataUse } from "./DataUse";
import type { Tool } from "./Tool";

interface PublicationHasDatasetVersion {
    link_type: string;
    id: number;
    publication_id: number;
    dataset_version_id: number;
}

export interface Publication {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    paper_title: string;
    authors: string;
    year_of_publication: string;
    paper_doi: string;
    publication_type: string;
    journal_name: string;
    abstract: string;
    full_text_url: string;
    url: string;
    status: string;
    pivot: {
        tool_id: number;
        publication_id: number;
    };
    dataset_versions: PublicationHasDatasetVersion[];
}

export interface PublicationPayload {
    id?: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    paper_title: string;
    authors: string;
    year_of_publication: string;
    paper_doi: string;
    publication_type: string;
    journal_name: string;
    abstract: string;
    full_text_url: string;
    url: string;
    status: string;
    pivot: {
        tool_id: number;
        publication_id: number;
    };
    tools: Tool[];
    durs: DataUse[];
    datasets: DatasetRelationship[];
}

export interface PublicationPayloadSubmission
    extends Omit<PublicationPayload, "tools" | "durs"> {
    tools: { id: number }[];
    durs: { id: number }[];
}

export interface EuropePMCPublication {
    title: string;
    authors: string;
    abstract: string;
    is_preprint: boolean;
    journal_name: string;
    publication_year: string;
    doi: string;
}
