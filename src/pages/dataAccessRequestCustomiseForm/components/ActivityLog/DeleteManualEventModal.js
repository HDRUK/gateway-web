import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './DeleteManualEventModal.scss';

const DeleteManualEventModal = ({ open, close, confirm }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='deleteEventModal'>
				<CloseButtonSvg className='deleteEventModal-close' onClick={close} />
				<div className='deleteEventModal-header'>
					<h1 className='black-20-semibold'>Delete event</h1>
					<div className='deleteEventModal-subtitle'>
						Are you sure you want to delete an event from this activity log? This will also be removed from the applicants activity log.
					</div>
				</div>
				<div className='deleteEventModal-body'>
					<div className='deleteEventModal-footer'>
						<div className='deleteEventModal-footer--wrap'>
							<Button variant='white' className='techDetailButton mr-2' onClick={close}>
								No, nevermind
							</Button>
							<Button variant='primary' className='white-14-semibold' onClick={confirm}>
								Delete event
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default DeleteManualEventModal;
