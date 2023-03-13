import { Button } from 'hdruk-react-core';
import { useCustodianRoles } from 'hooks';
import { darHelperUtils } from 'utils';
import googleAnalytics from '../../../../tracking';
import ActionBarMenu from '../../../commonComponents/ActionBarMenu/ActionBarMenu';

const CustodianActionButtons = ({
    activeParty = '',
    allowedNavigation = false,
    inReviewMode,
    onNextClick,
    onActionClick,
    applicationStatus,
    teamId,
    workflowEnabled = false,
    workflowAssigned,
    onWorkflowReview,
    hasRecommended = false,
    unansweredAmendments = 0,
    onUpdateRequest,
    onWorkflowReviewDecisionClick,
    hasNext,
}) => {
    const { isCustodianDarManager } = useCustodianRoles(teamId);

    const showRecommendationDropdown =
        applicationStatus === darHelperUtils.darStatus.inReview &&
        ((inReviewMode && !hasRecommended) || isCustodianDarManager) &&
        !parseInt(unansweredAmendments) > 0;

    const showReviewOptions = inReviewMode && !hasRecommended && workflowAssigned;

    const showAssignWorkflow =
        applicationStatus === darHelperUtils.darStatus.inReview && isCustodianDarManager && workflowEnabled && !workflowAssigned;

    const showSendUpdateRequest =
        applicationStatus === darHelperUtils.darStatus.inReview &&
        activeParty === 'custodian' &&
        isCustodianDarManager &&
        unansweredAmendments > 0;

    console.log('applicationStatus: ', applicationStatus);
    console.log('darHelperUtils.darStatus.inReviewtatus: ', darHelperUtils.darStatus.inReview);
    console.log('activeParty: ', activeParty);
    console.log('isCustodianDarManager: ', isCustodianDarManager);
    console.log('unansweredAmendments: ', unansweredAmendments);
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
                    isVisible: applicationStatus === darHelperUtils.darStatus.inReview,
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
                        googleAnalytics.recordEvent(
                            'Data access request',
                            'No issues found clicked',
                            'Workflow phase review decision made'
                        );
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
                    isVisible: showRecommendationDropdown && isCustodianDarManager,
                },
                {
                    title: 'Approve with conditions',
                    onClick: () => {
                        onActionClick('ApproveWithConditions');
                        googleAnalytics.recordEvent(
                            'Data access request',
                            'Application approved with conditions',
                            'Application final decision made'
                        );
                    },
                    isVisible: showRecommendationDropdown && isCustodianDarManager,
                },
                {
                    title: 'Reject',
                    onClick: () => {
                        onActionClick('Reject');
                        googleAnalytics.recordEvent('Data access request', 'Application rejected', 'Application final decision made');
                    },
                    isVisible: showRecommendationDropdown && isCustodianDarManager,
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
        <>
            <ActionBarMenu label='Manage application' options={availableManageOptions} variant='tertiary' />
            <ActionBarMenu label='Make a decision' options={availableDecisionOptions} />

            {showAssignWorkflow && (
                <Button
                    variant='secondary'
                    onClick={e => {
                        onActionClick('AssignWorkflow');
                        googleAnalytics.recordVirtualPageView('assign workflow modal');
                    }}>
                    Assign a workflow
                </Button>
            )}

            {showSendUpdateRequest && (
                <Button
                    variant='secondary'
                    onClick={e => {
                        onUpdateRequest(e);
                        googleAnalytics.recordVirtualPageView('send update request modal');
                    }}>
                    Send update request
                </Button>
            )}

            <Button
                onClick={e => {
                    onNextClick();
                    googleAnalytics.recordEvent('Data access request', 'Clicked next', 'Navigate to next page');
                }}
                disabled={!allowedNavigation || !hasNext}>
                Next
            </Button>
        </>
    );
};

export default CustodianActionButtons;
