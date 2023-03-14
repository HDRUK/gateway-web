import { Switch } from 'components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { teamNotificationPropTypes } from 'types';
import { useCustodianRoles } from 'hooks';

const AccountTeamGatewayNotificationEmails = ({ teamId, teamNotification, toggleTeamNotifications }) => {
    const { t } = useTranslation();
    const { isCustodianTeamAdmin } = useCustodianRoles(teamId);

    return (
        <div data-testid='AccountTeamGatewayNotificationEmails'>
            <Switch
                disabled={!isCustodianTeamAdmin}
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
