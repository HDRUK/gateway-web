import React, { useEffect } from 'react';
import { Switch } from 'components';
import { useAuth } from 'context/AuthContext';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { teamNotificationPropTypes } from 'types';

const AccountTeamGatewayNotificationEmails = ({ teamId, teamNotification, toggleTeamNotifications }) => {
    const { t } = useTranslation();
    const { isTeamManager, checkIsTeamManager } = useAuth();

    useEffect(() => {
        if (!teamId) return;
        // TODO: GAT-1510:017
        checkIsTeamManager(teamId);
    }, [teamId]);

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
