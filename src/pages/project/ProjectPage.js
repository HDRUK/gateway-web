
// /ShowObjects.js
import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import {Container, Row, Col, Tabs, Tab, Alert, Button } from 'react-bootstrap';
import moment from 'moment';

import RelatedObject from '../commonComponents/RelatedObject';
import NotFound from '../commonComponents/NotFound';
import SearchBar from '../commonComponents/SearchBar';
import Loading from '../commonComponents/Loading'
import Creators from '../commonComponents/Creators';
import ProjectTitle from './components/ProjectTitle';
import SVGIcon from '../../images/SVGIcon';
import DiscourseTopic from '../commonComponents/DiscourseTopic';


// import ReactGA from 'react-ga'; 
import {PageView, initGA} from '../../tracking';

import { axiosIG } from '../../utils/axios.util';

class ProjectDetail extends Component {
  // initialize our state
  state = {
    searchString: '',
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
    projectEdited: false,
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
    axiosIG.get('/api/v1/project/' + this.props.match.params.projectID)
      .then((res) => {
        this.setState({
          data: res.data.data[0],
          discourseTopic: res.data.discourseTopic,
          isLoading: false
        });
      })
  };

  doSearch = (e) => { //fires on enter on searchbar
    if (e.key === 'Enter') {
      if (!!this.state.searchString) {
        window.location.href = "/search?search=" + this.state.searchString;
      }
    }
  }

  updateSearchString = (searchString) => {
    this.setState({ searchString: searchString });
  }

  render() {
    const { searchString, data, isLoading, projectAdded, projectEdited, userState, discourseTopic } = this.state;

    if (isLoading) {
      return <Container><Loading /></Container>;
    }

    if (data.relatedObjects === null || typeof data.relatedObjects === 'undefined') {
        data.relatedObjects = [];
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


          {/* <ProjectTitle data={data} activeLink={true}/> */}

          <Row className="mt-4">
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        <div className="rectangle">
                            <Row>
                                <Col>
                                    <span className="black-20">{data.name}</span>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs={12}>
                                    <span className="projectBadge mr-2">
                                        <SVGIcon name="newestprojecticon" fill={'#ffffff'} className="badgeSvg mr-2" viewBox="-2 -2 22 22"/>
                                        <span>Project</span> 
                                    </span>

                                    <a href={'/search?search=' + data.categories.category}>
                                        <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{data.categories.category}</div>
                                    </a>
                                </Col>
                            </Row>

                            <Row className="mt-2">
                                <Col xs={12}>
                                    <span className="gray700-13">
                                        {data.counter === undefined ? 1 : data.counter + 1}
                                        {data.counter === undefined ? ' view' : ' views'}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>

          <Row>
            <Col sm={1} lg={1} />
            <Col sm={10} lg={10}>
              <div>
                <Tabs className='tabsBackground gray700-13'>
                    <Tab eventKey="About" title={'About'}>
                        <Row className="mt-2">
                            <Col sm={12} lg={12}>
                                <div className="rectangle">
                                    <Row className="gray800-14-bold">
                                        <Col sm={12}>
                                            Description
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col sm={12} className="gray800-14">
                                            <ReactMarkdown source={data.description} />
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    
                        <Row className="mt-2">
                            <Col sm={12}>
                                <div className="rectangle">
                                    <Row className="gray800-14-bold">
                                        <Col sm={12}>
                                            Details
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        <Col sm={2} className="gray800-14" >
                                            URL
                                        </Col>
                                        <Col sm={10} className="gray800-14" >
                                            <a href={data.link} rel="noopener noreferrer" target="_blank" className="purple-14">
                                                {data.link}
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col sm={2} className="gray800-14" >
                                            Last update
                                        </Col>
                                        <Col sm={10} className="gray800-14">
                                            {moment(data.updatedon).format('DD MMM YYYY')}
                                        </Col>
                                    </Row>
                                    {data.uploader ?
                                        <Row className="mt-2">
                                            <Col sm={2} className="gray800-14" >
                                                Uploader
                                            </Col>
                                            <Col sm={10} className="gray800-14 overflowWrap">{data.uploader}</Col>
                                        </Row>
                                        : ''}
                                    <Row className="mt-2">
                                        <Col sm={2} className="gray800-14" >
                                            Type
                                        </Col>
                                        <Col sm={10} className="gray800-14">
                                            <a href={'/search?search=' + data.categories.category}>
                                                <div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{data.categories.category}</div>
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col sm={2} className="gray800-14" >
                                            Keywords
                                        </Col>
                                        <Col sm={10} className="gray800-14">

                                            {!data.tags.features || data.tags.features.length <= 0 ? <span className="gray800-14-opacity">Not specified</span> :
                                                data.tags.features.map((keyword) => { return <a href={'/search?search=' + keyword}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{keyword}</div></a> })}
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col sm={2} className="gray800-14" >
                                            Domain
                                        </Col>
                                        <Col sm={10} className="gray800-14">
                                            {!data.tags.topics || data.tags.topics.length <= 0 ? <span className="gray800-14-opacity">Not specified</span> :
                                                data.tags.topics.map((domain) => { return <a href={'/search?search=' + domain}><div className="mr-2 gray800-14 tagBadges mb-1 mt-1">{domain}</div></a> })}
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        <Row className="mt-2">
                            <Col sm={12}>
                                <div className="rectangle">
                                    <Row className="gray800-14-bold">
                                        <Col sm={12}>
                                            Authors
                                        </Col>
                                    </Row>
                                    <Row className="mt-3">
                                        {data.persons.map((author) =>
                                            <Col sm={6} key={author.id}>
                                                <Creators key={author.id} author={author} />
                                            </Col>
                                        )} 
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                  </Tab>
                  <Tab eventKey="Collaboration" title={`Discussion (${discourseTopic && discourseTopic.posts ? discourseTopic.posts.length : 0})`}>
                    <DiscourseTopic topic={discourseTopic} toolId={data.id} userState={userState} />
                  </Tab>
                  <Tab eventKey="Projects" title={'Related resources (' + data.relatedObjects.length + ')'}>
                    {data.relatedObjects.length <= 0 ? <NotFound word="related resources" /> : data.relatedObjects.map(object => <RelatedObject relatedObject={object} activeLink={true} showRelationshipAnswer={true} />)}
                  </Tab>
                </Tabs>
              </div>
            </Col>
            <Col sm={1} lg={1} />
          </Row>
        </Container>

        {!userState[0].loggedIn ? '' :
            <div className="actionBar">
                <Button variant='white' href={'/project/edit/' + data.id} className="techDetailButton mr-2" >Edit</Button>
            </div>
        }   
      </div>
    );
  }
}

export default ProjectDetail;