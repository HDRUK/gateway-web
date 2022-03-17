import * as Sentry from '@sentry/react';
import axios from 'axios';
import _ from 'lodash';
import queryString from 'query-string';
import React, { Component, Fragment, useState } from 'react';
import { Accordion, Dropdown, Nav } from 'react-bootstrap';
import { Route, withRouter } from 'react-router-dom';
import 'react-web-tabs/dist/react-web-tabs.css';
import { ReactComponent as CheckSVG } from '../../images/check.svg';
import { ReactComponent as ChevronRightSvg } from '../../images/chevron-bottom.svg';
import SVGIcon from '../../images/SVGIcon';
import googleAnalytics from '../../tracking';
import { getTeam } from '../../utils/auth';
import { isRouteMatch } from '../../utils/router';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActivityLog from '../DataAccessRequest/components/ActivityLog/ActivityLog';
import ActivityLogActionButtons from '../DataAccessRequest/components/ActivityLog/ActivityLogActionButtons';
import DataUsePage from '../dataUse/DataUsePage';
import DataUseUpload from '../dataUse/upload/DataUseUpload';
import DataUseUploadActionButtons from '../dataUse/upload/DataUseUploadActionButtons';
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
        }}
    >
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
        showDataUseUploadPage: false,
        dataaccessrequest: {},
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.searchBar = React.createRef();
        this.dataUseUpload = React.createRef();
        this.dataUsePage = React.createRef();
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

                this.setState({
                    tabId: values.tab,
                    isDeleted: values.accountDeleted,
                    isApproved: values.toolApproved,
                    isRejected: values.toolRejected,
                    isReviewApproved: values.reviewApproved,
                    isReviewRejected: values.reviewRejected,
                    team,
                    activeAccordion: values.tab === 'dataaccessrequests' || values.tab === 'workflows' ? '0' : -1,
                });

                if (team !== 'user' && team !== 'admin') {
                    await axios.get(baseURL + `/api/v1/publishers/${team}`).then(res => {
                        let publisherDetails = res.data.publisher;
                        if (!publisherDetails.allowAccessRequestManagement && values.tab === 'dataaccessrequests')
                            this.setState({ tabId: 'teamManagement' });
                        this.setState({
                            allowWorkflow: publisherDetails.workflowEnabled,
                            allowAccessRequestManagement: publisherDetails.allowAccessRequestManagement,
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
                                }}
                            >
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
                    }}
                >
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
            if (
                !_.isEmpty(user.teams) &&
                (tab.tabId === 'dataaccessrequests' || tab.tabId === 'workflows' || tab.tabId === 'addeditworkflow') &&
                activeAccordion !== '0'
            ) {
                activeAccordion = '0';
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
                showDataUseUploadPage: false,
                dataaccessrequest: {},
            });
            // 6. push state
            this.props.history.push({ pathname: path || window.location.pathname, search: `?tab=${tab.tabId}`, state: { team: tab.team } });
        }
    };

    accordionClick = () => {
        this.setState({ activeAccordion: '0' });
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

    toggleDataUseUploadPage = () => {
        this.setState(prevState => {
            return { showDataUseUploadPage: !prevState.showDataUseUploadPage };
        });
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
            showDataUseUploadPage,
            dataaccessrequest,
        } = this.state;

        return (
            <Sentry.ErrorBoundary fallback={<ErrorModal />}>
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

                            {team === 'user' ? (
                                <Fragment>
                                    <div className={this.getNavActiveClass('dashboard')} onClick={e => this.toggleNav('dashboard')}>
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <SVGIcon name='dashboard' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Dashboard</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('youraccount')} onClick={e => this.toggleNav('youraccount')}>
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <SVGIcon name='accounticon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Account</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('tools')} onClick={e => this.toggleNav('tools')}>
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <SVGIcon name='newtoolicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Tools</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('reviews')} onClick={e => this.toggleNav('reviews')}>
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <SVGIcon name='reviewsicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Reviews</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('datause')} onClick={e => this.toggleNav('datause')}>
                                        <Nav.Link eventKey={'datause'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='datauseicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Data Uses</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('papers')} onClick={e => this.toggleNav('papers')}>
                                        <Nav.Link eventKey={'papers'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='newprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Papers</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('courses')} onClick={e => this.toggleNav('courses')}>
                                        <Nav.Link eventKey={'courses'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='educationicon' fill={'#b3b8bd'} className='svg-20' />
                                            <span className='navLinkItem'>Courses</span>
                                        </Nav.Link>
                                    </div>

                                    <div
                                        className={this.getNavActiveClass('dataaccessrequests')}
                                        onClick={e => this.toggleNav('dataaccessrequests')}
                                    >
                                        <Nav.Link eventKey={'dataaccessrequests'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='newprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Data access requests</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('collections')} onClick={e => this.toggleNav('collections')}>
                                        <Nav.Link eventKey={'collections'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='collections' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Collections</span>
                                        </Nav.Link>
                                    </div>

                                    {userState[0].role === 'Admin' ? (
                                        <div className={this.getNavActiveClass('usersroles')} onClick={e => this.toggleNav('usersroles')}>
                                            <Nav.Link eventKey={'usersroles'} className='verticalNavBar gray700-13'>
                                                <SVGIcon name='rolesicon' fill={'#b3b8bd'} className='accountSvgs' />
                                                <span className='navLinkItem'>Users and roles</span>
                                            </Nav.Link>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </Fragment>
                            ) : (
                                ''
                            )}

                            {team === 'admin' ? (
                                <Fragment>
                                    <div
                                        className={this.getNavActiveClass('datasets')}
                                        onClick={e => this.toggleNav('datasets', '/account')}
                                    >
                                        <Nav.Link className='verticalNavBar gray700-13' activeClassName='is-active' to='/account'>
                                            <SVGIcon name='dataseticon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span style={{ 'margin-left': '11px' }}>Datasets</span>
                                        </Nav.Link>
                                    </div>
                                    <div className={this.getNavActiveClass('datause')} onClick={e => this.toggleNav('datause')}>
                                        <Nav.Link eventKey={'datause'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='datauseicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Data Uses</span>
                                        </Nav.Link>
                                    </div>

                                    <div className={this.getNavActiveClass('teams')} onClick={e => this.toggleNav('teams')}>
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <span className='grey-circle-border'>
                                                <SVGIcon name='plusChunky' fill={'#b3b8bd'} viewBox='-1 -1 26 26' className='accountSvgs' />
                                            </span>
                                            <span style={{ 'margin-left': '5px' }}>Teams</span>
                                        </Nav.Link>
                                    </div>
                                </Fragment>
                            ) : (
                                ''
                            )}

                            {team !== 'user' && team !== 'admin' ? (
                                <Fragment>
                                    <div
                                        className={this.getNavActiveClass('teamManagement')}
                                        onClick={e => this.toggleNav('teamManagement')}
                                    >
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <SVGIcon name='rolesicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span style={{ marginLeft: '11px' }}>Team Management</span>
                                        </Nav.Link>
                                    </div>
                                    {allowAccessRequestManagement && this.userHasRole(team, ['manager', 'reviewer']) && (
                                        <div className={this.getNavActiveClass(['dataaccessrequests', 'workflows', 'addeditworkflow'])}>
                                            <Accordion activeKey={activeAccordion} onSelect={this.accordionClick}>
                                                <Fragment>
                                                    <Accordion.Toggle
                                                        variant='link'
                                                        className='verticalNavBar gray700-13 navLinkButton'
                                                        eventKey='0'
                                                    >
                                                        <SVGIcon name='dataaccessicon' fill={'#b3b8bd'} className='accountSvgs' />
                                                        <span className='navLinkItem'>Data access requests</span>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey='0'>
                                                        <div>
                                                            <Nav.Link
                                                                onClick={e => this.toggleNav('dataaccessrequests')}
                                                                bsPrefix='nav-block'
                                                                className={`gray700-13 ${
                                                                    tabId === 'dataaccessrequests' ? 'nav-item-active' : ''
                                                                }`}
                                                            >
                                                                <span className='subLinkItem'>Applications</span>
                                                            </Nav.Link>
                                                            {allowWorkflow && this.userHasRole(team, 'manager') && (
                                                                <Nav.Link
                                                                    onClick={e => this.toggleNav(`workflows`)}
                                                                    bsPrefix='nav-block'
                                                                    className={`gray700-13 ${
                                                                        tabId === 'workflows' ? 'nav-item-active' : ''
                                                                    }`}
                                                                >
                                                                    <span className='subLinkItem'>Workflows</span>
                                                                </Nav.Link>
                                                            )}
                                                        </div>
                                                    </Accordion.Collapse>
                                                </Fragment>
                                            </Accordion>
                                        </div>
                                    )}
                                    {this.userHasRole(team, ['manager', 'metadata_editor']) && (
                                        <div
                                            className={this.getNavActiveClass('datasets')}
                                            onClick={e => this.toggleNav('datasets', '/account')}
                                        >
                                            <Nav.Link className='verticalNavBar gray700-13' to='/account'>
                                                <SVGIcon name='dataseticon' fill={'#b3b8bd'} className='accountSvgs' />
                                                <span style={{ 'margin-left': '11px' }}>Datasets</span>
                                            </Nav.Link>
                                        </div>
                                    )}
                                    <div className={this.getNavActiveClass('datause')} onClick={e => this.toggleNav('datause')}>
                                        <Nav.Link eventKey={'datause'} className='verticalNavBar gray700-13'>
                                            <SVGIcon name='datauseicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Data Uses</span>
                                        </Nav.Link>
                                    </div>
                                    <div className={this.getNavActiveClass('help')} onClick={e => this.toggleNav('help')}>
                                        <Nav.Link className='verticalNavBar gray700-13'>
                                            <SVGIcon name='info' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className='navLinkItem'>Help</span>
                                        </Nav.Link>
                                    </div>
                                </Fragment>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>

                    <div className='col-sm-12 col-md-10 margin-top-32'>
                        {team === 'user' && (
                            <>
                                {tabId === 'dashboard' ? <AccountAnalyticsDashboard userState={userState} /> : ''}

                                {tabId === 'youraccount' ? <YourAccount userState={userState} accountUpdated={accountUpdated} /> : ''}

                                {tabId === 'tools' ? <AccountTools userState={userState} /> : ''}

                                {tabId === 'reviews' ? <ReviewTools userState={userState} /> : ''}

                                {tabId === 'papers' ? <AccountPapers userState={userState} /> : ''}

                                {tabId === 'courses' ? <AccountCourses userState={userState} /> : ''}

                                {tabId === 'dataaccessrequests' ? (
                                    _.isEmpty(dataaccessrequest) ? (
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
                                    )
                                ) : (
                                    ''
                                )}

                                {tabId === 'datause' ? (
                                    showDataUseUploadPage ? (
                                        <DataUseUpload
                                            userState={userState}
                                            onSubmit={this.toggleDataUseUploadPage}
                                            team={team}
                                            ref={this.dataUseUpload}
                                            dataUsePage={this.dataUsePage}
                                        />
                                    ) : (
                                        <DataUsePage
                                            userState={userState}
                                            team={team}
                                            onClickDataUseUpload={this.toggleDataUseUploadPage}
                                            ref={this.dataUsePage}
                                        />
                                    )
                                ) : (
                                    ''
                                )}

                                {tabId === 'collections' ? <AccountCollections userState={userState} /> : ''}

                                {tabId === 'usersroles' ? <AccountUsers userState={userState} /> : ''}
                            </>
                        )}

                        <Route path='/account/datasets/:id' component={AccountDataset} />

                        {team !== 'user' ? (
                            <>
                                {allowAccessRequestManagement && this.userHasRole(team, ['manager', 'reviewer']) && (
                                    <>
                                        {' '}
                                        {tabId === 'dataaccessrequests' ? (
                                            _.isEmpty(dataaccessrequest) ? (
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
                                            )
                                        ) : (
                                            ''
                                        )}
                                    </>
                                )}

                                {(this.userHasRole(team, ['manager', 'metadata_editor']) || team === 'admin') && (
                                    <>{tabId === 'datasets' ? <AccountDatasets userState={userState} team={team} alert={alert} /> : ''}</>
                                )}

                                {team === 'admin' && (
                                    <>
                                        {tabId === 'teams' && (
                                            <AccountTeams
                                                userState={userState}
                                                onTeamsTabChange={this.onTeamsTabChange}
                                                team={team}
                                                alert={alert}
                                            />
                                        )}
                                    </>
                                )}

                                {tabId === 'datause' ? (
                                    showDataUseUploadPage ? (
                                        <DataUseUpload
                                            userState={userState}
                                            team={team}
                                            ref={this.dataUseUpload}
                                            dataUsePage={this.dataUsePage}
                                            onSubmit={this.toggleDataUseUploadPage}
                                        />
                                    ) : (
                                        <DataUsePage
                                            userState={userState}
                                            team={team}
                                            onClickDataUseUpload={this.toggleDataUseUploadPage}
                                            ref={this.dataUsePage}
                                        />
                                    )
                                ) : (
                                    ''
                                )}

                                {allowWorkflow && this.userHasRole(team, 'manager') && (
                                    <>{tabId === 'workflows' ? <WorkflowDashboard userState={userState} team={team} /> : ''}</>
                                )}
                                {tabId === 'teamManagement' ? (
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
                                ) : (
                                    ''
                                )}
                                {tabId === 'help' ? <TeamHelp /> : ''}
                            </>
                        ) : (
                            ''
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
                                disabled={isSubmitting}
                            >
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

                {showDataUseUploadPage && (
                    <ActionBar userState={userState}>
                        <div className='action-bar'>
                            <div className='action-bar-actions'>
                                <DataUseUploadActionButtons dataUseUpload={this.dataUseUpload} />
                            </div>
                        </div>
                    </ActionBar>
                )}

                <DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
            </Sentry.ErrorBoundary>
        );
    }
}

export default withRouter(Account);
