import React from 'react';
import { Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { H1 } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './AccountTeamEmailAlertModal.scss';

const AccountTeamEmailAlertModal = ({ isOpen, onClose, options }) => {
    return (
        <Modal show={isOpen} onHide={onClose} aria-labelledby='contained-modal-title-vcenter' centered className='teamEmailAlertModal'>
            <div className='teamEmailAlertModal-header'>
                <H1>{options.title}</H1>
                <CloseButtonSvg className='teamEmailAlertModal-header--close' onClick={onClose} />
            </div>
            <div className='teamEmailAlertModal-body'>{options.body}</div>
        </Modal>
    );
};

AccountTeamEmailAlertModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.shape({
        body: PropTypes.node.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
};

AccountTeamEmailAlertModal.defaultProps = {
    isOpen: false,
};

export default AccountTeamEmailAlertModal;
