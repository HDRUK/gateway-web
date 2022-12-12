import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class TypeaheadCustomKeyValue extends React.Component {
    constructor(props) {
        super(props);

        var listOfSelectedOptions = [];

        if (this.props.value) {
            this.props.value.forEach(selected => {
                this.props.options.forEach(option => {
                    if (option.key === selected) {
                        listOfSelectedOptions.push({ key: option.key, value: option.value });
                    }
                });
            });
        }

        this.state = {
            //value: this.props.value || '',
            readOnly: props.readOnly || false,
            listOfSelectedOptions,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(e) {
        let listOfKeys = [];
        e.forEach(entry => listOfKeys.push(entry.key));

        this.setState(
            {
                listOfSelectedOptions: e,
            },
            this.props.onChange.bind(null, listOfKeys)
        );
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
                id='key'
                labelKey={key => `${key.value}`}
                className={'addFormInputTypeAhead'}
                //minLength={3}
                multiple
                disabled={this.state.readOnly}
                options={this.props.options ? this.props.options : ['Test', 'Test1']}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                selected={this.state.listOfSelectedOptions}
            />
        );
    }
}

TypeaheadCustomKeyValue.defaultProps = {
    id: '',
    options: [],
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

export default TypeaheadCustomKeyValue;
