import React from 'react';
import { Col, Row, Collapse } from 'react-bootstrap';
import _ from 'lodash';
import SVGIcon from '../../../images/SVGIcon';
import '../Dataset.scss';
import { ReactComponent as SubUnfilledSVG } from '../../../images/sub_unfilled.svg';
import { ReactComponent as SubBronzeSVG } from '../../../images/sub_bronze.svg';
import { ReactComponent as SubSilverSVG } from '../../../images/sub_silver.svg';
import { ReactComponent as SubGoldSVG } from '../../../images/sub_gold.svg';
import { ReactComponent as SubPlatinumSVG } from '../../../images/sub_platinum.svg';
import { ReactComponent as UnfilledSVG } from '../../../images/unfilledUtility.svg';
import { ReactComponent as BronzeSVG } from '../../../images/bronzeUtility.svg';
import { ReactComponent as SilverSVG } from '../../../images/silverUtility.svg';
import { ReactComponent as GoldSVG } from '../../../images/goldUtility.svg';
import { ReactComponent as PlatinumSVG } from '../../../images/platinumUtility.svg';

class DataQualityInfo extends React.Component {
    state = {
        open: false,
        flagClosed: true,
        section: '',
        datasetUtility: {},
        documentationWeight: null,
        technicalQualityWeight: null,
        accessProvisionWeight: null,
        valueInterestWeight: null,
        coverageWeight: null,
        metadataRichnessOnly: true,
        documentSection: true,
        techQualitySection: true,
        accessProvisionSection: true,
        valueInterestSection: true,
        coverageSection: true,

        ratings: [
            {
                dimension: 'Additional documentation and support',
                rating: 'Bronze',
                response: 'Past journal articles demonstrate that knowledge of the data exists',
            },
            {
                dimension: 'Additional documentation and support',
                rating: 'Silver',
                response: 'Comprehensive ReadMe, Dataset FAQS & Visual data model provided',
            },
            {
                dimension: 'Additional documentation and support',
                rating: 'Gold',
                response: 'Supporting journal article explaining the dataset detail, or dataset training materials',
            },
            {
                dimension: 'Additional documentation and support',
                rating: 'Platinum',
                response: 'As Gold, plus support personnel available to answer questions',
            },
            {
                dimension: 'Data Model',
                rating: 'Bronze',
                response: 'Known and accepted data model but some key field un-coded or free text',
            },
            {
                dimension: 'Data Model',
                rating: 'Silver',
                response: 'Key fields codified using a local standard',
            },
            {
                dimension: 'Data Model',
                rating: 'Gold',
                response: 'Key fields codified using a national or international standard',
            },
            {
                dimension: 'Data Model',
                rating: 'Platinum',
                response: 'Model and key fields conform to a national/international standard',
            },
            {
                dimension: 'Data Dictionary',
                rating: 'Bronze',
                response: 'Data definitions available',
            },
            {
                dimension: 'Data Dictionary',
                rating: 'Silver',
                response: 'Definitions compiled into local data dictionary which is available online',
            },
            {
                dimension: 'Data Dictionary',
                rating: 'Gold',
                response: 'Dictionary relates to national definitions',
            },
            {
                dimension: 'Data Dictionary',
                rating: 'Platinum',
                response: 'Based on international standards, including mapping',
            },
            {
                dimension: 'Provenance',
                rating: 'Bronze',
                response: 'Source of the dataset is documented',
            },
            {
                dimension: 'Provenance',
                rating: 'Silver',
                response: 'Source of  the dataset and any transformations, rules and exclusions documented',
            },
            {
                dimension: 'Provenance',
                rating: 'Gold',
                response: 'All original data items, transformations, rules & exclusion listed and their impact',
            },
            {
                dimension: 'Provenance',
                rating: 'Platinum',
                response:
                    'Ability to view earlier versions, including versions before any transformations have been applied data (in line with deidentification and IG approval) and review the impact of each stage of data cleaning',
            },
            {
                dimension: 'Data Quality Management Process',
                rating: 'Bronze',
                response: 'Documented data management plan covering collection, auditing & management',
            },
            {
                dimension: 'Data Quality Management Process',
                rating: 'Silver',
                response: 'Available implemented data management plan',
            },
            {
                dimension: 'Data Quality Management Process',
                rating: 'Gold',
                response: '',
            },
            {
                dimension: 'Data Quality Management Process',
                rating: 'Platinum',
                response: 'Externally verified compliance with the data management plan, e.g. ISO, CQC, ICO…',
            },
            {
                dimension: 'Pathway coverage',
                rating: 'Bronze',
                response: 'Contains data from a single speciality or area',
            },
            {
                dimension: 'Pathway coverage',
                rating: 'Silver',
                response: 'Contains data from multiple specialties or services within a single tier of care',
            },
            {
                dimension: 'Pathway coverage',
                rating: 'Gold',
                response: 'Contains multimodal data or data that is linked across two tiers',
            },
            {
                dimension: 'Pathway coverage',
                rating: 'Platinum',
                response: 'Contains data across more than two tiers',
            },
            {
                dimension: 'Length of follow up',
                rating: 'Bronze',
                response: 'Between 1 - 6 months',
            },
            {
                dimension: 'Length of follow up',
                rating: 'Silver',
                response: 'Between 6 - 12 months',
            },
            {
                dimension: 'Length of follow up',
                rating: 'Gold',
                response: 'Between 1 - 10 years',
            },
            {
                dimension: 'Length of follow up',
                rating: 'Platinum',
                response: 'More than 10 years',
            },
            {
                dimension: 'Allowable uses',
                rating: 'Bronze',
                response: '',
            },
            {
                dimension: 'Allowable uses',
                rating: 'Silver',
                response: 'Non-consented, aggregate data for specific academic uses (following IG approval)',
            },
            {
                dimension: 'Allowable uses',
                rating: 'Gold',
                response: 'Aggregate data, for academic and specific commercial uses (following IG approval)',
            },
            {
                dimension: 'Allowable uses',
                rating: 'Platinum',
                response: 'Fully consented for commercial uses (following IG approval)',
            },
            {
                dimension: 'Time Lag',
                rating: 'Bronze',
                response: 'Approximately 1 year',
            },
            {
                dimension: 'Time Lag',
                rating: 'Silver',
                response: 'Approximately 1 month',
            },
            {
                dimension: 'Time Lag',
                rating: 'Gold',
                response: 'Approximately 1 week',
            },
            {
                dimension: 'Time Lag',
                rating: 'Platinum',
                response: 'Effectively real-time data',
            },
            {
                dimension: 'Timeliness',
                rating: 'Bronze',
                response: 'Less than 6 months',
            },
            {
                dimension: 'Timeliness',
                rating: 'Silver',
                response: 'Less than 3 months',
            },
            {
                dimension: 'Timeliness',
                rating: 'Gold',
                response: 'Less than 1 month',
            },
            {
                dimension: 'Timeliness',
                rating: 'Platinum',
                response: 'Less than 2 weeks',
            },
            {
                dimension: 'Linkages',
                rating: 'Bronze',
                response: 'Identifiers to demonstrate ability to link to other datasets',
            },
            {
                dimension: 'Linkages',
                rating: 'Silver',
                response: 'Available linkages outlined &/or list of datasets previously successfully linked',
            },
            {
                dimension: 'Linkages',
                rating: 'Gold',
                response: 'List of linkage restrictions and previously successful linkages, with navigable links',
            },
            {
                dimension: 'Linkages',
                rating: 'Platinum',
                response: 'Existing linkage with reusable or downstream approvals',
            },
            {
                dimension: 'Data Enrichments',
                rating: 'Bronze',
                response: 'The data include additional derived fields, or enriched data.',
            },
            {
                dimension: 'Data Enrichments',
                rating: 'Silver',
                response: 'Data includes additional derived fields, or enriched data used by other data sources.',
            },
            {
                dimension: 'Data Enrichments',
                rating: 'Gold',
                response: 'Derived fields or enriched data generated from/used by a peer reviewed algorithm.',
            },
            {
                dimension: 'Data Enrichments',
                rating: 'Platinum',
                response: 'The data includes derived fields or enriched data from a national report. ',
            },
        ],
    };

