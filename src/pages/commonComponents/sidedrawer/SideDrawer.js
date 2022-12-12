import React, { Fragment } from 'react';
import Backdrop from '../backdrop/Backdrop';

import './SideDrawer.scss';

const SideDrawer = props => {
    let attachedClasses = ['sideDrawer', 'close-drawer'];

    if (props.open) attachedClasses = ['sideDrawer', 'open-drawer'];

    return (
        <Fragment>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachedClasses.join(' ')}>{props.children}</div>
        </Fragment>
    );
};

export default SideDrawer;
