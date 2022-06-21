/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Cta.styles';

const iconSizes = {
    small: 'sm',
    default: 'lg',
    large: '2xl',
};

const fontSizes = {
    small: 'xs',
    default: 'default',
    large: '2xl',
};

const Cta = ({ color, children, mt, mb, ml, mr, width, minWidth, maxWidth, iconLeft, iconRight, className, fill, size, ...outerProps }) => {
    return (
        <LayoutBox
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            as='button'
            display='flex'
            alignItems='center'
            css={styles.root({ color, fill, fontSize: fontSizes[size] })}
            {...outerProps}
            className={cx('ui-Cta', className)}>
            {iconLeft && <Icon svg={iconLeft} size={iconSizes[size]} />} {children}{' '}
            {iconRight && <Icon svg={iconRight} size={iconSizes[size]} />}
        </LayoutBox>
    );
};

Cta.propTypes = {
    iconLeft: PropTypes.element,
    iconRight: PropTypes.element,
    color: PropTypes.string,
    fill: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    onClick: PropTypes.func,
    ...PROP_TYPES_LAYOUTBOX,
};

Cta.defaultProps = {
    iconLeft: null,
    iconRight: null,
    size: 'default',
    fill: 'inherit',
    color: 'inherit',
    onClick: () => {},
};

export default Cta;
