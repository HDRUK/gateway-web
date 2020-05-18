import React, { useState } from 'react';
import axios from 'axios';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading'

import { Event, initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AccountProjects extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        userState: []
    };

    componentDidMount() {
        initGA('UA-166025838-1');
    }

    render() {
        const { userState } = this.state;

        return (
            <div>
                <Row className="mt-3">
                    <Col xs={5} lg={5}></Col>
                    <Col xs={2} lg={2} style={{ textAlign: "center" }}>
                        <Button variant="primary" href="/addproject" className="AddButton" onClick={() => Event("Buttons", "Click", "Add a new project")} >
                            + Add a new project
                            </Button>
                    </Col>
                    <Col xs={5} lg={5}></Col>
                </Row>

                <Row className="mt-3">
                    <Col>
                        <span className="Black-16px ml-2">Pending approval</span>
                    </Col>
                </Row>

                <Row className="mt-1">
                    <Col lg={12}>
                        <div className="ToolsHeader">
                            <Row>
                                <Col xs={4} lg={5} className="pl-4 pt-2 Gray800-14px-bold">Name</Col>
                                <Col xs={4} lg={2} className="pl-1 pt-2 Gray800-14px-bold">Author</Col>
                                <Col xs={4} lg={5}></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <PendingProjects userState={userState} />

                <Row className="mt-3">
                    <Col>
                        <span className="Black-16px ml-2">Active</span>
                    </Col>
                </Row>

                <Row className="mt-1">
                    <Col lg={12}>
                        <div className="ToolsHeader">
                            <Row>
                                <Col xs={4} lg={5} className="pl-4 pt-2 Gray800-14px-bold">Name</Col>
                                <Col xs={4} lg={2} className="pl-1 pt-2 Gray800-14px-bold">Author</Col>
                                <Col xs={4} lg={5}></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <ActiveProjects userState={userState} />

                <Row className="mt-3">
                    <Col>
                        <span className="Black-16px ml-2">Archive</span>
                    </Col>
                </Row>

                <Row className="mt-1">
                    <Col lg={12}>
                        <div className="ToolsHeader">
                            <Row>
                                <Col xs={4} lg={5} className="pl-4 pt-2 Gray800-14px-bold">Name</Col>
                                <Col xs={4} lg={2} className="pl-1 pt-2 Gray800-14px-bold">Author</Col>
                                <Col xs={4} lg={5}></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>

                <ArchiveProjects userState={userState} />
            </div>
        );
    }
}

class PendingProjects extends React.Component {
    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        data: [],
        userState: [],
        isLoading: true
    };

    componentDidMount() {
        this.doSearchCall();
    }

    doSearchCall() {
        if (this.state.userState[0].role === "Admin") {
            axios.get(baseURL + '/api/v1/accounts/admin?type=project&toolState=review')
                .then((res) => {
                    this.setState({ data: res.data.data, isLoading: false });
                });
        }
        else {
            axios.get(baseURL + '/api/v1/accounts?type=project&id=' + this.state.userState[0].id + '&toolState=review')
                .then((res) => {
                    this.setState({ data: res.data.data, isLoading: false });
                });
        }
    }

    rejectTool = (id) => {
        axios.put(baseURL + '/api/v1/accounts/status', {
            id: id,
            activeflag: "archive"
        })
            .then((res) => {
                window.location.href = '/account?tab=projects&projectRejected=true';
            });
    }

    approveTool = (id) => {
        axios.put(baseURL + '/api/v1/accounts/status', {
            id: id,
            activeflag: "active"
        })
            .then((res) => {
                window.location.href = '/account?tab=projects&projectApproved=true';
            });
    }


    render() {
        const { data, isLoading, userState } = this.state;

        if (isLoading) {
            return <Loading />;
        }
        return (
            <Row>
                <Col>
                    {data.length <= 0 ? <NotFound word='projects' /> : data.map((dat) => {
                        return (<a /* href={'/tool/'+dat.id} */>
                            <div className="Rectangle mt-1">
                                <Row>
                                    <Col sm={12} lg={5} className="pl-2 pt-2 Gray800-14px-bold"><a href={'/project/' + dat.id} >{dat.name}</a></Col>
                                    <Col sm={12} lg={2} className="pl-2 pt-2 Gray800-14px-bold">
                                        {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                            return <span>{person.firstname} {person.lastname} <br /></span>
                                        })}
                                    </Col>
                                    <Col sm={12} lg={5} className="pl-5 toolsButtons">
                                        {userState[0].role === 'Admin' ?
                                            <div>
                                                <Button variant='white' href={'/editproject/' + dat.id} className="AccountButtons mr-2">
                                                    Edit
                            </Button>
                                                <Button variant='white' onClick={() => this.rejectTool(dat.id)} className="AccountButtons mr-2">
                                                    Reject
                            </Button>
                                                <Button variant='white' onClick={() => this.approveTool(dat.id)} className="AccountButtons ">
                                                    Approve
                            </Button>
                                            </div> : ""}
                                    </Col>
                                </Row>
                            </div>
                        </a>)
                    })}
                </Col>
            </Row>
        );
    }
}

