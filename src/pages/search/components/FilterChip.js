import React from 'react';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';

export const FilterTab = ({ filterItem, onHandleClearSelection }) => {
    const onHandleClear = e => {
        e.preventDefault();
        onHandleClearSelection(filterItem);
    };

    return (
        <span className='filters-chip' onClick={e => onHandleClear(e)}>
            {filterItem.encodedValue ? filterItem.value : filterItem.label}
            <CloseButtonSvg />
        </span>
    );
};

export default FilterTab;
