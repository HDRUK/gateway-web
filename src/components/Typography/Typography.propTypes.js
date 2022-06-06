import PropTypes from 'prop-types';

export const PROP_TYPES_TYPOGRAPHY = {
    children: PropTypes.node,
    variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'caption', 'tiny']),
    color: PropTypes.string,
    as: PropTypes.string,
    ...PROP_TYPES_LAYOUTBOX,
};
