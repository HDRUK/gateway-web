import PropTypes from 'prop-types';

export const PROP_TYPES_BUTTON_COMMON = {
    variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
};