class ActiveProjects extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        data: [],
        userState: [],
        isLoading: true
    };

    componentDidMount() {
        this.doSearchCall();
    }

    doSearchCall() {

        if (this.state.userState[0].role === "Admin") {
            axios.get(baseURL + '/api/v1/accounts/admin?type=project&toolState=active')
                .then((res) => {
                    this.setState({ data: res.data.data, isLoading: false });
                });
        }
        else {
            axios.get(baseURL + '/api/v1/accounts?type=project&id=' + this.state.userState[0].id + '&toolState=active')
                .then((res) => {
                    this.setState({ data: res.data.data, isLoading: false });
                });
        }
    }

    render() {
        const { data, isLoading } = this.state;


        if (isLoading) {
            return <Loading />;
        }

        return (
            <Row className="mt-1">
                <Col>
                    {data.length <= 0 ? <NotFound word="projects" /> : data.map((dat) => {
                        return (<div className="Rectangle mt-1">
                            <Row>
                                <Col sm={12} lg={5} className="pl-2 pt-2 Gray800-14px-bold"><a href={'/project/' + dat.id} >{dat.name}</a></Col>
                                <Col sm={12} lg={2} className="pl-2 pt-2 Gray800-14px-bold">
                                    {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                        return <span>{person.firstname} {person.lastname} <br /></span>
                                    })}
                                </Col>


                                <Col sm={12} lg={5} className="pl-5 toolsButtons">
                                    <DeleteButton id={dat.id} />
                                    <Button variant='white' href={'/editproject/' + dat.id} className="AccountButtons" >
                                        Edit
                            </Button>
                                </Col>
                            </Row>
                        </div>)
                    })}
                </Col>
            </Row>
        );
    }
}

function DeleteButton(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const deleteObject = () => {
        axios.put(baseURL + '/api/v1/accounts/status', {
            id: props.id,
            activeflag: "archive"
        })
            .then((res) => {
                window.location.href = '/account?tab=projects&projectDeleted=true';
            });
    }

    return (
        <>
            <Button variant="light" id="ArchiveButton" className="mr-2" onClick={handleShow}>
                Archive
        </Button>

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

class ArchiveProjects extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
    }

    // initialize our state
    state = {
        data: [],
        userState: [],
        isLoading: true
    };

    componentDidMount() {
        this.doSearchCall();
    }

    doSearchCall() {

        if (this.state.userState[0].role === "Admin") {
            axios.get(baseURL + '/api/v1/accounts/admin?type=project&toolState=archive')
                .then((res) => {
                    this.setState({ data: res.data.data, isLoading: false });
                });
        }
        else {
            axios.get(baseURL + '/api/v1/accounts?type=project&id=' + this.state.userState[0].id + '&toolState=archive')
                .then((res) => {
                    this.setState({ data: res.data.data, isLoading: false });
                });
        }
    }

    approveTool = (id) => {
        axios.put(baseURL + '/api/v1/accounts/status', {
            id: id,
            activeflag: "active"
        })
            .then((res) => {
                window.location.href = '/account?tab=projects&projectApproved=true';
            });
    }

    render() {
        const { data, isLoading } = this.state;


        if (isLoading) {
            return <Loading />;
        }

        return (
            <Row className="mt-1">
                <Col>
                    {data.length <= 0 ? <NotFound word="projects" /> : data.map((dat) => {
                        return (<div className="Rectangle mt-1">
                            <Row>
                                <Col sm={12} lg={5} className="pl-2 pt-2 Gray800-14px-bold"><a href={'/project/' + dat.id} >{dat.name}</a></Col>
                                <Col sm={12} lg={2} className="pl-2 pt-2 Gray800-14px-bold">
                                    {dat.persons <= 0 ? 'Author not listed' : dat.persons.map((person) => {
                                        return <span>{person.firstname} {person.lastname} <br /></span>
                                    })}
                                </Col>


                                <Col sm={12} lg={5} className="pl-5 toolsButtons">
                                    <Button variant="light" className="mr-2" onClick={() => this.approveTool(dat.id)}>
                                        Unarchive
                                    </Button>
                                    <Button variant='white' href={'/editproject/' + dat.id} className="AccountButtons" >
                                                Edit
                                    </Button>
                                </Col>
                            </Row>
                        </div>)
                    })}
                </Col>
            </Row>
        );
    }
}


export default AccountProjects;