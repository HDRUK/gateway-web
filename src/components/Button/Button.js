/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import { PROP_TYPES_BUTTON_COMMON } from './Button.propTypes';
import * as styles from './Button.styles';

const Button = ({ variant, children, size, mt, mb, ml, mr, width, minWidth, maxWidth, iconLeft, iconRight, className, ...outerProps }) => {
    return (
        <LayoutBox
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            as='button'
            css={styles.root({ variant, size })}
            {...outerProps}
            className={cx('ui-Button', className)}>
            {iconLeft} {children} {iconRight}
        </LayoutBox>
    );
};

Button.propTypes = {
    iconLeft: PropTypes.element,
    iconRight: PropTypes.element,
    ...PROP_TYPES_BUTTON_COMMON,
    ...PROP_TYPES_LAYOUTBOX,
};

Button.defaultProps = {
    size: 'default',
    variant: 'primary',
    type: 'input',
    disabled: false,
    iconLeft: null,
    iconRight: null,
};

export default Button;
