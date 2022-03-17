import React from 'react';
import { Modal } from 'react-bootstrap';
import './CommunicateDataCustodianModal.scss';

const CommunicateDataCustodianModal = ({ open, closed }) => {
    const handleClose = action => closed(action);

    return (
        <Modal show={open} onHide={handleClose} className='cdc-modal'>
            <Modal.Header closeButton>
                <Modal.Title>Communicate with the data custodian </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                If you have not done so yet, we recommend contacting the data custodian and making an enquiry to discuss your requirements.
                The earlier you get in touch, the better. The data custodian will advise on next steps, will help you understand the data
                and will provide information on how to complete the data access application form if appropriate.
            </Modal.Body>
            <Modal.Footer>
                <button type='button' className='button-secondary mr-2' onClick={() => handleClose('SUBMIT_APPLICATION')}>
                    Start application
                </button>
                <button type='button' className='btn btn-primary addButton' onClick={() => handleClose('ENQUIRY')}>
                    Make an enquiry
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CommunicateDataCustodianModal;
