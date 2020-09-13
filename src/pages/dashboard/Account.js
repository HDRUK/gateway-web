import React, { Component, Fragment } from 'react';
import queryString from 'query-string';
import { Row, Nav, Accordion } from 'react-bootstrap';
import _ from 'lodash';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import AccountTools from './AccountTools';
import AccountProjects from './AccountProjects';
import AccountPapers from './AccountPapers';
import AccountCollections from './AccountCollections';
import AccountAnalyticsDashboard from './AccountAnalyticsDashboard';
import AccountUsers from './AccountUsers';
import ReviewTools from './ReviewTools';
import YourAccount from './YourAccount';
import DataAccessRequests from './DataAccessRequests';
import 'react-web-tabs/dist/react-web-tabs.css';
import SVGIcon from '../../images/SVGIcon';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import './Dashboard.scss';

class Account extends Component {
    // callback declare
    alertTimeOut;
    // state init
	state = {
		searchString: '',
		id: '',
		data: [],
		isLoading: true,
		userState: [{
            loggedIn: false,
            role: 'Reader',
            id: null,
            name: null,
            teams: []
        }],
        tabId: 'dashboard',
        activeKey: '',
        team: '',
        alert: {},
		isDeleted: false,
		isApproved: false,
		isRejected: false,
		isProjectDeleted: false,
		isProjectApproved: false,
		showDrawer: false,
        showModal: false,
        activeAccordion: -1,
		context: {}
	};

	constructor(props) {
        super(props);
		this.state.userState = props.userState;
        this.searchBar = React.createRef();
        // 1. used for DAR custodian update status of application
        if(_.has(props, 'location.state.alert')) {
            this.state.alert = props.location.state.alert;
            this.alertTimeOut = setTimeout(() => this.setState({ alert: {} }), 5000)
        }
	}

