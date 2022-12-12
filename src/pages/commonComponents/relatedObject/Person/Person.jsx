/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import _ from 'lodash';
import RemoveButton from '../RemoveButton/RemoveButton';
import Title from '../Title/Title';
import '../../CommonComponents.scss';

const Person = ({ data, activeLink, showRelationshipQuestion, removeButton, onClick }) => {
    const name = data.firstname && data.lastname ? `${data.firstname} ${data.lastname}` : '';
    return (
        <Row data-testid='related-person-object' className='noMargin pad-left-24'>
            <Col className='iconHolder noPadding widthAuto'>
                <div className='avatar-circle' data-testid='avatar-circle'>
                    <span className='initials'>
                        {' '}
                        {data.firstname ? data.firstname.charAt(0).toUpperCase() : ''}
                        {data.lastname ? data.lastname.charAt(0).toUpperCase() : ''}
                    </span>
                </div>
            </Col>
            <Col className='pad-left-8' sm={8} lg={9}>
                <Title
                    id={data.id}
                    name={name}
                    type={data.type}
                    activeLink={activeLink}
                    onClickHandler={() => {
                        onClick();
                    }}
                >
                    <br />
                    <span className='gray800-14' data-testid='person-bio'>
                        {' '}
                        {data.bio}{' '}
                    </span>
                </Title>
            </Col>
            <Col sm={2} lg={2} className='pad-right-24'>
                {showRelationshipQuestion && <RemoveButton removeButtonHandler={removeButton} />}
            </Col>
        </Row>
    );
};

Person.propTypes = {
    data: PropTypes.object.isRequired,
    activeLink: PropTypes.bool.isRequired,
    showRelationshipQuestion: PropTypes.bool.isRequired,
    removeButton: PropTypes.func.isRequired,
};

Person.defaultProps = {
    onClick: () => {},
};

export default Person;
