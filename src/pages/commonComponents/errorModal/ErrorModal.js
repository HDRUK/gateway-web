import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import './ErrorModal.scss';

const cmsURL = require('../../commonComponents/BaseURL').getCMSURL();

const ErrorModal = ({ show, handleClose }) => {
	let history = useHistory();

	window.onclick = function (event) {
		const modal = document.getElementById('errorModal');
		if (event.target.childNodes[0] === modal) {
			history.push({ pathname: '/' });
		}
	};

	const onClose = () => {
		handleClose(false);
		history.push({ pathname: '/' });
	};

	return (
		<Modal show={show} onHide={handleClose} aria-labelledby='contained-modal-title-vcenter' centered id='errorModal'>
			<Modal.Header>
				<Modal.Title id='contained-modal-title-vcenter'>Oops! Something went wrong!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className='gray800-14' style={{ textAlign: 'center' }}>
					This issue has been automatically reported to our team!
					<br />
					If this issue continues, please contact support by clicking <a href={cmsURL + '/HDRUKGatewaySupportPortal'}>here.</a>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={onClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default ErrorModal;
