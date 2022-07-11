import React, { Fragment } from 'react';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';

import './ShareFormModal.scss';

const ShareFormModal = ({ open, close, messageWithoutSharing, messageAndShare }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='contributorModal'>
				<div className='contributorModal-header'>
					<div className='contributorModal-header--wrap'>
						<div className='contributorModal-head'>
							<h1 className='black-20-semibold'>Send message and share form with custodian?</h1>
							<CloseButtonSvg className='contributorModal-head--close' onClick={() => close()} />
						</div>
						<p>
							Once you send a message to the data custodian they will be able to see your application form, including any future changes.
						</p>
						<br />
						<p>If you don’t want to share your form, you can message the custodian using the enquiry messaging panel instead.</p>
					</div>
				</div>

				<div className='contributorModal-footer'>
					<div className='contributorModal-footer--wrap'>
						<button className='button-secondary' onClick={() => messageWithoutSharing()}>
							Message without sharing
						</button>
						<button className='button-primary' onClick={() => messageAndShare()}>
							Message and share
						</button>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default ShareFormModal;
