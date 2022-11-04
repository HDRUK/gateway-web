import React, { Fragment, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from 'context/AuthContext';
import { PERMISSIONS_TEAM_ROLES } from 'consts';
import { authUtils } from 'utils';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as ChevronBottom } from '../../../images/chevron-bottom.svg';
import handleAnalytics from '../../dataAccessRequestCustomiseForm/handleAnalytics';

const CustomToggleInner = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href='javascript:void(0)'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
        className='dropdown-sub-menu'>
        {children}
    </a>
));

const CustomSubMenu = React.forwardRef(({ children, style, className, show, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');
    if (show) {
        return (
            <Fragment ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
                <ul className='list-unstyled'>
                    {React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
                </ul>
            </Fragment>
        );
    }
});

const UserDropdownTeams = ({ isMobile = false }) => {
    const { userState } = useAuth();

    const userHasTeamRole = (teamId, role) => {
        return authUtils.userHasTeamRole(userState, teamId, role);
    };

    return userState[0].teams.map(team => {
        return (
            <>
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
                                <Dropdown.Item href='/account?tab=datasets&team=admin' className='black-14 user-dropdown-item'>
                                    Datasets
                                </Dropdown.Item>
                                <Dropdown.Item href='/account?tab=datause&team=admin' className='black-14 user-dropdown-item'>
                                    Data Uses
                                </Dropdown.Item>
                                <Dropdown.Item
                                    href='/account?tab=teams&team=admin'
                                    className='black-14 user-dropdown-item'
                                    data-test-id='optTeams'>
                                    Teams
                                </Dropdown.Item>
                            </>
                        ) : (
                            <>
                                <Dropdown.Item
                                    href={`/account?tab=teamManagement&team=${team._id}`}
                                    className='black-14 user-dropdown-item'>
                                    Team Management
                                </Dropdown.Item>
                                {/* TODO: GAT-1510:001 */}
                                {userHasTeamRole(team._id, [PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.reviewer]) && (
                                    <>
                                        <Dropdown.Item
                                            href={`/account?tab=dataaccessrequests&team=${team._id}`}
                                            className='black-14 user-dropdown-item'>
                                            Data access requests
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            href={`/account?tab=customisedataaccessrequests_guidance&team=${team._id}`}
                                            className='black-14 user-dropdown-item'
                                            onClick={() => handleAnalytics('Clicked profile dropdown', 'Edit DAR form')}>
                                            Edit DAR Form
                                        </Dropdown.Item>
                                    </>
                                )}
                                <Dropdown.Item href={`/account?tab=datause&team=${team._id}`} className='black-14 user-dropdown-item'>
                                    Data Uses
                                </Dropdown.Item>
                                {/* TODO: GAT-1510:002 */}
                                {userHasTeamRole(team._id, [PERMISSIONS_TEAM_ROLES.manager, PERMISSIONS_TEAM_ROLES.metadata_editor]) ? (
                                    <Dropdown.Item href={`/account?tab=datasets&team=${team._id}`} className='black-14 user-dropdown-item'>
                                        Datasets
                                    </Dropdown.Item>
                                ) : (
                                    ''
                                )}
                                <Dropdown.Item href={`/account?tab=help&team=${team._id}`} className='black-14 user-dropdown-item'>
                                    Help
                                </Dropdown.Item>
                            </>
                        )}
                    </Dropdown.Menu>
                </Dropdown>
            </>
        );
    });
};

export default UserDropdownTeams;
