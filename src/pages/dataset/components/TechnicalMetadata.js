import React from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as TableSvg } from '../../../images/table.svg';
import { ReactComponent as ChevronRightSvg } from '../../../images/chevron-right.svg';
import '../Dataset.scss';

var baseURL = require('../../commonComponents/BaseURL').getURL();

class TechnicalMetadata extends React.Component {
	state = {
		technicalMetadata: null,
		index: null,
		onDetailsPage: false,
		isLoading: true,
	};

	constructor(props) {
		super(props);
		this.state.technicalMetadata = props.technicalMetadata;
		this.state.index = props.index;
		this.state.onDetailsPage = props.onDetailsPage;
	}

	componentDidMount() {}

	render() {
		const { technicalMetadata } = this.state;

		return (
			<div>
				<div>
					<Row className='entryBox heightDataClass alignCenter pad-bottom-24'>
						<Col sm={11} lg={11}>
							<Row>
								<TableSvg className='margin-top-2' />

								<span className='pad-left-8 black-18 pointer' onClick={() => this.props.doUpdateDataClassOpen(this.state.index)}>
									{technicalMetadata ? technicalMetadata.label : ''}
								</span>
							</Row>
							<Row className='mt-2'>
								<p className='gray800-14'>
									{technicalMetadata && technicalMetadata.description && technicalMetadata.description !== null
										? technicalMetadata.description.substr(0, 220) + (technicalMetadata.description.length > 220 ? '...' : '')
										: ''}
								</p>
							</Row>
						</Col>
						<Col sm={1} lg={1} className='alignSelfCenter'>
							<span onClick={() => this.props.doUpdateDataClassOpen(this.state.index)}>
								<ChevronRightSvg fill={'#475da7'} className='dataClassArrow pointer' />
							</span>
						</Col>
					</Row>
				</div>
			</div>
		);
	}
}

export default TechnicalMetadata;
