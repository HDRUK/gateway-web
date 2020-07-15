import React, { useState } from 'react';
import { Row, Col, Button, Container, Tabs, Tab, Alert } from 'react-bootstrap';
import Loading from '../commonComponents/Loading';
import PreSubCustodian from './DARComponents/PreSubCustodian';
import PreSubInnovator from './DARComponents/PreSubInnovator';
import CustodianApplication from './DARComponents/CustodianApplication';
import InnovatorApplication from './DARComponents/InnovatorApplication';

import { axiosIG } from '../../utils/axios.util';

class DataAccessRequests extends React.Component {
 
    constructor(props) {
    super(props)
    this.state.userState = props.userState;
  }

  // initialize our state
  state = {
    userState: [],
    key: 'presubmission',
    data: [],
    isLoading: true,
    alert: null
  };

  componentDidMount() {
      this.getDARsFromDb();
      this.checkAlerts();
  }

  getDARsFromDb = () => {
    this.setState({ isLoading: true });
    axiosIG.get('/api/v1/dar')
    .then((res) => {
      this.setState({
        data: res.data.data,
        isLoading: false
      });
    })
  }

checkAlerts = () => {
    let alertBanner = JSON.parse(window.localStorage.getItem('alert'));    
    this.setState({alert: alertBanner});
    window.localStorage.removeItem('alert');
}
  handleSelect = (key) => {
    this.setState({ key: key });
  }

  render() {
    const { userState, key, isLoading, data, alert } = this.state;
    
    if (isLoading) {
      return <Container><Loading /></Container>;
    }
   
    return (
        <div>
            <Row className="">
                <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        {alert != null ? <Alert variant={alert.type}>{alert.message}</Alert> : null}
                    </Col>
                <Col sm={1} lg={10} />
            </Row>
            <Row>
                <Col xs={2}></Col>
                <Col xs={8}>
                    <Row className="accountHeader mt-3">
                        <Col xs={8}>
                            <Row>
                                <span className="black-20">Data access request applications</span>
                            </Row>
                            <Row>
                                <span className="gray700-13 ">Manage forms and applications</span>   
                            </Row>
                        </Col>
                        <Col xs={4} style={{ textAlign: "center" }}>
                        { this.state.userState[0].role === "Admin" ? 
                            <Button variant="primary" href="" className="addButton">
                                + Add a new form
                            </Button>
                        : ""}
                        </Col>
                    </Row>
                    <Row className="tabsBackground">
                        <Col sm={12} lg={12}>
                                <Tabs className='dataAccessTabs gray700-13' activeKey={this.state.key} onSelect={this.handleSelect}>
                                    <Tab eventKey="presubmission" title="Pre-submission"> </Tab>
                                    <Tab eventKey="inreview" title="In review"> </Tab>
                                </Tabs>
                        </Col>
                    </Row>

            {/* AND ROLE IS CUSTODIAN */}
            {/* AND DAR FOR THIS CUSTODIAN */}
            { this.state.userState[0].role === "Admin" ? 
                        (() => {
                            switch (key) {
                                case "presubmission":
                                return ( 
                                    <div className="DARDiv">
                                        <Row className="subHeader mt-3"> <Col sm={2} lg={2}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={3} lg={3}>Applicant</Col> <Col sm={4} lg={4}>Progress</Col> </Row>
                                    
                                    {data.map(dat => (
                                        dat.applicationStatus === 'inProgress' ? 
                                        <Row className="subHeader mt-1">
                                            <PreSubCustodian data={dat}/> 
                                        </Row>   
                                        :null       
                                    ))}
   
                                    </div>
                      );
                      case "inreview":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-3"> <Col sm={2} lg={2}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={3} lg={3}>Applicant</Col> <Col sm={4} lg={4}>Progress</Col> </Row>
                                {data.map(dat => (
                                    dat.applicationStatus === 'submitted' ?
                                    <Row className="subHeader mt-1">
                                        <CustodianApplication data={dat}/> 
                                    </Row>          
                                    :null
                                ))}
                            </div>
                    );
                    case "approved":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-3"> <Col sm={2} lg={2}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={3} lg={3}>Applicant</Col> <Col sm={4} lg={4}>Progress</Col> </Row>
                                {data.map(dat => (
                                    dat.applicationStatus === 'approved' ?
                                    <Row className="subHeader mt-1">
                                        <CustodianApplication data={dat}/> 
                                    </Row>          
                                    : null
                                ))}
                            </div>
                    );
                    case "rejected":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-3"> <Col sm={2} lg={2}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={3} lg={3}>Applicant</Col> <Col sm={4} lg={4}>Progress</Col> </Row>
                                {data.map(dat => (
                                    dat.applicationStatus === 'rejected' ?
                                    <Row className="subHeader mt-1">
                                        <CustodianApplication data={dat}/> 
                                    </Row>          
                                    : null
                                ))}
                            </div>
                    );
                    case "forms":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-1"> <span className="ml-5">Forms placeholder</span> </Row> 
                            </div>
                    );
                }
            })() 
        : "" }

            {/* AND ROLE IS INNOVATOR */}
            {/* AND DARs MADE WITH THIS USER ID */}
        { this.state.userState[0].role === "Creator" ? 
            (() => {
                switch (key) {
                    case "presubmission":
                    return ( 
                        <div className="DARDiv">
                            <Row className="subHeader mt-3"> <Col sm={3} lg={3}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={6} lg={6}>Progress</Col> </Row>
                            {data.map(dat => (
                                (dat.userId === this.state.userState[0].id) && dat.applicationStatus === 'inProgress' ? 
                                    <Row className="subHeader mt-1"> 
                                        <PreSubInnovator data={dat}/> 
                                    </Row> 
                                    : null
                            ))}
                        </div>
                    );
                    case "inreview":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-3"> <Col sm={3} lg={3}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={6} lg={6}>Progress</Col> </Row>
                                {data.map(dat => (
                                (dat.userId === this.state.userState[0].id) && dat.applicationStatus === 'submitted' ? 
                                    <Row className="subHeader mt-1"> 
                                        <InnovatorApplication data={dat}/> 
                                    </Row> 
                                    : null
                            ))} 
                            </div>
                    );
                    case "approved":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-3"> <Col sm={3} lg={3}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={6} lg={6}>Progress</Col> </Row> 
                                {data.map(dat => (
                                (dat.userId === this.state.userState[0].id) && dat.applicationStatus === 'approved' ? 
                                    <Row className="subHeader mt-1"> 
                                        <InnovatorApplication data={dat}/> 
                                    </Row> 
                                    : null
                            ))} 
                            </div>
                    );
                    case "rejected":
                        return ( 
                            <div className="DARDiv">
                                <Row className="subHeader mt-3"> <Col sm={3} lg={3}>Updated</Col> <Col sm={3} lg={3}>Dataset</Col> <Col sm={6} lg={6}>Progress</Col> </Row>
                                {data.map(dat => (
                                (dat.userId === this.state.userState[0].id) && dat.applicationStatus === 'rejected' ? 
                                    <Row className="subHeader mt-1"> 
                                        <InnovatorApplication data={dat}/> 
                                    </Row> 
                                    : null
                            ))} 
                            </div>
                    );
                }
            })() 
        : "" }
        </Col>

        <Col xs={2}></Col>
    </Row>
</div>
);
}
}

export default DataAccessRequests;