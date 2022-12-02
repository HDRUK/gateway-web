import { cx } from '@emotion/css';

import { useCommonStyles } from 'hooks';

import { PROP_TYPES_ICON } from './Icon.propTypes';
import * as styles from './Icon.styles';

const Icon = ({ svg, size, color, fill, stroke, className, ml, mr, mb, mt, ...outerProps }) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr });

    const iconProps = {
        css: styles.root({ size, color, fill, stroke }),
        className: cx('ui-Icon', className, commonStyles),
        ...outerProps,
    };

    return <span {...iconProps}>{svg}</span>;
};

Icon.propTypes = PROP_TYPES_ICON;

Icon.defaultProps = {
    size: 'default',
    color: 'inherit',
    fill: 'inherit',
    stroke: 'none',
};

export default Icon;
