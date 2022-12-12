import React from 'react';
import { isEmpty } from 'lodash';

const Field = ({ id = '', manager = false, data = {}, index = 0, notificationType = '', handleFieldChange }) => {
    let { value, error } = data;
    return (
        <div className='form-group'>
            <input
                id={`field${id}`}
                className={`form-control gray800-14 ${!isEmpty(error) ? 'is-invalid' : ''}`}
                onChange={e => handleFieldChange(e, index, notificationType)}
                type='text'
                value={value}
                disabled={manager ? false : true}
                autoComplete='off'
            />
            {error && <div className='invalid-feedback'>{error}</div>}
        </div>
    );
};

export default Field;
