import React from 'react';
import axios from 'axios';
import moment from 'moment';
import * as Sentry from '@sentry/react';
import { Container } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import AddEditProjectForm from './AddEditProjectForm';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import { isEditMode } from '../../utils/GeneralHelper.util';
import 'react-bootstrap-typeahead/css/Typeahead.css';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AddEditProjectPage extends React.Component {
	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.searchBar = React.createRef();
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
		await Promise.all([this.doGetTopicsCall(), this.doGetCategoriesCall(), this.doGetUsersCall(), this.doGetFeaturesCall()]);
		if (this.state.isEdit) this.getProjectFromDb();
		else this.setState({ isLoading: false });
	}

	getProjectFromDb = () => {
		//need to handle error if no id is found
		this.setState({ isLoading: true });
		axios.get(baseURL + '/api/v1/projects/' + this.props.match.params.projectID).then(res => {
			this.setState({
				data: res.data.data[0],
				relatedObjects: res.data.data[0].relatedObjects ? res.data.data[0].relatedObjects : [],
			});
			this.setState({ isLoading: false });
		});
	};

	doGetTopicsCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/topic/project').then(res => {
				this.setState({
					combinedTopic: res.data.data[0].sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
					}),
				});
				resolve();
			});
		});
	}

	doGetFeaturesCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/feature/project').then(res => {
				this.setState({
					combinedFeatures: res.data.data[0].sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
					}),
				});
				resolve();
			});
		});
	}

	doGetCategoriesCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/category/project').then(res => {
				this.setState({
					combinedCategories: res.data.data[0].sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase() ? -1 : a.toUpperCase() > b.toUpperCase() ? 1 : 0;
					}),
				});
				resolve();
			});
		});
	}

	doGetUsersCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/users').then(res => {
				this.setState({ combinedUsers: res.data.data });
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
			if (type === 'project' && page > 0) searchURL += '&projectIndex=' + page;
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
						projectData: res.data.projectResults || [],
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
		this.setState({ relatedObjects: [...relatedObjects, ...newRelatedObjects] });
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
			newRelatedObjects = [...this.state.relatedObjects].filter(obj => obj.objectId !== datasetid && obj.objectId !== datasetid.toString());
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
			combinedTopic,
			combinedCategories,
			combinedUsers,
			combinedFeatures,
			isLoading,
			userState,
			searchString,
			datasetData,
			toolData,
			projectData,
			personData,
			paperData,
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

					<AddEditProjectForm
						data={data}
						isEdit={isEdit}
						combinedTopic={combinedTopic}
						combinedCategories={combinedCategories}
						combinedUsers={combinedUsers}
						combinedFeatures={combinedFeatures}
						userState={userState}
						searchString={searchString}
						doSearchMethod={this.doModalSearch}
						doUpdateSearchString={this.updateSearchString}
						datasetData={datasetData}
						toolData={toolData}
						projectData={projectData}
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

export default AddEditProjectPage;
