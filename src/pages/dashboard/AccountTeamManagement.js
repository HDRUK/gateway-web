import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import { isEmpty, upperFirst } from 'lodash';
import axios from 'axios';
import Loading from '../commonComponents/Loading';
import { baseURL } from '../../configs/url.config';
import AccountMembers from './AccountMembers';
import TeamGatewayEmail from './Team/TeamGatewayEmail';
import TeamGatewayNotificationEmails from './Team/TeamGatewayNotificationEmails';
import FieldRepeater from '../commonComponents/FieldRepeater/FieldRepeater';
import TeamEmailAlertModal from './Team/TeamEmailAlertModal';
import TeamNotificationsConfirmationModal from './Team/TeamNotificationsConfirmationModal';
import { userTypes, tabTypes } from './Team/teamUtil';
import SVGIcon from '../../images/SVGIcon';
import './Dashboard.scss';
import { LayoutContent } from '../../components/Layout';

const AccountTeamManagement = ({
	userState = [],
	team = '',
	innertab,
	forwardRef,
	onTeamManagementSave,
	onTeamManagementTabChange,
	onClearInnerTab,
}) => {
	// constants
	const alertTypes = {
		success: 'success',
		warning: 'warning',
	};
	let messageKey = 'message';
	// state
	const [isLoading, setLoading] = useState(false);
	const [alerts, setAlerts] = useState([]);
	const [teamId, setTeamId] = useState(null);
	const [memberNotifications, setGatewayEmailNotification] = useState([{ optIn: true, notificationType: 'dataAccessRequest' }]);
	const [teamGatewayNotifications, setGatewayNotifications] = useState([
		{ notificationType: 'dataAccessRequest', optIn: false, subscribedEmails: [{ value: '', error: '' }], message: 'Test message' },
	]);
	const [alertModal, setAlertModal] = useState(false);
	const [teamEmailModal, setTeamEmailModal] = useState(false);
	const [alertModalOptions, setAlertModalOptions] = useState({ title: '', body: '' });
	const [activeTabKey, setActiveTab] = useState(tabTypes.Members);
	let history = useHistory();
	forwardRef(() => saveNotifications());

	// functions
	const onTabChange = key => {
		onTeamManagementTabChange(key);
		setActiveTab(key);
		// clear alerts on tab change...
		setAlerts([]);
	};

	// generate an icon based on the type needed
	const generateAlertIcon = type => {
		switch (type) {
			case alertTypes.success:
				return <SVGIcon name='check' width={18} height={18} fill={'#2C8267'} />;
			case alertTypes.warning:
				return <SVGIcon name='attention' width={18} height={18} fill={'#f0bb24'} />;
			default:
				return <SVGIcon name='check' width={18} height={18} fill={'#2C8267'} />;
		}
	};

	// manage and insert alerts into the UI
	const generateAlerts = () => {
		if (!isEmpty(alerts)) {
			return alerts.map((alert, i) => {
				let { type = '', message = '' } = alert;
				return (
					<Row className='mt-3' key={`alert-${i}`}>
						<Col xs={1}></Col>
						<Col xs={10}>
							<Alert variant={type} className='col-sm-12 main-alert'>
								{generateAlertIcon(type)} {message}
							</Alert>
						</Col>
						<Col xs={1}></Col>
					</Row>
				);
			});
		}
		return '';
	};

	const hasTeamNotificationOptIns = () => {
		if (!isEmpty(teamGatewayNotifications)) {
			return teamGatewayNotifications.some(notification => notification.optIn === true);
		}
	};

	const getTeamNotificationType = notificationType => {
		return teamGatewayNotifications.findIndex(notification => notification.notificationType === notificationType);
	};

	const getMemberNotification = notificationType => {
		return memberNotifications.findIndex(notification => notification.notificationType === notificationType);
	};

	const userHasRole = (teamId, role) => {
		const team = userState[0].teams.filter(t => {
			return t._id === teamId;
		})[0];
		return team && team.roles.includes(role);
	};

	const userRoleIsAdmin = teamId => {
		const team = userState[0].teams.filter(t => {
			return t._id === teamId;
		})[0];
		return team && team.isAdmin && !team.roles.includes(userTypes.MANAGER);
	};

	const getTotalGatewayTeamEmails = (data = []) => {
		// 1. if the user has passed in data ie set team emails to that data
		if (!isEmpty(data)) {
			let teamEmails = [...data];
			// 3. if the emails are not empty and are clear of errors return the count else 0;
			return [...teamEmails].filter(item => item.value !== '' && isEmpty(item.error)).length;
		}
		return 0;
	};

	// send email notifications to my gateway email address
	const togglePersonalNotifications = (checked, e = {}, id = '') => {
		if (!isEmpty(id)) {
			const foundTeamIndex = getTeamNotificationType(id);
			const foundMemberIndex = getMemberNotification(id);
			if (foundTeamIndex > -1) {
				let totalGatewayEmails = getTotalGatewayTeamEmails(teamGatewayNotifications[foundTeamIndex].subscribedEmails);
				if (!checked && totalGatewayEmails === 0) {
					return '';
				} else {
					memberNotifications[foundMemberIndex].optIn = checked;
					setGatewayEmailNotification([...memberNotifications]);
				}
			}
		}
	};

	// send email notifications to team email address
	const toggleTeamNotifications = (checked, e = {}, id = '') => {
		if (!isEmpty(id)) {
			// 1. find notificationType
			let foundIndex = getTeamNotificationType(id);
			if (foundIndex > -1) {
				// 2. update the notification by type
				teamGatewayNotifications[foundIndex] = {
					...teamGatewayNotifications[foundIndex],
					optIn: checked,
				};
			}
			// 3. update and set state
			setGatewayNotifications([...teamGatewayNotifications]);
		}
	};

	const handleFieldChange = (e, index, notificationType = '') => {
		let error = '';
		const { value } = e.target;
		// 1. find the object in team gateway notifications
		let foundIndex = getTeamNotificationType(notificationType);
		if (foundIndex > -1) {
			const pattern = new RegExp(
				/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
			);
			if (value === '') {
				error = '';
			} else if (!pattern.test(value)) {
				// 2. can be expanded in future to return error based on notification type using mapper
				error = 'Please enter valid email address.';
			}
			// 3. update the value in our state for email object
			teamGatewayNotifications[foundIndex].subscribedEmails[index] = { value, error };
			// 4. get total count of emails for notification type
			let totalEmailNotificationCount = getTotalGatewayTeamEmails(teamGatewayNotifications[foundIndex].subscribedEmails);
			// 5. if team notification emails are 0 default my gateway emails to true ie turn on
			if (totalEmailNotificationCount === 0) {
				// turn on the member notification automatically if exists
				const foundMemberIndex = getMemberNotification(notificationType);
				if (foundMemberIndex > -1) {
					memberNotifications[foundMemberIndex].optIn = true;
					setGatewayEmailNotification([...memberNotifications]);
				}
				// 6. update opt in for notificationType within teams
				// teamGatewayNotifications[foundIndex].optIn = false;
			}
			// 7. if user adds new notifaction to team email turn on send email notification to team email address
			if (totalEmailNotificationCount === 1 && !teamGatewayNotifications.optIn) teamGatewayNotifications[foundIndex].optIn = true;
			// 8. update team gateway notifications
			setGatewayNotifications([...teamGatewayNotifications]);
		}
	};

	// remove row handle click
	const handleRemoveClick = (index, notificationType = '') => {
		if (teamGatewayNotifications.length && !isEmpty(notificationType)) {
			let foundIndex = getTeamNotificationType(notificationType);
			if (foundIndex > -1) {
				teamGatewayNotifications[foundIndex].subscribedEmails.splice(index, 1);
				setGatewayNotifications([...teamGatewayNotifications]);
			}
		}
	};

	// add row handle click
	const handleAddClick = (notificationType = '') => {
		if (teamGatewayNotifications.length && !isEmpty(notificationType)) {
			let foundIndex = getTeamNotificationType(notificationType);
			if (foundIndex > -1) {
				teamGatewayNotifications[foundIndex].subscribedEmails = [
					...teamGatewayNotifications[foundIndex].subscribedEmails,
					{ value: '', error: '' },
				];
				setGatewayNotifications([...teamGatewayNotifications]);
			}
		}
	};

	// modal for notifications ensures one notification is selected
	const toggleAlertModal = (title = '', body = '') => {
		if (!isEmpty(title) && !isEmpty(body)) setAlertModalOptions({ title, body });

		setAlertModal(!alertModal);
	};

	// Email Alert for managers confirming Team Email addresses
	const toggleTeamEmailsModal = persistUpdate => {
		setTeamEmailModal(!teamEmailModal);
		if (persistUpdate) updateNotifications();
	};

	// format subscribed emails for BE
	const formatSubscribedEmails = () => {
		if (!isEmpty(teamGatewayNotifications)) {
			return [...teamGatewayNotifications].reduce((arr, teamNotification) => {
				let emails = [];
				let { notificationType, optIn, subscribedEmails } = teamNotification;

				if (!isEmpty(subscribedEmails)) {
					emails = [...subscribedEmails]
						.filter(item => {
							return item.value !== '';
						})
						.map(value => value.value);
				}

				arr = [...arr, { notificationType, optIn, subscribedEmails: emails }];

				return arr;
			}, []);
		}
		return [];
	};

	const findMandatoryOptIns = () => {
		if (!isEmpty(memberNotifications)) {
			let hasMissingOptIns = false;
			for (let memberNotification of memberNotifications) {
				let { optIn: memberOptIn, notificationType } = memberNotification;
				let foundIndex = getTeamNotificationType(notificationType);
				if (foundIndex > -1) {
					let { optIn: teamOptIn } = teamGatewayNotifications[foundIndex];
					if (!memberOptIn && !teamOptIn) hasMissingOptIns = true;
				}
			}
			return hasMissingOptIns;
		}
	};

	const validEmailList = () => {
		if (!isEmpty(teamGatewayNotifications)) {
			return [...teamGatewayNotifications].reduce((arr, teamNotification) => {
				let emails = [];
				let { subscribedEmails } = teamNotification;
				if (!isEmpty(subscribedEmails)) emails = [...subscribedEmails].filter(item => !isEmpty(item.error) || !isEmpty(item.value));

				if (emails.length > 0) arr = [...arr, ...emails];

				return arr;
			}, []);
		}
		return [];
	};

	// Removes message from UI - ie mark as read clears member notification messages for all notification types
	const updateMessageAlerts = () => {
		axios.put(`${baseURL}/api/v1/teams/${teamId}/notification-messages`).catch(err => {
			console.error(err.message);
		});
	};

	// Save Notifications API
	const saveNotifications = async () => {
		let missingOptIns = findMandatoryOptIns() || false;
		let isValid = validEmailList().length > 0 ? true : false;
		// check role
		let isManager = userHasRole(teamId, userTypes.MANAGER);
		// has optIns for team notificaiton emails
		let teamOptIns = hasTeamNotificationOptIns();
		if (missingOptIns) {
			// fire modal you must have one selected
			toggleAlertModal(
				'You must have one email address selected',
				'At least one email address is needed to receive notifications from the gateway.'
			);
		} else if (!isValid) {
			toggleAlertModal('Invalid Email address', 'Please fix the following email errors.');
		} else if (isManager && teamGatewayNotifications.length > 0 && teamOptIns) {
			// show modal with team email notifications if on only
			setTeamEmailModal(true);
		} else {
			updateNotifications();
		}
	};

	const updateNotifications = async () => {
		if (!isEmpty(teamGatewayNotifications) && teamId) {
			// format the subscribeEmails for the backend
			let notifications = formatSubscribedEmails();
			// setup data model for backend
			let data = {
				memberNotifications,
				teamNotifications: notifications,
			};
			// param 1: isSubmitting, params 2: savedTeamNotificationSuccess
			onTeamManagementSave(true, false);
			await axios
				.put(`${baseURL}/api/v1/teams/${teamId}/notifications`, data)
				.then(res => {
					// call parent set save button state
					onTeamManagementSave(false, true);
					// set alert message success save
					setAlerts([{ message: 'You have successfully updated your email notifications', type: 'success' }]);
					// scroll to the top so we can see the notification
					window.scrollTo(0, 0);
					// remove after 5's alert
					setTimeout(() => {
						onTeamManagementSave(false, false);
						setAlerts([]);
					}, 5000);
				})
				.catch(err => {
					console.error(err.message);
				});
		}
	};

	const getTeamNotifications = teamId => {
		if (!isEmpty(teamId)) {
			setLoading(true);
			axios
				.get(`${baseURL}/api/v1/teams/${teamId}/notifications`)
				.then(res => {
					let messages;
					// will need updated once more notification types are defined
					let { memberNotifications = [], teamNotifications = [] } = res.data;
					// memberNotifications set
					if (!isEmpty(memberNotifications)) {
						// set member notifications
						setGatewayEmailNotification([...memberNotifications]);
						// pull out messages from the member notifications and format in valid alerts for UI
						messages = [...memberNotifications]
							.filter(obj => Object.keys(obj).includes(messageKey) && !isEmpty(obj[messageKey]))
							.map(value => ({ message: value.message, type: alertTypes.warning }));
						// if messages exist from personal notifications
						if (!isEmpty(messages)) {
							// set the alerts to show on the UI - once only
							setAlerts(messages);
							// post to back-end to remove all alerts so they do not show on repeat once we re-vist the page
							// axios put remove teamNotificationMessage
							updateMessageAlerts();
						} else {
							setAlerts([]);
						}
					}
					// teamNotifications
					if (!isEmpty(teamNotifications) && teamNotifications.length > 0) setGatewayNotifications(teamNotifications);

					setLoading(false);
				})
				.catch(err => {
					setLoading(false);
					console.error(err.message);
				});
		}
	};

	// lifecycle hook
	useEffect(() => {
		// check if team exists, if not redirect
		if (isEmpty(team)) {
			history.push({ pathname: `/account`, search: `?tab=dashboard` });
		} else {
			localStorage.setItem('HDR_TEAM', team);
		}

		if (!userRoleIsAdmin(team)) {
			if (!isEmpty(innertab) && innertab === tabTypes.Notifications) {
				onTabChange(innertab);
				onClearInnerTab();
			}
		} else {
			setActiveTab(tabTypes.Members);
			onTeamManagementTabChange(tabTypes.Members);
		}

		// get and set teamId
		//const teamId = getTeamId(team);
		// set state
		setTeamId(team);

		// only call get teamNotifications on tab change
		if (activeTabKey === tabTypes.Notifications) getTeamNotifications(teamId);
	}, [activeTabKey, team]);

	if (isLoading) {
		return (
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<Loading data-testid='isLoading' />
				</Col>
				<Col xs={1}></Col>
			</Row>
		);
	}

	return (
		<Fragment>
			<Fragment>{!isEmpty(alerts) ? generateAlerts() : ''}</Fragment>
			<LayoutContent>
				<div className='accountHeader dataAccessHeader'>
					<Col xs={8}>
						<Row>
							<div className='black-20'>Team management</div>
							<div className='gray700-14'>Organise and manage team members and the teams email notifications.</div>
						</Row>
					</Col>
					<Col xs={4} style={{ textAlign: 'right' }}></Col>
				</div>
				<div className='tabsBackground'>
					<Col sm={12} lg={12}>
						<Tabs className='dataAccessTabs gray700-14' activeKey={activeTabKey} onSelect={onTabChange}>
							{!userRoleIsAdmin(teamId)
								? Object.keys(tabTypes).map((keyName, i) => (
										<Tab
											key={i}
											eventKey={`${tabTypes[keyName]}`}
											title={`${upperFirst(tabTypes[keyName])}`}
											data-testid={tabTypes[keyName]}></Tab>
								  ))
								: ''}
						</Tabs>
					</Col>
				</div>
			</LayoutContent>

			{activeTabKey === tabTypes.Members && <AccountMembers userState={userState} team={team} teamId={teamId} />}

			{activeTabKey === tabTypes.Notifications && (
				<LayoutContent>
					<div className='col-sm-10'>
						<div className='accountHeader dataAccessHeader'>
							<Col xs={12}>
								<Row>
									<div className='black-20-semibold'>Email notifications</div>
									<div className='gray700-14'>
										Team related email notifications will automatically be sent to each team members gateway log in email. Data custodian
										managers can choose to send notifications to additional email accounts.
									</div>
								</Row>
							</Col>
						</div>
						<div className='accountHeader accountHeader-alt'>
							{memberNotifications &&
								[...memberNotifications].map((memberNotification, index) => {
									return (
										<div key={`memberNotification-${index}`}>
											<TeamGatewayEmail
												id={index}
												teamId={teamId}
												userState={userState}
												userHasRole={userHasRole}
												memberNotification={memberNotification}
												togglePersonalNotifications={togglePersonalNotifications}
											/>
										</div>
									);
								})}
						</div>
						<div className='accountHeader accountHeader-alt'>
							{teamGatewayNotifications &&
								[...teamGatewayNotifications].map((teamNotification, index) => {
									return (
										<div key={`teamNotificationOverview-${index}`}>
											<TeamGatewayNotificationEmails
												teamId={teamId}
												userHasRole={userHasRole}
												teamNotification={teamNotification}
												toggleTeamNotifications={toggleTeamNotifications}
											/>
											{teamNotification.optIn ? (
												<Fragment>
													<div className='tm-wrapper'>
														<div className='gray700-14'>Team email</div>
														<FieldRepeater
															id={index}
															teamId={teamId}
															data={teamNotification}
															userHasRole={userHasRole}
															handleFieldChange={handleFieldChange}
															handleRemoveClick={handleRemoveClick}
															handleAddClick={handleAddClick}
														/>
													</div>
												</Fragment>
											) : (
												''
											)}
										</div>
									);
								})}
						</div>
					</div>
				</LayoutContent>
			)}
			<TeamEmailAlertModal open={alertModal} close={toggleAlertModal} options={alertModalOptions} />
			<TeamNotificationsConfirmationModal
				open={teamEmailModal}
				close={toggleTeamEmailsModal}
				confirm={toggleTeamEmailsModal}
				teamNotifications={teamGatewayNotifications}
			/>
		</Fragment>
	);
};

export default AccountTeamManagement;
