import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';

import './RemoveUploaderModal.scss';

const RemoveUploaderErrorModal = ({ open, cancelUploaderRemoval, entityType, uploaderToBeRemoved, removingOriginalUploader }) => {
    return (
        <Fragment>
            <Modal
                show={open}
                onHide={cancelUploaderRemoval}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                className='removeUploaderModal mt-5'
            >
                <div className='removeUploaderModal-header '>
                    <div className='removeUploaderModal-header--wrap pb-5'>
                        <div className='removeUploaderModal-head'>
                            <h1 className='black-20-semibold'>Remove uploader</h1>
                            <CloseButtonSvg className='removeUploaderModal-head--close' onClick={cancelUploaderRemoval} />
                        </div>
                        <div className='gray700-13 new-line'>
                            {removingOriginalUploader
                                ? `You cannot remove the original uploader of this ${entityType}.`
                                : `You cannot remove ${uploaderToBeRemoved.name} as the uploader of this ${entityType} if there is no other user assigned as an uploader. Please assign another uploader before removing ${uploaderToBeRemoved.name}.`}
                        </div>
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
};

export default RemoveUploaderErrorModal;
