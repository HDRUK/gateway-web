import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import _ from 'lodash';
import { baseURL } from '../../../../configs/url.config';

class TypeaheadDataset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.selectedDatasets,
            options: [],
            readOnly: props.readOnly || false,
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedDatasets !== prevProps.selectedDatasets) {
            let value = this.props.selectedDatasets;
            this.setState({
                value: value,
            });
        }
    }

    getData() {
        // if(this.props.selectedDatasets) {
        const { publisher } = this.props.selectedDatasets[0];
        axios
            .get(`${baseURL}/api/v1/publishers/${publisher}/datasets`)
            .then(res => {
                const {
                    data: { datasets },
                } = res;
                let value = [...this.state.value];
                this.setState({ options: [...datasets], value });
            })
            .catch(err => {
                alert('Failed to fetch publisher datasets');
            });
        // }
    }

    handleChange(e) {
        this.props.onHandleDataSetChange(e);
        this.setState({
            value: e,
        });
    }

    render() {
        return (
            <Typeahead
                id={'typeaheadDataset'}
                className={`addFormInputTypeAhead ${_.isEmpty(this.state.value) ? 'emptyFormInputTypeAhead' : ''}`}
                options={this.state.options}
                ref={typeahead => (this._typeahead = typeahead)}
                onChange={e => {
                    this.handleChange(e);
                }}
                selected={this.state.value}
                filterBy={['name']}
                multiple
                disabled={this.state.readOnly}
                defaultSelected={this.state.value}
                labelKey={options => `${options.name}`}
                renderMenuItemChildren={(option, props) => (
                    <div>
                        <div className='datasetName'>{option.name}</div>
                        <div className='datasetDescription'>{option.description || option.datasetfields.abstract}</div>
                    </div>
                )}
            />
        );
    }
}

TypeaheadDataset.defaultProps = {
    id: '',
    options: [],
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
};

export default TypeaheadDataset;
