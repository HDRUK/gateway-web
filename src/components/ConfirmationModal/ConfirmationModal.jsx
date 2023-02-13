/** @jsxImportSource @emotion/react */
import propTypes from 'prop-types';
import { Button } from 'hdruk-react-core';
import { Modal } from 'react-bootstrap';
import * as styles from './ConfirmationModal.styles';

const ConfirmationModal = ({ title, isOpen, onClose, onSuccess, successLabel }) => {
    return (
        <Modal css={styles.modal} aria-labelledby='contained-modal-title-vcenter' show={isOpen} onHide={onClose} centered>
            <Modal.Body css={styles.modalBody}>{title}</Modal.Body>
            <Modal.Footer css={styles.modalFooter}>
                <Button variant='secondary' onClick={() => onClose()}>
                    Cancel
                </Button>
                <Button variant='primary' onClick={() => onSuccess()}>
                    {successLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmationModal.propTypes = {
    isOpen: propTypes.bool.isRequired,
    onClose: propTypes.func.isRequired,
    onSuccess: propTypes.func.isRequired,
    title: propTypes.string.isRequired,
    successLabel: propTypes.string,
};

ConfirmationModal.defaultProps = {
    successLabel: 'Confirm',
};

export default ConfirmationModal;
