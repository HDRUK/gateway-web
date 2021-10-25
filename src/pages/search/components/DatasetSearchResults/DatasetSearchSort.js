import React from 'react';
import SortDropdown from '../SortDropdown';

const DatasetSearchSort = ({ sort, onSort, search, ...outerProps }) => {
	return (
		<SortDropdown
			handleSort={onSort}
			sort={sort === '' ? (search === '' ? 'metadata' : 'relevance') : sort}
			dropdownItems={['relevance', 'popularity', 'metadata', 'latest', 'resources']}
			{...outerProps}
		/>
	);
};

export default DatasetSearchSort;
