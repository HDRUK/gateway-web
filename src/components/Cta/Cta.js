/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Cta.styles';

const Cta = ({ color, children, mt, mb, ml, mr, width, minWidth, maxWidth, iconLeft, iconRight, className, fill, size, ...outerProps }) => {
    return (
        <LayoutBox
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            as='a'
            display='flex'
            alignItems='center'
            css={styles.root({ color, fill, size })}
            {...outerProps}
            className={cx('ui-Cta', className)}>
            {iconLeft && <Icon svg={iconLeft} />} {children} {iconRight && <Icon svg={iconRight} />}
        </LayoutBox>
    );
};

Cta.propTypes = {
    iconLeft: PropTypes.element,
    iconRight: PropTypes.element,
    color: PropTypes.string,
    fill: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    ...PROP_TYPES_LAYOUTBOX,
};

Cta.defaultProps = {
    iconLeft: null,
    iconRight: null,
    size: 'default',
    fill: 'inherit',
    color: 'inherit',
};

export default Cta;
