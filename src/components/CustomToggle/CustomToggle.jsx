import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CustomToggle = forwardRef(({ children, customClass, onClick, additionalActions }, ref) => (
    <a
        className={customClass}
        href='#'
        ref={ref}
        onClick={e => {
            if (typeof additionalActions === 'function') {
                additionalActions();
            }
            e.preventDefault();
            onClick(e);
        }}>
        {children}
    </a>
));

CustomToggle.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    customClass: PropTypes.string.isRequired,
    additionalActions: PropTypes.func,
};

CustomToggle.defaultProps = {
    additionalActions: null,
};

export default CustomToggle;
