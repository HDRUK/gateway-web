import React, { useState, Fragment } from 'react';
import _ from 'lodash';
import { Modal } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';

import './ActionModal.scss';

const ActionModal = ({ id, open, close, context, updateApplicationStatus, entityKey, entityIndex, entityCount }) => {
    const [count, setCount] = useState(0);
    const [formState, setFormState] = useState({
        statusDesc: '',
        invalid: false,
        invalidMessage: '',
        submitted: false,
        showActionModal: false,
    });

    const {
        title = '',
        subTitle = 'Let the person who added this know know why their submission is being rejected, especially if there’s anything in particular they should correct before re-submitting.',
        buttons = {
            cancel: {
                label: 'Cancel',
                action: 'cancel',
                class: 'mr-2',
                variant: 'secondary',
            },
            confirmReject: {
                label: 'Reject and send message',
                action: 'confirmRejection',
                class: 'addButton',
                variant: 'primary',
            },
        },
    } = context;

    const onClickAction = (e, action) => {
        e.preventDefault();
        // 1. set form to be submitted
        setFormState({ ...formState, submitted: true });
        // 2. status = { cancel, confirmApprovalConditions, confirmApproval, confirmRejection }
        if (!_.isEmpty(action)) {
            // 3. convert to uppercase better consistency
            const type = action.toUpperCase();
            // 4. deconstruct properties
            const { statusDesc } = formState;
            switch (type) {
                case 'CONFIRMREJECTION':
                    // 5. check state is valid / invalid
                    const isInvalid = isFormInvalid();
                    // 6. is valid pass back to DAR
                    if (!isInvalid) {
                        if (typeof entityKey === 'undefined') {
                            updateApplicationStatus(id, statusDesc);
                        } else {
                            updateApplicationStatus(id, statusDesc, entityKey, entityIndex, entityCount);
                        }
                        setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
                        setCount(0);
                    }
                    break;
                default:
                    setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
                    setCount(0);
                    close();
            }
        }
    };

    const handleChange = event => {
        const { name, value } = event.currentTarget;
        setCount(value.length);
        setFormState({
            ...formState,
            [name]: value,
            invalid: value.length > 1000 || _.isEmpty(value),
            invalidMessage:
                value.length > 1000
                    ? 'Description can not exceed 1000 characters'
                    : _.isEmpty(value)
                    ? 'Description must not be blank'
                    : '',
        });
    };

    const isFormInvalid = () => {
        const { statusDesc } = formState;
        setFormState({
            ...formState,
            submitted: true,
            invalid: statusDesc.length > 1000 || _.isEmpty(statusDesc),
            invalidMessage:
                statusDesc.length > 1000
                    ? 'Description can not exceed 1000 characters'
                    : _.isEmpty(statusDesc)
                    ? 'Description must not be blank'
                    : '',
        });
        return statusDesc.length > 1000 || _.isEmpty(statusDesc);
    };

    return (
        <>
            <Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='actionModal'>
                <div className='actionModal-header'>
                    <div className='actionModal-header--wrap'>
                        <div className='actionModal-head'>
                            <h1 className='black-20-semibold'>{title}</h1>
                            <CloseButtonSvg className='actionModal-head--close' onClick={e => onClickAction(e, 'cancel')} />
                        </div>
                        <p>{subTitle}</p>
                    </div>
                </div>

                <div className='actionModal-body'>
                    <form>
                        <div className='form-group'>
                            <label htmlFor='decription' className='gray800-14'>
                                <span>Description</span> <span>{count}/1000</span>
                            </label>
                            <TextareaAutosize
                                className={`form-control ${
                                    formState.invalid && formState.submitted ? `is-invalid textarea-modal` : 'textarea-modal'
                                }`}
                                name='statusDesc'
                                onChange={handleChange}
                                value={formState.statusDesc}
                                rows='8'
                            />
                            <div className='invalid-feedback'>{formState.invalidMessage}</div>
                        </div>
                    </form>
                </div>

                <div className='actionModal-footer'>
                    <div className='actionModal-footer--wrap'>
                        {Object.keys(buttons).map(key => {
                            return (
                                <Button
                                    variant={buttons[key].variant}
                                    key={buttons[key].action}
                                    className={buttons[key].class}
                                    onClick={e => onClickAction(e, buttons[key].action)}>
                                    {buttons[key].label}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ActionModal;
