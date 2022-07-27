import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './AmendApplicationModal.scss';
import googleAnalytics from '../../../../tracking';

const AmendApplicationModal = ({ open, close, confirm }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='amendApplicationModal'>
				<div className='amendApplicationModal-header'>
					<h1 className='black-20-semibold'>Amend application</h1>
					<CloseButtonSvg className='amendApplicationModal-header--close' onClick={close} />
				</div>
				<div className='amendApplicationModal-body'>
					Are you sure you want to amend this application? This will create a new version of the application that will require resubmitting
					for approval.
				</div>
				<div className='amendApplicationModal-footer'>
					<div className='amendApplicationModal-footer--wrap'>
						<Button variant='white' className='techDetailButton mr-2' onClick={close}>
							No, nevermind
						</Button>
						<Button
							variant='primary'
							className='white-14-semibold'
							onClick={() => {
								confirm();
								googleAnalytics.recordEvent('Data access request', 'Clicked confirm amend', 'Started application amendment')
							}}>
							Amend application
						</Button>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default AmendApplicationModal;
