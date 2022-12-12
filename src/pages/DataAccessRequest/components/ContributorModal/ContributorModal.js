import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import SLA from '../../../commonComponents/sla/SLA';
import googleAnalytics from '../../../../tracking';

import './ContributorModal.scss';

const ContributorModal = ({ open, close, mainApplicant, children, handleOnSaveChanges }) => {
    const onSaveChanges = () => {
        googleAnalytics.recordEvent('Data access request', 'Clicked save changes', 'Updated application contributors');
        handleOnSaveChanges();
        close();
    };

    return (
        <>
            <Modal
                show={open}
                onHide={close}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                className='contributorModal'>
                <div className='contributorModal-header'>
                    <div className='contributorModal-header--wrap'>
                        <div className='contributorModal-head'>
                            <h1 className='black-20-semibold'>Add contributors to this application</h1>
                            <CloseButtonSvg className='contributorModal-head--close' onClick={() => close()} />
                        </div>
                        <p>Anyone added will be able to edit questions, invite others and submit the application</p>
                    </div>
                </div>

                <div className='contributorModal-body'>
                    <div className='contributorModal-body--group'>
                        <label className='gray800-14'>Owner</label>
                        <div className='gray700-13'>Only you have permission to withdraw the application</div>
                        <div className='owner'>
                            <SLA classProperty='white' text={mainApplicant} />
                        </div>
                    </div>
                    <div className='contributorModal-body--group'>
                        <label className='gray800-14'>Contributors</label>
                        <div className='gray700-13'>They must have an account in the gateway</div>
                        <div className='contributors'>{children}</div>
                    </div>
                </div>

                <div className='contributorModal-footer'>
                    <div className='contributorModal-footer--wrap'>
                        <Button variant='secondary' onClick={() => close()}>
                            Cancel
                        </Button>
                        <Button onClick={() => onSaveChanges()}>Save changes</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ContributorModal;
