import { Button } from 'hdruk-react-core';
import React from 'react';
import { Modal } from 'react-bootstrap';
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
                            <h1 className='black-20-semibold'>How to access the advanced search tool</h1>
                            <CloseButtonSvg className='advancedSearchRequestAccessModal-head--close' onClick={() => close()} />
                        </div>
                        <p>
                            In order to protect patient privacy, we need to verify your identity. To gain access to the advanced search
                            tool, please raise a support ticket. Please make sure you have filled out enough information on your profile
                            otherwise you may be asked to provide more details before being approved. You will receive an email to confirm
                            the approval of your request.
                        </p>
                    </div>
                </div>

                <div className='advancedSearchRequestAccessModal-footer'>
                    <div className='advancedSearchRequestAccessModal-footer--wrap'>
                        <Button variant='secondary' onClick={() => close()}>
                            No, nevermind
                        </Button>
                        <Button data-test-id='request-access' onClick={() => redirectToJira()}>
                            Request access
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AdvancedSearchRequestAccessModal;