    constructor(props) {
        super(props);
        this.state.open = props.open;
        this.updateFlag = this.updateFlag.bind(this);
        this.state.section = props.section;
        this.state.datasetUtility = props.datasetUtility || {};
        this.state.documentationWeight = props.documentationWeight;
        this.state.technicalQualityWeight = props.technicalQualityWeight;
        this.state.accessProvisionWeight = props.accessProvisionWeight;
        this.state.valueInterestWeight = props.valueInterestWeight;
        this.state.coverageWeight = props.coverageWeight;
    }

    async componentWillMount() {
        if (!_.isEmpty(this.props.datasetUtility)) {
            await this.updateSections(this.props.datasetUtility);
        }
    }

    componentDidUpdate(prevProps) {
        const isOpen = this.props.open;
        if (prevProps.open !== isOpen) {
            this.setState({
                open: isOpen,
            });
            if (isOpen) {
                this.setState({
                    flagClosed: false,
                });
            } else {
                this.setState({
                    flagClosed: true,
                });
            }
        }
    }

    updateFlag() {
        if (this.state.flagClosed === true) {
            this.setState({ flagClosed: false });
        } else if (this.state.flagClosed === false) {
            this.setState({ flagClosed: true });
        }
    }

    getSectionRating(rating) {
        switch (rating) {
            case 'Platinum':
                return <PlatinumSVG data-testid='platinumSvg' />;
            case 'Gold':
                return <GoldSVG data-testid='goldSvg' />;
            case 'Silver':
                return <SilverSVG data-testid='silverSvg' />;
            case 'Bronze':
                return <BronzeSVG data-testid='bronzeSvg' />;
            default:
                return <UnfilledSVG data-testid='unfilledSvg' />;
        }
    }

