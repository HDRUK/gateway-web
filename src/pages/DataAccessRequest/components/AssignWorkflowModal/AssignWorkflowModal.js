import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import WorkflowsModal from './WorkflowsModal';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { baseURL } from '../../../../configs/url.config';
import googleAnalytics from '../../../../tracking';

const AssignWorkflowModal = ({ open, close, workflows, publisher, applicationId }) => {
	// workflow(s) state // this.state.steps = [];
	const [workflowsArr, setWorkflow] = useState([]);
	// state for workflow has been selected
	const [isWorkflowSelected, setSelectedWorkflow] = useState(false);

	let history = useHistory();

	const modifyWorkflows = () => {
		if (!_.isEmpty(workflows)) {
			let workflowsArr = workflows.map(item => {
				return {
					...item,
					selected: false,
				};
			});
			setWorkflow(workflowsArr);
		}
		return [];
	};

	const toggleSelected = _id => {
		let workflows = workflowsArr.map(item => {
			return {
				...item,
				selected: item._id === _id ? !item.selected : false,
			};
		});
		// set workflow is Selected flag .find { selected: true, workflowId etc}
		let isWorkflowSelected = [...workflows].some(el => el.selected === true);
		// do we have a selected workflow
		let selected = isWorkflowSelected ? true : false;
		//set workflow selected state
		setSelectedWorkflow(selected);
		// set update to workflows array
		setWorkflow(workflows);
	};

	const assignNotify = () => {
		// check if workflows is not empty ![]
		if (!_.isEmpty(workflowsArr)) {
			// get the selected workflow default to empty object incase of undefined return
			const workflow = [...workflowsArr].find(el => el.selected === true) || {};
			// next if workflow is not empty
			if (!_.isEmpty(workflow)) {
				axios
					.put(baseURL + `/api/v1/data-access-request/${applicationId}/assignworkflow`, {
						workflowId: workflow._id,
					})
					.then(res => {
						let alert = {
							publisher: publisher,
							nav: `dataaccessrequests&team=${publisher}`,
							tab: 'inReview',
							message: `You have successfully assigned a workflow`,
						};
						//redirect to dashboard with alert
						history.push({ pathname: `/account`, search: `?tab=dataaccessrequests&team=`, state: { alert } });
					});
			}
		}
	};

	useEffect(() => {
		modifyWorkflows();
	}, [workflows]);

	return (
		<div className='flexCenter assignNotifyModal'>
			<Modal show={open} onHide={close} aria-labelledby='contained-modal-title-vcenter' className='relatedResourcesModal'>
				<Modal.Header>
					<Modal.Title>
						<span className='black-20'>Assign a workflow</span>
						<br />
						<span className='gray800-14'>
							Assign a workflow so your team can help review this application. All reviewers will be notified at the point their phase
							begins.
						</span>
					</Modal.Title>
					<CloseButtonSvg className='modal-close pointer' onClick={close} width='24px' height='24px' fill='#475DA7' />
				</Modal.Header>
				<Modal.Body>
					<WorkflowsModal workflows={workflowsArr} toggleSelected={toggleSelected} />
					{isWorkflowSelected ? (
						<div className='assignNotify'>
							<div className='assignNotifyAction'>
								<button
									className='button-primary'
									value='Reject'
									onClick={e => {
										assignNotify();
										googleAnalytics.recordEvent('Data access request', 'Clicked assign workflow', 'Assigned workflow to application');
									}}>
									Assign and notify
								</button>
							</div>
						</div>
					) : (
						''
					)}
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default AssignWorkflowModal;
