import _ from 'lodash';
import { forwardRef, useState, Children } from 'react';
import { Dropdown } from 'react-bootstrap';

import { useAuth } from 'context/AuthContext';
import { accountUtils, authUtils } from 'utils';
import { PERMISSIONS_TEAM_ROLES } from 'consts';

import { useAccountTeamSelected } from 'hooks';
import googleAnalytics from '../../tracking';

import { ReactComponent as ChevronRightSvg } from '../../images/chevron-bottom.svg';

import { UserNav, AdminNav, TeamNav } from './AccountNavMenu.components';

const CustomToggle = forwardRef(({ children, onClick }, ref) => (
    <a
        href='#'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}>
        {children}
    </a>
));

const CustomMenu = forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled'>
                {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

const AccountNavMenu = ({
    tabId,
    setDataAccessRequest,
    setActiveAccordion,
    setAlert,
    setTabId,
    alert,
    activeAccordion,
    allowAccessRequestManagement,
    publisherDetails,
    allowWorkflow,
}) => {
    const { userState } = useAuth();
    const { teamId, teamType } = useAccountTeamSelected();

    const userHasTeamRole = role => {
        return authUtils.userHasTeamRole(userState, teamId, role);
    };

    // TODO - remove and distribute logic
    const toggleNav = ({ selectedTabId = '', selectedUserType, selectedTeamId, ...rest }) => {
        const tab = {};
        let updatedTabId = alert?.nav || selectedTabId;
        googleAnalytics.recordVirtualPageView(selectedTabId);
        let updatedActiveAccordion = activeAccordion;
        const [user] = userState;

        // 2. make sure tabId is not empty
        if (!_.isEmpty(updatedTabId)) {
            // 3. need to check for teams returns {tabId: '', team: ''}; eg dataccessrequests&team=ALLIANCE
            // const tab = generateTabObject(updatedTabId);
            // 4. check if user has teams and the current nav is dataaccessrequests, keep expanded
            if (!_.isEmpty(user.teams)) {
                if (updatedTabId === 'dataaccessrequests' || updatedTabId === 'workflows' || updatedTabId === 'addeditworkflow') {
                    updatedActiveAccordion = '0';
                } else if (updatedTabId === 'datause' || updatedTabId === 'datause_widget') {
                    updatedActiveAccordion = '2';
                }
            }

            if (!_.isEmpty(selectedUserType)) {
                localStorage.setItem('HDR_TEAM', tab.teamId || selectedUserType);
                if (!authUtils.getIsTypeUser(selectedUserType) && !authUtils.getIsTypeAdmin(selectedUserType)) {
                    if (_.isEmpty(updatedTabId) || !['dataaccessrequests', 'datasets', 'teamManagement'].includes(updatedTabId)) {
                        // TODO: GAT-1510:004
                        if (userHasTeamRole(tab.teamId, [PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.reviewer]))
                            updatedTabId = 'dataaccessrequests';
                        // TODO: GAT-1510:005
                        else if (userHasTeamRole(tab.teamId, PERMISSIONS_TEAM_ROLES.metadata_editor)) updatedTabId = 'datasets';
                        else updatedTabId = 'teamManagement';
                    }
                }
                // setUserType(selectedUserType);
            } else if (localStorage.getItem('HDR_TEAM') === '') {
                localStorage.setItem('HDR_TEAM', 'user');
            }
            // 5. set state
            setTabId(updatedTabId);
            // setTeamId(tab.teamId);
            setAlert(!_.isEmpty(alert) ? alert : {});
            setActiveAccordion(updatedActiveAccordion);
            setDataAccessRequest({});
        }
    };

    /**
     * [renderPublishers Renders out publishers for DAR nav menu]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    const TeamMenu = () => {
        const [user] = userState;
        if (!_.isEmpty(user.teams)) {
            // TODO: GAT-1510:049
            const filterPublishers = [...user.teams].filter(p => authUtils.getIsTypePublisher(p.type));
            if (!_.isEmpty(filterPublishers)) {
                return filterPublishers.map((pub, index) => {
                    return (
                        <>
                            {index === 0 ? <hr /> : ''}
                            <Dropdown.Item
                                href={`/account?tab=${tabId}`}
                                className='gray700-13'
                                onClick={() => {
                                    accountUtils.updateTeamType({ teamType: 'team', teamId: pub._id });
                                }}>
                                {pub.name}
                            </Dropdown.Item>
                        </>
                    );
                });
            }
            return '';
        }
        return '';
    };

    /**
     * [renderAdmin Renders out admin entry if admin team is found]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    const AdminMenu = () => {
        const [user] = userState;
        // TODO: GAT-1510:050
        const isTypeAdmin = [...user.teams].filter(p => authUtils.getIsTypeAdmin(p.type));

        if (!_.isEmpty(isTypeAdmin)) {
            return (
                <Dropdown.Item
                    className='gray700-13'
                    href='/account?tab=datasets'
                    onClick={() => {
                        accountUtils.updateTeamType({ teamType: 'admin' });
                    }}>
                    HDR Admin
                </Dropdown.Item>
            );
        }
        return '';
    };

    const renderCurrentTeam = () => {
        if (teamType === 'user') {
            return <>{userState[0].name}</>;
        }
        if (teamType === 'admin') {
            return <>HDR Admin</>;
        }

        const teamFound = userState[0].teams.find(team => team._id === teamId);

        if (!teamFound) {
            // setUserType('user');
            return <>{userState[0].name}</>;
        }
        return <>{teamFound.name}</>;
    };

    const UserMenu = () => {
        return (
            <Dropdown.Item
                onClick={() => accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=youraccount'
                className='gray700-13'>
                {userState[0].name || ''}
            </Dropdown.Item>
        );
    };

    return (
        <div className='col-sm-12 col-md-2 accountMenuHolder'>
            <div className='account-menu'>
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggle}>
                        <div className='teamSelectorHeader'>
                            <span className='gray700-13'>{renderCurrentTeam()}</span>
                            <ChevronRightSvg fill='#475da7' className='dataClassArrow pointer' />
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu} className='teamSelectorMenu'>
                        <UserMenu />
                        <AdminMenu />
                        <TeamMenu />
                    </Dropdown.Menu>
                </Dropdown>

                {/* TODO: GAT-1510:056 */}
                {authUtils.getIsTypeUser(teamType) && <UserNav userState={userState} tabId={tabId} />}

                {/* TODO: GAT-1510:054 */}
                {authUtils.getIsTypeAdmin(teamType) && <AdminNav tabId={tabId} />}

                {/* TODO: GAT-1510:052 */}
                {authUtils.getIsTypeTeam(teamType) && (
                    <TeamNav
                        allowAccessRequestManagement={allowAccessRequestManagement}
                        userHasTeamRole={userHasTeamRole}
                        teamId={teamId}
                        setActiveAccordion={setActiveAccordion}
                        tabId={tabId}
                        activeAccordion={activeAccordion}
                        publisherDetails={publisherDetails}
                        allowWorkflow={allowWorkflow}
                    />
                )}
            </div>
        </div>
    );
};

export default AccountNavMenu;