/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';
import * as styles from './Switch.styles';
import SwitchControl from './SwitchControl';

const Switch = ({ className, mt, mb, ml, mr, width, minWidth, maxWidth, label: textLabel, id, disabled, ...outerProps }) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

    return (
        <label htmlFor={id} css={styles.root({ disabled })} className={cx(className, commonStyles, 'ui-Switch')}>
            <input type='checkbox' id={id} {...outerProps} disabled={disabled} />
            <SwitchControl>{textLabel}</SwitchControl>
        </label>
    );
};

Switch.propTypes = addCommonPropTypes({
    label: PropTypes.node,
    onChange: PropTypes.func,
    id: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
});

Switch.defaultProps = {
    variant: 'primary',
    partial: false,
};

export default Switch;
