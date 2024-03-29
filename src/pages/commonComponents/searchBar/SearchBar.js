import { cx } from '@emotion/css';
import axios from 'axios';
import { Box } from 'hdruk-react-core';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { forwardRef, Component, Fragment } from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';

import { CustomMenu, NotificationBadge } from 'components';

import { cmsURL } from '../../../configs/url.config';
import { ReactComponent as ColourLogoSvg } from '../../../images/colour.svg';
import { ReactComponent as ColourLogoSvgMobile } from '../../../images/colourMobile.svg';
import { ReactComponent as HamBurgerSvg } from '../../../images/hamburger.svg';
import SVGIcon from '../../../images/SVGIcon';
import googleAnalytics from '../../../tracking';
import UatBanner from '../uatBanner/UatBanner';
import '../uatBanner/UatBanner.scss';
import CmsDropdown from './CmsDropdown';
import './SearchBar.scss';
import { authUtils, roleUtils, accountUtils } from 'utils';
import { HeaderNav, HeaderNavMobile } from 'modules';

var baseURL = require('../BaseURL').getURL();
const urlEnv = require('../BaseURL').getURLEnv();
const communityLink = require('../BaseURL').getDiscourseURL();

const CustomToggle = forwardRef(({ children, onClick, subToggle }, ref) => (
    <a
        href='#'
        ref={ref}
        onClick={e => {
            googleAnalytics.recordEvent('Search bar', 'Opened user notifications', 'Clicked search bar notification icon');
            e.preventDefault();
            onClick(e);
        }}
        className={subToggle ? 'dropdown-sub-menu' : 'user-dropdown-menu'}>
        {children}
    </a>
));

class SearchBar extends Component {
    _isMounted = false;

