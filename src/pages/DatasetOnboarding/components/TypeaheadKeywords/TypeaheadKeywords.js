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
            .get(baseURL + '/api/v1/search/filter/feature/dataset')
            .then(res => {
                this.setState({
                    options: res.data.data[0].sort(function (a, b) {
                        return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
                    }),
                });
            })
            .catch(err => {
                alert('Failed to fetch users');
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
