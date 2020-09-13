import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import { Row, Col, Button, Modal, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';

import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading'
import './Dashboard.scss'; 

import { Event, initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AccountProjects extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        userState: [],
        key: 'active',
        data: [],
        isLoading: true,
        activeCount: 0,
        reviewCount: 0,
        archiveCount: 0,
        rejectedCount: 0
    };

    handleSelect = (key) => {
        this.setState({ key: key });
    }

    componentDidMount() {
        initGA('UA-166025838-1');
        this.doProjectsCall();
    }

    doProjectsCall() {
        this.setState({isLoading: true});
        axios.get(baseURL + '/api/v1/projects/getList')
            .then((res) => {
                this.setState({ data: res.data.data, isLoading: false });

                let activeCount = 0;
                let reviewCount = 0;
                let archiveCount = 0;
                let rejectedCount = 0;
            
                res.data.data.forEach((project) => {
                    if (project.activeflag === "active") activeCount++;
                    else if (project.activeflag === "review") reviewCount++;
                    else if (project.activeflag === "archive") archiveCount++;
                    else if (project.activeflag === "rejected") rejectedCount++;
                    });
            
                this.setState({ activeCount: activeCount});
                this.setState({ reviewCount: reviewCount});
                this.setState({ archiveCount: archiveCount});
                this.setState({ rejectedCount: rejectedCount});
            })
    }

    approveProject = (id) => {
        axios.patch(baseURL + '/api/v1/projects/' + id, {
            activeflag: "active"
        })
        .then((res) => {
            this.doProjectsCall();
            if(shouldChangeTab(this.state)){
                this.setState({key: "active"});
            }
        });
    }

    updateCounters = (data) => {
        let activeCount = 0;
        let reviewCount = 0;
        let archiveCount = 0;
        let rejectedCount = 0;
    
        data.forEach((tool) => {
            if (tool.activeflag === "active") activeCount++;
            else if (tool.activeflag === "review") reviewCount++;
            else if (tool.activeflag === "archive") archiveCount++;
            else if (tool.activeflag === "rejected") rejectedCount++;
        });
    
        this.setState({ activeCount: activeCount});
        this.setState({ reviewCount: reviewCount});
        this.setState({ archiveCount: archiveCount});
        this.setState({ rejectedCount: rejectedCount});
    }

    rejectObject = (id) => {
        axios.patch(baseURL + '/api/v1/projects/'+ id, {
            id: id,
            activeflag: "rejected"
        })
        .then((res) => {
            this.approveProject();
            if(shouldChangeTab(this.state)){
                this.setState({key: "active"});
            }
        });
    }

    deleteObject = (id) => {
        axios.patch(baseURL + '/api/v1/projects/'+ id, {
            id: id,
            activeflag: "archive"
        })
        .then((res) => {
            this.approveProject();
            if(shouldChangeTab(this.state)){
                this.setState({key: "active"});
            }
        });
    }

    render() {
        const { userState, key, isLoading, data, activeCount, reviewCount, archiveCount, rejectedCount } = this.state;

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
            <div>
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Row className="accountHeader">
                            <Col xs={8}>
                                <Row>
                                    <span className="black-20">Projects</span>
                                </Row>
                                <Row>
                                    <span className="gray700-13 ">Manage your existing projects or add new ones</span>
                                </Row>
                            </Col>
                            <Col xs={4} style={{ textAlign: "right" }}>
                                <Button variant="primary" href="/project/add" className="addButton" onClick={() => Event("Buttons", "Click", "Add a new project")} >
                                    + Add a new project
                                </Button>
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
                                            {activeCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Name</Col>
                                                <Col xs={2}>Author</Col>
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {activeCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="projects" /> 
                                            </Row>
                                             : data.map((dat) => {
                                                if (dat.activeflag !== "active") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/project/' + dat.id} className="black-14">{dat.name}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">
                                                                {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                                                    return <span>{person.firstname} {person.lastname} <br /></span>
                                                                })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={'/project/edit/' + dat.id} className="black-14">Edit</Dropdown.Item>
                                                                    <DeleteButton id={dat.id} deleteObject={this.deleteObject}/>
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
                                            {reviewCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Name</Col>
                                                <Col xs={2}>Author</Col>
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {reviewCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="projects" /> 
                                            </Row>
                                             : data.map((dat) => {
                                                if (dat.activeflag !== "review") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/project/' + dat.id} className="black-14">{dat.name}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">
                                                                {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                                                    return <span>{person.firstname} {person.lastname} <br /></span>
                                                                })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                {userState[0].role === 'Admin' ?
                                                                    <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                        <Dropdown.Item href={'/project/edit/' + dat.id} className="black-14">Edit</Dropdown.Item>
                                                                        <Dropdown.Item href='#' onClick={() => this.approveProject(dat.id)} className="black-14">Approve</Dropdown.Item>
                                                                        <RejectButton id={dat.id} rejectObject={this.rejectObject}/>
                                                                    </DropdownButton>
                                                                    : ""}
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}
                                        </div>
                                    );
                                case "rejected":
                                    return (
                                        <div>
                                            {rejectedCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Name</Col>
                                                <Col xs={2}>Author</Col>
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {rejectedCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="projects" /> 
                                            </Row>
                                             : data.map((dat) => {
                                                if (dat.activeflag !== "rejected") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/project/' + dat.id} className="black-14">{dat.name}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">
                                                                {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                                                    return <span>{person.firstname} {person.lastname} <br /></span>
                                                                })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                               
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
                                            {archiveCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Name</Col>
                                                <Col xs={2}>Author</Col>
                                                <Col xs={3}></Col>
                                            </Row> }

                                            {archiveCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="projects" /> 
                                            </Row>
                                             : data.map((dat) => {
                                                if (dat.activeflag !== "archive") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={'/project/' + dat.id} className="black-14">{dat.name}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">
                                                                {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                                                    return <span>{person.firstname} {person.lastname} <br /></span>
                                                                })}
                                                            </Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={'/project/edit/' + dat.id} className="black-14">Edit</Dropdown.Item>
                                                                    <Dropdown.Item href='#' onClick={() => this.approveProject(dat.id)} className="black-14">Approve</Dropdown.Item>
                                                                    <RejectButton id={dat.id} rejectObject={this.rejectObject}/>
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                    default:
                                        return ( null )
                            }
                        })()}
                    </Col>

                    <Col xs={1}></Col>
                </Row>
            </div>
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
            <Dropdown.Item href="#" onClick={handleShow} className="black-14">Reject</Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject this project?</Modal.Title>
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
    const deleteObject = () => props.deleteObject(props.id);

    return (
        <>
            <Dropdown.Item href="#" onClick={handleShow} className="black-14">Archive</Dropdown.Item>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Archive this project?</Modal.Title>
                </Modal.Header>
                <Modal.Body>This project will be archived from the directory.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>No, nevermind</Button>
                    <Button variant="primary" onClick={deleteObject}>Yes, archive</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function shouldChangeTab(state){
    return (state.key === 'pending' && state.reviewCount <= 1) || (state.key === 'archive' && state.archiveCount <= 1)? true : false;
}

export default AccountProjects;