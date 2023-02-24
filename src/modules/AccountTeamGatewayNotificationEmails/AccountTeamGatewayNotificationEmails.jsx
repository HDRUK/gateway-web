import { useEffect, useState } from 'react';
import { Switch } from 'components';
import { useAuth } from 'context/AuthContext';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { teamNotificationPropTypes } from 'types';
import { authUtils } from 'utils';

const AccountTeamGatewayNotificationEmails = ({ teamId, teamNotification, toggleTeamNotifications }) => {
    const { t } = useTranslation();
    const { userState } = useAuth();
    const [isTeamManager, setIsTeamManager] = useState(false);

    useEffect(() => {
        if (!teamId || !userState) return;
        // TODO: GAT-391:GAT-1596 (notifications)
        setIsTeamManager(authUtils.getHasTeamManagerRole(userState, teamId));
    }, [teamId, userState]);

    if (!isTeamManager || !teamId) return null;
    return (
        <div data-testid='AccountTeamGatewayNotificationEmails'>
            <Switch
                checked={teamNotification.optIn}
                onChange={({ target: { checked } }) => toggleTeamNotifications({ checked, id: teamNotification.notificationType })}
                label={t('notifications.teamEmailText')}
            />
        </div>
    );
};

AccountTeamGatewayNotificationEmails.propTypes = {
    teamId: PropTypes.string.isRequired,
    toggleTeamNotifications: PropTypes.func.isRequired,
    teamNotification: teamNotificationPropTypes.isRequired,
};

export default AccountTeamGatewayNotificationEmails;
