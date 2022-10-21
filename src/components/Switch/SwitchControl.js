/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import { COMMON_COMPONENT_PROPS } from '../../configs/propTypes';

const SwitchControl = ({ className, children }) => {
    return (
        <div className={cx(className, 'ui-SwitchControl')}>
            <div>{children}</div>
        </div>
    );
};

SwitchControl.propTypes = COMMON_COMPONENT_PROPS;

SwitchControl.defaultProps = {
    variant: 'primary',
    partial: false,
};

export default SwitchControl;
