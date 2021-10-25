import React from 'react';
import SortDropdown from '../SortDropdown';

const CollectionsSearchSort = ({ sort, onSort, search, ...outerProps }) => {
	return (
		<SortDropdown
			handleSort={onSort}
			sort={sort === '' ? (search === '' ? 'latest' : 'relevance') : sort}
			dropdownItems={['relevance', 'popularity', 'latest', 'resources']}
			{...outerProps}
		/>
	);
};

export default CollectionsSearchSort;
