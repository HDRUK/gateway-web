import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { isEmpty } from 'lodash';
import axios from 'axios';
import { AccountTeamMembers, AccountTeamEmailAlertModal, AccountTeamNotificationsConfirmationModal } from 'modules';
import { ACCOUNT_TAB_TYPES, UI_ALERT_TYPES } from 'consts';
import PropTypes from 'prop-types';
import { baseURL } from '../../configs/url.config';
import { LayoutContent } from '../../components/Layout';
import {
    hasTeamNotificationOptIns,
    validEmailList,
    getTeamNotificationType,
    getHasMandatoryOptIns,
    getMemberNotification,
    formatSubscribedEmails,
    getTotalGatewayTeamEmails,
} from './AccountTeamManagementPage.utils';
import { GeneratedAlerts, LoaderRow, NotificationTab, TabsNav, TeamManagementHeader } from './AccountTeamManagementPage.components';
import { useAuth } from 'context/AuthContext';
import { authUtils } from 'utils';

const AccountTeamManagementPage = ({ teamId, innerTab, forwardRef, onTeamManagementSave, onTeamManagementTabChange, onClearInnerTab }) => {
    const { userState } = useAuth();
    const [activeTabKey, setActiveTabKey] = useState(ACCOUNT_TAB_TYPES.Members);
    const [alerts, setAlerts] = useState([]);
    const [alertModal, setAlertModal] = useState(false);
    const [alertModalOptions, setAlertModalOptions] = useState({ title: '', body: '' });
    const [isLoading, setLoading] = useState(false);
    const [memberNotifications, setMemberNotifications] = useState([{ optIn: true, notificationType: 'dataAccessRequest' }]);
    const [teamEmailModal, setTeamEmailModal] = useState(false);
    const [teamGatewayNotifications, setTeamGatewayNotifications] = useState([
        { notificationType: 'dataAccessRequest', optIn: false, subscribedEmails: [{ value: '', error: '' }], message: 'Test message' },
    ]);
    const [isTeamManager, setIsTeamManager] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if (!teamId || !userState) return;
        // TODO: GAT-1510:014
        setIsTeamManager(authUtils.getHasTeamManagerRole(userState, teamId));
    }, [teamId, userState]);

    // modal for notifications ensures one notification is selected
    const toggleAlertModal = (title = '', body = '') => {
        if (!isEmpty(title) && !isEmpty(body)) {
            setAlertModalOptions({ title, body });
        }

        setAlertModal(!alertModal);
    };

    const updateNotifications = async () => {
        if (!isEmpty(teamGatewayNotifications) && teamId) {
            // format the subscribeEmails for the backend
            const notifications = formatSubscribedEmails(teamGatewayNotifications);
            // setup data model for backend
            const data = {
                memberNotifications,
                teamNotifications: notifications,
            };
            // param 1: isSubmitting, params 2: savedTeamNotificationSuccess
            onTeamManagementSave(true, false);
            await axios
                .put(`${baseURL}/api/v1/teams/${teamId}/notifications`, data)
                .then(() => {
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

    // Save Notifications API
    const saveNotifications = async () => {
        const missingOptIns = getHasMandatoryOptIns(memberNotifications, teamGatewayNotifications) || false;
        const isValid = validEmailList(teamGatewayNotifications).length > 0;
        // has optIns for team notificaiton emails
        const teamOptIns = hasTeamNotificationOptIns(teamGatewayNotifications);
        if (missingOptIns) {
            // fire modal you must have one selected
            toggleAlertModal(
                'You must have one email address selected',
                'At least one email address is needed to receive notifications from the gateway.'
            );
        } else if (!isValid) {
            toggleAlertModal('Invalid Email address', 'Please fix the following email errors.');
        } else if (isTeamManager && teamGatewayNotifications.length > 0 && teamOptIns) {
            // show modal with team email notifications if on only
            setTeamEmailModal(true);
        } else {
            updateNotifications();
        }
    };

    forwardRef(() => saveNotifications());

    const onTabChange = key => {
        onTeamManagementTabChange(key);
        setActiveTabKey(key);
        setAlerts([]);
    };

    // Removes message from UI - ie mark as read clears member notification messages for all notification types
    const updateMessageAlerts = () => {
        axios.put(`${baseURL}/api/v1/teams/${teamId}/notification-messages`).catch(err => {
            console.error(err.message);
        });
    };

    const getTeamNotifications = () => {
        const messageKey = 'message';

        if (!isEmpty(teamId)) {
            setLoading(true);
            axios
                .get(`${baseURL}/api/v1/teams/${teamId}/notifications`)
                .then(res => {
                    let messages;
                    // will need updated once more notification types are defined
                    const { memberNotifications: resMemberNotifications = [], teamNotifications = [] } = res.data;
                    // memberNotifications set
                    if (!isEmpty(resMemberNotifications)) {
                        // set member notifications
                        setMemberNotifications([...resMemberNotifications]);
                        // pull out messages from the member notifications and format in valid alerts for UI
                        messages = [...resMemberNotifications]
                            .filter(obj => Object.keys(obj).includes(messageKey) && !isEmpty(obj[messageKey]))
                            .map(value => ({ message: value.message, type: UI_ALERT_TYPES.warning }));
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
                    if (!isEmpty(teamNotifications) && teamNotifications.length > 0) setTeamGatewayNotifications(teamNotifications);

                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    console.error(err.message);
                });
        }
    };

    useEffect(() => {
        // check if team exists, if not redirect
        if (isEmpty(teamId)) {
            history.push({ pathname: `/account`, search: `?tab=dashboard` });
        } else {
            localStorage.setItem('HDR_TEAM', teamId);
        }

        // TODO: GAT-1510:019
        if (!authUtils.isTeamAdminNotManager(teamId, userState)) {
            if (innerTab === ACCOUNT_TAB_TYPES.Notifications) {
                onTabChange(innerTab);
                onClearInnerTab();
            }
        } else {
            setActiveTabKey(ACCOUNT_TAB_TYPES.Members);
            onTeamManagementTabChange(ACCOUNT_TAB_TYPES.Members);
        }

        // only call get teamNotifications on tab change
        if (activeTabKey === ACCOUNT_TAB_TYPES.Notifications) getTeamNotifications();
    }, [activeTabKey, teamId, userState]);

    // send email notifications to my gateway email address
    const togglePersonalNotifications = ({ checked, id }) => {
        if (!isEmpty(id)) {
            const foundTeamIndex = getTeamNotificationType(id, teamGatewayNotifications);
            const foundMemberIndex = getMemberNotification(id, memberNotifications);
            if (foundTeamIndex > -1) {
                const totalGatewayEmails = getTotalGatewayTeamEmails(teamGatewayNotifications[foundTeamIndex].subscribedEmails);
                if (!checked && totalGatewayEmails === 0) {
                    return '';
                }
                memberNotifications[foundMemberIndex].optIn = checked;
                setMemberNotifications([...memberNotifications]);
            }
        }
    };

    // send email notifications to team email address
    const toggleTeamNotifications = ({ checked, id }) => {
        if (!isEmpty(id)) {
            // 1. find notificationType
            const foundIndex = getTeamNotificationType(id, teamGatewayNotifications);
            if (foundIndex > -1) {
                // 2. update the notification by type
                teamGatewayNotifications[foundIndex] = {
                    ...teamGatewayNotifications[foundIndex],
                    optIn: checked,
                };
            }
            // 3. update and set state
            setTeamGatewayNotifications([...teamGatewayNotifications]);
        }
    };

    const handleFieldChange = (e, index, notificationType = '') => {
        let error = '';
        const { value } = e.target;
        // 1. find the object in team gateway notifications
        const foundIndex = getTeamNotificationType(notificationType, teamGatewayNotifications);
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
            const totalEmailNotificationCount = getTotalGatewayTeamEmails(teamGatewayNotifications[foundIndex].subscribedEmails);
            // 5. if team notification emails are 0 default my gateway emails to true ie turn on
            if (totalEmailNotificationCount === 0) {
                // turn on the member notification automatically if exists
                const foundMemberIndex = getMemberNotification(notificationType, memberNotifications);
                if (foundMemberIndex > -1) {
                    memberNotifications[foundMemberIndex].optIn = true;
                    setMemberNotifications([...memberNotifications]);
                }
                // 6. update opt in for notificationType within teams
                // teamGatewayNotifications[foundIndex].optIn = false;
            }
            // 7. if user adds new notifaction to team email turn on send email notification to team email address
            if (totalEmailNotificationCount === 1 && !teamGatewayNotifications.optIn) teamGatewayNotifications[foundIndex].optIn = true;
            // 8. update team gateway notifications
            setTeamGatewayNotifications([...teamGatewayNotifications]);
        }
    };

    // remove row handle click
    const handleRemoveClick = (index, notificationType = '') => {
        if (teamGatewayNotifications.length && !isEmpty(notificationType)) {
            const foundIndex = getTeamNotificationType(notificationType, teamGatewayNotifications);
            if (foundIndex > -1) {
                teamGatewayNotifications[foundIndex].subscribedEmails.splice(index, 1);
                setTeamGatewayNotifications([...teamGatewayNotifications]);
            }
        }
    };

    // add row handle click
    const handleAddClick = (notificationType = '') => {
        if (teamGatewayNotifications.length && !isEmpty(notificationType)) {
            const foundIndex = getTeamNotificationType(notificationType, teamGatewayNotifications);
            if (foundIndex > -1) {
                teamGatewayNotifications[foundIndex].subscribedEmails = [
                    ...teamGatewayNotifications[foundIndex].subscribedEmails,
                    { value: '', error: '' },
                ];
                setTeamGatewayNotifications([...teamGatewayNotifications]);
            }
        }
    };

    // Email Alert for managers confirming Team Email addresses
    const toggleTeamEmailsModal = persistUpdate => {
        setTeamEmailModal(!teamEmailModal);
        if (persistUpdate) updateNotifications();
    };

    if (isLoading) {
        return <LoaderRow />;
    }

    return (
        <div data-testid='AccountTeamManagementPage'>
            <LayoutContent>
                <GeneratedAlerts alerts={alerts} />
                <TeamManagementHeader />
                <TabsNav teamId={teamId} activeTabKey={activeTabKey} onTabChange={onTabChange} />
            </LayoutContent>
            {activeTabKey === ACCOUNT_TAB_TYPES.Members && <AccountTeamMembers teamId={teamId} />}
            {activeTabKey === ACCOUNT_TAB_TYPES.Notifications && (
                <NotificationTab
                    memberNotifications={memberNotifications}
                    teamGatewayNotifications={teamGatewayNotifications}
                    teamId={teamId}
                    togglePersonalNotifications={togglePersonalNotifications}
                    toggleTeamNotifications={toggleTeamNotifications}
                    handleFieldChange={handleFieldChange}
                    handleRemoveClick={handleRemoveClick}
                    handleAddClick={handleAddClick}
                />
            )}
            <AccountTeamEmailAlertModal isOpen={alertModal} onClose={toggleAlertModal} options={alertModalOptions} />
            <AccountTeamNotificationsConfirmationModal
                isOpen={teamEmailModal}
                onClose={toggleTeamEmailsModal}
                onConfirm={toggleTeamEmailsModal}
                teamNotifications={teamGatewayNotifications}
            />
        </div>
    );
};

AccountTeamManagementPage.propTypes = {
    teamId: PropTypes.string.isRequired,
    innerTab: PropTypes.oneOf([ACCOUNT_TAB_TYPES.Notifications, ACCOUNT_TAB_TYPES.Members]),
    forwardRef: PropTypes.func.isRequired,
    onTeamManagementSave: PropTypes.func.isRequired,
    onTeamManagementTabChange: PropTypes.func.isRequired,
    onClearInnerTab: PropTypes.func.isRequired,
};

AccountTeamManagementPage.defaultProps = {
    innerTab: ACCOUNT_TAB_TYPES.Members,
};

export default AccountTeamManagementPage;