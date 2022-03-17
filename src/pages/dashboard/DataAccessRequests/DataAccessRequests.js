import React, { Fragment } from 'react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as Clock } from '../../../images/clock.svg';
import Loading from '../../commonComponents/Loading';
import SLA from '../../commonComponents/sla/SLA';
import TimeDuration from '../../commonComponents/timeDuration/TimeDuration';
import WorkflowReviewStepsModal from '../../commonComponents/workflowReviewStepsModal/WorkflowReviewStepsModal';
import CommentItem from './CommentItem/CommentItem';
import AccessActivity from './AccessActivity/AccessActivity';
import { baseURL } from '../../../configs/url.config';
import DarHelperUtil from '../../../utils/DarHelper.util';
import VersionSelector from '../../commonComponents/versionSelector/VersionSelector';
import './DataAccessRequests.scss';

class DataAccessRequestsNew extends React.Component {
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
        team: 'user',
        avgDecisionTime: 0,
        alert: {},
        showWorkflowReviewModal: false,
        canViewSubmitted: false,
        flagClosed: true,
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;

        const teamIs = props.userState[0].teams.filter(t => {
            return t._id === props.team;
        })[0];
        if (!_.isEmpty(teamIs)) {
            this.state.team = teamIs.name;
        } else {
            this.state.team = 'user';
        }
        if (!_.isEmpty(props.alert)) {
            this.state.alert = props.alert;
            this.state.team = props.alert.publisher;
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.fetchDataAccessRequests(this.state);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.team !== this.props.team) {
            const teamIs = this.props.userState[0].teams.filter(t => {
                return t._id === nextProps.team;
            })[0];
            let updatedProp = _.cloneDeep(nextProps);
            updatedProp.team = teamIs.name;

            this.setState({ isLoading: true });
            this.fetchDataAccessRequests(updatedProp);
        }

        this.setState({ alert: nextProps.alert });
    }

    componentWillUnmount() {
        clearTimeout(this.alertTimeOut);
    }

    async fetchDataAccessRequests(nextProps) {
        let data = [],
            avgDecisionTime = 0,
            canViewSubmitted = false;
        let dataProps = { ...nextProps, key: 'all' };
        // 1. if there is an alert set team and correct tab so it can display on the UI
        if (!_.isEmpty(this.state.alert)) {
            dataProps.team = this.state.alert.publisher;
            dataProps.key = this.state.alert.tab;
        }
        // 2. check which API to call the user or custodian if a team and use team name
        const teamExists = !_.isEmpty(dataProps.team) ? true : false;
        if (teamExists && dataProps.team !== 'user') {
            const response = await axios.get(`${baseURL}/api/v1/publishers/${dataProps.team}/dataaccessrequests`);
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
        let counts = DarHelperUtil.generateStatusCounts(screenData);
        // 5. set state
        this.setState({
            data: screenData,
            isLoading: false,
            team: dataProps.team,
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
        let statusKey = DarHelperUtil.darStatus[key];
        let { data } = this.state;

        if (statusKey === 'all') {
            let screenData = [...data].reduce((arr, item) => {
                if (item.applicationStatus !== DarHelperUtil.darStatus.inProgress || this.state.team === 'user') {
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
            <Row className='mt-3'>
                <Col xs={1}></Col>
                <Col xs={10}>
                    <Alert variant={'success'} className='col-sm-12 main-alert'>
                        <SVGIcon name='check' width={18} height={18} fill={'#2C8267'} /> {message}
                    </Alert>
                </Col>
                <Col xs={1}></Col>
            </Row>
        );
    };

    generatePreSubmissionWarning = () => {
        return (
            <Row className='mt-3'>
                <Col>
                    <Alert variant={'warning'} className='col-sm-12 main-alert'>
                        <i class='fas fa-exclamation-circle ' />
                        &nbsp;The applicant has not completed these applications yet. The applicant may give you access in order to clarify
                        some questions.
                    </Alert>
                </Col>
            </Row>
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
                        applicationStatus: DarHelperUtil.darStatus[`${applicationStatus}`],
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
                return <CommentItem text={applicationStatusDesc} title={DarHelperUtil.darCommentTitle[applicationStatus]} />;
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
            applicationType = DarHelperUtil.darApplicationTypes.initial,
        } = accessRequest;
        let diff = 0;
        let sinceText = '';

        if (applicationStatus === DarHelperUtil.darStatus.inProgress) {
            sinceText = 'since start';
            diff = this.calculateTimeDifference(createdAt);
        } else if (applicationStatus === DarHelperUtil.darStatus.submitted || applicationStatus === DarHelperUtil.darStatus.inReview) {
            sinceText = applicationType === DarHelperUtil.darApplicationTypes.initial ? 'since submission' : 'since resubmission';
            diff = this.calculateTimeDifference(dateSubmitted);
        } else if (
            applicationStatus === DarHelperUtil.darStatus.approved ||
            applicationStatus === DarHelperUtil.darStatus['approved with conditions'] ||
            applicationStatus === DarHelperUtil.darStatus.rejected
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
        const {
            isLoading,
            approvedCount,
            rejectedCount,
            preSubmissionCount,
            submittedCount,
            inReviewCount,
            allCount,
            team,
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
            <Fragment>
                <Fragment>{!_.isEmpty(alert) && !_.isNil(alert.message) ? this.generateAlert() : ''}</Fragment>
                <Row>
                    <Col xs={1}></Col>
                    <div className='col-sm-10'>
                        <div className='accountHeader dataAccessHeader'>
                            <Col xs={8}>
                                <Row>
                                    <div className='black-20'>
                                        Data access request applications {!_.isEmpty(team) && team !== 'user' ? team : ''}
                                    </div>
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
                                    {preSubmissionCount > 0 || team === 'user' ? (
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

                        {team !== 'user' && this.state.key === 'inProgress' ? this.generatePreSubmissionWarning() : ''}

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
                                                    {applicationType === DarHelperUtil.darApplicationTypes.amendment &&
                                                    applicationStatus !== DarHelperUtil.darStatus.approved &&
                                                    applicationStatus !== DarHelperUtil.darStatus['approved with conditions'] &&
                                                    applicationStatus !== DarHelperUtil.darStatus.rejected ? (
                                                        <>
                                                            <SLA
                                                                classProperty={DarHelperUtil.darStatusColours[applicationStatus]}
                                                                text={DarHelperUtil.darAmendmentSLAText[applicationStatus]}
                                                            />
                                                            <SLA
                                                                classProperty={DarHelperUtil.darStatusColours['approved']}
                                                                text={DarHelperUtil.darSLAText['approved']}
                                                            />
                                                        </>
                                                    ) : (
                                                        <SLA
                                                            classProperty={DarHelperUtil.darStatusColours[applicationStatus]}
                                                            text={DarHelperUtil.darSLAText[applicationStatus]}
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
            </Fragment>
        );
    }
}

export default DataAccessRequestsNew;
