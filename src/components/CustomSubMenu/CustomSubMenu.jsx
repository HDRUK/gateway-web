import { forwardRef, useState, Children } from 'react';
import PropTypes from 'prop-types';

const CustomSubMenu = forwardRef(({ children, show, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');
    if (show) {
        return (
            <ul ref={ref} className='list-unstyled' aria-labelledby={labeledBy}>
                {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        );
    }
    return null;
});

CustomSubMenu.propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    'aria-labelledby': PropTypes.string.isRequired,
};

export default CustomSubMenu;
