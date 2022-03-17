import React from 'react';
import './ActionBar.scss';

const ActionBar = props => {
    return props.userState[0].loggedIn || props.showOverride ? <div className='actionBar'>{props.children}</div> : '';
};

export default ActionBar;
