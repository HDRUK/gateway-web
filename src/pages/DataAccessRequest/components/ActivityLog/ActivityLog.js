import axios from 'axios';
import { isEmpty, isUndefined } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Row } from 'react-bootstrap';
import { baseURL } from '../../../../configs/url.config';
import SVGIcon from '../../../../images/SVGIcon';
import DarHelperUtil from '../../../../utils/DarHelper.util';
// import VersionSelector from '../../../commonComponents/versionSelector/VersionSelector';
import SLA from '../../../commonComponents/sla/SLA';
import WorkflowReviewStepsModal from '../../../commonComponents/workflowReviewStepsModal/WorkflowReviewStepsModal';
import AccessActivity from '../../../dashboard/DataAccessRequests/AccessActivity/AccessActivity';
import './ActivityLog.scss';
import ActivityLogVersionCard from './ActivityLogVersionCard';
import AddNewEventModal from './AddNewEventModal';
import DeleteManualEventModal from './DeleteManualEventModal';

const ActivityLog = React.forwardRef(({ dataaccessrequest, team, onClickStartReview, onUpdateLogs }, ref) => {
    React.useImperativeHandle(ref, () => ({
        showAddNewEventModal() {
            toggleAddNewEventModal();
        },

        getLogsAsArray,
        getExportFileName,
    }));

    const [showWorkflowReviewModal, setShowWorkflowReviewModal] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const [showDeleteEventModal, setShowDeleteEventModal] = useState(false);
    const [showAddNewEventModal, setShowAddNewEventModal] = useState(false);
    const [eventToDeleteId, setEventToDeleteId] = useState(null);
    const [alert, setAlert] = useState('');
    const getActivityLogs = async () => {
        const versionIds = (Object.values(dataaccessrequest.versionTree) || []).map(version => {
            return version.iterationId ? version.iterationId : version.applicationId;
        });

        const type = 'data_request';

        const response = await axios.post(`${baseURL}/api/v2/activitylog`, {
            versionIds,
            type,
        });

        const { logs = [] } = response.data;
        setActivityLogs(logs);
    };

    useEffect(() => {
        getActivityLogs();
    }, [dataaccessrequest, activityLogs.length]);

    const deleteManualEvent = () => {
        axios
            .delete(`${baseURL}/api/v2/activitylog/data_request/${eventToDeleteId}`, {})
            .then(res => {
                toggleDeleteEventModal();
                getActivityLogs();
                updateVersion(res.data.affectedVersion);
                showAlert('You have successfully deleted a new event');
                onUpdateLogs();
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    const submitManualEvent = newEvent => {
        axios
            .post(`${baseURL}/api/v2/activitylog/data_request`, newEvent)
            .then(res => {
                toggleAddNewEventModal();
                getActivityLogs();
                if (!isUndefined(res.data.affectedVersion)) {
                    updateVersion(res.data.affectedVersion);
                }
                showAlert('You have successfully added a new event');
                onUpdateLogs();
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    const toggleWorkflowReviewModal = () => {
        setShowWorkflowReviewModal(!showWorkflowReviewModal);
    };

    const toggleDeleteEventModal = () => {
        setShowDeleteEventModal(!showDeleteEventModal);
    };

    const toggleAddNewEventModal = () => {
        setShowAddNewEventModal(!showAddNewEventModal);
    };

    const onDeleteEventClick = eventId => {
        setEventToDeleteId(eventId);
        toggleDeleteEventModal();
    };

    const showAlert = alert => {
        setAlert(alert);
        setTimeout(() => setAlert(''), 10000);
    };

    const updateVersion = updatedVersion => {
        const updatedVersionIndex = activityLogs.findIndex(version => version.versionNumber === updatedVersion.versionNumber);
        activityLogs.splice(updatedVersionIndex, 1, updatedVersion);
    };

    const getLogsAsArray = () => {
        const formattedLogs = [];
        activityLogs.forEach(activityLog => {
            activityLog.events.forEach(event => {
                formattedLogs.push({
                    Version: event.version,
                    'Date submitted': activityLog.meta.dateSubmitted,
                    'Days since submission': activityLog.meta.daysSinceSubmission,
                    'Time with applicants': activityLog.meta.timeWithApplicants,
                    'Application status': DarHelperUtil.darSLAText[activityLog.meta.applicationStatus],
                    'Activity date': moment(event.timestamp).format('D MMMM YYYY HH:mm'),
                    Activity: event.plainText,
                    'Activity details': event.detailedText,
                });
            });
        });

        return formattedLogs;
    };

    const getExportFileName = () => {
        return `${dataaccessrequest.projectName}-activityLog-${moment().format('DDMMYYYYHHmmss')}.csv`;
    };

    const {
        datasets = [],
        updatedAt,
        applicants = '',
        publisher = '',
        dateSubmitted = new Date(),
        applicationStatus,
        projectName = '',
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
        amendmentStatus = '',
        applicationType = 'initial',
    } = dataaccessrequest;

    return (
        <>
            <Row>
                <Col xs={1} />
                <Col>
                    <div className='col-md-12'>
                        {!isEmpty(alert) && (
                            <Alert variant='success' className='main-alert'>
                                <SVGIcon name='check' width={24} height={24} fill='#2C8267' /> {alert}
                            </Alert>
                        )}
                        <div className='layoutCard'>
                            <div className='header-version'>
                                <div className='header-version-title'>
                                    <h1>{projectName}</h1>
                                </div>
                                <div className='header-version-status'>
                                    {applicationType === DarHelperUtil.darApplicationTypes.amendment &&
                                    applicationStatus !== DarHelperUtil.darStatus.approved &&
                                    applicationStatus !== DarHelperUtil.darStatus['approved with conditions'] &&
                                    applicationStatus !== DarHelperUtil.darStatus.rejected ? (
                                        <>
                                            <SLA
                                                classProperty={DarHelperUtil.darStatusColours[applicationStatus]}
                                                text={
                                                    applicationStatus === DarHelperUtil.darStatus.inProgress
                                                        ? 'Pre-submission amendment'
                                                        : 'Amendment in review'
                                                }
                                            />
                                            <SLA
                                                classProperty={DarHelperUtil.darStatusColours.approved}
                                                text={DarHelperUtil.darSLAText.approved}
                                            />
                                        </>
                                    ) : (
                                        <SLA
                                            classProperty={DarHelperUtil.darStatusColours[applicationStatus]}
                                            text={DarHelperUtil.darSLAText[applicationStatus]}
                                            applicationType={applicationType}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className='body'>
                                <AccessActivity
                                    datasets={datasets}
                                    applicationStatus={applicationStatus}
                                    publisher={publisher}
                                    updatedAt={updatedAt}
                                    applicants={applicants}
                                    dateSubmitted={dateSubmitted}
                                    team={team}
                                    workflow={workflow}
                                    workflowName={workflowName}
                                    workflowCompleted={workflowCompleted}
                                    reviewStatus={reviewStatus}
                                    deadlinePassed={deadlinePassed}
                                    decisionStatus={decisionStatus}
                                    decisionMade={decisionMade}
                                    isReviewer={isReviewer}
                                    stepName={stepName}
                                    remainingActioners={remainingActioners}
                                    navigateToLocation={onClickStartReview}
                                    latestVersion={dataaccessrequest}
                                    amendmentStatus={amendmentStatus}
                                    isStartReviewEnabled
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={1} />
            </Row>
            <Row>
                <Col xs={1} />
                <Col>
                    {activityLogs.map(version => {
                        return <ActivityLogVersionCard version={version} team={team} onDeleteEventClick={onDeleteEventClick} />;
                    })}
                </Col>
                <Col xs={1} />
            </Row>
            <WorkflowReviewStepsModal open={showWorkflowReviewModal} close={toggleWorkflowReviewModal} workflow={workflow} />
            <DeleteManualEventModal open={showDeleteEventModal} close={toggleDeleteEventModal} confirm={deleteManualEvent} />
            <AddNewEventModal
                dataaccessrequest={dataaccessrequest}
                isOpened={showAddNewEventModal}
                close={toggleAddNewEventModal}
                onClickAddEvent={submitManualEvent}
            />
            ​
        </>
    );
});

export default ActivityLog;
