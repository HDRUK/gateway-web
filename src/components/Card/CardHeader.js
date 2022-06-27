/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import { H5 } from '../Typography';
import * as styles from './Card.styles.js';

const CardHeader = ({ className, children, ...outerProps }) => {
    return (
        <div css={styles.cardHeader()} className={cx(className, 'ui-CardHeader')} {...outerProps}>
            <H5>{children}</H5>
        </div>
    );
};

export default CardHeader;
