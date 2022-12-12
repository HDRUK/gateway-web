const tab_url = '/search?search=&tab=Paper';
export const paper = {
    TAB: 'Paper',
    FEATURES: {
        parentKey: 'paperfeatures',
        filter: 'paperFeaturesSelected',
        tagType: 'tag',
        url: `${tab_url}&paperfeatures=`,
    },
    TOPICS: {
        parentKey: 'papertopics',
        filter: 'paperTopicsSelected',
        tagType: 'tag',
        url: `${tab_url}&papertopics=`,
    },
};
