import _ from 'lodash';

export const actionKeys = {
	EDIT: 'edit',
	DELETE: 'delete',
};

export const defaultModal = {
	title: 'Title',
	body: 'Body',
	buttons: {},
};

export const modalactions = {
	CANNOTDELETEWORKFLOW: 'CANNOTDELETEWORKFLOW',
	CANNOTEDITWORKFLOW: 'CANNOTEDITWORKFLOW',
	DELETEWORKFLOW: 'DELETEWORKFLOW',
	SAVEWORKFLOW: 'SAVEWORKFLOW',
	DELETEPHASE: 'DELETEPHASE',
	CANCEL: 'CANCEL',
};

export const defaultWorkflow = {
	workflowId: '',
	workflowName: 'Workflow 1',
	version: 1,
	steps: [
		{
			stepName: '',
			reviewers: [],
			sections: [],
			deadline: '',
			expand: false,
		},
	],
};

export const defaultStep = {
	name: '',
	reviewers: [],
	sections: [],
	deadline: '',
	expand: false,
};

export const formatWorkflows = data => {
	if (!_.isEmpty(data)) {
		return [...data].reduce((acc, item, index) => {
			if (!_.isEmpty(item)) {
				// alter each step in the workflow and add expand flag
				let workflowSteps = [...item.steps].map((step, idx) => {
					return {
						...step,
						workflowId: item._id,
						closed: index === 0 && idx === 0 ? false : true,
					};
				});
				// update workflow with new steps with expand
				let workflow = {
					...item,
					applicationsClosed: true,
					steps: [...workflowSteps],
				};
				// update the array return
				acc.push(workflow);
				// return acc;
				return acc;
			}
		}, []);
	}
	return [];
};

export const toggleWorkflowStep = (workflows = [], step = {}) => {
	if (!_.isEmpty(workflows) && !_.isEmpty(step)) {
		return [...workflows].reduce((arr, workflow) => {
			if (workflow._id === step.workflowId) {
				if (workflow.steps.length > 0) {
					let steps = updateStepToggle([...workflow.steps], step);
					workflow = {
						...workflow,
						steps,
					};
				}
			}
			arr.push(workflow);
			return arr;
		}, []);
	}
	return [];
};

export const updateStepToggle = (steps, step) => {
	return steps.map(el => {
		return {
			...el,
			closed: el._id === step._id ? !el.closed : el.closed,
		};
	});
};

export const toggleWorkflowApplications = (workflows, _id = '') => {
	let workflowArr = [];
	if (!_.isEmpty(workflows) && !_.isEmpty(_id)) {
		workflowArr = [...workflows].map(el => {
			if (el._id === _id) {
				return {
					...el,
					applicationsClosed: !el.applicationsClosed,
				};
			} else {
				return el;
			}
		});
		return workflowArr;
	}
	return workflowArr;
};

export const modalConfigWorkflow = (type = '') => {
	let config = {};
	if (!_.isEmpty(type)) {
		switch (type.toUpperCase()) {
			case 'CANNOTDELETEWORKFLOW':
				config = {
					title: 'You cannot delete this workflow',
					body:
						'This workflow is being used to review dataset request applications. When it is in use, you cannot make any amendments to this workflow, including deleting it.',
					buttons: {},
				};
				break;
			case 'CANNOTEDITWORKFLOW':
				config = {
					title: 'You cannot edit this workflow',
					body:
						'This workflow is being used to review dataset request applications. When it is in use, you cannot make any amendments to this workflow, including deleting it.',
					buttons: {},
				};
				break;
			case 'DELETEWORKFLOW':
				config = {
					title: 'Delete workflow?',
					body: 'You won’t be able to recover your workflow once you delete it, so make sure you review this workflow first.',
					buttons: {
						cancel: {
							label: 'No, nevermind',
							actionName: 'CANCEL',
							class: 'button-secondary mr-2',
							redirect: false,
						},
						confirm: {
							label: 'Delete',
							actionName: 'DELETEWORKFLOW',
							class: 'btn btn-primary addButton',
							redirect: true,
						},
					},
				};
				break;
			case 'SAVEWORKFLOW':
				config = {
					title: 'Do you want to save your changes to your workflows?',
					body:
						'You won’t be able to recover your workflow if you leave without saving, so make sure you save it if you want to keep your changes.',
					buttons: {
						cancel: {
							label: 'Leave, without saving',
							actionName: 'CANCEL',
							class: 'button-secondary mr-2',
							redirect: true,
						},
						confirm: {
							label: 'Save',
							actionName: 'SAVEWORKFLOW',
							class: 'btn btn-primary addButton',
							redirect: true,
						},
					},
				};
				break;
			case 'DELETEPHASE':
				config = {
					title: 'Remove phase?',
					body: 'You won’t be able to recover your phase once you delete it, so make sure you review this phase first.',
					redirect: false,
					buttons: {
						cancel: {
							label: 'No, nevermind',
							actionName: 'CANCEL',
							class: 'button-secondary mr-2',
							redirect: false,
						},
						confirm: {
							label: 'Delete',
							actionName: 'DELETEPHASE',
							class: 'btn btn-primary addButton',
							redirect: false,
						},
					},
				};
				break;
		}
	}

	return config;
};
