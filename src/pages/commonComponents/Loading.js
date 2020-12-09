import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

class Loading extends React.Component {
	render() {
		return (
			<Row className='mt-2'>
				<Col>
					<div className='rectangle'>
						<div className='gray800-14' style={{ textAlign: 'center' }}>
							<Image src={require('../../images/Loader.gif')} />
						</div>
						<div className='gray800-14' style={{ textAlign: 'center' }}>
							Loading...
						</div>
					</div>
				</Col>
			</Row>
		);
	}
}

export default Loading;
