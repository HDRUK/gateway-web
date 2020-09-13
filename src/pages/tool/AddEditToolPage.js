import React from 'react';
import axios from 'axios';
import { initGA } from '../../tracking';
import moment from 'moment'; 
import { Container } from 'react-bootstrap';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import AddEditToolForm from './AddEditToolForm';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import 'react-bootstrap-typeahead/css/Typeahead.css';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AddEditToolPage extends React.Component {
	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		if (props.isEdit) this.state.isEdit = props.isEdit;
		this.searchBar = React.createRef();
	}

	// initialize our state
	state = {
		data: [],
		combinedTopic: [],
		combinedFeatures: [],
		combinedLanguages: [],
		combinedCategories: [],
		combinedLicenses: [],
		combinedUsers: [],
		isLoading: true,
		userState: [],
		searchString: '',
		datasetData: [],
		toolData: [],
		projectData: [],
		paperData: [],
		personData: [],
		summary: [],
		tempRelatedObjectIds: [],
		relatedObjectIds: [],
		relatedObjects: [],
		didDelete: false,
		isEdit: false,
		showDrawer: false,
		showModal: false,
		context: {}
	};

	async componentDidMount() {
		initGA('UA-166025838-1');
		await Promise.all([
			this.doGetTopicsCall(),
			this.doGetFeaturesCall(),
			this.doGetLanguagesCall(),
			this.doGetCategoriesCall(),
			this.doGetLicensesCall(),
			this.doGetUsersCall()
		]);
		if (this.state.isEdit) this.getToolFromDb();
		else this.setState({ isLoading: false });
	}

	getToolFromDb = () => {
		//need to handle error if no id is found
		this.setState({ isLoading: true });
		axios
			.get(baseURL + '/api/v1/tools/edit/' + this.props.match.params.toolID)
			.then((res) => {
				this.setState({
					data: res.data.data[0],
					relatedObjects: res.data.data[0].relatedObjects
						? res.data.data[0].relatedObjects
						: []
				});
				this.setState({ isLoading: false });
			});
	};

	doGetTopicsCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/topic/tool').then((res) => {
				var tempTopicArray = [
					'Blood',
					'Cancer and neoplasms',
					'Cardiovascular',
					'Congenital disorders',
					'Ear',
					'Eye',
					'Infection',
					'Inflammatory and immune system',
					'Injuries and accidents',
					'Mental health',
					'Metabolic and Endocrine',
					'Musculoskeletal',
					'Neurological',
					'Oral and Gastrointestinal',
					'Renal and Urogenital',
					'Reproductive health and childbirth',
					'Respiratory',
					'Skin',
					'Stroke'
				];

				res.data.data[0].forEach((to) => {
					if (!tempTopicArray.includes(to) && to !== '') {
						tempTopicArray.push(to);
					}
                });
				this.setState({
					combinedTopic: tempTopicArray.sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase()
							? -1
							: a.toUpperCase() > b.toUpperCase()
							? 1
							: 0;
					})
				});
				resolve();
			});
		});
	}

	doGetFeaturesCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/feature/tool').then((res) => {
				var tempFeaturesArray = [
					'Arbitrage',
					'Association Rules',
					'Attribution Modeling',
					'Bayesian Statistics',
					'Clustering',
					'Collaborative Filtering',
					'Confidence Interval',
					'Cross-Validation',
					'Decision Trees',
					'Deep Learning',
					'Density Estimation',
					'Ensembles',
					'Experimental Design',
					'Feature Selection',
					'Game Theory',
					'Geospatial Modeling',
					'Graphs',
					'Imputation',
					'Indexation / Cataloguing',
					'Jackknife Regression',
					'Lift Modeling',
					'Linear Regression',
					'Linkage Analysis',
					'Logistic Regression',
					'Model Fitting',
					'Monte-Carlo Simulation',
					'Naive Bayes',
					'Nearest Neighbors - (k-NN)',
					'Neural Networks',
					'Pattern Recognition',
					'Predictive Modeling',
					'Principal Component Analysis - (PCA)',
					'Random Numbers',
					'Recommendation Engine',
					'Relevancy Algorithm',
					'Rule System',
					'Scoring Engine',
					'Search Engine',
					'Segmentation',
					'Supervised Learning',
					'Support Vector Machine - (SVM)',
					'Survival Analysis',
					'Test of Hypotheses',
					'Time Series',
					'Yield Optimization'
				];

				res.data.data[0].forEach((fe) => {
					if (!tempFeaturesArray.includes(fe) && fe !== '') {
						tempFeaturesArray.push(fe);
					}
				});

				this.setState({
					combinedFeatures: tempFeaturesArray.sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase()
							? -1
							: a.toUpperCase() > b.toUpperCase()
							? 1
							: 0;
					})
				});
				resolve();
			});
		});
	}

	doGetLanguagesCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/language/tool').then((res) => {
				var tempLanguagesArray = [
					'No coding required',
					'.net',
					'AJAX',
					'ASP.NET',
					'C',
					'C#',
					'C++',
					'CSS',
					'Django',
					'HTML',
					'Java',
					'Javascript',
					'jQuery',
					'JSON',
					'Matlab',
					'MySQL',
					'Node.js',
					'Objective C',
					'PHP',
					'Python',
					'R',
					'React JS',
					'Regex',
					'Ruby',
					'Ruby on Rails',
					'SQL',
					'SQL server',
					'Swift',
					'XML'
				];

				res.data.data[0].forEach((la) => {
					if (!tempLanguagesArray.includes(la) && la !== '') {
						tempLanguagesArray.push(la);
					}
				});

				this.setState({
					combinedLanguages: tempLanguagesArray.sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase()
							? -1
							: a.toUpperCase() > b.toUpperCase()
							? 1
							: 0;
					})
				});
				resolve();
			});
		});
	}

	doGetCategoriesCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/category/tool').then((res) => {
				var tempCategoriesArray = [
					'API',
					'Code snippet',
					'Container image',
					'Dashboard',
					'Developer stack',
					'Directory',
					'Docker app',
					'Kubernetes app',
					'Library',
					'Notebook',
					'Package',
					'Platform',
					'Repository',
					'Service',
					'Software',
					'Virtual machine',
					'Web application'
				];

				res.data.data[0].forEach((ca) => {
					if (!tempCategoriesArray.includes(ca) && ca !== '') {
						tempCategoriesArray.push(ca);
					}
				});

				this.setState({
					combinedCategories: tempCategoriesArray.sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase()
							? -1
							: a.toUpperCase() > b.toUpperCase()
							? 1
							: 0;
					})
				});
				resolve();
			});
		});
	}

	doGetLicensesCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/search/filter/license/tool').then((res) => {
				var tempLicensesArray = [
					'Apache License 2.0',
					'BSD 3-Clause "New" or "Revised" license',
					'BSD 2-Clause "Simplified" or "FreeBSD" license',
					'GNU General Public License (GPL)',
					'GNU Library or "Lesser" General Public License (LGPL)',
					'MIT license',
					'Mozilla Public License 2.0',
					'Common Development and Distribution License',
					'Eclipse Public License version 2.0'
				];

				res.data.data[0].forEach((li) => {
					if (!tempLicensesArray.includes(li) && li !== '') {
						tempLicensesArray.push(li);
					}
				});

				this.setState({
					combinedLicenses: tempLicensesArray.sort(function (a, b) {
						return a.toUpperCase() < b.toUpperCase()
							? -1
							: a.toUpperCase() > b.toUpperCase()
							? 1
							: 0;
					})
				});
				resolve();
			});
		});
	}

	doGetUsersCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/users').then((res) => {
				this.setState({ combinedUsers: res.data.data });
				resolve();
			});
		});
	}

	doSearch = (e) => {
		//fires on enter on searchbar
		if (e.key === 'Enter')
			window.location.href = '/search?search=' + this.state.searchString;
	};

	updateSearchString = (searchString) => {
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

			axios
				.get(
					baseURL +
						'/api/v1/search?search=' +
						this.state.searchString +
						searchURL,
					{
						params: {
							form: true,
							userID: this.state.userState[0].id
						}
					}
				)
				.then((res) => {
					this.setState({
						datasetData: res.data.datasetResults || [],
						toolData: res.data.toolResults || [],
						projectData: res.data.projectResults || [],
						paperData: res.data.paperResults || [],
						personData: res.data.personResults || [],
						summary: res.data.summary || [],
						isLoading: false
					});
				});
		}
	};

	addToTempRelatedObjects = (id, type) => {
		let tempRelatedObjectIds = [];
		if (this.state.tempRelatedObjectIds && this.state.tempRelatedObjectIds.some((object) => object.objectId === id)) {
			tempRelatedObjectIds = this.state.tempRelatedObjectIds.filter(
				(object) => object.objectId !== id
			);
		} else {
			tempRelatedObjectIds.push({ objectId: id, type: type });
		}
		this.setState({ tempRelatedObjectIds });
	};

	addToRelatedObjects = () => {
		let relatedObjects = [...this.state.relatedObjects];
		this.state.tempRelatedObjectIds.forEach((object) => {
			relatedObjects.push({
				objectId: object.objectId,
				reason: '',
				objectType: object.type,
				user: this.state.userState[0].name,
				updated: moment().format('DD MMM YYYY')
			});
		});

		this.setState({ relatedObjects, tempRelatedObjectIds: [] });
	};

	clearRelatedObjects = () => {
		this.setState({ tempRelatedObjectIds: [] });
	};

	removeObject = (id) => {
		let relatedObjects = [...this.state.relatedObjects].filter(
			(obj) => obj.objectId.toString() !== id.toString()
		);
		this.setState({ relatedObjects, didDelete: true });
	};

	updateDeleteFlag = () => {
		this.setState({ didDelete: false });
	};

	toggleDrawer = () => {
		this.setState((prevState) => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
		});
	};

	toggleModal = (showEnquiry = false, context = {}) => {
		this.setState( ( prevState ) => {
			return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
		});
	  }

	render() {
		const {
			data,
			isEdit,
			combinedTopic,
			combinedFeatures,
			combinedLanguages,
			combinedCategories,
			combinedLicenses,
			combinedUsers,
			isLoading,
			userState,
			searchString,
			datasetData,
			toolData,
			projectData,
			paperData,
			personData,
			summary,
			relatedObjects,
			didDelete,
			showDrawer,
			showModal,
			context
		} = this.state;

		if (isLoading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}

		return (
			<div>
				<SearchBar
					ref={this.searchBar}
					doSearchMethod={this.doSearch}
					doUpdateSearchString={this.updateSearchString}
					doToggleDrawer={this.toggleDrawer}
					userState={userState}
				/>
				<Container>
					<AddEditToolForm
						data={data}
						isEdit={isEdit}
						combinedTopic={combinedTopic}
						combinedFeatures={combinedFeatures}
						combinedLanguages={combinedLanguages}
						combinedCategories={combinedCategories}
						combinedLicenses={combinedLicenses}
						combinedUsers={combinedUsers}
						userState={userState}
						searchString={searchString}
						doSearchMethod={this.doModalSearch}
						doUpdateSearchString={this.updateSearchString}
						datasetData={datasetData}
						toolData={toolData}
						projectData={projectData}
						paperData={paperData}
						personData={personData}
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
				</Container>
				<SideDrawer open={showDrawer} closed={this.toggleDrawer}>
					<UserMessages
						closed={this.toggleDrawer}
						toggleModal={this.toggleModal}
						drawerIsOpen={this.state.showDrawer}
					/>
				</SideDrawer>

				<DataSetModal 
                    open={showModal} 
                    context={context}
                    closed={this.toggleModal}
                    userState={userState[0]} 
				/>
			</div>
		);
	}
}

export default AddEditToolPage;
