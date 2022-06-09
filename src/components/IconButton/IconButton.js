/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { PROP_TYPES_BUTTON_COMMON } from '../Button/Button.propTypes';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './IconButton.styles';

const IconButton = ({ variant, children, size, mt, mb, ml, mr, icon, className, ...outerProps }) => {
    return (
        <LayoutBox
            {...{ mt, mb, ml, mr }}
            as='button'
            css={styles.root({ variant, size })}
            {...outerProps}
            className={cx('ui-IconButton', className)}>
            {icon}
        </LayoutBox>
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
