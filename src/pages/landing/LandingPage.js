import React, { useState } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import UserMenu from '../commonComponents/UserMenu';

import Loading from '../commonComponents/Loading';

import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as WhiteLogoSvg } from '../../../src/images/white.svg';

var baseURL = require('../commonComponents/BaseURL').getURL();

class LandingPage extends React.Component {

    state = {
        searchString: null,
        data: [],
        isLoading: false,
        userState: [{
            loggedIn: false,
            role: "Reader",
            id: null,
            name: null
        }],
        searchData: [],
        unmetData: [],
        popularData: [],
        updatesData: []
    }

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
    }

    componentDidMount() {
        this.setState({ searchString: '' });
        document.getElementById("SearchInputSpan").focus();
        this.getRecentSearches();
        this.getUnmetData();
        this.getPopularData();
        this.getUpdatesData();
        this.getDataSearchFromDb();
    }

    getDataSearchFromDb = () => {
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/stats')
            .then((res) => {
                this.setState({
                    data: {
                        'project': res.data.data.typecounts.project,
                        'tool': res.data.data.typecounts.tool,
                        'account': res.data.data.typecounts.person,
                        'accessRequests': res.data.data.typecounts.accessRequests,
                        'datasets': res.data.data.typecounts.datasets,
                        'searches': res.data.data.daycounts.week
                    } ,
                    isLoading: false
                });
            })
    };

    getRecentSearches = () => {
        axios.get(baseURL + '/api/v1/stats/recent')
            .then((res) => {
                this.setState({
                    searchData: res.data.data
                });
            });
    };

    getUnmetData = () => {
        axios.get(baseURL + '/api/v1/stats/unmet')
            .then((res) => {
                this.setState({
                    unmetData: res.data.data
                });
            });
    };

    getPopularData = () => {
        axios.get(baseURL + '/api/v1/stats/popular')
            .then((res) => {
                this.setState({
                    popularData: res.data.data
                });
            });
    };

    getUpdatesData = () => {
        axios.get(baseURL + '/api/v1/stats/updates')
            .then((res) => {
                this.setState({
                    updatesData: res.data.data
                });
            });
    };


    doSearch = (e) => { //fires on enter on searchbar
        if (e.key === 'Enter') {
            if (!!this.state.searchString) {
                window.location.href = window.location.pathname + "search?search=" + this.state.searchString + '&type=all';
            }
        }
    }

    changeText = (e) => {
        this.setState({ searchString: e.target.value });
    }

    logout = (e) => {
        axios.get(baseURL + '/api/v1/auth/logout')
            .then((res) => {
                window.location.href = "/";
            });
    }

    render() {
        const { data, userState, isLoading, searchData, unmetData, popularData, updatesData, datasetsCount } = this.state;

        if (isLoading) {
            return <Container><Loading /></Container>;
        }

        return (
            <div className="LandingBackground">
                <Row className="pt-5 pl-5">
                    <Col xs={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }}> <WhiteLogoSvg /> </Col>
                    <Col xs={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }}>
                        <div className="signLinkLanding">
                            <UserMenu userState={userState} isLanding="true" />
                        </div>
                    </Col>
                </Row>
                <Container>
                    <Row id="landingPageEmptyRow"></Row>
                    <Row>
                        <Col sm={2} />
                        <Col sm={8}>
                            <div id="landingPageCard" className="bg-transparent mb-2" border="0" >
                                Explore tools, resources and code used in health research across the UK
                            </div>
                        </Col>
                        <Col sm={2} />
                    </Row>
                    <Row className="mt-5">
                        <Col sm={1} />
                        <Col sm={10}>
                            <span className="SearchBarInput">
                                <SVGIcon name="searchicon" width={20} height={20} fill={'#2c8267'} stroke='none' type="submit" className="ml-2 mr-3 mt-3" />
                                <input type="text" placeholder="Search" className="" id="SearchInputSpan" onChange={this.changeText} onKeyDown={this.doSearch} />
                            </span>
                        </Col>
                        <Col sm={1} />
                    </Row>
                    <Row className="mt-5" />
                    <Row>
                        <Col sm={2}>
                            <div className="landingPageInformationNumber">{data.account}</div>
                            <div className="landingPageInformationDetail">accounts created</div>
                        </Col>
                        <Col sm={2}>
                            <div className="landingPageInformationNumber">{data.datasets}</div>
                            <div className="landingPageInformationDetail">datasets</div>
                        </Col>
                        <Col sm={2}>
                            <div className="landingPageInformationNumber">{data.accessRequests}</div>
                            <div className="landingPageInformationDetail">access requests</div>
                        </Col>
                        <Col sm={2}>
                            <div className="landingPageInformationNumber">{data.project}</div>
                            <div className="landingPageInformationDetail">projects added</div>
                        </Col>
                        <Col sm={2}>
                            <div className="landingPageInformationNumber">{data.tool}</div>
                            <div className="landingPageInformationDetail">tools added</div>
                        </Col>
                        <Col sm={2}>
                            <div className="landingPageInformationNumber">{data.searches}</div>
                            <div className="landingPageInformationDetail">searches in last week</div>
                        </Col>
                    </Row>
                </Container>
                <Container className="mt-5 mb-5" />
                <Container>
                    <Row>
                        <Col sm={12} lg={6}>
                            <RecentSearches searchData={searchData} />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Popular popularData={popularData} />
                        </Col>
                        <Col sm={12} lg={6}>
                            <UnmetDemand unmetData={unmetData} />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Updates updatesData={updatesData} />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

