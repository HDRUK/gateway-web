import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class TypaheadCustom extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			readOnly: props.readOnly || false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleChange(e) {
		this.setState(this.props.onChange.bind(null, e));
	}

	handleFocus(e) {
		this.props.onFocus();
	}

	handleBlur(e) {
		this.props.onBlur(this.props.value);
	}

	render() {
		return (
			<Typeahead
				id={'test'}
				className={'addFormInputTypeAhead'}
				multiple
				disabled={this.state.readOnly}
				options={this.props.options ? this.props.options : ['Test', 'Test1']}
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				selected={this.props.value}
			/>
		);
	}
}

TypaheadCustom.defaultProps = {
	id: '',
	options: [],
	onChange: () => {},
	onFocus: () => {},
	onBlur: () => {},
};

export default TypaheadCustom;
