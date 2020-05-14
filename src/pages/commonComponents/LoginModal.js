import React, { useState } from 'react';

import { Row, Col, Image, Button} from 'react-bootstrap';

var baseURL = require('./BaseURL').getURL();

const LoginModal = (props) => {
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
                    <div class="modal-body">
                        <Row className="mt-3">
                            <Col xs={1} md={1} />
                            <Col xs={10} md={10}>
                            <span className="Black-20px">Sign in or create a new account</span>
                            </Col>
                            <Col xs={1} md={1}>
                                <span class="close" onClick={hideLoginModal}>&times;</span>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <span class="Gray800-14px">You can sign in or create a new account using your existing Linkedin, Google or OpenAthens account.</span>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className="mt-3">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <a href={baseURL + '/auth/linkedin'}>
                                        <Image style={{ width: '200px' }} src={require("../../images/Linkedin-default.png")} />
                                    </a>
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className="mt-2">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <a href={baseURL + '/auth/google'}>
                                        <Image style={{ width: '200px' }} src={require("../../images/Google-default.png")} />
                                    </a>
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className="mt-3 mb-3">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <a href={baseURL + '/auth/oidc'} className="openAthensButton">
                                        Sign in with OpenAthens
                  </a>

                                    {/* <div id="wayfinder">Loading...</div> */}
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>
                    </div>

                </div>
            </div>
            :
            <div id="myModalRequest" class="modal">
                <div class="modal-content">
                    <div class="modal-body">
                        <Row className="mt-3">
                            <Col xs={1} md={1} />
                            <Col xs={10} md={10}>
                            <span className="Black-20px">You must be signed in to request access</span>
                            </Col>
                            <Col xs={1} md={1}>
                                <span class="close" onClick={hideLoginModalRequest}>&times;</span>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <span class="Gray800-14px">You can sign in or create a new account using your existing Linkedin, Google or OpenAthens account.</span>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className="mt-3">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <a href={baseURL + '/auth/linkedin'}>
                                        <Image style={{ width: '200px' }} src={require("../../images/Linkedin-default.png")} />
                                    </a>
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className="mt-2">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <a href={baseURL + '/auth/google'}>
                                        <Image style={{ width: '200px' }} src={require("../../images/Google-default.png")} />
                                    </a>
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className="mt-3 mb-3">
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} >
                                <div className="Gray800-14px" style={{ textAlign: 'center' }}>
                                    <a href={baseURL + '/auth/oidc'} className="openAthensButton">
                                        Sign in with OpenAthens
                  </a>

                                    {/* <div id="wayfinder">Loading...</div> */}
                                </div>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

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