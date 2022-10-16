import React, { useEffect, useState } from 'react';
import Field from './Field';
import FieldRepeaterAction from './FieldRepeaterAction';
import './FieldRepeater.scss';
import { PERMISSIONS_USER_TYPES } from 'consts';

const FieldRepeater = ({ id, teamId, data, userHasRole, handleFieldChange, handleRemoveClick, handleAddClick }) => {
    const [manager, setIsManager] = useState(false);

    const isManager = () => {
        // TODO: GAT-1510:003
        const isManager = userHasRole(teamId, PERMISSIONS_USER_TYPES.manager);
        setIsManager(isManager);
    };

    const { subscribedEmails = [], notificationType = '' } = data;

    useEffect(() => {
        isManager();
    }, [teamId]);

    return (
        <div key={`repeater-${id}`}>
            {[...subscribedEmails].map((value = {}, index = 1) => (
                <div className='field-repeater' key={`repeater-section-${index}`}>
                    <Field
                        id={index + 1}
                        manager={manager}
                        data={value}
                        index={index}
                        notificationType={notificationType}
                        handleFieldChange={handleFieldChange}
                    />
                    <FieldRepeaterAction
                        data={subscribedEmails}
                        manager={manager}
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

export default FieldRepeater;
