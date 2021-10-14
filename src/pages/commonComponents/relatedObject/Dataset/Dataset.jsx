/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import googleAnalytics from '../../../../tracking';
import { stripMarkdown } from '../../../../utils/GeneralHelper.util';
import SVGIcon from '../../../../images/SVGIcon';
import RemoveButton from '../RemoveButton/RemoveButton';
import Description from '../Description/Description';
import Tag from '../Tag/Tag';
import * as styles from './Dataset.styles';
import '../../CommonComponents.scss';
import '../RelatedObject.scss';

const Dataset = ({
	data,
	activeLink,
	publisherLogo,
	onSearchPage,
	showRelationshipQuestion,
	isCohortDiscovery,
	updateOnFilterBadge,
	removeButton,
}) => {
	const [publisherDetails, setPublisherDetails] = useState({ name: '', label: '' });

	const getPublisherDetails = useCallback(() => {
		let publisher = { name: '', label: '', showShield: false };
		if (!isEmpty(data.datasetv2)) {
			let name = data.datasetv2.summary.publisher.name.toUpperCase();
			publisher.name = name;
			publisher.label = name;
			publisher.showShield = !isNil(data.datasetv2.summary.publisher.memberOf) ? true : false;
		} else {
			let name = data.datasetfields.publisher;
			let publisherName = name.includes('>') ? name.split(' > ')[1].toUpperCase() : name.toUpperCase();
			publisher.name = publisherName;
			publisher.label = publisherName;
			publisher.showShield = false;
		}
		return publisher;
	}, [data.datasetv2, data.datasetfields.publisher]);

	useEffect(() => {
		let publisherDetails = getPublisherDetails();
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

	const phenotypesSelected = queryString.parse(window.location.search).phenotypes
		? queryString.parse(window.location.search).phenotypes.split('::')
		: [];
	const searchTerm = queryString.parse(window.location.search).search ? queryString.parse(window.location.search).search : '';
	const phenotypesSearched = data.datasetfields.phenotypes.filter(phenotype => phenotype.name.toLowerCase() === searchTerm.toLowerCase());
	return (
		<>
			<Row data-testid='related-dataset-object' className='noMargin'>
				<Col sm={10} lg={10} className='pad-left-24'>
					{activeLink ? (
						<a
							onClick={() => {
								googleAnalytics.recordEvent('Datasets', 'Clicked on dataset to open', `Dataset name: ${data.name}`);
							}}
							className='purple-bold-16'
							css={styles.pointer}
							href={'/dataset/' + data.pid}
							data-testid='dataset-title'>
							{data.name}
						</a>
					) : (
						<span className='black-bold-16' data-testid='dataset-title'>
							{' '}
							{data.name}{' '}
						</span>
					)}
					<br />
					{publisherDetails.showShield && (
						<span>
							<SVGIcon name='shield' fill={'#475da7'} className='svg-16 mr-2' viewBox='0 0 16 16' />
						</span>
					)}
					<span
						className={activeLink ? 'gray800-14 underlined' : 'gray800-14'}
						css={styles.pointer}
						onClick={() =>
							updateOnFilterBadge('publisher', {
								label: publisherDetails.label,
								parentKey: 'publisher',
							})
						}
						data-testid={`publisher-${publisherDetails.name}`}>
						{' '}
						{publisherDetails.name}{' '}
					</span>
				</Col>
				<Col sm={2} lg={2} className='pad-right-24'>
					{!isEmpty(publisherLogo) && (
						<div className='datasetLogoCircle floatRight' css={styles.publisherLogoCSS(publisherLogo)} data-testid='publisher-logo' />
					)}
					{showRelationshipQuestion && <RemoveButton removeButtonHandler={removeButton} />}
				</Col>
				<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
					<Tag
						tagName='Dataset'
						tagType='dataset'
						activeLink={false}
						onSearchPage={false}
						parentKey=''
						url='/search?search=&tab=Datasets'
						updateOnFilterBadgeHandler={updateOnFilterBadge}
						showTagType={false}>
						<SVGIcon name='dataseticon' fill={'#113328'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
					</Tag>
					{isCohortDiscovery && (
						<Tag
							tagName='Cohort Discovery'
							tagType='project'
							activeLink={false}
							onSearchPage={false}
							parentKey=''
							url='/search?search=&tab=Datasets'
							updateOnFilterBadgeHandler={updateOnFilterBadge}
							showTagType={false}>
							<SVGIcon name='cohorticon' fill={'#472505'} className='badgeSvg mr-2' width='22' height='22' viewBox='0 0 10 10' />
						</Tag>
					)}

					{phenotypesSearched && phenotypesSearched.length > 0 && (
						<Tag
							key={`phenotypes-searched`}
							tagName={phenotypesSearched[0].name}
							tagType='phenotype'
							activeLink={activeLink}
							onSearchPage={onSearchPage}
							parentKey='phenotypes'
							url='/search?search=&tab=Datasets&phenotypes='
							updateOnFilterBadgeHandler={updateOnFilterBadge}
							showTagType={true}
						/>
					)}

					{phenotypesSelected &&
						phenotypesSelected.length > 0 &&
						phenotypesSelected.map((phenotype, index) => {
							if (data.datasetfields.phenotypes.find(phenotypeCheck => phenotypeCheck.name.toLowerCase() === phenotype.toLowerCase())) {
								return (
									<Tag
										key={`phenotypes-selected-${index}`}
										tagName={phenotype}
										tagType='phenotype'
										activeLink={activeLink}
										onSearchPage={onSearchPage}
										parentKey='phenotypes'
										url='/search?search=&tab=Datasets&phenotypes='
										updateOnFilterBadgeHandler={updateOnFilterBadge}
										showTagType={true}
									/>
								);
							} else {
								return null;
							}
						})}

					{data.tags.features &&
						data.tags.features.length > 0 &&
						data.tags.features.map((feature, index) => {
							return (
								<Tag
									key={`tag-${index}`}
									tagName={feature}
									tagType='tag'
									activeLink={activeLink}
									onSearchPage={onSearchPage}
									parentKey='datasetfeatures'
									url='/search?search=&tab=Datasets&datasetfeatures='
									updateOnFilterBadgeHandler={updateOnFilterBadge}
									showTagType={false}
								/>
							);
						})}
				</Col>
				{!showRelationshipQuestion && <Description type={data.type} description={getDescription()} />}
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

export default Dataset;
