import React, { Component } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import SearchBar from '../commonComponents/SearchBar';
// import DataSet from '../commonComponents/DataSet';
import DataSet from '../commonComponents/DataSetOld';

import Tool from '../commonComponents/Tool';
import NotFound from '../commonComponents/NotFound';
import ReviewsTitle from '../commonComponents/ReviewTitle';
import Loading from '../commonComponents/Loading'
import Project from '../commonComponents/Project';
// import ReactGA from 'react-ga'; 
import {PageView, initGA} from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class PersonDetail extends Component {

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
      firstName: null
    }]
  };

  constructor(props) {
    super(props);
    this.state.userState = props.userState;
  }

  // on loading of tool detail page
  componentDidMount() {
    this.getDataSearchFromDb();
    initGA('UA-166025838-1');
    PageView();
  }

  // on loading of tool detail page were id is different
  componentDidUpdate() {
    if (this.props.match.params.personID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
      this.getDataSearchFromDb();
    }
  }

  getDataSearchFromDb = () => {
    //need to handle error if no id is found
    this.setState({ isLoading: true });
    axios.get(baseURL + '/api/v1/person/' + this.props.match.params.personID)
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
    const { searchString, data, isLoading, userState } = this.state;

    if (isLoading) {
      return <Container><Loading /></Container>;
    }

    if (typeof data.datasetids === 'undefined') {
      data.datasetids = [];
    }

    var tools = []
    var projects = []

    if (data.tools.length > 0) {
        data.tools.forEach(object => {
          if (object.type === 'tool') {
            tools.push(object);
          } 
          else if (object.type === 'project') {
            projects.push(object)
          }
        });
    }

    return (
      <div>
        <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
        <Container className="mb-5">

          <PersonTitle data={data} />

          <Row className="mt-3">

            <Col sm={1} lg={1} />
            <Col sm={10} lg={10}>
              <div>
                <Tabs className='TabsBackground Gray700-13px'>
                  <Tab eventKey="Tools" title={'Tools (' + tools.length + ')'}>
                    {tools.length <= 0 ? <NotFound word="tools" /> : tools.map((tool) => {
                      return <Tool id={tool.id} />
                    })}
                  </Tab>
                  <Tab eventKey="Reviews" title={'Reviews (' + data.reviews.length + ')'}>
                    {data.reviews.length <= 0 ? <NotFound word="reviews" /> : data.reviews.map((review) => {
                      return <ReviewsTitle id={review.reviewID} />
                    })}

                  </Tab>
                  <Tab eventKey="Data sets" title={'Data sets (' + data.datasetids.length + ')'}>
                    {data.datasetids.length <= 0 ? <NotFound word="data sets" /> : data.datasetids.map(id => <DataSet id={id} />)}
                  </Tab>
                  <Tab eventKey="Projects" title={'Projects (' + projects.length + ')'}>
                    {projects.length <= 0 ? <NotFound word="projects" /> : projects.map((project) => {
                      return <Project id={project.id} />
                    })}
                  </Tab>
                </Tabs>
              </div>
            </Col>
            <Col sm={1} lg={1} />
          </Row>
        </ Container>
      </div>
    );
  }
}

class PersonTitle extends Component {

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

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;

    return (
      <div>
        <Row className="mt-2">
          <Col sm={1} lg={1} />
          <Col sm={10} lg={10}>
            <div className="Rectangle">
                <Row>
                  <Col sm={10} className="text-left ">
                    <p className="Black-20px"> {data.firstname} {data.lastname} </p>
                    {!data.bio ? '' : <p className='Gray800-14px'> {data.bio} </p>}
                  </Col>
                  <Col sm={2} className="text-right">
                    <div class="avatar-circle">
                      <span class="initials">{data.firstname.charAt(0).toUpperCase()}{data.lastname.charAt(0).toUpperCase()}</span>
                    </div>
                  </Col>
                </Row>

                <Row>
                  {!data.orcid ? '' :
                    <Col xs={12} md={12}>
                      <span className='Gray800-14px'> ORCID </span>
                      <span className='Purple-14px'> {data.orcid} </span>
                    </Col>
                  }
                </Row>

                <Row>
                  {!data.link ? '' :
                    <Col xs={12} md={12}>
                      <span>
                        <a href={data.link} className="Purple-14px">
                          {data.link}
                        </a>
                      </span>
                    </Col>
                  }
                </Row>

                <Row>
                  <Col className="mt-2">
                    <span className='Gray800-14px'>
                      {data.counter === undefined ? 1 : data.counter + 1}
                      {data.counter === undefined ? ' view' : ' views'}
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

export default PersonDetail;