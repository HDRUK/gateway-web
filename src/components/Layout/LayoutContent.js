import React from 'react';
import { Col, Row } from 'react-bootstrap';

const LayoutContent = ({ children, ...outerProps }) => (
	<Row {...outerProps} className='ui-LayoutContent'>
		<Col xs={1} className='ui-LayoutContent--left'></Col>
		<Col xs={10} className='ui-LayoutContent--content'>
			{children}
		</Col>
		<Col xs={1} className='ui-LayoutContent--right'></Col>
	</Row>
);

export default LayoutContent;
