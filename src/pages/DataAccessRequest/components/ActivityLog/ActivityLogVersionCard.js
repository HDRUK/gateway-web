import { groupBy, isEmpty, startCase } from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { SlideDown } from 'react-slidedown';
import { ReactComponent as ActionRequired } from '../../../../images/Action_required.svg';
import { ReactComponent as ApplicationRejected } from '../../../../images/Application_rejected.svg';
import { ReactComponent as VersionAccepted } from '../../../../images/check.svg';
import { ReactComponent as Clock } from '../../../../images/clock.svg';
import { ReactComponent as Collaborators } from '../../../../images/Collaborators.svg';
import { ReactComponent as ManualEvent } from '../../../../images/Manual_input.svg';
import { ReactComponent as Message } from '../../../../images/Messages.svg';
import { ReactComponent as Notes } from '../../../../images/Notes.svg';
import SVGIcon from '../../../../images/SVGIcon';
import { ReactComponent as UpdateRequested } from '../../../../images/Updates_requested.svg';
import { ReactComponent as VersionCreated } from '../../../../images/Versions_created.svg';
import { ReactComponent as Workflow } from '../../../../images/Workflows.svg';
import DarHelperUtil from '../../../../utils/DarHelper.util';
import SLA from '../../../commonComponents/sla/SLA';
import './ActivityLog.scss';

