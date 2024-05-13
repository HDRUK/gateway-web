export type FilterType =
    | "dataset"
    | "collection"
    | "tool"
    | "course"
    | "project"
    | "paper"
    | "dataUseRegister"
    | "dataProvider";

export type FilterKey =
    | "phenotype"
    | "features"
    | "publisher"
    | "damaQualityDimension"
    | "researchEnvironment"
    | "spatial"
    | "typicalAgeRange"
    | "physicalSampleAvailability"
    | "followup"
    | "pathway"
    | "purpose"
    | "source"
    | "collectionSituation"
    | "accrualPeriodicity"
    | "deliveryLeadTime"
    | "jurisdiction"
    | "dataProcessor"
    | "dataController"
    | "vocabularyEncodingScheme"
    | "conformsTo"
    | "language"
    | "format"
    | "keywords"
    | "type"
    | "programmingLanguage"
    | "domain"
    | "startDate"
    | "provider"
    | "location"
    | "studyMode"
    | "award"
    | "entryRequirements"
    | "competencyFramework"
    | "nationalPriorityAreas"
    | "organisationName"
    | "organisationSector"
    | "fundersAndSponsors";

export type DateRange = {
    minYear: string;
    maxYear: string;
};

export interface Bucket {
    doc_count: number;
    key: string;
}

export interface BucketCheckbox {
    value: string;
    label: string;
    count?: number;
}

interface Filter {
    id: number;
    keys: FilterKey;
    enabled: boolean;
    type: FilterType;
    value: string;
    buckets: Bucket[];
}

export type { Filter };
