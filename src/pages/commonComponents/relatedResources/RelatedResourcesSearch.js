import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SortDropdown from '../../search/components/SortDropdown';
import SVGIcon from '../../../images/SVGIcon';

const RelatedResourcesSearch = ({ onChange }) => {
	return (
		<Row>
			<Col>
				<span className='collectionsSearchBar form-control'>
					<span className='collectionsSearchIcon'>
						<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
					</span>
					<span>
						<input id='collectionsSearchBarInput' type='text' placeholder='Search within collection' onChange={onChange} />
					</span>
				</span>
			</Col>

			<Col className='text-right'>
				{/*	<SortDropdown
						handleSort={props.handleSort}
						isCollectionsSearch={props.isCollectionsSearch}
						sort={props.sort}
						dropdownItems={props.dropdownItems}
					/> */}
			</Col>
		</Row>
	);
};

export default RelatedResourcesSearch;
