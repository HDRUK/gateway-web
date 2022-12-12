import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import SVGIcon from '../../images/SVGIcon';
import axios from 'axios';
import Loading from './Loading';
import ReactMarkdown from 'react-markdown';
import './CommonComponents.scss';

var baseURL = require('./BaseURL').getURL();

class Project extends React.Component {
    // initialize our state
    state = {
        data: [],
        isLoading: true,
        activeLink: true,
    };

    constructor(props) {
        super(props);
        this.state.activeLink = props.activeLink;
        if (props.data) {
            this.state.data = props.data;
            this.state.isLoading = false;
        } else if (props.id) {
            this.state.id = props.id;
            this.getDataSearchFromDb();
        }
    }

    getDataSearchFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/projects/' + this.state.id).then(res => {
            this.setState({
                data: res.data.data[0],
                isLoading: false,
            });
        });
    };

    render() {
        let { data, isLoading, activeLink } = this.state;
        data = {
            ...data,
            datasetids: data.datasetids || [],
            toolids: data.toolids || [],
        };

        if (isLoading) {
            return <Loading />;
        }

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
                                <SVGIcon name='projecticon' width={20} height={24} fill={'#3db28c'} />
                            </Col>
                            <Col xs={10} lg={8}>
                                <p>
                                    {activeLink === true ? (
                                        <span>
                                            <a className='black-16' style={{ cursor: 'pointer' }} href={'/project/' + data.id}>
                                                {data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}
                                            </a>
                                        </span>
                                    ) : (
                                        <span className='black-16'>{data.name.substr(0, 75) + (data.name.length > 75 ? '...' : '')}</span>
                                    )}
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
                                                                  <span className='reviewTitleGap gray800-14'>·</span>
                                                                  <a className='gray800-14' href={'/person/' + person.id}>
                                                                      {person.firstname} {person.lastname}
                                                                  </a>
                                                              </span>
                                                          );
                                                      } else {
                                                          return (
                                                              <span className='gray800-14'>
                                                                  <span className='reviewTitleGap gray800-14'>·</span>
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
                            <Col xs={{ span: 12, order: 2 }} lg={{ span: 3, order: 1 }} className='dateHolder mt-2'>
                                <span className='gray700-13 pr-1'>Updated</span>
                                <span className='gray700-13 pr-1'>{updatedOnDate}</span>
                            </Col>

                            <Col xs={{ span: 2, order: 0 }} lg={{ span: 1, order: 2 }}></Col>
                            <Col xs={{ span: 10, order: 0 }} lg={{ span: 11, order: 2 }}>
                                <p className='gray800-14'>
                                    {!data.toolids.length ? (
                                        ''
                                    ) : (
                                        <span className='mr-1'>
                                            <b>
                                                {!data.toolids.length ? '' : data.toolids.length}
                                                {data.toolids.length === 1 ? ' tool' : ' tools'}
                                            </b>
                                        </span>
                                    )}

                                    {!data.datasetids.length ? (
                                        ''
                                    ) : (
                                        <span className='mr-1'>
                                            {data.toolids.length ? ', ' : ''}
                                            <b>
                                                {!data.datasetids.length ? '' : data.datasetids.length}
                                                {data.datasetids.length === 1 ? ' data set' : ' data sets'}
                                            </b>
                                        </span>
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

export default Project;
