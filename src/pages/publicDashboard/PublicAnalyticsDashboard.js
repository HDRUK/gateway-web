import React, { Fragment } from 'react';
import axios from 'axios';
import moment from 'moment';
import * as Sentry from '@sentry/react';
import UnmetDemand from '../dashboard/DARComponents/UnmetDemand';
import TopSearches from '../dashboard/TopSearches';
import TopDatasets from '../dashboard/TopDatasets';

import { Container, Row, Col, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import DashboardKPI from '../dashboard/DARComponents/DashboardKPI';
import Loading from '../commonComponents/Loading';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import '../dashboard/Dashboard.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();

class PublicAnalyticsDashboard extends React.Component {
    state = {
        userState: [],
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
        showDrawer: false,
        showModal: false,
        context: {},
        searchString: '',
    };

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.state.selectedOption = this.state.dates[0];
        this.searchBar = React.createRef();
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

    async componentDidMount() {
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
        this.setState({ uniqueUsers: uniqueUsers, isLoading: false });
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
                this.setState({
                    searchesWithResults: searchesWithResults,
                    accessRequests: res.data.data.accessRequestsMonth,
                });
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
            axios
                .get(baseURL + '/api/v1/kpis?kpi=uptime&selectedDate=' + currentDate)

                .then(res => {
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

    doSearch = e => {
        //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    updateSearchString = searchString => {
        this.setState({ searchString: searchString });
    };

    toggleDrawer = () => {
        this.setState(prevState => {
            if (prevState.showDrawer === true) {
                this.searchBar.current.getNumberOfUnreadMessages();
            }
            return { showDrawer: !prevState.showDrawer };
        });
    };

    toggleModal = (showEnquiry = false, context = {}) => {
        this.setState(prevState => {
            return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
        });
    };

    render() {
        const {
            userState,
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
            showDrawer,
            showModal,
            context,
            topDatasets,
        } = this.state;

        if (isLoading) {
            return (
                <Row className='mt-4'>
                    <Col xs={1}></Col>
                    <Col xs={10}>
                        <Loading data-testid='isLoading' />
                    </Col>
                    <Col xs={1}></Col>
                </Row>
            );
        }

        return (
            <Sentry.ErrorBoundary fallback={<ErrorModal />}>
                <div>
                    <SearchBar
                        ref={this.searchBar}
                        doSearchMethod={this.doSearch}
                        doUpdateSearchString={this.updateSearchString}
                        doToggleDrawer={this.toggleDrawer}
                        userState={userState}
                    />
                    <Container>
                        <Row>
                            <Col sm={1} lg={1}></Col>
                            <Col sm={10} lg={10} className='dashboardPadding'>
                                <Row className='accountHeader mt-4'>
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
                                                    A collection of statistics, metrics and analytics; giving an overview of the sites data
                                                    and performance
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row className='kpiContainer'>
                                    <Col sm={3} lg={3} className='kpiClass'>
                                        <DashboardKPI
                                            kpiText='total datasets'
                                            kpiValue={statsDataType.dataset}
                                            testId='dashboard-dataset-count'
                                        />
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
                                        <DashboardKPI
                                            kpiText='users this month'
                                            kpiValue={gaUsers}
                                            testId='dashboard-users-monthly-count'
                                        />
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

                                <Row className='accountHeader mt-4' style={{ 'margin-bottom': '0.5px' }}>
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
                                                <Row className='subHeader entrybox gray800-14-bold' style={{ height: '44px' }}>
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
                                                {topSearches.map(dat => {
                                                    return <TopSearches data={dat} />;
                                                })}
                                            </Col>
                                        </Row>
                                    </Fragment>
                                )}

                                <Row className='accountHeader mt-4'>
                                    <Col sm={12} lg={12}>
                                        <Row>
                                            <Col sm={12} lg={12}>
                                                <span className='black-20'>Unmet demand</span>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col sm={12} lg={12}>
                                                <span className='gray700-13'>
                                                    For each resource type, which searches yielded no results, ordered by highest number of
                                                    repeat searches
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='tabsBackground'>
                                    <Col sm={12} lg={12}>
                                        <Tabs
                                            className='dataAccessTabs gray700-13'
                                            data-test-id='unmet-tabs'
                                            activeKey={this.state.key}
                                            onSelect={this.handleSelect.bind(this)}
                                        >
                                            <Tab eventKey='Datasets' title={'Datasets'}></Tab>
                                            <Tab eventKey='Tools' title={'Tools'}></Tab>
                                            <Tab eventKey='Projects' title={'Projects'}></Tab>
                                            <Tab eventKey='Courses' title={'Courses'}></Tab>
                                            <Tab eventKey='Papers' title={'Papers'}></Tab>
                                            <Tab eventKey='People' title={'People'}></Tab>
                                        </Tabs>
                                    </Col>
                                </Row>

                                {data.length === 0
                                    ? this.renderNoResults("There isn't enough data available for this month yet")
                                    : (() => {
                                          switch (key) {
                                              case 'Datasets':
                                                  return (
                                                      <div>
                                                          <Row>
                                                              <Col sm={12} lg={12}>
                                                                  <Row className='subHeader mt-3 gray800-14-bold'>
                                                                      <Col sm={8} lg={8}>
                                                                          Search term{' '}
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Searches
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Dataset results
                                                                      </Col>
                                                                  </Row>
                                                                  {data.map(dat => {
                                                                      return <UnmetDemand data={dat} />;
                                                                  })}
                                                              </Col>
                                                          </Row>
                                                      </div>
                                                  );
                                              case 'Tools':
                                                  return (
                                                      <div>
                                                          <Row>
                                                              <Col sm={12} lg={12}>
                                                                  <Row className='subHeader mt-3 gray800-14-bold'>
                                                                      <Col sm={8} lg={8}>
                                                                          Search term{' '}
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Searches
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Tool results
                                                                      </Col>
                                                                  </Row>
                                                                  {data.map(dat => {
                                                                      return <UnmetDemand data={dat} />;
                                                                  })}
                                                              </Col>
                                                          </Row>
                                                      </div>
                                                  );
                                              case 'Projects':
                                                  return (
                                                      <div>
                                                          <Row>
                                                              <Col sm={12} lg={12}>
                                                                  <Row className='subHeader mt-3 gray800-14-bold'>
                                                                      <Col sm={8} lg={8}>
                                                                          Search term{' '}
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Searches
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Project results
                                                                      </Col>
                                                                  </Row>
                                                                  {data.map(dat => {
                                                                      return <UnmetDemand data={dat} />;
                                                                  })}
                                                              </Col>
                                                          </Row>
                                                      </div>
                                                  );
                                              case 'Courses':
                                                  return (
                                                      <div>
                                                          <Row>
                                                              <Col sm={12} lg={12}>
                                                                  <Row className='subHeader mt-3 gray800-14-bold'>
                                                                      <Col sm={8} lg={8}>
                                                                          Search term{' '}
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Searches
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Project results
                                                                      </Col>
                                                                  </Row>
                                                                  {data.map(dat => {
                                                                      return <UnmetDemand data={dat} />;
                                                                  })}
                                                              </Col>
                                                          </Row>
                                                      </div>
                                                  );
                                              case 'Papers':
                                                  return (
                                                      <div>
                                                          <Row>
                                                              <Col sm={12} lg={12}>
                                                                  <Row className='subHeader mt-3 gray800-14-bold'>
                                                                      <Col sm={8} lg={8}>
                                                                          Search term{' '}
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Searches
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Paper results
                                                                      </Col>
                                                                  </Row>
                                                                  {data.map(dat => {
                                                                      return <UnmetDemand data={dat} />;
                                                                  })}
                                                              </Col>
                                                          </Row>
                                                      </div>
                                                  );
                                              case 'People':
                                                  return (
                                                      <div>
                                                          <Row>
                                                              <Col sm={12} lg={12}>
                                                                  <Row className='subHeader mt-3 gray800-14-bold'>
                                                                      <Col sm={8} lg={8}>
                                                                          Search term{' '}
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          Searches
                                                                      </Col>
                                                                      <Col sm={2} lg={2}>
                                                                          People results
                                                                      </Col>
                                                                  </Row>
                                                                  {data.map(dat => {
                                                                      return <UnmetDemand data={dat} />;
                                                                  })}
                                                              </Col>
                                                          </Row>
                                                      </div>
                                                  );
                                              default:
                                                  return key;
                                          }
                                      })()}
                            </Col>
                            <Col sm={1} lg={10} />
                        </Row>
                    </Container>
                    <SideDrawer open={showDrawer} closed={this.toggleDrawer}>
                        <UserMessages
                            userState={userState[0]}
                            closed={this.toggleDrawer}
                            toggleModal={this.toggleModal}
                            drawerIsOpen={this.state.showDrawer}
                        />
                    </SideDrawer>

                    <DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
                </div>
            </Sentry.ErrorBoundary>
        );
    }
}

export default PublicAnalyticsDashboard;

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
