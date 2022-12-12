import React from 'react';
import { ReactComponent as MetadataCompleteSvg } from '../../images/metadata_complete.svg';
import { ReactComponent as MetadataEmptySvg } from '../../images/metadata_empty.svg';
import { ReactComponent as MetadataHalfDoneSvg } from '../../images/metadata_half_done.svg';

export const StatusDisplay = ({ section, status }) => {
    let completionStatus = {
        done: { icon: <MetadataCompleteSvg /> },
        partial: { icon: <MetadataHalfDoneSvg /> },
        empty: { icon: <MetadataEmptySvg /> },
    };

    const getCompletionStatusWheel = status => {
        if (status === 0) return completionStatus['empty'].icon;
        if (status === 100) return completionStatus['done'].icon;
        else return completionStatus['partial'].icon;
    };

    return <div data-testid={`${section}-${status}`}>{getCompletionStatusWheel(status)}</div>;
};

export default StatusDisplay;
