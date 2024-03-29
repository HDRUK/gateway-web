import { useState } from 'react';
import _ from 'lodash';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './SubmitAmendmentModal.scss';
import googleAnalytics from '../../../../tracking';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'hdruk-react-core';

const SubmitAmendmentModal = ({ open, close, onHandleSubmit }) => {
    const [count, setCount] = useState(0);
    const [formState, setFormState] = useState({ amendDesc: '', invalid: false, invalidMessage: '', submitted: false });

    const onSubmit = e => {
        e.preventDefault();
        setFormState({ ...formState, submitted: true });
        const { amendDesc } = formState;

        const isInvalid = isFormInvalid();

        if (!isInvalid) {
            onHandleSubmit(amendDesc);
            setFormState({ amendDesc: '', invalid: false, invalidMessage: '', submitted: false });
            setCount(0);
            close();
        }
    };

    const handleChange = event => {
        const { name, value } = event.currentTarget;
        setCount(value.length);
        setFormState({
            ...formState,
            [name]: value,
            invalid: value.length > 1500 || _.isEmpty(value),
            invalidMessage:
                value.length > 1500 ? 'Description can not exceed 1500 characters' : _.isEmpty(value) ? 'This cannot be empty' : '',
        });
    };

    const isFormInvalid = () => {
        const { amendDesc } = formState;
        setFormState({
            ...formState,
            submitted: true,
            invalid: amendDesc.length > 1500 || _.isEmpty(amendDesc),
            invalidMessage:
                amendDesc.length > 1500
                    ? 'Description can not exceed 1500 characters'
                    : _.isEmpty(amendDesc)
                    ? 'Description must not be blank'
                    : '',
        });
        return amendDesc.length > 1500 || _.isEmpty(amendDesc);
    };

    return (
        <>
            <Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='amendmentModal'>
                <div className='amendmentModal-header'>
                    <div className='amendmentModal-header--wrap'>
                        <div className='amendmentModal-head'>
                            <span className='black-20-semibold'>Submit amendment</span>
                            <CloseButtonSvg className='amendmentModal-head--close' onClick={() => close()} />
                        </div>
                        <p>
                            Are you sure you want to submit a new version of this application? If yes, please explain the changes you have
                            made and why.
                        </p>
                    </div>
                </div>

                <div className='amendmentModal-body'>
                    <div className='amendmentModal-body--group'>
                        <label htmlFor='amendDesc'>
                            <span className='gray800-14'>Description</span> <span className='gray700-13'>({count}/1500)</span>
                        </label>
                        <TextareaAutosize
                            className={`form-control ${
                                formState.invalid && formState.submitted ? `is-invalid textarea-modal` : 'textarea-modal'
                            }`}
                            name='amendDesc'
                            onChange={handleChange}
                            value={formState.amendDesc}
                            rows='8'
                        />
                        <div className='invalid-feedback'>{formState.invalidMessage}</div>
                    </div>
                </div>

                <div className='amendmentModal-footer'>
                    <div className='amendmentModal-footer--wrap'>
                        <Button variant='secondary' onClick={() => close()}>
                            No, nevermind
                        </Button>
                        <Button
                            onClick={e => {
                                googleAnalytics.recordEvent('Data access request', 'Clicked submit amendment', 'Submitted amendment');
                                onSubmit(e);
                            }}>
                            Submit amendment
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SubmitAmendmentModal;
