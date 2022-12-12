import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './MissingFieldsModal.scss';

const MissingFieldsModal = ({ open, close }) => {
    return (
        <Fragment>
            <Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='missingFieldsModal'>
                <div className='missingFieldsModal-header'>
                    <h1 className='black-20-semibold'>Mandatory Fields Missing</h1>
                    <CloseButtonSvg className='missingFieldsModal-header--close' onClick={close} />
                </div>
                <div className='missingFieldsModal-body'>
                    You cannot submit this application for review until you have completed all the mandatory questions.
                </div>
            </Modal>
        </Fragment>
    );
};

export default MissingFieldsModal;
