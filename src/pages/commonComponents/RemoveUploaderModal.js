import { Button } from 'hdruk-react-core';
import React from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';

import './RemoveUploaderModal.scss';

const RemoveUploaderModal = ({ open, cancelUploaderRemoval, confirmUploaderRemoval, entityType, userState, uploaderToBeRemoved }) => {
    const removingCurrentUser = uploaderToBeRemoved.id === userState[0].id;
    return (
        <>
            <Modal
                show={open}
                onHide={cancelUploaderRemoval}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                className='removeUploaderModal'>
                <div className='removeUploaderModal-header'>
                    <div className='removeUploaderModal-header--wrap'>
                        <div className='removeUploaderModal-head'>
                            <h1 className='black-20-semibold'>
                                {removingCurrentUser ? 'Remove yourself as uploader?' : 'Remove uploader?'}
                            </h1>
                            <CloseButtonSvg className='removeUploaderModal-head--close' onClick={cancelUploaderRemoval} />
                        </div>
                        <div className='gray700-13 new-line'>
                            {removingCurrentUser
                                ? `Are you sure that you want to remove yourself as an uploader on this ${entityType}? \n \n You will no longer be able to edit this ${entityType} \n \n `
                                : `Are you sure that you want to remove ${uploaderToBeRemoved.name} as an uploader on this ${entityType}? \n \n They will no longer be able to edit this ${entityType} \n \n `}
                        </div>
                    </div>
                </div>

                <div className='removeUploaderModal-footer'>
                    <div className='removeUploaderModal-footer--wrap'>
                        <Button variant='secondary' onClick={cancelUploaderRemoval}>
                            No, nevermind
                        </Button>
                        <Button variant='primary' onClick={confirmUploaderRemoval}>
                            Confirm removal
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RemoveUploaderModal;
