import { Typography } from 'hdruk-react-core';
import { Dropdown } from 'react-bootstrap';

import { CustomSubMenu, CustomToggle } from 'components';
import PropTypes from 'prop-types';
import { ReactComponent as ChevronBottom } from '../../images/chevron-bottom.svg';
import googleAnalytics from '../../tracking';

const WithChevron = ({ children, name }) => {
    return (
        <>
            <Dropdown.Toggle
                additionalActions={() =>
                    googleAnalytics.recordEvent('Search bar', 'Opened user notifications', 'Clicked search bar notification icon')
                }
                data-testid='ddUserNavigationToggle'
                customClass='dropdown-sub-menu'
                as={CustomToggle}>
                <Typography color='grey800' data-testid='ddUserNavigationSubMenu'>
                    {name}
                </Typography>
                <span className='addNewDropDownGap' />
                <ChevronBottom />
            </Dropdown.Toggle>
            <Dropdown.Menu as={CustomSubMenu}>
                {/* TODO: GAT-1510:025 */}
                {children}
            </Dropdown.Menu>
        </>
    );
};

WithChevron.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const WithOutChevron = ({ children, name }) => {
    return (
        <>
            <Dropdown.Item className='black-14 user-dropdown-item'>
                <Typography color='grey700' data-testid='lblUserName'>
                    {name}
                </Typography>
            </Dropdown.Item>
            {/* TODO: GAT-1510:026 */}
            {children}
        </>
    );
};

WithOutChevron.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const AddNew = ({ handleClick }) => {
    return (
        <Typography color='grey600' role='button' onClick={handleClick}>
            + Add new
        </Typography>
    );
};

AddNew.propTypes = {
    handleClick: PropTypes.func.isRequired,
};

export { AddNew, WithOutChevron, WithChevron };
