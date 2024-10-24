const FILTER_TYPE_MAPPING: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
    collections: "collection",
    data_providers: "dataProvider",
    tools: "tool",
};

const SEARCH_CHAR_LIMIT = 3;

export { FILTER_TYPE_MAPPING, SEARCH_CHAR_LIMIT };
