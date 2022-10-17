import { isEmpty } from 'lodash';
import { PERMISSIONS_USER_TYPES } from 'consts';

const userRoleIsAdmin = (teamId, userState) => {
    const team = userState[0].teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];
    return team && team.isAdmin && !team.roles.includes(PERMISSIONS_USER_TYPES.manager);
};

const hasTeamNotificationOptIns = teamGatewayNotifications => {
    if (!isEmpty(teamGatewayNotifications)) {
        return teamGatewayNotifications.some(notification => notification.optIn === true);
    }
    return false;
};

const getTotalGatewayTeamEmails = (data = []) => {
    // 1. if the user has passed in data ie set team emails to that data
    if (!isEmpty(data)) {
        const teamEmails = [...data];
        // 3. if the emails are not empty and are clear of errors return the count else 0;
        return [...teamEmails].filter(item => item.value !== '' && isEmpty(item.error)).length;
    }
    return 0;
};

const validEmailList = teamGatewayNotifications => {
    if (!isEmpty(teamGatewayNotifications)) {
        return [...teamGatewayNotifications].reduce((arr, teamNotification) => {
            let emails = [];
            const { subscribedEmails } = teamNotification;
            if (!isEmpty(subscribedEmails)) emails = [...subscribedEmails].filter(item => !isEmpty(item.error) || !isEmpty(item.value));

            if (emails.length > 0) {
                return [...arr, ...emails];
            }

            return arr;
        }, []);
    }
    return [];
};

const getTeamNotificationType = (notificationType, teamGatewayNotifications) => {
    return teamGatewayNotifications.findIndex(notification => notification.notificationType === notificationType);
};

const getMemberNotification = (notificationType, memberNotifications) => {
    return memberNotifications.findIndex(notification => notification.notificationType === notificationType);
};

const formatSubscribedEmails = teamGatewayNotifications => {
    if (!isEmpty(teamGatewayNotifications)) {
        return [...teamGatewayNotifications].reduce((arr, teamNotification) => {
            let emails = [];
            const { notificationType, optIn, subscribedEmails } = teamNotification;

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

const getHasMandatoryOptIns = (memberNotifications, teamGatewayNotifications) => {
    if (!isEmpty(memberNotifications)) {
        let hasMissingOptIns = false;
        for (const memberNotification of memberNotifications) {
            const { optIn: memberOptIn, notificationType } = memberNotification;
            const foundIndex = getTeamNotificationType(notificationType, teamGatewayNotifications);
            if (foundIndex > -1) {
                const { optIn: teamOptIn } = teamGatewayNotifications[foundIndex];
                if (!memberOptIn && !teamOptIn) hasMissingOptIns = true;
            }
        }
        return hasMissingOptIns;
    }
    return false;
};

export {
    getTotalGatewayTeamEmails,
    formatSubscribedEmails,
    getHasMandatoryOptIns,
    getMemberNotification,
    getTeamNotificationType,
    validEmailList,
    userRoleIsAdmin,
    hasTeamNotificationOptIns,
};
