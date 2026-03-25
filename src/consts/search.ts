const FILTER_TYPE_MAPPING: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
    collections: "collection",
    data_providers: "dataProvider",
    data_custodians: "dataProvider",
    tools: "tool",
};

const SEARCH_CHAR_LIMIT = 3;
const SEARCH_FILTER_CHAR_LIMIT = 25;

export { FILTER_TYPE_MAPPING, SEARCH_CHAR_LIMIT, SEARCH_FILTER_CHAR_LIMIT };
