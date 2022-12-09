import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import { Box, Icon, Li, Message, P, Ul } from 'hdruk-react-core';
import { useTranslation } from 'react-i18next';
import LayoutContent from 'components/Layout/LayoutContent';
import LoginSSOButtons from './LoginSSOButtons/index';
import { ReactComponent as TickSvg } from '../../images/tick.svg';
import { ssoBtnsConfig } from '../../configs/ssoBtnsConfig';

import './CommonComponents.scss';
import Loading from './Loading';
import { URL_OIDC } from '../../configs/constants';

const baseURL = require('./BaseURL').getURL();
const communityLink = require('./BaseURL').getDiscourseURL();

function Login() {
    const { t } = useTranslation();
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

        if (id === 'openAthens') {
            return showWayFinder();
        }

        window.location.href = `${baseURL}${authURL}`;
    };

    return (
        <Box mb={1}>
            <div id='loginButtons'>
                <LayoutContent>
                    <P mt={2} mb={4} color='grey800'>
                        {t('components.Login.description')}:
                    </P>
                    <Ul mb={6}>
                        {descText.map(({ text }) => (
                            <Li icon={<Icon svg={<TickSvg />} size='xl' />}>{text}</Li>
                        ))}
                    </Ul>
                    <P mb={2} color='grey800'>
                        {t('components.Login.descriptionButtons')}
                    </P>
                </LayoutContent>

                <LoginSSOButtons
                    clickHandler={clickHandler}
                    communityLink={communityLink}
                    lastChoice={lastChoice}
                    ssoBtnsConfig={ssoBtnsConfig}
                />
            </div>

            <div id='loginWayFinder' style={{ display: 'none' }}>
                <Box mt={3} textAlign='center'>
                    <LayoutContent>
                        <a href='javascript:void(0)' onClick={hideWayFinder} className='purple-14'>
                            {t('components.Login.linkLoginOptions')}
                        </a>
                    </LayoutContent>
                </Box>
                <Box mt={3}>
                    <LayoutContent>
                        <div id='wayfinder'>
                            <Loading
                                subText={
                                    <a href={`${baseURL}${URL_OIDC}`} className='purple-14'>
                                        {t('components.Login.notLoading')}
                                    </a>
                                }
                            />
                        </div>
                    </LayoutContent>
                </Box>
            </div>
        </Box>
    );
}

export default Login;
