import React from 'react';
import SortDropdown from '../../../../components/SortDropdown';

const DatasetSearchSort = ({ sort, onSort, search, ...outerProps }) => {
    return (
        <SortDropdown
            onSort={onSort}
            defaultValue='latest'
            value={sort}
            options={['relevance', 'popularity', 'metadata', 'latest', 'resources']}
            {...outerProps}
        />
    );
};

export default DatasetSearchSort;
