import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './ConfirmSubmissionModal.scss';
import googleAnalytics from '../../../../tracking';

const ConfirmSubmissionModal = ({ open, close, confirm }) => {
    return (
        <>
            <Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='confirmSubmissionModal'>
                <div className='confirmSubmissionModal-header'>
                    <h1 className='black-20-semibold'>Submit application</h1>
                    <CloseButtonSvg className='confirmSubmissionModal-header--close' onClick={close} />
                </div>
                <div className='confirmSubmissionModal-body'>
                    Are you sure you want to submit application? All applicants and contributors will be notified.
                </div>
                <div className='confirmSubmissionModal-footer'>
                    <div className='confirmSubmissionModal-footer--wrap'>
                        <Button variant='secondary' className='techDetailButton mr-2' onClick={close}>
                            No, nevermind
                        </Button>
                        <Button
                            onClick={() => {
                                googleAnalytics.recordEvent('Data access request', 'Clicked submit application', 'Submitted application');
                                confirm();
                            }}>
                            Submit application
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ConfirmSubmissionModal;
