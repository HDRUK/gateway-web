/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { cx } from '@emotion/css';
import PropTypes from 'prop-types';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Dimmer.styles';

const Dimmer = ({ children, className, contentAlignment, ...outerProps }) => {
    return (
        <div {...outerProps} className={cx(className, 'ui-Dimmer')} css={styles.root({ contentAlignment })}>
            {children}
        </div>
    );
};

Dimmer.propTypes = {
    contentAlignment: PropTypes.oneOf(['top', 'center']),
    ...PROP_TYPES_LAYOUTBOX,
};

Dimmer.defaultProps = {
    contentAlignment: 'center',
};

export default Dimmer;
