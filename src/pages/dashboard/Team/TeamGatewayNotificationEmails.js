import { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS_TEAM_ROLES } from 'consts';

const TeamGatewayNotificationEmails = ({ teamId, userHasRole, teamNotification, toggleTeamNotifications }) => {
    const { t } = useTranslation();
    const [isManager, setManager] = useState(false);
    const { optIn, notificationType } = teamNotification;

    useEffect(() => {
        // TODO: GAT-391:GAT-1596 (notifications)
        setManager(userHasRole(teamId, PERMISSIONS_TEAM_ROLES.manager));
    }, [teamId, teamNotification]);

    return (
        <div className='tm-notification'>
            {teamId && isManager && (
                <>
                    <div className='tm-switch'>
                        <Switch
                            onChange={toggleTeamNotifications}
                            checked={optIn}
                            id={notificationType}
                            offColor='#c2303d'
                            uncheckedIcon={false}
                            checkedIcon={false}
                            width={48}
                            height={24}
                            className='react-switch'
                            data-testid='notify-team-email'
                        />
                    </div>
                    <div className='tm-title'>
                        <div className='black-16-semibold'>{t('notifications.teamEmailText')}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamGatewayNotificationEmails;
