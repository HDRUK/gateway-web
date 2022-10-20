import React, { useState } from 'react';
import { Popover as TinyPopover } from 'react-tiny-popover';
import PropTypes from 'prop-types';
import { Icon } from 'hdruk-react-core';
import { ReactComponent as EllipsisIcon } from '../../images/icons/ellipsis.svg';

const PopoverButtonClick = React.forwardRef((props, ref) => (
    <div
        ref={ref}
        style={{ display: 'inline-block', lineHeight: 0 }}
        tabIndex={0}
        role='button'
        onKeyPress={props.onClick}
        onClick={props.onClick}>
        {props.children}
    </div>
));

PopoverButtonClick.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

const PopoverButtonHover = React.forwardRef((props, ref) => (
    <div
        ref={ref}
        style={{ display: 'inline-block', lineHeight: 0 }}
        tabIndex={0}
        role='button'
        onMouseOver={props.onClick}
        onFocus={props.onClick}>
        {props.children}
    </div>
));

PopoverButtonHover.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
};

const Popover = ({ trigger, position, padding, content, actionType }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const ButtonComponent = actionType === 'click' ? PopoverButtonClick : PopoverButtonHover;

    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            positions={[position]}
            padding={padding}
            content={() => <ButtonComponent onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{content}</ButtonComponent>}>
            <ButtonComponent onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{trigger}</ButtonComponent>
        </TinyPopover>
    );
};

Popover.propTypes = {
    content: PropTypes.node.isRequired,
    trigger: PropTypes.node,
    padding: PropTypes.number,
    actionType: PropTypes.oneOf(['click', 'hover']),
    position: PropTypes.oneOf(['left', 'right', 'bottom', 'top']),
};

Popover.defaultProps = {
    padding: 0,
    trigger: <Icon fill='purple500' svg={<EllipsisIcon fill='inherit' />} size='xl' />,
    position: 'bottom',
    actionType: 'click',
};

export default Popover;
