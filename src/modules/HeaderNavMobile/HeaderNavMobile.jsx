import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Typography } from 'hdruk-react-core';

import { useAuth } from 'context/AuthContext';

import { CustomSubMenu, CustomToggle } from 'components';
import { CustodianNav, MyAccountNav, AdminNav } from 'modules';
import { authUtils } from 'utils';
import googleAnalytics from '../../tracking';
import SVGIcon from '../../images/SVGIcon';

const HeaderNavMobile = ({ showLoginModal, logout }) => {
    const { userState } = useAuth();
    const [user] = userState;
    const [custodianTeams, setCustodianTeams] = useState([]);
    const [hasHDRAdminTeam, setHasHDRAdminTeam] = useState(false);

    useEffect(() => {
        const { teams } = user;
        setHasHDRAdminTeam(!!teams.find(team => authUtils.getIsTypeHDRAdmin(team.type)));
        setCustodianTeams(teams.filter(team => authUtils.getIsTypePublisher(team.type)));
    }, []);

    if (user.loggedIn) {
        return (
            <>
                <Dropdown data-testid='ddUserNavigation'>
                    <>
                        <Dropdown.Toggle
                            additionalActions={() =>
                                googleAnalytics.recordEvent(
                                    'Search bar',
                                    'Opened user notifications',
                                    'Clicked search bar notification icon'
                                )
                            }
                            data-testid='ddUserNavigationToggle'
                            customClass='dropdown-sub-menu'
                            as={CustomToggle}>
                            <Typography color='grey800' data-testid='ddUserNavigationSubMenu'>
                                {userState[0].name}
                            </Typography>
                            <span className='addNewDropDownGap' />
                            <SVGIcon name='chevronbottom' fill='#475DA7' className='svg-16 floatRightChevron' />
                        </Dropdown.Toggle>
                        <Dropdown.Menu as={CustomSubMenu}>
                            {/* TODO: GAT-1510:027 */}
                            <MyAccountNav />
                        </Dropdown.Menu>
                    </>
                </Dropdown>
                {hasHDRAdminTeam && <AdminNav isMobile />}
                {custodianTeams.map(custodianTeam => (
                    <CustodianNav isMobile team={custodianTeam} />
                ))}
                <Dropdown.Divider className='mb-1 mt-1' />
                <Dropdown.Item onClick={logout} className='black-14 user-dropdown-item' data-testid='optLogout'>
                    Sign out
                </Dropdown.Item>
            </>
        );
    }

    return (
        <>
            <Dropdown.Item
                className='black-14'
                onClick={() => {
                    showLoginModal();
                }}>
                Sign / Create account
            </Dropdown.Item>
        </>
    );
};

HeaderNavMobile.propTypes = {
    showLoginModal: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};

export default HeaderNavMobile;
