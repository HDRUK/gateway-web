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
                const userId = _.isEmpty(this.props.team) ? user.id : user.userId;
                return this.props.selectedContributors.includes(userId);
            });
            this.setState({ value });
        }
        if (this.props.typeaheadClass !== prevProps.typeaheadClass) {
            const { typeaheadClass } = this.props;
            this.setState({ typeaheadClass: `addFormInputTypeAhead ${typeaheadClass}` });
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
            const userIds = selected.map(u => u.userId);
            this.props.onHandleContributorChange(userIds);
        }
    }

    getData() {
        axios
            .get(`${baseURL}/api/v3/teams/${this.state.team}/members`)
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
                    return this.props.selectedContributors.includes(user.userId);
                });
                this.setState({ options: membersLists, value });
            })
            .catch(err => {
                console.error(err.message);
                alert('Failed to fetch users');
            });
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
                                <span>{option.bio || 'Organisation not set'}</span> <span>{option.orcid || 'No ORCID'}</span>
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
