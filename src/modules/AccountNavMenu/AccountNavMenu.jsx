import _ from 'lodash';
import { forwardRef, useState, Children } from 'react';
import { Dropdown } from 'react-bootstrap';

import { useAuth } from 'context/AuthContext';
import { authUtils } from 'utils';

import { useAccountTeamSelected } from 'hooks';

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

const AccountNavMenu = ({ tabId, setActiveAccordion, activeAccordion, allowAccessRequestManagement, publisherDetails, allowWorkflow }) => {
    const { userState, isHDRAdmin } = useAuth();
    const { teamId, teamType } = useAccountTeamSelected();

    /**
     * [renderPublishers Renders out publishers for DAR nav menu]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    const TeamListMenu = () => {
        const [user] = userState;
        const filterPublishers = user.teams.filter(p => authUtils.getIsTypePublisher(p.type));
        return filterPublishers.map((pub, index) => {
            return (
                <>
                    {index === 0 ? <hr /> : ''}
                    <Dropdown.Item href={`/account?tab=${tabId}&teamType=team&teamId=${pub._id}`} className='gray700-13'>
                        {pub.name}
                    </Dropdown.Item>
                </>
            );
        });
    };

    /**
     * [renderAdmin Renders out admin entry if admin team is found]
     *
     * @return  {[Nav.item]}  [return Nav.Item]
     */
    const AdminMenu = () => {
        return (
            <Dropdown.Item className='gray700-13' href='/account?tab=datasets&teamType=admin'>
                HDR Admin
            </Dropdown.Item>
        );
    };

    const renderCurrentTeam = () => {
        if (authUtils.getIsTypeUser(teamType)) {
            return <>{userState[0].name}</>;
        }
        if (authUtils.getIsTypeAdmin(teamType)) {
            return <>HDR Admin</>;
        }

        const teamFound = userState[0].teams.find(team => team._id === teamId);

        if (!teamFound) {
            return <>{userState[0].name}</>;
        }
        return <>{teamFound.name}</>;
    };

    const UserMenu = () => {
        return (
            <Dropdown.Item href='/account?tab=youraccount&teamType=user' className='gray700-13'>
                {userState[0].name || ''}
            </Dropdown.Item>
        );
    };

    return (
        <div data-testid='accountNavMenu' className='col-sm-12 col-md-2 accountMenuHolder'>
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
                        {isHDRAdmin && <AdminMenu />}
                        <TeamListMenu />
                    </Dropdown.Menu>
                </Dropdown>

                {/* TODO: GAT-1510:056 */}
                {authUtils.getIsTypeUser(teamType) && <UserNav tabId={tabId} />}

                {/* TODO: GAT-1510:054 */}
                {authUtils.getIsTypeAdmin(teamType) && <AdminNav tabId={tabId} />}

                {/* TODO: GAT-1510:052 */}
                {authUtils.getIsTypeTeam(teamType) && (
                    <TeamNav
                        allowAccessRequestManagement={allowAccessRequestManagement}
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
