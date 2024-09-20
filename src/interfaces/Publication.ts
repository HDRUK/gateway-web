import { DatasetRelationship } from "@/config/forms/tool";
import type { Tool } from "./Tool";

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
    datasets: DatasetRelationship[];
}

export interface PublicationPayloadSubmission
    extends Omit<PublicationPayload, "tools"> {
    tools: number[];
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
