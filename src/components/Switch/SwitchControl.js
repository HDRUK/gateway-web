/** @jsxRuntime classic */
/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import { COMMON_COMPONENT_PROPS } from '../../configs/propTypes';

const SwitchControl = ({ className, children }) => {
    return (
        <span className={cx(className, 'ui-SwitchControl')}>
            <span>{children}</span>
        </span>
    );
};

SwitchControl.propTypes = COMMON_COMPONENT_PROPS;

SwitchControl.defaultProps = {
    variant: 'primary',
    partial: false,
};

export default SwitchControl;
