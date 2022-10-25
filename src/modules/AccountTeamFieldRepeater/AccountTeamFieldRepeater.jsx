import React, { useEffect } from 'react';
import './AccountTeamFieldRepeater.scss';
import { useAuth } from 'context/AuthContext';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { subscribedEmailPropTypes, teamNotificationPropTypes } from 'types';

const AccountTeamFieldRepeaterAction = ({ subscribedEmails, notificationType, isManager, index, handleRemoveClick, handleAddClick }) => {
    if (!isManager) return null;

    return (
        <div className='field-action' key={`field-action-${index}`}>
            <button
                type='button'
                onClick={() => handleRemoveClick(index, notificationType)}
                className='plusMinusButton'
                disabled={subscribedEmails.length === 1}>
                -
            </button>
            <button
                type='button'
                onClick={() => handleAddClick(notificationType)}
                className='plusMinusButton'
                disabled={subscribedEmails.length - 1 !== index}>
                +
            </button>
        </div>
    );
};

AccountTeamFieldRepeaterAction.propTypes = {
    index: PropTypes.number.isRequired,
    isManager: PropTypes.bool.isRequired,
    subscribedEmails: PropTypes.arrayOf(subscribedEmailPropTypes).isRequired,
    notificationType: PropTypes.string.isRequired,
    handleAddClick: PropTypes.func.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
};

const AccountTeamField = ({ id = '', isManager = false, subscribedEmail = {}, notificationType, index = 0, handleFieldChange }) => {
    const { value, error } = subscribedEmail;
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

AccountTeamField.propTypes = {
    id: PropTypes.string.isRequired,
    isManager: PropTypes.bool,
    subscribedEmail: subscribedEmailPropTypes,
    notificationType: PropTypes.string.isRequired,
    index: PropTypes.number,
    handleFieldChange: PropTypes.func.isRequired,
};

AccountTeamField.defaultProps = {
    isManager: false,
    subscribedEmail: {},
    index: 0,
};

const AccountTeamFieldRepeater = ({ id, teamId, teamNotification, handleFieldChange, handleRemoveClick, handleAddClick }) => {
    const { isTeamManager, managerInTeam } = useAuth();
    const { subscribedEmails = [], notificationType = '' } = teamNotification;

    useEffect(() => {
        // TODO: GAT-1510:003
        managerInTeam(teamId);
    }, [teamId]);

    return (
        <div key={`repeater-${id}`}>
            {[...subscribedEmails].map((value = {}, index = 1) => (
                <div className='field-repeater' key={`repeater-section-${index}`}>
                    <AccountTeamField
                        id={index + 1}
                        isManager={isTeamManager}
                        subscribedEmail={value}
                        index={index}
                        notificationType={notificationType}
                        handleFieldChange={handleFieldChange}
                    />
                    <AccountTeamFieldRepeaterAction
                        subscribedEmails={subscribedEmails}
                        isManager={isTeamManager}
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

AccountTeamFieldRepeater.propTypes = {
    id: PropTypes.string.isRequired,
    teamId: PropTypes.string.isRequired,
    teamNotification: teamNotificationPropTypes.isRequired,
    handleFieldChange: PropTypes.func.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
    handleAddClick: PropTypes.func.isRequired,
};

export default AccountTeamFieldRepeater;
