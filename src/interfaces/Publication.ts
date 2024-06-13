interface Publication {
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
    url: string;
    pivot: {
        tool_id: number;
        publication_id: number;
    };
}

export type { Publication };
