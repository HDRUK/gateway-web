import axios from 'axios';
import moment from 'moment';
import React, { Fragment } from 'react';
import { Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import Loading from '../commonComponents/Loading';
import { LayoutContent } from '../../components/Layout';
import UnmetDemandSection from './Components/UnmetDemand/UnmetDemandSection';
import DashboardKPI from './DARComponents/DashboardKPI';
import './Dashboard.scss';
import TopDatasets from './TopDatasets';
import TopSearches from './TopSearches';

var baseURL = require('../commonComponents/BaseURL').getURL();
let isMounted = false;

class AccountAnalyticsDashboard extends React.Component {
    // initialize our state
    state = {
        key: 'Datasets',
        data: [],
        topSearches: [],
        statsDataType: [],
        totalGAUsers: 0,
        gaUsers: 0,
        searchesWithResults: 0,
        accessRequests: 0,
        uptime: 0,
        topDatasets: [],
        uniqueUsers: 0,
        datasetsWithTechMetaData: 0,
        dates: getDatesForDropdown(),
        selectedOption: '',
        isLoading: true,
    };

    constructor(props) {
        super(props);
        this.state.selectedOption = this.state.dates[0];
    }

    async componentDidMount() {
        isMounted = true;
        await Promise.all([this.getUnmetDemand(), this.getTopSearches()]);

        await Promise.all([
            this.getTotalGAUsers(),
            this.getGAUsers(
                moment(this.state.selectedOption).startOf('month').format('YYYY-MM-DD'),
                moment(this.state.selectedOption).endOf('month').format('YYYY-MM-DD')
            ),
            this.getUptime(this.state.selectedOption),
            this.getStats(),
            this.getKPIs(this.state.selectedOption),
            this.getDatasetsWithTechMetadata(),
            this.getTopDatasets(this.state.selectedOption),
        ]);

        let uniqueUsers = (this.state.statsDataType.person / this.state.totalGAUsers) * 100;
        if (isMounted) this.setState({ uniqueUsers: uniqueUsers, isLoading: false });
    }

    componentWillUnmount() {
        isMounted = false;
    }

    handleSelect = key => {
        this.setState({ key: key }, () => {
            this.getUnmetDemand(this.state.selectedOption);
            this.getTopSearches(this.state.selectedOption);
        });
    };

    async handleDateSelect(eventKey, event) {
        this.setState({ isLoading: true });
        if (eventKey === null) {
            eventKey = 0;
        }
        let selectedDate = this.state.dates[eventKey];
        this.setState({ selectedOption: selectedDate });
        await Promise.all([this.getUnmetDemand(this.state.dates[eventKey]), this.getTopSearches(this.state.dates[eventKey])]);

        this.setState({ isLoading: false });

        await Promise.all([
            this.getTotalGAUsers(),
            this.getGAUsers(
                moment(this.state.dates[eventKey]).startOf('month').format('YYYY-MM-DD'),
                moment(this.state.dates[eventKey]).endOf('month').format('YYYY-MM-DD')
            ),
            this.getUptime(this.state.dates[eventKey]),
            this.getStats(),
            this.getKPIs(this.state.dates[eventKey]),
            this.getDatasetsWithTechMetadata(),
            this.getTopDatasets(this.state.dates[eventKey]),
        ]);
        let uniqueUsers = (this.state.statsDataType.person / this.state.totalGAUsers) * 100;
        this.setState({ uniqueUsers: uniqueUsers });
    }

    getUnmetDemand(selectedOption) {
        let date = new Date(selectedOption);
        let selectedMonth = date.getMonth(selectedOption) + 1 || new Date().getMonth() + 1;
        let selectedYear = date.getFullYear(selectedOption) || new Date().getFullYear();
        axios
            .get(baseURL + '/api/v1/stats?rank=unmet&type=' + this.state.key, {
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                },
            })
            .then(res => {
                this.setState({ data: [] });
                res.data.data.entity = this.state.key;
                this.setState({ data: res.data.data });
            });
    }

    getTopSearches(selectedOption) {
        let date = new Date(selectedOption);
        let selectedMonth = date.getMonth(selectedOption) + 1 || new Date().getMonth() + 1;
        let selectedYear = date.getFullYear(selectedOption) || new Date().getFullYear();
        axios
            .get(baseURL + '/api/v1/stats/topSearches', {
                params: {
                    month: selectedMonth,
                    year: selectedYear,
                },
            })
            .then(res => {
                this.setState({ topSearches: [] });
                this.setState({ topSearches: res.data.data });
            });
    }

    getStats() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/stats').then(res => {
                this.setState({
                    statsDataType: res.data.data.typecounts,
                });
                resolve();
            });
        });
    }

    getTotalGAUsers() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/analyticsdashboard/totalusers').then(res => {
                this.setState({ totalGAUsers: res.data.data.rows[0][0] });
                resolve();
            });
        });
    }

    getGAUsers(startDate, endDate) {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/analyticsdashboard/userspermonth?startDate=' + startDate + '&endDate=' + endDate).then(res => {
                this.setState({ gaUsers: res.data.data.rows[0][0] });
                resolve();
            });
        });
    }

    getKPIs(selectedDate) {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/kpis?kpi=searchanddar&selectedDate=' + selectedDate).then(res => {
                let haveResultsMonth = res.data.data.totalMonth - res.data.data.noResultsMonth;
                let searchesWithResults = (haveResultsMonth / res.data.data.totalMonth) * 100;
                this.setState({ searchesWithResults: searchesWithResults, accessRequests: res.data.data.accessRequestsMonth });
                resolve();
            });
        });
    }

    getTopDatasets(selectedDate) {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/kpis?kpi=topdatasets&selectedDate=' + selectedDate).then(res => {
                this.setState({ topDatasets: [] });
                this.setState({ topDatasets: res.data.data });
                resolve();
            });
        });
    }

    getUptime(selectedDate) {
        let currentDate = new Date();

        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/kpis?kpi=uptime&selectedDate=' + currentDate).then(res => {
                this.setState({ uptime: res.data.data });
                resolve();
            });
        });
    }

    getDatasetsWithTechMetadata() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/kpis?kpi=technicalmetadata').then(res => {
                let datasetsWithTechMetaData = (res.data.data.datasetsMetadata / res.data.data.totalDatasets) * 100;
                this.setState({ datasetsWithTechMetaData: datasetsWithTechMetaData });
                resolve();
            });
        });
    }

    renderNoResults(message) {
        return (
            <Fragment>
                <Row>
                    <Col sm={12} lg={12}>
                        <Row className='subHeader entrybox gray800-14 noDars'>
                            <Col sm={12} lg={12}>
                                {message}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Fragment>
        );
    }

    render() {
        const {
            key,
            isLoading,
            data,
            topSearches,
            dates,
            statsDataType,
            gaUsers,
            searchesWithResults,
            accessRequests,
            datasetsWithTechMetaData,
            uptime,
            uniqueUsers,
            topDatasets,
        } = this.state;

        if (isLoading) {
            return (
                <LayoutContent>
                    <Loading data-testid='isLoading' />
                </LayoutContent>
            );
        }

        return (
            <Fragment>
                <Row>
                    <Col sm={1} lg={1}></Col>
                    <Col sm={10} lg={10} className='dashboardPadding'>
                        <Row className='accountHeader'>
                            <Col sm={12} lg={12}>
                                <Row>
                                    <Col sm={8} lg={8}>
                                        <span className='black-20-semibold'>Dashboard</span>
                                    </Col>
                                    <Col sm={4} lg={4}>
                                        <span className='gray700-13 floatRight' data-test-id='dashboard-metrics-last-updated'>
                                            Last updated: {moment().format('DD MMM YYYY, hh:mm')}
                                        </span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} lg={12}>
                                        <span className='gray700-13'>
                                            A collection of statistics, metrics and analytics; giving an overview of the sites data and
                                            performance
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='kpiContainer'>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI kpiText='total datasets' kpiValue={statsDataType.dataset} testId='dashboard-dataset-count' />
                            </Col>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI
                                    kpiText='datasets with technical metadata'
                                    kpiValue={datasetsWithTechMetaData.toFixed(0)}
                                    percentageFlag={true}
                                    testId='dashboard-dataset-metadata-percent'
                                />
                            </Col>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI
                                    kpiText='unique registered users'
                                    kpiValue={uniqueUsers.toFixed(0)}
                                    percentageFlag={true}
                                    testId='dashboard-users-registered-percent'
                                />
                            </Col>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI
                                    kpiText='uptime in current month'
                                    kpiValue={uptime.toFixed(2) % 1 === 0 ? Math.trunc(uptime.toFixed(2)) : uptime.toFixed(2)}
                                    percentageFlag={true}
                                    testId='dashboard-gateway-uptime-percent'
                                />
                            </Col>
                        </Row>

                        <Row className='accountHeader mt-2'>
                            <Col sm={12} lg={12}>
                                <Row>
                                    <Col sm={7} lg={8}>
                                        <span className='black-16-semibold'>Monthly</span>
                                        <br />
                                        <span className='gray700-13'>View the site’s data and performance on a monthly basis</span>
                                    </Col>
                                    <Col sm={5} lg={4}>
                                        <div className='select_option'>
                                            <DropdownButton
                                                variant='light'
                                                alignRight
                                                className='floatRight gray800-14'
                                                title={moment(this.state.selectedOption).format('MMMM YYYY')}
                                                id='dateDropdown'
                                                onSelect={this.handleDateSelect.bind(this)}
                                            >
                                                {dates.map((date, i) => (
                                                    <Dropdown.Item className='gray800-14' key={i} eventKey={i}>
                                                        {moment(date).format('MMMM YYYY')}
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row className='kpiContainer'>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI kpiText='users this month' kpiValue={gaUsers} testId='dashboard-users-monthly-count' />
                            </Col>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI
                                    kpiText='searches with results this month'
                                    kpiValue={searchesWithResults.toFixed(0)}
                                    percentageFlag={true}
                                    testId='dashboard-searches-results-percent'
                                />
                            </Col>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI
                                    kpiText='data access requests this month'
                                    kpiValue={accessRequests}
                                    testId='dashboard-data-access-requests-count'
                                />
                            </Col>
                            <Col sm={3} lg={3} className='kpiClass'>
                                <DashboardKPI kpiText='' kpiValue='' />
                            </Col>
                        </Row>

                        <Row className='accountHeader margin-top-16'>
                            <Col sm={12} lg={12} className='noPadding'>
                                <Row>
                                    <Col sm={12} lg={12}>
                                        <span className='black-20'>Data access request</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} lg={12}>
                                        <span className='gray700-13'>
                                            Most popular datasets based on the number of data access requests
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {topDatasets.length === 0 ? (
                            this.renderNoResults('There were no data access requests this month')
                        ) : (
                            <Row className='entryBox noPadding'>
                                <Col sm={12} lg={12} className='resultsPadding'>
                                    <Row className='dashboardHeader entrybox gray800-14-bold'>
                                        <Col sm={5} lg={6} className='noPadding'>
                                            Dataset{' '}
                                        </Col>
                                        <Col sm={4} lg={4} className='pad-right-0 pad-left-16'>
                                            Custodian
                                        </Col>
                                        <Col sm={3} lg={2} className='pad-right-0 pad-left-16'>
                                            Requests
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} lg={12}>
                                            {topDatasets.map((dat, i) => {
                                                return <TopDatasets key={i} data={dat} />;
                                            })}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )}

                        <Row className='accountHeader margin-top-16' style={{ marginBottom: '0.5px' }}>
                            <Col sm={12} lg={12}>
                                <Row>
                                    <Col sm={12} lg={12}>
                                        <span className='black-20'>Top searches</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12} lg={12}>
                                        <span className='gray700-13'>Most popular search terms and results</span>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        {topSearches.length === 0 ? (
                            this.renderNoResults("There isn't enough data available for this month yet")
                        ) : (
                            <Fragment>
                                <Row>
                                    <Col sm={12} lg={12}>
                                        <Row className='subHeader entrybox gray800-14-bold'>
                                            <Col sm={5} lg={6}>
                                                Search term{' '}
                                            </Col>
                                            <Col sm={2} lg={2}>
                                                Searches
                                            </Col>
                                            <Col sm={5} lg={4}>
                                                Latest results
                                            </Col>
                                        </Row>
                                        {topSearches.map((dat, i) => {
                                            return <TopSearches key={i} data={dat} />;
                                        })}
                                    </Col>
                                </Row>
                            </Fragment>
                        )}

                        <UnmetDemandSection
                            data={data}
                            key={key}
                            handleSelect={this.handleSelect.bind(this)}
                            renderNoResults={this.renderNoResults}
                        />
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
            </Fragment>
        );
    }
}

export default AccountAnalyticsDashboard;

const getDatesForDropdown = (req, res) => {
    let startDate = new Date('2020-06-01T00:00:00.000Z');
    let stopDate = new Date();
    let dateArray = new Array();
    let currentDate = startDate;

    while (currentDate <= stopDate) {
        if (moment(currentDate).isDST() === false) {
            currentDate.setHours(0);
        }
        dateArray.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return dateArray.reverse();
};

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};
