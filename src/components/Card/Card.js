/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';

import LayoutBox from '../LayoutBox';

import * as styles from './Card.styles';

const Card = ({ children, mt, mb, ml, mr, width, minWidth, maxWidth, height, className, ...outerProps }) => {
    return (
        <LayoutBox {...{ mt, mb, ml, mr, width, minWidth, maxWidth, height }}>
            <div css={styles.root()} className={cx(className, 'ui-Card')} {...outerProps}>
                {children}
            </div>
        </LayoutBox>
    );
};

Card.propTypes = {
    ...PROP_TYPES_LAYOUTBOX,
};

export default Card;
