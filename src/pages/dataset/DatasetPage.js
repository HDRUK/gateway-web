
// /ShowObjects.js
import React, { Component, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Tabs, Tab, Button, Alert, Tooltip, Overlay } from 'react-bootstrap/';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading'
import RelatedObject from '../commonComponents/RelatedObject';
import SearchBar from '../commonComponents/SearchBar';
import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as MetadataBronze } from '../../images/bronze.svg';
import { ReactComponent as MetadataSilver } from '../../images/silver.svg';
import { ReactComponent as MetadataGold } from '../../images/gold.svg';
import { ReactComponent as MetadataPlatinum } from '../../images/platinum.svg';
import { ReactComponent as MetadataNotRated } from '../../images/not-rated.svg';
import { PageView, initGA } from '../../tracking';
import { Event } from '../../tracking';
import moment from 'moment';
import Linkify from "react-linkify";
import DatasetSchema from './DatasetSchema';
import { axiosIG } from '../../utils/axios.util';

import 'react-tabs/style/react-tabs.css';


class DatasetDetail extends Component {

  // initialize our state
  state = {
    id: '',
    data: [],
    relatedObjects: [],
    datasetSchema: '',
    datarequest: [],
    DBData: [],
    activeKey: false,
    selectedItem: 'tab-1',
    isLoading: true,
    userState: [{
      loggedIn: false,
      role: "Reader",
      id: null,
      name: null
    }],
    alert: null
  };

  constructor(props) {
    super(props);
    this.state.userState = props.userState;
  }

  // on loading of tool detail page
  componentDidMount() {
    this.getDetailsSearchFromMDC();
    this.getDatasetSchema();
    this.getRelatedProjects();
    this.checkAlerts();
    initGA('UA-166025838-1');
    PageView();
  }


  // on loading of tool detail page were id is different
  componentDidUpdate() {
    if (this.props.match.params.datasetID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
      this.getDetailsSearchFromMDC();
    }
    }

  getDetailsSearchFromMDC = () => {
    this.setState({ isLoading: true });
    axiosIG.get('/api/v1/datasets/detail/' + this.props.match.params.datasetID+'?&id=' + this.state.userState[0].id)
      .then((res) => {
        this.setState({
          data: res.data.data,
          datarequest: res.data.datarequest,
          isLoading: false
        });
      })
  };

  getRelatedProjects = () => {
    axiosIG.get('/api/v1/datasets/relatedobjects/' + this.props.match.params.datasetID)
      .then((res) => {
        this.setState({
            relatedObjects: res.data.data
        })
        
      })
  };

  getDatasetSchema = () => {
    axiosIG.get('/api/v1/datasets/schema/' + this.props.match.params.datasetID)
      .then((res) => {
        this.setState({
            datasetSchema: res.data.data
        })
        
      })
  };

  doSearch = (e) => { //fires on enter on searchbar
    if (e.key === 'Enter') {
      if (!!this.state.searchString) {
        window.location.href = "/search?search=" + this.state.searchString;
      }
    }
    }

    checkAlerts = () => {
        const { state } = this.props.location;
        if (typeof state !== "undefined" && typeof state.alert !== 'undefined') {
            const { alert } = state;
            this.setState({ alert });
        }
    }

    updateSearchString = (searchString) => {
        this.setState({ searchString: searchString });
    }

    showLoginModal(title, contactPoint) {
        document.getElementById("myModal").style.display = "block";
        document.getElementById("loginWayFinder").style.display = "none";
        document.getElementById("loginButtons").style.display = "block";
        document.getElementById("loginModalTitle").innerHTML = "You must be signed in to request access";
        document.getElementById("modalRequestDetails").innerHTML = title;
        document.getElementById("modalRequestContact").innerHTML = contactPoint;
        document.getElementById("modalRequestSection").style.display = "block";

        window.onclick = function (event) {
            if (event.target === document.getElementById("myModal")) {
                document.getElementById("myModal").style.display = "none";
            }
        }
      }


