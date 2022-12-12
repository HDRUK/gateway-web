import React from 'react';
import { Col, Row, Collapse } from 'react-bootstrap';
import SVGIcon from '../../../images/SVGIcon';
import '../Dataset.scss';
import { ReactComponent as SubBronzeSVG } from '../../../images/sub_bronze.svg';
import { ReactComponent as SubSilverSVG } from '../../../images/sub_silver.svg';
import { ReactComponent as SubGoldSVG } from '../../../images/sub_gold.svg';
import { ReactComponent as SubPlatinumSVG } from '../../../images/sub_platinum.svg';

class DataUtilityModalInfo extends React.Component {
    state = {
        open: false,
        flagClosed: true,
        section: '',
    };

    constructor(props) {
        super(props);
        this.state.open = props.open;
        this.updateFlag = this.updateFlag.bind(this);
        this.state.section = props.section;
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

    renderSubHeader(title, description) {
        return (
            <Row className='greySubHeader'>
                <Col sm={3} lg={3} className='pad-left-0'>
                    {title === 'Additional documentation & support' ? (
                        <span className='gray-deep-13-bold'>
                            Additional <br /> documentation & support
                        </span>
                    ) : (
                        <span className='gray-deep-13-bold'>{title}</span>
                    )}
                </Col>
                <Col sm={9} lg={9} className='pad-left-8'>
                    <span className='gray800-13-bold'>{description}</span>
                </Col>
            </Row>
        );
    }

    renderRow(description, rating) {
        return (
            <Row className='dataUtilityBox'>
                <Col sm={3} lg={3} />
                <Col sm={8} lg={8}>
                    <span className='gray700-13'>{description}</span>
                </Col>
                <Col sm={1} lg={1}>
                    {rating}
                </Col>
            </Row>
        );
    }

    render() {
        const { open, flagClosed, section } = this.state;

        switch (section) {
            case 'Documentation':
                return (
                    <div className='dataUtilityCollapse'>
                        <Row
                            className='purpleHeader white-14-semibold pointer'
                            onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                        >
                            <SVGIcon
                                name='chevronbottom'
                                fill={'#ffffff'}
                                className={flagClosed === true ? 'svg-20 dataUtilityArrow' : 'svg-20 flipSVG  flippedDataUtilityArrow'}
                            />
                            <span className='margin-left-8'>Documentation</span>
                        </Row>

                        <Collapse in={this.state.open} className='collapseWait pad-bottom-8'>
                            <div>
                                {this.renderSubHeader('Metadata richness', 'This element will be calculated separately')}

                                {this.renderSubHeader(
                                    'Additional documentation & support',
                                    'Available dataset documentation in addition to the data dictionary'
                                )}

                                {this.renderRow('Past journal articles demonstrate that knowledge of the data exists', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'Comprehensive ReadMe describing extracting and use of data, Dataset FAQs available, visual model provided',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow(
                                    'Dataset publication was supported with a journal article explaining the dataset in detail, or dataset training materials',
                                    <SubGoldSVG />
                                )}
                                {this.renderRow('Support personnel available to answer any questions', <SubPlatinumSVG />)}

                                {this.renderSubHeader('Data model', 'Availability of clear, documented data model')}

                                {this.renderRow('Known and accepted data model but some key field un-coded or free text', <SubBronzeSVG />)}
                                {this.renderRow('Key fields codified using a local standard', <SubSilverSVG />)}
                                {this.renderRow('Key fields codified using a national or international standard', <SubGoldSVG />)}
                                {this.renderRow(
                                    'Conforms to a national standard and key fields codified using a national/international standard',
                                    <SubPlatinumSVG />
                                )}

                                {this.renderSubHeader('Data dictionary', 'Provided documented data dictionary and terminologies')}

                                {this.renderRow('Data definitions available', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'Definitions compiled into local data dictionary which is available online',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow('Dictionary relates to national definitions', <SubGoldSVG />)}
                                {this.renderRow('Dictionary is based on international standards and includes mapping', <SubPlatinumSVG />)}

                                {this.renderSubHeader(
                                    'Provenance',
                                    'Clear descriptions of source and history of the dataset, providing a ‘transparent data pipeline’'
                                )}

                                {this.renderRow('Source of the dataset is documented', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'Source of the dataset and any transformations, rules and exclusions documented',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow(
                                    'All original data items listed, all transformations, rules and exclusion listed and impact of these',
                                    <SubGoldSVG />
                                )}
                                {this.renderRow(
                                    'Ability to view earlier versions, including ‘raw’ dataset, and review the impact of each stage of data cleaning',
                                    <SubPlatinumSVG />
                                )}
                            </div>
                        </Collapse>
                    </div>
                );
            case 'TechQuality':
                return (
                    <div className='dataUtilityCollapse'>
                        <Row
                            className='purpleHeader margin-top-8 white-14-semibold pointer'
                            onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                        >
                            <SVGIcon
                                name='chevronbottom'
                                fill={'#ffffff'}
                                className={flagClosed === true ? 'svg-20 dataUtilityArrow' : 'svg-20 flipSVG flippedDataUtilityArrow'}
                            />
                            <span className='margin-left-8'>Technical quality</span>
                        </Row>

                        <Collapse in={this.state.open} className='collapseWait pad-bottom-8'>
                            <div>
                                {this.renderSubHeader(
                                    'Data Quality Management Process',
                                    'The level of maturity of the data quality management process'
                                )}

                                {this.renderRow(
                                    'A documented data management plan covering collection, auditing, and management is available for the dataset',
                                    <SubBronzeSVG />
                                )}
                                {this.renderRow(
                                    'Evidence that the data management plan has been implemented is available',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow('Key fields codified using a national or international standard', <SubGoldSVG />)}
                                {this.renderRow(
                                    'Externally verified compliance with the data management plan, e.g. by ISO, CQC, ICO or other body',
                                    <SubPlatinumSVG />
                                )}

                                {this.renderSubHeader(
                                    'Data Management Association (DAMA) Quality Dimensions',
                                    'This element will be calculated separately'
                                )}
                            </div>
                        </Collapse>
                    </div>
                );
            case 'Access':
                return (
                    <div className='dataUtilityCollapse'>
                        <Row
                            className='purpleHeader margin-top-8 white-14-semibold pointer'
                            onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                        >
                            <SVGIcon
                                name='chevronbottom'
                                fill={'#ffffff'}
                                className={flagClosed === true ? 'svg-20 dataUtilityArrow' : 'svg-20 flipSVG flippedDataUtilityArrow'}
                            />
                            <span className='margin-left-8'>Access & provision</span>
                        </Row>

                        <Collapse in={this.state.open} className='collapseWait pad-bottom-8'>
                            <div>
                                {this.renderSubHeader('Allowable uses', 'Allowable dataset usages as per the licencing agreement')}

                                {this.renderRow('Undefined', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'Non-consented, aggregate data for specific academic uses (following IG approval)',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow(
                                    'Aggregate data, for academic and specific commercial uses (following IG approval)',
                                    <SubGoldSVG />
                                )}
                                {this.renderRow('Fully consented for commercial uses (following IG approval)', <SubPlatinumSVG />)}

                                {this.renderSubHeader('Time lag', 'Lag between the data being collected and added to the dataset')}

                                {this.renderRow('Approximately 1 year', <SubBronzeSVG />)}
                                {this.renderRow('Approximately 1 month', <SubSilverSVG />)}
                                {this.renderRow('Approximately 1 week', <SubGoldSVG />)}
                                {this.renderRow('Effectively real-time data', <SubPlatinumSVG />)}

                                {this.renderSubHeader('Timeliness', 'Average data access request timeframe')}

                                {this.renderRow('More than 12 months', <SubBronzeSVG />)}
                                {this.renderRow('Less than 12 months', <SubSilverSVG />)}
                                {this.renderRow('Less than 6 months', <SubGoldSVG />)}
                                {this.renderRow('Less than 3 months', <SubPlatinumSVG />)}
                            </div>
                        </Collapse>
                    </div>
                );
            case 'Value':
                return (
                    <div className='dataUtilityCollapse'>
                        <Row
                            className='purpleHeader margin-top-8 white-14-semibold pointer'
                            onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                        >
                            <SVGIcon
                                name='chevronbottom'
                                fill={'#ffffff'}
                                className={flagClosed === true ? 'svg-20 dataUtilityArrow' : 'svg-20 flipSVG flippedDataUtilityArrow'}
                            />
                            <span className='margin-left-8'>Value & interest</span>
                        </Row>

                        <Collapse in={this.state.open} className='collapseWait pad-bottom-8'>
                            <div>
                                {this.renderSubHeader('Linkages', 'Ability to link with other datasets')}

                                {this.renderRow('Identifiers to demonstrate ability to link to other datasets', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'Available linkages outlined and/or List of datasets previously successfully linked provided',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow(
                                    'List of restrictions on the type of linkages detailed. List of previously successful dataset linkages performed, with navigable links to linked datasets via at DOI/URL',
                                    <SubGoldSVG />
                                )}
                                {this.renderRow('Effectively real-time data', <SubPlatinumSVG />)}

                                {this.renderSubHeader(
                                    'Data Enrichments',
                                    'Data sources enriched with annotations, image labels, phenomes, derivations, NLP derived data labels'
                                )}

                                {this.renderRow('The data include additional derived fields, or enriched data', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'The data include additional derived fields, or enriched data used by other available data sources',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow(
                                    'The derived fields or enriched data were generated from, or used by, a peer reviewed algorithm',
                                    <SubGoldSVG />
                                )}
                                {this.renderRow(
                                    'The data includes derived fields or enriched data from a national report',
                                    <SubPlatinumSVG />
                                )}
                            </div>
                        </Collapse>
                    </div>
                );
            case 'Coverage':
                return (
                    <div className='dataUtilityCollapse'>
                        <Row
                            className='purpleHeader margin-top-8 white-14-semibold pointer'
                            onClick={() => this.setState({ open: !open, flagClosed: !flagClosed })}
                        >
                            <SVGIcon
                                name='chevronbottom'
                                fill={'#ffffff'}
                                className={flagClosed === true ? 'svg-20 dataUtilityArrow' : 'svg-20 flipSVG flippedDataUtilityArrow'}
                            />
                            <span className='margin-left-8'>Coverage</span>
                        </Row>

                        <Collapse in={this.state.open} className='collapseWait pad-bottom-8'>
                            <div>
                                {this.renderSubHeader('Pathway coverage', 'Representation of multi-disciplinary healthcare data')}

                                {this.renderRow('Contains data from a single speciality or area', <SubBronzeSVG />)}
                                {this.renderRow(
                                    'Contains data from multiple specialties or services within a single tier of care',
                                    <SubSilverSVG />
                                )}
                                {this.renderRow(
                                    'Contains multimodal data or data that is linked across two tiers (e.g. primary and secondary care)',
                                    <SubGoldSVG />
                                )}
                                {this.renderRow('Contains data across the whole pathway of care', <SubPlatinumSVG />)}

                                {this.renderSubHeader(
                                    'Length of follow up',
                                    'Average timeframe in which a patient appears in a dataset (follow up period)'
                                )}

                                {this.renderRow('Between 1 - 6 months', <SubBronzeSVG />)}
                                {this.renderRow('Between 6 - 12 months', <SubSilverSVG />)}
                                {this.renderRow('Between 1 - 10 years', <SubGoldSVG />)}
                                {this.renderRow('More than 10 years', <SubPlatinumSVG />)}
                            </div>
                        </Collapse>
                    </div>
                );
            default:
                return section;
        }
    }
}

export default DataUtilityModalInfo;
