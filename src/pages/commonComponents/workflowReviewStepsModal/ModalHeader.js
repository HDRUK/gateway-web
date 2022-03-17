import React from 'react';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';

const ModalHeader = ({ workflowName = '', onClickAction }) => {
    return (
        <div className='workflowReview-header'>
            <div className='workflowReview-header--wrap'>
                <div className='workflowReview-head'>
                    <h1 className='black-20-semibold'>{workflowName}</h1>
                    <CloseButtonSvg className='workflowReview-head--close' onClick={e => onClickAction(e)} />
                </div>
                <p>View this application assigned workflow and phase recommendations</p>
            </div>
        </div>
    );
};

export default ModalHeader;
