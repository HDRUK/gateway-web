import React, { Fragment, useEffect } from 'react';
import queryString from 'query-string';
import { Row, Col } from 'react-bootstrap';
import Login from './Login';

const LoginModal = props => {
    useEffect(() => {
        var values = queryString.parse(window.location.search);
        if (!!values.showLogin && values.showLogin === 'true') {
            document.getElementById('myModal').style.display = 'block';
            document.getElementById('loginWayFinder').style.display = 'none';
            document.getElementById('loginButtons').style.display = 'block';
            document.getElementById('loginModalTitle').innerHTML = 'Sign in or create a new account';
            document.getElementById('modalRequestSection').style.display = 'none';
            document.body.classList.add('modal-open');

            window.onclick = function (event) {
                if (event.target === document.getElementById('myModal')) {
                    document.getElementById('myModal').style.display = 'none';
                }
            };
        }
    });

    const hideLoginModal = () => {
        document.body.classList.remove('modal-open');

        document.getElementById('myModal').style.display = 'none';
    };

    return (
        <Fragment>
            <div id='myModal' className='modal login-modal' data-test-id='mdlLogin'>
                <div className='modal-dialog modal-dialog-centered modal-lg' role='document'>
                    <div className='modal-content'>
                        <div className='modal-body mb-4'>
                            <Row className='mt-3'>
                                <Col xs={1} md={1} />
                                <Col xs={10} md={10}>
                                    <span className='black-20'>
                                        <span id='loginModalTitle'>Sign in or create a new account</span>
                                    </span>
                                </Col>
                                <Col xs={1} md={1}>
                                    <span className='close' onClick={hideLoginModal}>
                                        &times;
                                    </span>
                                </Col>
                            </Row>

                            <Login />

                            <div id='modalRequestSection'>
                                <Row className='mb-3'>
                                    <Col sm={1} lg={1} />
                                    <Col sm={10} lg={10}>
                                        <div className='gray800-14' style={{ textAlign: 'center' }}>
                                            <br />
                                            <strong>Dataset selected:</strong> <span id='modalRequestDetails'>{props.requestDetails}</span>
                                            <br />
                                        </div>
                                    </Col>
                                    <Col sm={1} lg={1} />
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default LoginModal;
