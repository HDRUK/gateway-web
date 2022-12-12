import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import '../../../css/styles.scss';

var baseURL = require('../../commonComponents/BaseURL').getURL();

class PersonTitle extends Component {
    // initialize our state
    state = {
        data: this.props.data || [],
    };

    componentDidMount(props) {
        let counter = !this.props.data.counter ? 1 : this.props.data.counter + 1;
        this.updateCounter(this.props.data.id, counter);
    }

    updateCounter = (id, counter) => {
        axios.post(baseURL + '/api/v1/counter/update', { id: id, counter: counter });
    };

    render() {
        const {
            firstname,
            lastname,
            tags,
            organisation,
            bio,
            orcid,
            link,
            sector,
            counter,
            showOrganisation,
            showBio,
            showDomain,
            showOrcid,
            showLink,
            showSector,
        } = this.state.data;

        return (
            <div>
                <Row className='mt-2'>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div className='rectangle'>
                            <Row>
                                <Col sm={10} className='text-left '>
                                    <Row className='black-20'>
                                        {' '}
                                        <Col>
                                            {firstname} {lastname}{' '}
                                        </Col>
                                    </Row>
                                    <Row className='black-14'>
                                        {' '}
                                        <Col>{showOrganisation ? organisation : ''} </Col>
                                    </Row>

                                    {!tags || !tags.topics || tags.topics.length <= 0 || !showDomain ? (
                                        ''
                                    ) : (
                                        <Row sm={10} className='gray800-14 pt-2 pb-3'>
                                            <Col>
                                                {tags.topics.map((obj, i) => {
                                                    return (
                                                        <a href={`/search?search=&tooltopics=${obj}&tab=Tools`}>
                                                            <div className='badge-tag' key={i}>
                                                                <span>{obj}</span>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </Col>
                                        </Row>
                                    )}

                                    {!bio || !showBio ? '' : <p className='gray800-14 text-break'> {bio} </p>}
                                </Col>
                                <Col sm={2} className='text-right'>
                                    <div class='avatar-circle'>
                                        <span class='initials'>
                                            {firstname.charAt(0).toUpperCase()}
                                            {lastname.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            {!orcid || !showOrcid ? (
                                ''
                            ) : (
                                <Row>
                                    <Col xs={1} md={1}>
                                        <span className='gray600-14'> ORCID </span>
                                    </Col>
                                    <Col xs={9} md={9}>
                                        <a href={orcid} rel='noopener noreferrer' target='_blank' className='purple-14 text-break'>
                                            {orcid}
                                        </a>
                                    </Col>
                                </Row>
                            )}

                            {!link || !showLink ? (
                                ''
                            ) : (
                                <Row>
                                    <Col xs={1} md={1}>
                                        <span className='gray600-14'> URL </span>
                                    </Col>
                                    <Col xs={11} md={9}>
                                        <a href={link} rel='noopener noreferrer' target='_blank' className='purple-14 text-break'>
                                            {link}
                                        </a>
                                    </Col>
                                </Row>
                            )}

                            {!sector || !showSector ? (
                                ''
                            ) : (
                                <Row>
                                    <Col xs={1} md={1}>
                                        <span className='gray600-14'> Sector </span>
                                    </Col>
                                    <Col xs={11} md={11}>
                                        <span className='gray800-14'> {sector} </span>
                                    </Col>
                                </Row>
                            )}

                            <Row>
                                <Col className='mt-2'>
                                    <span className='gray800-14'>
                                        {counter === undefined ? 1 : counter + 1}
                                        {counter === undefined ? ' view' : ' views'}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1} lg={1} />
                </Row>
            </div>
        );
    }
}

export default PersonTitle;
