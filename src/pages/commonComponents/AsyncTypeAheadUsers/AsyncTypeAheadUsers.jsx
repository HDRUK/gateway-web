/** @jsx jsx */
import { jsx } from '@emotion/react';
import { find, isEmpty, isUndefined, remove } from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Menu, MenuItem } from 'react-bootstrap-typeahead';
import Icon from '../../../components/Icon';
import Typeahead from '../../../components/Typeahead/Typeahead';
import useDebounce from '../../../hooks/useDebounce';
import { ReactComponent as SearchIcon } from '../../../images/search.svg';
import { ReactComponent as GreenTick } from '../../../images/tick.svg';
import serviceUsers from '../../../services/users/users';
import UploaderUtil from '../../../utils/Uploader.util';
import * as styles from './AsyncTypeAheadUsers.styles';

function AsyncTypeAheadUsers(props) {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, 500);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [recentlyAdded, setRecentlyadded] = useState([]);
    const [showRecentlyAdded, setShowRecentlyAdded] = useState(false);
    const handleSearch = async () => {
        if (value.length > 2) {
            setIsLoading(true);
            const users = await serviceUsers.searchUsers(value);
            setOptions(users.data.data);
            setShowRecentlyAdded(false);
            setIsLoading(false);
        }
    };

    const handleOnFocus = async e => {
        if (!isUndefined(e) && e.type === 'focus' && isEmpty(recentlyAdded)) {
            const response = await serviceUsers.getUsers();
            const { data } = response.data;
            const currentUserInfo = remove(data, { id: props.currentUserId });
            if (!isEmpty(currentUserInfo)) {
                data.unshift(currentUserInfo[0]);
            }
            setOptions(data);
            setRecentlyadded(data);
            setShowRecentlyAdded(true);
        } else {
            setShowRecentlyAdded(true);
            setOptions(recentlyAdded);
        }
    };

    useEffect(() => {
        props.selectedUsers && props.getUsersInfo ? getUsersInfo(props.selectedUsers) : setSelected(props.selectedUsers);
        if (value) {
            handleSearch();
        } else {
            handleOnFocus();
        }
    }, [props.selectedUsers, debouncedValue]);

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

    const handleChange = optionValues => {
        if (props.showAuthor) {
            props.changeHandler(optionValues);
        } else {
            props.changeHandler(optionValues);
            if (optionValues.length) {
                setSelected(optionValues);
                props.changeHandler(optionValues);
            } else {
                setSelected([]);
                props.changeHandler([]);
            }
        }
    };

    const handleInputChange = inputValue => {
        setValue(inputValue);
    };
    const filterBy = () => true;

    return (
        <Typeahead
            css={styles.root()}
            filterBy={filterBy}
            data-testid='async-users'
            id='async-users'
            isLoading={isLoading}
            labelKey='name'
            placeholder={props.placeholder}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onFocus={handleOnFocus}
            options={options}
            selected={selected}
            iconPrepend={<Icon svg={<SearchIcon />} size='xl' fill='purple' />}
            multiple={props.multiple}
            renderMenu={(results, menuProps) => (
                <Menu {...menuProps}>
                    {showRecentlyAdded && !isEmpty(results) && (
                        <Menu.Header>
                            <span className='header'>Recently added:</span>
                        </Menu.Header>
                    )}
                    {results.map((result, index) => (
                        <MenuItem option={result} position={index}>
                            <span className='name' data-testid={`name-${index}`}>
                                {result.name}
                            </span>

                            {find(selected, { id: result.id }) && (
                                <span className='icon' data-testid={`icon-${index}`}>
                                    <Icon ml={1} size='xl' svg={<GreenTick />} />
                                </span>
                            )}
                        </MenuItem>
                    ))}
                </Menu>
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
    multiple: PropTypes.bool,
    placeholder: PropTypes.string,
};
AsyncTypeAheadUsers.defaultProps = {
    selectedUsers: [],
    showAuthor: false,
    getUsersInfo: false,
    multiple: true,
    placeholder: 'Recently added',
};

export default AsyncTypeAheadUsers;
