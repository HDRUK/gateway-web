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
import { ReactComponent as LockSVG } from '../../../../images/icon-security.svg';
import { tool } from './constants';
import '../../CommonComponents.scss';

const Tool = ({ data, activeLink, onSearchPage, showRelationshipQuestion, updateOnFilterBadge, removeButton, isLocked }) => {
    return (
        <Row className='noMargin'>
            <Col sm={10} lg={10} className='pad-left-24'>
                <Title activeLink={activeLink} name={data.name} id={data.id} type='tool' />
                <br />
                {!data.persons || data.persons <= 0 ? (
                    <span className='gray800-14'>Author not listed</span>
                ) : (
                    data.persons.map((person, index) => {
                        const name = `${person.firstname} ${person.lastname}${data.persons.length === index + 1 ? '' : ', '}`;
                        return (
                            <Title
                                className='gray800-14'
                                activeLink={activeLink}
                                name={name}
                                id={person.id}
                                type='person'
                                key={`person-${index}`}
                            />
                        );
                    })
                )}
            </Col>
            <Col sm={2} lg={2} className={isLocked ? 'lockSVG pad-right-24' : 'pad-right-24'}>
                {showRelationshipQuestion ? isLocked ? <LockSVG /> : <RemoveButton removeButtonHandler={removeButton} /> : ''}
            </Col>
            <Col className='pad-left-24 pad-right-24 pad-top-16'>
                <Tag tagName={tool.TAB} tagType={data.type} updateOnFilterBadgeHandler={updateOnFilterBadge}>
                    <SVGIcon name='newtoolicon' fill='#ffffff' className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
                </Tag>
                {data.categories.category && (
                    <Tag
                        tagName={data.categories.category}
                        activeLink={activeLink}
                        onSearchPage={onSearchPage}
                        updateOnFilterBadgeHandler={updateOnFilterBadge}
                        {...tool.CATEGORIES}
                    />
                )}

                {data.programmingLanguage &&
                    data.programmingLanguage.map((p, i) => {
                        return (
                            <Tag
                                key={`toolprogrammingLanguage-${i}`}
                                tagName={p.programmingLanguage}
                                activeLink={activeLink}
                                onSearchPage={onSearchPage}
                                updateOnFilterBadgeHandler={updateOnFilterBadge}
                                version={p.version}
                                {...tool.PL}
                            />
                        );
                    })}

                {data.tags.features &&
                    data.tags.features.map((feature, index) => {
                        return (
                            <Tag
                                key={`toolfeatures-${index}`}
                                tagName={feature}
                                activeLink={activeLink}
                                onSearchPage={onSearchPage}
                                updateOnFilterBadgeHandler={updateOnFilterBadge}
                                {...tool.FEATURES}
                            />
                        );
                    })}

                {data.tags.topics &&
                    data.tags.topics.map((topic, index) => {
                        return (
                            <Tag
                                key={`tooltopics-${index}`}
                                tagName={topic}
                                activeLink={activeLink}
                                onSearchPage={onSearchPage}
                                updateOnFilterBadgeHandler={updateOnFilterBadge}
                                {...tool.TOPICS}
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
