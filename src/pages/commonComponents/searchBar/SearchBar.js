import React, { useState, Fragment } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import NotificationBadge from 'react-notification-badge';
import { isEmpty } from 'lodash';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as ColourLogoSvg } from '../../../images/colour.svg';
import { ReactComponent as ClearButtonSvg } from '../../../images/clear.svg';
import { ReactComponent as HamBurgerSvg } from '../../../images/hamburger.svg';
import { ReactComponent as WhiteArrowDownSvg } from '../../../images/arrowDownWhite.svg';
import { NotificationManager } from 'react-notifications';
import AddNewEntity from './AddNewEntity';
import './SearchBar.scss';
import '../uatBanner/UatBanner.scss';
import moment from 'moment';
import { cmsURL } from '../../../configs/url.config';
import { ReactComponent as ChevronBottom } from '../../../images/chevron-bottom.svg';
import UserDropdownItems from './UserDropdownItems';
import UserDropdownTeams from './UserDropdownTeams';
import UatBanner from '../../commonComponents/uatBanner/UatBanner';

import CmsDropdown from './CmsDropdown';

var baseURL = require('../BaseURL').getURL();
const urlEnv = require('../BaseURL').getURLEnv();

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
	<a
		href=''
		ref={ref}
		onClick={e => {
			e.preventDefault();
			onClick(e);
		}}
		className='user-dropdown-menu'>
		{children}
	</a>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
	const [value] = useState('');

	return (
		<div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
			<ul className='list-unstyled  mb-0 mt-0'>
				{React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
			</ul>
		</div>
	);
});

const CustomToggleInner = React.forwardRef(({ children, onClick }, ref) => (
	<a
		href=''
		ref={ref}
		onClick={e => {
			e.preventDefault();
			onClick(e);
		}}
		className='dropdown-sub-menu'>
		{children}
	</a>
));

