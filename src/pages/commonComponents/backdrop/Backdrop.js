import React, { Fragment } from 'react';
import './Backdrop.scss';

const backdrop = props => {
    const displayBackdrop = () => {
        if (props.show) document.body.classList.add('no-scroll');
        else document.body.classList.remove('no-scroll');

        return props.show ? <div className='backdrop' onClick={props.clicked} /> : null;
    };

    return <>{displayBackdrop()}</>;
};

export default backdrop;
