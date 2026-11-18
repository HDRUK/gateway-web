export const FILTER_TYPE_MAPPING: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
    collections: "collection",
    data_custodians: "dataProvider",
    tools: "tool",
};

export const SEARCH_CHAR_LIMIT = 3;
export const SEARCH_FILTER_CHAR_LIMIT = 25;

export const HDRUK_SOURCE_VALUE = "HDRUK";
export const PARTNERS_SOURCE_VALUE = "partners";

export type DataSource =
    | typeof HDRUK_SOURCE_VALUE
    | typeof PARTNERS_SOURCE_VALUE;

export const isDataSource = (value: unknown): value is DataSource =>
    value === HDRUK_SOURCE_VALUE || value === PARTNERS_SOURCE_VALUE;
