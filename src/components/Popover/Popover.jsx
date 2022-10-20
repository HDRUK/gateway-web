import React, { useState } from 'react';
import { Popover as TinyPopover } from 'react-tiny-popover';
import PropTypes from 'prop-types';
import { Icon } from 'hdruk-react-core';
import { ReactComponent as EllipsisIcon } from '../../images/icons/ellipsis.svg';

const PopoverButton = React.forwardRef((props, ref) => (
    <div ref={ref} style={{ display: 'inline-block' }} tabIndex={0} role='button' onKeyPress={props.onClick} onClick={props.onClick}>
        {props.children}
    </div>
));

PopoverButton.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

const Popover = ({ trigger, position, padding, content }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            positions={[position]}
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
    position: PropTypes.oneOf(['left', 'right', 'bottom', 'top']),
};

Popover.defaultProps = {
    padding: 0,
    trigger: <Icon fill='purple500' svg={<EllipsisIcon fill='inherit' />} size='xl' />,
    position: 'bottom',
};

export default Popover;
