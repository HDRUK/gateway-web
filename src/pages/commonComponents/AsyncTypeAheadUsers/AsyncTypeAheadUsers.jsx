/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { Icon } from 'hdruk-react-core';
import { Typeahead } from 'components';
import { usersService } from 'services';

import { ReactComponent as SearchIcon } from '../../../images/search.svg';
import UploaderUtil from '../../../utils/Uploader.util';

import * as styles from './AsyncTypeAheadUsers.styles';

function AsyncTypeAheadUsers({ currentUserId, selectedUsers, shouldGetUsersInfo, changeHandler, showAuthor, placeholder, multiple }) {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);

    const handleSearch = async searchValue => {
        setIsLoading(true);
        const users = await usersService.searchUsers(encodeURI(searchValue));
        setOptions(users.data.data);
        setIsLoading(false);
    };

    const getUsersInfo = async contributors => {
        const populatedUsers = await Promise.all(
            contributors
                .filter(id => id !== currentUserId)
                .map(async id => {
                    const userInfo = await UploaderUtil.getUserInfo(id);
                    if (userInfo) {
                        return { id: userInfo.id, name: `${userInfo.firstname} ${userInfo.lastname}` };
                    }
                    return null;
                })
                .filter(user => !!user)
        );
        setSelected(populatedUsers);
    };

    useEffect(() => {
        if (selectedUsers && shouldGetUsersInfo) {
            getUsersInfo(selectedUsers);
        }
    }, [selectedUsers, shouldGetUsersInfo]);

    const handleChange = optionValues => {
        changeHandler(optionValues);

        if (!showAuthor) {
            if (optionValues.length) {
                setSelected(optionValues);
                changeHandler(optionValues);
            } else {
                setSelected([]);
                changeHandler([]);
            }
        }
    };

    const filterBy = () => true;

    return (
        <Typeahead
            css={styles.root()}
            filterBy={filterBy}
            async
            minLength={3}
            delay={500}
            data-testid='async-users'
            id='async-users'
            isLoading={isLoading}
            labelKey='name'
            placeholder={placeholder}
            onChange={handleChange}
            onSearch={handleSearch}
            options={options}
            selected={selected}
            iconPrepend={<Icon svg={<SearchIcon />} size='xl' fill='purple' />}
            multiple={multiple}
        />
    );
}

AsyncTypeAheadUsers.propTypes = {
    selectedUsers: PropTypes.arrayOf(PropTypes.string),
    showAuthor: PropTypes.bool,
    shouldGetUsersInfo: PropTypes.bool,
    changeHandler: PropTypes.func.isRequired,
    currentUserId: PropTypes.number.isRequired,
    multiple: PropTypes.bool,
    placeholder: PropTypes.string,
};
AsyncTypeAheadUsers.defaultProps = {
    selectedUsers: [],
    showAuthor: false,
    shouldGetUsersInfo: false,
    multiple: true,
    placeholder: 'Search',
};

export default AsyncTypeAheadUsers;
