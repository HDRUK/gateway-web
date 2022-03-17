import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './AdvancedSearchRequestAccessModal.scss';

const urlEnv = require('../commonComponents/BaseURL').getURLEnv();

const AdvancedSearchRequestAccessModal = ({ open, close, userId }) => {
    const redirectToJira = () => {
        window.location.assign(
            `https://hdruk.atlassian.net/servicedesk/customer/portal/1/group/1/create/1?summary=Cohort%20Discovery%20Access%20Request%20|%20UserId:%20${userId}%20|%20Environment:%20${urlEnv}&description=Please%20provide%20details%20about%20you%20(profile,%20url,%20etc)`
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
                className='advancedSearchRequestAccessModal'
            >
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
                        <button className='button-secondary' onClick={() => close()}>
                            No, nevermind
                        </button>
                        <button data-test-id='request-access' className='button-primary' onClick={() => redirectToJira()}>
                            Request access
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AdvancedSearchRequestAccessModal;
