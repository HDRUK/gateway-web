import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import DarHelperUtil from '../../../utils/DarHelper.util';
import './DataUseModals.scss';

const DataUseRejectModal = ({ isVisible, toggleModal, onConfirm }) => {
	const [count, setCount] = useState(0);
	const [rejectionReason, setRejectionReason] = useState('');
	const [isValid, setIsValid] = useState(true);
	const rejectionReasonMaxLength = 1500;

	const updateCount = e => {
		setRejectionReason(e.target.value);
		setCount(e.target.value.length);
	};

	useEffect(() => {
		if (count > rejectionReasonMaxLength) {
			setIsValid(false);
		} else setIsValid(true);
	}, [count]);

	return (
		<Modal show={isVisible} onHide={toggleModal} aria-labelledby='contained-modal-title-vcenter' centered className='dataUseRejectModal'>
			<CloseButtonSvg className='dataUseRejectModal-close' onClick={toggleModal} />
			<div className='dataUseRejectModal-header'>
				<h1 className='black-20-semibold mb-2'>Reject this data use?</h1>
				<p>
					Let the person who added this know why their submission is being rejected, especially if there’s anything in particular they
					should correct before re-submitting.
				</p>
			</div>
			<div className='dataUseRejectModal-body'>
				<div className='dataUseRejectModal-body-description'>
					<span>Description</span>{' '}
					<span className='dataUseRejectModal-body-count'>
						({count}/{rejectionReasonMaxLength})
					</span>
				</div>
				<textarea
					className={
						!isValid ? 'dataUseRejectModal-body-rejection  dataUseRejectModal-body-rejection-error' : 'dataUseRejectModal-body-rejection'
					}
					name='rejectionReason'
					onChange={e => updateCount(e)}
					value={rejectionReason}></textarea>

				{!isValid && <div className='dataUseRejectModal-error'>This cannot be longer then {rejectionReasonMaxLength} characters</div>}
				<div className='dataUseRejectModal-footer'>
					<div className='dataUseRejectModal-footer--wrap'>
						<Button variant='white' className='techDetailButton mr-2' onClick={toggleModal}>
							No, nevermind
						</Button>
						<Button
							disabled={!isValid}
							variant='primary'
							className='white-14-semibold'
							onClick={() =>
								onConfirm(DarHelperUtil.dataUseRegisterStatus.INREVIEW, DarHelperUtil.dataUseRegisterStatus.REJECTED, rejectionReason)
							}>
							Reject and send message
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DataUseRejectModal;
