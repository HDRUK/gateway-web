import React, { useState, Fragment, useRef } from 'react';
import _ from 'lodash';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';

import './ActionModal.scss';

const ActionModal = ({ open, close, context, datasetVersionAction }) => {
	const [count, setCount] = useState(0);
	const [formState, setFormState] = useState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });

	let { title = '', subTitle = '', buttons = {}, description = false, link = '' } = context;

	let btnRef = useRef();

	const onClickAction = (e, action) => {
		if (btnRef.current) {
			btnRef.current.setAttribute('disabled', 'disabled');
		}
		e.preventDefault();
		// 1. set form to be submitted
		setFormState({ ...formState, submitted: true });
		// 2. status = { cancel, confirmApprovalConditions, confirmApproval, confirmRejection }
		if (!_.isEmpty(action)) {
			// 3. convert to uppercase better consistency
			let type = action.toUpperCase();
			// 4. deconstruct properties
			let { statusDesc } = formState;

			switch (type) {
				case 'CONFIRMNEWVERSION':
					datasetVersionAction({ statusDesc, type });
					break;
				case 'CONFIRMSUBMISSION':
					datasetVersionAction({ statusDesc, type });
					break;
				case 'ARCHIVE':
					datasetVersionAction({ statusDesc, type });
					break;
				case 'UNARCHIVE':
					datasetVersionAction({ statusDesc, type });
					break;
				case 'CONFIRMAPPROVALCONDITIONS':
				case 'CONFIRMREJECTION':
					// 5. check state is valid / invalid
					let isInvalid = isFormInvalid();
					// 6. is valid pass back to DAR
					if (!isInvalid) {
						datasetVersionAction({ statusDesc, type });
						setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
						setCount(0);
					}
					break;
				case 'CONFIRMAPPROVAL':
					// 7. send approval to DAR
					datasetVersionAction({ statusDesc, type });
					setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
					setCount(0);
					break;
				case 'DELETEDRAFT':
					datasetVersionAction({ type });
					break;
				default:
					setFormState({ statusDesc: '', invalid: false, invalidMessage: '', submitted: false });
					setCount(0);
					close();
			}
		}
	};

	const handleChange = event => {
		let { name, value } = event.currentTarget;
		setCount(value.length);
		setFormState({
			...formState,
			[name]: value,
			invalid: value.length > 1500 || _.isEmpty(value),
			invalidMessage:
				value.length > 1500 ? 'Description can not exceed 1500 characters' : _.isEmpty(value) ? 'Description must not be blank' : '',
		});
	};

	const isFormInvalid = () => {
		let { statusDesc } = formState;
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
								<a href={link} target='_blank' class='purple-blue-14'>
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
								<textarea
									className={`form-control ${formState.invalid && formState.submitted ? `is-invalid` : ''}`}
									name='statusDesc'
									onChange={handleChange}
									value={formState.statusDesc}
									rows='8'></textarea>
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
							return (
								<button ref={btnRef} key={index} className={buttons[key].class} onClick={e => onClickAction(e, buttons[key].action)}>
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
