/** @jsx jsx */
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import * as styles from './AlertModal.styles';

const AlertModal = ({ header, body, footer, ...outerProps }) => {
    return (
        <Modal {...outerProps} aria-labelledby='contained-modal-title-vcenter' centered>
            <Modal.Header>
                <Modal.Title id='contained-modal-title-vcenter' data-testid='modal-header'>
                    {header}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body css={styles.modalBody} className='gray800-14' data-testid='modal-body'>
                {body}
            </Modal.Body>
            <Modal.Footer css={styles.modalFooter} data-testid='modal-footer'>
                {footer}
            </Modal.Footer>
        </Modal>
    );
};

AlertModal.propTypes = {
    onHide: PropTypes.func,
    show: PropTypes.bool,
    variant: PropTypes.oneOf(['error', 'success', 'info', 'warning']),
    header: PropTypes.node,
    body: PropTypes.node,
    footer: PropTypes.node,
};

AlertModal.defaultProps = {
    show: false,
};

export default AlertModal;
