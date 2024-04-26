interface Collection {
    _id: string;
    _explanation: string[];
    _score: number;
    _source: {
        name: string;
        datasetAbstracts: string[];
        datasetTitles: string[];
        description: string;
        keywords: string[];
        publisherName: string;
    };
}

export type { Collection };
