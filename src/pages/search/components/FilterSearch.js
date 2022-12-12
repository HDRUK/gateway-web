import React from 'react';
import SVGIcon from '../../../images/SVGIcon';

export const FilterSearch = ({ onSearchChange }) => {
    return (
        <div className='node-search'>
            <input type='text' className='node-search__input' placeholder='Search filter' onChange={e => onSearchChange(e.target.value)} />
            <div className='node-search__icon'>
                <SVGIcon name='searchicon' width={15} height={15} fill={'#2c8267'} stroke='none' type='submit' />
            </div>
        </div>
    );
};
