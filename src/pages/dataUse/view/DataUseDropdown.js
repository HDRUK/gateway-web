import React from 'react';
import { Dropdown, Row, Col } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';

const DataUseDropdown = () => (
	<Dropdown className='sorting-dropdown' alignRight>
		<Dropdown.Toggle variant='info' id='dropdown-menu-align-right' className='gray800-14 datause-dropdown'>
			Show all resources
		</Dropdown.Toggle>
		<Dropdown.Menu>
			<Row className='sort-dropdown-item sortingDropdown'>
				<Col xs={12} className='p-0'>
					<Dropdown.Item eventKey='Show all resources' className='gray800-14'>
						Show all resources
					</Dropdown.Item>
					<Dropdown.Item eventKey='Show datasets' className='gray800-14'>
						Show datasets
					</Dropdown.Item>
					<Dropdown.Item eventKey='Show tools' className='gray800-14'>
						Show tools
					</Dropdown.Item>
					<Dropdown.Item eventKey='Show data uses' className='gray800-14'>
						Show data uses
					</Dropdown.Item>
				</Col>
				<div className='p-0 sortingCheckmark'>
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
				</div>
			</Row>
		</Dropdown.Menu>
	</Dropdown>
);
export default DataUseDropdown;