	componentWillMount() {
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);
			if (values.tab !== this.state.tabId || typeof values.tab !== 'undefined') {
				this.setState({ tabId: values.tab });
				this.toggleNav(values.tab);
			}
		}
	}

	componentDidMount() {
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);
			if (values.tab !== this.state.tabId || typeof values.tab !== 'undefined'|| values.tab !== null) {
                this.toggleNav(values.tab);
				this.setState({ 
                    tabId: values.tab,
                    isDeleted: values.toolDeleted,
                    isApproved: values.toolApproved,
                    isRejected: values.toolRejected,
                    isProjectApproved: values.projectApproved,
                    isProjectRejected: values.projectRejected,
                    isReviewApproved: values.reviewApproved,
                    isReviewRejected: values.reviewRejected
                });
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);
			if (values.tab !== this.state.tabId || typeof values.tab !== 'undefined' || values.tab !== null) {
				this.setState({
					tabId: values.tab,
					isDeleted: values.accountDeleted,
					isApproved: values.toolApproved,
					isRejected: values.toolRejected,
					isProjectApproved: values.projectApproved,
					isProjectRejected: values.projectRejected,
					isReviewApproved: values.reviewApproved,
					isReviewRejected: values.reviewRejected
				});
			}
		}
	}

	doSearch = (e) => {
		// 1. fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = '/search?search=' + this.state.searchString;
	};

	updateSearchString = (searchString) => {
		this.setState({ searchString: searchString });
	};
    
    /**
     * [generateTabObject - Creates object with team if needed]
     *
     * @param   {string}  tabId  [tabId]
     * @return  {Object}         [return new tab {tabId: '', team: ''}]
     */
    generateTabObject = (tabId) => {
        let tabSplit = tabId.split('&');
        let tab = tabSplit.reduce((obj, item) => {
            let arr = item.split('=');
            let [key = '', value = ''] = arr;
            obj = { ...obj, tabId: (key !== 'team' ? key : obj.tabId), team: (key === 'team' ? value : obj.team)};
            return obj;
        }, {tabId: '', team: ''});

        return tab;
    }

	toggleDrawer = () => {
		this.setState((prevState) => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
		});
	};

	toggleModal = (showEnquiry = false, context = {}) => {
		this.setState((prevState) => {
			return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
		});
    };

    isPublisher() {
        let {userState} = this.state;
        let [user] = userState;
        if(!_.isEmpty(user.teams)) {
            return [...user.teams].filter(p => p.type === 'publisher').length > 0 ? true : false;
        }
        return false;
    }

    /**
     * [renderPublishers Renders out publishers for DAR nav menu]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    renderPublishers() {
        let {userState} = this.state;
        let [user] = userState;
        if(!_.isEmpty(user.teams)) {
            const filterPublishers = [...user.teams].filter(p => p.type === 'publisher');
            if(!_.isEmpty(filterPublishers)) {
                let publishers = filterPublishers.map(p => p.publisher);
                    return publishers.map((pub, index) =>{
                        return  (
                            <Nav.Link key={index} bsPrefix="nav-block" onClick={(e) => this.toggleNav(`dataaccessrequests&team=${pub.name}`)} className={`gray700-13 ${pub.name === this.state.team ? 'nav-item-active' : ''}`}>
                                <span className="subLinkItem">{pub.name}</span>
                            </Nav.Link>
                        )
                    });
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    }

    toggleNav = (tabId = '') => {
        let {alert, userState: [user]} = this.state;
        let activeAccordion = -1;
        // 1. if alert set tabId as page has been redirected
        if(!_.isEmpty(alert)) {
            tabId = alert.nav;
        }
        // 2. make sure tabId is not empty
		if (!_.isEmpty(tabId)) {
            // 3. need to check for teams returns {tabId: '', team: ''}; eg dataccessrequests&team=ALLIANCE
            let tab = this.generateTabObject(tabId);
            // 4. check if user has teams and the current nav is dataaccessrequests, keep expanded
            if(!_.isEmpty(user.teams) && tab.tabId === 'dataaccessrequests') {
                activeAccordion = '0';
            }
            // 5. set state
            this.setState({ tabId: tab.tabId, team: tab.team, activeKey: tab.tabId, alert: !_.isEmpty(alert) ? alert : {}, activeAccordion });
            // 6. push state
			this.props.history.push(window.location.pathname + '?tab=' + tab.tabId);
		}
    }

    accordionClick = () => {
        this.setState({activeAccordion: '0'});
    }


	render() {
		const {
			searchString,
			data,
			userState,
            tabId,
            activeKey,
			showDrawer,
			showModal,
            context,
            team,
            alert,
            activeAccordion
		} = this.state;
		if (typeof data.datasetids === 'undefined') {
			data.datasetids = [];
		}

		return (
			<Fragment>
				<SearchBar
					ref={this.searchBar}
					searchString={searchString}
					doSearchMethod={this.doSearch}
					doUpdateSearchString={this.updateSearchString}
					doToggleDrawer={this.toggleDrawer}
					userState={userState}
				/>

				<Row>
					<div className="col-sm-12 col-md-2">
						<div className='account-menu'>
                            <div className={`${tabId === 'dashboard' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('dashboard')}>
                                <Nav.Link className="verticalNavBar gray700-13">
                                    <SVGIcon name='dashboard' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Dashboard</span>
                                </Nav.Link>
                            </div>
                            <div className={`${tabId === 'youraccount' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('youraccount')}>
                                <Nav.Link className="verticalNavBar gray700-13">
                                    <SVGIcon name='accounticon' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Account</span>
                                </Nav.Link>
                            </div>
                            <div className={`${tabId === 'tools' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('tools')}>
                                <Nav.Link className="verticalNavBar gray700-13">
                                    <SVGIcon name='newtoolicon' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Tools</span>
                                </Nav.Link>
                            </div>
                            <div className={`${tabId === 'reviews' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('reviews')}>
                                <Nav.Link className="verticalNavBar gray700-13">
                                    <SVGIcon name='reviewsicon' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Reviews</span>
                                </Nav.Link>
                            </div>
                            <div className={`${tabId === 'projects' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('projects')}>
                                <Nav.Link className="verticalNavBar gray700-13">
                                    <SVGIcon name='newestprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Projects</span>
                                </Nav.Link>
                            </div>
                            <div className={`${tabId === 'papers' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('papers')}>
                                <Nav.Link eventKey={'papers'} className="verticalNavBar gray700-13">
                                    <SVGIcon name='newprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Papers</span>
                                </Nav.Link>
                            </div>
                            <div className={`${tabId === 'dataaccessrequests'  ? 'activeCard' : ''}`}>
                                {this.isPublisher() ?
                                <Accordion activeKey={activeAccordion} onSelect={this.accordionClick}>
                                    <Fragment>
                                        <Accordion.Toggle variant='link' className='verticalNavBar gray700-13 navLinkButton' eventKey='0'>
                                            <SVGIcon name='dataaccessicon' fill={'#b3b8bd'} className='accountSvgs' />
                                            <span className="navLinkItem">Data access requests</span>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey='0'>
                                            <div>
                                                <Nav.Link onClick={(e) => this.toggleNav('dataaccessrequests')} bsPrefix="nav-block" className={`gray700-13 ${_.isEmpty(team) && tabId === 'dataaccessrequests' ? 'nav-item-active' : ''}`}>
                                                    <span className="subLinkItem">{userState[0].name || ''}</span>
                                                </Nav.Link>
                                                {this.renderPublishers()}
                                            </div>
                                        </Accordion.Collapse>
                                    </Fragment>
                                </Accordion>
                                :
                                <Fragment>
                                    <Nav.Link onClick={(e) => this.toggleNav('dataaccessrequests')} className="verticalNavBar gray700-13">
                                        <SVGIcon name='dataaccessicon' fill={'#b3b8bd'} className='accountSvgs' />
                                        <span className="navLinkItem">Data access requests</span>
                                    </Nav.Link>
                                </Fragment>
                            }
                            </div>
                            <div className={`${tabId === 'collections' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('collections')}>
                                <Nav.Link eventKey={'collections'} className="verticalNavBar gray700-13">
                                    <SVGIcon name='collections' fill={'#b3b8bd'} className='accountSvgs' />
                                    <span className="navLinkItem">Collections</span>
                                </Nav.Link>
                            </div>
                            { userState[0].role === 'Admin' ? 
                                <div className={`${tabId === 'usersroles' ? 'activeCard' : ''}`} onClick={(e) => this.toggleNav('usersroles')}>
                                    <Nav.Link eventKey={'usersroles'} className="verticalNavBar gray700-13">
                                        <SVGIcon name='rolesicon' fill={'#b3b8bd'} className='accountSvgs' />
                                        <span className="navLinkItem">Users and roles</span>
                                    </Nav.Link>
                                </div>
                                : ''
                            }
						</div>
					</div>

					<div className="col-sm-12 col-md-10 mt-5">
						{tabId === 'dashboard' ? <AccountAnalyticsDashboard userState={userState} /> : ''}

						{tabId === 'youraccount' ? <YourAccount userState={userState} /> : ''}

						{tabId === 'tools' ? <AccountTools userState={userState} /> : ''}

						{tabId === 'reviews' ? <ReviewTools userState={userState} /> : ''}

						{tabId === 'projects' ? <AccountProjects userState={userState} /> : ''}

						{tabId === 'papers' ? <AccountPapers userState={userState} /> : ''}

						{tabId === 'dataaccessrequests' ? <DataAccessRequests userState={userState} team={team} alert={alert} /> : ''}

						{tabId === 'collections' ? <AccountCollections userState={userState} /> : ''}

						{tabId === 'usersroles' ? <AccountUsers userState={userState} /> : ''}
					</div>
				</Row>

				<SideDrawer open={showDrawer} closed={this.toggleDrawer}>
					<UserMessages closed={this.toggleDrawer} toggleModal={this.toggleModal} drawerIsOpen={this.state.showDrawer} />
				</SideDrawer>

				<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
			</Fragment>
		);
	}
}

export default Account;
