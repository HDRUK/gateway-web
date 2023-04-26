import PropTypes from 'prop-types';
import { useAuth } from 'context/AuthContext';
import { Switch, Input } from 'components';
import { Box, Message } from 'hdruk-react-core';
import { t } from 'i18next';
import { teamNotificationPropTypes } from 'types';
import { useCustodianRoles } from 'hooks';

const AccountTeamGatewayEmail = ({ teamId, memberNotification, togglePersonalNotifications }) => {
    const { userState } = useAuth();
    const { isCustodianTeamAdmin } = useCustodianRoles(teamId);

    return (
        <>
            <Switch
                label={
                    <>
                        <div>{t('components.AccountTeamGatewayEmail.optIn.switch')}</div>
                        {isCustodianTeamAdmin && <Message mt={2}>{t('components.AccountTeamGatewayEmail.optIn.description')}</Message>}
                    </>
                }
                onChange={({ target: { checked } }) => togglePersonalNotifications({ checked, id: memberNotification.notificationType })}
                checked={memberNotification.optIn}
            />

            <Box mt={3}>
                <Input
                    style={{ background: '#eee' }}
                    label={t('components.AccountTeamGatewayEmail.emailLabel')}
                    type='email'
                    title='You do not have permission to edit this'
                    name='myGatewayEmail'
                    value={`${userState[0]?.email}`}
                    aria-describedby={t('components.AccountTeamGatewayEmail.emailLabel')}
                    disabled
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
