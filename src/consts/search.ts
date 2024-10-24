const FILTER_TYPE_MAPPING: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
    collections: "collection",
    data_providers: "dataProvider",
    tools: "tool",
};

const DEBOUNCE_SEARCH_LIMIT = 3;

export { FILTER_TYPE_MAPPING, DEBOUNCE_SEARCH_LIMIT };
