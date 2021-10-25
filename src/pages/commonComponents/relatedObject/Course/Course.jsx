/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { has, isEmpty, isString, isObject } from 'lodash';
import moment from 'moment';
import { ReactComponent as CalendarSvg } from '../../../../images/calendaricon.svg';
import { stripMarkdown } from '../../../../utils/GeneralHelper.util';
import SVGIcon from '../../../../images/SVGIcon';
import RemoveButton from '../RemoveButton/RemoveButton';
import Title from '../Title/Title';
import Description from '../Description/Description';
import Tag from '../Tag/Tag';
import { course } from './constants';
import '../../CommonComponents.scss';

const Course = ({ data, activeLink, onSearchPage, showRelationshipQuestion, updateOnFilterBadge, removeButton }) => {
	const renderCourseDetails = () => {
		const courseRender = [];
		const courseOptions = data.courseOptions;
		has(courseOptions[0], 'startDate') && isObject(courseOptions[0].startDate)
			? courseRender.push(
					<span data-testid='course-start-date'> Starts {moment(courseOptions.startDate).format('dddd Do MMMM YYYY')} </span>
			  )
			: courseRender.push(<span data-testid='course-start-date'> Flexible dates </span>);

		has(courseOptions[0], 'studyMode') &&
			isString(courseOptions[0].studyMode) &&
			courseRender.push(<span data-testid='course-study-mode'> | {courseOptions[0].studyMode} </span>);

		!onSearchPage &&
			!isEmpty(courseOptions[1]) &&
			courseOptions.map((courseOption, index) => {
				return courseRender.push(<>{index > 0 && <span data-testid='course-study-mode-extra'> ,{courseOption.studyMode} </span>}</>);
			});

		return courseRender;
	};
	return (
		<Row data-testid='related-course-object' className='noMargin'>
			<Col sm={10} lg={10} className='pad-left-24'>
				<Title activeLink={activeLink} name={data.title} id={data.id} type={data.type} />
				<br />
				<Title
					activeLink={false}
					name={data.provider}
					id={data.provider}
					type={data.type}
					className={activeLink ? 'gray800-14 underlined' : 'gray800-14'}
					onClickHandler={() => updateOnFilterBadge('courseProviderSelected', data.provider)}
				/>

				<Row className='margin-top-8'>
					<Col sm={12} lg={12}>
						<CalendarSvg className='calendarSVG' />
						<span className='gray800-14 margin-left-10'>{renderCourseDetails()}</span>
					</Col>
				</Row>
			</Col>
			<Col sm={2} lg={2} className='pad-right-24'>
				{showRelationshipQuestion && <RemoveButton removeButtonHandler={removeButton} />}
			</Col>
			<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
				<Tag tagName={course.TAB} tagType={data.type} updateOnFilterBadgeHandler={updateOnFilterBadge}>
					<SVGIcon name='educationicon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
				</Tag>

				{data.award &&
					data.award.map((award, index) => {
						return (
							<Tag
								key={`${award}-${index}`}
								tagName={award}
								activeLink={activeLink}
								onSearchPage={onSearchPage}
								updateOnFilterBadgeHandler={updateOnFilterBadge}
								{...course.AWARDS}
							/>
						);
					})}

				{data.domains &&
					data.domains.map((domain, index) => {
						return (
							<Tag
								key={`${domain}-${index}`}
								tagName={domain}
								activeLink={activeLink}
								onSearchPage={onSearchPage}
								updateOnFilterBadgeHandler={updateOnFilterBadge}
								{...course.DOMAINS}
							/>
						);
					})}
			</Col>
			{!showRelationshipQuestion && <Description type={data.type} description={stripMarkdown(data.description, 255)} />}
		</Row>
	);
};

Course.propTypes = {
	data: PropTypes.object.isRequired,
	activeLink: PropTypes.bool.isRequired,
	showRelationshipQuestion: PropTypes.bool.isRequired,
	onSearchPage: PropTypes.bool.isRequired,
	updateOnFilterBadge: PropTypes.func.isRequired,
	removeButton: PropTypes.func.isRequired,
};

export default Course;
