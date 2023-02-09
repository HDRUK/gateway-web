import * as Sentry from '@sentry/react';
import axios from 'axios';
import _ from 'lodash';
import { useState, useEffect, createRef } from 'react';
import { Route, useHistory, useLocation, withRouter } from 'react-router-dom';

import { generalUtils, authUtils } from 'utils';

import { AccountTeamManagementPage } from 'pages';
import { AccountNavMenu } from 'modules';
import { useAccountTeamSelected, useCustodianRoles } from 'hooks';
import { useAuth } from 'context/AuthContext';
import { DashboardProvider } from '../../context/DashboardContext';
import { ReactComponent as CheckSVG } from '../../images/check.svg';

import ActionBar from '../commonComponents/actionbar/ActionBar';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActivityLog from '../DataAccessRequest/components/ActivityLog/ActivityLog';
import ActivityLogActionButtons from '../DataAccessRequest/components/ActivityLog/ActivityLogActionButtons';
import AccountAnalyticsDashboard from '../dashboard/AccountAnalyticsDashboard';
import AccountCollections from '../dashboard/AccountCollections';
import AccountCourses from '../dashboard/AccountCourses';
import AccountPapers from '../dashboard/AccountPapers';
import AccountTeams from '../dashboard/AccountTeams';
import AccountTools from '../dashboard/AccountTools';
import AccountUsers from '../dashboard/AccountUsers';
import AccountDataset from '../dashboard/Components/AccountDataset';
import AccountDatasets from '../dashboard/Components/AccountDatasets';
import AccountDataUse from '../dashboard/Components/AccountDataUse';
import CustomiseDAR from '../dashboard/CustomiseDAR/CustomiseDAR';
import './AccountPage.scss';
import DataAccessRequests from '../dashboard/DataAccessRequests/DataAccessRequests';
import ReviewTools from '../dashboard/ReviewTools';
import { tabTypes } from '../dashboard/Team/teamUtil';
import TeamHelp from '../dashboard/TeamHelp/TeamHelp';
import WorkflowDashboard from '../dashboard/Workflows/WorkflowDashboard';
import YourAccount from '../dashboard/YourAccount';
import googleAnalytics from '../../tracking';

const baseURL = require('../commonComponents/BaseURL').getURL();

