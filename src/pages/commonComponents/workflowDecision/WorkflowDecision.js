import React from 'react';
import _ from 'lodash';
import './WorkflowDecision.scss';
import SVGIcon from '../../../images/SVGIcon';

export default ({ text = '', decisionText = '', decisionMade = false, icon = '', classProperty = '' }) => {
    const getIcon = () => {
        switch (icon) {
            case 'flag':
                return <SVGIcon name='flag' width={18} height={18} fill={'#dc3645'} />;
            case 'check':
                return <SVGIcon name='check' width={18} height={18} fill={'#3db28c'} />;
            case 'cycle':
                return <SVGIcon name='cycle' width={18} height={18} fill={'#475da7'} />;
            default:
                return '';
        }
    };

    const getDecision = !decisionMade ? ' | ' : '';

    return (
        <div className={`status-text ${classProperty}`}>
            {getIcon()}
            {!_.isEmpty(decisionText) ? decisionText : ''}
            {!_.isEmpty(decisionText) ? getDecision : ''}
            {!_.isEmpty(text) ? text : ''}
        </div>
    );
};