    getSubSectionRating(rating) {
        switch (rating) {
            case 'Platinum':
                return <SubPlatinumSVG data-testid='platinumSubSvg' />;
            case 'Gold':
                return <SubGoldSVG data-testid='goldSubSvg' />;
            case 'Silver':
                return <SubSilverSVG data-testid='silverSubSvg' />;
            case 'Bronze':
                return <SubBronzeSVG data-testid='bronzeSubSvg' />;
            default:
                return <SubUnfilledSVG data-testid='unfilledSubSvg' />;
        }
    }

    async updateSections(datasetUtility = {}) {
        if (!_.isEmpty(datasetUtility)) {
            if (datasetUtility.metadata_richness.trim() === 'Not Rated') {
                this.setState({ metadataRichnessOnly: false });
            }

            if (
                !datasetUtility.availability_of_additional_documentation_and_support &&
                !datasetUtility.data_model &&
                !datasetUtility.data_dictionary &&
                !datasetUtility.provenance
            ) {
                this.setState({ documentSection: false });
            }

            if (!datasetUtility.data_quality_management_process && !datasetUtility.dama_quality_dimensions) {
                this.setState({ techQualitySection: false });
            }

            if (!datasetUtility.allowable_uses && !datasetUtility.time_lag && !datasetUtility.timeliness) {
                this.setState({ accessProvisionSection: false });
            }

            if (!datasetUtility.linkages && !datasetUtility.data_enrichments) {
                this.setState({ valueInterestSection: false });
            }

            if (!datasetUtility.pathway_coverage && !datasetUtility.length_of_follow_up) {
                this.setState({ coverageSection: false });
            }
        }
    }

