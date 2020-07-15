
// /ShowObjects.js
import React, { Component } from 'react';
import queryString from 'query-string';
import { Row, Col, Tabs, Tab, Container, Alert, Nav, Navbar } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Creators from '../commonComponents/Creators';
import Loading from '../commonComponents/Loading'
import RelatedObject from '../commonComponents/RelatedObject';
import SearchBar from '../commonComponents/SearchBar';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';

import { axiosIG } from '../../utils/axios.util';

class CollectionPage extends Component { 

// initialize our state
state = {
    id: '',
    data: [],
    objectData: [],
    key: 'All',  
    reason: '',
    updated: '',
    user: '',
    isLoading: true,
    userState: [{
      loggedIn: false,
      role: "Reader",
      id: null,
      name: null
    }],
    searchString: null,
    toolCount: 0,
    datasetCount: 0,
    personCount: 0,
    projectCount: 0,
    paperCount: 0,
    collectionAdded: false,
    collectionEdited: false 
};

constructor(props) {
  super(props)
  this.state.userState = props.userState;
}

componentDidMount() {
  if (!!window.location.search) {
    var values = queryString.parse(window.location.search);
    this.setState({ collectionAdded: values.collectionAdded });
    this.setState({ collectionEdited: values.collectionEdited });
  }
  this.getDataSearchFromDb()
}

getDataSearchFromDb = () => {
    this.setState({ isLoading: true });
    axiosIG.get('/api/v1/collections/' + this.props.match.params.collectionID)
      .then((res) => {
        this.setState({
          data: res.data.data[0]
        })
        this.getObjectData(res.data.data[0]);
        this.setState({isLoading: false})
      });
  };

  getObjectData = async (data) => { 
    data.relatedObjects.map((object) => {
      if(object.objectType === "tool"){
        this.getToolData(object.objectId)
        this.state.toolCount++
      } else if(object.objectType === "person"){
        this.getPersonData(object.objectId);
        this.state.personCount++
      } else if(object.objectType === "project"){
        this.getProjectData(object.objectId)
        this.state.projectCount++
      } else if(object.objectType === "dataset"){
        this.getDatasetData(object.objectId)
        this.state.datasetCount++
      } else if(object.objectType === "paper"){
        this.getPaperData(object.objectId)
        this.state.paperCount++
      }
    })
    this.setState({isLoading: false})
};

  getToolData = async (toolID) => {
    this.setState({ isLoading: true });
    await Promise.all([
    axiosIG.get('/api/v1/tools/' + toolID) 
      .then((res) => {
        this.state.objectData.push(res.data.data[0])
      })
    ]);
    this.setState({objectData: this.state.objectData})
  };

  getPersonData = async (personID) => {
    this.setState({ isLoading: true });
    await Promise.all([
    axiosIG.get('/api/v1/person/' + personID) 
      .then((res) => {
        this.state.objectData.push(res.data.data[0])
      })
    ]);
    this.setState({objectData: this.state.objectData})
  }

  getProjectData = async (projectID) => {
    this.setState({ isLoading: true });
    await Promise.all([
    axiosIG.get('/api/v1/project/' + projectID) 
      .then((res) => {
        this.state.objectData.push(res.data.data[0])
      })
    ]);
    this.setState({objectData: this.state.objectData})
  }

  getDatasetData = async (datasetID) => {
    this.setState({ isLoading: true });
    await Promise.all([
    axiosIG.get('/api/v1/datasets/detail/' + datasetID) 
      .then((res) => {
        this.state.objectData.push(res.data.data)
      })
    ]);
    this.setState({objectData: this.state.objectData})
  }

  getPaperData = async (paperID) => {
    this.setState({ isLoading: true });
    await Promise.all([
    axiosIG.get('/api/v1/paper/' + paperID) 
      .then((res) => {
        this.state.objectData.push(res.data.data[0]) 
      })
    ]);
    this.setState({objectData: this.state.objectData})
  }

  doGetUsersCall() {
    return new Promise((resolve, reject) => {
        axiosIG.get('/api/v1/users')
            .then((res) => {
                this.setState({ combinedUsers: res.data.data });
                resolve();
            });
    });
  }

  handleSelect = (key) => {
    this.setState({ key: key });
  }

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
    const { searchString, data, objectData, isLoading, userState,  toolCount, datasetCount, personCount, projectCount, paperCount, collectionAdded, collectionEdited } = this.state; 
    var { key } = this.state;
    var allCount = toolCount + datasetCount + personCount + projectCount + paperCount;

    if (isLoading) {
      return <Container><Loading /></Container>;
    }
 
