import React, { useState } from 'react';
import moment from 'moment';

import { Row, Col, Button, Modal, Tabs, Tab, DropdownButton, Dropdown, Collapse } from 'react-bootstrap';

import SVGIcon from "../../images/SVGIcon";
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading'
import { axiosIG } from '../../utils/axios.util';

class ReviewTools extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        data: [],
        userState: [],
        key: 'active',
        isLoading: true
    };

    handleSelect = (key) => {
        this.setState({ key: key });
    }

    componentDidMount() {
        this.doReviewCall();
    }

    doReviewCall() {
        if (this.state.userState[0].role === "Admin") {
            axiosIG.get('/api/v1/reviews/admin/pending')
            .then((res) => {
                this.setState({ data: res.data.data, isLoading: false });
            });
        }
        else {
            axiosIG.get('/api/v1/reviews/pending?type=tool&id=' + this.state.userState[0].id)
            .then((res) => {
                this.setState({ data: res.data.data, isLoading: false });
            });
        }
    }

    render() {
        const { data, key, isLoading, userState } = this.state;
        
        if (isLoading) {
            return (
                <Row className="mt-4">
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Loading />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            );
        }
        
        var activeCount = 0;
        var reviewCount = 0;
        var archiveCount = 0;
        var rejectedCount = 0;

        data.forEach((review) => {
            if (review.activeflag === "active") activeCount++;
            else if (review.activeflag === "review") reviewCount++;
            else if (review.activeflag === "archive") archiveCount++;
            else if (review.activeflag === "rejected") rejectedCount++;
        });

        return (
            <div>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Row className="accountHeader mt-4">
                            <Col xs={8}>
                                <Row>
                                    <span className="black-20">Reviews</span>
                                </Row>
                                <Row>
                                    <span className="gray700-13 ">View and manage your reviews</span>
                                </Row>
                            </Col>
                            <Col xs={4}>
                            </Col>
                        </Row>

                        <Row className="tabsBackground">
                            <Col sm={12} lg={12}>
                                <Tabs className='dataAccessTabs gray700-13' activeKey={this.state.key} onSelect={this.handleSelect}>
                                    <Tab eventKey="active" title={"Active (" + activeCount + ")"}> </Tab>
                                    <Tab eventKey="pending" title={"Pending approval (" + reviewCount + ")"}> </Tab>
                                    <Tab eventKey="rejected" title={"Rejected (" + rejectedCount + ")"}> </Tab>
                                    <Tab eventKey="archive" title={"Archive (" + archiveCount + ")"}> </Tab>
                                </Tabs>
                            </Col>
                        </Row>



                        {(() => {
                            switch (key) {
                                case "active":
                                    return (
                                        <div>
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Added</Col>
                                                <Col xs={5}>Name of reviewed</Col>
                                                <Col xs={2}>Author of review</Col>
                                                <Col xs={3}></Col>
                                            </Row>

                                            {activeCount <= 0 ? <NotFound word="reviews" /> : data.map((dat) => {
                                                
                                                if (dat.activeflag !== "active") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.createdAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/paper/' + dat.id} className="black-14">{dat.review}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{dat.person[0].firstname} {dat.person[0].lastname}</Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={'/editpaper/' + dat.id} className="black-14">Edit</Dropdown.Item>
                                                                    <DeleteButton id={dat.id} />
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                case "pending":
                                    return (
                                        <div>
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Added</Col>
                                                <Col xs={5}>Name of reviewed</Col>
                                                <Col xs={2}>Author of review</Col>
                                                <Col xs={3}></Col>
                                            </Row>

                                            {reviewCount <= 0 ? <NotFound word="reviews" /> : data.map((dat) => {
                                                if (dat.activeflag !== "review") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/paper/' + dat.id} className="black-14">{dat.name}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">
                                                                {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                                                    return <span>{person.firstname} {person.lastname} <br /></span>
                                                                })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                {userState[0].role === 'Admin' ?
                                                                    <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                        <Dropdown.Item href={'/editpaper/' + dat.id} className="black-14">Edit</Dropdown.Item>
                                                                        <Dropdown.Item href='#' onClick={() => this.approvePaper(dat.id)} className="black-14">Approve</Dropdown.Item>
                                                                        <RejectButton id={dat.id} />
                                                                    </DropdownButton>
                                                                    : ""}
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                case "archive":
                                    return (
                                        <div>
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Added</Col>
                                                <Col xs={5}>Name of reviewed</Col>
                                                <Col xs={2}>Author of review</Col>
                                                <Col xs={3}></Col>
                                            </Row>

                                            {archiveCount <= 0 ? <NotFound word="reviews" /> : data.map((dat) => {
                                                if (dat.activeflag !== "archive") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/paper/' + dat.id} className="black-14">{dat.name}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">
                                                                {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                                                    return <span>{person.firstname} {person.lastname} <br /></span>
                                                                })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={'/editpaper/' + dat.id} className="black-14">Edit</Dropdown.Item>
                                                                    <Dropdown.Item href='#' onClick={() => this.approvePaper(dat.id)} className="black-14">Approve</Dropdown.Item>
                                                                    <Dropdown.Item href='#' onClick={() => this.rejectPaper(dat.id)} className="black-14">Reject</Dropdown.Item>
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}
                                        </div>
                                    );
                            }
                        })()}
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            </div>
        );




        return (
            <div>
                <Row className="mt-3">
                    <Col>
                        <span className="black-16 ml-2">Pending approval</span>
                    </Col>
                </Row>

                <Row className="mt-1">
                    <Col lg={12}>
                        <div className="toolsHeader">
                            <Row>
                                <Col xs={4} lg={5} className="pl-4 pt-2 gray800-14-bold">Name</Col>
                                <Col xs={4} lg={2} className="pl-1 pt-2 gray800-14-bold">Author</Col>
                                <Col xs={4} lg={5}></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        {data.length <= 0 ? <NotFound word='reviews' /> : data.map((dat) => {
                            return (<ReviewReview dat={dat} userState={userState[0]} />)
                        })}
                    </Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <span className="black-16 ml-2">Active</span>
                    </Col>
                </Row>

                <Row className="mt-1">
                    <Col lg={12}>
                        <div className="toolsHeader">
                            <Row>
                                <Col xs={4} lg={5} className="pl-4 pt-2 gray800-14-bold">Name</Col>
                                <Col xs={4} lg={2} className="pl-1 pt-2 gray800-14-bold">Author</Col>
                                <Col xs={4} lg={5}></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {/* <Col>
                        {allReviews.length <= 0 ? <NotFound word='reviews' /> : allReviews.map((dat) => {
                            return (<ReviewReviewActive dat={dat} userState={userState[0]} />)
                        })}
                    </Col> */}
                </Row>
            </div>
        );
    }
}

function RejectButton(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const rejectObject = () => {
        axiosIG.patch('/api/v1/tools/'+props.id, {
            id: props.id,
            activeflag: "rejected"
        })
            .then((res) => {
                window.location.href = '/account?tab=papers&paperRejected=true';
            });
    }

    return (
        <>
            <Dropdown.Item href="#" onClick={handleShow} className="black-14">Reject</Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject this paper?</Modal.Title>
                </Modal.Header>
                <Modal.Body>Let the person who added this know know why their submission is being rejected, especially if there’s anything in particular they should correct before re-submitting.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={rejectObject}>Reject and send message</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function DeleteButton(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const deleteObject = () => {
        axiosIG.patch('/api/v1/tools/'+props.id, {
            id: props.id,
            activeflag: "archive"
        })
            .then((res) => {
                window.location.href = '/account?tab=papers&paperDeleted=true';
            });
    }

    return (
        <>
            <Dropdown.Item href="#" onClick={handleShow} className="black-14">Archive</Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Archive this paper?</Modal.Title>
                </Modal.Header>
                <Modal.Body>This paper will be archived from the directory.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>No, nevermind</Button>
                    <Button variant="primary" onClick={deleteObject}>Yes, archive</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}




const ReviewReview = (props) => {
    const [open, setOpen] = useState(false);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var updatedDate = new Date(props.dat.date);
    var updatedOnDate = updatedDate.getDate() + " " + monthNames[updatedDate.getMonth()] + " " + updatedDate.getFullYear();
    
    const rejectReview = (id) => {
        axiosIG.delete('/api/v1/tools/review/reject', {
            data: {
                id: id
            },
        })
        .then((res) => {
            window.location.href = '/account?tab=reviews&reviewRejected=true';
        });
    }

    const approveReview = (id) => {
        axiosIG.post('/api/v1/tools/review/approve', {
            id: id,
            activeflag: "active"
        })
        .then((res) => {
            window.location.href = '/account?tab=reviews&reviewApproved=true';
        });
    }

    return (
        <>
            <div className="rectangle mt-1">
                <Row>
                    <Col sm={12} lg={5} className="pl-2 pt-2 gray800-14-bold"><a href="#" onClick={() => setOpen(!open)} aria-controls="collapse-review" aria-expanded={open} >{props.dat.review}</a></Col>
                    <Col sm={12} lg={2} className="pl-2 pt-2 gray800-14-bold"> {props.dat.person[0].firstname} {props.dat.person[0].lastname} </Col>
                    <Col sm={12} lg={5} className="pl-5 toolsButtons">

                        {props.userState.role === 'Admin' ?
                            <div>
                                <Button variant='white' onClick={() => rejectReview(props.dat.reviewID)} className="accountButton mr-2">
                                    Reject
                                </Button>
                                <Button variant='white' onClick={() => approveReview(props.dat.reviewID)} className="accountButton ">
                                    Approve
                                </Button>
                            </div> : ""}
                    </Col>
                    <Col sm={12}>
                        <Collapse in={open}>
                            <div id="collapse-review">
                                <div className="reviewReviewHolder">
                                    <Row>
                                        <Col xs={2} lg={1} className="iconHolder">
                                            <SVGIcon name="toolicon" width={18} height={18} fill={'#3db28c'} />
                                        </Col>
                                        <Col xs={10} lg={8}>
                                            <p>
                                                <span className="black-16"><a href={'/tool/' + props.dat.tool[0].id} >{props.dat.tool[0].name.substr(0, 75) + (props.dat.tool[0].name.length > 75 ? '...' : '')}</a></span>
                                            </p>
                                        </Col>
                                        <Col xs={12} lg={12}>
                                            <p>
                                                <span className="gray800-14">"{props.dat.tool[0].description}"</span>
                                            </p>
                                        </Col>
                                        <Col xs={12} lg={12}>
                                            <span className="purple-13">{props.dat.person[0].firstname} {props.dat.person[0].lastname}</span><span className="gray700-13"> on {updatedOnDate}</span>
                                            {!props.dat.projectName? '' : <><span className="reviewTitleGap">·</span><span className="gray700-13"> in relation to project </span><span className="purple-13">{props.dat.projectName}</span></>}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Collapse>
                    </Col>
                </Row>
            </div>
        </>
    );
}

const ReviewReviewActive = (props) => {
    const [open, setOpen] = useState(false);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var updatedDate = new Date(props.dat.date);
    var updatedOnDate = updatedDate.getDate() + " " + monthNames[updatedDate.getMonth()] + " " + updatedDate.getFullYear();

    return (
        <>
            <div className="rectangle mt-1">
                <Row>
                    <Col sm={12} lg={5} className="pl-2 pt-2 gray800-14-bold"><a href="#" onClick={() => setOpen(!open)} aria-controls="collapse-review" aria-expanded={open} >{props.dat.review}</a></Col>
                    <Col sm={12} lg={2} className="pl-2 pt-2 gray800-14-bold"> {props.dat.person[0].firstname} {props.dat.person[0].lastname} </Col>
                    <Col sm={12} lg={5} className="pl-5 toolsButtons"></Col>
                    <Col sm={12}>
                        <Collapse in={open}>
                            <div id="collapse-review">
                                <div className="reviewReviewHolder">
                                    <Row>
                                        <Col xs={2} lg={1} className="iconHolder">
                                            <SVGIcon name="toolicon" width={18} height={18} fill={'#3db28c'} />
                                        </Col>
                                        <Col xs={10} lg={8}>
                                            <p>
                                                <span className="black-16"><a href={'/tool/' + props.dat.tool[0].id} >{props.dat.tool[0].name.substr(0, 75) + (props.dat.tool[0].name.length > 75 ? '...' : '')}</a></span>
                                            </p>
                                        </Col>
                                        <Col xs={12} lg={12}>
                                            <p>
                                                <span className="gray800-14">"{props.dat.tool[0].description}"</span>
                                            </p>
                                        </Col>
                                        <Col xs={12} lg={12}>
                                            <span className="purple-13">{props.dat.person[0].firstname} {props.dat.person[0].lastname}</span><span className="gray700-13"> on {updatedOnDate}</span>
                                            {!props.dat.projectName? '' : <><span className="reviewTitleGap">·</span><span className="gray700-13"> in relation to project </span><span className="purple-13">{props.dat.projectName}</span></>}
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Collapse>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default ReviewTools;