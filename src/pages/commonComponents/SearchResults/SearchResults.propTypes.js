import PropTypes from 'prop-types';

export const PROP_TYPES_SEARCH_RESULTS_TYPE = PropTypes.oneOf(['dataset', 'tool', 'project', 'paper', 'person', 'course', 'collection']);

export const PROP_TYPES_SEARCH_RESULTS = {
    results: PropTypes.func,
    type: PROP_TYPES_SEARCH_RESULTS_TYPE.isRequired,
    count: PropTypes.number,
    search: PropTypes.string,
    data: PropTypes.array.isRequired,
    sort: PropTypes.node,
    pageNumber: PropTypes.number,
    onPagination: PropTypes.func,
    maxResults: PropTypes.number,
    updateOnFilterBadge: PropTypes.func,
    isLoading: PropTypes.bool,
    totalPages: PropTypes.number,
};

export const DEFAULT_PROPS_SEARCH_RESULTS = {
    count: 0,
    search: '',
    pageNumber: 1,
    maxResults: 40,
    totalPages: 0,
};
