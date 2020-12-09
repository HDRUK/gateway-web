import React, { Component, Fragment, useState } from 'react';
import queryString from 'query-string';
import { Nav, Accordion, Dropdown } from 'react-bootstrap';
import _ from 'lodash';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import AccountTools from './AccountTools';
import AccountProjects from './AccountProjects';
import AccountDatasets from './AccountDatasets';
import AccountAdvancedSearch from './AccountAdvancedSearch';
import AccountPapers from './AccountPapers';
import AccountCourses from './AccountCourses';
import AccountCollections from './AccountCollections';
import AccountAnalyticsDashboard from './AccountAnalyticsDashboard';
import AccountUsers from './AccountUsers';
import AccountMembers from './AccountMembers';
import ReviewTools from './ReviewTools';
import YourAccount from './YourAccount';
import DataAccessRequests from './DataAccessRequests/DataAccessRequests';
import WorkflowDashboard from './Workflows/WorkflowDashboard';
import TeamHelp from './TeamHelp/TeamHelp';
import 'react-web-tabs/dist/react-web-tabs.css';
import SVGIcon from '../../images/SVGIcon';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import { ReactComponent as ChevronRightSvg } from '../../images/chevron-bottom.svg';
import { ReactComponent as MembersSvg } from '../../images/members.svg';
import './Dashboard.scss';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
	<a
		href=''
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
		data: [],
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
		activeKey: '',
		team: 'user',
		teamId: '',
		alert: {},
		isDeleted: false,
		isApproved: false,
		isRejected: false,
		isProjectDeleted: false,
		isProjectApproved: false,
		showDrawer: false,
		showModal: false,
		activeAccordion: -1,
		datasetAccordion: -1,
		context: {},
		profileComplete: true,
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.searchBar = React.createRef();
		// 1. used for DAR custodian update status of application
		if (_.has(props, 'location.state.alert')) {
			this.state.alert = props.location.state.alert;
			this.alertTimeOut = setTimeout(() => this.setState({ alert: {} }), 10000);
		}

		if (_.has(props, 'location.state.team') && props.location.state.team !== '') {
			this.state.team = props.location.state.team;
			localStorage.setItem('HDR_TEAM', props.location.state.team);
		} else if (!_.isEmpty(localStorage.getItem('HDR_TEAM'))) {
			this.state.team = localStorage.getItem('HDR_TEAM');
		} else {
			this.state.team = 'user';
			localStorage.setItem('HDR_TEAM', 'user');
		}
		if (_.has(props, 'profileComplete')) {
			this.state.profileComplete = props.profileComplete;
		}
	}

	componentDidMount() {
		if (window.location.search) {
			let tab = '';
			let values = queryString.parse(window.location.search);
			if (values.tab !== this.state.tabId || typeof values.tab !== 'undefined' || typeof values.tab !== null) {
				tab = this.checkRedirect(values);
				this.setState({
					tabId: tab,
					isDeleted: values.toolDeleted,
					isApproved: values.toolApproved,
					isRejected: values.toolRejected,
					isProjectApproved: values.projectApproved,
					isProjectRejected: values.projectRejected,
					isReviewApproved: values.reviewApproved,
					isReviewRejected: values.reviewRejected,
				});
				this.toggleNav(tab);
			}
		}
		if (!this.state.profileComplete) {
			this.setState({ tabId: 'youraccount' });
		}
		window.addEventListener('beforeunload', this.componentCleanup);
	}

	componentCleanup() {
		localStorage.setItem('HDR_TEAM', 'user');
	}

	componentWillUnmount() {
		this.componentCleanup();
		window.removeEventListener('beforeunload', this.componentCleanup);
	}

	componentWillReceiveProps(nextProps) {
		if (window.location.search) {
			let values = queryString.parse(window.location.search);
			let team = 'user';
			if (values.tab !== this.state.tabId || typeof values.tab !== 'undefined' || typeof values.tab !== null) {
				if (nextProps.location.state.team !== '') {
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
					isProjectApproved: values.projectApproved,
					isProjectRejected: values.projectRejected,
					isReviewApproved: values.reviewApproved,
					isReviewRejected: values.reviewRejected,
					team,
					activeAccordion: values.tab === 'dataaccessrequests' || values.tab === 'workflows' ? '0' : -1,
				});
			}
		}
		if (!this.state.profileComplete) {
			this.setState({ tabId: 'youraccount' });
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
		if (e.key === 'Enter') window.location.href = '/search?search=' + this.state.searchString;
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

	toggleDrawer = () => {
		this.setState(prevState => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
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
						<Dropdown.Item
							className='gray700-13'
							onClick={e => {
								this.toggleNav(`${this.state.tabId}&team=${pub.name}`);
								this.setState({ teamId: pub._id });
							}}>
							{pub.name}
						</Dropdown.Item>
					);
				});
			} else {
				return '';
			}
		} else {
			return '';
		}
	}

	toggleNav = (tabId = '') => {
		let {
			activeAccordion,
			datasetAccordion,
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

			// 5. checks if the current nav is datasets or advanced search, keeps datasets tab expanded
			if (tab.tabId === 'datasets' || tab.tabId === 'datasetsAdvancedSearch') {
				datasetAccordion = '0';
			}

			if (!_.isEmpty(tab.team)) {
				localStorage.setItem('HDR_TEAM', tab.team);
				if (tab.team !== 'user') tab.tabId = 'dataaccessrequests';
			} else if (localStorage.getItem('HDR_TEAM') == '') localStorage.setItem('HDR_TEAM', 'user');
			// 6. set state
			this.setState({
				tabId: tab.tabId,
				team: tab.team,
				activeKey: tab.tabId,
				alert: !_.isEmpty(alert) ? alert : {},
				activeAccordion,
				datasetAccordion,
			});
			// 7. push state
			this.props.history.push({ pathname: window.location.pathname, search: `?tab=${tab.tabId}`, state: { team: tab.team } });
		}
	};

	accordionClick = () => {
		this.setState({ activeAccordion: '0' });
	};

	datasetAccordionClick = () => {
		this.setState({ datasetAccordion: '0' });
	};

	render() {
		const {
			searchString,
			data,
			userState,
			tabId,
			showDrawer,
			showModal,
			context,
			team,
			teamId,
			alert,
			activeAccordion,
			datasetAccordion,
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

				<div className='container-wrap'>
					<div className='col-sm-12 col-md-2 accountMenuHolder'>
						<div className='account-menu'>
							<Dropdown>
								<Dropdown.Toggle as={CustomToggle}>
									<div className='teamSelectorHeader'>
										<span className='gray700-13'>{team === 'user' ? userState[0].name : team}</span>
										<ChevronRightSvg fill={'#475da7'} className='dataClassArrow pointer' />
									</div>
								</Dropdown.Toggle>

								<Dropdown.Menu as={CustomMenu} className='teamSelectorMenu'>
									<Dropdown.Item className='gray700-13' onClick={e => this.toggleNav(`youraccount&team=user`)}>
										{userState[0].name || ''}
									</Dropdown.Item>
									{this.renderPublishers()}
								</Dropdown.Menu>
							</Dropdown>

							{team === 'user' ? (
								<Fragment>
									<div className={`${tabId === 'dashboard' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('dashboard')}>
										<Nav.Link className='verticalNavBar gray700-13'>
											<SVGIcon name='dashboard' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Dashboard</span>
										</Nav.Link>
									</div>

									<div className={`${tabId === 'youraccount' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('youraccount')}>
										<Nav.Link className='verticalNavBar gray700-13'>
											<SVGIcon name='accounticon' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Account</span>
										</Nav.Link>
									</div>

									<div className={`${tabId === 'tools' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('tools')}>
										<Nav.Link className='verticalNavBar gray700-13'>
											<SVGIcon name='newtoolicon' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Tools</span>
										</Nav.Link>
									</div>

									<div className={`${tabId === 'reviews' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('reviews')}>
										<Nav.Link className='verticalNavBar gray700-13'>
											<SVGIcon name='reviewsicon' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Reviews</span>
										</Nav.Link>
									</div>

									<div className={`${tabId === 'projects' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('projects')}>
										<Nav.Link className='verticalNavBar gray700-13'>
											<SVGIcon name='newestprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Projects</span>
										</Nav.Link>
									</div>

									{/* <div className={`${tabId === 'datasets' || tabId === 'datasetsAdvancedSearch' ? 'activeCard' : ''}`}>
                                            <Accordion activeKey={datasetAccordion} onSelect={this.datasetAccordionClick}>
                                                <Fragment>
                                                    <Accordion.Toggle variant='link' className='verticalNavBar gray700-13 navLinkButton' eventKey='0'>
                                                        <SVGIcon name='dataseticon' fill={'#b3b8bd'} className='accountSvgs' /> 
                                                        <span className="navLinkItem">Datasets</span>
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey='0'>
                                                        <div>
                                                            <Nav.Link onClick={(e) => this.toggleNav('datasets')} 
                                                            bsPrefix="nav-block" className={`gray700-13 ${tabId === 'datasets' ? 'nav-item-active' : ''}`}>
                                                                <span className="subLinkItem">Datasets</span>
                                                            </Nav.Link>
                                                            <Nav.Link 
                                                            onClick={(e) => this.toggleNav('datasetsAdvancedSearch')}
                                                            bsPrefix="nav-block" className={`gray700-13 ${tabId === 'datasetsAdvancedSearch' ? 'nav-item-active' : ''}`}>
                                                                <span className="subLinkItem">Advanced search</span>
                                                            </Nav.Link>
                                                        </div>
                                                    </Accordion.Collapse>
                                                </Fragment>
                                            </Accordion>
                                        </div> */}

									<div className={`${tabId === 'papers' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('papers')}>
										<Nav.Link eventKey={'papers'} className='verticalNavBar gray700-13'>
											<SVGIcon name='newprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Papers</span>
										</Nav.Link>
									</div>

									<div className={`${tabId === 'courses' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('courses')}>
										<Nav.Link eventKey={'courses'} className='verticalNavBar gray700-13'>
											<SVGIcon name='educationicon' fill={'#b3b8bd'} className='svg-20' />
											<span className='navLinkItem'>Courses</span>
										</Nav.Link>
									</div>

									<div
										className={`${tabId === 'dataaccessrequests' ? 'activeCard' : ''}`}
										onClick={e => this.toggleNav('dataaccessrequests')}>
										<Nav.Link eventKey={'dataaccessrequests'} className='verticalNavBar gray700-13'>
											<SVGIcon name='newprojecticon' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Data access requests</span>
										</Nav.Link>
									</div>

									<div className={`${tabId === 'collections' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('collections')}>
										<Nav.Link eventKey={'collections'} className='verticalNavBar gray700-13'>
											<SVGIcon name='collections' fill={'#b3b8bd'} className='accountSvgs' />
											<span className='navLinkItem'>Collections</span>
										</Nav.Link>
									</div>

									{userState[0].role === 'Admin' ? (
										<div className={`${tabId === 'usersroles' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('usersroles')}>
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
								<div
									className={`${
										tabId === 'dataaccessrequests' || tabId === 'workflows' || tabId === 'addeditworkflow' ? 'activeCard' : ''
									}`}>
									{this.isPublisher() ? (
										<Accordion activeKey={activeAccordion} onSelect={this.accordionClick}>
											<Fragment>
												<Accordion.Toggle variant='link' className='verticalNavBar gray700-13 navLinkButton' eventKey='0'>
													<SVGIcon name='dataaccessicon' fill={'#b3b8bd'} className='accountSvgs' />
													<span className='navLinkItem'>Data access requests</span>
												</Accordion.Toggle>
												<Accordion.Collapse eventKey='0'>
													<div>
														<Nav.Link
															onClick={e => this.toggleNav('dataaccessrequests')}
															bsPrefix='nav-block'
															className={`gray700-13 ${tabId === 'dataaccessrequests' ? 'nav-item-active' : ''}`}>
															<span className='subLinkItem'>Applications</span>
														</Nav.Link>
														<Nav.Link
															onClick={e => this.toggleNav(`workflows`)}
															bsPrefix='nav-block'
															className={`gray700-13 ${tabId === 'workflows' ? 'nav-item-active' : ''}`}>
															<span className='subLinkItem'>Workflows</span>
														</Nav.Link>
													</div>
												</Accordion.Collapse>
											</Fragment>
										</Accordion>
									) : (
										<Fragment>
											<Nav.Link onClick={e => this.toggleNav('dataaccessrequests')} className='verticalNavBar gray700-13'>
												<SVGIcon name='dataaccessicon' fill={'#b3b8bd'} className='accountSvgs' />
												<span className='navLinkItem'>Data access requests</span>
											</Nav.Link>
										</Fragment>
									)}
								</div>
							)}
							{team !== 'user' ? (
								<Fragment>
									<div className={`${tabId === 'members' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('members')}>
										<Nav.Link className='verticalNavBar gray700-13'>
											<MembersSvg className='membersSvg' />
											<span style={{ 'margin-left': '11px' }}>Members</span>
										</Nav.Link>
									</div>
									<div className={`${tabId === 'help' ? 'activeCard' : ''}`} onClick={e => this.toggleNav('help')}>
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
						{tabId === 'dashboard' ? <AccountAnalyticsDashboard userState={userState} /> : ''}

						{tabId === 'youraccount' ? <YourAccount userState={userState} /> : ''}

						{tabId === 'tools' ? <AccountTools userState={userState} /> : ''}

						{tabId === 'reviews' ? <ReviewTools userState={userState} /> : ''}

						{tabId === 'projects' ? <AccountProjects userState={userState} /> : ''}

						{tabId === 'datasets' ? <AccountDatasets userState={userState} /> : ''}

						{tabId === 'datasetsAdvancedSearch' ? <AccountAdvancedSearch userState={userState} /> : ''}

						{tabId === 'papers' ? <AccountPapers userState={userState} /> : ''}

						{tabId === 'courses' ? <AccountCourses userState={userState} /> : ''}

						{tabId === 'dataaccessrequests' ? <DataAccessRequests userState={userState} team={team} alert={alert} /> : ''}

						{tabId === 'workflows' ? <WorkflowDashboard userState={userState} team={team} /> : ''}

						{tabId === 'collections' ? <AccountCollections userState={userState} /> : ''}

						{tabId === 'usersroles' ? <AccountUsers userState={userState} /> : ''}

						{tabId === 'members' ? <AccountMembers userState={userState} team={team} teamId={teamId} /> : ''}

						{tabId === 'help' ? <TeamHelp /> : ''}
					</div>
				</div>

				<SideDrawer open={showDrawer} closed={this.toggleDrawer}>
					<UserMessages
						userState={userState[0]}
						closed={this.toggleDrawer}
						toggleModal={this.toggleModal}
						drawerIsOpen={this.state.showDrawer}
					/>
				</SideDrawer>

				<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
			</Fragment>
		);
	}
}

export default Account;