    return (
      <div>
        <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
          <div className="rectangle mt-1">
            <Container>
              {collectionAdded ? 
              <Row >
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                  <Alert variant="success" className="mt-3">Published! This collection is now public.</Alert>
                </Col>
                <Col sm={1} lg={10} />
              </Row>
              : ""}

            {collectionEdited ?
            <Row >
              <Col sm={1} lg={1} />
              <Col sm={10} lg={10}>
                <Alert variant="success" className="mt-3">Done! Your collection has been updated.</Alert>
              </Col>
              <Col sm={1} lg={10} />
            </Row>
            : ""}

              <Row>
              <Col sm={1} lg={1} />
                {!data.imageLink || data.imageLink === "https://" ? '' :
                  <Col sm={1} lg={1} className="logoWidth" >
                    <img src={data.imageLink} alt="collectionLogo" id="collectionLogo" />
                  </Col> }
                <Col sm={10} lg={10} className={!data.imageLink || data.imageLink === "https://" ? "" : "titleWidth"}>  
                  <Row>
                    <Col sm={9} lg={9} className={!data.imageLink || data.imageLink === "https://" ? "" : "collectionTitleCard"} >
                      <span className="black-28 collectionTitleText"> {data.name} </span>
                    </Col>
                      {!data.imageLink || data.imageLink === "https://" ? <Col sm={1} lg={1} /> : '' }
                    <Col sm={2} lg={2} className={!data.imageLink || data.imageLink === "https://" ? "collectionDate" : "collectionDate collectionTitleCard"}>
                      <span className="gray700-13">Created {moment(data.createdAt).format('MMM YYYY')} </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} lg={12} className={!data.imageLink || data.imageLink === "https://" ? "" : "collectionTitleCard"}> 
                      {data.persons.map((person, index) => {
                        if (index > 0) {
                          return <span className="gray800-14">, {person.firstname} {person.lastname}</span>
                        }
                        else {
                          return <span className="gray800-14">{person.firstname} {person.lastname}</span>
                        } 
                      })} 
                    </Col>
                  </Row>
                </Col>
                <Col sm={1} lg={10} />
              </Row> 
              <Row className="mt-3">
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10} >
                  <p className="gray800-14">{data.description}</p> 
                </Col>
                <Col sm={1} lg={10} />
              </Row>  
            </Container>
          </div>   

          <div> 
            <Tabs className='tabsBackground gray700-13' activeKey={key} onSelect={this.handleSelect} >
              <Tab eventKey="All" title={'All (' + allCount + ')'}></Tab>
              <Tab eventKey="Datasets" title={'Datasets (' + datasetCount + ')'}></Tab>
              <Tab eventKey="Tools" title={'Tools ('+ toolCount + ')'}></Tab>
              <Tab eventKey="Papers" title={'Papers (' + paperCount + ')'}></Tab>
              <Tab eventKey="Projects" title={'Projects (' + projectCount + ')'}></Tab>
              <Tab eventKey="People" title={'People (' + personCount + ')'}></Tab>
            </Tabs>
          </div>

        <Container>
          <Row>
            <Col sm={1} lg={1} /> 
            <Col sm={10} lg={10}> 
              {key === 'All' ?
                  objectData.map((object) => {
                    var reason = '';
                    var updated = '';
                    var user = '';
                    data.relatedObjects.map((dat) => {
                      if(dat.objectId === object.id || parseInt(dat.objectId) === object.id){
                        reason = dat.reason
                        updated = dat.updated
                        user = dat.user
                      }
                    })
                    return <RelatedObject key={object.id} data={object} activeLink={true} showRelationshipAnswer={true} collectionReason={reason} collectionUpdated={updated} collectionUser={user} />
                  })
              : ''}
              
              {key === 'Datasets' ?
                  objectData.map((object) => {
                    var reason = '';
                    var updated = '';
                    var user = '';
                    if(object.type === undefined){
                      data.relatedObjects.map((dat) => {
                        if(dat.objectId === object.id){ 
                          reason = dat.reason
                          updated = dat.updated
                          user = dat.user
                        }
                      })
                      return <RelatedObject key={object.id} data={object} activeLink={true} showRelationshipAnswer={true} collectionReason={reason} collectionUpdated={updated} collectionUser={user} /> 
                    }
                  })
              : ''}

              {key === 'Tools' ?
                  objectData.map((object) => {
                    var reason = '';
                    var updated = '';
                    var user = '';
                    if(object.type === "tool"){
                      data.relatedObjects.map((dat) => {
                        if(parseInt(dat.objectId) === object.id){
                          reason = dat.reason
                          updated = dat.updated
                          user = dat.user
                        }
                      })
                      return <RelatedObject key={object.id} data={object} activeLink={true} showRelationshipAnswer={true} collectionReason={reason} collectionUpdated={updated} collectionUser={user}  /> 
                    }
                  })
              : ''}

              {key === 'Projects' ?
                  objectData.map((object) => {
                    var reason = '';
                    var updated = '';
                    var user = '';
                    if(object.type === "project"){
                      data.relatedObjects.map((dat) => {
                        if(parseInt(dat.objectId) === object.id){
                          reason = dat.reason
                          updated = dat.updated
                          user = dat.user
                        }
                      })
                      return <RelatedObject key={object.idd} data={object} activeLink={true} showRelationshipAnswer={true} collectionReason={reason}  collectionUpdated={updated} collectionUser={user}/>
                    } 
                  })
              : ''}

              {key === 'Papers' ?
                objectData.map((object) => {
                  var reason = '';
                  var updated = '';
                  var user = '';
                  if(object.type === "paper"){
                    data.relatedObjects.map((dat) => {
                      if(parseInt(dat.objectId) === object.id){
                        reason = dat.reason
                        updated = dat.updated
                        user = dat.user
                      }
                    })

                    return <RelatedObject key={object.id} data={object} activeLink={true} showRelationshipAnswer={true} collectionReason={reason}  collectionUpdated={updated} collectionUser={user}/> 
                  }
                })              : ''}

              {key === 'People' ?
                objectData.map((object) => {
                  var reason = '';
                  var updated = '';
                  var user = '';
                  if(object.type === "person"){  
                    data.relatedObjects.map((dat) => {
                      if(parseInt(dat.objectId) === object.id){
                        reason = dat.reason
                        updated = dat.updated
                        user = dat.user
                      }
                    })
                    return <RelatedObject key={object.id} data={object} activeLink={true} showRelationshipAnswer={true} collectionReason={reason}  collectionUpdated={updated} collectionUser={user}/>
                  } 
                })
              : ''}
            </Col>
            <Col sm={1} lg={10} /> 
          </Row>
        </Container>
      </div>
    );
  }
}

export default CollectionPage;