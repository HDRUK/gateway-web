import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from 'context/AuthContext';
import { Switch } from 'components';
import { Input, Box, Message } from 'hdruk-react-core';
import { t } from 'i18next';
import { teamNotificationPropTypes } from 'types';

const AccountTeamGatewayEmail = ({ teamId, memberNotification, togglePersonalNotifications }) => {
    const { isTeamManager, checkIsTeamManager, userState } = useAuth();

    useEffect(() => {
        // TODO: GAT-1510:016
        checkIsTeamManager(teamId);
    }, [teamId]);

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
