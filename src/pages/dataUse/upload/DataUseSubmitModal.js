import React, { Fragment } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import './DataUseSubmitModal.scss';

const DataUseSubmitModal = ({ open, close, confirm, isValid, isAdmin, recommendedFieldsMissing }) => {
	return (
		<Fragment>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' centered className='dataUseSubmitModal'>
				<CloseButtonSvg className='dataUseSubmitModal-close' onClick={close} />
				<div className='dataUseSubmitModal-header'>
					<h1 className='black-20-semibold'>
						{isValid && !recommendedFieldsMissing && 'Submit data uses for review'}
						{isValid && recommendedFieldsMissing && 'Submit data uses without recommended minimum fields'}
						{!isValid && 'Missing required fields'}
					</h1>
					<div className='dataUseSubmitModal-subtitle'>
						{isValid && !recommendedFieldsMissing && (
							<>
								<p>Are you sure that you want to submit these data uses for review? </p>
								<p>You cannot edit these whilst it is pending.</p>
							</>
						)}
						{isValid && recommendedFieldsMissing && (
							<>
								<p>
									There are recommended minimum fields missing in the file you uploaded. Are you sure you want to submit these data uses for
									admin review?
								</p>
								<p>Please note that the recommended minimum fields based on the Alliance’s Data Use Register standard are: </p>
								<ul>
									<li>Organisation name</li>
									<li>Project title</li>
									<li>Lay summary</li>
									<li>Public benefit statement</li>
									<li>Latest approval date</li>
									<li>Dataset(s) name</li>
									<li>Access Type</li>
								</ul>
							</>
						)}
						{!isValid && isAdmin && (
							<>
								<p>There are errors on the file that you have uploaded. Are you sure that you want to submit these data uses for review?</p>
								<p>You cannot edit these whilst it is pending.</p>
							</>
						)}
						{!isValid && !isAdmin && (
							<>
								<p>You cannot submit these data uses for review with the following required fields missing:</p>
								<ul>
									<li>Organisation name</li>
									<li>Project title</li>
									<li>Dataset(s) name</li>
								</ul>
								<p>
									If the required fields cannot be provided, please raise a support ticket at the following link:{' '}
									<a className='data-use-link' href='https://hdruk.atlassian.net/servicedesk/customer/portal/1'>
										https://hdruk.atlassian.net/servicedesk/customer/portal/1
									</a>
								</p>
							</>
						)}
					</div>
				</div>
				<div className='dataUseSubmitModal-body'>
					{(isValid || isAdmin) && (
						<div className='dataUseSubmitModal-footer'>
							<div className='dataUseSubmitModal-footer--wrap'>
								<Button variant='white' className='techDetailButton mr-2' onClick={close}>
									No, nevermind
								</Button>
								<Button variant='primary' className='white-14-semibold' onClick={confirm}>
									Confirm submission
								</Button>
							</div>
						</div>
					)}
				</div>
			</Modal>
		</Fragment>
	);
};

export default DataUseSubmitModal;
