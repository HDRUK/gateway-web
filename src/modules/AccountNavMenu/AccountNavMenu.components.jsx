import { PERMISSIONS_TEAM_ROLES } from 'consts';
import { accountUtils, authUtils } from 'utils';

import { ReactComponent as BarChartIcon } from '../../images/icons/bar-chart.svg';
import { ReactComponent as FlowIcon } from '../../images/icons/flow.svg';
import { ReactComponent as TeamsIcon } from '../../images/icons/teams.svg';
import { ReactComponent as HelpIcon } from '../../images/icons/help.svg';
import { ReactComponent as ServerIcon } from '../../images/icons/server.svg';
import { ReactComponent as SettingsIcon } from '../../images/icons/settings.svg';
import { ReactComponent as UsersIcon } from '../../images/icons/users.svg';
import { ReactComponent as BookmarkIcon } from '../../images/icons/bookmark.svg';
import { ReactComponent as CommentsIcon } from '../../images/icons/comments.svg';
import { ReactComponent as CoursesIcon } from '../../images/icons/courses.svg';
import { ReactComponent as EditFolderIcon } from '../../images/icons/edit-folder.svg';
import { ReactComponent as UserIcon } from '../../images/icons/user.svg';
import { ReactComponent as ToolsIcon } from '../../images/icons/tools.svg';
import { ReactComponent as PapersIcon } from '../../images/icons/papers.svg';

import DashboardNavAccordion from '../../pages/dashboard/Components/DashboardNavAccordian';
import DashboardNavItem from '../../pages/dashboard/Components/DashboardNavItem';

import { isRouteMatch } from '../../utils/router';

const getNavActiveClass = (key, tabId) => {
    let isActive = false;

    if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
            if (tabId === key[i] || isRouteMatch(`/account/${key[i]}`)) {
                isActive = true;
                break;
            }
        }
    } else {
        isActive = tabId === key || isRouteMatch(`/account/${key}`);
    }

    return isActive ? 'activeCard' : 'accountNav';
};

const ACCORDIAN_CUSTOM_DAR_MENU = {
    text: 'Edit DAR Form',
    icon: <EditFolderIcon />,
    children: [
        {
            text: 'Presubmission Guidance',
            id: 'customisedataaccessrequests_guidance',
        },
        {
            text: 'Application Form',
            id: 'customisedataaccessrequests_applicationform',
        },
    ],
};

const UserNav = ({ tabId, userState }) => {
    const TEAM_USERS_MENU = [
        {
            id: 'dashboard',
            children: 'Dashboard',
            icon: <BarChartIcon />,
        },
        {
            id: 'youraccount',
            children: 'Account',
            icon: <UserIcon />,
        },
        {
            id: 'tools',
            children: 'Tools',
            icon: <ToolsIcon />,
        },
        {
            id: 'reviews',
            children: 'Reviews',
            icon: <CommentsIcon />,
        },
        { id: 'datause', children: 'Data Uses', icon: <FlowIcon /> },
        { id: 'papers', children: 'Papers', icon: <PapersIcon /> },
        { id: 'courses', children: 'Courses', icon: <CoursesIcon /> },
        { id: 'dataaccessrequests', children: 'Data access requests', icon: <UsersIcon /> },
        { id: 'collections', children: 'Collections', icon: <BookmarkIcon /> },
        // TODO: GAT-1510:028
        ...(authUtils.getIsRootRoleAdmin(userState) ? [{ id: 'usersroles', children: 'Users and roles', icon: <UsersIcon /> }] : []),
    ];

    return (
        <>
            {TEAM_USERS_MENU.map(({ id, ...outerProps }) => (
                <DashboardNavItem
                    key={id}
                    icon={<BarChartIcon />}
                    activeClassName={getNavActiveClass(id, tabId)}
                    onClick={() => accountUtils.updateTeamType({ teamType: 'user' })}
                    to={`/account?tab=${id}`}
                    {...outerProps}
                />
            ))}
        </>
    );
};

