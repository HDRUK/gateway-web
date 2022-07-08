import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './DeleteDraftModal.scss';
import googleAnalytics from '../../../../tracking';

const DeleteDraftModal = ({ open, close, confirm }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='deleteDraftModal'>
				<div className='deleteDraftModal-header'>
					<h1 className='black-20-semibold'>Delete draft</h1>
					<CloseButtonSvg className='deleteDraftModal-header--close' onClick={close} />
				</div>
				<div className='deleteDraftModal-body'>
					Are you sure you want to delete this draft application? You will no longer be able to view this form and will lose any answers
					provided. All applicants and contributors will be notified.
				</div>
				<div className='deleteDraftModal-footer'>
					<div className='deleteDraftModal-footer--wrap'>
						<Button variant='white' className='techDetailButton mr-2' onClick={close}>
							No, nevermind
						</Button>
						<Button
							variant='primary'
							className='white-14-semibold'
							onClick={() => {
								confirm();
								googleAnalytics.recordEvent('Data access request', 'Clicked confirm delete', 'Deleted draft application');
							}}>
							Delete draft
						</Button>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default DeleteDraftModal;
