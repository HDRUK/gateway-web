import React from 'react';

export const FilterClearSection = ({ onClearSection }) => {
    return (
        <div className='node-clearAll' onClick={onClearSection}>
            clear all
        </div>
    );
};
