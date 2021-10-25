import React from 'react';
import SortDropdown from '../SortDropdown';

const PapersSearchSort = ({ sort, onSort, search, ...outerProps }) => {
	return (
		<SortDropdown
			handleSort={onSort}
			sort={sort === '' ? (search === '' ? 'sortbyyear' : 'relevance') : sort}
			dropdownItems={['relevance', 'popularity', 'sortbyyear', 'resources']}
			{...outerProps}
		/>
	);
};

export default PapersSearchSort;
