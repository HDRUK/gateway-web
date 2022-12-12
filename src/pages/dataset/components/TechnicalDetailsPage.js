import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ReactComponent as GoldStar } from '../../../images/cd-star.svg';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import { ReactComponent as TableSvg } from '../../../images/table.svg';
import TechnicalMetadataVariables from './TechnicalMetadataVariables';
import CohortProfilingVariables from './CohortProfilingVariables';
import '../Dataset.scss';

class TechnicalDetailsPage extends React.Component {
    state = {
        technicalMetadata: null,
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
        const { technicalMetadata, allOpen } = this.state;

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
                                                    <span className='pad-left-8 black-18'>
                                                        {technicalMetadata && technicalMetadata.hasProfilingData ? (
                                                            <span className='centerSpan'>
                                                                <GoldStar fill={'#f98e2b'} height='20' width='20' className='ml-1' />
                                                                {technicalMetadata.label}
                                                            </span>
                                                        ) : (
                                                            <span className='centerSpan'>{technicalMetadata.label}</span>
                                                        )}
                                                    </span>
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
                            {technicalMetadata &&
                                technicalMetadata.label &&
                                technicalMetadata.elements.map(element =>
                                    element.completeness >= 0 ? (
                                        <CohortProfilingVariables
                                            cohortProfilingVariables={element}
                                            tableName={technicalMetadata.label}
                                            datasetID={this.props.datasetID}
                                            allOpen={allOpen}
                                        />
                                    ) : (
                                        <TechnicalMetadataVariables techMetadataVariables={element} open={allOpen} />
                                    )
                                )}
                            <div className='height-16' />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default TechnicalDetailsPage;
