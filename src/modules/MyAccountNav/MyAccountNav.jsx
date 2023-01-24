import { Dropdown } from 'react-bootstrap';
import { isEmpty } from 'lodash';

import { accountUtils } from 'utils';
import { useAuth } from 'context/AuthContext';
import { useMemo } from 'react';
import { AddNew, WithChevron, WithOutChevron } from './MyAccountNav.components';
import googleAnalytics from '../../tracking';

const MyAccountNav = () => {
    const { userState, isRootAdmin } = useAuth();
    const [user] = userState;

    const handleRecordEvent = (category, action, label) => {
        googleAnalytics.recordEvent(category, action, label);
    };

    const navItems = [
        {
            href: '/account?tab=youraccount',
            labelContent: 'My Account',
            hasPermission: true,
        },
        {
            href: '/account?tab=dataaccessrequests',
            labelContent: 'Data access requests',
            hasPermission: true,
        },
        {
            href: '/account?tab=collections',
            labelContent: 'Collections',
            hasPermission: true,
        },
        {
            href: '/collection/add',
            labelContent: (
                <AddNew handleClick={() => handleRecordEvent('Collections', 'Add a new collection', 'Search bar add new link clicked')} />
            ),
            hasPermission: true,
        },
        {
            href: '/account?tab=courses',
            labelContent: 'Courses',
            hasPermission: true,
        },
        {
            href: '/course/add',
            labelContent: (
                <AddNew handleClick={() => handleRecordEvent('Courses', 'Add a new course', 'Search bar add new link clicked')} />
            ),
            hasPermission: true,
        },
        {
            href: '/account?tab=datause',
            labelContent: 'Data Uses',
            hasPermission: true,
        },
        {
            href: '/account?tab=papers',
            labelContent: 'Papers',
            hasPermission: true,
        },
        {
            href: '/paper/add',
            labelContent: <AddNew handleClick={() => handleRecordEvent('Papers', 'Add a new paper', 'Search bar add new link clicked')} />,
            hasPermission: true,
        },
        {
            href: '/account?tab=tools',
            labelContent: 'Tools',
            hasPermission: true,
        },
        {
            href: '/tool/add',
            labelContent: <AddNew handleClick={() => handleRecordEvent('Tools', 'Add a new tool', 'Search bar add new link clicked')} />,
        },
        {
            href: '/account?tab=usersroles',
            labelContent: ' Users and roles',
            hasPermission: isRootAdmin,
        },
    ];

    const Wrapper = useMemo(() => {
        const hasTeams = !isEmpty(user.teams);
        return hasTeams ? WithChevron : WithOutChevron;
    }, [user.teams]);

    return (
        <Dropdown data-testid='ddUserNavigation'>
            <Wrapper name={user.name}>
                {navItems.map(navItem => {
                    return (
                        navItem.hasPermission && (
                            <Dropdown.Item
                                key={navItem.href}
                                onClick={accountUtils.updateSelectedTeam({ teamType: 'user' })}
                                href={navItem.href}
                                className='black-14 user-dropdown-item'>
                                {navItem.labelContent}
                            </Dropdown.Item>
                        )
                    );
                })}
            </Wrapper>
        </Dropdown>
    );
};

export default MyAccountNav;
