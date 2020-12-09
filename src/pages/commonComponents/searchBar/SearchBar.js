import React, { useState, Fragment } from 'react';
import axios from 'axios';
import classnames from 'classnames';

import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import NotificationBadge from 'react-notification-badge';

import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as ColourLogoSvg } from '../../../images/colour.svg';
import { ReactComponent as ClearButtonSvg } from '../../../images/clear.svg';
import { ReactComponent as NotificationsBellSvg } from '../../../images/bell.svg';
import { ReactComponent as HamBurgerSvg } from '../../../images/hamburger.svg';
import { ReactComponent as ArrowDownSvg } from '../../../images/stock.svg';
import { ReactComponent as WhiteArrowDownSvg } from '../../../images/arrowDownWhite.svg';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import './SearchBar.scss';

import moment from 'moment';
import { cmsURL } from '../../../configs/url.config';

var baseURL = require('../BaseURL').getURL();

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
			window.location.reload();
		});
	};

	onSearch = e => {
		//onSearch
		this.setState({ textValue: e.target.value });
		this.props.doUpdateSearchString(e.target.value);
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

	render() {
		const { userState, newData, isLoading, clearMessage, isHovering } = this.state;

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

		return (
			<Fragment>
				<nav className={classnames('navbarShown', { navbarHidden: !this.state.visible })}>
					<div className='searchBarBackground' id='desktopSearchBar'>
						<Row className='whiteBackground'>
							<Col lg={5}>
								<div className='navBarLogoSpacing'>
									<a style={{ cursor: 'pointer' }} href={cmsURL}>
										<ColourLogoSvg className='ml-4 mt-3' />
									</a>
								</div>
								<div className='navBarLinkSpacing'>
									<a href={cmsURL + '/pages/about'} className='black-14'>
										About
									</a>
								</div>
								<div className='navBarLinkSpacing'>
									<a href={cmsURL + '/pages/community'} className='black-14'>
										Community
									</a>
								</div>
								<div className='navBarLinkSpacing'>
									<a href={'/dashboard'} className='black-14'>
										Dashboard
									</a>
								</div>
							</Col>

							<Col lg={7} className='text-right'>
								<div className='nav-wrapper'>
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
																data-testid='searchbar'
																onChange={this.onSearch}
																onKeyDown={this.props.doSearchMethod}
																value={this.props.searchString}
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

									{(() => {
										if (userState[0].loggedIn === true) {
											return (
												<Fragment key='userNotifications'>
													<div className='navBarNotificationSpacing' onClick={this.props.doToggleDrawer}>
														<NotificationBadge count={this.state.messageCount} style={{ backgroundColor: '#29235c' }} />
														<SVGIcon name='chat' fill={'#475da7'} width={20} height={20} id='notificationsBell' className={'pointer'} />
													</div>
													<div className='navBarNotificationSpacing'>
														<Dropdown>
															<Dropdown.Toggle as={CustomToggle} ref={node => (this.node = node)}>
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
													<Dropdown>
														<Dropdown.Toggle as={CustomToggle}>
															<span className='black-14'>{userState[0].name}</span>
															<span className='accountDropDownGap'></span>
															<ArrowDownSvg />
														</Dropdown.Toggle>

														<Dropdown.Menu as={CustomMenu} className='desktopLoginMenu'>
															<Dropdown.Item href='/account?tab=dashboard' className='black-14'>
																Dashboard
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=youraccount' className='black-14'>
																Your Account
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=tools' className='black-14'>
																Tools
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=reviews' className='black-14'>
																Reviews
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=projects' className='black-14'>
																Projects
															</Dropdown.Item>
															{/* <Dropdown.Item href="/account?tab=datasets" className="black-14">Datasets</Dropdown.Item> */}
															<Dropdown.Item href='/account?tab=papers' className='black-14'>
																Papers
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=courses' className='black-14'>
																Courses
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=dataaccessrequests' className='black-14'>
																Data access requests
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=collections' className='black-14'>
																Collections
															</Dropdown.Item>
															{userState[0].role === 'Admin' ? (
																<Dropdown.Item href='/account?tab=usersroles' className='black-14'>
																	Users and roles
																</Dropdown.Item>
															) : (
																''
															)}
															<Dropdown.Item onClick={this.logout} className='black-14'>
																Logout
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
											<Dropdown.Item className='black-14' href={cmsURL + '/pages/about'}>
												About
											</Dropdown.Item>
											<Dropdown.Item className='black-14' href={cmsURL + '/pages/community'}>
												Community
											</Dropdown.Item>
											<Dropdown.Item className='black-14' href={'/dashboard'}>
												Dashboard
											</Dropdown.Item>
											<Dropdown.Divider />
											{(() => {
												if (userState[0].loggedIn === true) {
													return (
														<>
															<Dropdown.Item href='/account?tab=dashboard' className='black-14'>
																Dashboard
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=youraccount' className='black-14'>
																Your Account
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=tools' className='black-14'>
																Tools
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=reviews' className='black-14'>
																Reviews
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=projects' className='black-14'>
																Projects
															</Dropdown.Item>
															{/* <Dropdown.Item href="/account?tab=datasets" className="black-14">Datasets</Dropdown.Item> */}
															<Dropdown.Item href='/account?tab=papers' className='black-14'>
																Papers
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=courses' className='black-14'>
																Courses
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=dataaccessrequests' className='black-14'>
																Data access requests
															</Dropdown.Item>
															<Dropdown.Item href='/account?tab=collections' className='black-14'>
																Collections
															</Dropdown.Item>
															{userState[0].role === 'Admin' ? (
																<Dropdown.Item href='/account?tab=usersroles' className='black-14'>
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
													<div className='navBarNotificationSpacing'>
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
