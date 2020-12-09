import React from 'react';
import _ from 'lodash';
import { ReactComponent as Flag } from '../../../images/flag.svg';
import { ReactComponent as Check } from '../../../images/check.svg';
import './WorkflowDecision.scss';

export default ({ text = '', decisionText = '', decisionMade = false, icon = '', classProperty = '' }) => {
	const getIcon = () => {
		switch (icon) {
			case 'flag':
				return <Flag />;
				break;
			case 'check':
				return <Check />;
				break;
			default:
				return '';
				break;
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
