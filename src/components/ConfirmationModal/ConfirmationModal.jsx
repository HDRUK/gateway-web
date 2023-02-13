/** @jsxImportSource @emotion/react */
import propTypes from 'prop-types';
import { Button } from 'hdruk-react-core';
import { Modal } from 'react-bootstrap';
import * as styles from './ConfirmationModal.styles';

const ConfirmationModal = ({ title, isOpen, onClose, onRemove }) => {
    return (
        <Modal css={styles.modal} aria-labelledby='contained-modal-title-vcenter' show={isOpen} onHide={onClose} centered>
            <Modal.Body css={styles.modalBody}>{title}</Modal.Body>
            <Modal.Footer css={styles.modalFooter}>
                <Button variant='secondary' onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button variant='primary' onClick={() => onRemove()}>
                    Remove
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmationModal.propTypes = {
    isOpen: propTypes.bool.isRequired,
    onClose: propTypes.func.isRequired,
    onRemove: propTypes.func.isRequired,
    title: propTypes.string.isRequired,
};

export default ConfirmationModal;
