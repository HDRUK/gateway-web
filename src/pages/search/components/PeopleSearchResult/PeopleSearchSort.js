import React from 'react';
import SortDropdown from '../../../../components/SortDropdown';

const PeopleSearchSort = ({ sort, onSort, search, ...outerProps }) => {
    return (
        <SortDropdown
            onSort={onSort}
            defaultValue={search === '' ? 'latest' : 'relevance'}
            value={sort}
            options={['relevance', 'popularity', 'latest', 'resources']}
            {...outerProps}
        />
    );
};

export default PeopleSearchSort;
