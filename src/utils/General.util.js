import _ from 'lodash';
import removeMd from 'remove-markdown';
import { format } from 'date-fns';
import queryString from 'query-string';

import { DISPLAY_DATE_STANDARD, DISPLAY_TIME_STANDARD } from '../configs/constants';

const trimFirstCharacter = (string, character) => {
    if (string.substring(0, 1) !== character) return string;
    return string.substring(1);
};

const stringifyQueryString = string => {
    return queryString.stringify(string);
};

const parseQueryString = string => {
    return queryString.parse(string);
};

const removeHTMLTags = (text, tags) => {
    if (!text || typeof text !== 'string' || !tags) return '';

    const doc = new DOMParser().parseFromString(text, 'text/html');

    doc.querySelectorAll('*').forEach(elm => {
        if (elm.matches(tags)) {
            elm.remove();
        }
        [...elm.attributes].forEach(attrib => {
            elm.removeAttribute(attrib.name);
        });
    });

    return doc.body.innerHTML.trim();
};

const isEditMode = (url = '') => {
    if (!_.isEmpty(url)) {
        const src = url.toLowerCase();
        if (src.includes('edit')) return true;

        return false;
    }
    return false;
};

const toTitleCase = str => {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

const isPDFLink = link => {
    return /\.pdf$/.test(link);
};

const removeArrayItem = (arr, value) => {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};

const stripMarkdown = (value = '', truncate = 0) => {
    if (!_.isEmpty(value)) {
        if (truncate > 0) {
            value = value.substr(0, 255) + (value.length > 255 ? '...' : '');
        }
        value = removeMd(value);
    }
    return value;
};

const dateFormats = (timestamp, formats = {}) => {
    if (!timestamp) return {};
    const { dateFormat = DISPLAY_DATE_STANDARD, timeFormat = DISPLAY_TIME_STANDARD } = formats;

    const date = new Date(timestamp);

    return {
        dateOnly: format(date, dateFormat),
        timeOnly: format(date, timeFormat),
    };
};

const getParams = querystring => {
    return Object.fromEntries(new URLSearchParams(`${querystring}`));
};

const flattenObject = (data, key) => {
    const flattened = [];

    if (data[key]) {
        data[key].forEach(item => {
            flattened.concat(flattenObject(item, key));
        });
    }

    return flattened;
};

const replaceKey = (data, iteratee) => {
    if (data) {
        const clonedData = [...data];

        data.forEach(item => {
            const clonedItem = { ...item };

            return replaceKey(iteratee(clonedItem), iteratee);
        });

        return clonedData;
    }

    return data;
};

const iterateDeep = (data, iteratee) => {
    const iterate = data => {
        if (Array.isArray(data)) {
            data.forEach(item => {
                if (!Array.isArray(item)) {
                    iteratee(item);
                }

                if (item) iterate(item);
            });
        } else if (typeof data === 'object') {
            Object.keys(data).forEach(key => {
                if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                    iteratee(data[key], key);
                }

                if (data[key]) iterate(data[key]);
            });
        }
    };

    const clonedData = _.cloneDeep(data);

    iterate(clonedData);

    return clonedData;
};

const findAllByKey = (data, iteratee) => {
    const found = [];

    const findDeep = obj => {
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                findDeep(item);
            });
        } else if (obj) {
            Object.keys(obj).forEach(key => {
                if (iteratee(key, obj[key])) {
                    found.push(obj);
                } else if (typeof obj[key] === 'object') {
                    findDeep(obj[key]);
                }
            });
        }
    };

    findDeep(data);

    return found;
};

const filterBranches = (filters, iteratee, children = 'children') => {
    const filteredNodes = [];

    const filter = (filters, parentNode) => {
        if (filters) {
            const data = [...filters];

            data.forEach((item, i) => {
                const foundNodes = findAllByKey(item, (key, value) => {
                    return iteratee(item, key, value);
                });

                if (foundNodes.length) {
                    const foundNode = {
                        ...item,
                        [children]: [],
                    };

                    if (!parentNode) filteredNodes.push(foundNode);
                    else parentNode[children].push(foundNode);

                    if (foundNodes) filter(item[children], foundNode);
                }
            });

            return data;
        }

        return filters;
    };

    filter(filters);

    return filteredNodes;
};

const diffObjects = (a, b) => {
    const compare = {
        ...a,
        ...b,
    };

    const diff = {};

    Object.keys(compare).forEach(key => {
        if (compare[key] !== a[key]) {
            diff[key] = b[key];
        }
    });

    return diff;
};

const stripHtml = text => text.replace(/<\/?.+?>/gi, '');

export {
    iterateDeep,
    replaceKey,
    flattenObject,
    getParams,
    dateFormats,
    stripMarkdown,
    removeArrayItem,
    isPDFLink,
    toTitleCase,
    isEditMode,
    removeHTMLTags,
    findAllByKey,
    filterBranches,
    diffObjects,
    stripHtml,
    parseQueryString,
    stringifyQueryString,
    trimFirstCharacter,
};
