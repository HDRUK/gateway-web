import { Typography } from 'hdruk-react-core';

import { Dropdown } from 'react-bootstrap';
import googleAnalytics from '../../../tracking';

import './SearchBar.scss';

export const UserDropdownItems = isAdmin => {
    const handleRecordEvent = (category, action, label) => {
        googleAnalytics.recordEvent(category, action, label);
    };

    return (
        <>
            <Dropdown.Item href='/account?tab=youraccount&team=user' className='black-14 user-dropdown-item'>
                My Account
            </Dropdown.Item>
            <Dropdown.Item href='/account?tab=dataaccessrequests&team=user' className='black-14 user-dropdown-item'>
                Data access requests
            </Dropdown.Item>
            <Dropdown.Item href='/account?tab=collections&team=user' className='black-14 user-dropdown-item'>
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
            <Dropdown.Item href='/account?tab=courses&team=user' className='black-14 user-dropdown-item'>
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

            <Dropdown.Item href='/account?tab=datause&team=user' className='black-14 user-dropdown-item'>
                Data Uses
            </Dropdown.Item>
            <Dropdown.Item href='/account?tab=papers&team=user' className='black-14 user-dropdown-item'>
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
            <Dropdown.Item href='/account?tab=tools&team=user' className='black-14 user-dropdown-item'>
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
                <Dropdown.Item href='/account?tab=usersroles&team=user' className='black-14 user-dropdown-item'>
                    Users and roles
                </Dropdown.Item>
            )}
        </>
    );
};

export default UserDropdownItems;
