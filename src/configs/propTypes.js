import PropTypes from 'prop-types';
import _ from 'lodash';

export const COMMON_PROP_TYPES = {
    ml: PropTypes.number,
    mr: PropTypes.number,
    mb: PropTypes.number,
    mt: PropTypes.number,
    width: PropTypes.string,
    maxWidth: PropTypes.string,
    minWidth: PropTypes.string,
    maxHeight: PropTypes.string,
    minHeight: PropTypes.string,
    className: PropTypes.string,
};

export const omit = (propTypes, exclude) => {
    return _.omit(propTypes, exclude);
};

export const pick = (propTypes, include) => {
    return _.pick(propTypes, include);
};

export const addCommonPropTypes = propTypes => {
    return {
        ...propTypes,
        ...COMMON_PROP_TYPES,
    };
};

export const COMMON_COMPONENT_PROPS = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
