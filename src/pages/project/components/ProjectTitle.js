import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

var baseURL = require('../../commonComponents/BaseURL').getURL();

class ProjectTitle extends Component {

    constructor(props) {
        super(props)
        this.state.data = props.data;
    }
  
    // initialize our state
    state = {
        data: [],
        id: this.props.data.id,
        counter: this.props.data.counter
    };
  
    componentDidMount(props) {
        let counter = !this.props.data.counter ? 1 : this.props.data.counter + 1;
        this.UpdateCounter(this.props.data.id, counter);
    }
  
    UpdateCounter = (id, counter) => {
        axios.post(baseURL + '/api/v1/counter/update', { id: id, counter: counter });
    }
  
    render() {
        const { data } = this.state;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var updatedDate = new Date(data.updatedon);
        var updatedOnDate = monthNames[updatedDate.getMonth()] + " " + updatedDate.getFullYear();
  
        return ( 
            
            <div>
                <Row className="mt-2">
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div className="Rectangle">
                            <Row>
                                <Col xs={7} md={8}>
                                    <p>
                                        <span className="Black-16px">{data.name}</span>
                                        <br />
                                        <span >
                                            <a href={data.link} rel="noopener noreferrer" target="_blank" className="Purple-14px">
                                                {data.link}
                                            </a>
                                        </span>
                                    </p>
                                </Col>
                                <Col xs={5} md={4} className="iconHolder">
                                    <p>
                                        <span className="Gray700-13px pr-1">
                                            Updated
                                </span>
                                        <span className="Gray700-13px pr-1">
                                            {updatedOnDate}
                                        </span>
                                    </p>
                                    <p>
  
                                    </p>
                                </Col>
                            </Row>
  
                            <Row>
                                <Col xs={12} md={12} >
                                    {!data.categories.category ? '' : <div className="mr-2 Gray800-14px tagBadges"><a href={'/search?search=' + data.categories.category + '&type=all'}>{data.categories.category}</a></div>}
  
                                    <Row>
                                        <Col className="mt-3">
                                            <span className='Gray800-14px'>
                                                {data.counter === undefined ? 1 : data.counter + 1}
                                                {data.counter === undefined ? ' view' : ' views'}
                                            </span>
                                        </Col>
                                    </Row>
  
                                    {!data.categories.programmingLanguage || data.categories.programmingLanguage <= 0 ? '' : data.categories.programmingLanguage.map((language) => {
                                        return <div className="mr-2 Gray800-14px tagBadges"><a href={'/search?search=' + language + '&type=all'}>{language}</a></div>
                                    })}
  
                                    {!data.categories.programmingLanguageVersion ? '' : <div className="mr-2 Gray800-14px tagBadges"><a href={'/search?search=' + data.categories.programmingLanguageVersion + '&type=all'}>{data.categories.programmingLanguageVersion}</a></div>}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
                <Row>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
  
                        <div className="Rectangle">
                            <Row>
                                <Col xs={12} md={12} className="mb-3">
  
                                    {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature) => {
                                        return <div className="mr-2 Gray800-14px tagBadges mb-2 mt-2"><a href={'/search?search=' + feature + '&type=all'}>{feature}</a></div>
                                    })}
  
                                    {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic) => {
                                        return <div className="mr-2 Gray800-14px tagBadges mb-2 mt-2"><a href={'/search?search=' + topic + '&type=all'}>{topic}</a></div>
                                    })}
  
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={12} className="mb-3">
                                    <span className="Gray800-14px descriptionWhiteSpace">
                                        <ReactMarkdown source={data.description} />
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
            </div>
        );
    }
  }

  export default ProjectTitle;