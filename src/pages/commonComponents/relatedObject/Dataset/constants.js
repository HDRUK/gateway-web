const tab_url = '/search?search=&tab=Datasets';
export const dataset = {
    TAB: 'Dataset',
    PHENOTYPES: {
        parentKey: 'phenotypes',
        filter: 'phenotypes',
        tagType: 'phenotype',
        url: `${tab_url}&phenotypes=`,
    },
    FEATURES: {
        parentKey: 'datasetfeatures',
        filter: 'datasetfeatures',
        tagType: 'tag',
        url: `${tab_url}&datasetfeatures=`,
    },
};
