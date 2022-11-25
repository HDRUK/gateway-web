import { Button, H1, P } from 'hdruk-react-core';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { Link } from '../../components';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './AdvancedSearchRequestAccessModal.scss';

const urlEnv = require('../commonComponents/BaseURL').getURLEnv();

const description = encodeURIComponent(
    'Your Safe People status will be assessed based on your Gateway registered user profile. Please ensure this is complete and up to date before you submit this request and includes your institutional email address and role description.\n\nPlease provide details on why your use of Cohort Discovery has the potential to deliver public benefit.'
);

const AdvancedSearchRequestAccessModal = ({ open, close, userId }) => {
    const redirectToJira = () => {
        window.location.assign(
            `https://hdruk.atlassian.net/servicedesk/customer/portal/1/group/1/create/1?summary=Cohort%20Discovery%20Access%20Request%20|%20UserId:%20${userId}%20|%20Environment:%20${urlEnv}&description=${description}`
        );
    };

    return (
        <>
            <Modal
                show={open}
                onHide={close}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                className='advancedSearchRequestAccessModal'>
                <div className='advancedSearchRequestAccessModal-header'>
                    <div className='advancedSearchRequestAccessModal-header--wrap'>
                        <div className='advancedSearchRequestAccessModal-head'>
                            <H1 className='black-20-semibold'>Access to Cohort Discovery</H1>
                            <CloseButtonSvg className='advancedSearchRequestAccessModal-head--close' onClick={() => close()} />
                        </div>
                        <P mb={2}>
                            In line with the{' '}
                            <Link href={process.env.REACT_APP_FIVE_SAFES_URL} isExternal>
                                Five Safes Framework
                            </Link>
                            , users requesting access to Cohort Discovery must demonstrate their Safe People status either as a researcher,
                            NHS analyst or equivalent. This will be assessed based on your Gateway registered user profile, including
                            institutional email address, role description and ORCID entries.
                        </P>
                        <P mb={2}>
                            If your Safe People status is indeterminate, we will contact you for further information and reserve the right
                            not to provide access.
                        </P>
                        <P>
                            To satisfy a proportionate assessment of 'Safe Project', you will also need to provide information on why you
                            are requesting access, which will be reviewed to ensure there is potential for public benefit. Access, if
                            granted, will be for a period of 6-months after which you will need to renew.
                        </P>
                    </div>
                </div>

                <div className='advancedSearchRequestAccessModal-footer'>
                    <div className='advancedSearchRequestAccessModal-footer--wrap'>
                        <Button variant='secondary' onClick={() => close()}>
                            No, nevermind
                        </Button>
                        <Button data-testid='request-access' onClick={() => redirectToJira()}>
                            Request access
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AdvancedSearchRequestAccessModal;
