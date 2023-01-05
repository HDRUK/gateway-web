import { forwardRef, Children, useState, Fragment } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from 'context/AuthContext';
import { PERMISSIONS_TEAM_ROLES } from 'consts';
import { accountUtils, authUtils } from 'utils';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as ChevronBottom } from '../../../images/chevron-bottom.svg';
import handleAnalytics from '../../dataAccessRequestCustomiseForm/handleAnalytics';

const CustomToggleInner = forwardRef(({ children, onClick }, ref) => (
    <a
        href='#'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
        className='dropdown-sub-menu'>
        {children}
    </a>
));

const CustomSubMenu = forwardRef(({ children, style, className, show, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');
    if (show) {
        return (
            <Fragment ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
                <ul className='list-unstyled'>
                    {Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
                </ul>
            </Fragment>
        );
    }
    return null;
});

const UserDropdownTeams = ({ isMobile = false }) => {
    const { userState } = useAuth();

    const userHasTeamRole = (teamId, role) => {
        return authUtils.userHasTeamRole(userState, teamId, role);
    };

    return userState[0].teams.map(team => {
        return (
            <div key={team._id}>
                <Dropdown.Divider className='mb-1 mt-1' />
                <Dropdown>
                    <Dropdown.Toggle as={CustomToggleInner}>
                        {/* TODO: GAT-1510:047 */}
                        <span className='black-14'>{authUtils.getIsTypeAdmin(team.type) ? 'HDR Admin' : team.name}</span>
                        <span className='addNewDropDownGap' />
                        {isMobile ? (
                            <SVGIcon name='chevronbottom' fill='#475DA7' className='svg-16 floatRightChevron' />
                        ) : (
                            <ChevronBottom />
                        )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu as={CustomSubMenu}>
                        {/* TODO: GAT-1510:048 */}
                        {authUtils.getIsTypeAdmin(team.type) ? (
                            <>
                                <Dropdown.Item
                                    onClick={() => accountUtils.updateTeamType({ teamType: 'admin' })}
                                    href='/account?tab=datasets'
                                    className='black-14 user-dropdown-item'>
                                    Datasets
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => accountUtils.updateTeamType({ teamType: 'admin' })}
                                    href='/account?tab=datause'
                                    className='black-14 user-dropdown-item'>
                                    Data Uses
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => accountUtils.updateTeamType({ teamType: 'admin' })}
                                    href='/account?tab=teams'
                                    className='black-14 user-dropdown-item'
                                    data-testid='optTeams'>
                                    Teams
                                </Dropdown.Item>
                            </>
                        ) : (
                            <>
                                <Dropdown.Item
                                    onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId: team._id })}
                                    href='/account?tab=teamManagement'
                                    className='black-14 user-dropdown-item'>
                                    Team Management
                                </Dropdown.Item>
                                {/* TODO: GAT-1510:001 */}
                                {userHasTeamRole(team._id, [PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.reviewer]) && (
                                    <>
                                        <Dropdown.Item
                                            onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId: team._id })}
                                            href='/account?tab=dataaccessrequests'
                                            className='black-14 user-dropdown-item'>
                                            Data access requests
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId: team._id })}
                                            href='/account?tab=customisedataaccessrequests_guidance'
                                            className='black-14 user-dropdown-item'
                                            onClick={() => handleAnalytics('Clicked profile dropdown', 'Edit DAR form')}>
                                            Edit DAR Form
                                        </Dropdown.Item>
                                    </>
                                )}
                                <Dropdown.Item
                                    onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId: team._id })}
                                    href='/account?tab=datause'
                                    className='black-14 user-dropdown-item'>
                                    Data Uses
                                </Dropdown.Item>
                                {/* TODO: GAT-1510:002 */}
                                {userHasTeamRole(team._id, [PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.metadata_editor]) ? (
                                    <Dropdown.Item
                                        onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId: team._id })}
                                        href='/account?tab=datasets'
                                        className='black-14 user-dropdown-item'>
                                        Datasets
                                    </Dropdown.Item>
                                ) : (
                                    ''
                                )}
                                <Dropdown.Item
                                    onClick={() => accountUtils.updateTeamType({ teamType: 'team', teamId: team._id })}
                                    href='/account?tab=help'
                                    className='black-14 user-dropdown-item'>
                                    Help
                                </Dropdown.Item>
                            </>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    });
};

export default UserDropdownTeams;
