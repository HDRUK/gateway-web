import React from 'react';
import { ReactComponent as Clock } from '../../../images/clock.svg';
import './TimeDuration.scss';

export default ({ text = '' }) => {
    return (
        <div className='time'>
            <Clock />
            {text}
        </div>
    );
};
