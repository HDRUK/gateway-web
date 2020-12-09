import React, { Fragment } from 'react';
import _ from 'lodash';
import { Modal } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import './Workflows.scss';

const WorkflowModal = ({ open, close, context }) => {
	let { title = '', body = '', buttons = {} } = context;

	const onClickAction = (e, action) => {
		e.preventDefault();
		if (!_.isEmpty(action)) {
			close('', action);
		}
	};

	return (
		<Fragment>
			<Modal show={open} onHide={close} size='md' aria-labelledby='contained-modal-title-vcenter' centered className='workflowModal'>
				<div className='workflowModal-header'>
					<h1 className='black-20-semibold'>{title}</h1>
					<CloseButtonSvg className='workflowModal-header--close' onClick={e => onClickAction(e, 'CANCEL')} />
				</div>

				<div className='workflowModal-body'>{body}</div>

				{Object.keys(buttons).length > 0 && (
					<div className='workflowModal-footer'>
						<div className='workflowModal-footer--wrap'>
							{Object.keys(buttons).map((key, index) => {
								return (
									<button key={index} className={buttons[key].class} onClick={e => onClickAction(e, buttons[key])}>
										{buttons[key].label}
									</button>
								);
							})}
						</div>
					</div>
				)}
			</Modal>
		</Fragment>
	);
};

export default WorkflowModal;
