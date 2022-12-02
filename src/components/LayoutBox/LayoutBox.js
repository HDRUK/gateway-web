import { cx } from '@emotion/css';

import PropTypes from 'prop-types';

import { useCommonStyles } from 'hooks';
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
    px,
    py,
    mx,
    my,
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
    position,
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
        px,
        py,
        mx,
        my,
        width,
        minWidth,
        maxWidth,
        minHeight,
        maxHeight,
        display,
        alignItems,
        justifyContent,
        flexGrow,
        position,
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
