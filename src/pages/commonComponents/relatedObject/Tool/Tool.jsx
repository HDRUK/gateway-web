/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { stripMarkdown } from '../../../../utils/GeneralHelper.util';
import SVGIcon from '../../../../images/SVGIcon';
import RemoveButton from '../RemoveButton/RemoveButton';
import Title from '../Title/Title';
import Description from '../Description/Description';
import Tag from '../Tag/Tag';
import '../../CommonComponents.scss';

const Tool = ({ data, activeLink, onSearchPage, showRelationshipQuestion, updateOnFilterBadge, removeButton }) => {
	return (
		<Row className='noMargin'>
			<Col sm={10} lg={10} className='pad-left-24'>
				<Title activeLink={activeLink} name={data.name} id={data.id} type='tool' />
				<br />
				{!data.persons || data.persons <= 0 ? (
					<span className='gray800-14'>Author not listed</span>
				) : (
					data.persons.map((person, index) => {
						if (activeLink === true) {
							return (
								<a className='gray800-14' href={'/person/' + person.id} key={`person-${index}`} data-testid={`tool-person-${person.id}`}>
									{person.firstname} {person.lastname}
									{data.persons.length === index + 1 ? '' : ', '}
								</a>
							);
						} else {
							return (
								<span className='gray800-14' key={`person-${index}`} data-testid={`tool-person-${person.id}`}>
									{person.firstname} {person.lastname}
									{data.persons.length === index + 1 ? '' : ', '}
								</span>
							);
						}
					})
				)}
			</Col>
			<Col sm={2} lg={2} className='pad-right-24'>
				{showRelationshipQuestion && <RemoveButton removeButtonHandler={removeButton} />}
			</Col>
			<Col className='pad-left-24 pad-right-24 pad-top-16'>
				<Tag
					tagName='Tool'
					tagType='tool'
					activeLink={false}
					onSearchPage={false}
					parentKey=''
					url='/search?search=&tab=Tools'
					updateOnFilterBadgeHandler={updateOnFilterBadge}
					showTagType={false}>
					<SVGIcon name='newtoolicon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
				</Tag>
				{data.categories.category && (
					<Tag
						tagName={data.categories.category}
						tagType='tag'
						activeLink={activeLink}
						onSearchPage={onSearchPage}
						parentKey='toolcategories'
						filter='toolCategoriesSelected'
						url='/search?search=&tab=Tools&toolcategories='
						updateOnFilterBadgeHandler={updateOnFilterBadge}
						showTagType={false}
					/>
				)}

				{data.programmingLanguage &&
					data.programmingLanguage.length > 0 &&
					data.programmingLanguage.map((p, i) => {
						return (
							<Tag
								key={`toolprogrammingLanguage-${i}`}
								tagName={p.programmingLanguage}
								tagType='version'
								activeLink={activeLink}
								onSearchPage={onSearchPage}
								parentKey='toolprogrammingLanguage'
								filter='toolProgrammingLanguageSelected'
								url='/search?search=&tab=Tools&toolprogrammingLanguage='
								updateOnFilterBadgeHandler={updateOnFilterBadge}
								showTagType={false}
								version={p.version}
							/>
						);
					})}

				{data.tags.features &&
					data.tags.features.length > 0 &&
					data.tags.features.map((feature, index) => {
						return (
							<Tag
								key={`toolfeatures-${index}`}
								tagName={feature}
								tagType='tag'
								activeLink={activeLink}
								onSearchPage={onSearchPage}
								parentKey='toolfeatures'
								filter='toolFeaturesSelected'
								url='/search?search=&tab=Tools&toolfeatures='
								updateOnFilterBadgeHandler={updateOnFilterBadge}
								showTagType={false}
							/>
						);
					})}

				{data.tags.topics &&
					data.tags.topics.length > 0 &&
					data.tags.topics.map((topic, index) => {
						return (
							<Tag
								key={`tooltopics-${index}`}
								tagName={topic}
								tagType='tag'
								activeLink={activeLink}
								onSearchPage={onSearchPage}
								parentKey='tooltopics'
								filter='toolTopicsSelected'
								url='/search?search=&tab=Tools&tooltopics='
								updateOnFilterBadgeHandler={updateOnFilterBadge}
								showTagType={false}
							/>
						);
					})}
			</Col>
			{!showRelationshipQuestion && <Description type={data.type} description={stripMarkdown(data.description, 255)} />}
		</Row>
	);
};

Tool.propTypes = {
	data: PropTypes.object.isRequired,
	activeLink: PropTypes.bool.isRequired,
	showRelationshipQuestion: PropTypes.bool.isRequired,
	onSearchPage: PropTypes.bool.isRequired,
	updateOnFilterBadge: PropTypes.func.isRequired,
	removeButton: PropTypes.func.isRequired,
};

export default Tool;
