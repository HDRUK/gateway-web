import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import PropTypes from 'prop-types';

const Loading = props => {
    const { text, subText, timeout } = { ...props };
    const [showSubText, setShowSubText] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setShowSubText(true);
        }, timeout);
    });
    return (
        <Row className='mt-2' {...props}>
            <Col>
                <div className='rectangle'>
                    <div className='gray800-14' style={{ textAlign: 'center' }}>
                        <Image src={require('../../images/Loader.gif')} />
                    </div>
                    <div className='gray800-14' style={{ textAlign: 'center' }}>
                        <p>{text}</p>
                        <p>{showSubText ? subText : ''}</p>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

Loading.propTypes = {
    text: PropTypes.string,
    subText: PropTypes.string,
    timeout: PropTypes.number,
};

Loading.defaultProps = {
    text: 'Loading...',
    subText: '...sorry, this is taking longer than usual',
    timeout: 5000,
};

export default Loading;
