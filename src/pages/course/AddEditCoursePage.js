import React from 'react';
import axios from 'axios';
import moment from 'moment';
import * as Sentry from '@sentry/react';
import { Container } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import AddEditCourseForm from './AddEditCourseForm';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import { isEditMode } from '../../utils/GeneralHelper.util';
import 'react-bootstrap-typeahead/css/Typeahead.css';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AddEditCoursePage extends React.Component {
    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.searchBar = React.createRef();
    }

    // initialize our state
    state = {
        data: [],
        combinedDomains: [],
        combinedKeywords: [],
        combinedAwards: [],
        isLoading: true,
        userState: [],
        searchString: '',
        datasetData: [],
        toolData: [],
        datauseData: [],
        paperData: [],
        personData: [],
        courseData: [],
        summary: [],
        tempRelatedObjectIds: [],
        relatedObjects: [],
        didDelete: false,
        isEdit: isEditMode(window.location.pathname),
        showDrawer: false,
        showModal: false,
        context: {},
    };

    async componentDidMount() {
        await Promise.all([this.doGetDomainsCall(), this.doGetKeywordsCall(), this.doGetAwardsCall()]);
        if (this.state.isEdit) this.getToolFromDb();
        else this.setState({ isLoading: false });
    }

    getToolFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/course/edit/' + this.props.match.params.courseID).then(res => {
            this.setState({
                data: res.data.data[0],
                relatedObjects: res.data.data[0].relatedObjects ? res.data.data[0].relatedObjects : [],
            });
            this.setState({ isLoading: false });
        });
    };

    doGetDomainsCall() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/search/filter/domains/course').then(res => {
                var tempDomainsArray = [
                    /* 'Blood'*/
                ];

                res.data.data[0].forEach(dat => {
                    if (!tempDomainsArray.includes(dat) && dat !== '') {
                        tempDomainsArray.push(dat);
                    }
                });
                this.setState({
                    combinedDomains: tempDomainsArray.sort(function (a, b) {
                        return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
                    }),
                });
                resolve();
            });
        });
    }

    doGetKeywordsCall() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/search/filter/keywords/course').then(res => {
                var tempKeywordsArray = [
                    /* 'Arbitrage' */
                ];

                res.data.data[0].forEach(dat => {
                    if (!tempKeywordsArray.includes(dat) && dat !== '') {
                        tempKeywordsArray.push(dat);
                    }
                });

                this.setState({
                    combinedKeywords: tempKeywordsArray.sort(function (a, b) {
                        return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
                    }),
                });
                resolve();
            });
        });
    }

    doGetAwardsCall() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/search/filter/awards/course').then(res => {
                var tempAwardsArray = ['CPD', 'Fellowship', 'PhD', 'CPE', 'PGCert', 'PGDip', 'MSc', 'DPhil', 'BSc'];

                res.data.data[0].forEach(dat => {
                    if (!tempAwardsArray.includes(dat) && dat !== '') {
                        tempAwardsArray.push(dat);
                    }
                });

                this.setState({
                    combinedAwards: tempAwardsArray.sort(function (a, b) {
                        return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
                    }),
                });
                resolve();
            });
        });
    }

    doSearch = e => {
        //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    updateSearchString = searchString => {
        this.setState({ searchString: searchString });
    };

    doModalSearch = (e, type, page) => {
        if (e.key === 'Enter' || e === 'click') {
            var searchURL = '';

            if (type === 'dataset' && page > 0) searchURL += '&datasetIndex=' + page;
            if (type === 'tool' && page > 0) searchURL += '&toolIndex=' + page;
            if (type === 'datauseData' && page > 0) searchURL += '&datauseDataIndex=' + page;
            if (type === 'paper' && page > 0) searchURL += '&paperIndex=' + page;
            if (type === 'person' && page > 0) searchURL += '&personIndex=' + page;
            if (type === 'course' && page > 0) searchURL += '&courseIndex=' + page;

            axios
                .get(baseURL + '/api/v1/search?search=' + encodeURIComponent(this.state.searchString) + searchURL, {
                    params: {
                        form: true,
                        userID: this.state.userState[0].id,
                    },
                })
                .then(res => {
                    this.setState({
                        datasetData: res.data.datasetResults || [],
                        toolData: res.data.toolResults || [],
                        datauseData: res.data.dataUseRegisterResults || [],
                        paperData: res.data.paperResults || [],
                        personData: res.data.personResults || [],
                        courseData: res.data.courseResults || [],
                        summary: res.data.summary || [],
                        isLoading: false,
                    });
                });
        }
    };

    addToTempRelatedObjects = (id, type, pid) => {
        let updatedTempRelatedObjectIds = [...this.state.tempRelatedObjectIds];
        if (this.state.tempRelatedObjectIds && this.state.tempRelatedObjectIds.some(object => object.objectId === id)) {
            updatedTempRelatedObjectIds = updatedTempRelatedObjectIds.filter(object => object.objectId !== id);
        } else {
            updatedTempRelatedObjectIds.push({ objectId: id, objectType: type, pid: pid });
        }
        this.setState({ tempRelatedObjectIds: updatedTempRelatedObjectIds });
    };

    addToRelatedObjects = () => {
        let {
            userState: [user = {}],
        } = this.state;
        let relatedObjectIds = [...this.state.tempRelatedObjectIds];
        let relatedObjects = [...this.state.relatedObjects];

        let newRelatedObjects = relatedObjectIds.map(relatedObject => {
            let newRelatedObject = {
                ...relatedObject,
                objectId: relatedObject.type === 'dataset' ? relatedObject.pid : relatedObject.objectId,
                user: user.name,
                updated: moment().format('DD MMM YYYY'),
            };
            return newRelatedObject;
        });

        this.setState({ relatedObjects: [...relatedObjects, ...newRelatedObjects], tempRelatedObjectIds: [] });
    };

    clearRelatedObjects = () => {
        this.setState({ tempRelatedObjectIds: [] });
    };

    removeObject = (id, type, datasetid) => {
        let countOfRelatedObjects = this.state.relatedObjects.length;
        let newRelatedObjects = [...this.state.relatedObjects].filter(
            obj => obj.objectId !== id && obj.objectId !== id.toString() && obj.pid !== id
        );

        //if an item was not removed try removing by datasetid for retro linkages
        if (countOfRelatedObjects <= newRelatedObjects.length && type === 'dataset') {
            newRelatedObjects = [...this.state.relatedObjects].filter(
                obj => obj.objectId !== datasetid && obj.objectId !== datasetid.toString()
            );
        }
        this.setState({ relatedObjects: newRelatedObjects, didDelete: true });
    };

    updateDeleteFlag = () => {
        this.setState({ didDelete: false });
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
            data,
            isEdit,
            combinedDomains,
            combinedKeywords,
            combinedAwards,
            isLoading,
            userState,
            searchString,
            datasetData,
            toolData,
            datauseData,
            paperData,
            personData,
            courseData,
            summary,
            relatedObjects,
            didDelete,
            showDrawer,
            showModal,
            context,
        } = this.state;

        if (isLoading) {
            return (
                <Container>
                    <Loading />
                </Container>
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

                    <AddEditCourseForm
                        data={data}
                        isEdit={isEdit}
                        combinedDomains={combinedDomains}
                        combinedKeywords={combinedKeywords}
                        combinedAwards={combinedAwards}
                        userState={userState}
                        searchString={searchString}
                        doSearchMethod={this.doModalSearch}
                        doUpdateSearchString={this.updateSearchString}
                        datasetData={datasetData}
                        toolData={toolData}
                        datauseData={datauseData}
                        paperData={paperData}
                        personData={personData}
                        courseData={courseData}
                        summary={summary}
                        doAddToTempRelatedObjects={this.addToTempRelatedObjects}
                        tempRelatedObjectIds={this.state.tempRelatedObjectIds}
                        doClearRelatedObjects={this.clearRelatedObjects}
                        doAddToRelatedObjects={this.addToRelatedObjects}
                        doRemoveObject={this.removeObject}
                        relatedObjects={relatedObjects}
                        didDelete={didDelete}
                        updateDeleteFlag={this.updateDeleteFlag}
                    />

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

export default AddEditCoursePage;
