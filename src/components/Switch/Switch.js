/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';

import PropTypes from 'prop-types';

import { useCommonStyles } from 'hooks';
import { addCommonPropTypes } from '../../configs/propTypes';

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
