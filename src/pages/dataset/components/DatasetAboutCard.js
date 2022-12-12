import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import { isEmpty } from 'lodash';
import AboutCardElement from './AboutCardElement';
import googleAnalytics from '../../../tracking';
import '../Dataset.scss';

const DatasetAboutCard = ({ v2data, section, showEmpty, toggleModal }) => {
    let temporalCoverage = '';

    if (!isEmpty(v2data.provenance.temporal.startDate) && !isEmpty(v2data.provenance.temporal.endDate)) {
        temporalCoverage = `${v2data.provenance.temporal.startDate} - ${v2data.provenance.temporal.endDate}`;
    }

    const formatLinks = source => {
        const reUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
        return source.replace(reUrl, '[$1]($1) ');
    };

    switch (section) {
        case 'Documentation':
            return (
                <Row className='mt-1'>
                    <Col sm={12}>
                        <div className='rectangle'>
                            <Row className='gray800-14-bold'>
                                <Col sm={12} className='mb-1'>
                                    <span data-testid='documentation-header'>{section}</span>
                                </Col>
                            </Row>
                            {!isEmpty(v2data.documentation.description) ? (
                                <Row className='mt-3'>
                                    <Col sm={12} className='gray800-14 overflowWrap'>
                                        <span className='gray800-14' data-testid='documentation-description'>
                                            <ReactMarkdown source={formatLinks(v2data.documentation.description)} />
                                        </span>
                                    </Col>
                                </Row>
                            ) : (
                                ''
                            )}
                            {showEmpty === false && isEmpty(v2data.documentation.associatedMedia) ? (
                                ''
                            ) : (
                                <span data-testid='documentation-assocmedia'>
                                    <AboutCardElement
                                        label='Associated Media'
                                        description={v2data.documentation.associatedMedia}
                                        tooltip='Associated Media of the dataset.'
                                    />
                                </span>
                            )}
                            {showEmpty === false && isEmpty(v2data.documentation.isPartOf) ? (
                                ''
                            ) : (
                                <span data-testid='documentation-ispartof'>
                                    <AboutCardElement
                                        label='Is part of'
                                        description={v2data.documentation.isPartOf}
                                        tooltip='Associated media is part of.'
                                    />
                                </span>
                            )}
                        </div>
                    </Col>
                </Row>
            );
        case 'Details':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                    </Col>
                                </Row>
                                {showEmpty === false && isEmpty(v2data.summary.doiName) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='DOI'
                                        description={v2data.summary.doiName}
                                        tooltip='This is not the DOI of the publication(s) associated with the dataset, but rather the DOI of the metadata describing the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.provenance.temporal.distributionReleaseDate) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Latest dataset release date'
                                        description={v2data.provenance.temporal.distributionReleaseDate}
                                        tooltip='Date of the latest release of the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.provenance.temporal.accrualPeriodicity) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Publishing frequency'
                                        description={v2data.provenance.temporal.accrualPeriodicity}
                                        tooltip='The frequency of publishing new data for this dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.issued) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Creation Date'
                                        description={v2data.issued}
                                        tooltip='Date when the information about this dataset was added to our database.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.modified) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Last updated '
                                        description={v2data.modified}
                                        tooltip='The last date when the information about this dataset was updated'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.version) ? (
                                    ''
                                ) : (
                                    <AboutCardElement label='Version' description={v2data.version} tooltip='Dataset metadata version' />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.usage.resourceCreator) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Resource creator'
                                        description={v2data.accessibility.usage.resourceCreator}
                                        tooltip='Any citation that credits this dataset.'
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        case 'Coverage':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                    </Col>
                                </Row>
                                {showEmpty === false && isEmpty(temporalCoverage) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Temporal coverage'
                                        description={temporalCoverage}
                                        tooltip='The start and end date of the time period that the dataset provides coverage for. End date may be empty depending on publishing frequency.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.provenance.temporal.timeLag) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Dataset time lag'
                                        description={v2data.provenance.temporal.timeLag}
                                        tooltip='Please indicate the typical time-lag between an event and the data for that event appearing in the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.coverage.spatial) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Geographical coverage'
                                        description={v2data.coverage.spatial}
                                        tooltip='The geographical area covered by the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.coverage.typicalAgeRange) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Typical age range'
                                        description={v2data.coverage.typicalAgeRange}
                                        tooltip='The age range in whole years of participants in the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.coverage.physicalSampleAvailability) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Physical sample availability'
                                        description={v2data.coverage.physicalSampleAvailability}
                                        tooltip='Availability of physical samples associated with the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.coverage.followup) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Follow-up'
                                        description={v2data.coverage.followup}
                                        tooltip='The typical time span that a patient appears in the dataset (follow-up period)'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.coverage.pathway) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Pathway'
                                        description={v2data.coverage.pathway}
                                        tooltip='Indicates if the dataset is representative of the patient pathway and any limitations the dataset may have with respect to pathway coverage. This could include if the dataset is from a single speciality or area, a single tier of care, linked across two tiers (e.g. primary and secondary care), or an integrated care record covering the whole patient pathway.'
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        case 'Formats and standards':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                    </Col>
                                </Row>
                                {showEmpty === false && isEmpty(v2data.accessibility.formatAndStandards.vocabularyEncodingScheme) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Semantic Annotations'
                                        description={v2data.accessibility.formatAndStandards.vocabularyEncodingScheme}
                                        tooltip='Relevant terminologies / ontologies / controlled vocabularies, such as ICD 10 Codes, NHS Data Dictionary National Codes or SNOMED CT International, that are being used by the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.formatAndStandards.conformsTo) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Data models'
                                        description={v2data.accessibility.formatAndStandards.conformsTo}
                                        tooltip='Standardised data models that the dataset has been stored in or transformed to, such as OMOP or FHIR,or if the data is only available in a local format.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.formatAndStandards.language) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Language'
                                        description={v2data.accessibility.formatAndStandards.language}
                                        tooltip='All the languages in which the dataset metadata and underlying data is made available.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.formatAndStandards.format) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Format'
                                        description={v2data.accessibility.formatAndStandards.format}
                                        tooltip='Format(s) in which the dataset is available. I.e. application, audio, image, message, model, multipart, text, video, and so on.'
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        case 'Provenance':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                    </Col>
                                </Row>
                                {showEmpty === false && isEmpty(v2data.provenance.origin.purpose) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Purpose'
                                        description={v2data.provenance.origin.purpose}
                                        tooltip='The purpose(s) for which the dataset was collected.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.provenance.origin.source) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Source'
                                        description={v2data.provenance.origin.source}
                                        tooltip='The source of the data extraction.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.provenance.origin.collectionSituation) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Collection situation'
                                        description={v2data.provenance.origin.collectionSituation}
                                        tooltip='The setting(s) where data was collected. Multiple settings may be provided'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.enrichmentAndLinkage.derivation) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Derived from'
                                        description={v2data.enrichmentAndLinkage.derivation}
                                        tooltip='Indicates if derived datasets or predefined extracts are available and the type of derivation available.'
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            );

        case 'Observations':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                    </Col>
                                </Row>

                                <Table responsive size='sm' className='margin-top-8'>
                                    <thead>
                                        <tr className='gray800-14-bold'>
                                            <th>Statistical population</th>
                                            <th className='observationDescription'>Population description</th>
                                            <th>Population size</th>
                                            <th>Measured property</th>
                                            <th>Observation date</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {v2data.observations.length > 0 ? (
                                            <>
                                                {v2data.observations.map(data => (
                                                    <tr className='gray800-14'>
                                                        <td className='table-cell'>{data.observedNode}</td>
                                                        <td className='table-cell'>{data.disambiguatingDescription}</td>
                                                        <td className='table-cell'>{data.measuredValue}</td>
                                                        <td className='table-cell'>{data.measuredProperty}</td>
                                                        <td className='table-cell'>{data.observationDate}</td>
                                                    </tr>
                                                ))}
                                            </>
                                        ) : (
                                            <tr className='gray800-14'>
                                                <td className='table-cell'>
                                                    <span className='gray800-14-opacity'> Not specified </span>
                                                </td>
                                                <td className='table-cell'>
                                                    <span className='gray800-14-opacity'> Not specified </span>
                                                </td>
                                                <td className='table-cell'>
                                                    <span className='gray800-14-opacity'> Not specified </span>
                                                </td>
                                                <td className='table-cell'>
                                                    <span className='gray800-14-opacity'> Not specified </span>
                                                </td>
                                                <td className='table-cell'>
                                                    <span className='gray800-14-opacity'> Not specified </span>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        case 'Data access request':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                        <span
                                            className='purple-14 pointer float-right'
                                            onClick={() => {
                                                toggleModal();
                                                googleAnalytics.recordEvent(
                                                    'Data access request',
                                                    'How to request access',
                                                    'Dataset page secondary button clicked'
                                                );
                                            }}
                                        >
                                            How to request access
                                        </span>
                                    </Col>
                                </Row>
                                {showEmpty === false &&
                                isEmpty(v2data.accessibility.access.accessRights) &&
                                isEmpty(v2data.summary.publisher.accessRights) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Access information'
                                        description={v2data.accessibility.access.accessRights || v2data.summary.publisher.accessRights}
                                        tooltip='The URL of a webpage where the data access request process and/or guidance is provided.'
                                    />
                                )}
                                {showEmpty === false &&
                                isEmpty(v2data.accessibility.access.deliveryLeadTime) &&
                                isEmpty(v2data.summary.publisher.deliveryLeadTime) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Processing time'
                                        description={
                                            v2data.accessibility.access.deliveryLeadTime || v2data.summary.publisher.deliveryLeadTime
                                        }
                                        tooltip='An indication of the typical processing times based on the types of requests typically received.'
                                    />
                                )}
                                {showEmpty === false &&
                                isEmpty(v2data.accessibility.access.accessRequestCost) &&
                                isEmpty(v2data.summary.publisher.accessRequestCost) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Access request cost'
                                        description={
                                            v2data.accessibility.access.accessRequestCost || v2data.summary.publisher.accessRequestCost
                                        }
                                        tooltip='Indication of cost (in GBP) for processing each data access request by the data custodian.'
                                    />
                                )}
                                {showEmpty === false &&
                                isEmpty(v2data.accessibility.access.accessService) &&
                                isEmpty(v2data.summary.publisher.accessService) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Access environment'
                                        description={v2data.accessibility.access.accessService || v2data.summary.publisher.accessService}
                                        tooltip='A brief description of the environment where data can be accessed by researchers.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.access.jurisdiction) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Jurisdiction'
                                        description={v2data.accessibility.access.jurisdiction}
                                        tooltip='ISO 3166-1 country codes and the associated SO 3166-2 for regions, cities, states etc. for the country/state under whose laws the data subjects data is collected, processed and stored. Multiple Jurisdications may be provided (if applicable).'
                                    />
                                )}
                                {showEmpty === false &&
                                isEmpty(v2data.accessibility.usage.dataUseLimitation) &&
                                isEmpty(v2data.summary.publisher.dataUseLimitation) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Limitations'
                                        description={
                                            v2data.accessibility.usage.dataUseLimitation || v2data.summary.publisher.dataUseLimitation
                                        }
                                        tooltip='An indication of consent permissions for datasets and/or materials, and relates to the purposes for which datasets and/or material might be removed, stored or used.'
                                    />
                                )}
                                {showEmpty === false &&
                                isEmpty(v2data.accessibility.usage.dataUseRequirements) &&
                                isEmpty(v2data.summary.publisher.dataUseRequirements) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Requirements'
                                        description={
                                            v2data.accessibility.usage.dataUseRequirements || v2data.summary.publisher.dataUseRequirements
                                        }
                                        tooltip='Any additional conditions set for use if any.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.access.dataController) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Data Controller'
                                        description={v2data.accessibility.access.dataController}
                                        tooltip='Data Controller means a person/entity who (either alone or jointly or in common with other persons/entities) determines the purposes for which and the way any Data Subject data, specifically personal data or are to be processed. For most organisations this will be the same as the publisher of the dataset. If this is not the case, this should be indicated here.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.access.dataProcessor) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Data Processor'
                                        description={v2data.accessibility.access.dataProcessor}
                                        tooltip='A Data Processor, in relation to any Data Subject data, specifically personal data, means any person/entity (other than an employee of the data controller) who processes the data on behalf of the data controller.'
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        case 'Related resources':
            return (
                <div>
                    <Row className='mt-1'>
                        <Col sm={12}>
                            <div className='rectangle'>
                                <Row className='gray800-14-bold'>
                                    <Col sm={12} className='mb-1'>
                                        {section}
                                    </Col>
                                </Row>
                                {showEmpty === false && isEmpty(v2data.accessibility.usage.isReferencedBy) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Papers'
                                        description={v2data.accessibility.usage.isReferencedBy}
                                        tooltip='The keystone paper associated with the dataset'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.accessibility.usage.investigations) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Projects'
                                        description={v2data.accessibility.usage.investigations}
                                        tooltip='Any active projects that are using the dataset.'
                                    />
                                )}
                                {showEmpty === false && isEmpty(v2data.enrichmentAndLinkage.tools) ? (
                                    ''
                                ) : (
                                    <AboutCardElement
                                        label='Tools'
                                        description={v2data.enrichmentAndLinkage.tools}
                                        tooltip='Any analysis tools or models that have been created for this dataset and are available for further use.'
                                    />
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        default:
            return '';
    }
};

export default DatasetAboutCard;
