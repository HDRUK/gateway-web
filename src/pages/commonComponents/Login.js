import React, { Fragment } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import LoginSSOButtons from './LoginSSOButtons/index';
import './CommonComponents.scss';
import tickSVG from '../../images/tick.svg';
import { ssoBtnsConfig } from '../../configs/ssoBtnsConfig';
var baseURL = require('./BaseURL').getURL();
var communityLink = require('./BaseURL').getDiscourseURL();

function Login() {
    const lastChoice = localStorage.getItem('lastChoice');

    const descText = [
        {
            text: 'Submit data access enquiries and application',
        },
        {
            text: 'Add your own collections, papers and other resources',
        },
        {
            text: 'Use the Cohort Discovery advanced search tool',
        },
    ];
    const showWayFinder = e => {
        document.getElementById('loginWayFinder').style.display = 'block';
        document.getElementById('loginButtons').style.display = 'none';
    };

    const hideWayFinder = e => {
        document.getElementById('loginButtons').style.display = 'block';
        document.getElementById('loginWayFinder').style.display = 'none';
    };

    const clickHandler = (id, authURL) => {
        localStorage.setItem('lastChoice', id);
        return id === 'openAthens' ? showWayFinder() : (window.location.href = `${baseURL}${authURL}`);
    };

    return (
        <div className='mb-1'>
            <div id='loginButtons'>
                <Row className='mt-2'>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <span className='gray800-14'>
                            Anyone can search and view datasets, collections and other resources with or without an account. Creating an
                            account allows you to:
                        </span>
                    </Col>
                    <Col sm={1} lg={1} />
                </Row>
                <Row className='mt-2'>
                    {descText.map((value, i) => (
                        <Fragment key={i}>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className='mt-2'>
                                <span className='gray800-14'>
                                    <img src={tickSVG} width='20' style={{ float: 'left', marginTop: '3px' }} />
                                    &nbsp;{value.text}
                                </span>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Fragment>
                    ))}
                </Row>

                <LoginSSOButtons
                    clickHandler={clickHandler}
                    communityLink={communityLink}
                    lastChoice={lastChoice}
                    ssoBtnsConfig={ssoBtnsConfig}
                />
            </div>

            <div id='loginWayFinder' style={{ display: 'none' }}>
                <Row className='mt-3 text-center'>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <a href='javascript:void(0)' onClick={hideWayFinder} className='purple-14'>
                            Show all login options
                        </a>
                    </Col>
                    <Col sm={1} lg={1} />
                </Row>
                <Row className='mt-4'>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div id='wayfinder'>
                            <div className='gray800-14' style={{ textAlign: 'center' }}>
                                <Image src={require('../../images/Loader.gif')} />
                            </div>
                            <div className='gray800-14' style={{ textAlign: 'center' }}>
                                Loading...
                                <br />
                                <br />
                                <a href={baseURL + '/auth/oidc'} className='purple-14'>
                                    Click here if login screen does not load
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col sm={1} lg={1} />
                </Row>
            </div>
        </div>
    );
}

export default Login;
