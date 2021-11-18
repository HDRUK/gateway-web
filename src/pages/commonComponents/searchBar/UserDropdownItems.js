import React from 'react';
import { Fragment } from 'react';
import { Dropdown } from 'react-bootstrap';

import './SearchBar.scss';

export const UserDropdownItems = isAdmin => {
	return (
		<Fragment>
			<Dropdown.Item href='/account?tab=youraccount&team=user' className='black-14 user-dropdown-item' data-test-id='optAccount'>
				My Account
			</Dropdown.Item>
			<Dropdown.Item
				href='/account?tab=dataaccessrequests&team=user'
				className='black-14 user-dropdown-item'
				data-test-id='optDataAccessRequests'>
				Data access requests
			</Dropdown.Item>
			<Dropdown.Item href='/account?tab=tools&team=user' className='black-14 user-dropdown-item' data-test-id='optTools'>
				Tools
			</Dropdown.Item>
			<Dropdown.Item href='/account?tab=datause&team=user' className='black-14 user-dropdown-item' data-test-id='optDatause'>
				Data Uses
			</Dropdown.Item>
			<Dropdown.Item href='/account?tab=papers&team=user' className='black-14 user-dropdown-item' data-test-id='optPapers'>
				Papers
			</Dropdown.Item>
			<Dropdown.Item href='/account?tab=courses&team=user' className='black-14 user-dropdown-item' data-test-id='optCourses'>
				Courses
			</Dropdown.Item>
			<Dropdown.Item href='/account?tab=collections&team=user' className='black-14 user-dropdown-item' data-test-id='optCollections'>
				Collections
			</Dropdown.Item>
			{isAdmin && (
				<Dropdown.Item href='/account?tab=usersroles&team=user' className='black-14 user-dropdown-item' data-test-id='optUsersRoles'>
					Users and roles
				</Dropdown.Item>
			)}
		</Fragment>
	);
};

export default UserDropdownItems;
