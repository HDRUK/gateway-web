import React from 'react';
import { Row } from 'react-bootstrap';
import './ActionBar.scss';

const ActionBar = props => {
	return props.userState[0].loggedIn || props.showOverride ? (
		<div className='actionBar'>
			<Row className='floatRight'>{props.children}</Row>
		</div>
	) : (
		''
	);
};

export default ActionBar;
