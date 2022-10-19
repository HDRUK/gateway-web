import React, { useState } from 'react';
import { Popover as TinyPopover } from 'react-tiny-popover';
import PropTypes from 'prop-types';
import { Icon } from 'hdruk-react-core';
import { ReactComponent as EllipsisIcon } from '../../images/icons/ellipsis.svg';

const PopoverButton = React.forwardRef((props, ref) => (
    <div ref={ref} tabIndex={0} role='button' onKeyPress={props.onClick} onClick={props.onClick}>
        {props.children}
    </div>
));

PopoverButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

const Popover = ({ trigger, positionVertical, positionHorizontal, padding, content }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            positions={[positionVertical, positionHorizontal]}
            align='center'
            padding={padding}
            content={() => <PopoverButton onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{content}</PopoverButton>}>
            <PopoverButton onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{trigger}</PopoverButton>
        </TinyPopover>
    );
};

Popover.propTypes = {
    content: PropTypes.node.isRequired,
    trigger: PropTypes.node,
    padding: PropTypes.number,
    positionHorizontal: PropTypes.oneOf(['left', 'right']),
    positionVertical: PropTypes.oneOf(['bottom', 'top']),
};

Popover.defaultProps = {
    padding: 0,
    trigger: <Icon fill='purple500' svg={<EllipsisIcon fill='inherit' />} size='xl' />,
    positionHorizontal: 'left',
    positionVertical: 'bottom',
};

export default Popover;
