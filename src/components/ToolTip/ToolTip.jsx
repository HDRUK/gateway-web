import React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const renderTooltip = text => <Tooltip id='button-tooltip'>{text}</Tooltip>;

function ToolTip({ text, placement, ...outerProps }) {
    return (
        <OverlayTrigger placement={placement} overlay={renderTooltip(text)}>
            {outerProps.children}
        </OverlayTrigger>
    );
}

ToolTip.propTypes = {
    text: PropTypes.string,
    placement: PropTypes.string,
};

ToolTip.defaultProps = {
    text: '',
    placement: 'right',
};

export default ToolTip;
