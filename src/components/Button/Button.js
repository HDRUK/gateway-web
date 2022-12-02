/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';

import PropTypes from 'prop-types';
import { Box } from 'hdruk-react-core';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import { PROP_TYPES_BUTTON_COMMON } from './Button.propTypes';
import * as styles from './Button.styles';

const Button = ({ variant, children, size, mt, mb, ml, mr, width, minWidth, maxWidth, iconLeft, iconRight, className, ...outerProps }) => {
    return (
        <Box
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            as='button'
            css={styles.root({ variant, size })}
            {...outerProps}
            className={cx('ui-Button', className)}>
            {iconLeft} {children} {iconRight}
        </Box>
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
