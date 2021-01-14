import React from 'react';
import { ReactComponent as MetadataCompleteSvg } from '../../images/metadata_complete.svg';
import { ReactComponent as MetadataEmptySvg } from '../../images/metadata_empty.svg';
import { ReactComponent as MetadataHalfDoneSvg } from '../../images/metadata_half_done.svg';
import _ from 'lodash';

export const StatusDisplay = ({ section, status }) => {
	let completionStatus = {
		done: {
			icon: <MetadataCompleteSvg></MetadataCompleteSvg>,
		},
		partial: {
			icon: <MetadataHalfDoneSvg></MetadataHalfDoneSvg>,
		},
		empty: { icon: <MetadataEmptySvg></MetadataEmptySvg> },
	};

	const getCompletionStatusWheel = status => {
		if (!_.isEmpty(status)) return completionStatus[status].icon;
	};

	return <div data-testid={`${section}-${status}`}>{getCompletionStatusWheel(status)}</div>;
};

export default StatusDisplay;