const AccountPage = () => {
    const { userState } = useAuth();
    const location = useLocation();
    const { teamId, teamType } = useAccountTeamSelected();
    const { isReviewer, isCustodianDarManager, isCustodianMetadataManager, isMetadataEditor } = useCustodianRoles(teamId);
    const [teamManagementTab, setTeamManagementTab] = useState();
    const [innertab, setInnertab] = useState(null);
    const [dataAccessRequest, setDataAccessRequest] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tabId, setTabId] = useState('');
    const [dashboardState, setDashboardState] = useState({});
    const [allowAccessRequestManagement, setAllowAccessRequestManagement] = useState(true);
    const [allowWorkflow, setAllowWorkflow] = useState(true);

    const [alert, setAlert] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(-1);
    const [context, setContext] = useState({});
    const [profileComplete, setProfileComplete] = useState(true);
    const [savedTeamNotificationSuccess, setSavedTeamNotificationSuccess] = useState(false);
    const [accountUpdated, setAccountUpdated] = useState(false);
    const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
    const [showHowToRequestAccessEditor, setShowHowToRequestAccessEditor] = useState(false);
    const [publisherDetails, setPublisherDetails] = useState({});
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState('');
    const searchBar = createRef();
    const activityLog = createRef();
    const history = useHistory();

    let saveNotificationsRef;

    const updateProfileStatus = () => {
        history.push({
            pathname: '/account',
            search: '?tab=youraccount&teamType=user',
        });

        if (userState[0].terms) {
            setProfileComplete(true);
            axios.patch(`${baseURL}/api/v1/person/profileComplete/${userState[0].id}`);
        }
    };

    useEffect(() => {
        const queryParams = generalUtils.parseQueryString(location.search);
        setTabId(queryParams.tab);

        if (tabId !== queryParams.tab) {
            googleAnalytics.recordVirtualPageView(queryParams.tab);
        }

        setAccountUpdated(!!queryParams.accountUpdated);
    }, [location.search]);

    // 1. used for DAR custodian update status of application
    useEffect(() => {
        if (!location?.state?.alert) return;
        const { state } = location;
        const { alert } = state;

        setAlert(alert);

        if (alert.nav) {
            setTabId(alert.nav);
        }

        setTimeout(() => {
            setAlert({});
        }, 10000);
    }, [location?.state?.alert]);

    const getTeamDetails = async () => {
        if (authUtils.getIsTypeTeam(teamType)) {
            setDashboardState({
                isLoading: true,
            });

            await axios.get(`${baseURL}/api/v1/publishers/${teamId}`).then(res => {
                const { publisher } = res.data;

                if (!publisher.allowAccessRequestManagement && tabId === 'dataaccessrequests') {
                    setTabId('teamManagement');
                }

                setAllowWorkflow(publisher.workflowEnabled);
                setAllowAccessRequestManagement(publisher.allowAccessRequestManagement);
                setPublisherDetails(publisher.publisherDetails);
                setDashboardState({
                    isLoading: false,
                    isFederated: !_.isEmpty(publisher.federation) && publisher.federation.active,
                });
            });
        }
    };

    useEffect(() => {
        if (!teamId) return;
        getTeamDetails();
    }, [teamId]);

    useEffect(() => {
        let updatedActiveAccordion = -1;
        if (tabId === 'dataaccessrequests' || tabId === 'workflows') {
            updatedActiveAccordion = '0';
        } else if (tabId === 'customisedataaccessrequests_applicationform' || tabId === 'customisedataaccessrequests_guidance') {
            updatedActiveAccordion = '1';
        } else if (tabId === 'datause' || tabId === 'datause_widget') {
            updatedActiveAccordion = '2';
        }
        setActiveAccordion(updatedActiveAccordion);
    }, [tabId]);

    useEffect(() => {
        if (!profileComplete) {
            updateProfileStatus();
        }
    }, [profileComplete]);

    const toggleDrawer = topicId => {
        setShowDrawer(prevState => {
            if (prevState === true) {
                searchBar.current.getNumberOfUnreadMessages();
            }
            return !prevState;
        });

        setSelectedTopicId(topicId);
    };

    const toggleModal = (showEnquiry = false, context = {}) => {
        setShowModal(prevState => !prevState);
        setContext(context);
        setShowDrawer(showEnquiry);
    };

    const userHasTeamRole = role => {
        return authUtils.userHasTeamRole(userState, teamId, role);
    };

    const onSaveNotificationsClick = () => {
        // using forward ref call our save function inside child component
        saveNotificationsRef();
    };

    // the onchange handler for when the user saves team management
    const onTeamManagementSave = (isSubmitting, savedTeamNotificationSuccess) => {
        setIsSubmitting(isSubmitting);
        setSavedTeamNotificationSuccess(savedTeamNotificationSuccess);
    };

    const onTeamManagementTabChange = tab => {
        setTeamManagementTab(tab);
    };

    const onClearInnerTab = () => {
        setInnertab(null);
    };

    const updateDataAccessRequest = (dar = {}) => {
        setDataAccessRequest(dar);
    };

    const navigateToLocation = (e, applicationId) => {
        e.stopPropagation();

        const [id] = e.currentTarget.id.split('_');

        switch (id) {
            case 'startReview':
                startWorkflowReview(applicationId);
                break;
            default:
                break;
        }
    };

    const startWorkflowReview = async applicationId => {
        await axios
            .put(`${baseURL}/api/v1/data-access-request/${applicationId}/startreview`)
            .then(() => {
                window.location.href = `/data-access-request/${applicationId}`;
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    const loadActivityLogNotifications = () => {
        searchBar.current.getNumberOfUnreadNotifications();
        searchBar.current.doMessagesCall();
    };

    const handleCustomiseDARSelectTab = id => {
        setTabId(id);
    };

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal />}>
            <DashboardProvider value={dashboardState}>
                <SearchBar ref={searchBar} doToggleDrawer={toggleDrawer} userState={userState} />

                <div className='container-wrap'>
                    <AccountNavMenu
                        tabId={tabId}
                        setActiveAccordion={setActiveAccordion}
                        activeAccordion={activeAccordion}
                        allowAccessRequestManagement={allowAccessRequestManagement}
                        publisherDetails={publisherDetails}
                        allowWorkflow={allowWorkflow}
                    />

                    <div className='col-sm-12 col-md-10 margin-top-32'>
                        {/* TODO: GAT-1510:057 */}
                        {authUtils.getIsTypeUser(teamType) && (
                            <>
                                {tabId === 'dashboard' && <AccountAnalyticsDashboard userState={userState} />}

                                {tabId === 'youraccount' && <YourAccount userState={userState} accountUpdated={accountUpdated} />}

                                {tabId === 'tools' && <AccountTools />}

                                {tabId === 'reviews' && <ReviewTools userState={userState} />}

                                {tabId === 'papers' && <AccountPapers />}

                                {tabId === 'courses' && <AccountCourses />}

                                {tabId === 'dataaccessrequests' &&
                                    (_.isEmpty(dataAccessRequest) ? (
                                        <DataAccessRequests
                                            setDataAccessRequest={updateDataAccessRequest}
                                            userState={userState}
                                            teamId={teamId}
                                            teamType={teamType}
                                            alert={alert}
                                        />
                                    ) : (
                                        <ActivityLog
                                            onClickStartReview={navigateToLocation}
                                            dataaccessrequest={dataAccessRequest}
                                            userState={userState}
                                            teamType={teamType}
                                            ref={activityLog}
                                            onUpdateLogs={loadActivityLogNotifications}
                                        />
                                    ))}

                                {tabId === 'collections' && <AccountCollections userState={userState} />}

                                {tabId === 'usersroles' && <AccountUsers userState={userState} />}
                            </>
                        )}

                        <Route path='/account/datasets/:id' teamType={teamType} component={AccountDataset} />

                        {/* TODO: GAT-1510:058 */}
                        {(authUtils.getIsTypeTeam(teamType) || authUtils.getIsTypeHDRAdmin(teamType)) && (
                            <>
                                {/* TODO: GAT-1510:010 */}
                                {allowAccessRequestManagement && [isReviewer, isCustodianDarManager].some(role => role) && (
                                    <>
                                        {' '}
                                        {tabId === 'dataaccessrequests' &&
                                            (_.isEmpty(dataAccessRequest) ? (
                                                <DataAccessRequests
                                                    setDataAccessRequest={updateDataAccessRequest}
                                                    userState={userState}
                                                    teamId={teamId}
                                                    teamType={teamType}
                                                    alert={alert}
                                                />
                                            ) : (
                                                <ActivityLog
                                                    onClickStartReview={navigateToLocation}
                                                    dataaccessrequest={dataAccessRequest}
                                                    userState={userState}
                                                    teamType={teamType}
                                                    ref={activityLog}
                                                    onUpdateLogs={loadActivityLogNotifications}
                                                />
                                            ))}
                                    </>
                                )}
                                {/* TODO: GAT-1510:011 */}
                                {([isCustodianMetadataManager, isMetadataEditor].some(role => role) ||
                                    authUtils.getIsTypeHDRAdmin(teamType)) &&
                                    tabId === 'datasets' && (
                                        <AccountDatasets userState={userState} teamType={teamType} teamId={teamId} alert={alert} />
                                    )}

                                {authUtils.getIsTypeHDRAdmin(teamType) && tabId === 'teams' && (
                                    <AccountTeams userState={userState} alert={alert} />
                                )}

                                {isCustodianDarManager && (tabId === 'datause' || tabId === 'datause_widget') && (
                                    <AccountDataUse tabId={tabId} teamType={teamType} teamId={teamId} publisherDetails={publisherDetails} />
                                )}

                                {/* TODO: GAT-1510:012 */}
                                {allowWorkflow && isCustodianDarManager && tabId === 'workflows' && (
                                    <WorkflowDashboard userState={userState} teamId={teamId} />
                                )}

                                {/* TODO: GAT-1510:013 */}
                                {(isCustodianDarManager || authUtils.getIsTeamAdmin(userState, teamId)) &&
                                    (tabId === 'customisedataaccessrequests_applicationform' ||
                                        tabId === 'customisedataaccessrequests_guidance') && (
                                        <CustomiseDAR
                                            userState={userState}
                                            publisherId={teamId}
                                            showConfirmPublishModal={showConfirmPublishModal}
                                            setShowConfirmPublishModal={show => setShowConfirmPublishModal(show)}
                                            showHowToRequestAccessEditor={showHowToRequestAccessEditor}
                                            setShowHowToRequestAccessEditor={show => setShowHowToRequestAccessEditor(show)}
                                            activeTab={tabId}
                                            onSelectTab={handleCustomiseDARSelectTab}
                                            alert={alert}
                                        />
                                    )}

                                {tabId === 'teamManagement' && (
                                    <AccountTeamManagementPage
                                        userState={userState}
                                        teamId={teamId}
                                        innerTab={innertab}
                                        forwardRef={c => {
                                            saveNotificationsRef = c;
                                        }}
                                        onTeamManagementSave={onTeamManagementSave}
                                        onTeamManagementTabChange={onTeamManagementTabChange}
                                        onClearInnerTab={onClearInnerTab}
                                    />
                                )}

                                {tabId === 'help' ? <TeamHelp /> : ''}
                            </>
                        )}
                    </div>
                </div>

                {!_.isEmpty(dataAccessRequest) && (
                    <ActionBar userState={userState}>
                        <div className='action-bar'>
                            <div className='action-bar-actions'>
                                <ActivityLogActionButtons
                                    teamType={teamType}
                                    latestVersion={dataAccessRequest}
                                    onClickStartReview={navigateToLocation}
                                    activityLog={activityLog}
                                    onClickAddNewEvent={() => activityLog.current.showAddNewEventModal()}
                                />
                            </div>
                        </div>
                    </ActionBar>
                )}

                <SideDrawer open={showDrawer} closed={toggleDrawer}>
                    <UserMessages
                        userState={userState[0]}
                        closed={toggleDrawer}
                        toggleModal={toggleModal}
                        drawerIsOpen={showDrawer}
                        selectedTopicId={selectedTopicId}
                    />
                </SideDrawer>
                {tabId === 'teamManagement' && teamManagementTab === tabTypes.Notifications && (
                    <ActionBar userState={userState}>
                        <div>
                            <button
                                className={savedTeamNotificationSuccess ? 'button-teal' : 'button-primary'}
                                type='button'
                                onClick={onSaveNotificationsClick}
                                disabled={isSubmitting}>
                                {' '}
                                {savedTeamNotificationSuccess ? (
                                    <div>
                                        <CheckSVG fill='#fff' className='submitClose' /> Saved
                                    </div>
                                ) : (
                                    'Save'
                                )}
                            </button>
                        </div>
                    </ActionBar>
                )}

                <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
            </DashboardProvider>
        </Sentry.ErrorBoundary>
    );
};

export default withRouter(AccountPage);
