import React from 'react';
import { Col, Row } from 'react-bootstrap';

class NotFound extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Row className='entryBox noMargin margin-bottom-16'>
				<Col>
					<div className='gray800-14' style={{ textAlign: 'center' }} data-testid='notFound'>
						{this.props.text ? this.props.text : `No ${this.props.word || 'results'} found`}
					</div>
				</Col>
			</Row>
		);
	}
}

export default NotFound;
