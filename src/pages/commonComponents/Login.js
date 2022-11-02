import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Box, Icon, Message } from 'hdruk-react-core';
import { t } from 'react-i18next';
import LayoutContent from 'components/Layout/LayoutContent';
import LoginSSOButtons from './LoginSSOButtons/index';
import { ReactComponent as TickSvg } from '../../images/tick.svg';
import { ssoBtnsConfig } from '../../configs/ssoBtnsConfig';

import './CommonComponents.scss';

const baseURL = require('./BaseURL').getURL();
const communityLink = require('./BaseURL').getDiscourseURL();

function Login() {
    const [showButtons, setShowButtons] = useState(true);
    const [showWayFinder, setShowWayFinder] = useState();

    const lastChoice = localStorage.getItem('lastChoice');

    const descText = [
        {
            text: t('components.Login.list.description1'),
        },
        {
            text: t('components.Login.list.description2'),
        },
        {
            text: t('components.Login.list.description3'),
        },
    ];

    const handleShowWayFinder = () => {
        setShowButtons(false);
        setShowWayFinder(true);
    };

    const handleHideWayFinder = () => {
        setShowButtons(true);
        setShowWayFinder(false);
    };

    const clickHandler = (id, authURL) => {
        localStorage.setItem('lastChoice', id);

        if (id === 'openAthens') {
            handleShowWayFinder();
        } else {
            window.location.href = `${baseURL}${authURL}`;
        }
    };

    return (
        <Box mb={1}>
            <div>
                <LayoutContent>
                    <Message mt={2}>{t('components.Login.description')}:</Message>
                    {descText.map(value => (
                        <Message mt={2} key={value.text}>
                            <Icon svg={<TickSvg />} /> {value.text}
                        </Message>
                    ))}
                </LayoutContent>

                {showButtons && (
                    <LoginSSOButtons
                        clickHandler={clickHandler}
                        communityLink={communityLink}
                        lastChoice={lastChoice}
                        ssoBtnsConfig={ssoBtnsConfig}
                    />
                )}
            </div>

            {showWayFinder && (
                <div>
                    <Box mt={3} textAlign='center'>
                        <LayoutContent>
                            <a href='javascript:void(0)' onClick={handleHideWayFinder} className='purple-14'>
                                Show all login options
                            </a>
                        </LayoutContent>
                    </Box>
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
                                    <a href={`${baseURL}/auth/oidc`} className='purple-14'>
                                        Click here if login screen does not load
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col sm={1} lg={1} />
                    </Row>
                </div>
            )}
        </Box>
    );
}

export default Login;
