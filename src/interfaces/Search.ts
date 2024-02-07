export interface SearchResult {
    highlight: {
        abstract: string;
        description: string;
    };
    metadata: {
        metadata: {
            summary: {
                abstract: string;
                contactPoint: string;
                controlledKeywords: string;
                datasetType: string;
                description: string;
                doiName: string;
                keywords: string;
                shortTitle: string;
                title: string;
            };
        };
    };
    _source: {
        abstract: string;
        title: string;
        shortTitle: string;
    };
    _id: string;
    _score: string;
}

export interface SearchForm {
    query: string;
    sort: string;
}

export enum SearchCategory {
    COLLECTIONS = "collections",
    DATASETS = "datasets",
    DATA_USE = "dur",
    TOOLS = "tools",
}
