/** @jsxRuntime classic */
/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import { ReactComponent as AutosaveIcon } from '../../images/icons/autosave-loader.svg';
import Icon from '../Icon';
import { PROP_TYPES_ICON } from '../Icon/Icon.propTypes';
import { Box } from 'hdruk-react-core';
import { PROP_TYPES_LAYOUTBOX } from '../LayoutBox/LayoutBox.propTypes';
import * as styles from './Spinner.styles';

const Spinner = ({ mt, mb, ml, mr, className, ...outerProps }) => {
    return (
        <Box {...{ mt, mb, ml, mr }} display='inline-flex' className={cx('ui-Spinner', className)}>
            <Icon {...outerProps} css={styles.root()} />
        </Box>
    );
};

Spinner.propTypes = {
    ...PROP_TYPES_LAYOUTBOX,
    ...PROP_TYPES_ICON,
};

Spinner.defaultProps = {
    svg: <AutosaveIcon />,
};

export default Spinner;
