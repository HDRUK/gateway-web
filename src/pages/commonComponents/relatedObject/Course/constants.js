const tab_url = '/search?search=&tab=Courses';
export const course = {
    TAB: 'Course',
    AWARDS: {
        parentKey: 'courseaward',
        filter: 'courseaward',
        tagType: 'tag',
        url: `${tab_url}&courseaward=`,
    },
    DOMAINS: {
        parentKey: 'coursedomains',
        filter: 'courseDomainsSelected',
        tagType: 'tag',
        url: `${tab_url}&coursedomains=`,
    },
};
