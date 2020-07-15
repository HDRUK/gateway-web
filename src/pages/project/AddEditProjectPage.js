import React from 'react';
import { initGA } from '../../tracking';
import moment from 'moment';
import { Container } from 'react-bootstrap';
import SearchBar from '../commonComponents/SearchBar';
import Loading from '../commonComponents/Loading'
import AddEditProjectForm from './AddEditProjectForm';

import { axiosIG } from '../../utils/axios.util';

import 'react-bootstrap-typeahead/css/Typeahead.css';

class AddEditProjectPage extends React.Component {

    constructor(props) {
        super(props)
        this.state.userState = props.userState;
        if (props.isEdit ) this.state.isEdit = props.isEdit;
    }

    // initialize our state
    state = {
        data: [],
        combinedTopic: [],
        combinedFeatures: [],
        combinedCategories: [],
        combinedUsers: [],
        isLoading: true, 
        userState: [],
        searchString: '',
        datasetData: [],
        toolData: [],
        projectData: [],
        personData: [],
        paperData: [],
        summary: [],
        tempRelatedObjectIds: [],
        relatedObjectIds: [],
        relatedObjects: [],
        didDelete: false,
        isEdit: false
    };

    async componentDidMount() {
        initGA('UA-166025838-1');
        await Promise.all([
            this.doGetTopicsCall(),
            this.doGetCategoriesCall(),
            this.doGetUsersCall(),
            this.doGetFeaturesCall()
        ])
        if (this.state.isEdit) this.getProjectFromDb();
        else this.setState({ isLoading: false });
    }

    getProjectFromDb = () => {
        //need to handle error if no id is found
        this.setState({ isLoading: true });
        axiosIG.get('/api/v1/project/edit/' + this.props.match.params.projectID)
            .then((res) => {
                this.setState({
                    data: res.data.data[0],
                    relatedObjects: res.data.data[0].relatedObjects ? res.data.data[0].relatedObjects : []
                });
                this.setState({isLoading: false})
            });
    };

    doGetTopicsCall() {
        return new Promise((resolve, reject) => {
            axiosIG.get('/api/v1/search/filter/topic/project')
                .then((res) => {
                    this.setState({ combinedTopic: res.data.data.sort(function (a, b) { return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; }) });
                    resolve();
                });
        });
    }

    doGetFeaturesCall() {
        return new Promise((resolve, reject) => {
            axiosIG.get('/api/v1/search/filter/feature/project')
                .then((res) => {
                    this.setState({ combinedFeatures: res.data.data.sort(function (a, b) { return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; }) });
                    resolve();
                });
        });
    }

    doGetCategoriesCall() {
        return new Promise((resolve, reject) => {
            axiosIG.get('/api/v1/search/filter/category/project')
                .then((res) => {
                    this.setState({ combinedCategories: res.data.data.sort(function (a, b) { return (a.toUpperCase() < b.toUpperCase()) ? -1 : (a.toUpperCase() > b.toUpperCase()) ? 1 : 0; }) });
                    resolve();
                });
        });
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

    doSearch = (e) => { //fires on enter on searchbar
        if (e.key === 'Enter') {
            if (!!this.state.searchString) {
                window.location.href = window.location.search + "/search?search=" + this.state.searchString;
            }
        }
    }

    updateSearchString = (searchString) => {
        this.setState({ searchString: searchString });
    }

    doModalSearch = (e, type, page) => {

        if (e.key === 'Enter' || e === 'click') {

            var searchURL = '';

            if (type === 'dataset' && page > 0) searchURL += '&datasetIndex=' + page;
            if (type === 'tool' && page > 0) searchURL += '&toolIndex=' + page;
            if (type === 'project' && page > 0) searchURL += '&projectIndex=' + page;
            if (type === 'person' && page > 0) searchURL += '&personIndex=' + page;
        
        axiosIG.get('/api/v1/search?search=' + this.state.searchString + searchURL )
            .then((res) => {
                this.setState({
                    datasetData: res.data.datasetResults || [],
                    toolData: res.data.toolResults || [],
                    projectData: res.data.projectResults || [],
                    personData: res.data.personResults || [],
                    paperData: res.data.paperResults || [],
                    summary: res.data.summary || [],
                    isLoading: false
                });
            })
        }
    }

    addToTempRelatedObjects = (id, type) => {

        if(this.state.tempRelatedObjectIds && this.state.tempRelatedObjectIds.some(object => object.objectId === id)){
            this.state.tempRelatedObjectIds = this.state.tempRelatedObjectIds.filter(object => object.objectId !== id);
        }
        else {
            this.state.tempRelatedObjectIds.push({'objectId':id, 'type':type})
        }
       this.setState({tempRelatedObjectIds: this.state.tempRelatedObjectIds})
    }

    addToRelatedObjects = () => {
        this.state.tempRelatedObjectIds.map((object) => {
            this.state.relatedObjects.push({'objectId':object.objectId, 'reason':'', 'objectType':object.type, 'user':this.state.userState[0].name, 'updated':moment().format("DD MMM YYYY")})
        })

        this.setState({tempRelatedObjectIds: []})
    }

    clearRelatedObjects = () => {
        this.setState({tempRelatedObjectIds: [] })
    }

    removeObject = (id) => {
        this.state.relatedObjects = this.state.relatedObjects.filter(obj => obj.objectId !== id.toString());
        this.setState({relatedObjects: this.state.relatedObjects})
        this.setState({didDelete: true});
    }

    updateDeleteFlag = () => {
        this.setState({didDelete: false});
    }

    render() {
        const { data, isEdit, combinedTopic, combinedCategories, combinedUsers, combinedFeatures,
            
             isLoading, userState, searchString, datasetData, toolData, projectData, personData, paperData, summary, relatedObjects, didDelete } = this.state;

        if (isLoading) {
            return <Container><Loading /></Container>;
        }
        return (
            <div>
                <SearchBar doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
                <Container>
                    <AddEditProjectForm data={data} isEdit={isEdit} combinedTopic={combinedTopic} combinedCategories={combinedCategories} combinedUsers={combinedUsers} combinedFeatures={combinedFeatures}
                    userState={userState} searchString={searchString} doSearchMethod={this.doModalSearch} doUpdateSearchString={this.updateSearchString} datasetData={datasetData} toolData={toolData} projectData={projectData} personData={personData} paperData={paperData} summary={summary} doAddToTempRelatedObjects={this.addToTempRelatedObjects} tempRelatedObjectIds={this.state.tempRelatedObjectIds} doClearRelatedObjects={this.clearRelatedObjects} doAddToRelatedObjects={this.addToRelatedObjects} doRemoveObject={this.removeObject} relatedObjects={relatedObjects} didDelete={didDelete} updateDeleteFlag={this.updateDeleteFlag}/>
                </Container>
            </div>
        );
    }
}

export default AddEditProjectPage;