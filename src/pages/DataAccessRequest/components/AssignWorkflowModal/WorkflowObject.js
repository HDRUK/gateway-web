import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SVGIcon from '../../../../images/SVGIcon';
import './AssignWorkflowModal.scss';
import WorkflowStep from './WorkflowStep';

const WorkflowObject = ({ workflow, toggleSelected }) => {
	return (
		<Row className='resource-card-row pad-bottom-8 assignWorkflowCard'>
			<Col>
				<div className='collection-rectangle pad-bottom-16'>
					<Row className='noMargin pad-left-8 gray-bottom-border'>
						<Col sm={9} lg={9} className='pad-bottom-16'>
							<SVGIcon name='workflow' className='workflowIcon' fill={'#475da7'} width={20} height={20} id='workflowIcon' />
							{workflow.workflowName}
						</Col>
						<Col sm={3} lg={3} className='pad-bottom-16'>
							<button
								onClick={e => toggleSelected(workflow._id)}
								className={workflow.selected ? 'workflowSelectedButton' : 'workflowSelectButton'}>
								{workflow.selected ? (
									<div>
										<SVGIcon name='check' className='workFlowCheckIcon' fill={'#FFFFFF'} width={20} height={20} id='checkIcon' />
										Selected
									</div>
								) : (
									'Select'
								)}
							</button>
						</Col>

						{workflow.steps.map((step, index) => {
							let reviewers = step.reviewers
								.map((reviewer, i) => {
									return `${reviewer.firstname} ${reviewer.lastname}`;
								})
								.join(', ');

							let sections = step.displaySections.join(', ');

							return <WorkflowStep index={index} step={step} reviewers={reviewers} displaySections={sections} />;
						})}
					</Row>
				</div>
			</Col>
		</Row>
	);
};

export default WorkflowObject;
