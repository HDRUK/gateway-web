/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import { Box } from 'hdruk-react-core';
import { PROP_TYPES_TYPOGRAPHY } from './Typography.propTypes';
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

    if (variant === 'subtitle1' && !as) {
        tagName = 'p';
    }

    return (
        <Box
            {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}
            as={tagName}
            className={cx('ui-Typography', className)}
            css={styles.root({ variant, color })}>
            {children}
        </Box>
    );
};

Typography.propTypes = PROP_TYPES_TYPOGRAPHY;

Typography.defaultProps = {
    children: null,
    variant: 'body',
    color: null,
    as: null,
};

export default Typography;
