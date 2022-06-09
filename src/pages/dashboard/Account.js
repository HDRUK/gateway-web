import * as Sentry from '@sentry/react';
import axios from 'axios';
import _ from 'lodash';
import queryString from 'query-string';
import React, { Component, Fragment, useState } from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';
import 'react-web-tabs/dist/react-web-tabs.css';
import { DashboardProvider } from '../../context/DashboardContext';
import { ReactComponent as CheckSVG } from '../../images/check.svg';
import { ReactComponent as ChevronRightSvg } from '../../images/chevron-bottom.svg';
import { ReactComponent as BarChartIcon } from '../../images/icons/bar-chart.svg';
import { ReactComponent as BookmarkIcon } from '../../images/icons/bookmark.svg';
import { ReactComponent as CommentsIcon } from '../../images/icons/comments.svg';
import { ReactComponent as CoursesIcon } from '../../images/icons/courses.svg';
import { ReactComponent as FlowIcon } from '../../images/icons/flow.svg';
import { ReactComponent as HelpIcon } from '../../images/icons/help.svg';
import { ReactComponent as PapersIcon } from '../../images/icons/papers.svg';
import { ReactComponent as ServerIcon } from '../../images/icons/server.svg';
import { ReactComponent as SettingsIcon } from '../../images/icons/settings.svg';
import { ReactComponent as ToolsIcon } from '../../images/icons/tools.svg';
import { ReactComponent as UserIcon } from '../../images/icons/user.svg';
import { ReactComponent as UsersIcon } from '../../images/icons/users.svg';
import SVGIcon from '../../images/SVGIcon';
import googleAnalytics from '../../tracking';
import { getTeam, isAdmin, isCustodian, isUser } from '../../utils/auth';
import { isRouteMatch } from '../../utils/router';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActivityLog from '../DataAccessRequest/components/ActivityLog/ActivityLog';
import ActivityLogActionButtons from '../DataAccessRequest/components/ActivityLog/ActivityLogActionButtons';
import AccountAnalyticsDashboard from './AccountAnalyticsDashboard';
import AccountCollections from './AccountCollections';
import AccountCourses from './AccountCourses';
import AccountPapers from './AccountPapers';
import AccountTeamManagement from './AccountTeamManagement';
import AccountTeams from './AccountTeams';
import AccountTools from './AccountTools';
import AccountUsers from './AccountUsers';
import AccountDataset from './Components/AccountDataset';
import AccountDatasets from './Components/AccountDatasets';
import AccountDataUse from './Components/AccountDataUse';
import DashboardNavAccordian from './Components/DashboardNavAccordian';
import DashboardNavItem from './Components/DashboardNavItem';
import './Dashboard.scss';
import DataAccessRequests from './DataAccessRequests/DataAccessRequests';
import ReviewTools from './ReviewTools';
import { tabTypes } from './Team/teamUtil';
import TeamHelp from './TeamHelp/TeamHelp';
import WorkflowDashboard from './Workflows/WorkflowDashboard';
import YourAccount from './YourAccount';

