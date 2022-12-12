import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import SVGIcon from '../../images/SVGIcon';
import axios from 'axios';
import Loading from './Loading';
import ReactMarkdown from 'react-markdown';
import './CommonComponents.scss';

var baseURL = require('./BaseURL').getURL();

class Tool extends React.Component {
    // initialize our state
    state = {
        data: [],
        reviewData: [],
        isLoading: true,
        activeLink: true,
    };

    constructor(props) {
        super(props);
        this.state.activeLink = props.activeLink;
        if (props.data) {
            this.state.data = props.data;
            this.state.reviewData = this.state.data.reviews;
            this.state.isLoading = false;
        } else if (props.id) {
            this.state.id = props.id;
            this.getDataSearchFromDb();
        }
    }

    getDataSearchFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/tools/' + this.state.id).then(res => {
            this.setState({
                data: res.data.data[0],
                reviewData: res.data.reviewData,
                isLoading: false,
            });
        });
    };

    render() {
        let { data, isLoading, reviewData, activeLink } = this.state;
        if (isLoading) {
            return <Loading />;
        }

        var ratingsTotal = 0;
        if (reviewData && reviewData.length > 0) {
            reviewData.forEach(review => {
                ratingsTotal = ratingsTotal + review.rating;
            });
        }

        const ratingsCount = !!reviewData ? reviewData.length : 0;
        const avgRating = !!reviewData && reviewData.length > 0 ? ratingsTotal / ratingsCount : '';

        data = {
            ...data,
            datasetids: data.datasetids || [],
            projectids: data.projectids || [],
            authors: data.authors || [],
        };

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        var updatedDate = new Date(data.updatedon);
        var updatedOnDate = monthNames[updatedDate.getMonth()] + ' ' + updatedDate.getFullYear();

        return (
            <Row className='mt-2'>
                <Col>
                    <div
                        className={
                            this.props.tempRelatedObjectIds && this.props.tempRelatedObjectIds.some(object => object.objectId === data.id)
                                ? 'rectangle selectedBorder'
                                : 'rectangle'
                        }
                        onClick={() => !activeLink && this.props.doAddToTempRelatedObjects(data.id, data.type)}
                    >
                        {data.activeflag === 'review' ? (
                            <Row>
                                <Col sm={12} lg={12}>
                                    <Alert variant='warning' className='ml-4 mr-4'>
                                        This resource is under review. It won't be visible to others until it is approved.
                                    </Alert>
                                </Col>
                            </Row>
                        ) : (
                            ''
                        )}

                        <Row>
                            <Col xs={2} lg={1} className='iconHolder'>
                                <SVGIcon name='toolicon' width={18} height={18} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={8}>
                                <p>
                                    {activeLink === true ? (
                                        <span>
                                            {' '}
                                            <a className='black-16' href={'/tool/' + data.id}>
                                                {data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}
                                            </a>
                                        </span>
                                    ) : (
                                        <span className='black-16'>{data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}</span>
                                    )}
                                    <br />
                                    <span className='gray500-13'>
                                        <span className='gray500-13'>
                                            {!!ratingsTotal && ratingsCount === 1 ? ratingsCount + ' review' : ratingsCount + ' reviews'}
                                            <span className='reviewTitleGap'>·</span>
                                            {avgRating === 0 ? 'No average rating' : Math.round(avgRating * 10) / 10 + ' average rating'}
                                        </span>
                                    </span>
                                    <br />
                                    <br />
                                    <span className='gray800-14'>
                                        {data.persons <= 0
                                            ? 'Author not listed'
                                            : data.persons.map((person, index) => {
                                                  if (index > 0) {
                                                      if (activeLink === true) {
                                                          return (
                                                              <span>
                                                                  <span className='reviewTitleGap'>·</span>
                                                                  <a className='gray800-14' href={'/person/' + person.id}>
                                                                      {person.firstname} {person.lastname}
                                                                  </a>
                                                              </span>
                                                          );
                                                      } else {
                                                          return (
                                                              <span className='gray800-14'>
                                                                  <span className='reviewTitleGap'>·</span>
                                                                  {person.firstname} {person.lastname}
                                                              </span>
                                                          );
                                                      }
                                                  } else {
                                                      if (activeLink === true) {
                                                          return (
                                                              <span>
                                                                  <a className='gray800-14' href={'/person/' + person.id}>
                                                                      {person.firstname} {person.lastname}
                                                                  </a>
                                                              </span>
                                                          );
                                                      } else {
                                                          return (
                                                              <span className='gray800-14'>
                                                                  {person.firstname} {person.lastname}
                                                              </span>
                                                          );
                                                      }
                                                  }
                                              })}
                                    </span>
                                </p>
                            </Col>
                            <Col xs={{ span: 12, order: 3 }} lg={{ span: 3, order: 1 }} className='dateHolder mt-2'>
                                <span className='gray700-13 pr-1'>Updated</span>
                                <span className='gray700-13 pr-1'>{updatedOnDate}</span>
                            </Col>

                            <Col xs={{ span: 2, order: 0 }} lg={{ span: 1, order: 2 }}></Col>
                            <Col xs={{ span: 10, order: 0 }} lg={{ span: 11, order: 2 }}>
                                <p className='gray800-14'>
                                    {data.projectids && data.projectids.length ? (
                                        <span className='mr-1'>
                                            <b>
                                                {!data.projectids.length ? '' : data.projectids.length}
                                                {data.projectids.length === 1 ? ' project' : ' projects'}
                                            </b>
                                        </span>
                                    ) : (
                                        ''
                                    )}

                                    <ReactMarkdown
                                        source={data.description.substr(0, 160) + (data.description.length > 160 ? '...' : '')}
                                    />
                                </p>
                            </Col>

                            <Col xs={{ span: 12, order: 1 }} lg={{ span: 12, order: 3 }}>
                                {!data.categories.category ? (
                                    ''
                                ) : activeLink === true ? (
                                    <a href={'/search?search=' + data.categories.category}>
                                        <div className='badge-tag'>{data.categories.category}</div>
                                    </a>
                                ) : (
                                    <div className='badge-tag'>{data.categories.category}</div>
                                )}

                                {!data.categories.programmingLanguage || data.categories.programmingLanguage.length <= 0
                                    ? ''
                                    : data.categories.programmingLanguage.map(language => {
                                          if (activeLink === true) {
                                              return (
                                                  <a href={'/search?search=' + language}>
                                                      <div className='badge-tag'>{language}</div>
                                                  </a>
                                              );
                                          } else {
                                              return <div className='badge-tag'>{language}</div>;
                                          }
                                      })}

                                {!data.tags.features || data.tags.features.length <= 0
                                    ? ''
                                    : data.tags.features.map(feature => {
                                          if (activeLink === true) {
                                              return (
                                                  <a href={'/search?search=' + feature}>
                                                      <div className='badge-tag'>{feature}</div>
                                                  </a>
                                              );
                                          } else {
                                              return <div className='badge-tag'>{feature}</div>;
                                          }
                                      })}

                                {!data.tags.topics || data.tags.topics.length <= 0
                                    ? ''
                                    : data.tags.topics.map(topic => {
                                          if (activeLink === true) {
                                              return (
                                                  <a href={'/search?search=' + topic}>
                                                      <div className='badge-tag'>{topic}</div>
                                                  </a>
                                              );
                                          } else {
                                              return <div className='badge-tag'>{topic}</div>;
                                          }
                                      })}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Tool;
