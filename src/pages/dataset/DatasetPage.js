// /ShowObjects.js
import React, { Component, useState, useRef, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Container,
  Tabs,
  Tab,
  Button,
  Alert,
  Tooltip,
  Overlay
} from "react-bootstrap/";
import NotFound from "../commonComponents/NotFound";
import Loading from "../commonComponents/Loading";
import RelatedObject from "../commonComponents/RelatedObject";
import SearchBar from "../commonComponents/SearchBar";
import SVGIcon from "../../images/SVGIcon";
import { ReactComponent as InfoFillSVG } from "../../images/infofill.svg";
import { ReactComponent as InfoSVG } from "../../images/info.svg";
import { ReactComponent as MetadataBronze } from "../../images/bronze.svg";
import { ReactComponent as MetadataSilver } from "../../images/silver.svg";
import { ReactComponent as MetadataGold } from "../../images/gold.svg";
import { ReactComponent as MetadataPlatinum } from "../../images/platinum.svg";
import { ReactComponent as MetadataNotRated } from "../../images/not-rated.svg";
import { PageView, initGA } from "../../tracking";
import { Event } from "../../tracking";
import moment from "moment";
import Linkify from "react-linkify";
import DatasetSchema from "./DatasetSchema";
import TechnicalMetadata from "./components/TechnicalMetadata";
import TechnicalDetailsPage from "./components/TechnicalDetailsPage";
import DiscourseTopic from '../discourse/DiscourseTopic';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';



import "react-tabs/style/react-tabs.css";
import UserMessages from "../commonComponents/userMessages/UserMessages";

var baseURL = require("../commonComponents/BaseURL").getURL();
var cmsURL = require("../commonComponents/BaseURL").getCMSURL();

class DatasetDetail extends Component {
  // initialize our state
  state = {
    id: "",
    data: {},
    technicalMetadata: [],
    dataClassOpen: -1,
    relatedObjects: [],
    datarequest: [],
    DBData: [],
    activeKey: false,
    selectedItem: "tab-1",
    isLoading: true,
    userState: [
      {
        loggedIn: false,
        role: "Reader",
        id: null,
        name: null
      }
    ],
    alert: null,
    discoursePostCount: 0,
    searchString: "",
    isHovering: false,
    objects: [
      {
        id: "",
        authors: [],
        activeflag: ""
      }
    ],
    relatedObjects: [],
    showDrawer: false
  };

  topicContext = {};

  constructor(props) {
    super(props);
    this.doUpdateDataClassOpen = this.doUpdateDataClassOpen.bind(this);
    this.state.userState = props.userState;
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.searchBar = React.createRef();
  }

  // on loading of tool detail page
  async componentDidMount() {
    await this.getDataset();
    this.checkAlerts();
    initGA("UA-166025838-1");
    PageView();
  }

  // on loading of tool detail page were id is different
  componentDidUpdate() {
    if (
      this.props.match.params.datasetID !== this.state.id &&
      this.state.id !== "" &&
      !this.state.isLoading
    ) {
      this.getDetailsSearchFromMDC();
    }
  }

  getDataset = async () => {
    this.setState({ isLoading: true });
    await axios.get(baseURL + '/api/v1/datasets/' + this.props.match.params.datasetID)
      .then((res) => {
        this.setState({
          data: res.data.data[0],
          isLoading: false
        });
        this.getTechnicalMetadata();
        document.title = res.data.data[0].name.trim();
        let counter = !this.state.data.counter ? 1 : this.state.data.counter + 1;
        this.topicContext = { dataSetId: this.state.data.datasetid, relatedObjectId: this.state.data._id || '', title: this.state.data.name || '', subTitle: this.state.data.datasetfields.publisher || '' };

        this.updateCounter(this.props.match.params.datasetID, counter);
      
        this.getAdditionalObjectInfo(res.data.data[0].relatedObjects);
      });

  };

  getTechnicalMetadata() {
    this.setState({ isLoading: true });
    axios
      .get(baseURL + "/api/v1/datasets/" + this.state.data.datasetid)
      .then(res => {
        this.setState({
          technicalMetadata: res.data.data[0].datasetfields.technicaldetails || []
        });
      });
  }

