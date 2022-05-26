/** @jsx jsx */
import { cx } from '@emotion/css';
import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { addCommonPropTypes } from '../../configs/propTypes';
import useCommonStyles from '../../hooks/useCommonStyles';
import * as styles from './Icon.styles.js';

const Icon = ({ svg, size, color, fill, stroke, className, ml, mr, mb, mt, ...outerProps }) => {
    const commonStyles = useCommonStyles({ mt, mb, ml, mr });

    const iconProps = {
        css: styles.root({ size, color, fill, stroke }),
        className: cx('ui-Icon', className, commonStyles),
        ...outerProps,
    };

    return <span {...iconProps}>{svg}</span>;
};

Icon.propTypes = addCommonPropTypes({
    svg: PropTypes.node.isRequired,
    size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'default', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'contained']),
    color: PropTypes.string,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    inline: PropTypes.bool,
});

Icon.defaultProps = {
    size: 'default',
    color: 'inherit',
    fill: 'inherit',
    stroke: 'none',
};

export default Icon;
