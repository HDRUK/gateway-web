import React, { useEffect, useState } from 'react';
import { permissionsConsts } from 'consts';
import './AccountTeamFieldRepeater.scss';
import { authUtils } from 'utils';
import { isEmpty } from 'lodash';
import { PERMISSIONS_USER_TYPES } from 'consts/permissions';

const { userTypes } = permissionsConsts;

const AccountTeamFieldRepeaterAction = ({ data, isManager, notificationType, index, handleRemoveClick, handleAddClick }) => {
    return (
        <>
            {isManager && (
                <div className='field-action' key={`field-action-${index}`}>
                    <button
                        onClick={e => handleRemoveClick(index, notificationType)}
                        className='plusMinusButton'
                        disabled={data.length === 1}>
                        -
                    </button>
                    <button
                        onClick={() => handleAddClick(notificationType)}
                        className='plusMinusButton'
                        disabled={data.length - 1 !== index}>
                        +
                    </button>
                </div>
            )}
        </>
    );
};

const AccountTeamField = ({ id = '', isManager = false, data = {}, index = 0, notificationType = '', handleFieldChange }) => {
    const { value, error } = data;
    return (
        <div className='form-group'>
            <input
                id={`field${id}`}
                className={`form-control gray800-14 ${!isEmpty(error) ? 'is-invalid' : ''}`}
                onChange={e => handleFieldChange(e, index, notificationType)}
                type='text'
                value={value}
                disabled={!isManager}
                autoComplete='off'
            />
            {error && <div className='invalid-feedback'>{error}</div>}
        </div>
    );
};

const AccountTeamFieldRepeater = ({ id, teamId, data, userState, handleFieldChange, handleRemoveClick, handleAddClick }) => {
    const [isManager, setIsManager] = useState(false);

    const { subscribedEmails = [], notificationType = '' } = data;

    useEffect(() => {
        // TODO: GAT-1510:003
        setIsManager(authUtils.userHasRole(userState, teamId, PERMISSIONS_USER_TYPES.manager));
    }, [teamId]);

    return (
        <div key={`repeater-${id}`}>
            {[...subscribedEmails].map((value = {}, index = 1) => (
                <div className='field-repeater' key={`repeater-section-${index}`}>
                    <AccountTeamField
                        id={index + 1}
                        isManager={isManager}
                        data={value}
                        index={index}
                        notificationType={notificationType}
                        handleFieldChange={handleFieldChange}
                    />
                    <AccountTeamFieldRepeaterAction
                        data={subscribedEmails}
                        isManager={isManager}
                        notificationType={notificationType}
                        index={index}
                        handleRemoveClick={handleRemoveClick}
                        handleAddClick={handleAddClick}
                    />
                </div>
            ))}
        </div>
    );
};

export default AccountTeamFieldRepeater;
