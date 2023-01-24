import { Dropdown } from 'react-bootstrap';
import { accountUtils } from 'utils';
import { NavWrapper } from 'modules';
import PropTypes from 'prop-types';

const AdminNav = ({ isMobile }) => {
    const adminItems = [
        {
            href: '/account?tab=datasets',
            label: 'Datasets',
            dataTestId: '',
        },
        {
            href: '/account?tab=datause',
            label: 'Data Uses',
            dataTestId: '',
        },
        {
            href: '/account?tab=teams',
            label: 'Teams',
            dataTestId: 'optTeams',
        },
    ];
    return (
        <NavWrapper isMobile={isMobile} name='HDR Admin'>
            {adminItems.map(item => (
                <Dropdown.Item
                    key={item.label}
                    onClick={() => accountUtils.updateSelectedTeam({ teamType: 'admin' })}
                    href={item.href}
                    data-testid={item.dataTestId}
                    className='black-14 user-dropdown-item'>
                    {item.label}
                </Dropdown.Item>
            ))}
        </NavWrapper>
    );
};

AdminNav.propTypes = {
    isMobile: PropTypes.bool,
};

AdminNav.defaultProps = {
    isMobile: false,
};

export default AdminNav;