const AdminNav = ({ tabId }) => {
    return (
        <>
            <DashboardNavItem
                icon={<UsersIcon />}
                activeClassName={getNavActiveClass('datasets', tabId)}
                onClick={() => accountUtils.updateTeamType({ teamType: 'admin' })}
                to='/account?tab=datasets'>
                Datasets
            </DashboardNavItem>

            <DashboardNavItem
                icon={<FlowIcon />}
                activeClassName={getNavActiveClass('datause', tabId)}
                onClick={() => accountUtils.updateTeamType({ teamType: 'admin' })}
                to='/account?tab=datause'>
                Data Uses
            </DashboardNavItem>

            <DashboardNavItem
                icon={<TeamsIcon />}
                activeClassName={getNavActiveClass('teams', tabId)}
                onClick={() => accountUtils.updateTeamType({ teamType: 'admin' })}
                to='/account?tab=teams'>
                Teams
            </DashboardNavItem>
        </>
    );
};

const TeamNav = ({
    allowAccessRequestManagement,
    userHasTeamRole,
    teamId,
    setActiveAccordion,
    tabId,
    activeAccordion,
    publisherDetails,
    allowWorkflow,
}) => {
    const ACCORDIAN_DAR_MENU = {
        text: 'Data access requests',
        icon: <UsersIcon />,
        children: [
            {
                text: 'Applications',
                id: 'dataaccessrequests',
            },
            // TODO: GAT-1510:006
            ...(allowWorkflow && userHasTeamRole(PERMISSIONS_TEAM_ROLES.manager)
                ? [
                      {
                          id: 'workflows',
                          text: 'Workflows',
                      },
                  ]
                : []),
        ],
    };

    const ACCORDIAN_DUR_MENU = {
        text: 'Data Uses',
        icon: <FlowIcon />,
        children: [
            {
                text: 'Dashboard',
                id: 'datause',
            },
            // TODO: GAT-1510:007
            ...(userHasTeamRole([PERMISSIONS_TEAM_ROLES.manager]) && publisherDetails.dataUse?.widget?.enabled
                ? [{ text: 'Data use widget', id: 'datause_widget' }]
                : []),
        ],
    };

    return (
        <>
            <DashboardNavItem
                icon={<SettingsIcon />}
                activeClassName={getNavActiveClass('teamManagement', tabId)}
                onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId })}
                to='/account?tab=teamManagement'>
                Team Management
            </DashboardNavItem>
            {/* TODO: GAT-1510:008 */}
            {allowAccessRequestManagement && userHasTeamRole([PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.reviewer]) && (
                <>
                    <div className={getNavActiveClass(['dataaccessrequests', 'workflows', 'addeditworkflow'], tabId)}>
                        <DashboardNavAccordion
                            onSelect={setActiveAccordion}
                            tabId={tabId}
                            activeKey={activeAccordion}
                            eventKey='0'
                            data={ACCORDIAN_DAR_MENU}
                            teamId={teamId}
                        />
                    </div>
                    {publisherDetails?.questionBank?.enabled && (
                        <div
                            className={getNavActiveClass(
                                ['customisedataaccessrequests_guidance', 'customisedataaccessrequests_applicationform'],
                                tabId
                            )}>
                            <DashboardNavAccordion
                                onSelect={setActiveAccordion}
                                tabId={tabId}
                                activeKey={activeAccordion}
                                eventKey='1'
                                data={ACCORDIAN_CUSTOM_DAR_MENU}
                                teamId={teamId}
                            />
                        </div>
                    )}
                </>
            )}
            {/* TODO: GAT-1510:009 */}
            {userHasTeamRole([PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.metadata_editor]) && (
                <DashboardNavItem
                    icon={<ServerIcon />}
                    activeClassName={getNavActiveClass('datasets', tabId)}
                    onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId })}
                    to='/account?tab=datasets'>
                    Datasets
                </DashboardNavItem>
            )}

            <div className={getNavActiveClass(['datause', 'datause_widget'], tabId)}>
                <DashboardNavAccordion
                    onSelect={setActiveAccordion}
                    tabId={tabId}
                    activeKey={activeAccordion}
                    eventKey='2'
                    data={ACCORDIAN_DUR_MENU}
                    teamId={teamId}
                />
            </div>

            <DashboardNavItem
                icon={<HelpIcon />}
                activeClassName={getNavActiveClass('help', tabId)}
                onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId })}
                to='/account?tab=help'>
                Help
            </DashboardNavItem>
        </>
    );
};

export { UserNav, AdminNav, TeamNav };