import React, { useState } from 'react';
import { Popover as TinyPopover } from 'react-tiny-popover';
import PropTypes from 'prop-types';
import { Icon } from 'hdruk-react-core';
import { ReactComponent as EllipsisIcon } from '../../images/icons/ellipsis.svg';

const PopoverButton = React.forwardRef(({ actionType, handleAction, isPopoverOpen, children }, ref) => (
    <div
        ref={ref}
        style={{ display: 'inline-block', lineHeight: 0 }}
        tabIndex={0}
        role='button'
        {...(actionType === 'click' && {
            onKeyPress: () => handleAction(!isPopoverOpen),
            onClick: () => handleAction(!isPopoverOpen),
        })}
        {...(actionType === 'hover' && {
            onMouseOver: () => handleAction(true),
            onMouseOut: () => handleAction(false),
            onFocus: () => handleAction(true),
        })}>
        {children}
    </div>
));

PopoverButton.propTypes = {
    isPopoverOpen: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    handleAction: PropTypes.func.isRequired,
    actionType: PropTypes.oneOf(['click', 'hover']).isRequired,
};

const Popover = ({ trigger, position, padding, content, actionType }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    return (
        <TinyPopover
            isOpen={isPopoverOpen}
            onClickOutside={() => setIsPopoverOpen(false)}
            positions={[position]}
            padding={padding}
            content={() => (
                <PopoverButton actionType={actionType} handleAction={setIsPopoverOpen} isPopoverOpen={isPopoverOpen}>
                    {content}
                </PopoverButton>
            )}>
            <PopoverButton actionType={actionType} handleAction={setIsPopoverOpen} isPopoverOpen={isPopoverOpen}>
                {trigger}
            </PopoverButton>
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
