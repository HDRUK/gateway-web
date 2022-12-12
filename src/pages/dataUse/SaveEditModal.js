import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SaveEditModal = ({ show, hide, savedEdit }) => (
    <Modal show={show} onHide={hide} className='datause-save-edit-modal'>
        <Modal.Header closeButton className='datause-modal'>
            <h3 className='black-20-semibold'>Save edits</h3>
        </Modal.Header>
        <Modal.Body>
            <p className='gray700-14'>Are you sure that you want to save the edits to this data use? </p>

            <p className='gray700-14'>These will instantly be active and visible on the gateway upon saving.</p>
        </Modal.Body>
        <Modal.Footer>
            <Button className='data-use-no' variant='outline-primary' onClick={hide}>
                No, nevermind
            </Button>
            <Button className='data-use-arch' href={`/account?tab=datause`} onClick={savedEdit}>
                Save
            </Button>
        </Modal.Footer>
    </Modal>
);

export default SaveEditModal;
