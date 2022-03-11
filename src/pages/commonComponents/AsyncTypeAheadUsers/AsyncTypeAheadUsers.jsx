/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typeahead from '../../../components/Typeahead/Typeahead';
import serviceUsers from '../../../services/users/users';
import UploaderUtil from '../../../utils/Uploader.util';
import Icon from '../../../components/Icon';

function AsyncTypeAheadUsers(props) {
	const [isLoading, setIsLoading] = useState(false);
	const [options, setOptions] = useState([]);
	const [selected, setSelected] = useState([]);

	useEffect(() => {
		props.selectedUsers && props.getUsersInfo ? getUsersInfo(props.selectedUsers) : setSelected(props.selectedUsers);
	}, [props.selectedUsers]);

	const getUsersInfo = async contributors => {
		const selectedUsers = await Promise.all(
			contributors
				.filter(id => id !== props.currentUserId)
				.map(async id => {
					const userInfo = await UploaderUtil.getUserInfo(id);
					if (userInfo) {
						return { id: userInfo.id, name: `${userInfo.firstname} ${userInfo.lastname}` };
					}
				})
		);
		setSelected(selectedUsers);
	};

	const handleChange = options => {
		if (props.showAuthor) {
			props.changeHandler(options);
		} else {
			props.changeHandler(options);
			if (options.length) {
				setSelected(options);
				props.changeHandler(options);
			} else {
				setSelected([]);
				props.changeHandler([]);
			}
		}
	};

	const handleInputChange = async value => {
		if (value.length > 2) {
			const users = await serviceUsers.searchUsers(value);
			setOptions(users.data.data);
		} else {
			handleOnFocus();
		}
	};

	const handleOnFocus = async () => {
		const response = await serviceUsers.getUsers();
		const { data } = response.data;
		setOptions(data);
	};
	const filterBy = () => true;

	return (
		<Typeahead
			filterBy={filterBy}
			data-testid='async-users'
			id='async-users'
			isLoading={isLoading}
			labelKey='name'
			placeholder='Recently added'
			onChange={handleChange}
			onInputChange={handleInputChange}
			onFocus={handleOnFocus}
			options={options}
			selected={selected}
			iconPrepend={<Icon name='search' size='xl' fill='purple' />}
			multiple
			renderMenuItemChildren={({ id, name }, props, index) => (
				<div class='menu'>
					<span className='name' data-testid={`name-${index}`}>
						{name}
					</span>
				</div>
			)}
		/>
	);
}

AsyncTypeAheadUsers.propTypes = {
	selectedUsers: PropTypes.array,
	showAuthor: PropTypes.bool,
	getUsersInfo: PropTypes.bool,
	changeHandler: PropTypes.func,
	currentUserId: PropTypes.number,
};
AsyncTypeAheadUsers.defaultProps = {
	selectedUsers: [],
	showAuthor: false,
	getUsersInfo: false,
};

export default AsyncTypeAheadUsers;
