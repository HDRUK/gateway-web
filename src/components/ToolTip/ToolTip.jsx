/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import * as styles from './ToolTip.styles';
import useCommonStyles from '../../hooks/useCommonStyles';

function ToolTip({ width, maxWidth, minWidth, text, placement, ...outerProps }) {
    const commonStyles = useCommonStyles({ width, minWidth, maxWidth });

    return (
        <OverlayTrigger
            placement={placement}
            overlay={props => (
                <Tooltip css={styles.root} className={cx(commonStyles, props.className)} {...props}>
                    {text}
                </Tooltip>
            )}>
            {outerProps.children}
        </OverlayTrigger>
    );
}

ToolTip.propTypes = {
    text: PropTypes.node,
    placement: PropTypes.string,
    width: PropTypes.string,
    maxWidth: PropTypes.string,
    minWidth: PropTypes.string,
};

ToolTip.defaultProps = {
    text: '',
    placement: 'left',
    maxWidth: '350px',
};

export default ToolTip;
