/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';
import * as styles from './Checkbox.styles';

const Checkbox = ({ className, mt, mb, ml, mr, width, minWidth, maxWidth, variant, partial, label: textLabel, id, ...outerProps }) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

    return (
        <label htmlFor={id} css={styles.root({ variant, partial })} className={cx('ui-Checkbox', className, commonStyles)}>
            <input type='checkbox' id={id} {...outerProps} />
            <span className='ui-Checkbox__label'>
                <span>{textLabel}</span>
            </span>
        </label>
    );
};

Checkbox.propTypes = addCommonPropTypes({
    label: PropTypes.node,
    onChange: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    id: PropTypes.string,
    partial: PropTypes.bool,
});

Checkbox.defaultProps = {
    variant: 'primary',
    partial: false,
};

export default Checkbox;
