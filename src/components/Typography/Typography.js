/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Typography.styles';

const Typography = ({ children, color, className, mt, mb, ml, mr, width, minWidth, maxWidth, variant, as }) => {
    let tagName = as || variant;

    if (!as) {
        if (variant === 'body') {
            tagName = 'p';
        } else if (variant === 'caption' || variant === 'tiny') {
            tagName = 'span';
        }
    }

    return (
        <LayoutBox
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            as={tagName}
            className={cx('ui-Typography', className)}
            css={styles.root({ variant, color })}>
            {children}
        </LayoutBox>
    );
};

Typography.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'tiny']),
    color: PropTypes.string,
    as: PropTypes.string,
    ...PROP_TYPES_LAYOUTBOX,
};

Typography.defaultProps = {
    children: null,
    variant: 'body',
    color: null,
    as: null,
};

export default Typography;
