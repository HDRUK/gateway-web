import React from 'react';
import { Col, Row } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';

import { ReactComponent as TableSvg } from '../../../images/table.svg';
import TechnicalMetadataVariables from './TechnicalMetadataVariables';
import '../Dataset.scss';

class TechnicalDetailsPage extends React.Component {
	state = {
		technicalMetadata: null,
		flagClosed: true,
		customType: false,
		allOpen: false,
	};

	constructor(props) {
		super(props);
		this.state.technicalMetadata = props.technicalMetadata;
	}

	updateAllOpen = allOpen => {
		if (allOpen === false) {
			this.setState({ allOpen: true });
		} else if (allOpen === true) {
			this.setState({ allOpen: false });
		}
	};

	render() {
		const { flagClosed, customType, technicalMetadata, allOpen } = this.state;

		var svgClassName = '';
		if (flagClosed === false) {
			svgClassName = 'flipSVG';
		}

		return (
			<div className='ml-3'>
				<Row>
					<Col sm={12} lg={12} className='pad-left-0'>
						<div className='entryBox noPadding'>
							<Row className='mt-3'>
								<Col sm={12} lg={12}>
									<div className='variableBox pad-bottom-16'>
										<Row className='pad-left-24'>
											<Col sm={9} lg={11}>
												<Row>
													<TableSvg className='margin-top-2' />
													<span className='pad-left-8 black-18'>{technicalMetadata ? technicalMetadata.label : ''}</span>
												</Row>
											</Col>

											<Col sm={3} lg={1} className='closeDataClass'>
												<span className='floatRight pointer' onClick={() => this.props.doUpdateDataClassOpen(-1)}>
													<CloseButtonSvg width='19px' height='19px' fill='#475DA7' />
												</span>
											</Col>
										</Row>
										<Row className='mt-2 pad-left-24'>
											<Col sm={11} lg={11} className='pad-left-0'>
												<p className='gray800-14'>{technicalMetadata ? technicalMetadata.description : ''}</p>
											</Col>
											<Col sm={1} lg={1} />
										</Row>

										<Row className='ml-2'>
											<Col sm={12} lg={12} className='pad-left-0'>
												<span className='pad-top-24 pad-bottom-16  black-16-semibold mr-3'>Variables</span>

												<span className='purple-14 floatRight pointer' onClick={() => this.updateAllOpen(allOpen)}>
													{allOpen ? 'Close all' : 'Expand all'}
												</span>
											</Col>
										</Row>
									</div>
								</Col>
							</Row>

							{technicalMetadata.elements.map(element => (
								<TechnicalMetadataVariables techMetadataVariables={element} open={allOpen} />
							))}
							<div className='height-16' />
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default TechnicalDetailsPage;
