import React, { useState, Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';

import { Row, Col, Button, Modal, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';

import MessageNotFound from '../commonComponents/MessageNotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();

class ReviewTools extends React.Component {
    constructor(props) {
        super(props);
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        data: [],
        userState: [],
        key: 'active',
        isLoading: true,
        activeCount: 0,
        reviewCount: 0,
        archiveCount: 0,
        rejectedCount: 0,
    };

    handleSelect = key => {
        this.setState({ key: key });
    };

    componentDidMount() {
        this.doReviewCall();
    }

    doReviewCall() {
        this.setState({ isLoading: true });
        if (this.state.userState[0].role === 'Admin') {
            axios.get(baseURL + '/api/v1/reviews/admin/pending').then(res => {
                this.setState({ data: res.data.data, isLoading: false });

                let activeCount = 0;
                let reviewCount = 0;
                let archiveCount = 0;
                let rejectedCount = 0;

                res.data.data.forEach(paper => {
                    if (paper.activeflag === 'active') activeCount++;
                    else if (paper.activeflag === 'review') reviewCount++;
                    else if (paper.activeflag === 'archive') archiveCount++;
                    else if (paper.activeflag === 'rejected') rejectedCount++;
                });

                this.setState({ activeCount: activeCount });
                this.setState({ reviewCount: reviewCount });
                this.setState({ archiveCount: archiveCount });
                this.setState({ rejectedCount: rejectedCount });
            });
        } else {
            axios.get(baseURL + '/api/v1/reviews/pending?type=tool&id=' + this.state.userState[0].id).then(res => {
                this.setState({ data: res.data.data, isLoading: false });

                let activeCount = 0;
                let reviewCount = 0;
                let archiveCount = 0;
                let rejectedCount = 0;

                res.data.data.forEach(paper => {
                    if (paper.activeflag === 'active') activeCount++;
                    else if (paper.activeflag === 'review') reviewCount++;
                    else if (paper.activeflag === 'archive') archiveCount++;
                    else if (paper.activeflag === 'rejected') rejectedCount++;
                });

                this.setState({ activeCount: activeCount });
                this.setState({ reviewCount: reviewCount });
                this.setState({ archiveCount: archiveCount });
                this.setState({ rejectedCount: rejectedCount });
            });
        }
    }

    updateCounters = data => {
        let activeCount = 0;
        let reviewCount = 0;
        let archiveCount = 0;
        let rejectedCount = 0;

        data.forEach(review => {
            if (review.activeflag === 'active') activeCount++;
            else if (review.activeflag === 'review') reviewCount++;
            else if (review.activeflag === 'archive') archiveCount++;
            else if (review.activeflag === 'rejected') rejectedCount++;
        });

        this.setState({ activeCount: activeCount });
        this.setState({ reviewCount: reviewCount });
        this.setState({ archiveCount: archiveCount });
        this.setState({ rejectedCount: rejectedCount });
    };

    approveObject = id => {
        axios
            .put(baseURL + '/api/v1/tools/review/approve', {
                id: id,
                activeflag: 'active',
            })
            .then(res => {
                this.doReviewCall();
                if (shouldChangeTab(this.state)) {
                    this.setState({ key: 'active' });
                }
            });
    };

    rejectObject = id => {
        axios
            .put(baseURL + '/api/v1/tools/review/approve', {
                id: id,
                activeflag: 'rejected',
            })
            .then(res => {
                this.doReviewCall();
                if (shouldChangeTab(this.state)) {
                    this.setState({ key: 'active' });
                }
            });
    };

    archiveObject = id => {
        axios
            .put(baseURL + '/api/v1/tools/review/approve', {
                id: id,
                activeflag: 'archive',
            })
            .then(res => {
                this.doReviewCall();
                if (shouldChangeTab(this.state)) {
                    this.setState({ key: 'active' });
                }
            });
    };

    render() {
        const { data, key, isLoading, userState, activeCount, reviewCount, archiveCount, rejectedCount } = this.state;

        if (isLoading) {
            return (
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Loading />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            );
        }

        return (
            <Fragment>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Row className='accountHeader'>
                            <Col xs={8}>
                                <Row>
                                    <span className='black-20'>Reviews</span>
                                </Row>
                                <Row>
                                    <span className='gray700-13 '>View and manage your reviews</span>
                                </Row>
                            </Col>
                            <Col xs={4}></Col>
                        </Row>

                        <Row className='tabsBackground'>
                            <Col sm={12} lg={12}>
                                <Tabs className='dataAccessTabs gray700-13' activeKey={this.state.key} onSelect={this.handleSelect}>
                                    <Tab eventKey='active' title={'Active (' + activeCount + ')'}>
                                        {' '}
                                    </Tab>
                                    <Tab eventKey='pending' title={'Pending approval (' + reviewCount + ')'}>
                                        {' '}
                                    </Tab>
                                    <Tab eventKey='rejected' title={'Rejected (' + rejectedCount + ')'}>
                                        {' '}
                                    </Tab>
                                    <Tab eventKey='archive' title={'Archive (' + archiveCount + ')'}>
                                        {' '}
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>

                        {(() => {
                            switch (key) {
                                case 'active':
                                    return (
                                        <div>
                                            {activeCount <= 0 ? (
                                                ''
                                            ) : (
                                                <Row className='subHeader mt-3 gray800-14-bold'>
                                                    <Col xs={2}>Added</Col>
                                                    <Col xs={5}>Name of review</Col>
                                                    <Col xs={2}>Author of review</Col>
                                                    <Col xs={3}></Col>
                                                </Row>
                                            )}

                                            {activeCount <= 0 ? (
                                                <Row className='margin-right-15'>
                                                    <MessageNotFound word='reviews' />
                                                </Row>
                                            ) : (
                                                data.map(dat => {
                                                    if (dat.activeflag !== 'active') {
                                                        return <></>;
                                                    } else {
                                                        return (
                                                            <Row className='entryBox'>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {moment(dat.createdAt).format('D MMMM YYYY HH:mm')}
                                                                </Col>
                                                                <Col sm={12} lg={5} className='pt-2'>
                                                                    <a href={'/paper/' + dat.id} className='black-14'>
                                                                        {dat.review}
                                                                    </a>
                                                                </Col>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {dat.person[0].firstname} {dat.person[0].lastname}
                                                                </Col>

                                                                <Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
                                                                    <DropdownButton
                                                                        variant='outline-secondary'
                                                                        alignRight
                                                                        title='Actions'
                                                                        className='floatRight'
                                                                    >
                                                                        <ArchiveButton
                                                                            id={dat.reviewID}
                                                                            archiveObject={this.archiveObject}
                                                                        />
                                                                    </DropdownButton>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    }
                                                })
                                            )}
                                        </div>
                                    );
                                case 'pending':
                                    return (
                                        <div>
                                            {reviewCount <= 0 ? (
                                                ''
                                            ) : (
                                                <Row className='subHeader mt-3 gray800-14-bold'>
                                                    <Col xs={2}>Added</Col>
                                                    <Col xs={5}>Name of review</Col>
                                                    <Col xs={2}>Author of review</Col>
                                                    <Col xs={3}></Col>
                                                </Row>
                                            )}

                                            {reviewCount <= 0 ? (
                                                <Row className='margin-right-15'>
                                                    <MessageNotFound word='reviews' />
                                                </Row>
                                            ) : (
                                                data.map(dat => {
                                                    if (dat.activeflag !== 'review') {
                                                        return <></>;
                                                    } else {
                                                        return (
                                                            <Row className='entryBox'>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}
                                                                </Col>
                                                                <Col sm={12} lg={5} className='pt-2'>
                                                                    <a href={'/paper/' + dat.id} className='black-14'>
                                                                        {dat.review}
                                                                    </a>
                                                                </Col>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                        {dat.person[0].firstname} {dat.person[0].lastname}
                                                                    </Col>
                                                                </Col>

                                                                <Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
                                                                    {userState[0].role === 'Admin' ? (
                                                                        <DropdownButton
                                                                            variant='outline-secondary'
                                                                            alignRight
                                                                            title='Actions'
                                                                            className='floatRight'
                                                                        >
                                                                            <ApproveButton
                                                                                id={dat.reviewID}
                                                                                approveObject={this.approveObject}
                                                                            />
                                                                            <RejectButton
                                                                                id={dat.reviewID}
                                                                                rejectObject={this.rejectObject}
                                                                            />
                                                                        </DropdownButton>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                </Col>
                                                            </Row>
                                                        );
                                                    }
                                                })
                                            )}
                                        </div>
                                    );

                                case 'rejected':
                                    return (
                                        <div>
                                            {rejectedCount <= 0 ? (
                                                ''
                                            ) : (
                                                <Row className='subHeader mt-3 gray800-14-bold'>
                                                    <Col xs={2}>Added</Col>
                                                    <Col xs={5}>Name of review</Col>
                                                    <Col xs={2}>Author of review</Col>
                                                    <Col xs={3}></Col>
                                                </Row>
                                            )}

                                            {rejectedCount <= 0 ? (
                                                <Row className='margin-right-15'>
                                                    <MessageNotFound word='reviews' />
                                                </Row>
                                            ) : (
                                                data.map(dat => {
                                                    if (dat.activeflag !== 'rejected') {
                                                        return <></>;
                                                    } else {
                                                        return (
                                                            <Row className='entryBox'>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}
                                                                </Col>
                                                                <Col sm={12} lg={5} className='pt-2'>
                                                                    <a href={'/paper/' + dat.id} className='black-14'>
                                                                        {dat.review}
                                                                    </a>
                                                                </Col>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {dat.person[0].firstname} {dat.person[0].lastname}
                                                                </Col>

                                                                <Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
                                                                    <DropdownButton
                                                                        variant='outline-secondary'
                                                                        alignRight
                                                                        title='Actions'
                                                                        className='floatRight'
                                                                    >
                                                                        <ApproveButton
                                                                            id={dat.reviewID}
                                                                            approveObject={this.approveObject}
                                                                        />
                                                                    </DropdownButton>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    }
                                                })
                                            )}
                                        </div>
                                    );
                                case 'archive':
                                    return (
                                        <div>
                                            {archiveCount <= 0 ? (
                                                ''
                                            ) : (
                                                <Row className='subHeader mt-3 gray800-14-bold'>
                                                    <Col xs={2}>Added</Col>
                                                    <Col xs={5}>Name of review</Col>
                                                    <Col xs={2}>Author of review</Col>
                                                    <Col xs={3}></Col>
                                                </Row>
                                            )}

                                            {archiveCount <= 0 ? (
                                                <Row className='margin-right-15'>
                                                    <MessageNotFound word='reviews' />
                                                </Row>
                                            ) : (
                                                data.map(dat => {
                                                    if (dat.activeflag !== 'archive') {
                                                        return <></>;
                                                    } else {
                                                        return (
                                                            <Row className='entryBox'>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}
                                                                </Col>
                                                                <Col sm={12} lg={5} className='pt-2'>
                                                                    <a href={'/paper/' + dat.id} className='black-14'>
                                                                        {dat.review}
                                                                    </a>
                                                                </Col>
                                                                <Col sm={12} lg={2} className='pt-2 gray800-14'>
                                                                    {dat.person[0].firstname} {dat.person[0].lastname}
                                                                </Col>

                                                                <Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
                                                                    <DropdownButton
                                                                        variant='outline-secondary'
                                                                        alignRight
                                                                        title='Actions'
                                                                        className='floatRight'
                                                                    >
                                                                        <ApproveButton
                                                                            id={dat.reviewID}
                                                                            approveObject={this.approveObject}
                                                                        />
                                                                        <RejectButton id={dat.reviewID} rejectObject={this.rejectObject} />
                                                                    </DropdownButton>
                                                                </Col>
                                                            </Row>
                                                        );
                                                    }
                                                })
                                            )}
                                        </div>
                                    );
                                default:
                                    return key;
                            }
                        })()}
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            </Fragment>
        );
    }
}

function RejectButton(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const rejectObject = () => props.rejectObject(props.id);

    return (
        <>
            <Dropdown.Item href='#' onClick={handleShow} className='black-14'>
                Reject
            </Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject this review?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to reject this review?</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='primary' onClick={rejectObject}>
                        Reject
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function ApproveButton(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const approveObject = () => props.approveObject(props.id);

    return (
        <>
            <Dropdown.Item href='#' onClick={handleShow} className='black-14'>
                Approve
            </Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Approve this review?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Let the person who added this know their review is being approved.</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='primary' onClick={approveObject}>
                        Approve
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function ArchiveButton(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const archiveObject = () => props.archiveObject(props.id);

    return (
        <>
            <Dropdown.Item href='#' onClick={handleShow} className='black-14'>
                Archive
            </Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Archive this review?</Modal.Title>
                </Modal.Header>
                <Modal.Body>This review will be archived.</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='primary' onClick={archiveObject}>
                        Archive
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function shouldChangeTab(state) {
    return (state.key === 'pending' && state.reviewCount <= 1) ||
        (state.key === 'archive' && state.archiveCount <= 1) ||
        (state.key === 'rejected' && state.rejectedCount <= 1)
        ? true
        : false;
}

export default ReviewTools;
