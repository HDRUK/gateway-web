import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Row, Col } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import _ from 'lodash';

class TypeaheadMultiField extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value || [{ name: '' }],
            options: [],
            readOnly: props.readOnly || false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) this.setState({ value: nextProps.value });
    }

    handleAddShareholder = () => {
        let value = this.state.value.concat([{ name: '' }]);
        this.setState({
            value: value,
        });
    };

    handleRemoveShareholder = idx => () => {
        let newValues = this.state.value.filter((s, sidx) => idx !== sidx);
        this.setState({ value: newValues }, this.props.onChange.bind(null, newValues));
    };

    handleChange(newValue = [], idx) {
        if (!_.isEmpty(newValue)) {
            const newValues = this.state.value.map((value, sidx) => {
                if (idx !== sidx) return value;
                return { ...value, name: newValue[0].name };
            });
            this.setState({ value: newValues }, this.props.onChange.bind(null, newValues));
        }
    }

    handleFocus(e) {
        this.props.onFocus();
    }
    handleBlur(e) {
        this.props.onBlur(this.props.value);
    }

    render() {
        return (
            <>
                {this.state.value.map((value, idx) => (
                    <Row className='mt-2'>
                        <Col sm={12} md={10}>
                            <Typeahead
                                id={`typeaheadDataset_${idx}`}
                                className={`addFormInputTypeAhead ${_.isEmpty(this.state.value) ? 'emptyFormInputTypeAhead' : ''}`}
                                options={this.state.options}
                                ref={typeahead => (this._typeahead = typeahead)}
                                onChange={e => this.handleChange(e, idx)}
                                selected={[this.state.value[idx]]}
                                filterBy={['name']}
                                disabled={this.state.readOnly}
                                labelKey={options => `${options.name}`}
                                renderMenuItemChildren={(option, props) => (
                                    <div>
                                        <div className='datasetName'>{option.name}</div>
                                        <div className='datasetDescription'>{option.description}</div>
                                    </div>
                                )}
                            />
                        </Col>

                        <Col sm={12} md={2}>
                            <button
                                type='button'
                                disabled={this.state.value.length < 2}
                                onClick={this.handleRemoveShareholder(idx)}
                                className='plusMinusButton'
                            >
                                -
                            </button>
                            <button
                                type='button'
                                disabled={this.state.value.length - 1 !== idx}
                                onClick={this.handleAddShareholder}
                                className='plusMinusButton'
                            >
                                +
                            </button>
                        </Col>
                    </Row>
                ))}
            </>
        );
    }
}

TypeaheadMultiField.defaultProps = {
    id: '',
    options: [],
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

export default TypeaheadMultiField;
