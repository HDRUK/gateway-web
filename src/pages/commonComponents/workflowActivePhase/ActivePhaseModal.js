import React, { Fragment, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import ActivePhaseHeader from './ActivePhaseHeader';
import './ActivePhaseModal.scss';

const ActivePhaseModal = ({ open, close, workflow = {}, projectName = '', dataSets = [], completeActivePhase }) => {
	const [activePhase, setPhase] = useState({});

	const onClickAction = (e, action = '') => {
		e.preventDefault();
		if (action === 'completePhase') {
			completeActivePhase();
		}
		close('', action);
	};

	const getActivePhase = () => {
		if (!_.isEmpty(workflow)) {
			let { steps } = workflow;
			if (!_.isEmpty(steps)) {
				let activeStep = [...steps].find(s => s.active) || {};
				setPhase(activeStep);
			}
		}
	};

	const renderList = (node, primKey = '', secKey = '') => {
		if (!_.isEmpty(node) && !_.isEmpty(primKey) && !_.isEmpty(secKey)) return [...node].map(n => `${n[primKey]} ${n[secKey]}`).join(', ');

		if (!_.isEmpty(node) && !_.isEmpty(primKey)) return [...node].map(n => n[primKey]).join(', ');

		if (!_.isEmpty(node)) return [...node].map(n => n).join(', ');

		return '-';
	};

	const renderDeadline = () => {
		let { deadline, deadlinePassed = false } = activePhase;
		return <span className={`${deadlinePassed ? 'app-red' : ''}`}>{deadlinePassed ? `${deadline} days ago` : `in ${deadline} days`}</span>;
	};

	useEffect(() => {
		getActivePhase();
	}, []);

	return (
		<Fragment>
			<Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='activePhase'>
				<ActivePhaseHeader onClickAction={onClickAction} />

				<div className='activePhase-body'>
					<div className='meta gray800-14-opacity'>Project title</div>
					<div className='meta gray800-14'>{projectName}</div>
					<div className='meta gray800-14-opacity'>Datasets</div>
					<div className='meta gray800-14'>{renderList(dataSets, 'name')}</div>
					<div className='meta gray800-14-opacity'>Phase</div>
					<div className='meta gray800-14'>{activePhase.stepName}</div>
					<div className='meta gray800-14-opacity'>Assigned sections</div>
					<div className='meta gray800-14'>{renderList(activePhase.sections)}</div>
					<div className='meta gray800-14-opacity'>Reviewers</div>
					<div className='meta gray800-14'>{renderList(activePhase.reviewers, 'firstname', 'lastname')}</div>
					<div className='meta gray800-14-opacity'>Deadline</div>
					<div className='meta gray800-14'>{renderDeadline()}</div>
				</div>
				<div className='activePhase-footer'>
					<button className='button-secondary' onClick={e => onClickAction(e, 'cancel')}>
						No, nevermind
					</button>
					<button className='button-primary' onClick={e => onClickAction(e, 'completePhase')}>
						Complete phase
					</button>
				</div>
			</Modal>
		</Fragment>
	);
};

export default ActivePhaseModal;