    state = {
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
        count: 0,
        messageCount: 0,
        prevScrollpos: window.pageYOffset,
        visible: true,
        isLoading: true,
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
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
        let visible;

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

    doMessagesCall() {
        var apiToCall = '/api/v1/messages/' + this.state.userState[0].id;

        if (authUtils.getIsRootRoleAdmin(this.state.userState)) {
            apiToCall = '/api/v1/messages/admin/' + this.state.userState[0].id;
        }

        axios.get(baseURL + apiToCall).then(res => {
            if (this._isMounted) {
                this.setState({
                    newData: res.data.newData,
                    isLoading: false,
                });
            }
        });
    }

    getNumberOfUnreadNotifications() {
        let apiToCall = '/api/v1/messages/numberofunread/' + this.state.userState[0].id;

        if (authUtils.getIsRootRoleAdmin(this.state.userState)) {
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
            //Display Toast Notification based on local storage variable
            NotificationManager.warning(window.localStorage.getItem('redirectMsg'), 'Page not found', 10000);
            window.localStorage.removeItem('redirectMsg');
        }
    }

    getDarLink = data => {
        const team = accountUtils.getTeam(this.state.userState[0]?.teams, data.publisherName);
        const isReviewer = roleUtils.getIsReviewer(team?.roles);

        const tab = isReviewer ? 'dataaccessrequests' : 'workflows';

        return this.getPublisherLink(data, tab);
    };

    getPublisherLink = (data, tabName) => {
        let { messageDescription, publisherName: teamId } = data;

        return (
            <a href={`/account?tab=${tabName}&teamType=team&teamId=${teamId}`} className='notificationInfo'>
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
        const { userState, newData, isLoading, clearMessage } = this.state;
        if (isLoading) {
            return <></>;
        }
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
                <nav className={cx('navbarShown', { navbarHidden: !this.state.visible })}>
                    <div className='searchBarBackground' id='desktopSearchBar'>
                        <Row className='whiteBackground'>
                            <Box className='pr-0 pl-2' flexGrow='1' display='flex' alignItems='center' gap={6}>
                                <Box mt={1} ml={6}>
                                    <a style={{ cursor: 'pointer' }} href={cmsURL}>
                                        <ColourLogoSvg />
                                    </a>
                                </Box>

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
                                    <a
                                        href={cmsURL + '/pages/latest-news'}
                                        className='black-14 cmsDropdownTitle'
                                        onClick={() => {
                                            googleAnalytics.recordEvent(
                                                'Search bar',
                                                'Navigated to latest news',
                                                'Clicked search bar navigation link'
                                            );
                                        }}>
                                        News
                                    </a>
                                </div>
                                <div className='navBarLinkSpacing'>
                                    <a
                                        href={communityLink}
                                        className='black-14 cmsDropdownTitle'
                                        data-testid='lnkCommunity'
                                        onClick={() => {
                                            googleAnalytics.recordEvent(
                                                'Search bar',
                                                'Navigated to discourse',
                                                'Clicked search bar navigation link'
                                            );
                                        }}>
                                        Community
                                    </a>
                                </div>
                            </Box>

                            <div className='text-right'>
                                <div className='nav-wrapper'>
                                    {(() => {
                                        if (userState[0].loggedIn === true) {
                                            return (
                                                <Box display='flex' alignItems='center'>
                                                    <Box mr={3} onClick={this.props.doToggleDrawer} data-testid='imgMessageBadge'>
                                                        <NotificationBadge
                                                            count={this.state.messageCount}
                                                            style={{ backgroundColor: '#29235c' }}
                                                            className='messagesBadge'
                                                        />
                                                        <SVGIcon
                                                            name='chat'
                                                            fill={'#475da7'}
                                                            width={20}
                                                            height={20}
                                                            id='notificationsBell'
                                                            className={'pointer'}
                                                        />
                                                    </Box>
                                                    <Box mr={8} data-testid='imgNotificationBadge'>
                                                        <Dropdown>
                                                            <Dropdown.Toggle as={CustomToggle} ref={node => (this.node = node)}>
                                                                <NotificationBadge
                                                                    count={this.state.count}
                                                                    className='notificationsBellBadge'
                                                                />
                                                                <SVGIcon
                                                                    name='bell'
                                                                    fill={'#475da7'}
                                                                    width={20}
                                                                    height={20}
                                                                    id='notificationsBell'
                                                                    className='notificationsBell'
                                                                    style={{ cursor: 'pointer' }}
                                                                />
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu as={CustomMenu} className='desktopNotificationMenu'>
                                                                {newData.length <= 0 ? (
                                                                    <div className='noNotifications'>
                                                                        <div className='gray800-14' style={{ textAlign: 'center' }}>
                                                                            <p>
                                                                                <b>No notifications yet</b>
                                                                            </p>
                                                                            <p>
                                                                                We'll let you know when something important happens to your
                                                                                content or account.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    newData.slice(0, 48).map((dat, index) => {
                                                                        let messageDateString = moment(dat.createdDate).format(
                                                                            'D MMMM YYYY HH:mm'
                                                                        );

                                                                        if (dat.messageType === 'add') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            {dat.tool && dat.tool.length > 0 ? (
                                                                                                <div className='notificationInfoHolder'>
                                                                                                    <a
                                                                                                        href={
                                                                                                            '/' +
                                                                                                            dat.tool[0].type +
                                                                                                            '/' +
                                                                                                            dat.tool[0].id
                                                                                                        }
                                                                                                        className='notificationInfo'>
                                                                                                        {dat.messageDescription}
                                                                                                    </a>
                                                                                                </div>
                                                                                            ) : (
                                                                                                ''
                                                                                            )}
                                                                                            {dat.course && dat.course.length > 0 ? (
                                                                                                <div className='notificationInfoHolder'>
                                                                                                    <a
                                                                                                        href={
                                                                                                            '/' +
                                                                                                            dat.course[0].type +
                                                                                                            '/' +
                                                                                                            dat.course[0].id
                                                                                                        }
                                                                                                        className='notificationInfo'>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                {this.getDarLink(dat)}
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={`/data-access-request/${dat.messageDataRequestID}`}
                                                                                                    className='notificationInfo'>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                {this.getPublisherLink(
                                                                                                    dat,
                                                                                                    'dataaccessrequests'
                                                                                                )}
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
                                                                        } else if (dat.messageType === 'data access request log updated') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                {this.getPublisherLink(
                                                                                                    dat,
                                                                                                    'dataaccessrequests'
                                                                                                )}
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <span className='notificationInfo'>
                                                                                                    {dat.messageDescription}
                                                                                                </span>
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
                                                                        } else if (dat.messageType === 'data access message sent') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={`/data-access-request/${dat.messageDataRequestID}`}
                                                                                                    class='notificationInfo'>
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
                                                                        } else if (dat.messageType === 'team unlinked') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <span className='notificationInfo'>
                                                                                                    {dat.messageDescription}
                                                                                                </span>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <span className='notificationInfo'>
                                                                                                    {dat.messageDescription}
                                                                                                </span>
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
                                                                        } else if (dat.messageType === 'team added') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={`/account?tab=teamManagement&teamType=team&teamId=${dat.publisherName}&subTab=members`}
                                                                                                    class='notificationInfo'>
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
                                                                        } else if (dat.messageType === 'added collection') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={
                                                                                                        '/collection/' + dat.messageObjectID
                                                                                                    }
                                                                                                    className='notificationInfo'>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={
                                                                                                        '/account?tab=datasets&teamType=admin'
                                                                                                    }
                                                                                                    className='notificationInfo'>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={`/dataset/${dat.datasetID}`}
                                                                                                    className='notificationInfo'>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                {this.getPublisherLink(dat, 'datasets')}
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
                                                                        } else if (dat.messageType === 'draft dataset deleted') {
                                                                            return (
                                                                                <Fragment key={`message-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <span class='notificationInfo'>
                                                                                                    {dat.messageDescription}
                                                                                                </span>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            {dat.tool && dat.tool.length > 0 ? (
                                                                                                <div className='notificationInfoHolder'>
                                                                                                    <a
                                                                                                        href={
                                                                                                            '/' +
                                                                                                            dat.tool[0].type +
                                                                                                            '/' +
                                                                                                            dat.tool[0].id
                                                                                                        }
                                                                                                        className='notificationInfo'>
                                                                                                        {dat.messageDescription}
                                                                                                    </a>
                                                                                                </div>
                                                                                            ) : (
                                                                                                ''
                                                                                            )}
                                                                                            {dat.course && dat.course.length > 0 ? (
                                                                                                <div className='notificationInfoHolder'>
                                                                                                    <a
                                                                                                        href={
                                                                                                            '/' +
                                                                                                            dat.course[0].type +
                                                                                                            '/' +
                                                                                                            dat.course[0].id
                                                                                                        }
                                                                                                        className='notificationInfo'>
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
                                                    </Box>
                                                    <div className='navBarAvatarSpacing'>
                                                        <div className='avatar-circle'>
                                                            <span className='initials'>{this.getUserInitials(userState[0].name)}</span>
                                                        </div>
                                                    </div>
                                                </Box>
                                            );
                                        }
                                    })()}

                                    <HeaderNav showLoginModal={this.showLoginModal} logout={this.logout} />
                                </div>
                            </div>
                        </Row>
                    </div>

                    <div id='mobileSearchBar' className={!this.state.visible ? 'navbarHidden' : ''}>
                        <div className='searchBarBackground'>
                            <Box backgroundColor='white' display='flex' alignItems='center' px={5} py={2} height='80px'>
                                <Box>
                                    <Dropdown>
                                        <Dropdown.Toggle as={CustomToggle}>
                                            <HamBurgerSvg className='hamBurgerHolder' />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu as={CustomMenu} className='mobileLoginMenu'>
                                            {showUatBanner === true && (
                                                <Dropdown.Item
                                                    href='https://discourse.healthdatagateway.org/t/using-the-uat-environment/451'
                                                    target='_blank'>
                                                    <span className='uatMobileSearchBarBanner uatBannerText'>
                                                        {currentEnv}
                                                        <span className='floatRight'>Read more</span>
                                                    </span>
                                                </Dropdown.Item>
                                            )}

                                            <div>
                                                <CmsDropdown dropdownUrl='exploreDropdown' isMobile={true} />
                                                <CmsDropdown dropdownUrl='helpDropdown' isMobile={true} />
                                                <CmsDropdown dropdownUrl='usageDataDropdown' isMobile={true} />
                                                <CmsDropdown dropdownUrl='aboutUsDropdown' isMobile={true} />
                                            </div>

                                            <Dropdown.Item className='black-14 cmsDropdown' href={cmsURL + '/pages/latest-news'}>
                                                News
                                            </Dropdown.Item>
                                            <Dropdown.Item className='black-14 cmsDropdown' href={communityLink}>
                                                Community
                                            </Dropdown.Item>

                                            <Dropdown.Divider />
                                            <HeaderNavMobile showLoginModal={this.showLoginModal} logout={this.logout} />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Box>

                                {(() => {
                                    if (userState[0].loggedIn === true) {
                                        return (
                                            <>
                                                <Box
                                                    flexGrow='1'
                                                    ml={6}
                                                    pt={2}
                                                    display={{
                                                        xxs: 'none',
                                                        sm: 'flex',
                                                    }}
                                                    alignItems='center'>
                                                    <a href={cmsURL} className='mobileLogoWrapper'>
                                                        <ColourLogoSvgMobile />
                                                    </a>
                                                </Box>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='flex-end'
                                                    gap={6}
                                                    flexGrow={{
                                                        xxs: '1',
                                                        sm: 0,
                                                    }}>
                                                    <Box xs={4} className='navBarMessageSpacing'>
                                                        <div onClick={this.props.doToggleDrawer} data-testid='imgMessageBadge'>
                                                            <NotificationBadge
                                                                count={this.state.messageCount}
                                                                style={{ backgroundColor: '#29235c' }}
                                                                className='messageBadgeMobile'
                                                            />
                                                            <SVGIcon
                                                                name='chat'
                                                                fill={'#475da7'}
                                                                width={20}
                                                                height={20}
                                                                id='notificationsBell'
                                                                className={'pointer'}
                                                            />
                                                        </div>
                                                    </Box>
                                                    <Box>
                                                        <Dropdown>
                                                            <Dropdown.Toggle
                                                                as={CustomToggle}
                                                                ref={nodeMobile => (this.nodeMobile = nodeMobile)}>
                                                                <NotificationBadge
                                                                    count={this.state.count}
                                                                    style={{ backgroundColor: '#29235c' }}
                                                                    className='notificationBadgeMobile'
                                                                />
                                                                <SVGIcon
                                                                    name='bell'
                                                                    fill={'#475da7'}
                                                                    width={20}
                                                                    height={20}
                                                                    id='notificationsBell'
                                                                    className='notificationsBell'
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
                                                                            <p>
                                                                                We'll let you know when something important happens to your
                                                                                content or account.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    newData.slice(0, 48).map((dat, index) => {
                                                                        let messageDateString = moment(dat.createdDate).format(
                                                                            'D MMMM YYYY HH:mm'
                                                                        );

                                                                        if (dat.messageType === 'add') {
                                                                            return (
                                                                                <Fragment key={`notification-${index}`}>
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a
                                                                                                    href={
                                                                                                        '/' +
                                                                                                        dat.tool.type +
                                                                                                        '/' +
                                                                                                        dat.tool.id
                                                                                                    }
                                                                                                    className='notificationInfo'>
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
                                                                                    <Row
                                                                                        className={
                                                                                            dat.isRead === 'true' || clearMessage
                                                                                                ? 'notificationReadBackground'
                                                                                                : ''
                                                                                        }>
                                                                                        <Col xs={10}>
                                                                                            <div className='notificationDate'>
                                                                                                {messageDateString + '\n'}
                                                                                            </div>
                                                                                            <div className='notificationInfoHolder'>
                                                                                                <a href='#' class='notificationInfo'>
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
                                                                            if (dat.messageTo === 0) {
                                                                                return (
                                                                                    <Fragment key={`notification-${index}`}>
                                                                                        <Row
                                                                                            className={
                                                                                                dat.isRead === 'true' || clearMessage
                                                                                                    ? 'notificationReadBackground'
                                                                                                    : ''
                                                                                            }>
                                                                                            <Col xs={10}>
                                                                                                <div className='notificationDate'>
                                                                                                    {messageDateString + '\n'}
                                                                                                </div>
                                                                                                {dat.tool.length && (
                                                                                                    <div className='notificationInfoHolder'>
                                                                                                        <a
                                                                                                            href={
                                                                                                                '/' +
                                                                                                                dat.tool[0].type +
                                                                                                                '/' +
                                                                                                                dat.tool[0].id
                                                                                                            }
                                                                                                            className='notificationInfo'>
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
                                                                                        <Row
                                                                                            className={
                                                                                                dat.isRead === 'true' || clearMessage
                                                                                                    ? 'notificationReadBackground'
                                                                                                    : ''
                                                                                            }>
                                                                                            <Col xs={10}>
                                                                                                <div className='notificationDate'>
                                                                                                    {messageDateString + '\n'}
                                                                                                </div>
                                                                                                <div className='notificationInfoHolder'>
                                                                                                    {dat.tool[0] === undefined ? (
                                                                                                        <a
                                                                                                            href={'/'}
                                                                                                            className='notificationInfo'>
                                                                                                            {dat.messageDescription}
                                                                                                        </a>
                                                                                                    ) : (
                                                                                                        <a
                                                                                                            href={
                                                                                                                '/' +
                                                                                                                dat.tool[0].type +
                                                                                                                '/' +
                                                                                                                dat.tool[0].id
                                                                                                            }
                                                                                                            className='notificationInfo'>
                                                                                                            {dat.messageDescription}
                                                                                                        </a>
                                                                                                    )}
                                                                                                    {/* <a href={'/' + dat.tool[0].type + '/' + dat.tool[0].id} className="notificationInfo">{dat.messageDescription}</a> */}
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
                                                    </Box>
                                                </Box>
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
                                                </div>
                                            </Col>
                                        );
                                    }
                                })()}
                            </Box>
                        </div>
                    </div>
                </nav>
            </Fragment>
        );
    }
}

export default SearchBar;
