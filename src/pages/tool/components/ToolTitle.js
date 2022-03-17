import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Rating from 'react-rating';
import { Row, Col } from 'react-bootstrap/';
import { ReactComponent as EmptyStarIconSvg } from '../../../images/starempty.svg';
import { ReactComponent as FullStarIconSvg } from '../../../images/star.svg';
import { baseURL } from '../../../configs/url.config';
import moment from 'moment';

class ToolTitle extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(props) {
        let counter = !this.props.data.counter ? 1 : this.props.data.counter + 1;
        this.updateCounter(this.props.data.id, counter);
    }

    updateCounter = (id, counter) => {
        axios.post(baseURL + '/api/v1/counter/update', { id, counter });
    };

    render() {
        const { data, reviewData } = this.props;
        let ratingsTotal = 0;
        if (reviewData && reviewData.length) {
            reviewData.forEach(review => {
                ratingsTotal = ratingsTotal + review.rating;
            });
        }
        const ratingsCount = reviewData ? reviewData.length : 0;
        const avgRating = reviewData.length > 0 ? ratingsTotal / ratingsCount : '';
        let updatedOnDate = moment(data.updatedon).format('MMMM YYYY');

        return (
            <div>
                <Row className='mt-2'>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div className='rectangle'>
                            <Row>
                                <Col xs={7} md={8}>
                                    <p>
                                        <span className='black-16' data-testid='title'>
                                            {data.name}
                                        </span>
                                        <br />
                                        <span>
                                            <a href={data.link} rel='noopener noreferrer' target='_blank' className='purple-14'>
                                                {data.link}
                                            </a>
                                        </span>
                                    </p>
                                </Col>
                                <Col xs={5} md={4} className='iconHolder'>
                                    <p>
                                        <span className='gray700-13 pr-1'>Updated</span>
                                        <span className='gray700-13 pr-1'>{updatedOnDate}</span>
                                    </p>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} lg={6} className='mb-3'>
                                    {!data.categories.category ? (
                                        ''
                                    ) : (
                                        <div className='badge-tag'>
                                            <a href={'/search?search=' + data.categories.category + '&type=all'}>
                                                {data.categories.category}
                                            </a>
                                        </div>
                                    )}

                                    {!data.categories.programmingLanguage || data.categories.programmingLanguage <= 0
                                        ? ''
                                        : data.categories.programmingLanguage.map((language, i) => {
                                              return (
                                                  <div className='badge-tag' key={i}>
                                                      <a href={'/search?search=' + language + '&type=all'}>{language}</a>
                                                  </div>
                                              );
                                          })}

                                    {!data.categories.programmingLanguageVersion ? (
                                        ''
                                    ) : (
                                        <div className='badge-tag'>
                                            <a href={'/search?search=' + data.categories.programmingLanguageVersion + '&type=all'}>
                                                {data.categories.programmingLanguageVersion}
                                            </a>
                                        </div>
                                    )}
                                </Col>
                                <Col md={12} lg={6} className='mb-1 pr-3 text-right'>
                                    <div className='gray500-13'>
                                        {!!ratingsTotal && ratingsCount === 1 ? ratingsCount + ' review' : ratingsCount + ' reviews'}
                                        <span className='reviewTitleGap'>·</span>
                                        {avgRating === 0 ? 'No average rating' : Math.round(avgRating * 10) / 10 + ' average'}
                                        <span className='reviewTitleGap'>·</span>
                                        <Rating
                                            emptySymbol={<EmptyStarIconSvg />}
                                            fullSymbol={<FullStarIconSvg />}
                                            placeholderSymbol={<FullStarIconSvg />}
                                            placeholderRating={avgRating}
                                            readonly='true'
                                        />
                                    </div>
                                </Col>
                                <Row>
                                    <Col className='ml-3'>
                                        <span className='gray800-14'>
                                            {data.counter === undefined ? 1 : data.counter + 1}
                                            {data.counter === undefined ? ' view' : ' views'}
                                        </span>
                                    </Col>
                                </Row>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
                <Row>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div className='rectangle'>
                            <Row>
                                <Col xs={12} md={12} className='mb-3'>
                                    {!data.tags.features || data.tags.features.length <= 0
                                        ? ''
                                        : data.tags.features.map((feature, i) => {
                                              return (
                                                  <div className='badge-tag mb-2 mt-2' key={i}>
                                                      <a href={'/search?search=' + feature + '&type=all'}>{feature}</a>
                                                  </div>
                                              );
                                          })}

                                    {!data.tags.topics || data.tags.topics.length <= 0
                                        ? ''
                                        : data.tags.topics.map((topic, i) => {
                                              return (
                                                  <div className='badge-tag mb-2 mt-2' key={i}>
                                                      <a href={'/search?search=' + topic + '&type=all'}>{topic}</a>
                                                  </div>
                                              );
                                          })}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={12} className='mb-3'>
                                    <span className='gray800-14 descriptionWhiteSpace'>
                                        <ReactMarkdown source={data.description} />
                                    </span>
                                </Col>
                            </Row>
                            {!data.license ? (
                                ''
                            ) : (
                                <Row>
                                    <span className='gray800-14 ml-3'> License </span>
                                    <span className='purple-14 ml-2'> {data.license}</span>
                                </Row>
                            )}
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
            </div>
        );
    }
}

export default ToolTitle;
