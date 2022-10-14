import { isEmpty } from 'lodash';
import { permissionsConsts } from 'consts';

const { userTypes } = permissionsConsts;

const userRoleIsAdmin = (teamId, userState) => {
    const team = userState[0].teams.filter(t => {
        // eslint-disable-next-line no-underscore-dangle
        return t._id === teamId;
    })[0];
    return team && team.isAdmin && !team.roles.includes(userTypes.MANAGER);
};

const hasTeamNotificationOptIns = teamGatewayNotifications => {
    if (!isEmpty(teamGatewayNotifications)) {
        return teamGatewayNotifications.some(notification => notification.optIn === true);
    }
    return false;
};

export { userRoleIsAdmin, hasTeamNotificationOptIns };
