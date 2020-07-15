
// /ShowObjects.js
import React, { Component } from 'react';
import queryString from 'query-string';
import { Row, Col, Tabs, Tab, Container, Alert, Button } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Creators from '../commonComponents/Creators';
import Loading from '../commonComponents/Loading'
import Reviews from '../commonComponents/Reviews';
import RelatedObject from '../commonComponents/RelatedObject';
import SearchBar from '../commonComponents/SearchBar';
import DiscourseTopic from '../commonComponents/DiscourseTopic';
import 'react-tabs/style/react-tabs.css';
// import ReactGA from 'react-ga'; 
import { PageView, initGA } from '../../tracking';
import SVGIcon from '../../images/SVGIcon';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

import { axiosIG } from '../../utils/axios.util';

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
    axiosIG.get('/api/v1/paper/' + this.props.match.params.paperID)
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
        window.location.href = "/search?search=" + this.state.searchString;
      }
    }
  }

  updateSearchString = (searchString) => {
    this.setState({ searchString: searchString });
  }

  render() {
    const { searchString, data, isLoading, userState, paperAdded, paperEdited, reviewAdded, replyAdded, reviewData, discourseTopic } = this.state;

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

          {paperAdded ?
            <Row className="">
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Someone will review your tool and let you know when it goes live</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

          {paperEdited ?
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
                <Alert variant="warning" className="mt-3">Your paper is pending review. Only you can see this page.</Alert>
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

            <Row className="mt-2">
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <div className="rectangle">
                        <Row>
                            <Col xs={7} md={8}>
                                <p>
                                    <span className="black-16" data-testid="title">{data.name}</span>
                                    <br />
                                    <span className="paperBadge mt-2"> 
                                        <SVGIcon name="projecticon" fill={'#3c3c3b'} className="badgeSvg mr-2" />
                                        Paper 
                                    </span>
                                </p>
                            </Col>
                            <Col xs={5} md={4} className="iconHolder">
                                
                            </Col>
                        </Row>

                        <Row>
                            
                            <Row>
                                <Col className="ml-3">
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
              <div>
                <Tabs className='tabsBackground gray700-13'>
                  <Tab eventKey="about" title={'About'}>
                    <Row className="mt-2"> 
                        <Col>
                            <div className="rectangle">
                                <Row>
                                    <Col>
                                        <span className="gray800-14-bold">Details</span>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col sm={2}>
                                        <span className="gray800-14">URL</span>
                                    </Col>
                                    <Col sm={10}>
                                        <a href={data.link} rel="noopener noreferrer" target="_blank" className="purple-14">
                                            {data.link}
                                        </a>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col sm={2}>
                                        <span className="gray800-14">Journal</span>
                                    </Col>
                                    <Col sm={10}>
                                        <span className="gray800-14">{data.journal} {data.journalYear}</span>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col sm={2}>
                                        <span className="gray800-14">Last update</span>
                                    </Col>
                                    <Col sm={10}>
                                        <span className="gray800-14">{moment(data.updatedon).format('DD MMMM YYYY')}</span>
                                    </Col>
                                </Row>
                                {data.uploader ?
                                    <Row className="mt-2">
                                        <Col sm={2} className="gray800-14" >
                                            Uploader
                                        </Col>
                                        <Col sm={10} className="gray800-14 overflowWrap">{data.uploaderIs[0].firstname} {data.uploaderIs[0].lastname}</Col>
                                    </Row>
                                    : ''}
                                <Row className="mt-2">
                                    <Col sm={2}>
                                        <span className="gray800-14">Keywords</span>
                                    </Col>
                                    <Col sm={10}>
                                        <span className="gray800-14">
                                            {!data.tags.features || data.tags.features.length <= 0 ? '' : data.tags.features.map((feature, i) => {
                                                return <div className="mr-2 tagBadges" key={i}><a className="gray800-14" href={'/search?search=' + feature + '&type=all'}>{feature}</a></div>
                                            })}
                                        </span>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col sm={2}>
                                        <span className="gray800-14">Domain</span>
                                    </Col>
                                    <Col sm={10}>
                                        <span className="gray800-14">
                                            {!data.tags.topics || data.tags.topics.length <= 0 ? '' : data.tags.topics.map((topic, i) => {
                                                return <div className="mr-2 tagBadges" key={i}><a className="gray800-14" href={'/search?search=' + topic + '&type=all'}>{topic}</a></div>
                                            })}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-2"> 
                        <Col>
                            <div className="rectangle">
                                <Row>
                                    <Col>
                                        <span className="gray800-14-bold">Abstract</span>
                                    </Col>
                                </Row>
                                <Row className="mt-3">
                                    <Col>
                                        <span className="gray800-14"><ReactMarkdown source={data.description} /></span>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>

                    <Row className="mt-2"> 
                        <Col>
                            <div className="rectangle">
                                <Row>
                                    <Col>
                                        <span className="gray800-14-bold">Authors</span>
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
                <Button variant='white' href={'/paper/edit/' + data.id} className="techDetailButton mr-2" >Edit</Button>
            </div>
        }
      </div>
    );
  }
}

export default ToolDetail;