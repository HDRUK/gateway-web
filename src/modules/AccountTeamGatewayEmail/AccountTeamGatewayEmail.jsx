import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from 'context/AuthContext';
import { Switch } from 'components';
import { Input, Box, Message } from 'hdruk-react-core';
import { t } from 'i18next';

const AccountTeamGatewayEmail = ({ teamId, memberNotification, togglePersonalNotifications }) => {
    const { isTeamManager, managerInTeam, userState } = useAuth();

    useEffect(() => {
        // TODO: GAT-1510:016
        managerInTeam(teamId);
    }, [teamId]);

    return (
        <>
            <Switch
                id={memberNotification.notificationType}
                label={
                    <>
                        <div>{t('components.AccountTeamGatewayEmail.optIn.switch')}</div>
                        {isTeamManager && <Message mt={2}>{t('components.AccountTeamGatewayEmail.optIn.description')}</Message>}
                    </>
                }
                onChange={togglePersonalNotifications}
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
    memberNotification: PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string }).isRequired,
};

export default AccountTeamGatewayEmail;
