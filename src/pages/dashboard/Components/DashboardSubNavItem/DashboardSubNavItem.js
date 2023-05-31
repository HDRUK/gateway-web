import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DashboardSubNavItem = ({ onClick, children, active, to }) => {
    return (
        <Nav.Link as={Link} to={to} onClick={onClick} bsPrefix='nav-block' className={`gray700-13 ${active ? 'nav-item-active' : ''}`}>
            <span className='subLinkItem'>{children}</span>
        </Nav.Link>
    );
};

DashboardSubNavItem.defaultProps = {
    onClick: () => {},
};

export default DashboardSubNavItem;
