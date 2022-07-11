import React, { Fragment } from 'react';
import DarHelper from '../../../../utils/DarHelper.util';
import ActionBarMenu from '../../../commonComponents/ActionBarMenu/ActionBarMenu';
import googleAnalytics from '../../../../tracking';

const CustodianActionButtons = ({
	activeParty = '',
	allowedNavigation = false,
	inReviewMode,
	onNextClick,
	onActionClick,
	applicationStatus,
	roles,
	workflowEnabled = false,
	workflowAssigned,
	onWorkflowReview,
	hasRecommended = false,
	unansweredAmendments = 0,
	onUpdateRequest,
	onWorkflowReviewDecisionClick,
}) => {
	const showRecommendationDropdown =
		applicationStatus === DarHelper.darStatus.inReview &&
		((inReviewMode && !hasRecommended) || roles.includes('manager')) &&
		!parseInt(unansweredAmendments) > 0;

	const showReviewOptions = inReviewMode && !hasRecommended && workflowAssigned;

	const showAssignWorkflow =
		applicationStatus === DarHelper.darStatus.inReview && roles.includes('manager') && workflowEnabled && !workflowAssigned;

	const showSendUpdateRequest =
		applicationStatus === DarHelper.darStatus.inReview &&
		activeParty === 'custodian' &&
		roles.includes('manager') &&
		unansweredAmendments > 0;

	const manageOptions = [
		{
			description: 'Manage application:',
			actions: [
				{
					title: 'View recommendations',
					description: 'View assigned workflow and phase recommendations',
					onClick: () => {
						onWorkflowReview();
						googleAnalytics.recordVirtualPageView('workflow recommendations modal');
					},
					isVisible: applicationStatus === DarHelper.darStatus.inReview,
				},
			],
		},
	];

	const decisionOptions = [
		{
			description: 'Review this phase:',
			actions: [
				{
					title: 'Issues found',
					onClick: () => {
						onWorkflowReviewDecisionClick(false);
						googleAnalytics.recordEvent('Data access request', 'Issues found clicked', 'Workflow phase review decision made');
					},
					isVisible: showRecommendationDropdown && showReviewOptions,
				},
				{
					title: 'No issues found',
					onClick: () => {
						onWorkflowReviewDecisionClick(true);
						googleAnalytics.recordEvent('Data access request', 'No issues found clicked', 'Workflow phase review decision made');
					},
					isVisible: showRecommendationDropdown && showReviewOptions,
				},
			],
		},
		{
			description: 'Final application decision:',
			detailedDescription: 'This will end the review process and send a final response to the applicant',
			actions: [
				{
					title: 'Approve',
					onClick: () => {
						onActionClick('Approve');
						googleAnalytics.recordEvent('Data access request', 'Application approved', 'Application final decision made');
					},
					isVisible: showRecommendationDropdown && roles.includes('manager'),
				},
				{
					title: 'Approve with conditions',
					onClick: () => {
						onActionClick('ApproveWithConditions');
						googleAnalytics.recordEvent('Data access request', 'Application approved with conditions', 'Application final decision made');
					},
					isVisible: showRecommendationDropdown && roles.includes('manager'),
				},
				{
					title: 'Reject',
					onClick: () => {
						onActionClick('Reject');
						googleAnalytics.recordEvent('Data access request', 'Application rejected', 'Application final decision made');
					},
					isVisible: showRecommendationDropdown && roles.includes('manager'),
				},
			],
		},
	];

	const availableManageOptions = manageOptions.map(option => {
		option.actions = option.actions.filter(action => action.isVisible);
		return option;
	});

	const availableDecisionOptions = decisionOptions.map(option => {
		option.actions = option.actions.filter(action => action.isVisible);
		return option;
	});

	return (
		<Fragment>
			<ActionBarMenu label='Manage application' options={availableManageOptions} buttonClass='button-tertiary' />
			<ActionBarMenu label='Make a decision' options={availableDecisionOptions} />

			{showAssignWorkflow && (
				<button
					className='button-secondary'
					onClick={e => {
						onActionClick('AssignWorkflow');
						googleAnalytics.recordVirtualPageView('assign workflow modal');
					}}>
					Assign a workflow
				</button>
			)}

			{showSendUpdateRequest && (
				<button
					className='button-secondary'
					onClick={e => {
						onUpdateRequest(e);
						googleAnalytics.recordVirtualPageView('send update request modal');
					}}>
					Send update request
				</button>
			)}

			<button
				className={`button-primary ${allowedNavigation ? '' : 'disabled'}`}
				onClick={e => {
					onNextClick();
					googleAnalytics.recordEvent('Data access request', 'Clicked next', 'Navigate to next page');
				}}>
				Next
			</button>
		</Fragment>
	);
};

export default CustodianActionButtons;