const CustomSubMenu = React.forwardRef(({ children, style, className, show, 'aria-labelledby': labeledBy }, ref) => {
	const [value] = useState('');
	if (show) {
		return (
			<Fragment ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
				<ul className='list-unstyled'>
					{React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
				</ul>
			</Fragment>
		);
	}
});

class SearchBar extends React.Component {
	_isMounted = false;

	state = {
		textValue: '',
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
				teams: [],
			},
		],
		dropdownOpen: false,
		clearMessages: false,
		count: 0,
		messageCount: 0,
		prevScrollpos: window.pageYOffset,
		visible: true,
		showToast: true,
		isHovering: false,
		isLoading: true,
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		// set default textValue from props - for between tabs
		this.state.textValue = props.search;
		this.handleMouseHover = this.handleMouseHover.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
		window.addEventListener('scroll', this.handleScroll);
		document.addEventListener('mousedown', this.handleClick, false);

		if (this.state.userState[0].loggedIn) {
			this.getNumberOfUnreadNotifications();
			this.getNumberOfUnreadMessages();
			this.doMessagesCall();
		} else {
			this.setState({ isLoading: false });
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		window.removeEventListener('scroll', this.handleScroll);
		document.removeEventListener('mousedown', this.handleClick);
	}

	handleScroll = () => {
		const { prevScrollpos } = this.state;
		const currentScrollPos = window.pageYOffset;
		var visible = this.state.visible;

		if (window.innerWidth < 769) {
			visible = true;
		} else {
			visible = prevScrollpos > currentScrollPos || currentScrollPos < 65;
		}

		this.setState({
			prevScrollpos: currentScrollPos,
			visible,
		});
	};

	logout = e => {
		axios.get(baseURL + '/api/v1/auth/logout').then(res => {
			if (localStorage.getItem('HDR_TEAM') !== null) localStorage.removeItem('HDR_TEAM');

			window.location.reload();
		});
	};

	onSearch = e => {
		//onSearch
		this.setState({ textValue: e.target.value });
		if (this.props.doUpdateSearchString) {
			this.props.doUpdateSearchString(e.target.value);
		}
	};

	doMessagesCall() {
		var apiToCall = '/api/v1/messages/' + this.state.userState[0].id;
		if (this.state.userState[0].role === 'Admin') {
			apiToCall = '/api/v1/messages/admin/' + this.state.userState[0].id;
		}

		axios.get(baseURL + apiToCall).then(res => {
			if (this._isMounted) {
				this.setState({
					newData: res.data.newData,
					isLoading: false,
					isRead: res.data.isRead,
				});
			}
		});
	}

	getNumberOfUnreadNotifications() {
		let apiToCall = '/api/v1/messages/numberofunread/' + this.state.userState[0].id;
		if (this.state.userState[0].role === 'Admin') {
			apiToCall = '/api/v1/messages/numberofunread/admin/' + this.state.userState[0].id;
		}
		axios.get(baseURL + apiToCall).then(res => {
			if (this._isMounted) {
				this.setState({ count: res.data.countUnreadMessages });
			}
		});
	}

	getNumberOfUnreadMessages() {
		axios.get(`${baseURL}/api/v1/messages/unread/count`).then(res => {
			if (this._isMounted) {
				this.setState({ messageCount: res.data.count || 0 });
			}
		});
	}

	setNotificationsAsRead() {
		const messageIds = [];
		this.state.newData.forEach(data => {
			messageIds.push(data.messageID);
		});

		axios.post(baseURL + '/api/v1/messages/markasread', messageIds);
	}

	handleClick = e => {
		if (this._isMounted) {
			try {
				if (this.node.contains(e.target) || this.nodeMobile.contains(e.target)) {
					this.setState({ dropdownOpen: true });
				} else {
					if (this.state.dropdownOpen === true) {
						this.setNotificationsAsRead();
						this.setState({ count: 0, clearMessage: true });
					}
					this.setState({ dropdownOpen: false });
				}
			} catch (e) {
				this.setState({ dropdownOpen: false });
			}
		}
	};

	showSearchBar = e => {
		document.getElementById('mobileSearchBarRevealed').style.display = 'block';
		document.getElementById('mobileSearchBarHidden').style.display = 'none';
	};

	showLoginModal() {
		// 1. add class to body to stop background scroll
		document.body.classList.add('modal-open');

		document.getElementById('myModal').style.display = 'block';
		document.getElementById('loginWayFinder').style.display = 'none';
		document.getElementById('loginButtons').style.display = 'block';
		document.getElementById('loginModalTitle').innerHTML = 'Sign in or create a new account';
		document.getElementById('modalRequestSection').style.display = 'none';

		window.onclick = function (event) {
			if (event.target === document.getElementById('myModal')) {
				// 2. remove class modal-open from body
				document.body.classList.remove('modal-open');
				document.getElementById('myModal').style.display = 'none';
			}
		};
	}

	checkRedirectToast() {
		if (window.localStorage.getItem('redirectMsg') != null) {
			//rerender the Search bar so Toast notification will appear
			this.setState({ showToast: true });
			//Display Toast Notification based on local storage variable
			NotificationManager.warning(window.localStorage.getItem('redirectMsg'), 'Page not found', 10000);
			window.localStorage.removeItem('redirectMsg');
		}
	}

	handleMouseHover() {
		this.setState(this.toggleHoverState);
	}

	toggleHoverState(state) {
		return {
			isHovering: !state.isHovering,
		};
	}

	getLink = (publisherName = '') => {
		if (!isEmpty(publisherName)) return `/account?tab=dataaccessrequests&team=${publisherName}`;

		return `/account?tab=dataaccessrequests`;
	};

	getPublisherLink = data => {
		let { messageDescription, publisherName } = data;
		let link = this.getLink(publisherName);

		return (
			<a href={`${link}`} class='notificationInfo'>
				{messageDescription}
			</a>
		);
	};

	getUserInitials = name => {
		let initials = '';

		if (!isEmpty(name)) {
			initials = name.charAt(0).toUpperCase();
			let surname = name.split(' ');
			let secondLetter = surname[1].charAt(0);

			initials += secondLetter;
		}

		return initials;
	};

	render() {
		const { userState, newData, isLoading, clearMessage, isHovering, textValue } = this.state;
		if (isLoading) {
			return <></>;
		}

		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];

		let communityLink = 'https://discourse-dev.healthresearch.tools/';
		if (window.location.href.includes('.www.')) communityLink = 'https://discourse.healthdatagateway.org/';
		let showUatBanner = false;
		let currentEnv = '';
		if (urlEnv === 'uat' || urlEnv === 'uatbeta' || urlEnv === 'latest') {
			showUatBanner = true;
			if (urlEnv === 'uatbeta') {
				currentEnv = 'UAT BETA';
			} else if (urlEnv === 'uat') {
				currentEnv = 'UAT';
			} else if (urlEnv === 'latest') {
				currentEnv = 'LATEST';
			}
		}

		return (
			<Fragment>
				{showUatBanner === true && <UatBanner currentEnv={currentEnv} />}
				<nav className={classnames('navbarShown', { navbarHidden: !this.state.visible })}>
					<div className='searchBarBackground' id='desktopSearchBar'>
						<Row className='whiteBackground'>
							<Col lg={7} className='pr-0 pl-2'>
								<div className='navBarLogoSpacing'>
									<a style={{ cursor: 'pointer' }} href={cmsURL}>
										<ColourLogoSvg className='ml-4 mt-3' />
									</a>
								</div>

								<div className='navBarLinkSpacing'>
									<CmsDropdown dropdownUrl='exploreDropdown' />
								</div>
								<div className='navBarLinkSpacing'>
									<CmsDropdown dropdownUrl='helpDropdown' />
								</div>
								<div className='navBarLinkSpacing'>
									<CmsDropdown dropdownUrl='usageDataDropdown' />
								</div>
								<div className='navBarLinkSpacing'>
									<CmsDropdown dropdownUrl='aboutUsDropdown' />
								</div>

								<div className='navBarLinkSpacing'>
									<a href={cmsURL + '/pages/latest-news'} className='black-14 cmsDropdownTitle'>
										News
									</a>
								</div>
								<div className='navBarLinkSpacing'>
									<a href={communityLink} className='black-14 cmsDropdownTitle' data-test-id='lnkCommunity'>
										Community
									</a>
								</div>
							</Col>

							<Col lg={5} className='text-right'>
								<div className='nav-wrapper'>
									<div className='navBarSearchBarSpacing'>
										<Container>
											<Row>
												<Col className='pr-0'>
													<span className='searchBarInputGrey'>
														<span className='searchInputIconGrey'>
															<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
														</span>
														<span>
															<input
																data-testid='searchbar'
																type='text'
																placeholder=''
																id='searchInputSpanGrey'
																onChange={this.onSearch}
																onKeyDown={this.props.doSearchMethod}
																value={textValue}
															/>
														</span>
														{this.props.searchString !== '' && this.props.searchString !== undefined ? (
															<span className='searchInputClearGrey' data-testid='searchbar-clear-btn'>
																<span style={{ cursor: 'pointer' }} onClick={this.props.onClearMethod}>
																	<ClearButtonSvg />
																</span>
															</span>
														) : null}
													</span>
												</Col>
											</Row>
										</Container>
									</div>
									<div>
										<Container>
											<Row>
												<Col className='pl-0 pr-0'>
													<AddNewEntity />
												</Col>
											</Row>
										</Container>
									</div>
									{(() => {
										if (userState[0].loggedIn === true) {
											return (
												<Fragment key='userNotifications'>
													<div className='navBarNotificationSpacing' onClick={this.props.doToggleDrawer} data-test-id='imgMessageBadge'>
														<NotificationBadge count={this.state.messageCount} style={{ backgroundColor: '#29235c' }} />
														<SVGIcon name='chat' fill={'#475da7'} width={20} height={20} id='notificationsBell' className={'pointer'} />
													</div>
													<div className='navBarBellNotificationSpacing' data-test-id='imgNotificationBadge'>
														<Dropdown>
															<Dropdown.Toggle as={CustomToggle} ref={node => (this.node = node)}>
																<NotificationBadge count={this.state.count} className='notificationsBellBadge' />
																<SVGIcon
																	name='bell'
																	fill={'#475da7'}
																	width={20}
																	height={20}
																	id='notificationsBell'
																	className={this.state.dropdownOpen ? 'notificationsBell' : null}
																	style={{ cursor: 'pointer' }}
																/>
																{/* <NotificationsBellSvg width={50} height={50} id="notificationsBell" className={this.state.dropdownOpen ? "notificationsBell" : null} style={{ cursor: 'pointer' }} /> */}
															</Dropdown.Toggle>

															<Dropdown.Menu as={CustomMenu} className='desktopNotificationMenu'>
																{newData.length <= 0 ? (
																	<div className='noNotifications'>
																		<div className='gray800-14' style={{ textAlign: 'center' }}>
																			<p>
																				<b>No notifications yet</b>
																			</p>
																			<p>We'll let you know when something important happens to your content or account.</p>
																		</div>
																	</div>
																) : (
																	newData.slice(0, 48).map((dat, index) => {
																		let messageDateString = moment(dat.createdDate).format('D MMMM YYYY HH:mm');

																		if (dat.messageType === 'add') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							{dat.tool && dat.tool.length > 0 ? (
																								<div className='notificationInfoHolder'>
																									<a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id} class='notificationInfo'>
																										{dat.messageDescription}
																									</a>
																								</div>
																							) : (
																								''
																							)}
																							{dat.course && dat.course.length > 0 ? (
																								<div className='notificationInfoHolder'>
																									<a href={'/' + dat.course[0].type + '/' + dat.course[0].id} class='notificationInfo'>
																										{dat.messageDescription}
																									</a>
																								</div>
																							) : (
																								''
																							)}
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'workflow') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={`/account?tab=workflows`} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'data access request') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={`/data-access-request/${dat.messageDataRequestID}`} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'data access request received') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>{this.getPublisherLink(dat)}</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'data access request unlinked') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<span class='notificationInfo'>{dat.messageDescription}</span>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'team unlinked') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<span class='notificationInfo'>{dat.messageDescription}</span>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'team') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<span class='notificationInfo'>{dat.messageDescription}</span>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'added collection') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={'/collection/' + dat.messageObjectID} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'dataset submitted') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={'/account?tab=datasets&team=admin'} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'dataset approved') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={`/dataset/${dat.datasetID}`} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'dataset rejected') {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={`/account?tab=datasets&team=${dat.datasetID}`} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else {
																			return (
																				<Fragment key={`message-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							{dat.tool && dat.tool.length > 0 ? (
																								<div className='notificationInfoHolder'>
																									<a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id} class='notificationInfo'>
																										{dat.messageDescription}
																									</a>
																								</div>
																							) : (
																								''
																							)}
																							{dat.course && dat.course.length > 0 ? (
																								<div className='notificationInfoHolder'>
																									<a href={'/' + dat.course[0].type + '/' + dat.course[0].id} class='notificationInfo'>
																										{dat.messageDescription}
																									</a>
																								</div>
																							) : (
																								''
																							)}
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		}
																	})
																)}
															</Dropdown.Menu>
														</Dropdown>
														{this.checkRedirectToast()}
													</div>
													<div className='navBarAvatarSpacing'>
														<div class='avatar-circle'>
															<span class='initials'>{this.getUserInitials(userState[0].name)}</span>
														</div>
													</div>
												</Fragment>
											);
										} else {
											return (
												<div className='offlineNotificationGap'>
													<WhiteArrowDownSvg width={50} height={50} />
													{this.checkRedirectToast()}
												</div>
											);
										}
									})()}

									<div className='navBarLoginSpacing'>
										{(() => {
											if (userState[0].loggedIn === true) {
												return (
													<Dropdown data-test-id='ddUserNavigation'>
														<Dropdown.Toggle as={CustomToggle}>
															<span className='black-14' data-test-id='lblUserName'>
																{userState[0].name}
															</span>
															<span className='accountDropDownGap'></span>
															<ChevronBottom />
														</Dropdown.Toggle>

														<Dropdown.Menu as={CustomMenu} className='desktopLoginMenu'>
															<Dropdown data-test-id='ddUserNavigation'>
																{!isEmpty(userState[0].teams) ? (
																	<Fragment>
																		<Dropdown.Toggle data-test-id='ddUserNavigationToggle' as={CustomToggleInner}>
																			<span className='black-14' data-test-id='ddUserNavigationSubMenu'>
																				{userState[0].name}
																			</span>
																			<span className='addNewDropDownGap'></span>
																			<ChevronBottom />
																		</Dropdown.Toggle>
																		<Dropdown.Menu as={CustomSubMenu}>
																			<UserDropdownItems isAdmin={userState[0].role === 'Admin'}></UserDropdownItems>
																		</Dropdown.Menu>
																	</Fragment>
																) : (
																	<Fragment>
																		<Dropdown.Item className='black-14 user-dropdown-item'>
																			<span className='gray700-14' data-test-id='lblUserName'>
																				{userState[0].name}
																			</span>
																		</Dropdown.Item>
																		<UserDropdownItems isAdmin={userState[0].role === 'Admin'}></UserDropdownItems>
																	</Fragment>
																)}
															</Dropdown>
															<UserDropdownTeams teams={[...userState[0].teams]} />
															<Dropdown.Divider className='mb-1 mt-1' />
															<Dropdown.Item onClick={this.logout} className='black-14 user-dropdown-item' data-test-id='optLogout'>
																Sign out
															</Dropdown.Item>
														</Dropdown.Menu>
													</Dropdown>
												);
											} else {
												return (
													<>
														<span
															className={isHovering ? 'black-14 textUnderline' : 'black-14'}
															id='myBtn'
															data-test-id='btnLogin'
															style={{ cursor: 'pointer' }}
															onClick={e => {
																this.showLoginModal();
															}}
															onMouseEnter={this.handleMouseHover}
															onMouseLeave={this.handleMouseHover}>
															{' '}
															Sign in | Sign up{' '}
														</span>
													</>
												);
											}
										})()}
									</div>
								</div>
							</Col>
						</Row>
					</div>

					<div id='mobileSearchBar' className={!this.state.visible ? 'navbarHidden' : ''}>
						<div className='searchBarBackground'>
							<Row className='whiteBackground'>
								<Col xs={2}>
									<Dropdown>
										<Dropdown.Toggle as={CustomToggle}>
											<HamBurgerSvg className='hamBurgerHolder' />
										</Dropdown.Toggle>

										<Dropdown.Menu as={CustomMenu} className='mobileLoginMenu'>
											{showUatBanner === true && (
												<Dropdown.Item href='https://discourse.healthdatagateway.org/t/using-the-uat-environment/451' target='_blank'>
													<span class='uatMobileSearchBarBanner uatBannerText'>
														{currentEnv}
														<span class='floatRight'>Read more</span>
													</span>
												</Dropdown.Item>
											)}

											<div>
												<CmsDropdown dropdownUrl='exploreDropdown' isMobile={true} />
												<CmsDropdown dropdownUrl='helpDropdown' isMobile={true} />
												<CmsDropdown dropdownUrl='usageDataDropdown' isMobile={true} />
												<CmsDropdown dropdownUrl='aboutUsDropdown' isMobile={true} />
											</div>

											<Dropdown.Item className='black-14' href={cmsURL + '/pages/latest-news'}>
												News
											</Dropdown.Item>
											<Dropdown.Item className='black-14' href={communityLink}>
												Community
											</Dropdown.Item>

											<Dropdown.Divider />
											{(() => {
												if (userState[0].loggedIn === true) {
													return (
														<>
															<Dropdown.Item href='/account?tab=dashboard&team=user' className='black-14'>
																Dashboard
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=youraccount&team=user' className='black-14'>
																Your Account
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=tools&team=user' className='black-14'>
																Tools
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=reviews&team=user' className='black-14'>
																Reviews
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=projects&team=user' className='black-14'>
																Projects
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=datasetsAdvancedSearch&team=user' className='black-14'>
																Datasets
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=papers&team=user' className='black-14'>
																Papers
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=courses&team=user' className='black-14'>
																Courses
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=dataaccessrequests&team=user' className='black-14'>
																Data access requests
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=collections&team=user' className='black-14'>
																Collections
															</Dropdown.Item>
															{userState[0].role === 'Admin' ? (
																<Dropdown.Item href='/account?tab=usersroles&team=user' className='black-14'>
																	Users and roles
																</Dropdown.Item>
															) : (
																''
															)}
															<Dropdown.Item className='black-14' onClick={this.logout}>
																Logout ({userState[0].name})
															</Dropdown.Item>
														</>
													);
												} else {
													return (
														<>
															<Dropdown.Item
																className='black-14'
																onClick={e => {
																	this.showLoginModal();
																}}>
																Sign in or create a new account
															</Dropdown.Item>
														</>
													);
												}
											})()}
										</Dropdown.Menu>
									</Dropdown>
								</Col>

								{(() => {
									if (userState[0].loggedIn === true) {
										return (
											<>
												<Col xs={8}>
													<div id='mobileSearchBarHidden' style={{ display: 'block' }}>
														<div className='navBarLogoSpacing'>
															<a href={cmsURL}>
																<ColourLogoSvg className='ml-4 mt-3' />
															</a>
														</div>
														<div className='navBarSearchIconHolder'>
															<a href='#' onClick={this.showSearchBar}>
																<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
															</a>
														</div>
													</div>

													<div id='mobileSearchBarRevealed' style={{ display: 'none' }}>
														<div className='navBarSearchBarSpacing'>
															<Container>
																<Row>
																	<Col>
																		<span className='searchBarInputGrey'>
																			<span className='searchInputIconGrey'>
																				<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
																			</span>
																			<span>
																				<input
																					type='text'
																					placeholder='Search'
																					id='searchInputSpanGrey'
																					onChange={this.onSearch}
																					onKeyDown={this.props.doSearchMethod}
																					value={this.props.searchString}
																				/>
																			</span>
																			{this.props.searchString !== '' && this.props.searchString !== undefined ? (
																				<span className='searchInputClearGrey'>
																					<a style={{ cursor: 'pointer' }} href={'/search?search='}>
																						<ClearButtonSvg />
																					</a>
																				</span>
																			) : null}
																		</span>
																	</Col>
																</Row>
															</Container>
														</div>
													</div>
												</Col>
												<Col xs={2} className='text-right'>
													<div className='navBarBellNotificationSpacing'>
														<Dropdown>
															<Dropdown.Toggle as={CustomToggle} ref={nodeMobile => (this.nodeMobile = nodeMobile)}>
																<NotificationBadge count={this.state.count} style={{ backgroundColor: '#29235c' }} />
																<SVGIcon
																	name='bell'
																	fill={'#475da7'}
																	width={20}
																	height={20}
																	id='notificationsBell'
																	className={this.state.dropdownOpen ? 'notificationsBell' : null}
																	style={{ cursor: 'pointer' }}
																/>
																{/* <NotificationsBellSvg width={50} height={50} id="notificationsBell" className={this.state.dropdownOpen ? "notificationsBell" : null} style={{ cursor: 'pointer' }} /> */}
															</Dropdown.Toggle>

															<Dropdown.Menu as={CustomMenu} className='mobileNotificationMenu'>
																{newData.length <= 0 ? (
																	<div className='noNotifications'>
																		<div className='gray800-14' style={{ textAlign: 'center' }}>
																			<p>
																				<b>No notifications yet</b>
																			</p>
																			<p>We'll let you know when something important happens to your content or account.</p>
																		</div>
																	</div>
																) : (
																	newData.slice(0, 48).map((dat, index) => {
																		let messageDateString = moment(dat.createdDate).format('D MMMM YYYY HH:mm');

																		if (dat.messageType === 'add') {
																			return (
																				<Fragment key={`notification-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a href={'/' + dat.tool.type + '/' + dat.tool.id} class='notificationInfo'>
																									{dat.messageDescription}
																								</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else if (dat.messageType === 'data access request') {
																			return (
																				<Fragment key={`notification-${index}`}>
																					<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																						<Col xs={10}>
																							<div className='notificationDate'>{messageDateString + '\n'}</div>
																							<div className='notificationInfoHolder'>
																								<a class='notificationInfo'>{dat.messageDescription}</a>
																							</div>
																						</Col>
																						<Col xs={2}>
																							{dat.isRead === 'false' && !clearMessage ? (
																								<SVGIcon
																									name='newnotificationicon'
																									width={20}
																									height={20}
																									visble='true'
																									style={{
																										float: 'right',
																										fill: '#3db28c',
																										paddingRight: '0px',
																										marginRight: '10px',
																										marginTop: '5px',
																									}}
																									fill={'#3db28c'}
																									stroke='none'
																								/>
																							) : null}
																						</Col>
																					</Row>
																					<Dropdown.Divider style={{ margin: '0px' }} />
																				</Fragment>
																			);
																		} else {
																			if (dat.messageTo === 0) {
																				return (
																					<Fragment key={`notification-${index}`}>
																						<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																							<Col xs={10}>
																								<div className='notificationDate'>{messageDateString + '\n'}</div>
																								{dat.tool.length && (
																									<div className='notificationInfoHolder'>
																										<a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id} class='notificationInfo'>
																											{dat.messageDescription}
																										</a>
																									</div>
																								)}
																							</Col>
																							<Col xs={2}>
																								{dat.isRead === 'false' && !clearMessage ? (
																									<SVGIcon
																										name='newnotificationicon'
																										width={20}
																										height={20}
																										visble='true'
																										style={{
																											float: 'right',
																											fill: '#3db28c',
																											paddingRight: '0px',
																											marginRight: '10px',
																											marginTop: '5px',
																										}}
																										fill={'#3db28c'}
																										stroke='none'
																									/>
																								) : null}
																							</Col>
																						</Row>
																						<Dropdown.Divider style={{ margin: '0px' }} />
																					</Fragment>
																				);
																			} else {
																				return (
																					<Fragment key={`notification-${index}`}>
																						<Row className={dat.isRead === 'true' || clearMessage ? 'notificationReadBackground' : ''}>
																							<Col xs={10}>
																								<div className='notificationDate'>{messageDateString + '\n'}</div>
																								<div className='notificationInfoHolder'>
																									{dat.tool[0] === undefined ? (
																										<a href={'/'} class='notificationInfo'>
																											{dat.messageDescription}
																										</a>
																									) : (
																										<a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id} class='notificationInfo'>
																											{dat.messageDescription}
																										</a>
																									)}
																									{/* <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id} class="notificationInfo">{dat.messageDescription}</a> */}
																								</div>
																							</Col>
																							<Col xs={2}>
																								{dat.isRead === 'false' && !clearMessage ? (
																									<SVGIcon
																										name='newnotificationicon'
																										width={20}
																										height={20}
																										visble='true'
																										style={{
																											float: 'right',
																											fill: '#3db28c',
																											paddingRight: '0px',
																											marginRight: '10px',
																											marginTop: '5px',
																										}}
																										fill={'#3db28c'}
																										stroke='none'
																									/>
																								) : null}
																							</Col>
																						</Row>
																						<Dropdown.Divider style={{ margin: '0px' }} />
																					</Fragment>
																				);
																			}
																		}
																	})
																)}
															</Dropdown.Menu>
														</Dropdown>
													</div>
												</Col>
											</>
										);
									} else {
										return (
											<Col xs={10}>
												<div id='mobileSearchBarHidden' style={{ display: 'block' }}>
													<div className='navBarLogoSpacing'>
														<a href={cmsURL}>
															<ColourLogoSvg className='ml-4 mt-3' />
														</a>
													</div>

													<div className='navBarSearchIconHolderAlt'>
														<a href='#' onClick={this.showSearchBar}>
															<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
														</a>
													</div>
												</div>

												<div id='mobileSearchBarRevealed' style={{ display: 'none' }}>
													<div className='navBarSearchBarSpacing'>
														<Container>
															<Row>
																<Col>
																	<span className='searchBarInputGrey'>
																		<span className='searchInputIconGrey'>
																			<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
																		</span>
																		<span>
																			<input
																				type='text'
																				placeholder='Search'
																				id='searchInputSpanGrey'
																				onChange={this.onSearch}
																				onKeyDown={this.props.doSearchMethod}
																				value={this.props.searchString}
																			/>
																		</span>
																		{this.props.searchString !== '' && this.props.searchString !== undefined ? (
																			<span className='searchInputClearGrey'>
																				<a style={{ cursor: 'pointer' }} href={'/search?search='}>
																					<ClearButtonSvg />
																				</a>
																			</span>
																		) : null}
																	</span>
																</Col>
															</Row>
														</Container>
													</div>
												</div>
											</Col>
										);
									}
								})()}
							</Row>
						</div>
					</div>
				</nav>
			</Fragment>
		);
	}
}

export default SearchBar;
