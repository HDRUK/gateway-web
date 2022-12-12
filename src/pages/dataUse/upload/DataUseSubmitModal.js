import { useMemo } from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import './DataUseSubmitModal.scss';

const DataUseSubmitModal = ({ open, close, confirm, isValid, hasDuplicates, recommendedFieldsMissing }) => {
    const message = useMemo(() => {
        if (hasDuplicates) {
            return {
                title: 'Submit data uses with duplicates',
                description: (
                    <>
                        <p>You cannot submit these data uses for review when they contain duplicate information.</p>
                    </>
                ),
            };
        }
        if (isValid && !recommendedFieldsMissing) {
            return {
                title: 'Submit data uses for review',
                description: (
                    <>
                        <p>Are you sure that you want to submit these data uses for review? </p>
                        <p>You cannot edit these whilst it is pending.</p>
                    </>
                ),
            };
        }
        if (isValid && recommendedFieldsMissing) {
            return {
                title: 'Submit data uses without recommended minimum fields',
                description: (
                    <>
                        <p>
                            There are recommended minimum fields missing in the file you uploaded. Are you sure you want to submit these
                            data uses for admin review?
                        </p>
                        <p>Please note that the recommended minimum fields based on the Alliance’s Data Use Register standard are: </p>
                        <ul>
                            <li>Organisation name</li>
                            <li>Project title</li>
                            <li>Lay summary</li>
                            <li>Public benefit statement</li>
                            <li>Latest approval date</li>
                            <li>Dataset(s) name</li>
                            <li>Access Type</li>
                        </ul>
                    </>
                ),
            };
        }
        if (!isValid) {
            return {
                title: 'Missing required fields',
                description: (
                    <>
                        <p>You cannot submit these data uses for review with the following required fields missing:</p>
                        <ul>
                            <li>Organisation name</li>
                            <li>Project title</li>
                            <li>Dataset(s) name</li>
                        </ul>
                        <p>
                            If the required fields cannot be provided, please raise a support ticket at the following link:{' '}
                            <a className='data-use-link' href='https://hdruk.atlassian.net/servicedesk/customer/portal/1'>
                                https://hdruk.atlassian.net/servicedesk/customer/portal/1
                            </a>
                        </p>
                    </>
                ),
            };
        }
    }, [isValid, hasDuplicates, recommendedFieldsMissing]);

    return (
        <>
            <Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='dataUseSubmitModal'>
                <CloseButtonSvg className='dataUseSubmitModal-close' onClick={close} />
                <div className='dataUseSubmitModal-header'>
                    <h1 className='black-20-semibold'>{message.title}</h1>
                    <div className='dataUseSubmitModal-subtitle'>{message.description}</div>
                </div>
                <div className='dataUseSubmitModal-body'>
                    {isValid && (
                        <div className='dataUseSubmitModal-footer'>
                            <div className='dataUseSubmitModal-footer--wrap'>
                                <Button variant='secondary' className='techDetailButton mr-2' onClick={close}>
                                    No, nevermind
                                </Button>
                                <Button onClick={confirm}>Confirm submission</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default DataUseSubmitModal;
