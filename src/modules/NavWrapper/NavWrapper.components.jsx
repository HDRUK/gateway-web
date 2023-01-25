import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const CustomToggleInner = forwardRef(({ children, onClick }, ref) => (
    <a
        href='#'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
        className='dropdown-sub-menu'>
        {children}
    </a>
));

CustomToggleInner.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export { CustomToggleInner };
