import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = props => (
    <Tooltip className='tool-tip' style={{ width: '240px' }}>
        {props}
    </Tooltip>
);

const StatusBadge = ({ sectionStatus, statusOptions, statusClass, toolTipText }) => {
    return sectionStatus === statusOptions.PENDING ? (
        <OverlayTrigger placement='top' overlay={renderTooltip(`${toolTipText}`)}>
            <div className={`status-chip sla-${statusClass}`}>{sectionStatus}</div>
        </OverlayTrigger>
    ) : (
        <div className={`status-chip sla-${statusClass}`}>{sectionStatus}</div>
    );
};

StatusBadge.propTypes = {
    sectionStatus: PropTypes.string.isRequired,
    statusOptions: PropTypes.objectOf(PropTypes.object).isRequired,
    statusClass: PropTypes.string.isRequired,
    toolTipText: PropTypes.string.isRequired,
};

export default StatusBadge;
