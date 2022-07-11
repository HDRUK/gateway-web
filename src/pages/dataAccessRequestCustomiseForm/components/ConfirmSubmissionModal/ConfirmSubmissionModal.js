import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './ConfirmSubmissionModal.scss';
import googleAnalytics from '../../../../tracking';

const ConfirmSubmissionModal = ({ open, close, confirm }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='confirmSubmissionModal'>
				<div className='confirmSubmissionModal-header'>
					<h1 className='black-20-semibold'>Submit application</h1>
					<CloseButtonSvg className='confirmSubmissionModal-header--close' onClick={close} />
				</div>
				<div className='confirmSubmissionModal-body'>
					Are you sure you want to submit application? All applicants and contributors will be notified.
				</div>
				<div className='confirmSubmissionModal-footer'>
					<div className='confirmSubmissionModal-footer--wrap'>
						<Button variant='white' className='techDetailButton mr-2' onClick={close}>
							No, nevermind
						</Button>
						<Button
							variant='primary'
							className='white-14-semibold'
							onClick={() => {
								googleAnalytics.recordEvent('Data access request', 'Clicked submit application', 'Submitted application');
								confirm();
							}}>
							Submit application
						</Button>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default ConfirmSubmissionModal;
