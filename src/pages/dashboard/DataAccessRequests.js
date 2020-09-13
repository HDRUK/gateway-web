import React, { Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import { Row, Col, Tabs, Tab, DropdownButton, Dropdown, Alert } from 'react-bootstrap';
import { ReactComponent as CheckSvg } from '../../images/check.svg';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import { initGA } from '../../tracking';
import DarHelperUtil from '../../utils/DarHelper.util';

var baseURL = require('../commonComponents/BaseURL').getURL();

class DataAccessRequestsNew extends React.Component {

    // initialize our state
	state = {
		userState: [],
		key: 'presubmission',
		data: [],
        isLoading: true,
		approvedCount: 0,
		rejectedCount: 0,
		archivedCount: 0,
		preSubmissionCount: 0,
        inReviewCount: 0,
        team: '',
        alert: {}
    };
    
	constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.state.team = props.team || '';
        if(!_.isEmpty(props.alert)) {
            this.state.alert = props.alert;
            this.state.team = props.alert.publisher;
        }
	}

	componentDidMount() {
        initGA('UA-166025838-1');
        this.doDataAccessRequestsCall(this.state);
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.team !== this.props.team) {
            this.setState({isLoading: true});
            this.doDataAccessRequestsCall(nextProps);
        }

        this.setState({alert: nextProps.alert});
    }

    componentWillUnmount() {
        clearTimeout(this.alertTimeOut)
    }

	async doDataAccessRequestsCall(nextProps) {
        let data = [];
        let dataProps = {...nextProps, key: 'presubmission'};
        // 1. if there is an alert set team and correct tab so it can display on the UI
        if(!_.isEmpty(this.state.alert)) {
            dataProps.team = this.state.alert.publisher;
            dataProps.key = this.state.alert.tab;
        }
        // 2. check which API to call the user or custodian if a team and use team name
        const teamExists = !_.isEmpty(dataProps.team) ? true : false;        
        if(teamExists) {
            const response = await axios.get(`${baseURL}/api/v1/publishers/${dataProps.team}/dataaccessrequests`);
            ({ data: { data }} = response);
         } else {
            const response = await axios.get(`${baseURL}/api/v1/data-access-request`);
            ({ data: { data }} = response);
        }
        // 3. modifies approve with conditions to approved
        let screenData = this.formatScreenData(data);
        // 4. count stats
        let counts = DarHelperUtil.generateStatusCounts(screenData);
        // 5. set state
        this.setState({ data: screenData, isLoading: false, team: dataProps.team, ...counts, key: dataProps.key });
    }
    
    handleSelect = (key) => {
		this.setState({ key: key });
    };

    formatScreenData = (data = []) => {
        if(!_.isEmpty(data))  {
            return [...data].reduce((arr, item) => {
                let {applicationStatus} = item;
                return [
                    ...arr, 
                    {
                        ...item,
                        applicationStatus: applicationStatus === 'approved with conditions' ? 'approved' : applicationStatus
                    }
                ];
            },[]);
        }
        return [];
    }

    getDataSetsByName = (app) => {
        if(!_.isEmpty(app.datasets)) {
            return app.datasets.map(ds => ds.name).join(', ')
        } else {
            return app.dataset.name;
        }
    }
    
    getApplicant = (app) => {
        let {mainApplicant = {}} = {...app};
        if(!_.isEmpty(mainApplicant)) {
            let {firstname = '', lastname = ''} = mainApplicant;
            return `${firstname} ${lastname}`;
        }
        return '';
    }

    getCustodian = (app) => {
        if(!_.isEmpty(app.datasets)) {
            return app.datasets[0].datasetfields.publisher || '';
        } else {
            return app.dataset.datasetfields.publisher || '';
        }
    }

    generateAlert = () => {
        let { alert: { message = '' } } = this.state;
            return (
                <Row className='mt-3'>
                    <Col xs={1}></Col>
                    <div className="col-sm-10 row">
                        <Alert variant={"success"} className="col-sm-12">
                            <CheckSvg fill="#2c8267" /> {message}
                        </Alert>
                    </div>
                    <Col xs={1}></Col>
                </Row>
            )
    }

	render() {
		const { key, isLoading, data, approvedCount, rejectedCount, archivedCount, preSubmissionCount, inReviewCount, team, alert } = this.state;
		if (isLoading) {
			return (
				<Row>
					<Col xs={1}></Col>
					<Col xs={10}>
						<Loading />
					</Col>
					<Col xs={1}></Col>
				</Row>
			);
		}

		return (
            <Fragment>
                <Fragment>
                { !_.isEmpty(alert) ? 
                    this.generateAlert() : ''
                }
                </Fragment>

                <Row>
                    <Col xs={1}></Col>
                    <div className="col-sm-10">
                        <Row className="accountHeader">
                            <Col xs={8}>
                                <Row>
                                    <span className="black-20">Data access request applications {!_.isEmpty(team) ? team : ''}</span>
                                </Row>
                                <Row>
                                    <span className="gray700-13 ">Manage forms and applications</span>
                                </Row>
                            </Col>
                            <Col xs={4} style={{ textAlign: "right" }}>
                                
                            </Col>
                        </Row>

                        <Row className="tabsBackground">
                            <Col sm={12} lg={12}>
                                <Tabs className='dataAccessTabs gray700-13' activeKey={this.state.key} onSelect={this.handleSelect}>
                                    <Tab eventKey="presubmission" title={"Pre-submission (" + preSubmissionCount + ")"}> </Tab>
                                    <Tab eventKey="inreview"      title={"In review (" + inReviewCount + ")"}></Tab>
                                    <Tab eventKey="approved"      title={"Approved (" + approvedCount + ")"}></Tab>
                                    <Tab eventKey="rejected"      title={"Rejected (" + rejectedCount + ")"}></Tab>
                                </Tabs>
                            </Col>
                        </Row>

                        {(() => {
                            switch (key) {
                                case "presubmission":
                                    return (
                                        <div>
                                            {preSubmissionCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Dataset(s)</Col>
                                                <Col xs={2}>{!_.isEmpty(team) ? 'Applicant' : 'Data custodian'}</Col> 
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {preSubmissionCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="data access requests" /> 
                                            </Row>
                                            : data.map((app, i) => {
                                                if (app.applicationStatus !== "inProgress") {
                                                    return (<></>)
                                                } 
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(app.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={`/data-access-request/${app._id}`} className="black-14">{this.getDataSetsByName(app)}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{!_.isEmpty(team) ? this.getApplicant(app) : this.getCustodian(app)}</Col>
                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={`/data-access-request/${app._id}`} className="black-14">View</Dropdown.Item>
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                case "inreview":
                                    return (
                                        <div>
                                            {inReviewCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Dataset(s)</Col>
                                                <Col xs={2}>{!_.isEmpty(team) ? 'Applicant' : 'Data custodian'}</Col> 
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {inReviewCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="data access requests" /> 
                                            </Row>
                                            : data.map((app) => {
                                                if (app.applicationStatus !== "submitted") {
                                                    return (<></>)
                                                }
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(app.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={`/data-access-request/${app._id}`} className="black-14">{this.getDataSetsByName(app)}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{!_.isEmpty(team) ? this.getApplicant(app) : this.getCustodian(app)}</Col>

                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={`/data-access-request/${app._id}`} className="black-14">View</Dropdown.Item>
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                case "approved":
                                    return (
                                        <div>
                                            {approvedCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Dataset(s)</Col>
                                                <Col xs={2}>{!_.isEmpty(team) ? 'Applicant' : 'Data custodian'}</Col> 
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {approvedCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="data access requests" /> 
                                            </Row>
                                            : data.map((app) => {
                                                if (app.applicationStatus !== "approved") {
                                                    return (<></>)
                                                } 
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(app.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={`/data-access-request/${app._id}`} className="black-14">{this.getDataSetsByName(app)}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{!_.isEmpty(team) ? this.getApplicant(app) : this.getCustodian(app)}</Col>
                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={`/data-access-request/${app._id}`} className="black-14">View</Dropdown.Item>
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                case "rejected":
                                    return (
                                        <div>
                                            {rejectedCount <= 0 ? '' :
                                            <Row className="subHeader mt-3 gray800-14-bold">
                                                <Col xs={2}>Updated</Col>
                                                <Col xs={5}>Dataset(s)</Col>
                                                <Col xs={2}>{!_.isEmpty(team) ? 'Applicant' : 'Data custodian'}</Col> 
                                                <Col xs={3}></Col>
                                            </Row>}

                                            {rejectedCount <= 0 ? 
                                            <Row className="margin-right-15">
                                                <NotFound word="data access requests" /> 
                                            </Row>
                                            : data.map((app) => {
                                                if (app.applicationStatus !== "rejected") {
                                                    return (<></>)
                                                } 
                                                else {
                                                    return (
                                                        <Row className="entryBox">
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{moment(app.updatedAt).format('D MMMM YYYY HH:mm')}</Col>
                                                            <Col sm={12} lg={5} className="pt-2"><a href={`/data-access-request/${app._id}`} className="black-14">{this.getDataSetsByName(app)}</a></Col>
                                                            <Col sm={12} lg={2} className="pt-2 gray800-14">{!_.isEmpty(team) ? this.getApplicant(app) : this.getCustodian(app)}</Col>
                                                            <Col sm={12} lg={3} style={{ textAlign: "right" }} className="toolsButtons">
                                                                <DropdownButton variant="outline-secondary" alignRight title="Actions" className="floatRight">
                                                                    <Dropdown.Item href={`/data-access-request/${app._id}`} className="black-14">View</Dropdown.Item>
                                                                </DropdownButton>
                                                            </Col>
                                                        </Row>
                                                    )
                                                }
                                            })}

                                        </div>
                                    );
                                    default:
                                        return null
                            }
                        })()}
                    </div>
                    <Col xs={1}></Col>
                </Row>
            </Fragment>
        );
	}
}

export default DataAccessRequestsNew;
