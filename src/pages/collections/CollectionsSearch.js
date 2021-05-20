import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import SVGIcon from '../../images/SVGIcon';
import '../commonComponents/searchBar/SearchBar.scss';
import SortDropdown from '../search/components/SortDropdown';

const CollectionsSearch = props => {
	const {} = props;
	const [searchString, setSearchString] = useState('');
    const [searchValue, setSearchValue] = useState('');

	let col1Size = 7;
	let col2Size = 3;
	let collectionsPageSort = '';
	const onSearch = e => {
        setSearchValue(e.target.value);
		if (props.doUpdateCollectionsSearchString) {
			props.doUpdateCollectionsSearchString(e.target.value);
		}
	};

	const handleSort = sort => {};

	if (props.isLoading) {
		return '';
	}

	if (!props.isLoading) {
		return (
			<Row>
				<Col sm={1} lg={1} />
				<Col lg={col1Size}>
					<span className='collectionsSearchBar form-control'>
						<span className='collectionsSearchIcon'>
							<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
						</span>
						<span>
							<input
								id='collectionsSearchBarInput'
								type='text'
								placeholder='Search within collection'
								onChange={onSearch}
								value={searchValue}
								onKeyDown={props.doCollectionsSearchMethod}
							/>
						</span>
					</span>
				</Col>

				<Col lg={col2Size} className='text-right'>
					<SortDropdown
						handleSort={handleSort}
						sort={collectionsPageSort === '' ? (searchString  === '' ?  'relevance' : 'latest') : collectionsPageSort}
						dropdownItems={['relevance', 'popularity', 'latest', 'resources']}
					/>
				</Col>
				<Col sm={1} lg={1} />
			</Row>
		);
	}
};

export default CollectionsSearch;
