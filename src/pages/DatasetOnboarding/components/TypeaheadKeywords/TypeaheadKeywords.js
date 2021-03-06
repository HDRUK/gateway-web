import React from 'react';
import { isString, isEmpty } from 'lodash';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { baseURL } from '../../../../configs/url.config';

class TypeaheadKeywords extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.value,
			options: [],
			id: props.id,
			readOnly: props.readOnly || false,
			className: `addFormInputTypeAhead ${!isEmpty(props.className) ? props.className : ''}`,
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
			.get(baseURL + '/api/v2/filters/dataset?fields=keys.features')
			.then(res => {
				let keywordOptions = res.data.data.keys.features;
				this.setState({
					options: keywordOptions,
				});
			})
			.catch(err => {
				alert('Failed to fetch keywords');
			});
	}

	handleChange(e) {
		let updatedKeywords = [];
		e.forEach(keyword => {
			if (!isString(keyword)) updatedKeywords.push(keyword.label);
			else updatedKeywords.push(keyword);
		});

		this.setState(
			{
				value: updatedKeywords,
			},
			this.props.onChange.bind(null, updatedKeywords)
		);
	}

	render() {
		return (
			<Typeahead
				className={this.state.className}
				options={this.state.options}
				onChange={this.handleChange}
				selected={this.state.value}
				minLength={3}
				multiple
				allowNew
				disabled={this.state.readOnly}
				defaultSelected={this.state.value}
				labelKey={options => `${options}`}
				renderMenuItemChildren={(option, props) => (
					<div className='userOption'>
						<div>{option}</div>
					</div>
				)}
			/>
		);
	}
}

TypeaheadKeywords.defaultProps = {
	id: '',
	options: [],
	onChange: () => {},
	onFocus: () => {},
	onBlur: () => {},
};

export default TypeaheadKeywords;
