import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import './Dashboard.scss';

class TopSearches extends React.Component {
    state = {
        data: '',
    };

    constructor(props) {
        super(props);
        //binding the method to be able to use state
        this.state.data = props.data;
    }

    render() {
        const { data } = this.state;
        return (
            <Fragment>
                <Row className='entryBox' data-test-id='topSearches-search'>
                    <Col sm={5} lg={6} className='gray800-14' style={{ float: 'left', paddingLeft: '0px' }}>
                        <span className='truncate colOneTerm'>
                            {!data || !data._id ? (
                                'search term'
                            ) : (
                                <a
                                    href={'/search?search=' + data._id}
                                    className='searchTermLink truncate'
                                    data-test-id='topSearches-search-term'
                                >
                                    {' '}
                                    {data._id}{' '}
                                </a>
                            )}
                        </span>
                    </Col>
                    <Col sm={2} lg={2} className='gray800-14'>
                        <span style={{ float: 'left' }} data-test-id='topSearches-search-count'>
                            {!data || !data.count ? 'number of searches' : data.count}
                        </span>
                    </Col>
                    <Col sm={5} lg={4} className='gray800-14'>
                        <span style={{ paddingRight: '0px' }} data-test-id='topSearches-search-results'>
                            {(data.datasets || 0) +
                                ' datasets, ' +
                                (data.tools || 0) +
                                ' tools, ' +
                                (data.dataUseRegisters || 0) +
                                ' data uses, ' +
                                (data.courses || 0) +
                                ' courses, ' +
                                (data.papers || 0) +
                                ' papers'}
                        </span>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default TopSearches;
