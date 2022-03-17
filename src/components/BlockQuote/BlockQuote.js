/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import LayoutBox from '../LayoutBox';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './BlockQuote.styles';

const BlockQuote = ({ children, className, mt, mb, ml, mr, width, minWidth, maxWidth }) => {
    return (
        <LayoutBox {...{ mt, mb, ml, mr, width, minWidth, maxWidth }}>
            <blockquote css={styles.root} className={cx('ui-Blockquote', className)}>
                {children}
            </blockquote>
        </LayoutBox>
    );
};

BlockQuote.propTypes = {
    children: PropTypes.node,
    ...PROP_TYPES_LAYOUTBOX,
};

export default BlockQuote;
