import { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';

import { accountUtils, darHelperUtils } from 'utils';
import { Alert, LayoutContent } from 'components';

import { ReactComponent as Clock } from '../../../images/clock.svg';
import { baseURL } from '../../../configs/url.config';

import Loading from '../../commonComponents/Loading';
import SLA from '../../commonComponents/sla/SLA';
import TimeDuration from '../../commonComponents/timeDuration/TimeDuration';
import WorkflowReviewStepsModal from '../../commonComponents/workflowReviewStepsModal/WorkflowReviewStepsModal';
import CommentItem from './CommentItem/CommentItem';
import AccessActivity from './AccessActivity/AccessActivity';
import VersionSelector from '../../commonComponents/versionSelector/VersionSelector';
import './DataAccessRequests.scss';

class DataAccessRequestsNew extends Component {
    durationLookups = ['inProgress', 'submitted', 'inReview'];
    finalDurationLookups = ['rejected', 'approved', 'approved with conditions'];

    state = {
        userState: [],
        key: 'all',
        data: [],
        screenData: [],
        workflows: [],
        isLoading: true,
        allCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        archivedCount: 0,
        preSubmissionCount: 0,
        submittedCount: 0,
        inReviewCount: 0,
        teamTypeLabel: '',
        avgDecisionTime: 0,
        alert: {},
        showWorkflowReviewModal: false,
        canViewSubmitted: false,
        flagClosed: true,
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;

        const teamFound = props.userState[0].teams.filter(t => {
            return t._id === props.teamId;
        })[0];
        if (!_.isEmpty(teamFound)) {
            this.state.teamTypeLabel = teamFound.name;
        }
        if (!_.isEmpty(props.alert)) {
            this.state.alert = props.alert;
            this.state.teamTypeLabel = props.alert.publisher;
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({ alert: this.props.alert });
        this.fetchDataAccessRequests();
    }

    componentDidUpdate(prevProps) {
        if (this.props.teamId !== prevProps.teamId || this.props.teamType !== prevProps.teamType) {
            this.fetchDataAccessRequests();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.alertTimeOut);
    }

    async fetchDataAccessRequests() {
        let data = [],
            avgDecisionTime = 0,
            canViewSubmitted = false;
        let dataProps = { ...this.props, key: 'all' };

        // 1. if there is an alert set team and correct tab so it can display on the UI
        if (!_.isEmpty(this.state.alert)) {
            dataProps.teamTypeLabel = this.state.alert.publisher;
            dataProps.key = this.state.alert.tab;
        }
        // 2. check which API to call the user or custodian if a team and use team name
        const teamFound = accountUtils.getTeam(this.props.userState[0].teams, dataProps.teamId);

        if (teamFound && dataProps.teamType === 'team') {
            const response = await axios.get(`${baseURL}/api/v1/publishers/${teamFound.name}/dataaccessrequests`);
            ({
                data: { data, avgDecisionTime, canViewSubmitted },
            } = response);
        } else {
            const response = await axios.get(`${baseURL}/api/v1/data-access-request`);
            ({
                data: { data, avgDecisionTime, canViewSubmitted },
            } = response);
        }
        // 3. modifies approve with conditions to approved
        let screenData = this.formatScreenData(data);
        // 4. count stats
        let counts = darHelperUtils.generateStatusCounts(screenData);
        // 5. set state
        this.setState({
            data: screenData,
            isLoading: false,
            avgDecisionTime,
            canViewSubmitted,
            ...counts,
        });
        // 6. set tab
        this.onTabChange(dataProps.key);
    }

    toggleWorkflowReviewModal = e => {
        this.setState(prevState => {
            return {
                showWorkflowReviewModal: !prevState.showWorkflowReviewModal,
            };
        });
    };

    onTabChange = key => {
        let statusKey = darHelperUtils.darStatus[key];
        let { data } = this.state;

        if (statusKey === 'all') {
            let screenData = [...data].reduce((arr, item) => {
                if (item.applicationStatus !== darHelperUtils.darStatus.inProgress || this.props.teamType === 'user') {
                    arr.push({
                        ...item,
                    });
                }
                return arr;
            }, []);

            this.setState({ key, screenData, allCount: screenData.length });
        }

        if (statusKey !== 'all') {
            let screenData = [...data].reduce((arr, item) => {
                if (statusKey === item.applicationStatus) {
                    arr.push({
                        ...item,
                    });
                }
                return arr;
            }, []);
            this.setState({ key: key, screenData });
        }
    };

    generateAlert = () => {
        let {
            alert: { message = '' },
        } = this.state;

        return (
            <LayoutContent>
                <Alert variant='success' mt={3}>
                    {message}
                </Alert>
            </LayoutContent>
        );
    };

    generatePreSubmissionWarning = () => {
        return (
            <Alert variant='warning' mt={3}>
                The applicant has not completed these applications yet. The applicant may give you access in order to clarify some
                questions.
            </Alert>
        );
    };

    formatScreenData = (data = []) => {
        if (!_.isEmpty(data)) {
            return [...data].reduce((arr, item) => {
                let { applicationStatus } = item;
                return [
                    ...arr,
                    {
                        ...item,
                        applicationStatus: darHelperUtils.darStatus[`${applicationStatus}`],
                    },
                ];
            }, []);
        }
        return [];
    };

    calculateTimeDifference = startTime => {
        let start = moment(startTime);
        let end = moment();
        return end.diff(start, 'days');
    };

    renderComment = (
        applicationStatusDesc = '',
        applicationStatus = '',
        decisionComments = '',
        reviewPanels = '',
        decisionMade = false,
        decisionApproved = false,
        decisionDate
    ) => {
        const decisionApprovedType = decisionApproved ? 'No issues found:' : 'Issues found:';
        if (!_.isEmpty(applicationStatusDesc) && !_.isEmpty(applicationStatus)) {
            if (this.finalDurationLookups.includes(applicationStatus)) {
                return <CommentItem text={applicationStatusDesc} title={darHelperUtils.darCommentTitle[applicationStatus]} />;
            }
        } else if (decisionMade && !this.finalDurationLookups.includes(applicationStatus)) {
            return (
                <CommentItem
                    text={decisionComments}
                    title={'Phase decision'}
                    subtitle={`${decisionApprovedType} ${reviewPanels}`}
                    decisionDate={decisionDate}
                />
            );
        }
        return '';
    };

    renderDuration = accessRequest => {
        const {
            applicationStatus = '',
            createdAt,
            dateSubmitted,
            decisionDuration = '',
            applicationType = darHelperUtils.darApplicationTypes.initial,
        } = accessRequest;
        let diff = 0;
        let sinceText = '';

        if (applicationStatus === darHelperUtils.darStatus.inProgress) {
            sinceText = 'since start';
            diff = this.calculateTimeDifference(createdAt);
        } else if (applicationStatus === darHelperUtils.darStatus.submitted || applicationStatus === darHelperUtils.darStatus.inReview) {
            sinceText = applicationType === darHelperUtils.darApplicationTypes.initial ? 'since submission' : 'since resubmission';
            diff = this.calculateTimeDifference(dateSubmitted);
        } else if (
            applicationStatus === darHelperUtils.darStatus.approved ||
            applicationStatus === darHelperUtils.darStatus['approved with conditions'] ||
            applicationStatus === darHelperUtils.darStatus.rejected
        ) {
            if (!_.isEmpty(decisionDuration.toString())) {
                sinceText = 'total';
                diff = decisionDuration;
            }
        }

        if (!_.isEmpty(sinceText)) {
            return <TimeDuration text={`${diff} days ${sinceText}`} />;
        } else {
            return '';
        }
    };

    navigateToLocation = (e, projectId) => {
        e.stopPropagation();
        // 1. split the id up into two parts
        const [id, uniqueId] = e.currentTarget.id.split('_');
        // 2. test the Id we have clicked on
        switch (id) {
            case 'versionSelector':
                return;
            case 'workflow':
                // 3. get workflows remove undefined values from map
                const workflows = _.without(
                    [...this.state.screenData].map(d => d.workflow),
                    undefined
                );
                // 4. if workflows in array
                if (!_.isEmpty(workflows)) {
                    // 5. find the workflow
                    const workflow = workflows.find(w => w._id === uniqueId) || {};
                    if (!_.isEmpty(workflow)) {
                        // 6. set state
                        this.setState({ workflow });
                        // 7. display showWorkflowReviewModal
                        this.toggleWorkflowReviewModal();
                    }
                }
                break;
            default:
                // select the latest version of an application given the projectId
                const latestApplicationVersion = this.state.screenData
                    .filter(application => application.projectId === projectId)
                    .reduce(function (prevApplication, currentApplication) {
                        return prevApplication.majorVersion > currentApplication.majorVersion ? prevApplication : currentApplication;
                    });
                this.props.setDataAccessRequest(latestApplicationVersion);
                break;
        }
    };

    renderAverageSubmission = () => {
        return (<Clock />)`${this.state.avgDecisionTime} average time from submission to decision`;
    };

    render() {
        const { teamType } = this.props;

        const {
            isLoading,
            approvedCount,
            rejectedCount,
            preSubmissionCount,
            submittedCount,
            inReviewCount,
            allCount,
            teamTypeLabel,
            alert,
            screenData,
            avgDecisionTime,
            canViewSubmitted,
        } = this.state;

        if (isLoading) {
            return (
                <Row>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Loading />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            );
        }

        return (
            <>
                <>{!_.isEmpty(alert) && !_.isNil(alert.message) ? this.generateAlert() : ''}</>
                <Row>
                    <Col xs={1}></Col>
                    <div className='col-sm-10'>
                        <div className='accountHeader dataAccessHeader'>
                            <Col xs={8}>
                                <Row>
                                    <div className='black-20'>Data access request applications {teamTypeLabel}</div>
                                    <div className='gray700-13'>Manage forms and applications</div>
                                    <div>
                                        <Clock /> {`${avgDecisionTime > 0 ? avgDecisionTime : '-'} days`}{' '}
                                        <span className='gray700-13'>average time from submission to decision</span>
                                    </div>
                                </Row>
                            </Col>
                            <Col xs={4} style={{ textAlign: 'right' }}></Col>
                        </div>

                        <div className='tabsBackground'>
                            <Col sm={12} lg={12}>
                                <Tabs className='dataAccessTabs gray700-13' activeKey={this.state.key} onSelect={this.onTabChange}>
                                    <Tab eventKey='all' title={'All (' + allCount + ')'}></Tab>
                                    {preSubmissionCount > 0 || teamType === 'user' ? (
                                        <Tab eventKey='inProgress' title={'Pre-submission (' + preSubmissionCount + ')'}></Tab>
                                    ) : (
                                        ''
                                    )}
                                    {canViewSubmitted ? <Tab eventKey='submitted' title={'Submitted (' + submittedCount + ')'}></Tab> : ''}
                                    <Tab eventKey='inReview' title={'In review (' + inReviewCount + ')'}></Tab>
                                    <Tab eventKey='approved' title={'Approved (' + approvedCount + ')'}></Tab>
                                    <Tab eventKey='rejected' title={'Rejected (' + rejectedCount + ')'}></Tab>
                                </Tabs>
                            </Col>
                        </div>

                        {teamType !== 'user' && this.state.key === 'inProgress' ? this.generatePreSubmissionWarning() : ''}

                        {screenData.map((request, i) => {
                            let {
                                datasets = [],
                                updatedAt,
                                applicants = '',
                                publisher = '',
                                dateSubmitted = new Date(),
                                applicationStatus,
                                applicationStatusDesc = '',
                                projectName = '',
                                workflow = {},
                                workflowName = '',
                                workflowCompleted = false,
                                reviewStatus = '',
                                deadlinePassed = false,
                                decisionComments = '',
                                decisionStatus = '',
                                decisionMade = false,
                                decisionApproved = false,
                                reviewPanels = '',
                                isReviewer = false,
                                stepName = '',
                                remainingActioners = [],
                                decisionDate,
                                amendmentStatus = '',
                                versions = [],
                                applicationType = 'initial',
                                projectId,
                            } = request;

                            const selectedVersion = versions.find(v => v.isCurrent)?.displayTitle;

                            return (
                                <Row key={`request_${i}`} onClick={e => this.navigateToLocation(e, projectId)}>
                                    <div className='col-md-12'>
                                        <div className='layoutCard'>
                                            <div className='header-version'>
                                                <div className='header-version-title'>
                                                    <h1>{projectName}</h1>
                                                    {versions.length > 1 ? (
                                                        <VersionSelector
                                                            selectedVersion={selectedVersion}
                                                            versionList={versions}
                                                            displayType='chevron'
                                                            onToggleClick={this.navigateToLocation}
                                                        />
                                                    ) : (
                                                        <span className='gray800-14 mb-2'>Version 1.0</span>
                                                    )}
                                                </div>
                                                <div className='header-version-status'>
                                                    {this.renderDuration(request)}
                                                    {applicationType === darHelperUtils.darApplicationTypes.amendment &&
                                                    applicationStatus !== darHelperUtils.darStatus.approved &&
                                                    applicationStatus !== darHelperUtils.darStatus['approved with conditions'] &&
                                                    applicationStatus !== darHelperUtils.darStatus.rejected ? (
                                                        <>
                                                            <SLA
                                                                classProperty={darHelperUtils.darStatusColours[applicationStatus]}
                                                                text={darHelperUtils.darAmendmentSLAText[applicationStatus]}
                                                            />
                                                            <SLA
                                                                classProperty={darHelperUtils.darStatusColours['approved']}
                                                                text={darHelperUtils.darSLAText['approved']}
                                                            />
                                                        </>
                                                    ) : (
                                                        <SLA
                                                            classProperty={darHelperUtils.darStatusColours[applicationStatus]}
                                                            text={darHelperUtils.darSLAText[applicationStatus]}
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
                                                    teamType={teamType}
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
                                                    navigateToLocation={this.navigateToLocation}
                                                    amendmentStatus={amendmentStatus}
                                                    isStartReviewEnabled={false}
                                                />
                                            </div>
                                            {this.renderComment(
                                                applicationStatusDesc,
                                                applicationStatus,
                                                decisionComments,
                                                reviewPanels,
                                                decisionMade,
                                                decisionApproved,
                                                decisionDate
                                            )}
                                        </div>
                                    </div>
                                </Row>
                            );
                        })}
                    </div>
                    {/*CLOSE col-sm-10 */}
                    <Col xs={1}></Col>
                </Row>
                <WorkflowReviewStepsModal
                    open={this.state.showWorkflowReviewModal}
                    close={this.toggleWorkflowReviewModal}
                    workflow={this.state.workflow}
                />
                ​
            </>
        );
    }
}

export default DataAccessRequestsNew;
