import React from 'react';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';

const ActivePhaseHeader = ({ onClickAction }) => {
    return (
        <div className='activePhase-head'>
            <h1 className='black-20-semibold'>Complete active phase</h1>
            <CloseButtonSvg className='activePhase-head--close' onClick={e => onClickAction(e, 'cancel')} />
            <p className='gray800-14'>
                Are you sure you want to complete this phase? This will end any further decisions on this phase, notifyinig all assigned
                reviewers and applicants that this phase is complete.
            </p>
        </div>
    );
};

export default ActivePhaseHeader;
