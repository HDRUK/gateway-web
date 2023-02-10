import { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Button, Typography } from 'hdruk-react-core';
import PropTypes from 'prop-types';

import { useAuth } from 'context/AuthContext';
import { CustomMenu, CustomToggle } from 'components';
import { AdminNav, MyAccountNav, CustodianNav } from 'modules';
import { authUtils } from 'utils';
import googleAnalytics from '../../tracking';
import { ReactComponent as ChevronBottom } from '../../images/chevron-bottom.svg';

const HeaderNav = ({ showLoginModal, logout }) => {
    const { userState } = useAuth();
    const [user] = userState;
    const [custodianTeams, setCustodianTeams] = useState([]);
    const [hasHDRAdminTeam, setHasHDRAdminTeam] = useState(false);

    useEffect(() => {
        const { teams = [] } = user;
        setHasHDRAdminTeam(!!teams.find(team => authUtils.getIsTypeAdmin(team.type)));
        setCustodianTeams(teams.filter(team => authUtils.getIsTypePublisher(team.type)));
    }, []);

    return (
        <div className='navBarLoginSpacing'>
            {user.loggedIn && (
                <Dropdown data-testid='ddUserNavigation'>
                    <Dropdown.Toggle
                        additionalActions={() =>
                            googleAnalytics.recordEvent('Search bar', 'Opened user notifications', 'Clicked search bar notification icon')
                        }
                        customClass='user-dropdown-menu'
                        as={CustomToggle}>
                        <Typography color='grey800' data-testid='lblUserName'>
                            {user.name}
                        </Typography>
                        <span className='accountDropDownGap' />
                        <ChevronBottom />
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu} className='desktopLoginMenu'>
                        <MyAccountNav />
                        {hasHDRAdminTeam && <AdminNav />}
                        {custodianTeams.map(custodianTeam => (
                            <CustodianNav key={custodianTeam._id} team={custodianTeam} />
                        ))}
                        <Dropdown.Divider className='mb-1 mt-1' />
                        <Dropdown.Item onClick={logout} className='black-14 user-dropdown-item' data-testid='optLogout'>
                            Sign out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}
            {!user.loggedIn && (
                <>
                    <Button
                        variant='secondary'
                        id='myBtn'
                        data-testid='btnLogin'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            showLoginModal();
                        }}>
                        Sign in
                    </Button>
                </>
            )}
        </div>
    );
};

HeaderNav.propTypes = {
    showLoginModal: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

export default HeaderNav;
