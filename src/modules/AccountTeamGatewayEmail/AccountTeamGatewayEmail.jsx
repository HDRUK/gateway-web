import React, { useEffect, useState } from 'react';
import Switch from 'react-switch';
import { PERMISSIONS_USER_TYPES } from 'consts';
import { authUtils } from 'utils';
import { userStateType } from 'types';
import PropTypes from 'prop-types';

const AccountTeamGatewayEmail = ({ teamId, userState = [], memberNotification, togglePersonalNotifications }) => {
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        // TODO: GAT-1510:016
        setIsManager(authUtils.userHasRole(userState, teamId, PERMISSIONS_USER_TYPES.manager));
    }, [teamId, userState]);

    return (
        <>
            <div className='tm-notification' key={`member-notification-${memberNotification.notificationType}`}>
                <div className='tm-switch'>
                    <Switch
                        onChange={togglePersonalNotifications}
                        checked={memberNotification.optIn}
                        id={memberNotification.notificationType}
                        offColor='#c2303d'
                        uncheckedIcon={false}
                        checkedIcon={false}
                        width={48}
                        height={24}
                        className='react-switch'
                    />
                </div>
                <div className='tm-title'>
                    <div className='black-16-semibold'>Send email notifications to my Gateway email address</div>
                    {teamId && isManager && (
                        <div className='gray700-14'>
                            You will need to add a team email to be able to save switching off notifications to your own Gateway email.
                        </div>
                    )}
                </div>
            </div>
            <div className='form-group mt-3'>
                <label className='gray700-14' htmlFor='myGatewayEmail'>
                    My Gateway email
                </label>
                <input
                    type='email'
                    name='myGatewayEmail'
                    value={`${userState[0]?.email}`}
                    className='form-control gray800-14'
                    aria-describedby='My Gateway email'
                    readOnly
                />
            </div>
        </>
    );
};

AccountTeamGatewayEmail.propTypes = {
    userState: userStateType.isRequired,
    teamId: PropTypes.string.isRequired,
    togglePersonalNotifications: PropTypes.func.isRequired,
    memberNotification: PropTypes.shape({ optIn: PropTypes.bool, notificationType: PropTypes.string }).isRequired,
};

export default AccountTeamGatewayEmail;
