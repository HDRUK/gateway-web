import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Dashboard.scss';

class TopDatasets extends React.Component {
    render() {
        const {
            data: { name, requests, publisher, pid },
        } = this.props;

        return (
            <Fragment>
                <Row className='resultBox' data-test-id='topDatasets-dataset'>
                    <Col sm={5} lg={6} className='gray800-14 noPadding' style={{ float: 'left', paddingLeft: '0px' }}>
                        <a href={'/dataset/' + pid} data-test-id='topDatasets-dataset-name'>
                            <span className='colOneTerm gray800-14 pointer noPadding'>{name}</span>
                        </a>
                    </Col>
                    <Col sm={4} lg={4} className='gray800-14 noPadding'>
                        <span style={{ float: 'left' }} className='pad-right-0 pad-left-16' data-test-id='topDatasets-dataset-publisher'>
                            {publisher}
                        </span>
                    </Col>
                    <Col sm={3} lg={2} className='gray800-14 noPadding'>
                        <span className='pad-right-0 pad-left-16' data-test-id='topDatasets-dataset-request-count'>
                            {requests}
                        </span>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default TopDatasets;
