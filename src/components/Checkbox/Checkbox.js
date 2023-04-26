/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';

import PropTypes from 'prop-types';

import { useCommonStyles } from 'hooks';
import { addCommonPropTypes } from '../../configs/propTypes';

import * as styles from './Checkbox.styles';

const Checkbox = ({
    className,
    mt,
    mb,
    ml,
    mr,
    width,
    minWidth,
    maxWidth,
    variant,
    partial,
    label: textLabel,
    id,
    disabled,
    title,
    ...outerProps
}) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr, width, minWidth, maxWidth });

    return (
        <label
            title={title}
            htmlFor={id}
            css={styles.root({ variant, partial, disabled })}
            className={cx('ui-Checkbox', className, commonStyles)}>
            <input type='checkbox' id={id} {...outerProps} disabled={disabled} />
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
    title: PropTypes.string,
    partial: PropTypes.bool,
});

Checkbox.defaultProps = {
    variant: 'primary',
    partial: false,
    title: '',
};

export default Checkbox;
