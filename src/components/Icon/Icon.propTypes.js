import PropTypes from 'prop-types';
import { addCommonPropTypes } from '../../configs/propTypes';

export const PROP_TYPES_ICON = addCommonPropTypes({
    svg: PropTypes.node.isRequired,
    size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'default', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'contained']),
    color: PropTypes.string,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    inline: PropTypes.bool,
});
