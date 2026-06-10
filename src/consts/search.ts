export const FILTER_TYPE_MAPPING: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
    collections: "collection",
    data_providers: "dataProvider",
    data_custodians: "dataProvider",
    tools: "tool",
};

export const SEARCH_CHAR_LIMIT = 3;
export const SEARCH_FILTER_CHAR_LIMIT = 25;

export const HDRUK_SOURCE_VALUE = "HDRUK";
export const ARDC_SOURCE_VALUE = "ARDC";

export type DataSource =
    | typeof HDRUK_SOURCE_VALUE
    | typeof ARDC_SOURCE_VALUE;
