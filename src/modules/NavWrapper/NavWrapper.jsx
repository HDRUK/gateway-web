import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Typography } from 'hdruk-react-core';

import { CustomSubMenu } from 'components';
import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as ChevronBottom } from '../../images/chevron-bottom.svg';
import { CustomToggleInner } from './NavWrapper.components';

const NavWrapper = ({ isMobile = false, children, name }) => {
    return (
        <div key={name}>
            <Dropdown.Divider className='mb-1 mt-1' />
            <Dropdown>
                <Dropdown.Toggle as={CustomToggleInner}>
                    <Typography color='grey800'>{name}</Typography>
                    <span className='addNewDropDownGap' />
                    {isMobile ? <SVGIcon name='chevronbottom' fill='#475DA7' className='svg-16 floatRightChevron' /> : <ChevronBottom />}
                </Dropdown.Toggle>
                <Dropdown.Menu as={CustomSubMenu}>{children}</Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

NavWrapper.propTypes = {
    isMobile: PropTypes.bool,
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

NavWrapper.defaultProps = {
    isMobile: false,
};

export default NavWrapper;
