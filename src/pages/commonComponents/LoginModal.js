import React, { useState, useEffect } from 'react';
import queryString from 'query-string';

import { Row, Col, Image, Button} from 'react-bootstrap';
import Login from './Login';

const LoginModal = (props) => {

    useEffect(() => {
        var values = queryString.parse(window.location.search);
        if(!!values.showLogin) {
            showLoginModal()
        }

    });

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showLoginModal = () => {
        var modalID="myModal"
        if (props.isRequest) {
            modalID="myModalRequest";
        }
        
        document.getElementById(modalID).style.display = "block";
        
        window.onclick = function (event) {
            if (event.target === document.getElementById(modalID)) {
                document.getElementById(modalID).style.display = "none";
            }
        }
    };

    const hideLoginModal = () => {
        document.getElementById("myModal").style.display = "none";
    };

    const hideLoginModalRequest = () => {
        document.getElementById("myModalRequest").style.display = "none";
    };

    return (
        <>
            <a href="" onClick={e => { e.preventDefault(); }}>
                {
                    props.isRequest ?
                        <Button variant="primary" className="AddButton" onClick={showLoginModal}>Request Access</Button>
                    :
                    props.isLanding ?
                        <span className="landingPageAccountText" id="myBtn" onClick={showLoginModal}>Sign in | Sign up</span>
                        :
                        <span className="Purple-14px" id="myBtn" onClick={showLoginModal}>Sign in | Sign up</span>
                }
            </a>
            {
                    !props.isRequest ?
            <div id="myModal" class="modal">
                <div class="modal-content">
                    <div class="modal-body mb-4">
                        <Row className="mt-3">
                            <Col xs={1} md={1} />
                            <Col xs={10} md={10}>
                            <span className="Black-20px">Sign in or create a new account</span>
                            </Col>
                            <Col xs={1} md={1}>
                                <span class="close" onClick={hideLoginModal}>&times;</span>
                            </Col>
                        </Row>

                        <Login />
                    </div>

                </div>
            </div>
            :
            <div id="myModalRequest" class="modal">
                <div class="modal-content">
                    <div class="modal-body mb-4">
                        <Row className="mt-3">
                            <Col xs={1} md={1} />
                            <Col xs={10} md={10}>
                            <span className="Black-20px">You must be signed in to request access</span>
                            </Col>
                            <Col xs={1} md={1}>
                                <span class="close" onClick={hideLoginModalRequest}>&times;</span>
                            </Col>
                        </Row>

                        <Login />
                    
                        <Row className="mt-4 mb-3">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <br />Alternatively, you can contact the data custodian directly.<br /><br />
                                    <strong>Dataset selected:</strong> {props.requestDetails}<br />
                                    <strong>Contact details:</strong> {props.requestContact}
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>
                    </div>

                </div>
            </div>
            }
        </>
    );
}

export default LoginModal;