class RecentSearches extends React.Component {

    // initialize our state
    state = {
        searchData: [],
    };

    constructor(props) {
        super(props)
        this.state.searchData = props.searchData;
    }

    render() {
        const { searchData } = this.state;

        return (
            <Row className="mt-2">
                <Col>
                    <div className="LandingBox">
                        <Row >
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="mt-3 mb-1">
                                <span className="Black-16px"> Recent Searches </span>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="GreyStrip" />
                            <Col sm={1} lg={1} />
                        </Row>

                        {searchData.map((searchDat) => {
                            return (
                                searchDat._id === '' ? '' :
                                    <div>
                                        <Row >
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="mt-2 mb-2">
                                                <a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/search?search=' + searchDat._id + '&type=all&toolcategory=&programminglanguage=&features=&topics='}> {searchDat._id} </a>
                                                <br />
                                                <span className="Gray800-14px">
                                                    {!searchDat.returned.tool ? '' :
                                                        <>
                                                            {searchDat.returned.tool}
                                                            {searchDat.returned.tool === 1 ? " tool" : " tools"}
                                                        </>
                                                    }

                                                    {!searchDat.returned.project ? '' :
                                                        <>
                                                            {searchDat.returned.tool ? ', ' : ' '}
                                                            {searchDat.returned.project}
                                                            {searchDat.returned.project === 1 ? " project" : " projects"}
                                                        </>
                                                    }

                                                    {!searchDat.returned.person ? '' :
                                                        <>
                                                            {searchDat.returned.project ? ', ' : ' '}
                                                            {searchDat.returned.person}
                                                            {searchDat.returned.person === 1 ? " person" : " persons"}
                                                        </>
                                                    }
                                                </span>
                                            </Col>
                                            <Col sm={1} lg={1} />
                                        </Row>
                                        <Row>
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="GreyStrip" />
                                            <Col sm={1} lg={1} />
                                        </Row>
                                    </div>
                            )
                        })}

                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="GreyStrip" />
                            <Col sm={1} lg={1} />
                        </Row>
                    </div>
                </Col>
            </Row>
        );
    }
}

class Popular extends React.Component {

    // initialize our state
    state = {
        popularData: []
    };

    constructor(props) {
        super(props)
        this.state.popularData = props.popularData;
    }

    render() {
        const { popularData } = this.state;

        return (
            <Row className="mt-2">
                <Col>
                    <div className="LandingBox">
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="mt-3 mb-1">
                                <span className="Black-16px"> Most popular this month </span>
                            </Col>
                            <Col sm={1} lg={1} />

                        </Row>
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="GreyStrip" />
                            <Col sm={1} lg={1} />
                        </Row>

                        {popularData.map((popular) => {
                            return (
                                popular._id === '' ? '' :
                                    <div>
                                        <Row >
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="mt-2 mb-2">
                                                {(() => {
                                                    if (popular.type === "person") {
                                                        return <><a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/person/' + popular.id} >{popular.firstname} {popular.lastname}</a></>
                                                    }
                                                    else if (popular.type === "tool") {
                                                        return <><a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/tool/' + popular.id} >{popular.name}</a></>
                                                    }
                                                    else if (popular.type === "project") {
                                                        return <><a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/project/' + popular.id} >{popular.name}</a></>
                                                    }
                                                })()}
                                                <br />
                                                <span className="Gray800-14px">
                                                    {(() => {
                                                        if (popular.type === "person") {
                                                            return <>{popular.bio} </>
                                                        }
                                                        else {
                                                            return <>
                                                                {!popular.categories.category ? '' : <span className="Gray800-14px">{popular.categories.category}</span>}
                                                                {!popular.categories.programmingLanguage || popular.categories.programmingLanguage.length <= 0 ? '' : ', '}
                                                                {!popular.categories.programmingLanguage || popular.categories.programmingLanguage.length <= 0 ? '' : popular.categories.programmingLanguage.map((language) => {
                                                                    return <span className="Gray800-14px">{language}</span>
                                                                })}
                                                            </>
                                                        }
                                                    })()}
                                                </span>
                                            </Col>
                                            <Col sm={1} lg={1} />
                                        </Row>
                                        <Row>
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="GreyStrip" />
                                            <Col sm={1} lg={1} />
                                        </Row>
                                    </div>
                            )
                        })
                        }
                    </div>

                </Col>
            </Row>
        );
    }
}

