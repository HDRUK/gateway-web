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
			publisher: null,
			typeaheadClass: `addFormInputTypeAhead ${!_.isEmpty(props.typeaheadClass) ? props.typeaheadClass : ''}`,
		};
	}

	componentDidMount() {
		this.getData();
	}

	componentDidUpdate(prevProps) {
		const { selectedDatasets } = this.props;
		if (selectedDatasets !== prevProps.selectedDatasets) {
			if (selectedDatasets.length < 2) {
				this.getData();
			}
			this.setState({
				value: selectedDatasets,
			});
		}

		if (this.props.typeaheadClass !== prevProps.typeaheadClass) {
			let typeaheadClass = this.props.typeaheadClass;
			this.setState({ typeaheadClass: `addFormInputTypeAhead ${typeaheadClass}` });
		}
	}

	getData() {
		const { selectedDatasets, allowAllCustodians, only5Safes } = this.props;
		let { publisher } = this.state;

		if (selectedDatasets && selectedDatasets.length > 0) {
			({ publisher } = selectedDatasets[0]);
		} else if (allowAllCustodians) {
			publisher = null;
		}

		this.setState(
			{
				publisher,
			},
			() => {
				axios
					.get(`${baseURL}/api/v2/datasets`, {
						params: {
							activeflag: 'active',
							fields: 'datasetid,name,description,datasetfields.abstract,_id,datasetfields.publisher,datasetfields.contactPoint',
							populate: 'publisher',
							sort: 'datasetfields.publisher, name',
							...(only5Safes ? { is5Safes: true } : {}),
							...(publisher ? { ['datasetfields.publisher']: publisher } : {}),
						},
					})
					.then(res => {
						const {
							data: { datasets = [] },
						} = res;
						const formattedDatasets = datasets.map(dataset => {
							let {
								_id,
								datasetid: datasetId,
								name,
								description,
								publisher: publisherObj,
								datasetfields: { abstract, publisher, contactPoint },
							} = dataset;
							return {
								_id,
								datasetId,
								name,
								description,
								abstract,
								publisher,
								publisherObj,
								contactPoint,
							};
						});
						let value = [...this.state.value];
						this.setState({ options: formattedDatasets, value });
					})
					.catch(err => {
						console.error(err);
						alert('Failed to fetch publisher datasets');
					});
			}
		);
	}

	handleChange(e) {
		this.props.onHandleDataSetChange(e);
		this.setState({
			value: e,
		});
	}

	datasetOption(item) {
		const { publisher = 'No publisher set', description, abstract, name: optionName = 'No dataset name' } = item;
		const optionDescription = this.props.allowAllCustodians === true ? publisher : description || abstract || 'No description set';

		return (
			<div>
				<div className='optionName'>{optionName}</div>
				<div className='optionDescription'>{optionDescription}</div>
			</div>
		);
	}

	filterByCallback = (option, props) =>
		option.publisher.toLowerCase().indexOf(props.text.toLowerCase()) !== -1 ||
		option.name.toLowerCase().indexOf(props.text.toLowerCase()) !== -1;

	render() {
		let selectedValues = [];
		this.state.value.map(selectedValue => {
			return selectedValues.push(_.toString(selectedValue._id));
		});

		let filteredOptions = this.state.options.filter(datasetOption => !selectedValues.includes(datasetOption._id));

		return (
			<Typeahead
				multiple
				id={'typeaheadDataset'}
				className={this.state.typeaheadClass}
				options={filteredOptions}
				ref={typeahead => (this._typeahead = typeahead)}
				onChange={e => {
					this.handleChange(e);
				}}
				minLength={this.state.publisher === null ? 2 : 0}
				selected={this.state.value}
				filterBy={this.filterByCallback}
				disabled={this.state.readOnly}
				defaultSelected={this.state.value}
				labelKey={options => `${options.name}`}
				renderMenuItemChildren={option => this.datasetOption(option)}
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
