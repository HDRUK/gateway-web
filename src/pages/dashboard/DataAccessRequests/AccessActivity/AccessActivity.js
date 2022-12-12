import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';
import SLA from '../../../commonComponents/sla/SLA';
import DarHelperUtil from '../../../../utils/DarHelper.util';
import WorkflowDecision from '../../../commonComponents/workflowDecision/WorkflowDecision';

const AccessActivity = ({
    datasets = [],
    updatedAt,
    applicants = '',
    dateSubmitted = '',
    team = 'user',
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
                    text={DarHelperUtil.amendmentStatuses[amendmentStatus].text}
                    icon={DarHelperUtil.amendmentStatuses[amendmentStatus].icon}
                    iconColor={DarHelperUtil.amendmentStatuses[amendmentStatus].iconColor}
                />
            );
        } else {
            if (workflowCompleted && applicationStatus === DarHelperUtil.darStatus.inReview) {
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
        const hasWorkflow = !_.isEmpty(workflowName) ? true : false;
        const isTeam = team !== 'user' ? true : false;
        return (
            <Fragment>
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
                    <Fragment>
                        <div className='box'>Workflow</div>
                        <div
                            id={`workflow_${workflow._id}`}
                            className='box box-link'
                            onClick={e => {
                                navigateToLocation(e);
                            }}
                        >
                            {!_.isEmpty(workflowName) ? workflowName : '-'}
                            {!_.isEmpty(stepName) ? ` | ${stepName}` : ''}
                            {workflowCompleted ? ' complete' : ''}
                        </div>
                    </Fragment>
                ) : (
                    ''
                )}
                {isTeam === true &&
                (applicationStatus === DarHelperUtil.darStatus.submitted || applicationStatus === DarHelperUtil.darStatus.inReview) ? (
                    <Fragment>
                        <div className='box'>Action required by</div>
                        <div className='box'>{!_.isEmpty(remainingActioners) ? <Fragment>{remainingActioners}</Fragment> : '-'}</div>
                    </Fragment>
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
                            {applicationStatus === DarHelperUtil.darStatus.submitted && isStartReviewEnabled
                                ? (Object.values(latestVersion.versionTree) || [])
                                      .filter(version => version.applicationStatus === DarHelperUtil.darStatus.submitted)
                                      .map(submittedVersion => {
                                          return (
                                              team !== 'user' && (
                                                  <button
                                                      id='startReview'
                                                      className='button-primary'
                                                      onClick={e => {
                                                          navigateToLocation(e, submittedVersion.applicationId);
                                                      }}
                                                  >
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
            </Fragment>
        );
    };
    return <Fragment>{buildAccessRequest()}</Fragment>;
};

export default AccessActivity;
