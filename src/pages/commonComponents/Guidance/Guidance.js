import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';

const renderTooltip = props => (
    <Tooltip className='tool-tip' style={{ width: '240px' }}>
        {props}
    </Tooltip>
);

const Guidance = ({ text, id }) => {
    return (
        <OverlayTrigger placement='top' overlay={renderTooltip(`${text}`)}>
            <button className='datause-info-icon-button' data-testid={id}>
                <SVGIcon name='info' width={10} height={10} fill={'#475da7'} className='datause-info-icon' />
            </button>
        </OverlayTrigger>
    );
};

Guidance.propTypes = {
    text: PropTypes.string.isRequired,
    id: PropTypes.string,
};

Guidance.defaultProps = {
    text: '',
    id: '',
};

export default Guidance;
