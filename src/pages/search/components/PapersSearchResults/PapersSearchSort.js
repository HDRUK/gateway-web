import React from 'react';
import SortDropdown from '../../../../components/SortDropdown';

const PapersSearchSort = ({ sort, onSort, search, ...outerProps }) => {
    return (
        <SortDropdown
            onSort={onSort}
            defaultValue={search === '' ? 'sortbyyear' : 'relevance'}
            value={sort}
            options={['relevance', 'popularity', 'sortbyyear', 'resources']}
            {...outerProps}
        />
    );
};

export default PapersSearchSort;
