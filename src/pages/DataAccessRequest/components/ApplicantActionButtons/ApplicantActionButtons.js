import { Button } from 'hdruk-react-core';
import { darHelperUtils } from 'utils';
import googleAnalytics from '../../../../tracking';
import ActionBarMenu from '../../../commonComponents/ActionBarMenu/ActionBarMenu';

const ApplicantActionButtons = ({
    allowedNavigation = false,
    isCloneable = false,
    onSubmitClick,
    onNextClick,
    onShowContributorModal,
    showSubmit,
    submitButtonText,
    onDeleteDraftClick,
    applicationStatus,
    onDuplicateClick,
    onShowAmendApplicationModal,
    hasNext,
}) => {
    const options = [
        {
            description: 'Manage application:',
            actions: [
                {
                    title: 'Contributors',
                    description: 'Add or remove others to help with this application',
                    onClick: () => {
                        googleAnalytics.recordVirtualPageView('contributors modal');
                        onShowContributorModal();
                    },
                    isVisible: true,
                },
                {
                    title: 'Amend application',
                    description: 'Add or remove datasets and edit answers in approved applications',
                    onClick: () => {
                        googleAnalytics.recordVirtualPageView('amend application modal');
                        onShowAmendApplicationModal();
                    },
                    isVisible:
                        applicationStatus === darHelperUtils.darStatus.inReview ||
                        applicationStatus === darHelperUtils.darStatus.approved ||
                        applicationStatus === darHelperUtils.darStatus.rejected,
                },
                {
                    title: 'Duplicate application',
                    description: 'Copy answers into a new or existing pre-submission application',
                    onClick: () => {
                        googleAnalytics.recordVirtualPageView('duplicate application modal');
                        onDuplicateClick();
                    },
                    isVisible: isCloneable,
                },
                {
                    title: 'Delete draft',
                    description: 'Delete and close this draft application',
                    onClick: () => {
                        googleAnalytics.recordVirtualPageView('delete draft application modal');
                        onDeleteDraftClick();
                    },
                    isVisible: applicationStatus === darHelperUtils.darStatus.inProgress,
                },
            ],
        },
    ];

    const availableOptions = options.map(option => {
        option.actions = option.actions.filter(action => action.isVisible);
        return option;
    });

    return (
        <>
            <ActionBarMenu label='Manage application' options={availableOptions} disabled={!allowedNavigation} variant='tertiary' />

            {showSubmit && (
                <Button
                    variant='secondary'
                    onClick={() => {
                        onSubmitClick();
                        googleAnalytics.recordVirtualPageView('submit application modal');
                    }}
                    disabled={!allowedNavigation}>
                    {submitButtonText}
                </Button>
            )}

            <Button
                onClick={() => {
                    onNextClick();
                    googleAnalytics.recordEvent('Data access request', 'Clicked next', 'Navigate to next page');
                }}
                disabled={!allowedNavigation || !hasNext}>
                Next
            </Button>
        </>
    );
};

export default ApplicantActionButtons;
