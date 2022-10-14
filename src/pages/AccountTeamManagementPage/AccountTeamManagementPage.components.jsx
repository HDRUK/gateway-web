import React from 'react';
import { isEmpty } from 'lodash';
import { Alert } from 'components';

const GeneratedAlerts = ({ alerts }) => {
    if (!isEmpty(alerts)) {
        return (
            <>
                {alerts.map(alert => {
                    const { type = '', message = '' } = alert;
                    return (
                        <Alert variant={type} key={`alert-${message}`} mt={2}>
                            {message}
                        </Alert>
                    );
                })}
            </>
        );
    }
    return null;
};

export { GeneratedAlerts };
