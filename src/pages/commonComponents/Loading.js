import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

const Loading = props => {
    return (
        <Row className='mt-2' {...props}>
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
};

export default Loading;
