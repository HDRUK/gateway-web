import React, { Fragment, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import _ from 'lodash';
import WorkflowReviewDecisionHeader from './WorkflowReviewDecisionHeader';
import './WorkflowReviewDecision.scss';
import TextareaAutosize from 'react-textarea-autosize';

const WorkflowReviewDecisionModal = ({
	open,
	close,
	workflow = {},
	projectName = '',
	dataSets = [],
	approved = false,
	onDecisionReview,
}) => {
	const [activePhase, setPhase] = useState({});
	const [wordCount, setWordCount] = useState(0);
	const [errors, setErrors] = useState(false);
	const [comments, setComments] = useState('');

	const onClickAction = (e, action = '') => {
		e.preventDefault();
		// 1. check for errors
		if (action === 'reviewDecision') {
			if (_.isEmpty(comments)) return setErrors(true);

			if (wordCount >= 1500) return setErrors(true);

			// 2. no errors - set false
			setErrors(false);
			// 3. call API in DAR for decision
			onDecisionReview(approved, comments);
			// 4. reset
			reset();
		} else {
			// 5. reset
			reset();
			// 6. close modal
			close('', action);
		}
	};

	const onTextChange = e => {
		setComments(e.currentTarget.value);
		setWordCount(e.currentTarget.value.length);
	};

	const reset = () => {
		setComments('');
		setWordCount('');
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

	const generateWordCount = () => {
		return <div className={wordCount >= 1500 ? 'app-red' : ''}>{`${wordCount} /1500`}</div>;
	};

	useEffect(() => {
		const getActivePhase = () => {
			if (!_.isEmpty(workflow)) {
				let { steps } = workflow;
				if (!_.isEmpty(steps)) {
					let activeStep = [...steps].find(s => s.active) || {};
					setPhase(activeStep);
				}
			}
		};
		getActivePhase();
	}, [workflow]);

	return (
		<Fragment>
			<Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='reviewDecision'>
				<WorkflowReviewDecisionHeader approved={approved} onClickAction={onClickAction} />

				<div className='reviewDecision-body'>
					<div className='reviewDecision-body-wrap'>
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

					<div className='reviewDecision-body-desc'>
						<div className='reviewDecision-body-head'>
							<span className='gray800-14'>Description</span>
							<span className='gray800-14'>{generateWordCount()}</span>
						</div>
						<div className={errors ? 'form-group was-validated' : 'form-group'}>
							<TextareaAutosize 
								className='form-control textarea-modal'
								rows='8'
								type='text'
								value={comments}
								name='comments'
								onChange={e => {
									onTextChange(e);
								}}
								required
							/>
							<div className='invalid-feedback'>Description needed</div>
						</div>
					</div>
				</div>
				<div className='reviewDecision-footer'>
					<button className='button-secondary' onClick={e => onClickAction(e, 'cancel')}>
						No, nevermind
					</button>
					<button className='button-primary' onClick={e => onClickAction(e, 'reviewDecision')}>
						Send review decision
					</button>
				</div>
			</Modal>
		</Fragment>
	);
};

export default WorkflowReviewDecisionModal;
