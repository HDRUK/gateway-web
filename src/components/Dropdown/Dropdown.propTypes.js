import PropTypes from 'prop-types';

export const PROP_TYPES_DROPDOWN = {
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([
        PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.node,
                value: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
            })
        ),
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary']),
    iconSelected: PropTypes.node,
    onSelect: PropTypes.func,
    size: PropTypes.oneOf(['small', 'default', 'large']),
};
