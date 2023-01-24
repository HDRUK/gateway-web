import { forwardRef, useState, Children, Fragment } from 'react';
import PropTypes from 'prop-types';

const CustomSubMenu = forwardRef(({ children, style, className, show, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');
    if (show) {
        return (
            <Fragment ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
                <ul className='list-unstyled'>
                    {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
                </ul>
            </Fragment>
        );
    }
    return null;
});

CustomSubMenu.propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    style: PropTypes.string.isRequired,
    'aria-labelledby': PropTypes.string.isRequired,
};

export default CustomSubMenu;
