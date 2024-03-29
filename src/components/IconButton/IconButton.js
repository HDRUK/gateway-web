/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';

import PropTypes from 'prop-types';
import { Box } from 'hdruk-react-core';
import { PROP_TYPES_BUTTON_COMMON } from '../Button/Button.propTypes';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './IconButton.styles';

const IconButton = ({ variant, children, size, mt, mb, ml, mr, icon, className, ...outerProps }) => {
    return (
        <Box
            {...{ mt, mb, ml, mr }}
            as='button'
            css={styles.root({ variant, size })}
            {...outerProps}
            className={cx('ui-IconButton', className)}>
            {icon}
        </Box>
    );
};

IconButton.propTypes = {
    icon: PropTypes.element.isRequired,
    ...PROP_TYPES_BUTTON_COMMON,
    ...PROP_TYPES_LAYOUTBOX,
};

IconButton.defaultProps = {
    size: 'default',
    variant: 'primary',
    type: 'input',
    disabled: false,
};

export default IconButton;
