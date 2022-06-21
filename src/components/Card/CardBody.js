/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import * as styles from './Card.styles.js';
import LayoutBox from '../LayoutBox';

const CardBody = ({ className, children, ...outerProps }) => {
    return (
        <LayoutBox className={cx(className, 'ui-CardBody')} {...outerProps}>
            <div css={styles.cardBody()}>{children}</div>
        </LayoutBox>
    );
};

export default CardBody;