var baseURL = require('../commonComponents/BaseURL').getURL();

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href='javascript:void(0)'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}>
        {children}
    </a>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled'>
                {React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

class Account extends Component {
    // callback declare
    alertTimeOut;
    // state init
    state = {
        searchString: '',
        id: '',
        isLoading: true,
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
                teams: [],
            },
        ],
        dashboardState: {},
        tabId: '',
        innertab: '',
        activeKey: '',
        team: 'user',
        alert: {},
        isDeleted: false,
        isApproved: false,
        isRejected: false,
        showDrawer: false,
        showModal: false,
        activeAccordion: -1,
        context: {},
        profileComplete: true,
        allowWorkflow: true,
        allowAccessRequestManagement: true,
        savedTeamNotificationSuccess: false,
        isSubmitting: false,
        teamManagementInternalTab: 'Notifications',
        accountUpdated: false,
        dataaccessrequest: {},
        publisherDetails: {},
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.searchBar = React.createRef();

        this.activityLog = React.createRef();

        // 1. used for DAR custodian update status of application
        if (_.has(props, 'location.state.alert')) {
            this.state.alert = props.location.state.alert;
            this.alertTimeOut = setTimeout(() => this.setState({ alert: {} }), 10000);
        }

        this.state.team = getTeam(props);

        if (_.has(props, 'profileComplete')) {
            this.state.profileComplete = props.profileComplete;
        }

        this.historyListener = props.history.listen(location => {
            if (location.state) {
                this.setState({
                    alert: location.state.alert || {},
                });
            }
        });
    }

    componentWillUnmount() {
        if (this.historyListener) this.historyListener();
    }

    async componentDidMount() {
        window.currentComponent = this;
        if (window.location.search) {
            let tab = '';
            let values = queryString.parse(window.location.search);
            if (values.tab !== this.state.tabId || !_.isUndefined(values.tab) || !_.isNull(values.tab)) {
                tab = this.checkRedirect(values);
                this.setState({
                    tabId: tab,
                    innertab: values.innertab ? values.innertab : '',
                    isDeleted: values.toolDeleted,
                    isApproved: values.toolApproved,
                    isRejected: values.toolRejected,
                    isReviewApproved: values.reviewApproved,
                    isReviewRejected: values.reviewRejected,
                    accountUpdated: !!values.accountUpdated,
                });
                this.toggleNav(tab);
            }
        }

        if (!this.state.profileComplete) {
            this.setState({ tabId: 'youraccount', team: 'user' });
            localStorage.setItem('HDR_TEAM', 'user');
            this.setProfileComplete();
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (window.location.search) {
            let values = queryString.parse(window.location.search);
            let team = 'user';
            if (values.tab !== this.state.tabId || !_.isUndefined(values.tab) || !_.isNull(values.tab)) {
                if (values.tab !== 'youraccount' && this.state.accountUpdated) {
                    this.setState({ accountUpdated: false });
                }
                if (_.has(nextProps, 'location.state.team') && nextProps.location.state.team !== '') {
                    team = nextProps.location.state.team;
                    localStorage.setItem('HDR_TEAM', nextProps.location.state.team);
                } else if (localStorage.getItem('HDR_TEAM') !== '') {
                    team = localStorage.getItem('HDR_TEAM');
                }

                let activeAccordion = -1;

                if (values.tab === 'dataaccessrequests' || values.tab === 'workflows') {
                    activeAccordion = '0';
                } else if (values.tab === 'datause' || values.tab === 'datause_widget') {
                    activeAccordion = '2';
                }

                this.setState({
                    tabId: values.tab,
                    isDeleted: values.accountDeleted,
                    isApproved: values.toolApproved,
                    isRejected: values.toolRejected,
                    isReviewApproved: values.reviewApproved,
                    isReviewRejected: values.reviewRejected,
                    team,
                    activeAccordion,
                });

                if (team !== 'user' && team !== 'admin') {
                    await axios.get(baseURL + `/api/v1/publishers/${team}`).then(res => {
                        let publisherDetails = res.data.publisher;
                        console.log(publisherDetails);
                        if (!publisherDetails.allowAccessRequestManagement && values.tab === 'dataaccessrequests')
                            this.setState({ tabId: 'teamManagement' });
                        this.setState({
                            allowWorkflow: publisherDetails.workflowEnabled,
                            allowAccessRequestManagement: publisherDetails.allowAccessRequestManagement,
                            publisherDetails: publisherDetails.publisherDetails,
                        });
                    });
                }

                if (team !== 'user' && team !== 'admin') {
                    this.setState({
                        dashboardState: {
                            isLoading: true,
                        },
                    });

                    await axios.get(baseURL + `/api/v1/publishers/${team}`).then(res => {
                        const { allowAccessRequestManagement, workflowEnabled, federation } = res.data.publisher;

                        if (!allowAccessRequestManagement && values.tab === 'dataaccessrequests') {
                            this.setState({ tabId: 'teamManagement' });
                        }

                        this.setState({
                            allowWorkflow: workflowEnabled,
                            allowAccessRequestManagement: allowAccessRequestManagement,
                            dashboardState: {
                                isLoading: false,
                                isFederated: !_.isEmpty(federation) && federation.active,
                            },
                        });
                    });
                }
            }
        }

        if (!this.state.profileComplete) {
            this.setState({ tabId: 'youraccount', team: 'user' });
            localStorage.setItem('HDR_TEAM', 'user');
            this.setProfileComplete();
        }
    }

    setProfileComplete() {
        if (this.state.userState[0].terms) {
            this.setState({ profileComplete: true });
            axios.patch(baseURL + `/api/v1/person/profileComplete/${this.state.userState[0].id}`);
        }
    }

    checkRedirect = values => {
        let { tab = '', team = '' } = values;
        if (!_.isEmpty(tab) && tab === 'dataaccessrequests') {
            if (!_.isEmpty(team)) return `${tab}&team=${team}`;

            return tab;
        }

        return tab;
    };

    doSearch = e => {
        // 1. fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    updateSearchString = searchString => {
        this.setState({ searchString: searchString });
    };

    /**
     * [generateTabObject - Creates object with team if needed]
     *
     * @param   {string}  tabId  [tabId]
     * @return  {Object}         [return new tab {tabId: '', team: ''}]
     */
    generateTabObject = tabId => {
        let tabSplit = tabId.split('&');
        let tab = tabSplit.reduce(
            (obj, item) => {
                let arr = item.split('=');
                let [key = '', value = ''] = arr;
                obj = { ...obj, tabId: key !== 'team' ? key : obj.tabId, team: key === 'team' ? value : obj.team };
                return obj;
            },
            { tabId: '', team: '' }
        );

        return tab;
    };

    toggleDrawer = selectedTopicId => {
        this.setState(prevState => {
            if (prevState.showDrawer === true) {
                this.searchBar.current.getNumberOfUnreadMessages();
            }
            return { showDrawer: !prevState.showDrawer, selectedTopicId };
        });
    };

    toggleModal = (showEnquiry = false, context = {}) => {
        this.setState(prevState => {
            return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
        });
    };

    isPublisher = () => {
        let { userState } = this.state;
        let [user] = userState;
        if (!_.isEmpty(user.teams)) {
            return [...user.teams].filter(p => p.type === 'publisher').length > 0 ? true : false;
        }
        return false;
    };

    /**
     * [renderPublishers Renders out publishers for DAR nav menu]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    renderPublishers() {
        let { userState } = this.state;
        let [user] = userState;
        if (!_.isEmpty(user.teams)) {
            const filterPublishers = [...user.teams].filter(p => p.type === 'publisher');
            if (!_.isEmpty(filterPublishers)) {
                return filterPublishers.map((pub, index) => {
                    return (
                        <>
                            {index === 0 ? <hr /> : ''}
                            <Dropdown.Item
                                className='gray700-13'
                                onClick={e => {
                                    this.toggleNav(`${this.state.tabId}&team=${pub._id}`);
                                    this.setState({ team: pub._id });
                                }}>
                                {pub.name}
                            </Dropdown.Item>
                        </>
                    );
                });
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    /**
     * [renderAdmin Renders out admin entry if admin team is found]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    renderAdmin() {
        let { userState } = this.state;
        let [user] = userState;
        const isAdmin = [...user.teams].filter(p => p.type === 'admin');

        if (!_.isEmpty(isAdmin)) {
            return (
                <Dropdown.Item
                    className='gray700-13'
                    onClick={e => {
                        this.toggleNav(`datasets&team=admin`);
                        this.setState({ team: 'admin' });
                    }}>
                    HDR Admin
                </Dropdown.Item>
            );
        } else {
            return '';
        }
    }

    renderCurrentTeam() {
        let { team: teamSelector, userState } = this.state;
        let renderItem;
        switch (teamSelector) {
            case 'user':
                renderItem = <Fragment>{userState[0].name}</Fragment>;
                break;
            case 'admin':
                renderItem = <Fragment>HDR Admin</Fragment>;
                break;
            default:
                const team = userState[0].teams.reduce((obj, team) => {
                    if (team._id === teamSelector) {
                        obj = { ...team };
                    }
                    return obj;
                }, {});
                if (_.isEmpty(team)) {
                    this.setState({ team: 'user' });
                    renderItem = <Fragment>{userState[0].name}</Fragment>;
                } else {
                    renderItem = <Fragment>{team.name}</Fragment>;
                }
                break;
        }
        return renderItem;
    }

    toggleNav = (tabId = '', path) => {
        googleAnalytics.recordVirtualPageView(tabId);
        let {
            activeAccordion,
            alert,
            userState: [user],
        } = { ...this.state };
        // 1. if alert set tabId as page has been redirected
        if (!_.isEmpty(alert)) {
            tabId = alert.nav;
        }
        // 2. make sure tabId is not empty
        if (!_.isEmpty(tabId)) {
            // 3. need to check for teams returns {tabId: '', team: ''}; eg dataccessrequests&team=ALLIANCE
            let tab = this.generateTabObject(tabId);
            // 4. check if user has teams and the current nav is dataaccessrequests, keep expanded
            if (!_.isEmpty(user.teams)) {
                if (tab.tabId === 'dataaccessrequests' || tab.tabId === 'workflows' || tab.tabId === 'addeditworkflow') {
                    activeAccordion = '0';
                } else if (tab.tabId === 'datause' || tab.tabId === 'datause_widget') {
                    activeAccordion = '2';
                }
            }

            if (!_.isEmpty(tab.team)) {
                localStorage.setItem('HDR_TEAM', tab.team);
                if (tab.team !== 'user' && tab.team !== 'admin') {
                    if (_.isEmpty(tab.tabId) || !['dataaccessrequests', 'datasets', 'teamManagement'].includes(tab.tabId)) {
                        if (this.userHasRole(tab.team, ['manager', 'reviewer'])) tab.tabId = 'dataaccessrequests';
                        else if (this.userHasRole(tab.team, 'metadata_editor')) tab.tabId = 'datasets';
                        else tab.tabId = 'teamManagement';
                    }
                }
            } else if (localStorage.getItem('HDR_TEAM') === '') localStorage.setItem('HDR_TEAM', 'user');
            // 5. set state
            this.setState({
                tabId: tab.tabId,
                team: tab.team,
                activeKey: tab.tabId,
                alert: !_.isEmpty(alert) ? alert : {},
                activeAccordion,
                dataaccessrequest: {},
            });
            // 6. push state
            this.props.history.push({ pathname: path || window.location.pathname, search: `?tab=${tab.tabId}`, state: { team: tab.team } });
        }
    };

    accordionClick = activeAccordion => {
        this.setState({ activeAccordion });
    };

    userHasRole(teamId, role) {
        const team = this.state.userState[0].teams.filter(t => {
            return t._id === teamId;
        })[0];
        return team && team.roles.some(r => role.includes(r));
    }

    onSaveNotificationsClick = () => {
        // using forward ref call our save function inside child component
        this.saveNotifiations();
    };

    // the onchange handler for when the user saves team management
    onTeamManagementSave = (isSubmitting, savedTeamNotificationSuccess) => {
        this.setState({ isSubmitting, savedTeamNotificationSuccess });
    };

    onTeamManagementTabChange = teamManagementTab => {
        this.setState({ teamManagementTab: teamManagementTab });
    };

    onTeamsTabChange = teamsTab => {
        this.setState({ teamsTab: teamsTab });
    };

    onClearInnerTab = () => {
        this.setState({ innertab: '' });
    };

    setDataAccessRequest = (dar = {}) => {
        this.setState({ dataaccessrequest: dar });
    };

    navigateToLocation = (e, applicationId) => {
        e.stopPropagation();

        let [id] = e.currentTarget.id.split('_');

        switch (id) {
            case 'startReview':
                this.startWorkflowReview(applicationId);
                break;
            default:
                break;
        }
    };

    startWorkflowReview = async applicationId => {
        await axios
            .put(`${baseURL}/api/v1/data-access-request/${applicationId}/startreview`)
            .then(() => {
                window.location.href = `/data-access-request/${applicationId}`;
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    loadActivityLogNotifications = () => {
        this.searchBar.current.getNumberOfUnreadNotifications();
        this.searchBar.current.doMessagesCall();
    };

    getNavActiveClass = key => {
        let isActive = false;

        if (Array.isArray(key)) {
            for (let i = 0; i < key.length; i++) {
                if (this.state.tabId === key[i] || isRouteMatch(`/account/${key[i]}`)) {
                    isActive = true;
                    break;
                }
            }
        } else {
            isActive = this.state.tabId === key || isRouteMatch(`/account/${key}`);
        }

        return isActive ? 'activeCard' : 'accountNav';
    };

    render() {
        const {
            searchString,
            userState,
            tabId,
            innertab,
            showDrawer,
            showModal,
            context,
            team,
            alert,
            activeAccordion,
            allowWorkflow,
            allowAccessRequestManagement,
            savedTeamNotificationSuccess,
            isSubmitting,
            teamManagementTab,
            accountUpdated,
            dataaccessrequest,
            publisherDetails,
        } = this.state;

        const TEAM_USERS_MENU = [
            {
                id: 'dashboard',
                children: 'Dashboard',
                icon: <BarChartIcon />,
            },
            {
                id: 'youraccount',
                children: 'Account',
                icon: <UserIcon />,
            },
            {
                id: 'tools',
                children: 'Tools',
                icon: <ToolsIcon />,
            },
            {
                id: 'review',
                children: 'Reviews',
                icon: <CommentsIcon />,
            },
            { id: 'datause', children: 'Data Uses', icon: <FlowIcon /> },
            { id: 'papers', children: 'Papers', icon: <PapersIcon /> },
            { id: 'courses', children: 'Courses', icon: <CoursesIcon /> },
            { id: 'dataaccessrequests', children: 'Data access requests', icon: <UsersIcon /> },
            { id: 'collections', children: 'Collections', icon: <BookmarkIcon /> },
            ...(userState[0].role === 'Admin' ? [{ id: 'usersroles', children: 'Users and roles', icon: <UsersIcon /> }] : []),
        ];

        const ACCORDIAN_DAR_MENU = {
            text: 'Data access requests',
            icon: <UsersIcon />,
            children: [
                {
                    text: 'Applications',
                    id: 'dataaccessrequests',
                },
                ...(allowWorkflow && this.userHasRole(team, 'manager')
                    ? [
                          {
                              id: 'workflows',
                              text: 'Workflows',
                          },
                      ]
                    : []),
            ],
        };

        const ACCORDIAN_DUR_MENU = {
            text: 'Data Uses',
            icon: <FlowIcon />,
            children: [
                {
                    text: 'Dashboard',
                    id: 'datause',
                },
                {
                    text: 'Data use widget',
                    id: 'datause_widget',
                },
            ],
        };

        return (
            <Sentry.ErrorBoundary fallback={<ErrorModal />}>
                <DashboardProvider value={this.state.dashboardState}>
                    <SearchBar
                        ref={this.searchBar}
                        searchString={searchString}
                        doSearchMethod={this.doSearch}
                        doUpdateSearchString={this.updateSearchString}
                        doToggleDrawer={this.toggleDrawer}
                        userState={userState}
                    />

                    <div className='container-wrap'>
                        <div className='col-sm-12 col-md-2 accountMenuHolder'>
                            <div className='account-menu'>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle}>
                                        <div className='teamSelectorHeader'>
                                            <span className='gray700-13'>{this.renderCurrentTeam()}</span>
                                            <ChevronRightSvg fill={'#475da7'} className='dataClassArrow pointer' />
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu as={CustomMenu} className='teamSelectorMenu'>
                                        <Dropdown.Item className='gray700-13' onClick={e => this.toggleNav(`youraccount&team=user`)}>
                                            {userState[0].name || ''}
                                        </Dropdown.Item>
                                        {this.renderAdmin()}
                                        {this.renderPublishers()}
                                    </Dropdown.Menu>
                                </Dropdown>

                                {isUser(team) && (
                                    <>
                                        {TEAM_USERS_MENU.map(({ id, ...outerProps }) => (
                                            <DashboardNavItem
                                                icon={<BarChartIcon />}
                                                activeClassName={this.getNavActiveClass(id)}
                                                onClick={e => this.toggleNav(id)}
                                                {...outerProps}
                                            />
                                        ))}
                                    </>
                                )}

                                {isAdmin(team) && (
                                    <>
                                        <DashboardNavItem
                                            icon={<UsersIcon />}
                                            activeClassName={this.getNavActiveClass('datasets')}
                                            onClick={e => this.toggleNav('datasets', '/account')}
                                            to='/account'>
                                            Datasets
                                        </DashboardNavItem>

                                        <DashboardNavItem
                                            icon={<FlowIcon />}
                                            activeClassName={this.getNavActiveClass('datause')}
                                            onClick={e => this.toggleNav('datause')}>
                                            Data Uses
                                        </DashboardNavItem>

                                        <div className={this.getNavActiveClass('teams')} onClick={e => this.toggleNav('teams')}>
                                            <Nav.Link className='verticalNavBar gray700-13'>
                                                <span className='grey-circle-border'>
                                                    <SVGIcon
                                                        name='plusChunky'
                                                        fill={'#b3b8bd'}
                                                        viewBox='-1 -1 26 26'
                                                        className='accountSvgs'
                                                    />
                                                </span>
                                                <span style={{ 'margin-left': '5px' }}>Teams</span>
                                            </Nav.Link>
                                        </div>
                                    </>
                                )}

                                {isCustodian(team) && (
                                    <>
                                        <DashboardNavItem
                                            icon={<SettingsIcon />}
                                            activeClassName={this.getNavActiveClass('teamManagement')}
                                            onClick={e => this.toggleNav('teamManagement')}>
                                            Team Management
                                        </DashboardNavItem>

                                        {allowAccessRequestManagement && this.userHasRole(team, ['manager', 'reviewer']) && (
                                            <div className={this.getNavActiveClass(['dataaccessrequests', 'workflows', 'addeditworkflow'])}>
                                                <DashboardNavAccordian
                                                    onSelect={this.accordionClick}
                                                    onClick={this.toggleNav}
                                                    tabId={tabId}
                                                    activeKey={activeAccordion}
                                                    eventKey='0'
                                                    data={ACCORDIAN_DAR_MENU}
                                                />
                                            </div>
                                        )}

                                        {this.userHasRole(team, ['manager', 'metadata_editor']) && (
                                            <DashboardNavItem
                                                icon={<ServerIcon />}
                                                activeClassName={this.getNavActiveClass('datasets')}
                                                onClick={e => this.toggleNav('datasets', '/account')}
                                                to='/account'>
                                                Datasets
                                            </DashboardNavItem>
                                        )}

                                        <div className={this.getNavActiveClass(['datause', 'datause_widget'])}>
                                            <DashboardNavAccordian
                                                onSelect={this.accordionClick}
                                                onClick={this.toggleNav}
                                                tabId={tabId}
                                                activeKey={activeAccordion}
                                                eventKey='2'
                                                data={ACCORDIAN_DUR_MENU}
                                            />
                                        </div>

                                        <DashboardNavItem
                                            icon={<HelpIcon />}
                                            activeClassName={this.getNavActiveClass('help')}
                                            onClick={e => this.toggleNav('help')}>
                                            Help
                                        </DashboardNavItem>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className='col-sm-12 col-md-10 margin-top-32'>
                            {isUser(team) && (
                                <>
                                    {tabId === 'dashboard' && <AccountAnalyticsDashboard userState={userState} />}

                                    {tabId === 'youraccount' && <YourAccount userState={userState} accountUpdated={accountUpdated} />}

                                    {tabId === 'tools' && <AccountTools userState={userState} />}

                                    {tabId === 'reviews' && <ReviewTools userState={userState} />}

                                    {tabId === 'papers' && <AccountPapers userState={userState} />}

                                    {tabId === 'courses' && <AccountCourses userState={userState} />}

                                    {tabId === 'dataaccessrequests' &&
                                        (_.isEmpty(dataaccessrequest) ? (
                                            <DataAccessRequests
                                                setDataAccessRequest={this.setDataAccessRequest}
                                                userState={userState}
                                                team={team}
                                                alert={alert}
                                            />
                                        ) : (
                                            <ActivityLog
                                                onClickStartReview={this.navigateToLocation}
                                                dataaccessrequest={dataaccessrequest}
                                                userState={userState}
                                                team={team}
                                                ref={this.activityLog}
                                                onUpdateLogs={this.loadActivityLogNotifications}
                                            />
                                        ))}

                                    {tabId === 'collections' && <AccountCollections userState={userState} />}

                                    {tabId === 'usersroles' && <AccountUsers userState={userState} />}
                                </>
                            )}

                            <Route path='/account/datasets/:id' component={AccountDataset} />

                            {!isUser(team) && (
                                <>
                                    {allowAccessRequestManagement && this.userHasRole(team, ['manager', 'reviewer']) && (
                                        <>
                                            {' '}
                                            {tabId === 'dataaccessrequests' &&
                                                (_.isEmpty(dataaccessrequest) ? (
                                                    <DataAccessRequests
                                                        setDataAccessRequest={this.setDataAccessRequest}
                                                        userState={userState}
                                                        team={team}
                                                        alert={alert}
                                                    />
                                                ) : (
                                                    <ActivityLog
                                                        onClickStartReview={this.navigateToLocation}
                                                        dataaccessrequest={dataaccessrequest}
                                                        userState={userState}
                                                        team={team}
                                                        ref={this.activityLog}
                                                        onUpdateLogs={this.loadActivityLogNotifications}
                                                    />
                                                ))}
                                        </>
                                    )}

                                    {(this.userHasRole(team, ['manager', 'metadata_editor']) || team === 'admin') &&
                                        tabId === 'datasets' && <AccountDatasets userState={userState} team={team} alert={alert} />}

                                    {team === 'admin' && tabId === 'teams' && (
                                        <AccountTeams
                                            userState={userState}
                                            onTeamsTabChange={this.onTeamsTabChange}
                                            team={team}
                                            alert={alert}
                                        />
                                    )}

                                    {(tabId === 'datause' || tabId === 'datause_widget') && (
                                        <AccountDataUse tabId={tabId} team={team} publisherDetails={publisherDetails} />
                                    )}

                                    {allowWorkflow && this.userHasRole(team, 'manager') && tabId === 'workflows' && (
                                        <WorkflowDashboard userState={userState} team={team} />
                                    )}

                                    {tabId === 'teamManagement' && (
                                        <AccountTeamManagement
                                            userState={userState}
                                            team={team}
                                            innertab={innertab}
                                            forwardRef={c => {
                                                this.saveNotifiations = c;
                                            }}
                                            onTeamManagementSave={this.onTeamManagementSave}
                                            onTeamManagementTabChange={this.onTeamManagementTabChange}
                                            onClearInnerTab={this.onClearInnerTab}
                                        />
                                    )}

                                    {tabId === 'help' ? <TeamHelp /> : ''}
                                </>
                            )}
                        </div>
                    </div>

                    {!_.isEmpty(dataaccessrequest) && (
                        <ActionBar userState={userState}>
                            <div className='action-bar'>
                                <div className='action-bar-actions'>
                                    <ActivityLogActionButtons
                                        team={team}
                                        latestVersion={this.state.dataaccessrequest}
                                        onClickStartReview={this.navigateToLocation}
                                        activityLog={this.activityLog}
                                        onClickAddNewEvent={() => this.activityLog.current.showAddNewEventModal()}
                                    />
                                </div>
                            </div>
                        </ActionBar>
                    )}

                    <SideDrawer open={showDrawer} closed={this.toggleDrawer}>
                        <UserMessages
                            userState={userState[0]}
                            closed={this.toggleDrawer}
                            toggleModal={this.toggleModal}
                            drawerIsOpen={this.state.showDrawer}
                            selectedTopicId={this.state.selectedTopicId}
                        />
                    </SideDrawer>
                    {tabId === 'teamManagement' && teamManagementTab === tabTypes.Notifications && (
                        <ActionBar userState={userState}>
                            <div>
                                <button
                                    className={savedTeamNotificationSuccess ? 'button-teal' : 'button-primary'}
                                    type='button'
                                    onClick={this.onSaveNotificationsClick}
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

                    <DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
                </DashboardProvider>
            </Sentry.ErrorBoundary>
        );
    }
}

export default withRouter(Account);
