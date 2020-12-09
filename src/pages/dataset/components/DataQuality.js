import React from 'react';
import { Col, Row } from 'react-bootstrap';
import '../Dataset.scss';
import DataQualityInfo from './DataQualityInfo';
import _ from 'lodash';

class DataQuality extends React.Component {
	state = {
		datasetUtility: null,
		allOpen: false,
		displayOption: '',
		documentationWeight: '',
		technicalQualityWeight: '',
		accessProvisionWeight: '',
		valueInterestWeight: '',
		coverageWeight: '',
	};

	constructor(props) {
		super(props);
		this.state.datasetUtility = props.datasetUtility || {};
	}

	async componentWillMount() {
		if (!_.isEmpty(this.props.datasetUtility)) await this.displaySections(this.props.datasetUtility);
	}

	async displaySections(datasetUtility = {}) {
		if (
			datasetUtility.metadata_richness &&
			datasetUtility.metadata_richness.trim() === 'Not Rated' &&
			!datasetUtility.availability_of_additional_documentation_and_support &&
			!datasetUtility.data_model &&
			!datasetUtility.data_dictionary &&
			!datasetUtility.provenance &&
			!datasetUtility.data_quality_management_process &&
			!datasetUtility.dama_quality_dimensions &&
			!datasetUtility.allowable_uses &&
			!datasetUtility.research_environment &&
			!datasetUtility.time_lag &&
			!datasetUtility.timeliness &&
			!datasetUtility.linkages &&
			!datasetUtility.data_enrichments &&
			!datasetUtility.pathway_coverage &&
			!datasetUtility.length_of_follow_up
		) {
			this.setState({ displayOption: 'none' });
		} else if (
			datasetUtility.metadata_richness &&
			datasetUtility.metadata_richness.trim() !== 'Not Rated' &&
			!datasetUtility.availability_of_additional_documentation_and_support &&
			!datasetUtility.data_model &&
			!datasetUtility.data_dictionary &&
			!datasetUtility.provenance &&
			!datasetUtility.data_quality_management_process &&
			!datasetUtility.dama_quality_dimensions &&
			!datasetUtility.allowable_uses &&
			!datasetUtility.research_environment &&
			!datasetUtility.time_lag &&
			!datasetUtility.timeliness &&
			!datasetUtility.linkages &&
			!datasetUtility.data_enrichments &&
			!datasetUtility.pathway_coverage &&
			!datasetUtility.length_of_follow_up
		) {
			this.setState({ displayOption: 'metadata richness' });
		} else {
			this.setState({ displayOption: 'all' });
		}

		await this.getWeights(this.props.datasetUtility);
	}

	async getWeights(datasetUtility = {}) {
		if (!_.isEmpty(datasetUtility)) {
			let weights = ['', 'Bronze', 'Silver', 'Gold', 'Platinum'];

			let documentationWeight =
				weights[
					Math.floor(
						(weights.indexOf(datasetUtility.metadata_richness.trim()) +
							weights.indexOf(datasetUtility.availability_of_additional_documentation_and_support.trim()) +
							weights.indexOf(datasetUtility.data_model.trim()) +
							weights.indexOf(datasetUtility.data_dictionary.trim()) +
							weights.indexOf(datasetUtility.provenance.trim())) /
							5
					)
				];

			let technicalQualityWeight =
				weights[
					Math.floor(
						(weights.indexOf(datasetUtility.data_quality_management_process.trim()) +
							weights.indexOf(datasetUtility.dama_quality_dimensions.trim())) /
							2
					)
				];

			let accessProvisionWeight =
				weights[
					Math.floor(
						(weights.indexOf(datasetUtility.allowable_uses.trim()) +
							weights.indexOf(datasetUtility.time_lag.trim()) +
							weights.indexOf(datasetUtility.timeliness.trim())) /
							3
					)
				];

			let valueInterestWeight =
				weights[
					Math.floor((weights.indexOf(datasetUtility.linkages.trim()) + weights.indexOf(datasetUtility.data_enrichments.trim())) / 2)
				];

			let coverageWeight =
				weights[
					Math.floor(
						(weights.indexOf(datasetUtility.pathway_coverage.trim()) + weights.indexOf(datasetUtility.length_of_follow_up.trim())) / 2
					)
				];

			this.setState({
				documentationWeight: documentationWeight,
				technicalQualityWeight: technicalQualityWeight,
				accessProvisionWeight: accessProvisionWeight,
				valueInterestWeight: valueInterestWeight,
				coverageWeight: coverageWeight,
			});
		}
	}

	renderDataQualityInfo(displayOption) {
		switch (displayOption) {
			case 'metadata richness':
				return (
					<div className='metaRichRectangle'>
						<div className='ml-3'>
							<Row>
								<Col sm={12} lg={12} className='pad-left-0'>
									<DataQualityInfo
										section={'Documentation'}
										open={this.state.allOpen}
										datasetUtility={this.state.datasetUtility}
										documentationWeight={this.state.documentationWeight}
									/>
								</Col>
							</Row>
						</div>
					</div>
				);
			case 'all':
				return (
					<div className='rectangle'>
						<div className='ml-3'>
							<Row>
								<Col sm={12} lg={12} className='pad-left-0'>
									{displayOption === 'all' ? (
										<Row className='mt-3'>
											<Col sm={12} lg={12}>
												<Row className='ml-2'>
													<Col sm={12} lg={12} className='pad-left-0'>
														<span className='purple-14 dataFloatRight pointer' onClick={() => this.updateAllOpen(this.state.allOpen)}>
															{this.state.allOpen ? 'Hide all' : 'Expand all'}
														</span>
													</Col>
												</Row>
											</Col>
										</Row>
									) : (
										''
									)}

									<DataQualityInfo
										section={'Documentation'}
										open={this.state.allOpen}
										datasetUtility={this.state.datasetUtility}
										documentationWeight={this.state.documentationWeight}
									/>
									<DataQualityInfo
										section={'TechQuality'}
										open={this.state.allOpen}
										datasetUtility={this.state.datasetUtility}
										technicalQualityWeight={this.state.technicalQualityWeight}
									/>
									<DataQualityInfo
										section={'Access'}
										open={this.state.allOpen}
										datasetUtility={this.state.datasetUtility}
										accessProvisionWeight={this.state.accessProvisionWeight}
									/>
									<DataQualityInfo
										section={'Value'}
										open={this.state.allOpen}
										datasetUtility={this.state.datasetUtility}
										valueInterestWeight={this.state.valueInterestWeight}
									/>
									<DataQualityInfo
										section={'Coverage'}
										open={this.state.allOpen}
										datasetUtility={this.state.datasetUtility}
										coverageWeight={this.state.coverageWeight}
									/>

									<div className='height-16' />
								</Col>
							</Row>
						</div>
					</div>
				);
			default:
				return (
					<div className='notRatedRectangle' id='notYetRatedRow'>
						<span className='badge-notRated'>
							<span>Not yet rated</span>
						</span>
					</div>
				);
		}
	}

	updateAllOpen = allOpen => {
		if (allOpen === false) {
			this.setState({ allOpen: true });
		} else if (allOpen === true) {
			this.setState({ allOpen: false });
		}
	};

	render() {
		const { displayOption } = this.state;

		return <>{this.renderDataQualityInfo(displayOption)}</>;
	}
}

export default DataQuality;
