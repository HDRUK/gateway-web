import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './MinorVersionBlockedModal.scss';

const MinorVersionBlockedModal = ({ open, close, confirm }) => {
    return (
        <>
            <Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='minorVersionBlockedModal'>
                <div className='minorVersionBlockedModal-header'>
                    <h1 className='black-20-semibold'>Amend application</h1>
                    <CloseButtonSvg className='minorVersionBlockedModal-header--close' onClick={close} />
                </div>
                <div className='minorVersionBlockedModal-body'>
                    This is not the latest application version. Please view the latest version of this application to make a decision.
                </div>
                <div className='minorVersionBlockedModal-footer'>
                    <div className='minorVersionBlockedModal-footer--wrap'>
                        <Button variant='secondary' className='techDetailButton mr-2' onClick={close}>
                            No, nevermind
                        </Button>
                        <Button onClick={confirm}>Go to latest version</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MinorVersionBlockedModal;
