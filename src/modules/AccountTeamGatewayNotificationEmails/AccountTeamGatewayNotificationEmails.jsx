import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { useTranslation } from 'react-i18next';
import { permissionsConsts } from 'consts';
import { authUtils } from 'utils';
import { PERMISSIONS_USER_TYPES } from 'consts/permissions';

const { userTypes } = permissionsConsts;

const AccountTeamGatewayNotificationEmails = ({ teamId, userState, teamNotification, toggleTeamNotifications }) => {
    const { t } = useTranslation();
    const [isManager, setManager] = useState(false);
    const { optIn, notificationType } = teamNotification;

    useEffect(() => {
        // TODO: GAT-1510:017
        setManager(authUtils.userHasRole(userState, teamId, PERMISSIONS_USER_TYPES.manager));
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

export default AccountTeamGatewayNotificationEmails;