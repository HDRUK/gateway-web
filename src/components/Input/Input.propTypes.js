import PropTypes from 'prop-types';

export const PROP_TYPES_INPUT = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    iconPrepend: PropTypes.node,
    iconAppend: PropTypes.node,
    textPrepend: PropTypes.node,
    textAppend: PropTypes.node,
    onDebounce: PropTypes.func,
    onChange: PropTypes.func,
    debounceDelay: PropTypes.number,
    inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    variant: PropTypes.oneOf(['primary', 'secondary']),
    id: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    error: PropTypes.node,
};
