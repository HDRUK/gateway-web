import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import DarHelperUtil from '../../../utils/DarHelper.util';
import './DataUseModals.scss';

const DataUseApproveModal = ({ isVisible, toggleModal, onConfirm }) => {
    return (
        <Modal
            show={isVisible}
            onHide={toggleModal}
            aria-labelledby='contained-modal-title-vcenter'
            centered
            className='dataUseApproveModal'
        >
            <CloseButtonSvg className='dataUseApproveModal-close' onClick={toggleModal} />
            <div className='dataUseApproveModal-header'>
                <h1 className='black-20-semibold mb-2'>Approve this data use?</h1>
                <p>Are you sure that you want to approve this data use? It will instantly be active and visible on the gateway.</p>
            </div>
            <div className='dataUseApproveModal-body'>
                <div className='dataUseApproveModal-footer'>
                    <div className='dataUseApproveModal-footer--wrap'>
                        <Button variant='white' className='techDetailButton mr-2' onClick={toggleModal}>
                            No, nevermind
                        </Button>
                        <Button
                            variant='primary'
                            className='white-14-semibold'
                            onClick={() =>
                                onConfirm(DarHelperUtil.dataUseRegisterStatus.INREVIEW, DarHelperUtil.dataUseRegisterStatus.ACTIVE)
                            }
                        >
                            Approve
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DataUseApproveModal;
