import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import { JsonLd } from 'react-schemaorg';

export default class DatasetSchema extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<MetaTags>
				<JsonLd item={this.props.datasetSchema} />
			</MetaTags>
		);
	}
}
