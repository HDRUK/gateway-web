/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { cx } from '@emotion/css';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from 'hdruk-react-core';

import { ToolTip, Icon, QualityScore } from 'components';
import googleAnalytics from '../../../../tracking';
import { dateFormats, stripMarkdown } from '../../../../utils/GeneralHelper.util';
import { ReactComponent as LockSVG } from '../../../../images/icon-security.svg';
import { ReactComponent as Shield } from '../../../../images/shield.svg';
import { DISPLAY_DATE_SLASH } from '../../../../configs/constants';
import { ReactComponent as InfoOutlineIcon } from '../../../../images/icons/info-outline.svg';
import SVGIcon from '../../../../images/SVGIcon';

import RemoveButton from '../RemoveButton/RemoveButton';
import Title from '../Title/Title';
import Description from '../Description/Description';
import Tag from '../Tag/Tag';
import { dataset } from './constants';
import * as styles from './Dataset.styles';
import '../../CommonComponents.scss';
import '../RelatedObject.scss';
import ShowMore from '../../ShowMore';
import DeliveryLeadTime from './modules/DeliveryLeadTime';
import NumberOfViews from './modules/NumberOfViews';

const Dataset = ({
    data,
    activeLink,
    onSearchPage,
    showRelationshipQuestion,
    isCohortDiscovery,
    updateOnFilterBadge,
    removeButton,
    isLocked,
    onClick,
}) => {
    const [publisherDetails, setPublisherDetails] = useState({ name: '', label: '' });

    const { t } = useTranslation();

    const getPublisherDetails = useCallback(() => {
        const publisher = { name: '', label: '', showShield: false };
        if (!isEmpty(data.datasetv2)) {
            const name = data.datasetv2.summary.publisher.name.toUpperCase();
            publisher.name = name;
            publisher.label = name;
            publisher.showShield = !isNil(data.datasetv2.summary.publisher.memberOf);
            publisher.memberOf = data.datasetv2.summary.publisher.memberOf;
        } else if (data.datasetfields.publisher) {
            const name = data.datasetfields.publisher;
            const publisherName = name.includes('>') ? name.split(' > ')[1].toUpperCase() : name.toUpperCase();
            publisher.name = publisherName;
            publisher.label = publisherName;
            publisher.showShield = false;
            publisher.memberOf = name.includes('>') && name.split(' > ')[0];
        }
        return publisher;
    }, [data.datasetv2, data.datasetfields.publisher]);

    useEffect(() => {
        const publisherDetails = getPublisherDetails();
        setPublisherDetails(publisherDetails);
    }, [getPublisherDetails]);

    const getDescription = () => {
        if (!data.datasetfields.abstract || typeof data.datasetfields.abstract === 'undefined') {
            if (data.description) {
                return stripMarkdown(data.description, 255);
            }
        } else {
            return stripMarkdown(data.datasetfields.abstract);
        }
    };

    if (data.type === 'dataset' && data.activeflag === 'archive') {
        return (
            <Row className='noMargin pad-left-24'>
                <Col sm={10} lg={10} className='entity-deleted-edit gray800-14'>
                    The dataset '{data.name}' has been deleted by the publisher
                </Col>
                <Col sm={2} lg={2}>
                    <RemoveButton removeButtonHandler={removeButton} />
                </Col>
            </Row>
        );
    }

    const {
        datasetfields: {
            metadataquality: {
                weighted_quality_rating: metaRating,
                weighted_quality_score: metaScore,
                weighted_completeness_percent: metaCompleteness,
                weighted_error_percent: metaError,
            } = {},
        },
    } = data;

    const phenotypesSelected = queryString.parse(window.location.search).phenotypes
        ? queryString.parse(window.location.search).phenotypes.split('::')
        : [];
    const searchTerm = queryString.parse(window.location.search).search ? queryString.parse(window.location.search).search : '';
    const phenotypesSearched = data.datasetfields.phenotypes.filter(phenotype => phenotype.name.toLowerCase() === searchTerm.toLowerCase());

    return (
        <>
            <Row data-testid='related-dataset-object' className=' pad-left-24 pad-right-24'>
                <Col xs={7} sm={9}>
                    <Title
                        id={data.pid}
                        name={data.name}
                        type={data.type}
                        activeLink={activeLink}
                        onClickHandler={() => {
                            googleAnalytics.recordEvent(`${dataset.TAB}`, 'Clicked on dataset to open', `Dataset name: ${data.name}`);

                            onClick();
                        }}
                    />
                    <br />
                    <Box
                        mb={1}
                        display='flex'
                        alignItems='center'
                        className={cx('gray800-14', { underlined: !!activeLink })}
                        css={styles.pointer}
                        data-testid={`publisher-${publisherDetails.name}`}>
                        {publisherDetails.showShield && (
                            <ToolTip text={`Member of ${publisherDetails.memberOf}`} placement='bottom-start'>
                                <Icon svg={<Shield fill='inherit' />} size='2xl' />
                            </ToolTip>
                        )}
                        <a
                            role='button'
                            onClick={() =>
                                updateOnFilterBadge('publisher', {
                                    value: publisherDetails.label,
                                    label: publisherDetails.label,
                                    parentKey: 'datasetpublisher',
                                })
                            }>
                            {publisherDetails.name}
                        </a>
                    </Box>
                </Col>
                <Col xs={5} sm={3} className={isLocked ? 'lockSVG' : ''}>
                    <Box display='flex' justifyContent='end'>
                        <QualityScore
                            rating={metaRating}
                            score={metaScore}
                            completenessPercent={metaCompleteness}
                            errorPercent={metaError}
                        />
                        {showRelationshipQuestion ? isLocked ? <LockSVG /> : <RemoveButton removeButtonHandler={removeButton} /> : ''}
                    </Box>
                </Col>
            </Row>
            <Row className='pad-left-24 pad-right-24'>
                <Col sm={12} md={6}>
                    <Box ml={1} as={Typography} color='green600' variant='caption' display='flex' alignItems='center' mt={1} mb={1}>
                        {t('dataset.dateUpdated')} {dateFormats(data.latestUpdate, { dateFormat: DISPLAY_DATE_SLASH }).dateOnly}
                        <ToolTip text={t('dataset.dateUpdatedTooltip')}>
                            <Icon svg={<InfoOutlineIcon fill='inherit' />} size='lg' ml={1} />
                        </ToolTip>
                    </Box>
                </Col>
                <Col sm={12} md={6} className={isLocked ? 'lockSVG ' : ''}>
                    <Box
                        ml={1}
                        as={Typography}
                        color='green600'
                        variant='caption'
                        display='flex'
                        alignItems='center'
                        justifyContent={{ sm: 'end' }}
                        mt={1}
                        mb={1}>
                        {data.datasetv2?.provenance?.temporal?.accrualPeriodicity && (
                            <>
                                {t('dataset.publishingFrequency')}
                                {data.datasetv2.provenance.temporal.accrualPeriodicity}
                                <ToolTip placement='bottom-end' maxWidth='550px' text={t('dataset.publishingFrequencyTooltip')}>
                                    <Icon svg={<InfoOutlineIcon fill='inherit' />} size='lg' ml={1} />
                                </ToolTip>
                            </>
                        )}
                    </Box>
                </Col>
            </Row>
            <Row className='pad-left-24 pad-right-24'>
                <Col sm={12} lg={12} className='pad-top-8'>
                    <ShowMore initialHeight={30}>
                        <div>
                            <Tag tagName={dataset.TAB} tagType={data.type} updateOnFilterBadgeHandler={updateOnFilterBadge}>
                                <SVGIcon name='dataseticon' fill='#113328' className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
                            </Tag>
                            {isCohortDiscovery && (
                                <Tag
                                    tagName='Cohort Discovery'
                                    tagType='project'
                                    updateOnFilterBadgeHandler={updateOnFilterBadge}
                                    showTagType={false}>
                                    <SVGIcon
                                        name='cohorticon'
                                        fill='#472505'
                                        className='badgeSvg mr-2'
                                        width='22'
                                        height='22'
                                        viewBox='0 0 10 10'
                                    />
                                </Tag>
                            )}

                            {phenotypesSearched && phenotypesSearched.length > 0 && (
                                <Tag
                                    key='phenotypes-searched'
                                    tagName={phenotypesSearched[0].name}
                                    activeLink={activeLink}
                                    onSearchPage={onSearchPage}
                                    updateOnFilterBadgeHandler={updateOnFilterBadge}
                                    showTagType
                                    {...dataset.PHENOTYPES}
                                />
                            )}

                            {phenotypesSelected &&
                                phenotypesSelected.map((phenotype, index) => {
                                    if (
                                        data.datasetfields.phenotypes.find(
                                            phenotypeCheck => phenotypeCheck.name.toLowerCase() === phenotype.toLowerCase()
                                        )
                                    ) {
                                        return (
                                            <Tag
                                                key={`phenotypes-selected-${index}`}
                                                tagName={phenotype}
                                                activeLink={activeLink}
                                                onSearchPage={onSearchPage}
                                                updateOnFilterBadgeHandler={updateOnFilterBadge}
                                                showTagType
                                                {...dataset.PHENOTYPES}
                                            />
                                        );
                                    }
                                    return null;
                                })}

                            {data.tags.features &&
                                data.tags.features.map((feature, index) => (
                                    <Tag
                                        key={`tag-${index}`}
                                        tagName={feature}
                                        activeLink={activeLink}
                                        onSearchPage={onSearchPage}
                                        updateOnFilterBadgeHandler={updateOnFilterBadge}
                                        {...dataset.FEATURES}
                                    />
                                ))}
                        </div>
                    </ShowMore>
                </Col>
                {!showRelationshipQuestion && <Description type={data.type} description={getDescription()} />}
            </Row>
            <Row className='pad-left-24 pad-right-24 pad-bottom-16'>
                <Col sm={12} lg={6}>
                    <NumberOfViews count={data.counter} />
                </Col>
                <Col sm={12} lg={6}>
                    <DeliveryLeadTime deliveryLeadTime={data.datasetv2?.accessibility?.access?.deliveryLeadTime} />
                </Col>
            </Row>
        </>
    );
};

Dataset.propTypes = {
    data: PropTypes.object.isRequired,
    activeLink: PropTypes.bool.isRequired,
    publisherLogo: PropTypes.string,
    showRelationshipQuestion: PropTypes.bool.isRequired,
    onSearchPage: PropTypes.bool.isRequired,
    isCohortDiscovery: PropTypes.bool.isRequired,
    updateOnFilterBadge: PropTypes.func.isRequired,
    removeButton: PropTypes.func.isRequired,
};

Dataset.defaultProps = {
    onClick: () => {},
};

export default Dataset;
