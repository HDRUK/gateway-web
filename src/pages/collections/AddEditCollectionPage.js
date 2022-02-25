import React from 'react';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { Container } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import moment from 'moment';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import { isEditMode } from '../../utils/GeneralHelper.util';
import AddEditCollectionForm from './AddEditCollectionForm';
import ErrorModal from '../commonComponents/errorModal';
import './Collections.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AddEditCollectionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.searchBar = React.createRef();
    }

    // initialize our state
    state = {
        data: [],
        combinedUsers: [],
        combinedKeywords: [],
        isLoading: true,
        userState: [],
        searchString: '',
        datasetData: [],
        toolData: [],
        datauseData: [],
        personData: [],
        paperData: [],
        courseData: [],
        summary: [],
        tempRelatedObjectIds: [],
        relatedObjects: [],
        didDelete: false,
        showDrawer: false,
        showModal: false,
        context: {},
        publicFlag: false,
        isEdit: isEditMode(window.location.pathname),
    };

    async componentDidMount() {
        await Promise.all([this.doGetUsersCall(), this.doGetKeywordsCall()]);

        if (this.state.isEdit) this.getDataSearchFromDb();
        else this.setState({ isLoading: false });
    }

    getDataSearchFromDb = () => {
        this.setState({ isLoading: true });
        axios.get(baseURL + '/api/v1/collections/' + this.props.match.params.collectionID).then(res => {
            this.setState({
                data: res.data.data[0],
                relatedObjects: res.data.data[0].relatedObjects ? res.data.data[0].relatedObjects : [],
                publicFlag: res.data.data[0].publicflag,
            });

            this.setState({ isLoading: false });
        });
    };

    doGetUsersCall() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/users').then(res => {
                this.setState({ combinedUsers: res.data.data });
                resolve();
            });
        });
    }

    doGetKeywordsCall() {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + '/api/v1/search/filter/keywords/collection').then(res => {
                var tempKeywordsArray = [];

                res.data.data[1].forEach(dat => {
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
            if (type === 'datause' && page > 0) searchURL += '&dataUseRegisterIndex=' + page;
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
                        personData: res.data.personResults || [],
                        paperData: res.data.paperResults || [],
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
            updatedTempRelatedObjectIds.push({ objectId: id, type: type, pid: pid });
        }
        this.setState({ tempRelatedObjectIds: updatedTempRelatedObjectIds });
    };

    addToRelatedObjects = () => {
        this.state.tempRelatedObjectIds.map(object => {
            this.state.relatedObjects.push({
                objectId: object.objectId,
                reason: '',
                objectType: object.type,
                pid: object.type === 'dataset' ? object.pid : '',
                user: this.state.userState[0].name,
                updated: moment().format('DD MMM YYYY'),
            });
        });

        this.setState({ tempRelatedObjectIds: [] });
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

    updatePublicFlag = publicFlag => {
        this.setState(prevState => {
            return { publicFlag: !prevState.publicFlag };
        });
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
            combinedUsers,
            combinedKeywords,
            isLoading,
            userState,
            searchString,
            datasetData,
            toolData,
            personData,
            paperData,
            datauseData,
            courseData,
            summary,
            relatedObjects,
            didDelete,
            showDrawer,
            showModal,
            context,
            publicFlag,
            isEdit,
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

                    <AddEditCollectionForm
                        data={data}
                        combinedUsers={combinedUsers}
                        combinedKeywords={combinedKeywords}
                        userState={userState}
                        searchString={searchString}
                        doSearchMethod={this.doModalSearch}
                        doUpdateSearchString={this.updateSearchString}
                        datasetData={datasetData}
                        toolData={toolData}
                        datauseData={datauseData}
                        personData={personData}
                        paperData={paperData}
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
                        publicFlag={publicFlag}
                        updatePublicFlag={this.updatePublicFlag}
                        isEdit={isEdit}
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

export default AddEditCollectionPage;
