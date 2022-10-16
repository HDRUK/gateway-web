import React, { useEffect } from 'react';
import Switch from 'react-switch';
import { authUtils } from 'utils';
import { permissionsUserTypes } from 'consts';

const AccountTeamGatewayEmail = ({ id, teamId, userState = [], memberNotification, togglePersonalNotifications }) => {
    const [user = {}] = userState;
    const { optIn, notificationType } = memberNotification;
    const isManager = () => {
        // TODO: GAT-1510:016
        return authUtils.userHasRole(userState, teamId, permissionsUserTypes.MANAGER);
    };

    useEffect(() => {
        isManager();
    }, [teamId]);

    return (
        <>
            <div className='tm-notification' key={`member-notification-${id}`}>
                <div className='tm-switch'>
                    <Switch
                        onChange={togglePersonalNotifications}
                        checked={optIn}
                        id={notificationType}
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
                    {teamId && isManager() && (
                        <div className='gray700-14'>
                            You will need to add a team email to be able to save switching off notifications to your own Gateway email.
                        </div>
                    )}
                </div>
            </div>
            <div className='form-group mt-3'>
                <label className='gray700-14' htmlFor='EmailAddress'>
                    My Gateway email
                </label>
                <input
                    type='email'
                    name='myGatewayEmail'
                    value={`${user.email}`}
                    className='form-control gray800-14'
                    aria-describedby='My Gateway email'
                    readOnly
                />
            </div>
        </>
    );
};

export default AccountTeamGatewayEmail;
