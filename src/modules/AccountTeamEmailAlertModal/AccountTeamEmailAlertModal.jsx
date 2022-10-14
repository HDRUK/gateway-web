import React from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './AccountTeamEmailAlertModal.scss';

const AccountTeamEmailAlertModal = ({ open, close, options }) => {
    return (
        <>
            <Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='teamEmailAlertModal'>
                <div className='teamEmailAlertModal-header'>
                    <h1 className='black-20-semibold'>{options.title}</h1>
                    <CloseButtonSvg className='teamEmailAlertModal-header--close' onClick={close} />
                </div>
                <div className='teamEmailAlertModal-body'>{options.body}</div>
            </Modal>
        </>
    );
};

export default AccountTeamEmailAlertModal;
