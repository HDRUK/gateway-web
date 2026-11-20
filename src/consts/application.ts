export const SITE_NAME = "Health Data Research Gateway";
export enum EntityType {
    COLLECTION = "collection",
    DATASET = "dataset",
    DATA_CUSTODIAN = "dataCustodian",
    DATA_CUSTODIAN_NETWORK = "dataCustodianNetwork",
    DATA_USE = "dataUse",
    TOOL = "tool",
    PUBLICATION = "publication",
    NEWS_ARTICLE = "newsArticle",
    EVENT_ARTICLE = "eventArticle",
}
export const PAGE_TITLE_FALLBACKS = {
    [EntityType.COLLECTION]: "Collection",
    [EntityType.DATA_CUSTODIAN]: "Data Custodian",
    [EntityType.DATA_CUSTODIAN_NETWORK]: "Data Custodian Network",
    [EntityType.DATA_USE]: "Data Use",
    [EntityType.DATASET]: "Dataset",
    [EntityType.PUBLICATION]: "Publication",
    [EntityType.TOOL]: "Tool",
} as const;
export const SITE_DESCRIPTION =
    "The Health Data Research Gateway is a portal enabling researchers and innovators in academia, industry and the NHS to search for and request access to UK health research data.";
export const CONTACT_EMAIL_ADDRESS = "gateway@hdruk.ac.uk";
export const SUPPORT_METADATA_ONBOARDING_URL =
    "https://hdruk.github.io/gateway-2-integrations-testing/";
export const COHORT_DISCOVERY_URL =
    "https://rquest.prod.healthdatagateway.org/";

export enum ApplicationStatus {
    ALL = "all",
    ENABLED = "enabled",
    DISABLED = "disabled",
}

export enum DataStatus {
    ACTIVE = "ACTIVE",
    DRAFT = "DRAFT",
    ARCHIVED = "ARCHIVED",
}