class UnmetDemand extends React.Component {

    // initialize our state
    state = {
        unmetData: []
    };

    constructor(props) {
        super(props)
        this.state.unmetData = props.unmetData;
    }

    render() {
        const { unmetData } = this.state;

        return (
            <Row className="mt-2">
                <Col>
                    <div className="LandingBox">
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="mt-3 mb-1">
                                <span className="Black-16px"> Unmet Demand </span>
                            </Col>
                            <Col sm={1} lg={1} />

                        </Row>
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="GreyStrip" />
                            <Col sm={1} lg={1} />
                        </Row>

                        {unmetData.map((unmetDat) => {
                            return (
                                unmetData._id === '' ? '' :
                                    <div>
                                        <Row >
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="mt-2 mb-2">
                                                <a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/search?search=' + unmetDat._id + '&type=all&toolcategory=&programminglanguage=&features=&topics='}> {unmetDat._id} </a>
                                                <br />
                                                <span className="Gray800-14px"> {unmetDat.count} {unmetDat.count === 1 ? 'search' : 'searches'} but no result</span>
                                            </Col>
                                            <Col sm={1} lg={1} />
                                        </Row>
                                        <Row>
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="GreyStrip" />
                                            <Col sm={1} lg={1} />
                                        </Row>
                                    </div>
                            )
                        })
                        }
                    </div>
                </Col>
            </Row>
        );
    }
}

class Updates extends React.Component {

    // initialize our state
    state = {
        updatesData: []
    };

    constructor(props) {
        super(props)
        this.state.updatesData = props.updatesData;
    }

    render() {
        const { updatesData } = this.state;

        return (
            <Row className="mt-2">
                <Col>
                    <div className="LandingBox">
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="mt-3 mb-1">
                                <span className="Black-16px"> Recently updated </span>
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className="GreyStrip" />
                            <Col sm={1} lg={1} />
                        </Row>

                        {updatesData.map((updates) => {
                            return (
                                updates._id === '' ? '' :
                                    <div>
                                        <Row >
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="mt-2 mb-2">
                                                <span className="Purple-14px">
                                                    {(() => {
                                                        if (updates.type === "person") {
                                                            return <><a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/person/' + updates.id} >{updates.firstname} {updates.lastname}</a></>
                                                        }
                                                        else if (updates.type === "tool") {
                                                            return <><a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/tool/' + updates.id} >{updates.name}</a></>
                                                        }
                                                        else if (updates.type === "project") {
                                                            return <><a className="Purple-14px" style={{ cursor: 'pointer' }} href={'/project/' + updates.id} >{updates.name}</a></>
                                                        }
                                                    })()}
                                                </span>
                                                <br />
                                                <span className="Gray800-14px">
                                                    {(() => {
                                                        if (updates.type === "person") {
                                                            return <>{updates.bio} </>
                                                        }
                                                        else {
                                                            return <>
                                                                {!updates.categories.category ? '' : <span className="Gray800-14px">{updates.categories.category}</span>}
                                                                {!updates.categories.programmingLanguage || updates.categories.programmingLanguage.length <= 0 ? '' : ', '}
                                                                {!updates.categories.programmingLanguage || updates.categories.programmingLanguage.length <= 0 ? '' : updates.categories.programmingLanguage.map((language) => {
                                                                    return <span className="Gray800-14px">{language}</span>
                                                                })}
                                                            </>
                                                        }
                                                    })()}
                                                </span>
                                            </Col>
                                            <Col sm={1} lg={1} />
                                        </Row>
                                        <Row>
                                            <Col sm={1} lg={1} />
                                            <Col sm={10} lg={10} className="GreyStrip" />
                                            <Col sm={1} lg={1} />
                                        </Row>
                                    </div>
                            )
                        })
                        }
                    </div>
                </Col>
            </Row>
        );
    }
}

export default LandingPage;

