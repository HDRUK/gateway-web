import React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './tooltip.css'

const renderTooltip = text => <Tooltip class='accrualPeriodicity_tooltip'>{text}</Tooltip>;

function ToolTip({ text, placement, ...outerProps }) {
    return (
        <OverlayTrigger placement={placement} overlay={renderTooltip(text)}>
            {outerProps.children}
        </OverlayTrigger>
    );
}

ToolTip.propTypes = {
    text: PropTypes.node,
    placement: PropTypes.string,
};

ToolTip.defaultProps = {
    text: '',
    placement: 'right',
};

export default ToolTip;
