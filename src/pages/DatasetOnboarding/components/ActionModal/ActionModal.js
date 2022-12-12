import React, { useState, Fragment, useRef } from 'react';
import _ from 'lodash';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import TextareaAutosize from 'react-textarea-autosize';

import './ActionModal.scss';

const ActionModal = ({ open, close, context, datasetVersionAction }) => {
    const [count, setCount] = useState(0);
    const [formState, setFormState] = useState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });

    const { title = '', subTitle = '', buttons = {}, description = false, link = '' } = context;

    const btnRef = useRef();

    const isActionSubmit = action => {
        return [
            'CONFIRMNEWVERSION',
            'CONFIRMSUBMISSION',
            'ARCHIVE',
            'UNARCHIVE',
            'CONFIRMAPPROVALCONDITIONS',
            'CONFIRMREJECTION',
            'CONFIRMAPPROVAL',
            'DELETEDRAFT',
        ].includes(action.toUpperCase());
    };

    const onClickAction = (e, action) => {
        e.preventDefault();

        setFormState({ ...formState, submitted: true });

        if (!_.isEmpty(action)) {
            const type = action.toUpperCase();
            const { statusDesc } = formState;

            switch (type) {
                case 'CONFIRMNEWVERSION':
                case 'CONFIRMSUBMISSION':
                case 'ARCHIVE':
                case 'UNARCHIVE':
                    datasetVersionAction({ statusDesc, type });
                    break;
                case 'CONFIRMAPPROVALCONDITIONS':
                case 'CONFIRMREJECTION':
                    const isInvalid = isFormInvalid();

                    if (!isInvalid) {
                        datasetVersionAction({ statusDesc, type });
                        setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
                        setCount(0);
                    }
                    break;
                case 'CONFIRMAPPROVAL':
                    datasetVersionAction({ statusDesc, type });

                    setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
                    setCount(0);
                    break;
                case 'DELETEDRAFT':
                    datasetVersionAction({ type });
                    break;
                case 'DUPLICATE':
                    datasetVersionAction({ statusDesc, type });
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
            invalid: value.length > 1500 || _.isEmpty(value),
            invalidMessage:
                value.length > 1500
                    ? 'Description can not exceed 1500 characters'
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
            invalid: statusDesc.length > 1500 || _.isEmpty(statusDesc),
            invalidMessage:
                statusDesc.length > 1500
                    ? 'Description can not exceed 1500 characters'
                    : _.isEmpty(statusDesc)
                    ? 'Description must not be blank'
                    : '',
        });

        return statusDesc.length > 1500 || _.isEmpty(statusDesc);
    };

    return (
        <Fragment>
            <Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='actionModal'>
                <div className='actionModal-header'>
                    <div className='actionModal-header--wrap'>
                        <div className='actionModal-head'>
                            <h1 className='black-20-semibold'>{title}</h1>
                            <CloseButtonSvg className='actionModal-head--close' onClick={e => onClickAction(e, 'cancel')} />
                        </div>
                        <p>
                            {subTitle}
                            {!_.isEmpty(link) && (
                                <a href={link} target='_blank' rel='noopener noreferrer' class='purple-blue-14'>
                                    {' '}
                                    {link}
                                </a>
                            )}
                        </p>
                    </div>
                </div>

                <div className='actionModal-body'>
                    {description ? (
                        <form>
                            <div className='form-group'>
                                <label htmlFor='decription' className='gray800-14'>
                                    <span>Description</span> <span>{count}/1500</span>
                                </label>
                                <TextareaAutosize
                                    className={`form-control ${
                                        formState.invalid && formState.submitted ? `is-invalid textarea-modal` : 'textarea-modal'
                                    }`}
                                    name='statusDesc'
                                    onChange={handleChange}
                                    value={formState.statusDesc}
                                    rows='8'
                                ></TextareaAutosize>
                                <div className='invalid-feedback'>{formState.invalidMessage}</div>
                            </div>
                        </form>
                    ) : (
                        ''
                    )}
                </div>

                <div className='actionModal-footer'>
                    <div className='actionModal-footer--wrap'>
                        {Object.keys(buttons).map((key, index) => {
                            const isSubmit = isActionSubmit(buttons[key].action);

                            return (
                                <button
                                    ref={btnRef}
                                    key={index}
                                    className={buttons[key].class}
                                    onClick={e => onClickAction(e, buttons[key].action)}
                                    disabled={isSubmit && formState.invalid}
                                >
                                    {buttons[key].label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
};

export default ActionModal;
