import React from 'react';
import { Dropdown, Row, Col } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import '../Search.scss';

const SortDropdown = ({ handleSort, sort, dropdownItems, isCollectionsSearch }) => {
	//by default sorted by relevance
	const sorting = sort === '' ? 'relevance' : sort;

	return (
		<Dropdown className='sorting-dropdown' alignRight onSelect={handleSort}>
			<Dropdown.Toggle
				variant='info'
				id='dropdown-menu-align-right'
				className={isCollectionsSearch ? 'collectionsSorting gray800-14' : 'gray800-14'}>
				{(() => {
					if (sorting === 'popularity') return 'Sort by number of views';
					else if (sorting === 'metadata') return 'Sort by metadata quality';
					else if (sorting === 'resources') return 'Sort by related resources';
					else if (sorting === 'latest') return 'Sort by latest';
					else if (sorting === 'recentlyadded') return 'Sort by recently added';
					else return 'Sort by match to search terms';
				})()}
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{dropdownItems.map(item => {
					return (
						<Row
							className={
								sorting === item ? 'sort-dropdown-item sort-dropdown-item-selected sortingDropdown' : 'sort-dropdown-item sortingDropdown'
							}
							key={item}>
							<Col xs={12} className='p-0'>
								<Dropdown.Item eventKey={item} className='gray800-14'>
									{(() => {
										if (item === 'popularity') return 'Number of views (highest to lowest)';
										else if (item === 'metadata') return 'Metadata quality (platinum to bronze)';
										else if (item === 'resources') return 'Related resources (most first)';
										else if (item === 'latest') return 'Latest (recently updated first)';
										else if (item === 'recentlyadded') return 'Recently added to collection (newest first)';
										else if (item === 'relevance') return 'Match to search terms (closest first)';
									})()}
								</Dropdown.Item>
							</Col>
							<div className='p-0 sortingCheckmark'>
								{sorting === item ? (
									<SVGIcon
										name='check'
										width={20}
										height={20}
										visble='true'
										style={{
											float: 'right',
											fill: '#3db28c',
											marginTop: '5px',
										}}
										fill={'#3db28c'}
										stroke='none'
									/>
								) : null}
							</div>
						</Row>
					);
				})}
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default SortDropdown;