const ActivityLogVersionCard = ({ version, team, onDeleteEventClick }) => {
    const [activityLogIds, setActivityLogIds] = useState([]);

    const toggleLogDetails = id => {
        const newArray = activityLogIds.includes(id)
            ? activityLogIds.filter(activityLogId => activityLogId !== id)
            : [...activityLogIds, id];
        setActivityLogIds(newArray);
    };

    const {
        version: versionNumber,
        meta: { dateSubmitted, applicationType, applicationStatus, timeWithApplicants },
        events = [],
    } = version;

    const groupedByDateEvents = groupBy(events, e => moment(e.timestamp).format('D MMMM YYYY'));
    const logCreationDates = Object.keys(groupedByDateEvents);
    const logsByLogCreationDate = Object.values(groupedByDateEvents);

    return (
        <div className='col-md-12'>
            <div className={applicationType === 'Update' ? 'layoutCard layoutCardVersionUpdated' : 'layoutCard'}>
                <div className='header-version'>
                    <div className='header-version-title'>
                        <div className='header-version-number'>
                            <h1>
                                {applicationType && applicationType !== DarHelperUtil.darApplicationTypes.initial
                                    ? `${versionNumber} | ${startCase(applicationType)}`
                                    : versionNumber}
                            </h1>
                        </div>

                        {applicationType ? (
                            <div className='time'>Submitted {dateSubmitted}</div>
                        ) : (
                            <div className='time'>First message sent {moment(events.lastItem.timestamp).format('D MMMM YYYY')}</div>
                        )}
                    </div>
                    {applicationType && (
                        <div className='header-version-status activity-log-version-status'>
                            {renderDuration(applicationStatus, dateSubmitted, applicationType, version, timeWithApplicants)}

                            <SLA
                                classProperty={DarHelperUtil.darStatusColours[applicationStatus]}
                                text={DarHelperUtil.darSLAText[applicationStatus]}
                                applicationType={applicationType}
                            />
                        </div>
                    )}
                </div>

                <div className='version-log-body'>
                    {logCreationDates.map((logCreationDate, index) => {
                        const logs = logsByLogCreationDate[index];
                        return (
                            <div className='activity-log-item'>
                                <div className='activity-log-key'> {isToday(new Date(logCreationDate)) ? 'Today' : logCreationDate}</div>
                                {logs.map((log, index) => {
                                    return (
                                        <div>
                                            <div className='activity-log' key={`step-${index}`} onClick={e => toggleLogDetails(log._id)}>
                                                <div className='activity-log-icon'>
                                                    {(log.eventType === DarHelperUtil.activityLogEvents.APPLICATION_APPROVED ||
                                                        log.eventType ===
                                                            DarHelperUtil.activityLogEvents.APPLICATION_APPROVED_WITH_CONDITIONS ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.UPDATE_SUBMITTED) && (
                                                        <VersionAccepted className='versionAccepted' fill='#fff' />
                                                    )}
                                                    {(log.eventType === DarHelperUtil.activityLogEvents.UPDATES_SUBMITTED ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.AMENDMENT_SUBMITTED ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.APPLICATION_SUBMITTED) && (
                                                        <VersionCreated className='versionCreated' />
                                                    )}
                                                    {log.eventType === DarHelperUtil.activityLogEvents.MANUAL_EVENT && (
                                                        <ManualEvent className='versionCreated' />
                                                    )}
                                                    {log.eventType === DarHelperUtil.activityLogEvents.APPLICATION_REJECTED && (
                                                        <ApplicationRejected className='versionCreated' />
                                                    )}
                                                    {(log.eventType === DarHelperUtil.activityLogEvents.PRESUBMISSION_MESSAGE ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.CONTEXTUAL_MESSAGE) && (
                                                        <Message className='versionCreated' />
                                                    )}
                                                    {log.eventType === DarHelperUtil.activityLogEvents.NOTE && (
                                                        <Notes className='versionCreated' />
                                                    )}
                                                    {(log.eventType === DarHelperUtil.activityLogEvents.FINAL_DECISION_REQUIRED ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.DEADLINE_PASSED) && (
                                                        <ActionRequired className='versionCreated' />
                                                    )}
                                                    {(log.eventType === DarHelperUtil.activityLogEvents.REVIEW_PROCESS_STARTED ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.WORKFLOW_ASSIGNED ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.REVIEW_PHASE_STARTED ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.RECOMMENDATION_WITH_ISSUE ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.RECOMMENDATION_WITH_NO_ISSUE) && (
                                                        <Workflow className='versionCreated' />
                                                    )}
                                                    {(log.eventType === DarHelperUtil.activityLogEvents.COLLABORATOR_ADDEDD ||
                                                        log.eventType === DarHelperUtil.activityLogEvents.COLLABORATOR_REMOVED) && (
                                                        <Collaborators className='versionCreated' />
                                                    )}
                                                    {log.eventType === DarHelperUtil.activityLogEvents.UPDATE_REQUESTED && (
                                                        <UpdateRequested className='versionCreated' />
                                                    )}
                                                </div>
                                                <div className='activity-log-time'>{moment(log.timestamp).format('HH:mm')}</div>{' '}
                                                <div className='activity-log-text'>
                                                    <div className='gray800-14' dangerouslySetInnerHTML={createMarkup(log.html)} />{' '}
                                                </div>
                                                {log.detailedHtml && (
                                                    <div className='activity-log-arrow'>
                                                        <SVGIcon
                                                            name='chevronbottom'
                                                            width={16}
                                                            height={16}
                                                            fill='#3c4e8c'
                                                            className={!activityLogIds.includes(log._id) ? '' : 'flip180'}
                                                        />
                                                    </div>
                                                )}
                                                {log.eventType === DarHelperUtil.activityLogEvents.MANUAL_EVENT && team !== 'user' && (
                                                    <div className='activity-log-delete-event'>
                                                        <button
                                                            className={`btn-link btn-link-delete `}
                                                            onClick={e => onDeleteEventClick(log._id)}>
                                                            Delete event
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {log.detailedHtml && (
                                                <SlideDown closed={!activityLogIds.includes(log._id)}>
                                                    <div
                                                        className='activity-log-details'
                                                        dangerouslySetInnerHTML={createMarkup(log.detailedHtml)}
                                                    />
                                                </SlideDown>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
                {applicationType === 'Update' && (
                    <div className='version-submitted'>
                        <div className='line' />
                        <div className='version'>{versionNumber} Submitted</div>
                        <div className='line' />
                    </div>
                )}
            </div>
        </div>
    );
};

const createMarkup = htmlString => {
    return { __html: htmlString };
};

const isToday = someDate => {
    const today = new Date();
    return (
        someDate.getDate() === today.getDate() && someDate.getMonth() === today.getMonth() && someDate.getFullYear() === today.getFullYear()
    );
};

const renderDuration = (applicationStatus, dateSubmitted, applicationType, version, timeWithApplicants) => {
    const { createdAt, decisionDuration = 0 } = version;
    let diff = 0;
    let sinceText = '';

    if (applicationType.toLowerCase() === DarHelperUtil.darApplicationTypes.update.toLowerCase()) {
        const {
            meta: { dateSubmitted: dateUpdateSubmitted, dateReturned: dateUpdateReturned, dateCreated: dateUpdateCreated },
        } = version;

        if (dateUpdateSubmitted) {
            diff = calculateTimeDifference(dateUpdateSubmitted);
            sinceText = 'since update submission';
        } else if (dateUpdateReturned) {
            diff = calculateTimeDifference(dateUpdateReturned);
            sinceText = 'since returned';
        } else {
            diff = calculateTimeDifference(dateUpdateCreated);
            sinceText = 'since start';
        }
    } else if (applicationStatus === DarHelperUtil.darStatus.inProgress) {
        sinceText = 'since start';
        diff = calculateTimeDifference(createdAt);
    } else if (applicationStatus === DarHelperUtil.darStatus.submitted || applicationStatus === DarHelperUtil.darStatus.inReview) {
        sinceText = applicationType === DarHelperUtil.darApplicationTypes.initial ? 'since submission' : 'since resubmission';
        diff = calculateTimeDifference(dateSubmitted);
    } else if (
        applicationStatus === DarHelperUtil.darStatus.approved ||
        applicationStatus === DarHelperUtil.darStatus['approved with conditions'] ||
        applicationStatus === DarHelperUtil.darStatus.rejected
    ) {
        if (!isEmpty(decisionDuration.toString())) {
            sinceText = 'total';
            diff = decisionDuration;
        }
    }

    if (!isEmpty(sinceText)) {
        return (
            <div className='time'>
                <Clock />
                <b>{diff} days</b>&nbsp;{sinceText} | {timeWithApplicants} spent with applicants{' '}
            </div>
        );
    }
    return '';
};

const calculateTimeDifference = startTime => {
    const start = moment(startTime);
    const end = moment();
    return end.diff(start, 'days');
};

export default ActivityLogVersionCard;
