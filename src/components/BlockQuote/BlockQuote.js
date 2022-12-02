/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css';

import PropTypes from 'prop-types';
import { Box } from 'hdruk-react-core';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './BlockQuote.styles';

const BlockQuote = ({ children, className, mt, mb, ml, mr, width, minWidth, maxWidth }) => {
    return (
        <Box {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
            <blockquote css={styles.root} className={cx('ui-Blockquote', className)}>
                {children}
            </blockquote>
        </Box>
    );
};

BlockQuote.propTypes = {
    children: PropTypes.node,
    ...PROP_TYPES_LAYOUTBOX,
};

export default BlockQuote;
