
// /ShowObjects.js
import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Alert from 'react-bootstrap/Alert';

// import DataSet from '../commonComponents/DataSet';
import DataSet from '../commonComponents/DataSetOld';

import NotFound from '../commonComponents/NotFound';
import SearchBar from '../commonComponents/SearchBar';
import Tool from '../commonComponents/Tool';
import Loading from '../commonComponents/Loading'
import Creators from '../commonComponents/Creators';

// import ReactGA from 'react-ga'; 
import {PageView, initGA} from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class ProjectDetail extends Component {
  // initialize our state
  state = {
    searchString: null,
    id: '',
    data: [],
    isLoading: true,
    userState: [{
      loggedIn: false,
      role: "Reader",
      id: null,
      name: null
    }],
    projectAdded: false,
    projectEdited: false
  };

  constructor(props) {
    super(props);
    this.state.userState = props.userState;
  }

  // on loading of tool detail page
  componentDidMount() {
    if (!!window.location.search) {
      var values = queryString.parse(window.location.search);
      this.setState({ projectAdded: values.projectAdded });
      this.setState({ projectEdited: values.projectEdited });
    }
    this.getDataSearchFromDb();
    initGA('UA-166025838-1');
    PageView();
  }

  // on loading of tool detail page were id is different
  componentDidUpdate() {
    if (this.props.match.params.projectID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
      this.getDataSearchFromDb();
    }
  }

  getDataSearchFromDb = () => {
    //need to handle error if no id is found
    this.setState({ isLoading: true });
    axios.get(baseURL + '/api/v1/project/' + this.props.match.params.projectID)
      .then((res) => {
        this.setState({
          data: res.data.data[0],
          isLoading: false
        });
      })
  };

  doSearch = (e) => { //fires on enter on searchbar
    if (e.key === 'Enter') {
      if (!!this.state.searchString) {
        window.location.href = "/search?search=" + this.state.searchString + '&type=all';
      }
    }
  }

  updateSearchString = (searchString) => {
    this.setState({ searchString: searchString });
  }

  render() {
    const { searchString, data, isLoading, projectAdded, projectEdited, userState } = this.state;

    if (isLoading) {
      return <Container><Loading /></Container>;
    }

    if (typeof data.toolids === 'undefined') {
      data.toolids = [];
    }

    if (typeof data.datasetids === 'undefined') {
      data.datasetids = [];
    }

    if (typeof data.personids === 'undefined') {
      data.personids = [];
    }

    return (
      <div>
        <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
        <Container className="mb-5">

          {projectAdded ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Someone will review your project and let you know when it goes live</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {projectEdited ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Your project has been updated</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {data.activeflag === "review" ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="warning" className="mt-3">Your project is pending review. Only you can see this page.</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}


          <ProjectTitle data={data} />

          <Row>
            <Col sm={1} lg={1} />
            <Col sm={10} lg={10}>

              <Row className="mt-4">
                <Col sm={10} lg={10}>
                  <span className="Black500-16px">Authors ( {data.authors.length} )</span>
                </Col>
              </Row>
              <Row>
                {data.persons.map(author =>
                  <Col sm={6} lg={6}>
                    <Creators author={author} />
                  </Col>
                )}
              </Row>
            </Col>
            <Col sm={1} lg={1} />
          </Row>

          <Row className="mt-3">
            <Col sm={1} lg={1} />
            <Col sm={10} lg={10}>
              <div>
                <Tabs className='TabsBackground Gray700-13px'>
                  <Tab eventKey="Tools" title={'Tools used in this (' + data.toolids.length + ')'}>
                    {data.toolids.length <= 0 ? <NotFound word="tools" /> : data.toolids.map((id) => {
                      return <Tool id={id} />
                    })}
                  </Tab>
                  <Tab eventKey="Data sets" title={'Data sets used in this (' + data.datasetids.length + ')'}>
                    {data.datasetids.length <= 0 ? <NotFound word="data sets" /> : data.datasetids.map(id => <DataSet id={id} />)}
                  </Tab>
                </Tabs>
              </div>
            </Col>
            <Col sm={1} lg={1} />
          </Row>

        </Container>
      </div>
    );
  }
}

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
                                  <span className="Gray800-14px">
                                      {data.description}
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

export default ProjectDetail;