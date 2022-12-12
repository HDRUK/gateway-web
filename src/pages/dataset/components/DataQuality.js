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

    async getWeights(
        datasetUtility = {
            metadata_richness: '',
            availability_of_additional_documentation_and_support: '',
            data_model: '',
            data_dictionary: '',
            provenance: '',
            data_quality_management: '',
            _process: '',
            dama_quality_dim: '',
            ensions: '',
            allowable_uses: '',
            time_lag: '',
            timeliness: '',
            linkages: '',
            pathway_coverage: '',
        }
    ) {
        if (!_.isEmpty(datasetUtility)) {
            let weights = ['', 'Bronze', 'Silver', 'Gold', 'Platinum'];

            let documentationWeight =
                weights[
                    Math.floor(
                        (this.getSubSectionWeights(datasetUtility.metadata_richness) +
                            this.getSubSectionWeights(datasetUtility.availability_of_additional_documentation_and_support) +
                            this.getSubSectionWeights(datasetUtility.data_model) +
                            this.getSubSectionWeights(datasetUtility.data_dictionary) +
                            this.getSubSectionWeights(datasetUtility.provenance)) /
                            5
                    )
                ];

            let technicalQualityWeight =
                weights[
                    Math.floor(
                        (this.getSubSectionWeights(datasetUtility.data_quality_management_process) +
                            this.getSubSectionWeights(datasetUtility.dama_quality_dimensions)) /
                            2
                    )
                ];

            let accessProvisionWeight =
                weights[
                    Math.floor(
                        (this.getSubSectionWeights(datasetUtility.allowable_uses) +
                            this.getSubSectionWeights(datasetUtility.time_lag) +
                            this.getSubSectionWeights(datasetUtility.timeliness)) /
                            3
                    )
                ];

            let valueInterestWeight =
                weights[
                    Math.floor(
                        (this.getSubSectionWeights(datasetUtility.linkages) + this.getSubSectionWeights(datasetUtility.data_enrichments)) /
                            2
                    )
                ];

            let coverageWeight =
                weights[
                    Math.floor(
                        (this.getSubSectionWeights(datasetUtility.pathway_coverage) +
                            this.getSubSectionWeights(datasetUtility.length_of_follow_up)) /
                            2
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

    getSubSectionWeights(rating) {
        let subSectionWeights = new Map([
            ['Other', 0],
            ['Other (please specify)', 0],
            ['Not Rated', 0],
            ['Not yet Bronze', 0.5],
            ['Bronze', 1],
            ['Silver', 2],
            ['Gold', 3],
            ['Platinum', 4],
        ]);

        let subSectionWeight = subSectionWeights.get(rating.trim());

        if (_.isUndefined(subSectionWeight)) {
            subSectionWeight = 0;
        }

        return subSectionWeight;
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
                                        data-testid='documentationWeightOnly'
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
                                                        <span
                                                            className='purple-14 dataFloatRight pointer'
                                                            onClick={() => this.updateAllOpen(this.state.allOpen)}
                                                        >
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
                                        data-testid='documentationWeight'
                                    />
                                    <DataQualityInfo
                                        section={'TechQuality'}
                                        open={this.state.allOpen}
                                        datasetUtility={this.state.datasetUtility}
                                        technicalQualityWeight={this.state.technicalQualityWeight}
                                        data-testid='technicalQualityWeight'
                                    />
                                    <DataQualityInfo
                                        section={'Access'}
                                        open={this.state.allOpen}
                                        datasetUtility={this.state.datasetUtility}
                                        accessProvisionWeight={this.state.accessProvisionWeight}
                                        data-testid='accessProvisionWeight'
                                    />
                                    <DataQualityInfo
                                        section={'Value'}
                                        open={this.state.allOpen}
                                        datasetUtility={this.state.datasetUtility}
                                        valueInterestWeight={this.state.valueInterestWeight}
                                        data-testid='valueInterestWeight'
                                    />
                                    <DataQualityInfo
                                        section={'Coverage'}
                                        open={this.state.allOpen}
                                        datasetUtility={this.state.datasetUtility}
                                        coverageWeight={this.state.coverageWeight}
                                        data-testid='coverageWeight'
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
                        <span className='badge-notRated' data-testid='notRated'>
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
