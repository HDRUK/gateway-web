import { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import _ from 'lodash';
import { baseURL } from '../../../../configs/url.config';

class TypaheadMultiUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.selectedContributors || [],
            options: [],
            id: props.id || '',
            apiCall: props.apiCall || 'users',
            team: props.team || '',
            typeaheadId: props.typeaheadId || 'typeaheadMultiUser',
            typeaheadName: props.typeaheadName || 'typeaheadMultiUser',
            typeaheadClass: `addFormInputTypeAhead ${!_.isEmpty(props.typeaheadClass) ? props.typeaheadClass : ''}`,
            readOnly: props.readOnly || false,
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        const { options } = { ...this.state };

        if (this.props.selectedContributors !== prevProps.selectedContributors) {
            const value = [...options].filter(user => {
                const userId = _.isEmpty(this.props.team) ? user.id : user._id;
                return this.props.selectedContributors.includes(userId);
            });
            this.setState({ value });
        }

        if (this.props.typeaheadClass !== prevProps.typeaheadClass) {
            const { typeaheadClass } = this.props;
            this.setState({ typeaheadClass: `addFormInputTypeAhead ${typeaheadClass}` });
        }
    }

    getData() {
        switch (this.state.apiCall) {
            case 'users':
                axios
                    .get(`${baseURL}/api/v1/users`)
                    .then(res => {
                        let {
                            data: { data },
                        } = res;
                        if (!_.isEmpty(this.props.currentUserId.toString())) {
                            data = data.filter(user => {
                                return user.id !== this.props.currentUserId;
                            });
                        }
                        const value = [...data].filter(user => {
                            return this.props.selectedContributors.includes(user.id);
                        });

                        this.setState({ options: data, value });
                    })
                    .catch(err => {
                        console.error(err);
                        alert('Failed to fetch users');
                    });
                break;
            case 'teams':
                axios
                    .get(`${baseURL}/api/v1/teams/${this.state.team}/members`)
                    .then(res => {
                        const {
                            data: { members },
                        } = res;
                        // map out new array and include name key for typeahead
                        const membersLists = members.map(member => {
                            return {
                                ...member,
                                name: `${member.firstname} ${member.lastname}`,
                            };
                        });
                        // find _.id in membersList arr
                        const value = [...membersLists].filter(user => {
                            return this.props.selectedContributors.includes(user._id);
                        });
                        this.setState({ options: membersLists, value });
                    })
                    .catch(err => {
                        console.error(err);
                        alert('Failed to fetch users');
                    });
                break;
        }
    }

    handleChange(e) {
        let value;
        const selected = [...e];
        const { options } = this.state;

        if (_.isEmpty(this.state.team)) {
            this.props.onHandleContributorChange(selected);
            value = [...options].filter(user => {
                return e.some(contributor => contributor.id === user.id);
            });
            this.setState({ value });
        } else {
            const userIds = selected.map(u => u._id);
            this.props.onHandleContributorChange(userIds);
        }
    }

    render() {
        return (
            <Typeahead
                id={this.state.typeaheadId}
                name={this.state.typeaheadName}
                className={this.state.typeaheadClass}
                labelKey={options => `${options.name}`}
                options={this.state.options}
                onChange={e => this.handleChange(e)}
                selected={this.state.value}
                disabled={this.state.readOnly}
                minLength={3}
                inputProps={{ required: !_.isEmpty(this.props.typeaheadClass) }}
                filterBy={['name']}
                multiple
                renderMenuItemChildren={(option, props) => (
                    <div className='userOption'>
                        <div>{option.name ? option.name : `${option.firstname} ${option.lastname}`}</div>
                        {_.isEmpty(this.state.team) ? (
                            <div>
                                <span>{option.bio || 'Institution not set'}</span> <span>{option.orcid || 'No ORCID'}</span>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                )}
            />
        );
    }
}

TypaheadMultiUser.defaultProps = {
    id: '',
    options: [],
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

export default TypaheadMultiUser;