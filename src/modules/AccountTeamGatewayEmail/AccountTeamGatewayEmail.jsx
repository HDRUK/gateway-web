import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from 'context/AuthContext';
import { Switch } from 'components';
import { Input, Box, Message } from 'hdruk-react-core';
import { t } from 'i18next';
import { teamNotificationPropTypes } from 'types';
import { authUtils } from 'utils';

const AccountTeamGatewayEmail = ({ teamId, memberNotification, togglePersonalNotifications }) => {
    const { userState } = useAuth();
    const [isTeamManager, setIsTeamManager] = useState(false);

    useEffect(() => {
        if (!teamId || !userState) return;
        // TODO: GAT-391:GAT-1596 (notifications)
        setIsTeamManager(authUtils.getHasTeamManagerRole(userState, teamId));
    }, [teamId, userState]);

    return (
        <>
            <Switch
                label={
                    <>
                        <div>{t('components.AccountTeamGatewayEmail.optIn.switch')}</div>
                        {isTeamManager && <Message mt={2}>{t('components.AccountTeamGatewayEmail.optIn.description')}</Message>}
                    </>
                }
                onChange={({ target: { checked } }) => togglePersonalNotifications({ checked, id: memberNotification.notificationType })}
                checked={memberNotification.optIn}
            />

            <Box mt={3}>
                <Input
                    label={t('components.AccountTeamGatewayEmail.emailLabel')}
                    type='email'
                    name='myGatewayEmail'
                    value={`${userState[0]?.email}`}
                    aria-describedby={t('components.AccountTeamGatewayEmail.emailLabel')}
                    readOnly
                />
            </Box>
        </>
    );
};

AccountTeamGatewayEmail.propTypes = {
    teamId: PropTypes.string.isRequired,
    togglePersonalNotifications: PropTypes.func.isRequired,
    memberNotification: teamNotificationPropTypes.isRequired,
};

export default AccountTeamGatewayEmail;
