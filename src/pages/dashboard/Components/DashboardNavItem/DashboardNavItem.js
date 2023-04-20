import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { Icon } from 'hdruk-react-core';

const DashboardNavItem = ({ icon, activeClassName, onClick, children, to }) => {
    return (
        <div className={activeClassName} onClick={onClick} role='link'>
            <Nav.Link as={Link} className='verticalNavBar gray700-13' to={to}>
                <Icon svg={icon} fill='grey500' color='grey500' size='2xl' />
                <span className='navLinkItem'>{children}</span>
            </Nav.Link>
        </div>
    );
};

DashboardNavItem.defaultProps = {
    onClick: () => {},
};

export default DashboardNavItem;