  doUpdateDataClassOpen(index) {
    this.setState({
      dataClassOpen: index
    });
  }

  doSearch = e => {
    //fires on enter on searchbar
    if (e.key === "Enter")
      window.location.href = "/search?search=" + this.state.searchString;
  };

  checkAlerts = () => {
    const { state } = this.props.location;
    if (typeof state !== "undefined" && typeof state.alert !== "undefined") {
      const { alert } = state;
      this.setState({ alert });
    }
  };

  updateSearchString = searchString => {
    this.setState({ searchString: searchString });
  };

  showLoginModal(title, contactPoint) {
    document.getElementById("myModal").style.display = "block";
    document.getElementById("loginWayFinder").style.display = "none";
    document.getElementById("loginButtons").style.display = "block";
    document.getElementById("loginModalTitle").innerHTML =
      "You must be signed in to request access";
    document.getElementById("modalRequestDetails").innerHTML = title;
    document.getElementById("modalRequestContact").innerHTML = contactPoint;
    document.getElementById("modalRequestSection").style.display = "block";

    window.onclick = function(event) {
      if (event.target === document.getElementById("myModal")) {
        document.getElementById("myModal").style.display = "none";
      }
    };
  }

  updateCounter = (id, counter) => {
    axios.post(baseURL + "/api/v1/counter/update", { id, counter });
  };

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state) {
    return {
      isHovering: !state.isHovering
    };
  }

  getAdditionalObjectInfo = async data => {
    let tempObjects = [];
    const promises = data.map(async (object, index) => {
      await axios
        .get(baseURL + "/api/v1/relatedobject/" + object.objectId)
        .then(res => {
          tempObjects.push({
            id: object.objectId,
            authors: res.data.data[0].authors,
            activeflag: res.data.data[0].activeflag
          });
        });
    });
    await Promise.all(promises);
    this.setState({ objects: tempObjects });

    this.getRelatedObjects();
  };

  getRelatedObjects() {
    let tempRelatedObjects = [];
    this.state.data.relatedObjects.map(object =>
      this.state.objects.map(item => {
        if (object.objectId === item.id && item.activeflag === "active") {
          tempRelatedObjects.push(object);
        }

        if (
          object.objectId === item.id &&
          item.activeflag === "review" &&
          item.authors.includes(this.state.userState[0].id)
        ) {
          tempRelatedObjects.push(object);
        }
      })
    );
    this.setState({ relatedObjects: tempRelatedObjects });
    this.setState({ isLoading: false });
  }

  updateDiscoursePostCount = (count) => {
    this.setState({ discoursePostCount: count });
  }

  toggleDrawer = () => {
    this.setState( ( prevState ) => {
        debugger;
        if(prevState.showDrawer === true) {
            this.searchBar.current.getNumberOfUnreadMessages();
        }
        return { showDrawer: !prevState.showDrawer };
    });
}


  render() {
    const {
      searchString,
      data,
      technicalMetadata,
      isLoading,
      userState,
      alert = null,
      discourseTopic,
      dataClassOpen,
      objects,
      relatedObjects,
      discoursePostCount
    } = this.state;




    if (isLoading) {
      return (
        <Container>
          <Loading />
        </Container>
      );
    }

    if (
      data.relatedObjects === null ||
      typeof data.relatedObjects === "undefined"
    ) {
      data.relatedObjects = [];
    }

    function Metadata() {
        const [show, setShow] = useState(false);
        const target = useRef(null);

        var rating = "Not Rated";

        if (data.datasetfields.metadataquality && typeof data.datasetfields.metadataquality.quality_rating !== "undefined") {
            rating = data.datasetfields.metadataquality.quality_rating;
        }

      return (
        <>
          <div className="text-center">
            <div ref={target} onClick={() => setShow(!show)} style={{ cursor: "pointer" }} >
                <div style={{ lineHeight: 1 }}>

                    {(() => {
                        if (rating === "Not Rated") return <MetadataNotRated />
                        else if (rating === "Bronze") return <MetadataBronze />
                        else if (rating === "Silver") return <MetadataSilver />
                        else if (rating === "Gold") return <MetadataGold />
                        else if (rating === "Platinum") return <MetadataPlatinum />
                    })()}
                </div>
                <div style={{ lineHeight: 1 }}>
                    <span className="gray800-14-opacity">{rating === "Not rated" ? rating : rating+" metadata"}</span>
                </div>
            </div>
          </div>

          <Overlay target={target.current} show={show} placement="bottom">
            {props => (
              <Tooltip className="metadataOverlay" {...props}>
                Metadata quality score: {Math.trunc(data.datasetfields.metadataquality.quality_score)}
                <br />
                <br />
                The score relates to the amount of information available about
                the dataset, and not to the quality of the actual datasets.
                <br />
                <br />
                <a href="https://github.com/HDRUK/datasets/tree/master/reports#hdr-uk-data-documentation-scores" target="_blank" className="white-12" >
                  Click to read more about how the score is calculated.
                </a>
                <br />
                <br />
                {Math.trunc(data.datasetfields.metadataquality.completeness_percent)} Completeness %
                <br />
                {Math.trunc(data.datasetfields.metadataquality.weighted_completeness_percent)} Weighted completeness %
                <br />
                {Math.trunc(data.datasetfields.metadataquality.error_percent)} Error %
                <br />
                {Math.trunc(data.datasetfields.metadataquality.weighted_error_percent)} Weighted error %
              </Tooltip>
            )}
          </Overlay>
        </>
      );
    }

    return (
      <div>
        {data.datasetfields.metadataschema !== "" ? (
          <DatasetSchema datasetSchema={data.datasetfields.metadataschema} />
        ) : null}
        <SearchBar
          ref={this.searchBar}
          searchString={searchString}
          doSearchMethod={this.doSearch}
          doUpdateSearchString={this.updateSearchString}
          userState={userState}
        />
        <Container className="margin-bottom-48">
          <Row className="mt-4">
            <Col sm={1} />
            <Col sm={10}>
              {alert ? (
                <Alert variant={alert.type}>{alert.message}</Alert>
              ) : null}
              <div className="rectangle">
                <Row>
                  <Col xs={10}>
                    <span className="black-20">{data.name} </span>
                    <br />
                    {data.datasetfields.publisher ? (
                      <span className="gray800-14">
                        {data.datasetfields.publisher}
                      </span>
                    ) : (
                      <span className="gray800-14-opacity">Not specified</span>
                    )}
                  </Col>
                  <Col xs={2} className="text-right">
                    <Metadata />
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col xs={12}>
                    <span className="badge-dataset">
                      <SVGIcon
                        name="dataseticon"
                        fill={"#ffffff"}
                        className="badgeSvg mr-2"
                        viewBox="-2 -2 22 22"
                      />
                      <span>Dataset</span>
                    </span>
                    {!data.tags.features || data.tags.features.length <= 0
                      ? ""
                      : data.tags.features.map(keyword => {
                          return (
                            <a href={"/search?search=" + keyword}>
                              <div className="ml-2 badge-tag">{keyword}</div>
                            </a>
                          );
                        })}
                  </Col>
                </Row>

                <Row className="mt-2">
                  <Col xs={8}>
                    <span className="gray800-14">
                      {data.counter === undefined ? 1 : data.counter + 1}
                      {data.counter === undefined ? " view" : " views"}
                    </span>
                  </Col>
                  <Col xs={4}>
                    {(() => {
                      if (!userState[0].loggedIn) {
                        return (
                          <Button
                            className="greyCancelButton dark-14 mr-2 btn btn-tertiary float-right"
                            onClick={() =>
                              this.showLoginModal(
                                data.name,
                                data.datasetfields.contactPoint
                              )
                            }
                          >
                            Request Access 
                          </Button>
                        );
                      } else if (alert) {
                        return (
                            <Fragment>
                                <Button
                                    className="greyCancelButton dark-14 mr-2 btn btn-tertiary"
                                    disabled
                                >
                                    Request Access
                                </Button>
                                <Button className="btn btn-primary addButton pointer" onClick={() => this.toggleDrawer()}>Make Enquiry</Button>
                            </Fragment>
                        );
                      } else {
                        return (
                            <Fragment>
                                <Link
                                    className="greyCancelButton dark-14 mr-2 btn btn-tertiary"
                                    to={{
                                    pathname: `/data-access-request/dataset/${data.datasetid}`
                                    }}
                                    onClick={() =>
                                    Event("Buttons", "Click", "Request Access")
                                    }
                                >
                                    Request Access
                                </Link>
                                <Button className="btn btn-primary addButton pointer" onClick={() => this.toggleDrawer()}>Make Enquiry</Button>

                            </Fragment>
                        );
                      }
                    })()}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col sm={1} />
          </Row>

          <Row>
            <Col sm={1} />
            <Col sm={10}>
              <div>
                <Tabs className="tabsBackground gray700-13">
                  <Tab eventKey="About" title={"About"}>
                    <Row className="mt-2">
                      <Col sm={12}>
                        <div className="rectangle">
                          <Row className="gray800-14-bold">
                            <Col sm={12}>Description</Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sm={12} className="gray800-14">
                              {(() => {
                                if (data.description) {
                                  return (
                                    <span className="gray800-14">
                                      <ReactMarkdown
                                        source={data.description}
                                      />
                                    </span>
                                  );
                                } else if (data.datasetfields.abstract) {
                                  return (
                                    <span className="gray800-14">
                                      {data.datasetfields.abstract}
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="gray800-14-opacity">
                                      Not specified
                                    </span>
                                  );
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
                            <Col sm={12}>Details</Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sm={2} className="gray800-14">
                              Release date
                            </Col>
                            {data.datasetfields.releaseDate ? (
                              <Col sm={10} className="gray800-14">
                                {moment(data.datasetfields.releaseDate).format(
                                  "DD MMMM YYYY"
                                )}
                              </Col>
                            ) : (
                              <Col sm={10} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={2} className="gray800-14">
                              License
                            </Col>
                            {data.license ? (
                              <Col sm={10} className="gray800-14">
                                {data.license}
                              </Col>
                            ) : (
                              <Col sm={10} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={2} className="gray800-14">
                              Request time
                            </Col>
                            {data.datasetfields.accessRequestDuration ? (
                              <Col sm={10} className="gray800-14">
                                {data.datasetfields.accessRequestDuration}
                              </Col>
                            ) : (
                              <Col sm={10} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={2} className="gray800-14">
                              Standard
                            </Col>
                            {data.datasetfields.conformsTo ? (
                              <Col sm={10} className="gray800-14 overflowWrap">
                                {data.datasetfields.conformsTo}
                              </Col>
                            ) : (
                              <Col sm={10} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col sm={12}>
                        <div className="rectangle">
                          <Row className="gray800-14-bold">
                            <Col sm={12}>Data access</Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sm={2} className="gray800-14">
                              Access rights
                            </Col>
                            {data.datasetfields.accessRights ? (
                              <Col sm={10} className="gray800-14">
                                <Linkify properties={{ target: "_blank" }}>
                                  {data.datasetfields.accessRights}
                                </Linkify>
                              </Col>
                            ) : (
                              <Col sm={10} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col sm={12}>
                        <div className="rectangle">
                          <Row className="gray800-14-bold">
                            <Col sm={10}>Coverage</Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sm={3} className="gray800-14">
                              Jurisdiction
                            </Col>
                            {data.datasetfields.jurisdiction ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.jurisdiction}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={3} className="gray800-14">
                              Geographic coverage
                            </Col>
                            {data.datasetfields.geographicCoverage ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.geographicCoverage}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={3} className="gray800-14">
                              Dataset start date
                            </Col>
                            {data.datasetfields.datasetStartDate ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.datasetStartDate}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={3} className="gray800-14">
                              Dataset end date
                            </Col>
                            {data.datasetfields.datasetEndDate ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.datasetEndDate}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col sm={12}>
                        <div className="rectangle">
                          <Row className="gray800-14-bold">
                            <Col sm={12}>Demographics</Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sm={3} className="gray800-14">
                              Statistical population
                            </Col>
                            {data.datasetfields.statisticalPopulation ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.statisticalPopulation}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                          <Row className="mt-2">
                            <Col sm={3} className="gray800-14">
                              Age band
                            </Col>
                            {data.datasetfields.ageBand ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.ageBand}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col sm={12}>
                        <div className="rectangle">
                          <Row className="gray800-14-bold">
                            <Col sm={12}>Related resources</Col>
                          </Row>
                          <Row className="mt-3">
                            <Col sm={3} className="gray800-14">
                              Physical sample availability
                            </Col>
                            {data.datasetfields.physicalSampleAvailability ? (
                              <Col sm={9} className="gray800-14">
                                {data.datasetfields.physicalSampleAvailability}
                              </Col>
                            ) : (
                              <Col sm={9} className="gray800-14-opacity">
                                Not specified
                              </Col>
                            )}
                          </Row>
                        </div>
                      </Col>
                    </Row> 
                  </Tab>
                  <Tab eventKey="TechDetails" title={`Technical details`}>
                    <Row className="width-100" style={{ margin: "0%" }}>
                      {dataClassOpen === -1 ? (
                        <>
                          <Col
                            sm={12}
                            lg={12}
                            className="subHeader mt-3 gray800-14-bold pad-bottom-24 pad-top-24"
                          > 
                            <span className="black-16-semibold mr-3">
                              Data Classes
                            </span>
                            <span
                              onMouseEnter={this.handleMouseHover}
                              onMouseLeave={this.handleMouseHover}
                            > 
                              {this.state.isHovering ? (
                                <InfoFillSVG />
                              ) : (
                                <InfoSVG />
                              )}
                            </span>

                            {this.state.isHovering && (
                              <div className="dataClassToolTip">
                                <span className="white-13-semibold">
                                  A Dataset contains a number of Data Classes:
                                  groupings or collections of data points that
                                  share some common context: for example
                                  appearing in the same table of a database, or
                                  the same section in a form. A data class has a
                                  name, a description, some aliases, and may
                                  contain further (sub-) data classes.
                                </span>
                              </div>
                            )}
                          </Col>

                          <Row style={{ width: "-webkit-fill-available" }}>
                            <Col sm={12} lg={12} className={technicalMetadata && technicalMetadata.length > 0 ? "margin-left-15 width-100" : "width-100"}>
                              {technicalMetadata && technicalMetadata.length > 0 ?
                              technicalMetadata.map((techMetadata, index) => (
                                <TechnicalMetadata
                                  technicalMetadata={techMetadata}
                                  index={index}
                                  doUpdateDataClassOpen={
                                    this.doUpdateDataClassOpen
                                  }
                                />
                              ))
                              :
                              <NotFound word='technical details' />
                              }

                            </Col>
                          </Row>
                        </>
                      ) : (
                        <Row style={{ width: "-webkit-fill-available" }}>
                          <Col sm={12} lg={12}>
                            <TechnicalDetailsPage
                              technicalMetadata={
                                technicalMetadata[dataClassOpen]
                              }
                              doUpdateDataClassOpen={this.doUpdateDataClassOpen}
                            />
                          </Col>
                        </Row>
                      )}
                    </Row>
                  </Tab>

                  <Tab
                    eventKey="Collaboration"
                    title={`Discussion (${discoursePostCount})`}
                  >
                    <DiscourseTopic 
                    toolId={data.id} 
                    topicId={data.discourseTopicId || 0} 
                    userState={userState} 
                    onUpdateDiscoursePostCount={this.updateDiscoursePostCount}
                    />
                  </Tab>
                  <Tab
                    eventKey="Projects"
                    title={"Related resources (" + relatedObjects.length + ")"}
                  >

                    {data.relatedObjects && data.relatedObjects.length <= 0 ? (
                      <NotFound word="related resources" />
                    ) : (
                      relatedObjects.map(object => (
                        <RelatedObject
                          relatedObject={object}
                          activeLink={true}
                          showRelationshipAnswer={true}
                        />
                      ))
                    )}
                  </Tab>
                </Tabs>
              </div>
            </Col>
            <Col sm={1} />
          </Row>
        </Container>
        <SideDrawer
            open={this.state.showDrawer}
            closed={this.toggleDrawer}>
            <UserMessages 
                closed={this.toggleDrawer}
                drawerIsOpen={this.state.showDrawer}
                topicContext={this.topicContext} />
        </SideDrawer>
      </div>
    );
  }
}

export default DatasetDetail;
