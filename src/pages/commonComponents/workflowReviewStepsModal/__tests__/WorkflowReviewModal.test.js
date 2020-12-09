import React from 'react';
import WorkflowReviewModal from '../WorkflowReviewStepsModal';
import { shallow } from 'enzyme';

let wrapper, props;

const fakeWorkflow = {
	workflowName: 'Workflow Test 2',
	steps: [
		{
			reviewers: [
				{ _id: '5f03530178e28143d7af2eb1', firstname: 'Robin', lastname: 'Kavanagh' },
				{ _id: '5f3a83995c2dfe8b96be4532', firstname: 'Alex', lastname: 'Power' },
				{ _id: '5eb29430861979081c1f6acd', firstname: 'Chris', lastname: 'Marks' },
				{ _id: '5ec3e1a996d46c775670a88d', firstname: 'Richard', lastname: 'Hobbs' },
			],
			sections: ['Safe settings', 'Safe project'],
			reminderOffset: 3,
			active: false,
			completed: true,
			recommendations: [
				{
					reviewer: '5f3a83995c2dfe8b96be4532',
					approved: true,
					comments: 'this is a test this is a test this is a test',
					createdDate: '2020-10-08T10:23:35.512Z',
				},
			],
			_id: '5f7c2185c45a8658752006b9',
			stepName: 'Step 1',
			deadline: 14,
			startDateTime: '2020-10-07T10:23:35.506Z',
			endDateTime: '2020-10-15T14:26:56.417Z',
			closed: true,
			reviews: [
				{
					_id: '5f03530178e28143d7af2eb1',
					firstname: 'Robin',
					lastname: 'Kavanagh',
					approved: null,
					comments: '',
					createdDate: '',
					stepId: '5f7c2185c45a8658752006b9',
					closed: true,
				},
				{
					_id: '5f3a83995c2dfe8b96be4532',
					firstname: 'Alex',
					lastname: 'Power',
					reviewer: '5f3a83995c2dfe8b96be4532',
					approved: true,
					comments: 'this is a test this is a test this is a test',
					createdDate: '2020-10-08T10:23:35.512Z',
					stepId: '5f7c2185c45a8658752006b9',
					closed: true,
				},
				{
					_id: '5eb29430861979081c1f6acd',
					firstname: 'Chris',
					lastname: 'Marks',
					approved: null,
					comments: '',
					createdDate: '',
					stepId: '5f7c2185c45a8658752006b9',
					closed: true,
				},
				{
					_id: '5ec3e1a996d46c775670a88d',
					firstname: 'Richard',
					lastname: 'Hobbs',
					approved: null,
					comments: '',
					createdDate: '',
					stepId: '5f7c2185c45a8658752006b9',
					closed: true,
				},
			],
		},
		{
			reviewers: [{ _id: '5f3a83995c2dfe8b96be4532', firstname: 'Alex', lastname: 'Power' }],
			sections: ['Safe people'],
			reminderOffset: 3,
			active: true,
			completed: false,
			recommendations: [{ reviewer: '5eddf14c3ca18f0915d15647' }],
			_id: '5f7c219cc45a8658752006ba',
			stepName: 'Step 2',
			deadline: 2,
			startDateTime: '2020-10-15T14:26:56.418Z',
			reviewStatus: 'Deadline in 1 days',
			deadlinePassed: false,
			closed: true,
			reviews: [
				{
					_id: '5f3a83995c2dfe8b96be4532',
					firstname: 'Alex',
					lastname: 'Power',
					approved: null,
					comments: '',
					createdDate: '',
					stepId: '5f7c219cc45a8658752006ba',
					closed: true,
				},
			],
		},
	],
	isCompleted: false,
	canOverrideStep: true,
};

const open = jest.fn();
const close = jest.fn();

beforeEach(() => {
	wrapper = shallow(<WorkflowReviewModal workflow={fakeWorkflow} open={open} close={close} />);
	jest.resetModules();
});

describe('<WorkflowReviewModal /> rendering', () => {
	it('renders Workflow Review Modal', () => {
		// const ModalHeader = wrapper.find('ModalHeader');
		console.log(wrapper.debug());
	});
});
