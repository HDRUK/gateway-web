import _ from 'lodash';
import moment from 'moment';

import { darHelperUtils } from 'utils';

import SLA from '../../../commonComponents/sla/SLA';
import WorkflowDecision from '../../../commonComponents/workflowDecision/WorkflowDecision';

const AccessActivity = ({
    datasets = [],
    updatedAt,
    applicants = '',
    dateSubmitted = '',
    teamType = 'user',
    publisher = '',
    applicationStatus,
    navigateToLocation,
    workflow = {},
    workflowName = '',
    workflowCompleted = false,
    reviewStatus = '',
    deadlinePassed = false,
    decisionStatus = '',
    decisionMade = false,
    isReviewer = false,
    stepName = '',
    remainingActioners = [],
    latestVersion,
    amendmentStatus = '',
    isStartReviewEnabled,
}) => {
    const setActivityMeta = () => {
        let reviewDecision;

        if (!_.isEmpty(amendmentStatus)) {
            reviewDecision = (
                <WorkflowDecision
                    text={darHelperUtils.amendmentStatuses[amendmentStatus].text}
                    icon={darHelperUtils.amendmentStatuses[amendmentStatus].icon}
                    iconColor={darHelperUtils.amendmentStatuses[amendmentStatus].iconColor}
                />
            );
        } else {
            if (workflowCompleted && applicationStatus === darHelperUtils.darStatus.inReview) {
                reviewDecision = <WorkflowDecision text={reviewStatus} icon='flag' />;
            } else if (deadlinePassed) {
                reviewDecision = <div className='box-deadline'>{reviewStatus}</div>;
            }

            if (isReviewer && deadlinePassed) {
                reviewDecision = (
                    <WorkflowDecision classProperty='box-deadline' text={reviewStatus} decisionText={decisionStatus} icon='flag' />
                );
            } else if (isReviewer && !decisionMade) {
                reviewDecision = <WorkflowDecision text={reviewStatus} decisionText={decisionStatus} icon='flag' />;
            }

            if (isReviewer && decisionMade) {
                reviewDecision = (
                    <WorkflowDecision classProperty='box-check' decisionMade={decisionMade} decisionText={decisionStatus} icon='check' />
                );
            }
        }

        return reviewDecision;
    };

    const buildAccessRequest = () => {
        const hasWorkflow = !_.isEmpty(workflowName);
        const isTeam = teamType !== 'user';
        return (
            <>
                <div className='box gray800-14'>Datasets</div>
                <div className='box'>
                    {datasets.map((d, i) => {
                        return <SLA key={i} classProperty='default' text={d.name} />;
                    })}
                </div>
                <div className='box'>Custodian</div>
                <div className='box'>{publisher}</div>
                <div className='box'>Applicants</div>
                <div className='box'>{!_.isEmpty(applicants) ? applicants : '-'}</div>
                {hasWorkflow === true ? (
                    <>
                        <div className='box'>Workflow</div>
                        <div
                            id={`workflow_${workflow._id}`}
                            className='box box-link'
                            onClick={e => {
                                navigateToLocation(e);
                            }}>
                            {!_.isEmpty(workflowName) ? workflowName : '-'}
                            {!_.isEmpty(stepName) ? ` | ${stepName}` : ''}
                            {workflowCompleted ? ' complete' : ''}
                        </div>
                    </>
                ) : (
                    ''
                )}
                {isTeam === true &&
                (applicationStatus === darHelperUtils.darStatus.submitted || applicationStatus === darHelperUtils.darStatus.inReview) ? (
                    <>
                        <div className='box'>Action required by</div>
                        <div className='box'>{!_.isEmpty(remainingActioners) ? <>{remainingActioners}</> : '-'}</div>
                    </>
                ) : (
                    ''
                )}
                <div className='box'>Submitted</div>
                <div className='box'>{!_.isEmpty(dateSubmitted) ? moment(dateSubmitted).format('D MMMM YYYY') : '-'}</div>
                <div className='box'>Last activity</div>
                <div className='box'>
                    {moment(updatedAt).format('D MMMM YYYY HH:mm')}
                    {isTeam === true ? (
                        <div className='box-meta'>
                            {applicationStatus === darHelperUtils.darStatus.submitted && isStartReviewEnabled
                                ? (Object.values(latestVersion.versionTree) || [])
                                      .filter(version => version.applicationStatus === darHelperUtils.darStatus.submitted)
                                      .map(submittedVersion => {
                                          return (
                                              teamType !== 'user' && (
                                                  <button
                                                      id='startReview'
                                                      className='button-primary'
                                                      onClick={e => {
                                                          navigateToLocation(e, submittedVersion.applicationId);
                                                      }}>
                                                      Start review: {submittedVersion.displayTitle}
                                                  </button>
                                              )
                                          );
                                      })
                                : !_.isEmpty(reviewStatus) || !_.isEmpty(amendmentStatus)
                                ? setActivityMeta()
                                : ''}
                        </div>
                    ) : !_.isEmpty(amendmentStatus) ? (
                        setActivityMeta()
                    ) : (
                        ''
                    )}
                </div>
            </>
        );
    };
    return <>{buildAccessRequest()}</>;
};

export default AccessActivity;
