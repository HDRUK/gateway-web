/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Dimmer.styles';

const Dimmer = ({ children, className, ...outerProps }) => {
    return (
        <div {...outerProps} className={cx(className, 'ui-Dimmer')} css={styles.root()}>
            {children}
        </div>
    );
};

Dimmer.propTypes = {
    ...PROP_TYPES_LAYOUTBOX,
};

export default Dimmer;
