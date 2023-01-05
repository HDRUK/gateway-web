import { Typography } from 'hdruk-react-core';

import { Dropdown } from 'react-bootstrap';
import { accountUtils } from 'utils';
import googleAnalytics from '../../../tracking';

import './SearchBar.scss';

export const UserDropdownItems = isAdmin => {
    const handleRecordEvent = (category, action, label) => {
        googleAnalytics.recordEvent(category, action, label);
    };

    return (
        <>
            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=youraccount'
                className='black-14 user-dropdown-item'>
                My Account
            </Dropdown.Item>
            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=dataaccessrequests'
                className='black-14 user-dropdown-item'>
                Data access requests
            </Dropdown.Item>
            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=collections'
                className='black-14 user-dropdown-item'>
                Collections
            </Dropdown.Item>
            <Dropdown.Item href='/collection/add' className='user-dropdown-item__add'>
                <Typography
                    color='grey600'
                    role='button'
                    onClick={() => handleRecordEvent('Collections', 'Add a new collection', 'Search bar add new link clicked')}>
                    + Add new
                </Typography>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=courses'
                className='black-14 user-dropdown-item'>
                Courses
            </Dropdown.Item>
            <Dropdown.Item href='/course/add' className='user-dropdown-item__add'>
                <Typography
                    color='grey600'
                    role='button'
                    onClick={() => handleRecordEvent('Courses', 'Add a new course', 'Search bar add new link clicked')}>
                    + Add new
                </Typography>
            </Dropdown.Item>

            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=datause'
                className='black-14 user-dropdown-item'>
                Data Uses
            </Dropdown.Item>
            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=papers'
                className='black-14 user-dropdown-item'>
                Papers
            </Dropdown.Item>
            <Dropdown.Item href='/paper/add' className='user-dropdown-item__add'>
                <Typography
                    color='grey600'
                    role='button'
                    onClick={() => handleRecordEvent('Papers', 'Add a new paper', 'Search bar add new link clicked')}>
                    + Add new
                </Typography>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                href='/account?tab=tools'
                className='black-14 user-dropdown-item'>
                Tools
            </Dropdown.Item>
            <Dropdown.Item href='/tool/add' className='user-dropdown-item__add'>
                <Typography
                    color='grey600'
                    role='button'
                    onClick={() => handleRecordEvent('Tools', 'Add a new tool', 'Search bar add new link clicked')}>
                    + Add new
                </Typography>
            </Dropdown.Item>

            {isAdmin && (
                <Dropdown.Item
                    onClick={accountUtils.updateTeamType({ teamType: 'user' })}
                    href='/account?tab=usersroles'
                    className='black-14 user-dropdown-item'>
                    Users and roles
                </Dropdown.Item>
            )}
        </>
    );
};

export default UserDropdownItems;