  render() {
    const { searchString, data, isLoading, userState, alert=null, relatedObjects, datasetSchema } = this.state;

    if (isLoading) {
      return <Container><Loading /></Container>;
    }

    if (relatedObjects === null || typeof relatedObjects === 'undefined') {
        relatedObjects = [];
    }

    var keywords = (data.keywords ? data.keywords.split(",") : '');
    
    function Metadata() {
        const [show, setShow] = useState(false);
        const target = useRef(null);

        var score = ''
        
        if (data.quality && typeof data.quality.quality_score !== 'undefined') {
            if (data.quality.quality_score <= 50) {
                score = 'Not rated'
            }
            else if (data.quality.quality_score <= 70) {
                score = "Bronze";
            } 
            else if (data.quality.quality_score <= 80) {
                score = "Silver";
            } 
            else if (data.quality.quality_score <= 90) {
                score = "Gold";
            } 
            else if (data.quality.quality_score > 90) {
                score = "Platinum";
            }
        }

        return (<>
                <div className="text-center">
                    {(() => {
                        if (data.quality && typeof data.quality.quality_score === 'undefined') return <></>
                        else if (data.quality.quality_score <= 50) {
                            return (<div ref={target} onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} ><div style={{lineHeight: 1}}><MetadataNotRated className="" /></div><div style={{lineHeight: 1}}><span className="gray800-14-opacity">Not rated</span></div></div>)
                        }
                        else if (data.quality.quality_score <= 70) {
                            return (<div ref={target} onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} ><div style={{lineHeight: 1}}><MetadataBronze className="" /></div><div style={{lineHeight: 1}}><span className="gray800-14-opacity">Bronze metadata</span></div></div>)
                        } 
                        else if (data.quality.quality_score <= 80) {
                            return (<div ref={target} onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} ><div style={{lineHeight: 1}}><MetadataSilver className="" /></div><div style={{lineHeight: 1}}><span className="gray800-14-opacity">Silver metadata</span></div></div>)
                        } 
                        else if (data.quality.quality_score <= 90) {
                            return (<div ref={target} onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} ><div style={{lineHeight: 1}}><MetadataGold className="" /></div><div style={{lineHeight: 1}}><span className="gray800-14-opacity">Gold metadata</span></div></div>)
                        } 
                        else if (data.quality.quality_score > 90) {
                            return (<div ref={target} onClick={() => setShow(!show)} style={{ cursor: 'pointer' }} ><div style={{lineHeight: 1}}><MetadataPlatinum className="" /></div><div style={{lineHeight: 1}}><span className="gray800-14-opacity">Platinum metadata</span></div></div>)
                        }
                    })()} 
                </div>
                
                <Overlay target={target.current} show={show} placement="bottom">
                    {(props) => (
                    <Tooltip className="metadataOverlay" {...props}>
                        Metadata quality score: {score}
                        <br /><br />
                        The score relates to the amount of information available about the dataset, 
                        and not to the quality of the actual datasets. 
                        <br /><br />
                        <a href="https://github.com/HDRUK/datasets#about-the-reports" target="_blank" className="white-12">Click to read more about how the score is calculated.</a>
                        <br /><br />
                        {Math.trunc(data.quality.completeness_percent)} Completeness %
                        <br />
                        {Math.trunc(data.quality.weighted_completeness_percent)} Weighted completeness %
                        <br />
                        {Math.trunc(data.quality.error_percent)} Error %
                        <br />
                        {Math.trunc(data.quality.weighted_error_percent)} Weighted error %
                    </Tooltip>
                    )}
                </Overlay>
            </>
        )
    }

    return (
        <div>
            { datasetSchema !== '' ? <DatasetSchema datasetSchema={datasetSchema}/> : null }
            <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
            <Container className="mb-5">
                <Row className="mt-4">
                    <Col sm={1} />
                    <Col sm={10}>
                        {alert ? <Alert variant={alert.type}>{alert.message}</Alert> : null}
                        <div className="rectangle">
                            <Row>
                                <Col xs={10}>
                                    <span className="black-20">{data.title} </span>
                                    <br />
                                    {data.publisher ? <span className="gray800-14">{data.publisher}</span> : <span className="gray800-14-opacity">Not specified</span>}
                                </Col>
                                <Col xs={2} className="text-right">
                                    <Metadata />
                                </Col>
                            </Row>

                            <Row className="mt-2">
                                <Col xs={12}>
                                    <span className="dataSetBadge mr-2">
                                        <SVGIcon name="dataseticon" fill={'#ffffff'} className="badgeSvg mr-2"  viewBox="-2 -2 22 22"/>
                                        <span>Dataset</span>
                                    </span>
                                    {!keywords || keywords.length <= 0 ? '' : 
                                    keywords.map((keyword) => { return <a href={'/search?search=' + keyword}><div className="ml-2 gray800-14 tagBadges mb-1 mt-1">{keyword}</div></a>})}
                                </Col>
                            </Row>

                            <Row className="mt-2">
                                <Col xs={12}>
                                    <span className="gray700-13">12 views</span>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col sm={1}/>
                </Row>
            
                <Row>
                    <Col sm={1} />
                    <Col sm={10}>
                        <div>
                            <Tabs className='tabsBackground gray700-13'>
                                <Tab eventKey="About" title={'About'}>
                                    <Row className="mt-2">
                                        <Col sm={12}>
                                            <div className="rectangle">
                                                <Row className="gray800-14-bold">
                                                    <Col sm={12}>
                                                        Description
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                    <Col sm={12} className="gray800-14">
                                                        {(() => {
                                                            if (data.description) {
                                                                return <span className="gray800-14"><ReactMarkdown source={data.description} /></span>
                                                            }
                                                            else if (data.abstract) {
                                                                return <span className="gray800-14">{data.abstract}</span>
                                                            }
                                                            else {
                                                                return <span className="gray800-14-opacity">Not specified</span>
                                                            }
                                                        })()}
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
                                                        Release date
                                                    </Col>
                                                    {data.releaseDate ? <Col sm={10} className="gray800-14">{moment(data.releaseDate).format('DD MMMM YYYY')}</Col> : <Col sm={10} className="gray800-14-opacity">Not specified</Col>}
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={2} className="gray800-14" >
                                                        License
                                                    </Col>
                                                    {data.license ? <Col sm={10} className="gray800-14">{data.license}</Col> : <Col sm={10} className="gray800-14-opacity">Not specified</Col>}
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={2} className="gray800-14" >
                                                        Request time
                                                    </Col>
                                                    {data.accessRequestDuration ? <Col sm={10} className="gray800-14">{data.accessRequestDuration}</Col> : <Col sm={10} className="gray800-14-opacity">Not specified</Col>}
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={2} className="gray800-14" >
                                                        Standard
                                                    </Col>
                                                    {data.conformsTo ? <Col sm={10} className="gray800-14 overflowWrap">{data.conformsTo}</Col> : <Col sm={10} className="gray800-14-opacity">Not specified</Col>}
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col sm={12}>
                                            <div className="rectangle">
                                                <Row className="gray800-14-bold">
                                                    <Col sm={12}>
                                                        Data access
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                        <Col sm={2} className="gray800-14" >
                                                            Access rights
                                                        </Col>
                                                        {data.accessRights ? 
                                                        <Col sm={10} className="gray800-14">
                                                            <Linkify properties={{ target: '_blank' }}>{data.accessRights}</Linkify>
                                                        </Col> 
                                                        : <Col sm={10} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col sm={12}>
                                            <div className="rectangle">
                                                <Row className="gray800-14-bold">
                                                    <Col sm={10}>
                                                        Coverage
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                    <Col sm={3} className="gray800-14" >
                                                        Jurisdiction
                                                    </Col>
                                                    {data.jurisdiction ? <Col sm={9} className="gray800-14">{data.jurisdiction}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={3} className="gray800-14" >
                                                        Geographic coverage
                                                    </Col>
                                                    {data.geographicCoverage ? <Col sm={9} className="gray800-14">{data.geographicCoverage}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={3} className="gray800-14" >
                                                        Dataset start date
                                                    </Col>
                                                    {data.datasetStartDate ? <Col sm={9} className="gray800-14">{data.datasetStartDate}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={3} className="gray800-14" >
                                                        Dataset end date
                                                    </Col>
                                                    {data.datasetEndDate ? <Col sm={9} className="gray800-14">{data.datasetEndDate}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col sm={12}>
                                            <div className="rectangle">
                                                <Row className="gray800-14-bold">
                                                    <Col sm={12}>
                                                        Demographics
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                    <Col sm={3} className="gray800-14" >
                                                        Statistical population
                                                    </Col>
                                                    {data.statisticalPopulation ? <Col sm={9} className="gray800-14">{data.statisticalPopulation}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                                <Row className="mt-2">
                                                    <Col sm={3} className="gray800-14" >
                                                        Age band 
                                                    </Col>
                                                    {data.ageBand ? <Col sm={9} className="gray800-14">{data.ageBand}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row className="mt-2">
                                        <Col sm={12}>
                                            <div className="rectangle">
                                                <Row className="gray800-14-bold">
                                                    <Col sm={12}>
                                                        Related resources
                                                    </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                    <Col sm={3} className="gray800-14" >
                                                        Physical sample availability 
                                                    </Col>
                                                    {data.physicalSampleAvailability ? <Col sm={9} className="gray800-14">{data.physicalSampleAvailability}</Col> : <Col sm={9} className="gray800-14-opacity">Not specified</Col> }
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="Projects" title={'Related resources (' + relatedObjects.length + ')'}>
                                    {relatedObjects.length <= 0 ? <NotFound word="related resources" /> : relatedObjects.map(object => <RelatedObject relatedObject={object} activeLink={true} showRelationshipAnswer={true} />)}
                                </Tab>
                            </Tabs>
                        </div>
                    </Col>
                    <Col sm={1}/>
                </Row>
            </Container>
            <div className="actionBar">
                <Button variant='white' href={'https://metadata-catalogue.org/hdruk/#/catalogue/dataModel/' + data.id} target="_blank" className="techDetailButton mr-2" >Technical details</Button>
                
                {(() => {
                    if(!userState[0].loggedIn) {
                        return <Button variant="primary" className="addButton" onClick={() => this.showLoginModal(data.title, data.contactPoint)}>Request Access</Button>
                    }
                    else if (alert) {
                        return <Button variant="primary" className="addButton" disabled>Request Access</Button>
                    }   
                    else {
                        return (
                            <Link className="btn btn-primary addButton" 
                                to={{pathname: `/data-access-request/dataset/${data.id}`, state: {title: data.title, dataSetId: data.id, custodianEmail: data.contactPoint, publisher: data.publisher }}} 
                                onClick={() => Event("Buttons", "Click", "Request Access")}>
                                Request Access
                            </Link>
                        )
                    }                                     
                })()}
            </div>
        </div>
        );
    }
}

export default DatasetDetail;