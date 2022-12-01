/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import * as styles from './Card.styles.js';

const CardHeader = ({ className, children, ...outerProps }) => {
    return (
        <div css={styles.cardHeader()} className={cx(className, 'ui-CardHeader')} {...outerProps}>
            {children}
        </div>
    );
};

export default CardHeader;
