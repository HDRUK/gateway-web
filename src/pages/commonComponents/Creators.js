// /ShowObjects/Title.js
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ReactComponent as PersonPlaceholderSvg } from '../../images/person-placeholder.svg';
import './CommonComponents.scss';

class Creators extends Component {
    render() {
        const { author } = this.props;
        return (
            <span>
                <a data-testid='href' href={'/person/' + author.id}>
                    <div className='authorCardHolder'>
                        <Row className='authorCard ellipsis'>
                            <Col xs={1} sm={2} md={1}>
                                <PersonPlaceholderSvg />
                            </Col>
                            <Col xs={10} sm={10} md={10} className='text-left ellipsis'>
                                <span className='black-16' data-testid='name'>
                                    {' '}
                                    {author.firstname} {author.lastname}{' '}
                                </span>
                                <br />
                                <span className='gray700-13' data-testid='bio'>
                                    {' '}
                                    {author.bio ? (author.bio.length <= 44 ? author.bio : author.bio.slice(0, 44) + '...') : ''}{' '}
                                </span>
                            </Col>
                        </Row>
                    </div>
                </a>
            </span>
        );
    }
}

export default Creators;
