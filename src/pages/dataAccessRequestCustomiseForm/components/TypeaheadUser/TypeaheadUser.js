import React from 'react';
import _ from 'lodash';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { baseURL } from '../../../../configs/url.config';

class TypaheadUser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: [],
			options: [],
			readOnly: props.readOnly || false,
			className: `addFormInputTypeAhead ${!_.isEmpty(props.className) ? props.className : ''}`,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		this.getData();
	}

	componentDidUpdate(prevProps) {
		if (this.props.className !== prevProps.className) {
			let classes = `${prevProps.className} ${this.props.className}`;
			this.setState({ className: classes });
		}
	}

	getData() {
		axios
			.get(`${baseURL}/api/v1/users`)
			.then(res => {
				let id;
				let value = [];
				let {
					data: { data },
				} = res;
				if (typeof this.props.value !== 'undefined') {
					({ id } = this.props.value);
					value = [...data].filter(d => d.id === id);
				}
				this.setState({ options: data, value });
			})
			.catch(err => {
				alert('Failed to fetch users');
			});
	}

	handleChange(e) {
		let user = '';
		if (e.length > 0) [user] = e;

		this.setState(
			{
				value: user ? [user] : [],
			},
			this.props.onChange.bind(null, user)
		);
	}

	render() {
		return (
			<Typeahead
				id={'test'}
				className={this.state.className}
				options={this.state.options}
				onChange={this.handleChange}
				selected={this.state.value}
				minLength={3}
				filterBy={['name']}
				multiple
				disabled={this.state.readOnly}
				defaultSelected={this.state.value}
				labelKey={options => `${options.name}`}
				renderMenuItemChildren={(option, props) => (
					<div className='userOption'>
						<div>{option.name}</div>
						<div>
							<span>{option.bio || 'Organisation not set'}</span> <span>{option.orcid || 'No ORCID'}</span>
						</div>
					</div>
				)}
			/>
		);
	}
}

TypaheadUser.defaultProps = {
	id: '',
	options: [],
	onChange: () => {},
	onFocus: () => {},
	onBlur: () => {},
};

export default TypaheadUser;
