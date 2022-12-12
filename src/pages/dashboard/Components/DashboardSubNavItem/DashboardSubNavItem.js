import React from 'react';
import { Nav } from 'react-bootstrap';

const DashboardSubNavItem = ({ onClick, children, active }) => {
    return (
        <Nav.Link onClick={onClick} bsPrefix='nav-block' className={`gray700-13 ${active ? 'nav-item-active' : ''}`}>
            <span className='subLinkItem'>{children}</span>
        </Nav.Link>
    );
};

DashboardSubNavItem.defaultProps = {
    onClick: () => {},
};

export default DashboardSubNavItem;
