const tab_url = '/search?search=&tab=Tools';
export const tool = {
    TAB: 'Tool',
    FEATURES: {
        parentKey: 'toolfeatures',
        filter: 'toolFeaturesSelected',
        tagType: 'tag',
        url: `${tab_url}&toolfeatures=`,
    },
    TOPICS: {
        parentKey: 'tooltopics',
        filter: 'toolTopicsSelected',
        tagType: 'tag',
        url: `${tab_url}&tooltopics=`,
    },
    CATEGORIES: {
        parentKey: 'toolcategories',
        filter: 'toolCategoriesSelected',
        tagType: 'tag',
        url: `${tab_url}&toolcategories=`,
    },
    PL: {
        parentKey: 'toolprogrammingLanguage',
        filter: 'toolProgrammingLanguageSelected',
        tagType: 'version',
        url: `${tab_url}&toolprogrammingLanguage=`,
    },
};
