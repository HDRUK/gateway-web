import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import './ActionNotAllowedModal.scss';

const ActionNotAllowedModal = ({ open, close, confirm, headerText, bodyText }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='actionNotAllowedModal'>
				<div className='actionNotAllowedModal-header'>
					<h1 className='black-20-semibold'>{headerText}</h1>
					<CloseButtonSvg className='actionNotAllowedModal-header--close' onClick={close} />
				</div>
				<div className='actionNotAllowedModal-body'>
					{bodyText}
				</div>
				<div className='actionNotAllowedModal-footer'>
					<div className='actionNotAllowedModal-footer--wrap'>
						<Button variant='white' className='techDetailButton mr-2' onClick={close}>
							No, nevermind
						</Button>
						<Button variant='primary' className='white-14-semibold' onClick={confirm}>
							Message custodian
						</Button>
					</div>
				</div>
			</Modal>
		</Fragment>
	);
};

export default ActionNotAllowedModal;
