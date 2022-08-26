/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import LayoutBox from '../LayoutBox';
import * as styles from './Card.styles.js';

const CardFooter = ({ className, children, ...outerProps }) => {
    return (
        <div css={styles.cardFooter()} className={cx(className, 'ui-CardFooter')} {...outerProps}>
            <LayoutBox display='flex' justifyContent='flex-end'>
                {children}
            </LayoutBox>
        </div>
    );
};

export default CardFooter;
