import { Dropdown } from 'react-bootstrap';
import { NavWrapper } from 'modules';
import PropTypes from 'prop-types';
import { useCustodianRoles } from 'hooks';
import { useAuth } from 'context/AuthContext';
import handleAnalytics from '../../pages/dataAccessRequestCustomiseForm/handleAnalytics';

const CustodianNav = ({ team, isMobile }) => {
    const { isReviewer, isCustodianDarManager, isCustodianMetadataManager, isMetadataEditor } = useCustodianRoles(team._id);
    const { isHDRAdmin } = useAuth();

    const navItems = [
        {
            href: '/account?tab=teamManagement&subTab=members',
            label: 'Team Management',
            hasPermission: () => true,
        },
        {
            href: '/account?tab=dataaccessrequests',
            label: 'Data access requests',
            hasPermission: () => [isReviewer, isCustodianDarManager, isHDRAdmin].some(role => role),
        },
        {
            handleOtherActions: () => {
                handleAnalytics('Clicked profile dropdown', 'Edit DAR form');
            },
            href: '/account?tab=customisedataaccessrequests_guidance',
            label: 'Edit DAR Form',
            hasPermission: () => [isCustodianDarManager, isHDRAdmin].some(role => role),
        },
        {
            href: '/account?tab=datause',
            label: 'Data Uses',
            hasPermission: () => [isCustodianDarManager, isHDRAdmin].some(role => role),
        },
        {
            href: '/account?tab=datasets',
            label: 'Datasets',
            hasPermission: () => [isCustodianMetadataManager, isMetadataEditor, isHDRAdmin].some(role => role),
        },
        {
            href: '/account?tab=help',
            label: 'Help',
            hasPermission: () => true,
        },
    ];

    return (
        <NavWrapper isMobile={isMobile} name={team.name}>
            {navItems.map(
                navItem =>
                    navItem.hasPermission() && (
                        <Dropdown.Item
                            key={navItem.href}
                            onClick={() => {
                                if (typeof navItem.handleOtherActions === 'function') {
                                    navItem.handleOtherActions();
                                }
                            }}
                            href={`${navItem.href}&teamType=team&teamId=${team._id}`}
                            className='black-14 user-dropdown-item'>
                            {navItem.label}
                        </Dropdown.Item>
                    )
            )}
        </NavWrapper>
    );
};

CustodianNav.propTypes = {
    isMobile: PropTypes.bool,
    team: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

CustodianNav.defaultProps = {
    isMobile: false,
};

export default CustodianNav;
