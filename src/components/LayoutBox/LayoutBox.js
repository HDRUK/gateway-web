/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import useCommonStyles from '../../hooks/useCommonStyles';
import { PROP_TYPES_LAYOUTBOX } from './LayoutBox.propTypes';

const LayoutBox = ({
    children,
    className,
    mt,
    mb,
    ml,
    mr,
    p,
    pt,
    pb,
    pl,
    pr,
    width,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    as,
    display,
    alignItems,
    justifyContent,
    flexGrow,
    ...outerProps
}) => {
    const commonStyles = useCommonStyles({
        mt,
        mb,
        ml,
        mr,
        p,
        pt,
        pr,
        pb,
        pl,
        width,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        display,
        alignItems,
        justifyContent,
        flexGrow,
    });

    const Tag = as;

    return (
        <Tag className={cx('ui-LayoutBox', className, commonStyles)} {...outerProps}>
            {children}
        </Tag>
    );
};

LayoutBox.propTypes = {
    as: PropTypes.string,
    ...PROP_TYPES_LAYOUTBOX,
};

LayoutBox.defaultProps = {
    as: 'div',
};

export default LayoutBox;
