
// /ShowObjects.js
import React, { Component } from 'react';
import axios from 'axios';
import Rating from 'react-rating';
import queryString from 'query-string';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Alert from 'react-bootstrap/Alert';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import NotFound from '../commonComponents/NotFound';
import DataSet from '../commonComponents/DataSetOld';

import Creators from '../commonComponents/Creators';
import Loading from '../commonComponents/Loading'
import Reviews from '../commonComponents/Reviews';
import Project from '../commonComponents/Project';
import SearchBar from '../commonComponents/SearchBar';
import DiscourseTopic from '../commonComponents/DiscourseTopic';

import { ReactComponent as EmptyStarIconSvg } from '../../images/starempty.svg'
import { ReactComponent as FullStarIconSvg } from '../../images/star.svg';
import 'react-tabs/style/react-tabs.css';

// import ReactGA from 'react-ga'; 
import {PageView, initGA} from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class ToolDetail extends Component {

  // initialize our state
  state = {
    id: '',
    data: [],
    reviewData: [],
    key: 'Reviews',
    activeKey: false,
    selectedItem: 'tab-1',
    isLoading: true,
    userState: [{
      loggedIn: false,
      role: "Reader",
      id: null,
      name: null
    }],
    toolAdded: false,
    toolEdited: false,
    reviewAdded: false,
    replyAdded: false,
    discourseTopic: null
  };

  constructor(props) {
    super(props);
    this.state.userState = props.userState;
  }

  // on loading of tool detail page
  componentDidMount() {
    if (!!window.location.search) {
      var values = queryString.parse(window.location.search);
      this.setState({ toolAdded: values.toolAdded });
      this.setState({ toolEdited: values.toolEdited });
      this.setState({ reviewAdded: values.reviewAdded });
      this.setState({ replyAdded: values.replyAdded })
    }

    this.getDataSearchFromDb();
    initGA('UA-166025838-1');
    PageView();
    this.getDataSearchFromDb(); 
  }


  // on loading of tool detail page were id is different
  componentDidUpdate() {
    if (this.props.match.params.toolID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
      this.getDataSearchFromDb();
    }
  }

  getDataSearchFromDb = () => {
    //need to handle error if no id is found
    this.setState({ isLoading: true });
    axios.get(baseURL + '/api/v1/tools/' + this.props.match.params.toolID)
      .then((res) => {
        this.setState({
          data: res.data.data[0],
          reviewData: res.data.reviewData,
          discourseTopic: res.data.discourseTopic,
          isLoading: false
        });
        document.title = res.data.data[0].name.trim();
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
    const { searchString, data, isLoading, userState, toolAdded, toolEdited, reviewAdded, replyAdded, reviewData, discourseTopic } = this.state;

    if (isLoading) {
      return <Container><Loading /></Container>;
    }

    if (typeof data.datasetids === 'undefined') {
      data.datasetids = [];
    }

    if (typeof data.projectids === 'undefined') {
      data.projectids = [];
    }

    return (
      <div>
        <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
        <Container className="mb-5">

          {toolAdded ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Someone will review your tool and let you know when it goes live</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {toolEdited ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Your tool has been updated</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {data.activeflag === "review" ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="warning" className="mt-3">Your tool is pending review. Only you can see this page.</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {reviewAdded ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="warning" className="mt-3">Done! Your review is pending review.</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {replyAdded ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Your reply has been added.</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          <ToolTitle data={data} reviewData={reviewData} />

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
                    <Creators key={author.id} author={author} />
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
                  <Tab eventKey="Reviews" title={'Reviews (' + reviewData.length + ')'}>
                    <Reviews data={data} userState={userState} reviewData={reviewData} />
                  </Tab>
                  <Tab eventKey="Collaboration" title={`Discussion (${discourseTopic && discourseTopic.posts ? discourseTopic.posts.length : 0})`}>
                    <DiscourseTopic topic={discourseTopic} toolId={data.id} userState={userState} />
                  </Tab>
                  <Tab eventKey="Projects" title={'Projects using this (' + data.projectids.length + ')'}>
                    {data.projectids.length <= 0 ? <NotFound word="projects" /> : data.projectids.map(id => <Project id={id} />)}
                  </Tab>
                  <Tab eventKey="Data sets" title={'Data sets in the same projects (' + data.datasetids.length + ')'}>
                    {data.datasetids.length <= 0 ? <NotFound word="data sets" /> : data.datasetids.map(id => <DataSet id={id} />)}
                  </Tab>
                </Tabs>
              </div>
            </Col>
            <Col sm={1} lg={1} />
          </Row>
        </Container>
        <Navbar fixed="bottom" className="mr-5 mb-5" >
          <Nav className="ml-auto">
            <Row>
              <p>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSeY13LesZ_oMAH_qFdb2cS6b3s7wSf3DQJdwdxGdBcn_gxrfw/viewform" target="_blank" rel="noopener noreferrer" className="Purple-14px" id="UnderlinedLink">
                  Send feedback
                </a>
              </p>
            </Row>
          </Nav>
        </Navbar>

        <Navbar fixed="bottom" className="mr-5 mb-2" >
          <Nav className="ml-auto">
            <Row>
              <p>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfadX38bzD5qId2GARODJ7Mv4qHktYoEWY0fL7DcAFmbUuyxw/viewform" target="_blank" rel="noopener noreferrer" className="Purple-14px" id="UnderlinedLink">
                  Report a problem
                </a>
              </p>
            </Row>
          </Nav>
        </Navbar>

        <Row className='AuthorCard' />
      </div>
    );
  }
}

class ToolTitle extends Component {

  constructor(props) {
      super(props)
      this.state.data = props.data;
      this.state.reviewData = props.reviewData;
  }

  // initialize our state
  state = {
      data: [],
      id: this.props.data.id,
      counter: this.props.data.counter,
      reviewData: []
  };

  componentDidMount(props) {
    let counter = !this.props.data.counter ? 1 : this.props.data.counter + 1;
    this.UpdateCounter(this.props.data.id, counter);
  }

  UpdateCounter = (id, counter) => {
      axios.post(baseURL + '/api/v1/counter/update', { id: id, counter: counter });
  }

  render() {
      const { data, reviewData } = this.state;
      var ratingsTotal = 0;

      if (reviewData.length > 0) {
          reviewData.forEach(review => {
              ratingsTotal = ratingsTotal + review.rating;
          });
      }

      const ratingsCount = (reviewData ? reviewData.length : 0);
      const avgRating = (reviewData.length > 0) ? (ratingsTotal / ratingsCount) : '';
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
                              <Col md={12} lg={6} className="mb-3">
                                  {!data.categories.category ? '' : <div className="mr-2 Gray800-14px tagBadges"><a href={'/search?search=' + data.categories.category + '&type=all'}>{data.categories.category}</a></div>}

                                  {!data.categories.programmingLanguage || data.categories.programmingLanguage <= 0 ? '' : data.categories.programmingLanguage.map((language) => {
                                      return <div className="mr-2 Gray800-14px tagBadges"><a href={'/search?search=' + language + '&type=all'}>{language}</a></div>
                                  })}

                                  {!data.categories.programmingLanguageVersion ? '' : <div className="mr-2 Gray800-14px tagBadges"><a href={'/search?search=' + data.categories.programmingLanguageVersion + '&type=all'}>{data.categories.programmingLanguageVersion}</a></div>}
                              </Col>
                              <Col md={12} lg={6} className="mb-1 pr-3 text-right">
                                  <div className="Gray500-13px">
                                      {!!ratingsTotal && ratingsCount === 1 ? ratingsCount + ' review' : ratingsCount + ' reviews'}
                                      <span className="reviewTitleGap">·</span>
                                      {avgRating === 0 ? 'No average rating' : (Math.round(avgRating * 10) / 10) + ' average'}
                                      <span className="reviewTitleGap">·</span>
                                      <Rating emptySymbol={<EmptyStarIconSvg />} fullSymbol={<FullStarIconSvg />}
                                          placeholderSymbol={<FullStarIconSvg />}
                                          placeholderRating={avgRating}
                                          readonly='true'
                                      />
                                  </div>
                              </Col>
                              <Row>
                                  <Col className="ml-3">
                                      <span className='Gray800-14px'>
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
                          {!data.license ? '' :
                              <Row>
                                  <span className="Gray800-14px ml-3"> License </span>
                                  <span className='Purple-14px ml-2'> {data.license}</span>
                              </Row>}
                      </div>
                  </Col>
                  <Col sm={1} lg={10} />
              </Row>
          </div>
      );
  }
}

export default ToolDetail;