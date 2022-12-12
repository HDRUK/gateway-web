import React, { Fragment } from 'react';

export const FilterCount = ({ count = 0 }) => {
    return (
        <Fragment>
            <span>{count}</span>
        </Fragment>
    );
};
