import { isEmpty } from 'lodash';

const hasTeamNotificationOptIns = (teamGatewayNotifications = []) => {
    if (!teamGatewayNotifications.length) return false;

    return teamGatewayNotifications.some(notification => notification.optIn === true);
};

const getTotalGatewayTeamEmails = (data = []) => {
    if (isEmpty(data)) return 0;

    return [...data].filter(item => item.value !== '' && isEmpty(item.error)).length;
};

const validEmailList = teamGatewayNotifications => {
    if (isEmpty(teamGatewayNotifications)) return [];
    return [...teamGatewayNotifications].reduce((arr, teamNotification) => {
        let emails = [];
        const { subscribedEmails } = teamNotification;
        if (!isEmpty(subscribedEmails)) emails = [...subscribedEmails].filter(item => !isEmpty(item.error) || !isEmpty(item.value));

        if (emails.length > 0) {
            return [...arr, ...emails];
        }

        return arr;
    }, []);
};

const getTeamNotificationType = (notificationType, teamGatewayNotifications) => {
    return teamGatewayNotifications.findIndex(notification => notification.notificationType === notificationType);
};

const getMemberNotification = (notificationType, memberNotifications) => {
    return memberNotifications.findIndex(notification => notification.notificationType === notificationType);
};

const formatSubscribedEmails = teamGatewayNotifications => {
    if (isEmpty(teamGatewayNotifications)) return [];

    return [...teamGatewayNotifications].reduce((arr, teamNotification) => {
        const filteredEmails = (teamNotification.subscribedEmails || []).filter(item => {
            return item.value !== '';
        });

        return [...arr, { ...teamNotification, subscribedEmails: filteredEmails.map(filteredEmail => filteredEmail.value) }];
    }, []);
};

const getHasMandatoryOptIns = (memberNotifications, teamGatewayNotifications) => {
    if (isEmpty(memberNotifications)) return false;

    let hasMissingOptIns = false;

    memberNotifications.forEach(memberNotification => {
        const { optIn: memberOptIn, notificationType } = memberNotification;
        const foundIndex = getTeamNotificationType(notificationType, teamGatewayNotifications);
        if (foundIndex > -1) {
            const { optIn: teamOptIn } = teamGatewayNotifications[foundIndex];
            if (!memberOptIn && !teamOptIn) hasMissingOptIns = true;
        }
    });

    return hasMissingOptIns;
};

export {
    getTotalGatewayTeamEmails,
    formatSubscribedEmails,
    getHasMandatoryOptIns,
    getMemberNotification,
    getTeamNotificationType,
    validEmailList,
    hasTeamNotificationOptIns,
};
