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
import { paper } from './constants';
import * as styles from './Paper.styles';
import '../../CommonComponents.scss';

const Paper = ({ data, activeLink, onSearchPage, showRelationshipQuestion, updateOnFilterBadge, removeButton, isLocked }) => {
    return (
        <Row data-test-id='related-paper-object' className='noMargin'>
            <Col sm={10} lg={10} className='pad-left-24'>
                <Title activeLink={activeLink} name={data.name} id={data.id} type='paper' />
                <div className='gray800-14' css={styles.author}>
                    {data.authorsNew}
                </div>

                <div className='gray800-14' css={styles.journal}>
                    {data.journal} {data.journalYear}
                </div>
            </Col>
            <Col sm={2} lg={2} className={isLocked ? 'lockSVG pad-right-24' : 'pad-right-24'}>
                {showRelationshipQuestion ? isLocked ? <LockSVG /> : <RemoveButton removeButtonHandler={removeButton} /> : ''}
            </Col>
            <Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
                <Tag tagName={paper.TAB} tagType={data.type} updateOnFilterBadgeHandler={updateOnFilterBadge}>
                    <SVGIcon name='newprojecticon' fill='#3c3c3b' className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
                </Tag>
                {data.tags.features &&
                    data.tags.features.map((feature, index) => {
                        return (
                            <Tag
                                key={`${feature}-${index}`}
                                tagName={feature}
                                activeLink={activeLink}
                                onSearchPage={onSearchPage}
                                updateOnFilterBadgeHandler={updateOnFilterBadge}
                                {...paper.FEATURES}
                            />
                        );
                    })}

                {data.tags.topics &&
                    data.tags.topics.map((topic, index) => {
                        return (
                            <Tag
                                key={`${topic}-${index}`}
                                tagName={topic}
                                activeLink={activeLink}
                                onSearchPage={onSearchPage}
                                updateOnFilterBadgeHandler={updateOnFilterBadge}
                                {...paper.TOPICS}
                            />
                        );
                    })}
            </Col>
            {!showRelationshipQuestion && <Description type={data.type} description={stripMarkdown(data.description, 255)} />}
        </Row>
    );
};

Paper.propTypes = {
    data: PropTypes.object.isRequired,
    activeLink: PropTypes.bool.isRequired,
    showRelationshipQuestion: PropTypes.bool.isRequired,
    onSearchPage: PropTypes.bool.isRequired,
    updateOnFilterBadge: PropTypes.func.isRequired,
    removeButton: PropTypes.func.isRequired,
};

export default Paper;