    render() {
        const {
            open,
            flagClosed,
            section,
            ratings,
            documentationWeight,
            technicalQualityWeight,
            accessProvisionWeight,
            valueInterestWeight,
            coverageWeight,
            metadataRichnessOnly,
            documentSection,
            techQualitySection,
            accessProvisionSection,
            valueInterestSection,
            coverageSection,
            datasetUtility: {
                metadata_richness = '',
                availability_of_additional_documentation_and_support = '',
                data_model = '',
                data_dictionary = '',
                provenance = '',
                data_quality_management_process = '',
                dama_quality_dimensions = '',
                allowable_uses = '',
                time_lag = '',
                timeliness = '',
                linkages = '',
                data_enrichments = '',
                pathway_coverage = '',
                length_of_follow_up = '',
            },
        } = this.state;

        switch (section) {
            case 'Documentation':
                if (documentSection === true) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow' onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}>
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron'>
                                    <SVGIcon
                                        name='chevronbottom'
                                        fill={'#475DA7'}
                                        className={flagClosed === true ? 'svg-20 dataQualityArrow' : 'svg-20 flipSVG dataQualityArrow'}
                                    />
                                </Col>
                                <Col
                                    xs={8}
                                    sm={5}
                                    md={4}
                                    lg={3}
                                    xl={2}
                                    className='gray800-14 dataUtilityTitle'
                                    data-testid='documentationWeight'
                                >
                                    Documentation
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='dataUtilitySvg' data-testid='documentation'>
                                    {this.getSectionRating(documentationWeight)}
                                </Col>
                            </Row>

                            <Collapse in={this.state.open} className='dataCollapseWait pad-top-8'>
                                <div>
                                    <Row className='dataUtilityBox topBorder'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Metadata richness</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            <span className='gray800-13'>Element calculated separately</span>
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>
                                                {!_.isEmpty(metadata_richness) && this.getSubSectionRating(metadata_richness.trim())}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Additional documentation & support</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating => {
                                                return rating.dimension === 'Additional documentation and support' &&
                                                    rating.rating === availability_of_additional_documentation_and_support.trim() ? (
                                                    <span className='gray800-13' data-testid='addDocAndSupport'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                );
                                            })}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>
                                                {!_.isEmpty(availability_of_additional_documentation_and_support) &&
                                                    this.getSubSectionRating(availability_of_additional_documentation_and_support.trim())}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Data model</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Data Model' && rating.rating === data_model.trim() ? (
                                                    <span className='gray800-13' data-testid='dataModel'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(data_model) && this.getSubSectionRating(data_model.trim())}</span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Data dictionary</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Data Dictionary' && rating.rating === data_dictionary.trim() ? (
                                                    <span className='gray800-13' data-testid='dataDictionary'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(data_dictionary) && this.getSubSectionRating(data_dictionary.trim())}</span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Provenance</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Provenance' && rating.rating === provenance.trim() ? (
                                                    <span className='gray800-13' data-testid='provenance'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(provenance) && this.getSubSectionRating(provenance.trim())}</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    );
                }
                if (documentSection === false && metadataRichnessOnly === false) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow margin-top-8'>
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron greyedOutChevron'>
                                    <SVGIcon name='chevronbottom' fill={'#d0d3d4'} className='svg-20 dataQualityArrow' />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14-opacity dataUtilityTitle'>
                                    Documentation
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='gray800-14-opacity dataUtilityTitle pad-left-0'>
                                    <span className='gray800-14'>Not yet rated</span>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                if (documentSection === false && metadataRichnessOnly === true) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow margin-bottom-8 pad-left-24 margin-left-6'>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14 dataUtilityTitle'>
                                    Documentation
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='dataUtilitySvg'>
                                    {!_.isEmpty(metadata_richness) && this.getSectionRating(metadata_richness.trim())}
                                </Col>
                            </Row>

                            <div className='pad-left-24 pad-right-24'>
                                <Row className='dataUtilityBox topBorder'>
                                    <Col sm={3} lg={3}>
                                        <span className='gray800-13-opacity'>Metadata richness</span>
                                    </Col>
                                    <Col sm={8} lg={8}>
                                        <span className='gray800-13'>Element calculated separately</span>
                                    </Col>
                                    <Col sm={1} lg={1}>
                                        <span>{!_.isEmpty(metadata_richness) && this.getSubSectionRating(metadata_richness.trim())}</span>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    );
                }
                break;
            case 'TechQuality':
                if (techQualitySection === true) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row
                                className='pointer dataUtilityRow margin-top-8'
                                onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                            >
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron'>
                                    <SVGIcon
                                        name='chevronbottom'
                                        fill={'#475DA7'}
                                        className={flagClosed === true ? 'svg-20 dataQualityArrow' : 'svg-20 flipSVG dataQualityArrow'}
                                    />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14 dataUtilityTitle'>
                                    Technical quality
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='dataUtilitySvg'>
                                    {this.getSectionRating(technicalQualityWeight)}
                                </Col>
                            </Row>

                            <Collapse in={this.state.open} className='dataCollapseWait pad-top-8'>
                                <div>
                                    <Row className='dataUtilityBox topBorder'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Data Quality Management Process</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Data Quality Management Process' &&
                                                rating.rating === data_quality_management_process.trim() ? (
                                                    <span className='gray800-13'> {rating.response} </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>
                                                {!_.isEmpty(data_quality_management_process) &&
                                                    this.getSubSectionRating(data_quality_management_process.trim())}
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>DAMA quality dimensions</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            <span className='gray800-13'>Element calculated separately</span>
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>
                                                {!_.isEmpty(dama_quality_dimensions) &&
                                                    this.getSubSectionRating(dama_quality_dimensions.trim())}
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    );
                }
                if (techQualitySection === false) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow margin-top-8'>
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron greyedOutChevron'>
                                    <SVGIcon name='chevronbottom' fill={'#d0d3d4'} className='svg-20 dataQualityArrow' />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14-opacity dataUtilityTitle'>
                                    Technical quality
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='gray800-14-opacity dataUtilityTitle pad-left-0'>
                                    <span className='gray800-14'>Not yet rated</span>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                break;
            case 'Access':
                if (accessProvisionSection === true) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row
                                className='pointer dataUtilityRow margin-top-8'
                                onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                            >
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron'>
                                    <SVGIcon
                                        name='chevronbottom'
                                        fill={'#475DA7'}
                                        className={flagClosed === true ? 'svg-20 dataQualityArrow' : 'svg-20 flipSVG dataQualityArrow'}
                                    />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14 dataUtilityTitle'>
                                    Access & provision
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='dataUtilitySvg'>
                                    {this.getSectionRating(accessProvisionWeight)}
                                </Col>
                            </Row>

                            <Collapse in={this.state.open} className='dataCollapseWait pad-top-8'>
                                <div>
                                    <Row className='dataUtilityBox topBorder'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Allowable uses</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Allowable uses' && rating.rating === allowable_uses.trim() ? (
                                                    <span className='gray800-13' data-testid='allowableUses'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(allowable_uses) && this.getSubSectionRating(allowable_uses.trim())}</span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Time lag</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Time Lag' && rating.rating === time_lag.trim() ? (
                                                    <span className='gray800-13' data-testid='timeLag'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(time_lag) && this.getSubSectionRating(time_lag.trim())}</span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Timeliness</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Timeliness' && rating.rating === timeliness.trim() ? (
                                                    <span className='gray800-13' data-testid='timeliness'>
                                                        {' '}
                                                        {rating.response}{' '}
                                                    </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(timeliness) && this.getSubSectionRating(timeliness.trim())}</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    );
                }
                if (accessProvisionSection === false) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow margin-top-8'>
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron greyedOutChevron'>
                                    <SVGIcon name='chevronbottom' fill={'#d0d3d4'} className='svg-20 dataQualityArrow' />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14-opacity dataUtilityTitle'>
                                    Access & provision
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='gray800-14-opacity dataUtilityTitle pad-left-0'>
                                    <span>Not yet rated</span>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                break;
            case 'Value':
                if (valueInterestSection === true) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row
                                className='pointer dataUtilityRow margin-top-8'
                                onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                            >
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron'>
                                    <SVGIcon
                                        name='chevronbottom'
                                        fill={'#475DA7'}
                                        className={flagClosed === true ? 'svg-20 dataQualityArrow' : 'svg-20 flipSVG dataQualityArrow'}
                                    />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14 dataUtilityTitle'>
                                    Value & interest
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='dataUtilitySvg'>
                                    {this.getSectionRating(valueInterestWeight)}
                                </Col>
                            </Row>

                            <Collapse in={this.state.open} className='dataCollapseWait pad-top-8'>
                                <div>
                                    <Row className='dataUtilityBox topBorder'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Linkages</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Linkages' && rating.rating === linkages.trim() ? (
                                                    <span className='gray800-13'> {rating.response} </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(linkages) && this.getSubSectionRating(linkages.trim())}</span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Data Enrichments</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Data Enrichments' && rating.rating === data_enrichments.trim() ? (
                                                    <span className='gray800-13'> {rating.response} </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(data_enrichments) && this.getSubSectionRating(data_enrichments.trim())}</span>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    );
                }
                if (valueInterestSection === false) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow margin-top-8'>
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron greyedOutChevron'>
                                    <SVGIcon name='chevronbottom' fill={'#d0d3d4'} className='svg-20 dataQualityArrow' />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14-opacity dataUtilityTitle'>
                                    Value & interest
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='gray800-14-opacity dataUtilityTitle pad-left-0'>
                                    <span className='gray800-14'>Not yet rated</span>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                break;
            case 'Coverage':
                if (coverageSection === true) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row
                                className='pointer dataUtilityRow margin-top-8'
                                onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                            >
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron'>
                                    <SVGIcon
                                        name='chevronbottom'
                                        fill={'#475DA7'}
                                        className={flagClosed === true ? 'svg-20 dataQualityArrow' : 'svg-20 flipSVG dataQualityArrow'}
                                    />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14 dataUtilityTitle'>
                                    Coverage
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='dataUtilitySvg'>
                                    {this.getSectionRating(coverageWeight)}
                                </Col>
                            </Row>

                            <Collapse in={this.state.open} className='dataCollapseWait pad-top-8'>
                                <div>
                                    <Row className='dataUtilityBox topBorder'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Pathway coverage</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Pathway coverage' && rating.rating === pathway_coverage.trim() ? (
                                                    <span className='gray800-13'> {rating.response} </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>{!_.isEmpty(pathway_coverage) && this.getSubSectionRating(pathway_coverage.trim())}</span>
                                        </Col>
                                    </Row>
                                    <Row className='dataUtilityBox'>
                                        <Col sm={3} lg={3}>
                                            <span className='gray800-13-opacity'>Length of follow up</span>
                                        </Col>
                                        <Col sm={8} lg={8}>
                                            {ratings.map(rating =>
                                                rating.dimension === 'Length of follow up' &&
                                                rating.rating === length_of_follow_up.trim() ? (
                                                    <span className='gray800-13'> {rating.response} </span>
                                                ) : (
                                                    ''
                                                )
                                            )}
                                        </Col>
                                        <Col sm={1} lg={1}>
                                            <span>
                                                {!_.isEmpty(length_of_follow_up) && this.getSubSectionRating(length_of_follow_up.trim())}
                                            </span>
                                        </Col>
                                    </Row>
                                </div>
                            </Collapse>
                        </div>
                    );
                }
                if (coverageSection === false) {
                    return (
                        <div className='dataQualityCollapse'>
                            <Row className='pointer dataUtilityRow margin-top-8'>
                                <Col xs={2} sm={2} m={1} lg={1} className='dataUtilityChevron greyedOutChevron'>
                                    <SVGIcon name='chevronbottom' fill={'#d0d3d4'} className='svg-20 dataQualityArrow' />
                                </Col>
                                <Col xs={8} sm={5} md={4} lg={3} xl={2} className='gray800-14-opacity dataUtilityTitle'>
                                    Coverage
                                </Col>
                                <Col xs={2} sm={5} md={5} lg={8} xl={9} className='gray800-14-opacity dataUtilityTitle pad-left-0'>
                                    <span className='gray800-14'>Not yet rated</span>
                                </Col>
                            </Row>
                        </div>
                    );
                }
                break;
            default:
                return section;
        }
    }
}

export default DataQualityInfo;
