import React from 'react';
import './SLA.scss';

export default ({ classProperty = '', text = '', icon }) => {
    const handleClick = e => {
        e.preventDefault();
    };

    return (
        <div className={`sla sla-${classProperty}`} onClick={handleClick}>
            {icon && <span className='sla-icons'>{icon}</span>}
            {text}
        </div>
    );
};
