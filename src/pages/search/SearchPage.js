import React, { Fragment } from 'react';
import axios from 'axios';
import googleAnalytics from '../../tracking';
import queryString from 'query-string';
import * as Sentry from '@sentry/react';
import { Container, Row, Col, Tabs, Tab, Pagination, Button, Alert } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import Filter from './components/Filter';
import FilterSelection from './components/FilterSelection';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import CollectionCard from '../commonComponents/collectionCard/CollectionCard';
import Loading from '../commonComponents/Loading';
import NoResults from '../commonComponents/NoResults';
import { NotificationContainer } from 'react-notifications';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import SortDropdown from './components/SortDropdown';
import { ReactComponent as CDStar } from '../../images/cd-star.svg';
import AdvancedSearchModal from '../commonComponents/AdvancedSearchModal/AdvancedSearchModal';
import SavedPreferencesModal from '../commonComponents/savedPreferencesModal/SavedPreferencesModal';
import SaveModal from '../commonComponents/saveModal/SaveModal';
import DataUtilityWizardModal from '../commonComponents/DataUtilityWizard/DataUtilityWizardModal';
import SVGIcon from '../../images/SVGIcon';
import './Search.scss';
import { upperFirst } from 'lodash';

let baseURL = require('../commonComponents/BaseURL').getURL();
const typeMapper = {
	Datasets: 'dataset',
	Tools: 'tool',
	Projects: 'project',
	Papers: 'paper',
	People: 'person',
	Courses: 'course',
	Collections: 'collection',
};

class SearchPage extends React.Component {
	state = {
		search: '',
		datasetSort: '',
		toolSort: '',
		projectSort: '',
		paperSort: '',
		personSort: '',
		courseSort: '',
		collectionSort: '',
		datasetIndex: 0,
		toolIndex: 0,
		projectIndex: 0,
		paperIndex: 0,
		personIndex: 0,
		courseIndex: 0,
		collectionIndex: 0,
		datasetData: [],
		toolData: [],
		projectData: [],
		paperData: [],
		personData: [],
		courseData: [],
		collectionData: [],
		filterOptions: [],
		allFilters: [],
		toolCategoriesSelected: [],
		toolProgrammingLanguageSelected: [],
		toolfeaturesSelected: [],
		toolTopicsSelected: [],
		projectCategoriesSelected: [],
		projectFeaturesSelected: [],
		projectTopicsSelected: [],
		paperFeaturesSelected: [],
		paperTopicsSelected: [],
		courseStartDatesSelected: [],
		courseProviderSelected: [],
		courseLocationSelected: [],
		courseStudyModeSelected: [],
		courseAwardSelected: [],
		courseEntryLevelSelected: [],
		courseDomainsSelected: [],
		courseKeywordsSelected: [],
		courseFrameworkSelected: [],
		coursePrioritySelected: [],
		collectionKeywordsSelected: [],
		collectionPublishersSelected: [],
		summary: [],
		key: 'Datasets',
		isLoading: true,
		isResultsLoading: true,
		showDrawer: false,
		showModal: false,
		showAdvancedSearchModal: false,
		showSavedPreferencesModal: false,
		showSavedModal: false,
		context: {},
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		],
		filtersV2Datasets: [],
		selectedV2Datasets: [],
		filtersV2Tools: [],
		selectedV2Tools: [],
		filtersV2Projects: [],
		selectedV2Projects: [],
		filtersV2Papers: [],
		selectedV2Papers: [],
		filtersV2Collections: [],
		selectedV2Collections: [],
		filtersV2Courses: [],
		selectedV2Courses: [],
		savedSearchPanel: true,
		saveSuccess: false,
		showLoggedInModal: true,
		showSavedName: '',
		perferencesSort: '',
		savedFilters: [],
		showDataUtilityWizardModal: false,
		showDataUtilityBanner: false,
		activeDataUtilityWizardStep: 1,
	};

	constructor(props) {
		super(props);
		let { search = '', tab = 'Datasets' } = queryString.parse(window.location.search);
		if (!Object.keys(typeMapper).some(key => key === tab)) {
			window.location.href = '/search?search=&tab=Datasets';
		}
		this.state.userState = props.userState;
		this.state.search = !_.isEmpty(search) ? search : props.location.search;
		this.searchBar = React.createRef();
		this.updateFilterStates = this.updateFilterStates.bind(this);
		this.doSearchCall = this.doSearchCall.bind(this);
		this.openDataUtilityWizard = this.openDataUtilityWizard.bind(this);
		this.toggleDataUtilityBanner = this.toggleDataUtilityBanner.bind(this);
		this.onWizardStepChange = this.onWizardStepChange.bind(this);
	}

	hideSavedPreferencesModal = () => {
		this.setState({ showSavedPreferencesModal: false });
	};

	hideSavedModal = () => {
		this.setState({ showSavedModal: false });
	};

	hideNoSaveSearchModal = () => {
		this.setState({ showSavedModal: false });
		this.setState({ saveSuccess: false });
	};

	showSuccessMessage = () => {
		this.setState({ saveSuccess: true });
	};

	showSavedName = data => {
		this.setState({ showSavedName: data });
	};

	toggleAdvancedSearchModal = () => {
		if (!this.state.showAdvancedSearchModal) {
			googleAnalytics.recordVirtualPageView('Advanced search modal');
		}
		this.setState(prevState => {
			return { showAdvancedSearchModal: !prevState.showAdvancedSearchModal };
		});
	};

	openDataUtilityWizard(activeStep) {
		this.setState({ showDataUtilityWizardModal: true, activeDataUtilityWizardStep: activeStep });
	}

	onWizardStepChange(activeStep) {
		this.setState({ activeDataUtilityWizardStep: activeStep });
	}

	toggleDataUtilityBanner(show) {
		this.setState({ showDataUtilityBanner: show });
	}

	toggleDataUtilityWizardModal = () => {
		this.setState({ showDataUtilityWizardModal: false });
	};

	showLoginModal = () => {
		// 1. add class to body to stop background scroll
		document.body.classList.add('modal-open');

		document.getElementById('myModal').style.display = 'block';
		document.getElementById('loginWayFinder').style.display = 'none';
		document.getElementById('loginButtons').style.display = 'block';
		document.getElementById('loginModalTitle').innerHTML = 'Sign in or create a new account';
		document.getElementById('modalRequestSection').style.display = 'none';

		window.onclick = function (event) {
			if (event.target === document.getElementById('myModal')) {
				// 2. remove class modal-open from body
				document.body.classList.remove('modal-open');
				document.getElementById('myModal').style.display = 'none';
			}
		};
	};
	async componentDidMount() {
		// 1. fires on first time in or page is refreshed/url loaded / has search location
		if (!!window.location.search) {
			console.log(window.location);

			const urlParams = new URLSearchParams(window.location.search);
			const tab = urlParams.get('tab');
			if (tab) {
				this.setState({ key: tab });
			}
			// 2. call Filters
			await this.getGlobals();

			// 3. splits location search into object { search: search, tab: Datasets}
			let queryParams = queryString.parse(window.location.search);
			// 4. if values has loginReferrer set location href to it.
			if (this.state.userState[0].loggedIn && queryParams.loginReferrer) {
				window.location.href = queryParams.loginReferrer;
			}
			// 5. if logout in params and is true redirect to logout and reload route
			else if (this.state.userState[0].loggedIn && queryParams.logout === 'true') {
				axios.get(baseURL + '/api/v1/auth/logout').then(res => {
					window.location.reload();
				});
			}
			// 6. if openUserMessages is true open the user messages
			else if (this.state.userState[0].loggedIn && queryParams.openUserMessages === 'true') {
				this.toggleDrawer();
			}
			// 7. if openAdvancedSearch is true open the user messages
			else if (queryParams.openAdvancedSearch === 'true') {
				this.toggleAdvancedSearchModal();
			}
			// 8. set the selectedFilter states from queryParams ** does not return anything **
			await this.updateFilterStates(queryParams);
			// 9. call search API
			this.doSearchCall();
		} else {
			this.setState({ data: [], search: '', isLoading: true });
			this.doSearchCall();
		}
	}

	async componentWillReceiveProps() {
		let queryParams = queryString.parse(window.location.search);
		// 1. if tabs are different update
		if (this.state.key !== queryParams.tab) {
			this.setState({ key: queryParams.tab || 'Datasets' });
		}
	}

	doSearch = e => {
		// fires on enter on searchbar
		if (e.key === 'Enter') {
			// reload window and test for search if entered
			this.setState({ isResultsLoading: true }, () => {
				this.clearFilterStates();
			});
		}
	};

	doClear = e => {
		this.setState({ isResultsLoading: true, search: '' }, () => {
			this.clearFilterStates();
		});
	};

	/**
	 * FindImpliedFilterNode
	 *
	 * @desc 		Finds a relevant node item by cross referencing all filters with a selection of implied values
	 * @param		{array} filters
	 * @param		{string} label
	 * @return	{object} object of {label, value...}
	 */
	findImpliedFilterNode = (filters = [], impliedValues) => {
		if (!_.isEmpty(filters)) {
			const formattedValues = impliedValues
				.split('::')
				.map(value => value.toLowerCase())
				.join(',');
			// TODO - align input from data utility wizard and url so that if function is not needed
			let returnValue = [...filters].find(node => node.value.toLowerCase() === formattedValues) || {};
			if (!_.isEmpty(returnValue)) {
				return returnValue;
			} else {
				return [...filters].find(node => node.impliedValues.toString().toLowerCase() === formattedValues) || {};
			}
		}
		return {};
	};

	/**
	 * @desc      Turns keys into array for looping ['publisher', 'phenotype']
	 * @param {*} filtersV2
	 * @param {*} selectedV2
	 * @param {*} queryParams
	 */
	setSelectedFiltersFromQueryParams = async (filtersV2, selectedV2, queryParams, tab) => {
		if (!_.isEmpty(Object.keys(queryParams))) {
			// 3. loop over queryKeys
			for (const key of Object.keys(queryParams)) {
				if (!_.isNil(queryParams[key])) {
					// 4. convert queryString into array of values
					let queryValues = queryParams[key].split('::');
					// 5. check if key exists in our tree, return {} or undefined
					let parentNode = this.findParentNode(filtersV2, key);
					if (!_.isNil(parentNode)) {
						let { filters } = parentNode;
						// 6. Determine whether to perform regular filter selection or implied filter selection
						const isImpliedFilter = filters.some(filter => _.has(filter, 'impliedValues'));
						let nodes = [];
						if (isImpliedFilter) {
							// find node by implied values
							let foundNode = this.findImpliedFilterNode(filters, queryParams[key]);
							if (!_.isEmpty(foundNode)) {
								nodes.push(foundNode);
							}
						} else {
							// loop over query values
							queryValues.forEach(node => {
								// get the selected values
								let foundNode = this.findNode(filters, node);
								if (!_.isEmpty(foundNode)) {
									nodes.push(foundNode);
								}
							});
						}
						nodes.forEach(node => {
							// 7. set check value
							node.checked = !node.checked;
							// 8. increment highest parent count
							parentNode.selectedCount += 1;
							// 9. prep new selected Item for selected showing
							let selectedNode = {
								parentKey: key,
								id: node.id,
								label: node.label,
								value: node.value,
							};
							// 10. fn for handling the *selected showing* returns new state
							let selected = this.handleSelected(selectedNode, node.checked, tab);
							// 11. update selectedV2 array with our new returned value
							selectedV2 = [...new Set([...selectedV2, ...selected])];
						});
					}
				}
			}
			// 12. set the state of filters and selected options
			const entity = upperFirst(tab);
			this.setState({ [`filtersV2${entity}s`]: filtersV2, [`selectedV2${entity}s`]: selectedV2 });
		}
	};

	/**
	 * UpdateFilterStates
	 *
	 * @desc Sets selectedStates for filters including search string
	 */
	async updateFilterStates(queryParams) {
		if (!_.isEmpty(this.state.filtersV2Datasets)) {
			const filtersV2 = [...this.state.filtersV2Datasets];
			const selectedV2 = [...this.state.selectedV2Datasets];
			this.setSelectedFiltersFromQueryParams(filtersV2, selectedV2, queryParams, 'dataset');
		}
		if (!_.isEmpty(this.state.filtersV2Tools)) {
			const filtersV2Tools = [...this.state.filtersV2Tools];
			const selectedV2Tools = [...this.state.selectedV2Tools];
			this.setSelectedFiltersFromQueryParams(filtersV2Tools, selectedV2Tools, queryParams, 'tool');
		}
		if (!_.isEmpty(this.state.filtersV2Projects)) {
			const filtersV2Projects = [...this.state.filtersV2Projects];
			const selectedV2Projects = [...this.state.selectedV2Projects];
			this.setSelectedFiltersFromQueryParams(filtersV2Projects, selectedV2Projects, queryParams, 'project');
		}
		if (!_.isEmpty(this.state.filtersV2Papers)) {
			const filtersV2Papers = [...this.state.filtersV2Papers];
			const selectedV2Papers = [...this.state.selectedV2Papers];
			this.setSelectedFiltersFromQueryParams(filtersV2Papers, selectedV2Papers, queryParams, 'paper');
		}
		if (!_.isEmpty(this.state.filtersV2Courses)) {
			const filtersV2Courses = [...this.state.filtersV2Courses];
			const selectedV2Courses = [...this.state.selectedV2Courses];
			this.setSelectedFiltersFromQueryParams(filtersV2Courses, selectedV2Courses, queryParams, 'course');
		}
		if (!_.isEmpty(this.state.filtersV2Collections)) {
			const filtersV2Collections = [...this.state.filtersV2Collections];
			const selectedV2Collections = [...this.state.selectedV2Collections];
			this.setSelectedFiltersFromQueryParams(filtersV2Collections, selectedV2Collections, queryParams, 'collection');
		}
		// 14. original filters setting of data remove if entity moves to V2 for correct filter
		queryParams.search ? this.setState({ search: queryParams.search }) : this.setState({ search: '' });

		// Tab
		queryParams.tab ? this.setState({ key: queryParams.tab }) : this.setState({ key: 'Datasets' });
		// PageNumbers - should be datasetPageNo etc better convention
		queryParams.datasetIndex ? this.setState({ datasetIndex: queryParams.datasetIndex }) : this.setState({ datasetIndex: 0 });
		queryParams.toolIndex ? this.setState({ toolIndex: queryParams.toolIndex }) : this.setState({ toolIndex: 0 });
		queryParams.projectIndex ? this.setState({ projectIndex: queryParams.projectIndex }) : this.setState({ projectIndex: 0 });
		queryParams.paperIndex ? this.setState({ paperIndex: queryParams.paperIndex }) : this.setState({ paperIndex: 0 });
		queryParams.personIndex ? this.setState({ personIndex: queryParams.personIndex }) : this.setState({ personIndex: 0 });
		queryParams.courseIndex ? this.setState({ courseIndex: queryParams.courseIndex }) : this.setState({ courseIndex: 0 });
		queryParams.collectionIndex ? this.setState({ collectionIndex: queryParams.collectionIndex }) : this.setState({ collectionIndex: 0 });
		// Sort for each tab
		queryParams.datasetSort ? this.setState({ datasetSort: queryParams.datasetSort }) : this.setState({ datasetSort: '' });
		queryParams.toolSort ? this.setState({ toolSort: queryParams.toolSort }) : this.setState({ toolSort: '' });
		queryParams.projectSort ? this.setState({ projectSort: queryParams.projectSort }) : this.setState({ projectSort: '' });
		queryParams.paperSort ? this.setState({ paperSort: queryParams.paperSort }) : this.setState({ paperSort: '' });
		queryParams.personSort ? this.setState({ personSort: queryParams.personSort }) : this.setState({ personSort: '' });
		queryParams.courseSort ? this.setState({ courseSort: queryParams.courseSort }) : this.setState({ courseSort: '' });
		queryParams.collectionSort ? this.setState({ collectionSort: queryParams.collectionSort }) : this.setState({ collectionSort: '' });
	}

	clearFilterStates() {
		// 1. v2 take copy of data
		let filtersV2DatasetsData = !_.isNil(this.state.filtersV2Datasets) ? [...this.state.filtersV2Datasets] : [];
		let filtersV2ToolsData = !_.isNil(this.state.filtersV2Tools) ? [...this.state.filtersV2Tools] : [];
		let filtersV2ProjectsData = !_.isNil(this.state.filtersV2Projects) ? [...this.state.filtersV2Projects] : [];
		let filtersV2CollectionsData = !_.isNil(this.state.filtersV2Collections) ? [...this.state.filtersV2Collections] : [];
		let filtersV2CoursesData = !_.isNil(this.state.filtersV2Courses) ? [...this.state.filtersV2Courses] : [];
		let filtersV2PapersData = !_.isNil(this.state.filtersV2Papers) ? [...this.state.filtersV2Papers] : [];

		// 2. v2 resets the filters UI tree back to default
		let filtersV2Datasets = this.resetTreeChecked(filtersV2DatasetsData);
		let filtersV2Tools = this.resetTreeChecked(filtersV2ToolsData);
		let filtersV2Projects = this.resetTreeChecked(filtersV2ProjectsData);
		let filtersV2Collections = this.resetTreeChecked(filtersV2CollectionsData);
		let filtersV2Courses = this.resetTreeChecked(filtersV2CoursesData);
		let filtersV2Papers = this.resetTreeChecked(filtersV2PapersData);

		this.setState(
			prevState => ({
				filtersV2Datasets,
				selectedV2Datasets: [],
				filtersV2Tools,
				selectedV2Tools: [],
				filtersV2Projects,
				selectedV2Projects: [],
				filtersV2Papers,
				selectedV2Papers: [],
				filtersV2Collections,
				selectedV2Collections: [],
				filtersV2Courses,
				selectedV2Courses: [],
				datasetIndex: 0,
				toolIndex: 0,
				projectIndex: 0,
				paperIndex: 0,
				personIndex: 0,
				courseIndex: 0,
				collectionIndex: 0,
				datasetSort: '',
				toolSort: '',
				projectSort: '',
				paperSort: '',
				personSort: '',
				courseSort: '',
				collectionSort: '',
			}),
			() => {
				this.doSearchCall();
			}
		);
	}

	updateOnFilterBadge = (filterGroup, filter) => {
		// 1. test type of filter if v2 it will be an object
		if (typeof filter === 'object' && !_.isEmpty(filter)) {
			// 2. title case to match the backend cache implmentation of label value
			let { parentKey, label } = filter;
			let node = {
				parentKey,
				label: label,
			};
			// 3. the filter will contain {label, parentKey (parentKey is defined the filters.mapper API)}
			this.handleInputChange(node, parentKey, true);
		} else {
			return;
		}
	};

	updateOnFilter = () => {
		this.setState(
			{ datasetIndex: 0, toolIndex: 0, projectIndex: 0, paperIndex: 0, personIndex: 0, courseIndex: 0, isResultsLoading: true },
			() => {
				this.doSearchCall();
			}
		);
	};

	/**
	 * ClearFilter V1 function
	 */
	clearFilter = (filter, filterGroup) => {
		if (filter === 'All') {
			this.clearFilterStates();
		} else {
			this.state[filterGroup].splice(this.state[filterGroup].indexOf(filter), 1);
		}

		this.setState({ isResultsLoading: true }, () => {
			this.doSearchCall();
		});
	};

	doSearchCall(skipHistory, textSearch = '') {
		let searchURL = '';
		let filtersDatasetsV2 = [];
		let filtersV2Tools = [];
		let filtersV2Projects = [];
		let filtersV2Papers = [];
		let filtersV2Courses = [];
		let filtersV2Collections = [];
		let {
			userState,
			datasetIndex = 0,
			toolIndex = 0,
			projectIndex = 0,
			paperIndex = 0,
			personIndex = 0,
			courseIndex = 0,
			collectionIndex = 0,
			datasetSort = '',
			toolSort = '',
			projectSort = '',
			paperSort = '',
			personSort = '',
			courseSort = '',
			collectionSort = '',
		} = this.state;

		this.toggleDataUtilityBanner(false);

		// 1. build search object from list of selected fitlers v2 only
		let searchObj = {
			...this.buildSearchObj(this.state.selectedV2Datasets),
			...this.buildSearchObj(this.state.selectedV2Tools),
			...this.buildSearchObj(this.state.selectedV2Projects),
			...this.buildSearchObj(this.state.selectedV2Papers),
			...this.buildSearchObj(this.state.selectedV2Courses),
			...this.buildSearchObj(this.state.selectedV2Collections),
		};
		// 2. dynamically build the searchUrl v2 only
		searchURL = this.buildSearchUrl(searchObj);
		if (datasetIndex > 0) searchURL += '&datasetIndex=' + encodeURIComponent(datasetIndex);
		if (toolIndex > 0) searchURL += '&toolIndex=' + encodeURIComponent(toolIndex);
		if (projectIndex > 0) searchURL += '&projectIndex=' + encodeURIComponent(projectIndex);
		if (paperIndex > 0) searchURL += '&paperIndex=' + encodeURIComponent(paperIndex);
		if (personIndex > 0) searchURL += '&personIndex=' + encodeURIComponent(personIndex);
		if (courseIndex > 0) searchURL += '&courseIndex=' + encodeURIComponent(courseIndex);
		if (collectionIndex > 0) searchURL += '&collectionIndex=' + encodeURIComponent(collectionIndex);
		// sorting across the filter range
		if (datasetSort !== '') searchURL += '&datasetSort=' + encodeURIComponent(datasetSort);
		if (toolSort !== '') searchURL += '&toolSort=' + encodeURIComponent(toolSort);
		if (projectSort !== '') searchURL += '&projectSort=' + encodeURIComponent(projectSort);
		if (paperSort !== '') searchURL += '&paperSort=' + encodeURIComponent(paperSort);
		if (personSort !== '') searchURL += '&personSort=' + encodeURIComponent(personSort);
		if (courseSort !== '') searchURL += '&courseSort=' + encodeURIComponent(courseSort);
		if (collectionSort !== '') searchURL += '&collectionSort=' + encodeURIComponent(collectionSort);
		// login status handler
		if (userState[0].loggedIn === false) {
			let values = queryString.parse(window.location.search);
			if (values.showLogin === 'true' && values.loginReferrer && values.loginReferrer !== '')
				searchURL += '&loginReferrer=' + encodeURIComponent(values.loginReferrer);
			else if (values.showLogin === 'true' && document.referrer !== '')
				searchURL += '&loginReferrer=' + encodeURIComponent(document.referrer);
		}
		if (!skipHistory) {
			if (this.state.key) searchURL += '&tab=' + this.state.key;

			this.props.history.push(
				`${window.location.pathname}?search=${encodeURIComponent(textSearch ? textSearch : this.state.search)}` + searchURL
			);
		}
		if (this.state.key !== 'People') {
			// remove once full migration to v2 filters for all other entities 'Tools, Projects, Courses and Papers'
			const entityType = typeMapper[`${this.state.key}`];
			axios
				.get(`${baseURL}/api/v1/search/filter?search=${encodeURIComponent(textSearch ? textSearch : this.state.search)}${searchURL}`)
				.then(res => {
					let filters = this.getFilterState(res);
					// test the type and set relevant state
					if (entityType === 'dataset') {
						let filtersV2DatasetsState = this.state.filtersV2Datasets || [];
						filtersDatasetsV2 = this.setHighlightedFilters(filters, [...filtersV2DatasetsState]);
						this.setState({ filtersDatasetsV2 });
					} else if (entityType === 'tool') {
						let filtersV2ToolState = this.state.filtersV2Tools || [];
						filtersV2Tools = this.setHighlightedFilters(filters, [...filtersV2ToolState]);
						this.setState({ filtersV2Tools });
					} else if (entityType === 'project') {
						let filtersV2ProjectState = this.state.filtersV2Projects || [];
						filtersV2Projects = this.setHighlightedFilters(filters, [...filtersV2ProjectState]);
						this.setState({ filtersV2Projects });
					} else if (entityType === 'paper') {
						let filtersV2PaperState = this.state.filtersV2Papers || [];
						filtersV2Papers = this.setHighlightedFilters(filters, [...filtersV2PaperState]);
						this.setState({ filtersV2Papers });
					} else if (entityType === 'collection') {
						let filtersV2CollectionState = this.state.filtersV2Collections || [];
						filtersV2Collections = this.setHighlightedFilters(filters, [...filtersV2CollectionState]);
						this.setState({ filtersV2Collections });
					} else if (entityType === 'course') {
						let filtersV2CourseState = this.state.filtersV2Courses || [];
						filtersV2Courses = this.setHighlightedFilters(filters, [...filtersV2CourseState]);
						this.setState({ filtersV2Courses });
					} else {
						this.setState({ ...filters });
					}
				})
				.catch(err => {
					console.error(err.message);
				});
		}
		// search call brings back search results and now filters highlighting for v2
		axios
			.get(`${baseURL}/api/v1/search?search=${encodeURIComponent(textSearch ? textSearch : this.state.search)}${searchURL}`)
			.then(res => {
				// get the correct entity type from our mapper via the selected tab ie..'Dataset, Tools'
				const entityType = typeMapper[`${this.state.key}`];
				// pull out the dynamic key : set data and filters
				let {
					[`${entityType}Results`]: { data = [] },
					summary = [],
				} = res.data;

				this.setState(prevState => {
					return {
						[`${entityType}Data`]: data,
						isLoading: false,
						isResultsLoading: false,
						saveSuccess: false,
						summary,
						search: textSearch ? textSearch : prevState.search,
					};
				});

				window.scrollTo(0, 0);
			})
			.catch(err => {
				console.error(err.message);
			});
	}
	/**
	 * GetFilterState
	 *
	 * @desc return correct filter state for either a V1 or V2 option
	 * @return {object}
	 */
	getFilterState = (response = {}) => {
		const {
			data: { filters = {} },
		} = response;
		return filters;
	};

	setHighlightedFilters = (filters = {}, tree) => {
		for (let key in filters) {
			// Find parent obj - recursive
			const parentNode = this.findParentNode(tree, key);
			// If parentNode exists
			if (!_.isEmpty(parentNode) && typeof parentNode.highlighted !== 'undefined') {
				parentNode.highlighted = [];
				const lowerCasedFilters = filters[key].map(value => value.toLowerCase());
				// Highlight any filter items which include any of the returned filter values
				parentNode.filters.forEach(filter => {
					const filterValues = filter.value.split(',');
					if (filterValues.some(item => lowerCasedFilters.includes(item.toLowerCase())) && !parentNode.highlighted.includes(filter.label)) {
						parentNode.highlighted.push(filter.label.toLowerCase());
					}
				});
			}
		}
		return tree;
	};

	updateSearchString = search => {
		this.setState({ search });
	};

	handleSelect = key => {
		const entityType = typeMapper[`${this.state.key}`];
		googleAnalytics.recordVirtualPageView(`${key} results page ${this.state[`${entityType}Index`] + 1}`);
		let values = queryString.parse(window.location.search);
		values.tab = key;
		this.props.history.push(window.location.pathname + '?' + queryString.stringify(values));

		this.setState({ key, isResultsLoading: true }, () => {
			this.getFilters(key);
			this.doSearchCall();
		});
	};

	handleSort = sort => {
		const entityType = typeMapper[`${this.state.key}`];
		googleAnalytics.recordEvent(`${entityType}s`, `Sorted search results by ${sort}`, 'Sort dropdown option changed');
		this.setState({ [`${entityType}Sort`]: sort, isResultsLoading: true }, () => {
			this.doSearchCall();
		});
	};

	handlePagination = (type = '', page = 0) => {
		if (!_.isEmpty(type)) {
			googleAnalytics.recordVirtualPageView(`${_.startCase(_.toLower(type))}s results page ${page / 40 + 1}`);
			this.setState({ [`${type}Index`]: page, isResultsLoading: true }, () => {
				window.scrollTo(0, 0);
				this.doSearchCall();
			});
		}
	};

	/**
	 * GetFilters
	 *
	 * @desc Get all required global data for page
	 */
	getGlobals = async () => {
		try {
			const response = await axios.get(`${baseURL}/api/v1/global?localeId=en-gb&entry.name=dataUtility`);
			const {
				data: {
					data: {
						entry: { items: dataUtilityFilters = [] },
					},
				},
			} = response;
			if (!_.isEmpty(dataUtilityFilters)) {
				const dataUtilityWizardSteps = dataUtilityFilters.filter(item => item.includeInWizard);
				this.setState({ dataUtilityFilters, dataUtilityWizardSteps });
				await this.getFilters(this.state.key);
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	getFilters = async key => {
		try {
			switch (key) {
				case 'Datasets':
					const response = await axios.get(`${baseURL}/api/v2/filters/dataset`);
					const {
						data: { data: filterDataDatasets },
					} = response;
					if (!_.isEmpty(filterDataDatasets) && _.isEmpty(this.state.filtersV2Datasets)) {
						const filtersV2Datasets = this.mapFiltersToDictionary(filterDataDatasets, this.state.dataUtilityFilters);
						this.setState({ filtersV2Datasets });
					}
					break;
				case 'Tools':
					const responseTools = await axios.get(`${baseURL}/api/v2/filters/tool`);
					const {
						data: { data: filterDataTools },
					} = responseTools;
					if (!_.isEmpty(filterDataTools) && _.isEmpty(this.state.filtersV2Tools)) {
						const filtersV2Tools = this.mapFiltersToDictionary(filterDataTools, this.state.dataUtilityFilters);
						this.setState({ filtersV2Tools });
					}
					break;
				case 'Projects':
					const responseProjects = await axios.get(`${baseURL}/api/v2/filters/project`);
					const {
						data: { data: filterDataProjects },
					} = responseProjects;
					if (!_.isEmpty(filterDataProjects) && _.isEmpty(this.state.filtersV2Projects)) {
						const filtersV2Projects = this.mapFiltersToDictionary(filterDataProjects, this.state.dataUtilityFilters);
						this.setState({ filtersV2Projects });
					}
					break;
				case 'Papers':
					const responsePapers = await axios.get(`${baseURL}/api/v2/filters/paper`);
					const {
						data: { data: filterDataPapers },
					} = responsePapers;
					if (!_.isEmpty(filterDataPapers) && _.isEmpty(this.state.filtersV2Papers)) {
						const filtersV2Papers = this.mapFiltersToDictionary(filterDataPapers, this.state.dataUtilityFilters);
						this.setState({ filtersV2Papers });
					}
					break;
				case 'Courses':
					const responseCourses = await axios.get(`${baseURL}/api/v2/filters/course`);
					const {
						data: { data: filterDataCourses },
					} = responseCourses;
					if (!_.isEmpty(filterDataCourses) && _.isEmpty(this.state.filtersV2Courses)) {
						const filtersV2Courses = this.mapFiltersToDictionary(filterDataCourses, this.state.dataUtilityFilters);
						this.setState({ filtersV2Courses });
					}
					break;
				case 'Collections':
					const responseCollections = await axios.get(`${baseURL}/api/v2/filters/collection`);
					const {
						data: { data: filterDataCollections },
					} = responseCollections;
					if (!_.isEmpty(filterDataCollections) && _.isEmpty(this.state.filtersV2Collections)) {
						const filtersV2Collections = this.mapFiltersToDictionary(filterDataCollections, this.state.dataUtilityFilters);
						this.setState({ filtersV2Collections });
					}
				default:
			}
		} catch (error) {
			console.error(error.message);
		}
	};

	/**
	 * MapFiltersToDictionary
	 *
	 * @desc Accepts v2 format filter data and cross references with a data dictionary to rename, reformat, and order values
	 */
	mapFiltersToDictionary = (filterData, filterDictionary) => {
		filterDictionary.forEach(dictionaryEntry => {
			this.mutateFilter(filterData, dictionaryEntry);
		});
		return filterData;
	};

	/**
	 * MutateFilter
	 *
	 * @desc Performs the mutation of filter data for a provided dictionary entry containing allowed values, order etc.
	 */
	mutateFilter(filterData, dictionaryEntry) {
		// Iterate through each filter node to look for the filter by key
		filterData.forEach((dimension, index, arr) => {
			if (_.isEqual(dimension.key, dictionaryEntry.key)) {
				// Update filter to match dictionary definition
				arr[index] = {
					...dimension,
					filters: this.mapFilterValues(dimension.filters, dictionaryEntry.entries),
				};
			} else {
				// If the current node has children, recursively call this function again passing in the node's children
				if (_.has(dimension, 'filters')) {
					this.mutateFilter(dimension.filters, dictionaryEntry);
				}
			}
		});
	}

	/**
	 * MapFilterValues
	 *
	 * @desc Combines and ranks filter values for a given filter dimension using provided dictionary entries
	 */
	mapFilterValues(filterValues, dictionaryEntries) {
		const mappedFilterValues = dictionaryEntries.map(entry => {
			const { label, definition } = entry;
			return {
				...entry,
				value: this.getImpliedFilterValues(filterValues, entry),
				checked: false,
				label: label ? label : definition,
			};
		});

		return _.sortBy(mappedFilterValues, 'displayOrder');
	}

	/**
	 * GetImpliedFilterValues
	 *
	 * @desc Merges multiple implied filter values into a single filter
	 */
	getImpliedFilterValues(filterValues, dictionaryEntry) {
		return filterValues
			.filter(filterValue => {
				const lowercaseValues = dictionaryEntry.impliedValues.map(value => value.toLowerCase());
				return lowercaseValues.includes(filterValue.value.toLowerCase());
			})
			.map(filterValue => filterValue.value)
			.join(',');
	}

	/**
	 * PerformSearch
	 *
	 * @desc builds url string from searchObj from selected filters
	 * @param {object}
	 */
	buildSearchUrl = searchObj => {
		let searchUrl = '';
		if (searchObj) {
			for (let key of Object.keys(searchObj)) {
				const values = searchObj[key].toString().split(',');
				const uniqueValues = [...new Set(values)];
				searchUrl += `&${key}=${encodeURIComponent(uniqueValues.join('::'))}`;
			}
		}
		return searchUrl;
	};

	/**
	 * BuildSearchObj
	 *
	 * @desc builds filters obj ready for parsing
	 * @param {array} FilterArr
	 * @return {object} New Filters Object
	 */
	buildSearchObj = arr => {
		// 1. reduce over array of selected values [{id, value, parentkey}, {}...]
		return [...arr].reduce((obj, { parentKey, value, alias }) => {
			// we need to use alias here if it is defiend to use as override so names do not conflict with other tabs
			let queryParam = alias ? alias : parentKey;

			// 2. group by key { 'publisher': [] }
			if (!obj[queryParam]) obj[queryParam] = [];

			// 3. if key exists and entry is not already included, push in filter value
			obj[queryParam].push(value);

			// 4. return obj iteration
			return obj;
		}, {});
	};

	/**
	 * HandleClearFilters
	 *
	 * @desc function to handle filters applied functionality
	 * @param {string | object} selectedNode
	 */
	handleClearSelection = selectedNode => {
		let selectedV2, filtersV2, parentNode;
		if (!_.isEmpty(selectedNode)) {
			// 1. take label and parentId values from the node
			let { parentKey, label } = selectedNode;
			// 2. copy state data *avoid mutation*
			filtersV2 = this.getFilterStateByKey(this.state.key);
			// 3. find parentNode in the tree
			parentNode = this.findParentNode(filtersV2, parentKey);
			if (!_.isEmpty(parentNode)) {
				// 4. decrement the count on the parent
				--parentNode.selectedCount;
				// 5. get the filters
				let { filters } = parentNode;
				if (!_.isEmpty(filters)) {
					// 6. get child node
					let foundNode = this.findNode(filters, label);
					// 7. set checked value
					foundNode.checked = false;
					// 8. remove from selectedV2 array
					selectedV2 = this.handleSelected(selectedNode, false);
					// 9. set state
					const filtersV2Entity = `filtersV2${this.state.key}`;
					const selectedV2Entity = `selectedV2${this.state.key}`;
					this.setState({ [filtersV2Entity]: filtersV2, [selectedV2Entity]: selectedV2, isResultsLoading: true }, () => {
						this.doSearchCall();
					});
				}
			}
		}
	};

	/**
	 * ResetTreeChecked
	 *
	 * @desc Resets the selected filter options back in the tree for checked and selected counts
	 * @param {object | array} tree
	 * @return new tree
	 */
	resetTreeChecked = tree => {
		if (_.isEmpty(tree)) return;

		tree.forEach(node => {
			if (typeof node.selectedCount !== 'undefined') node.selectedCount = 0;

			if (typeof node.checked !== 'undefined') {
				node.checked = false;
			} else {
				let child = this.resetTreeChecked(node.filters);
				return child;
			}
		});
		return tree;
	};

	/**
	 * HandleClearAll
	 *
	 * @desc User clicks clear all in the filters all section it will reset the tree
	 */
	handleClearAll = () => {
		// 1. take copy of data
		let filtersV2Data = this.getFilterStateByKey(this.state.key);
		// 2. resets the filters UI tree back to default
		let filtersV2 = this.resetTreeChecked(filtersV2Data);
		// 3. set state and call search
		const filtersV2Entity = `filtersV2${this.state.key}`;
		const selectedV2Entity = `selectedV2${this.state.key}`;
		this.setState({ [filtersV2Entity]: filtersV2, [selectedV2Entity]: [], isResultsLoading: true }, () => {
			this.doSearchCall();
		});
	};

	/**
	 * Filter method for v2Selected options
	 * returns new array
	 *
	 * @desc    Returns new selected array for selected items in v2
	 * @param		{object} selected
	 * @param 	{boolena} checked
	 * @return	{array} array of selected items
	 */
	handleSelected = (selected = {}, checked = false, tab = this.state.key) => {
		let selectedV2 = this.getSelectedFiltersStateByKey(tab);
		let results = [];
		if (!_.isEmpty(selected)) {
			if (checked) {
				results = [...selectedV2, selected];
			} else {
				// id important to filter by as labels are not unique
				results = [...selectedV2].filter(node => node.id !== selected.id);
			}
		}
		return results;
	};

	/**
	 * FindParentNode
	 *
	 * @desc 		Do a recursive loop to find the parent node
	 * @param		{array} tree
	 * @param		{number} nodeId
	 * @return	{object} parentNode object
	 */
	findParentNode = (tree, key) => {
		// 1. find if matches key || alias if provided for an override for the queryParam if it conflicts with another key from
		// another entity
		let found = tree.find(node => ((typeof node.alias !== 'undefined' && node.alias === key) || node.key === key ? node : ''));

		// 2. if not found start recursive loop
		if (!found) {
			let i = 0;
			// 3. if not found and current tree has length
			while (!found && i < tree.length) {
				// 4. current tree item get filters check if length
				if (tree[i].filters && tree[i].filters.length) {
					// 5. if filters has length set the current iteration of filters and recall found as findParentNode
					found = this.findParentNode(tree[i].filters, key);
				}
				// 6. increment count
				i++;
			}
		}
		// 7. return found can be node or function findParentNode
		return found;
	};

	/**
	 * FindNode
	 *
	 * @desc 		Finds the selected node item or obj inside filters array already in parent
	 * @param		{array} filters
	 * @param		{string} label
	 * @return	{object} object of {label, value...}
	 */
	findNode = (filters = [], label) => {
		if (!_.isEmpty(filters)) {
			return [...filters].find(node => node.label.toUpperCase() === label.toUpperCase()) || {};
		}
		return {};
	};

	/**
	 * HandleSelection
	 *
	 * @desc remove item from filters applied and update tree
	 * @param {object} node
	 */
	handleClearSection = node => {
		let selectedV2, filtersV2, parentNode, selectedNodeFilters;
		let { key, filters } = node;
		selectedV2 = this.getSelectedFiltersStateByKey(this.state.key);
		// 1. find the filters
		if (!_.isEmpty(filters)) {
			selectedNodeFilters = filters
				.filter(nodeItem => nodeItem.checked)
				.map(node => {
					return { ...node, checked: false };
				});
			// 1. copy state - stop mutation
			filtersV2 = this.getFilterStateByKey(this.state.key);
			// 2. find parent obj - recursive
			parentNode = this.findParentNode(filtersV2, key);
			if (!_.isEmpty(parentNode)) {
				let { filters } = parentNode;
				// 3. loop over selected nodes
				selectedNodeFilters.forEach(node => {
					let foundNode = this.findNode(filters, node.label);
					if (!_.isEmpty(foundNode)) {
						// 4. set check value
						foundNode.checked = false;
						// 5. increment highest parent count
						--parentNode.selectedCount;
						// 7. fn for handling the *selected showing* returns new state
						selectedV2 = [...selectedV2].filter(node => node.id !== foundNode.id);
						// searchObj = this.buildSearchObj(selectedV2);
					}
				});
				// 9. set state
				const filtersV2Entity = `filtersV2${this.state.key}`;
				const selectedV2Entity = `selectedV2${this.state.key}`;
				this.setState({ [filtersV2Entity]: filtersV2, [selectedV2Entity]: [], isResultsLoading: true }, () => {
					this.doSearchCall();
				});
			}
		}
	};

	/**
	 * Get the filters in state for the particular tab
	 */
	getFilterStateByKey = key => {
		switch (key) {
			case 'Datasets':
				return [...this.state.filtersV2Datasets];
			case 'Tools':
				return [...this.state.filtersV2Tools];
			case 'Projects':
				return [...this.state.filtersV2Projects];
			case 'Papers':
				return [...this.state.filtersV2Papers];
			case 'Courses':
				return [...this.state.filtersV2Courses];
			case 'Collections':
				return [...this.state.filtersV2Collections];
			default:
				return [];
		}
	};

	/**
	 * Get the selected filters in state for the particular tab
	 */
	getSelectedFiltersStateByKey = key => {
		switch (key) {
			case 'Datasets':
				return [...this.state.selectedV2Datasets];
			case 'Tools':
				return [...this.state.selectedV2Tools];
			case 'Projects':
				return [...this.state.selectedV2Projects];
			case 'Papers':
				return [...this.state.selectedV2Papers];
			case 'Courses':
				return [...this.state.selectedV2Courses];
			case 'Collections':
				return [...this.state.selectedV2Collections];
			default:
				return [];
		}
	};

	/**
	 * Handle Filter event bubble for option click
	 * within the filter panel
	 *
	 * @param {object} node
	 * @param {string} parentKey
	 * @param {boolean} checkValue
	 */
	handleInputChange = (node, parentKey, checkValue) => {
		// 1. copy state - stop mutation
		let filtersV2 = this.getFilterStateByKey(this.state.key);

		// 2. find parent obj - recursive
		let parentNode = this.findParentNode(filtersV2, parentKey);
		if (!_.isEmpty(parentNode)) {
			// deconstruct important to take alias incase key needs overwritten for query string
			let { filters, key, alias } = parentNode;
			// 3. find checkbox obj
			let foundNode = this.findNode(filters, node.label);
			if (!_.isEmpty(foundNode)) {
				// find if the node already exists in the selectedV2 - if so we are unchecking / removing
				const exists = this.getSelectedFiltersStateByKey(this.state.key).some(selected => selected.id === foundNode.id);
				if (!exists || (exists && foundNode.checked != checkValue)) {
					// 4. set check value
					foundNode.checked = checkValue;
					// 5. increment highest parent count
					checkValue ? ++parentNode.selectedCount : --parentNode.selectedCount;
					// 6. set new object for handle selected *showing*
					let selectedNode = {
						parentKey: alias || key,
						id: foundNode.id,
						label: foundNode.label,
						value: foundNode.value,
					};
					// 7. fn for handling the *selected showing* returns new state
					const selectedV2 = this.handleSelected(selectedNode, checkValue);
					// 8. set state
					const filtersV2Entity = `filtersV2${this.state.key}`;
					const selectedV2Entity = `selectedV2${this.state.key}`;
					this.setState({ [filtersV2Entity]: filtersV2, [selectedV2Entity]: selectedV2, isResultsLoading: true }, () => {
						this.doSearchCall();
					});
					googleAnalytics.recordEvent(
						'Datasets',
						`${checkValue ? 'Applied' : 'Removed'} ${parentNode.label} filter ${
							this.state.showDataUtilityBanner ? 'after utility wizard search' : ''
						}`,
						`Filter value: ${selectedNode.label}`
					);
				}
			}
		}
	};

	/**
	 * HandleToggle V2
	 *
	 * @desc Handles filters menu up and down toggle V2
	 * @param {object} node
	 */
	handleToggle = node => {
		let parentNode;
		if (!_.isEmpty(node)) {
			// 1. copy state - stop mutation
			let filtersV2 = this.getFilterStateByKey(this.state.key);
			// 2. find parent obj - recursive
			let { key } = node;
			// 3. return parent node of toggled
			parentNode = this.findParentNode(filtersV2, key);
			if (!_.isEmpty(parentNode)) {
				parentNode.closed = !parentNode.closed;
				const filtersV2Entity = `filtersV2${this.state.key}`;
				this.setState({ [filtersV2Entity]: filtersV2 });
			}
		}
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

	saveFiltersUpdate = viewSaved => {
		this.setState({ showSavedPreferencesModal: false });
		// 1. v2 take copy of data
		let filtersV2DatasetsData = !_.isNil(this.state.filtersV2Datasets) ? [...this.state.filtersV2Datasets] : [];
		let filtersV2ToolsData = !_.isNil(this.state.filtersV2Tools) ? [...this.state.filtersV2Tools] : [];
		let filtersV2ProjectsData = !_.isNil(this.state.filtersV2Projects) ? [...this.state.filtersV2Projects] : [];
		let filtersV2CollectionsData = !_.isNil(this.state.filtersV2Collections) ? [...this.state.filtersV2Collections] : [];
		let filtersV2CoursesData = !_.isNil(this.state.filtersV2Courses) ? [...this.state.filtersV2Courses] : [];
		let filtersV2PapersData = !_.isNil(this.state.filtersV2Papers) ? [...this.state.filtersV2Papers] : [];

		// 2. v2 resets the filters UI tree back to default
		let filtersV2Datasets = this.resetTreeChecked(filtersV2DatasetsData);
		let filtersV2Tools = this.resetTreeChecked(filtersV2ToolsData);
		let filtersV2Projects = this.resetTreeChecked(filtersV2ProjectsData);
		let filtersV2Collections = this.resetTreeChecked(filtersV2CollectionsData);
		let filtersV2Courses = this.resetTreeChecked(filtersV2CoursesData);
		let filtersV2Papers = this.resetTreeChecked(filtersV2PapersData);

		this.setState(
			prevState => ({
				filtersV2Datasets,
				selectedV2Datasets: [],
				filtersV2Tools,
				selectedV2Tools: [],
				filtersV2Projects,
				selectedV2Projects: [],
				filtersV2Papers,
				selectedV2Papers: [],
				filtersV2Collections,
				selectedV2Collections: [],
				filtersV2Courses,
				selectedV2Courses: [],
				datasetIndex: 0,
				toolIndex: 0,
				projectIndex: 0,
				paperIndex: 0,
				personIndex: 0,
				courseIndex: 0,
				collectionIndex: 0,
				datasetSort: '',
				toolSort: '',
				projectSort: '',
				paperSort: '',
				personSort: '',
				courseSort: '',
				collectionSort: '',
			}),
			() => {
				if (viewSaved.tab === 'Datasets') {
					this.setState({ datasetSort: viewSaved.sort });
				} else if (viewSaved.tab === 'Tools') {
					this.setState({ toolSort: viewSaved.sort });
				} else if (viewSaved.tab === 'Projects') {
					this.setState({ projectSort: viewSaved.sort });
				} else if (viewSaved.tab === 'Papers') {
					this.setState({ paperSort: viewSaved.sort });
				} else if (viewSaved.tab === 'People') {
					this.setState({ personSort: viewSaved.sort });
				} else if (viewSaved.tab === 'Collections') {
					this.setState({ collectionSort: viewSaved.sort });
				}

				this.setState({ search: viewSaved.search, key: viewSaved.tab, [`selectedV2${viewSaved.tab}`]: viewSaved.filters }, () => {
					this.doSearchCall();
				});
			}
		);
	};

	render() {
		let {
			summary,
			search,
			datasetData,
			toolData,
			projectData,
			paperData,
			personData,
			courseData,
			collectionData,
			userState,
			isLoading,
			isResultsLoading,
			datasetIndex,
			toolIndex,
			projectIndex,
			paperIndex,
			personIndex,
			courseIndex,
			collectionIndex,

			datasetSort,
			toolSort,
			projectSort,
			paperSort,
			personSort,
			collectionSort,

			filtersV2Datasets,
			selectedV2Datasets,
			filtersV2Tools,
			selectedV2Tools,
			filtersV2Projects,
			selectedV2Projects,
			filtersV2Papers,
			selectedV2Papers,
			filtersV2Courses,
			selectedV2Courses,
			filtersV2Collections,
			selectedV2Collections,

			showDrawer,
			showModal,
			showAdvancedSearchModal,
			context,
			activeDataUtilityWizardStep,

			key,
		} = this.state;

		if (isLoading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}
		// destructure counts from summary
		let {
			datasetCount = 0,
			toolCount = 0,
			projectCount = 0,
			paperCount = 0,
			personCount = 0,
			courseCount = 0,
			collectionCount = 0,
		} = summary;
		// clean needed here at later date
		if (key === '' || typeof key === 'undefined') {
			if (datasetCount > 0) {
				key = 'Datasets';
			} else if (toolCount > 0) {
				key = 'Tools';
			} else if (projectCount > 0) {
				key = 'Projects';
			} else if (paperCount > 0) {
				key = 'Papers';
			} else if (personCount > 0) {
				key = 'People';
			} else if (courseCount > 0) {
				key = 'Course';
			} else if (collectionCount > 0) {
				key = 'Collections';
			} else {
				key = 'Datasets';
			}
		}
		// default show sort
		let showSort = true;
		// clean needed here at later date
		if ((key === '' || key === 'Datasets') && datasetCount === 0) showSort = false;
		if (key === 'Tools' && toolCount === 0) showSort = false;
		if (key === 'Projects' && projectCount === 0) showSort = false;
		if (key === 'Papers' && paperCount === 0) showSort = false;
		if (key === 'People' && personCount === 0) showSort = false;
		if (key === 'Courses' && courseCount === 0) showSort = false;
		if (key === 'Collections' && collectionCount === 0) showSort = false;

		let datasetPaginationItems = [];
		let toolPaginationItems = [];
		let projectPaginationItems = [];
		let paperPaginationItems = [];
		let personPaginationItems = [];
		let coursePaginationItems = [];
		let collectionPaginationItems = [];
		let maxResult = 40;
		// Dataset pagination
		for (let i = 1; i <= Math.max(Math.ceil(datasetCount / maxResult), 1); i++) {
			datasetPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === datasetIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.Datasets, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		// Tool Pagination
		for (let i = 1; i <= Math.ceil(toolCount / maxResult); i++) {
			toolPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === toolIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.Tools, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		// Project Pagination
		for (let i = 1; i <= Math.ceil(projectCount / maxResult); i++) {
			projectPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === projectIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.Projects, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		// Paper Pagination
		for (let i = 1; i <= Math.ceil(paperCount / maxResult); i++) {
			paperPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === paperIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.Papers, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		// Person Pagination
		for (let i = 1; i <= Math.ceil(personCount / maxResult); i++) {
			personPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === personIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.People, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		// Course Pagination
		for (let i = 1; i <= Math.ceil(courseCount / maxResult); i++) {
			coursePaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === courseIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.Courses, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		// Collection Pagination
		for (let i = 1; i <= Math.ceil(collectionCount / maxResult); i++) {
			collectionPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === collectionIndex / maxResult + 1}
					onClick={() => this.handlePagination(typeMapper.Collections, (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}

		const dropdownMenu = (
			<div className='text-right save-dropdown'>
				{key === 'Tools' ? (
					<SortDropdown
						handleSort={this.handleSort}
						sort={toolSort === '' ? (search === '' ? 'latest' : 'relevance') : toolSort}
						dropdownItems={['relevance', 'popularity', 'latest', 'resources']}
					/>
				) : (
					''
				)}

				{key === 'Datasets' ? (
					<SortDropdown
						handleSort={this.handleSort}
						sort={datasetSort === '' ? (search === '' ? 'metadata' : 'relevance') : datasetSort}
						dropdownItems={['relevance', 'popularity', 'metadata', 'latest', 'resources']}
					/>
				) : (
					''
				)}

				{key === 'Projects' ? (
					<SortDropdown
						handleSort={this.handleSort}
						sort={projectSort === '' ? (search === '' ? 'latest' : 'relevance') : projectSort}
						dropdownItems={['relevance', 'popularity', 'latest', 'resources']}
					/>
				) : (
					''
				)}

				{key === 'Collections' ? (
					<SortDropdown
						handleSort={this.handleSort}
						sort={collectionSort === '' ? (search === '' ? 'latest' : 'relevance') : collectionSort}
						dropdownItems={['relevance', 'popularity', 'latest', 'resources']}
					/>
				) : (
					''
				)}

				{key === 'Papers' ? (
					<SortDropdown
						handleSort={this.handleSort}
						sort={paperSort === '' ? (search === '' ? 'sortbyyear' : 'relevance') : paperSort}
						dropdownItems={['relevance', 'popularity', 'sortbyyear', 'resources']}
					/>
				) : (
					''
				)}

				{key === 'People' ? (
					<SortDropdown
						handleSort={this.handleSort}
						sort={personSort === '' ? (search === '' ? 'latest' : 'relevance') : personSort}
						dropdownItems={['relevance', 'popularity', 'latest']}
					/>
				) : (
					''
				)}
			</div>
		);

		let preferenceFilters = {};
		let perferenceSort = '';
		if (key === 'Datasets') {
			preferenceFilters = selectedV2Datasets;
			perferenceSort = datasetSort;
		} else if (key === 'Tools') {
			preferenceFilters = selectedV2Tools;
			perferenceSort = toolSort;
		} else if (key === 'Projects') {
			preferenceFilters = selectedV2Projects;
			perferenceSort = projectSort;
		} else if (key === 'Paper') {
			preferenceFilters = selectedV2Papers;
			perferenceSort = paperSort;
		} else if (key === 'Collections') {
			preferenceFilters = selectedV2Collections;
			perferenceSort = collectionSort;
		} else if (key === 'Courses') {
			preferenceFilters = selectedV2Courses;
		} else if (key === 'People') {
			perferenceSort = personSort;
		}

		return (
			<Sentry.ErrorBoundary fallback={<ErrorModal />}>
				<div>
					<SearchBar
						ref={this.searchBar}
						search={search}
						doSearchMethod={this.doSearch}
						onClearMethod={this.doClear}
						doUpdateSearchString={this.updateSearchString}
						doToggleDrawer={this.toggleDrawer}
						userState={userState}
					/>

					<div className='searchTabsHolder'>
						<div>
							<Tabs className='tabsBackground gray700-13' activeKey={key} onSelect={this.handleSelect}>
								<Tab eventKey='Datasets' title={'Datasets (' + datasetCount + ')'} />
								<Tab eventKey='Tools' title={'Tools (' + toolCount + ')'} />
								<Tab eventKey='Projects' title={'Projects (' + projectCount + ')'} />
								<Tab eventKey='Collections' title={'Collections (' + collectionCount + ')'} />
								<Tab eventKey='Courses' title={'Courses (' + courseCount + ')'} />
								<Tab eventKey='Papers' title={'Papers (' + paperCount + ')'} />
								<Tab eventKey='People' title={'People (' + personCount + ')'}>
									{personCount <= 0 && !isResultsLoading ? <NoResults type='profiles' search={search} /> : ''}
								</Tab>
							</Tabs>
						</div>
					</div>

					<div className='container'>
						{this.state.showDataUtilityBanner && (
							<Alert variant='primary' className='blue-banner saved-preference-banner'>
								<Row>
									<Col>
										<h5 className='indigo-bold-14'>Data utility wizard applied: Customer filters</h5>
									</Col>
								</Row>
								<Row>
									<Col md={9}>
										You can continue to customise your filters below or edit alongside the search term in the data utility wizard.
									</Col>
									<Col md={3} className='data-utility-banner'>
										<p
											className='data-utility-link'
											onClick={() => {
												googleAnalytics.recordVirtualPageView('Data utility wizard');
												googleAnalytics.recordEvent('Datasets', 'Clicked edit data utility wizard', 'Reopened data utility wizard modal');
												this.openDataUtilityWizard(activeDataUtilityWizardStep);
											}}>
											Edit in data utility wizard
										</p>
									</Col>
								</Row>
							</Alert>
						)}

						{this.state.saveSuccess && !this.state.showSavedModal && (
							<Alert variant='primary' className='blue-banner saved-preference-banner'>
								Saved preference: "{this.state.showSavedName}"
							</Alert>
						)}
						<Container className={this.state.saveSuccess && !this.state.showSavedModal && 'container-saved-preference-banner'}>
							<Row className='filters filter-save'>
								<Col className='title' lg={4}>
									Showing {key === 'Datasets' ? <>{datasetCount} </> : ''}
									{key === 'Tools' ? <>{toolCount} </> : ''}
									{key === 'Projects' ? <>{projectCount} </> : ''}
									{key === 'Collections' ? <>{collectionCount} </> : ''}
									{key === 'Courses' ? <>{courseCount} </> : ''}
									{key === 'Papers' ? <>{paperCount} </> : ''}
									{key === 'People' ? <>{personCount} </> : ''}
									results {this.state.search != '' && `for '${this.state.search}'`}
								</Col>
								<Col lg={8} className='saved-buttons'>
									{this.state.saveSuccess ? (
										<Button variant='success' className='saved-disabled button-teal button-teal' disabled>
											<SVGIcon width='15px' height='15px' name='tick' fill={'#fff'} /> Saved
										</Button>
									) : this.state.userState[0].loggedIn === false ? (
										<Button variant='outline-success' className='saved button-teal' onClick={() => this.showLoginModal()}>
											Save
										</Button>
									) : (
										<Button variant='outline-success' className='saved button-teal' onClick={() => this.setState({ showSavedModal: true })}>
											Save
										</Button>
									)}

									{this.state.showSavedModal && (
										<SaveModal
											show={this.state.showSavedModal}
											onHide={this.hideSavedModal}
											onSaveHide={this.hideNoSaveSearchModal}
											saveSuccess={this.showSuccessMessage}
											saveName={this.showSavedName}
											search={this.state.search}
											filters={preferenceFilters}
											sort={perferenceSort}
											tab={this.state.key}
										/>
									)}

									<Button
										variant='light'
										className='saved-preference button-tertiary'
										onClick={
											this.state.userState[0].loggedIn === false
												? () => this.showLoginModal()
												: () => this.setState({ showSavedPreferencesModal: true })
										}>
										{' '}
										Saved preferences
									</Button>
									{this.state.showSavedPreferencesModal && (
										<SavedPreferencesModal
											show={this.state.showSavedPreferencesModal}
											onHide={this.hideSavedPreferencesModal}
											viewMatchesLink={this.viewMatches}
											viewSaved={this.saveFiltersUpdate}
											activeTab={key}
										/>
									)}

									{dropdownMenu}
								</Col>
							</Row>
							<Row>
								{this.state.key === 'Datasets' ? (
									<FilterSelection
										selectedCount={selectedV2Datasets.length}
										selectedItems={selectedV2Datasets}
										onHandleClearSelection={this.handleClearSelection}
										onHandleClearAll={this.handleClearAll}
										savedSearches={true}
									/>
								) : (
									''
								)}
								{this.state.key === 'Tools' ? (
									<FilterSelection
										selectedCount={selectedV2Tools.length}
										selectedItems={selectedV2Tools}
										onHandleClearSelection={this.handleClearSelection}
										onHandleClearAll={this.handleClearAll}
										savedSearches={true}
									/>
								) : (
									''
								)}
								{this.state.key === 'Projects' ? (
									<FilterSelection
										selectedCount={selectedV2Projects.length}
										selectedItems={selectedV2Projects}
										onHandleClearSelection={this.handleClearSelection}
										onHandleClearAll={this.handleClearAll}
										savedSearches={true}
									/>
								) : (
									''
								)}
								{this.state.key === 'Papers' ? (
									<FilterSelection
										selectedCount={selectedV2Papers.length}
										selectedItems={selectedV2Papers}
										onHandleClearSelection={this.handleClearSelection}
										onHandleClearAll={this.handleClearAll}
										savedSearches={true}
									/>
								) : (
									''
								)}
								{this.state.key === 'Courses' ? (
									<FilterSelection
										selectedCount={selectedV2Courses.length}
										selectedItems={selectedV2Courses}
										onHandleClearSelection={this.handleClearSelection}
										onHandleClearAll={this.handleClearAll}
										savedSearches={true}
									/>
								) : (
									''
								)}
								{this.state.key === 'Collections' ? (
									<FilterSelection
										selectedCount={selectedV2Collections.length}
										selectedItems={selectedV2Collections}
										onHandleClearSelection={this.handleClearSelection}
										onHandleClearAll={this.handleClearAll}
										savedSearches={true}
									/>
								) : (
									''
								)}
							</Row>
						</Container>
					</div>
					<Container>
						<Row>
							{key !== 'People' ? (
								<Col sm={12} md={12} lg={3} className='mt-1 mb-5'>
									{key === 'Datasets' ? (
										<Fragment>
											<div className='saved-filterHolder'>
												<Filter
													data={filtersV2Datasets}
													onHandleInputChange={this.handleInputChange}
													onHandleClearSection={this.handleClearSection}
													onHandleToggle={this.handleToggle}
												/>
											</div>
										</Fragment>
									) : (
										''
									)}

									{key === 'Tools' ? (
										<Fragment>
											<div className='saved-filterHolder'>
												<Filter
													data={filtersV2Tools}
													onHandleInputChange={this.handleInputChange}
													onHandleClearSection={this.handleClearSection}
													onHandleToggle={this.handleToggle}
												/>
											</div>
										</Fragment>
									) : (
										''
									)}

									{key === 'Projects' ? (
										<Fragment>
											<div className='saved-filterHolder'>
												<Filter
													data={filtersV2Projects}
													onHandleInputChange={this.handleInputChange}
													onHandleClearSection={this.handleClearSection}
													onHandleToggle={this.handleToggle}
												/>
											</div>
										</Fragment>
									) : (
										''
									)}
									{key === 'Papers' ? (
										<Fragment>
											<div className='saved-filterHolder'>
												<Filter
													data={filtersV2Papers}
													onHandleInputChange={this.handleInputChange}
													onHandleClearSection={this.handleClearSection}
													onHandleToggle={this.handleToggle}
												/>
											</div>
										</Fragment>
									) : (
										''
									)}
									{key === 'Courses' ? (
										<Fragment>
											<div className='saved-filterHolder'>
												<Filter
													data={filtersV2Courses}
													onHandleInputChange={this.handleInputChange}
													onHandleClearSection={this.handleClearSection}
													onHandleToggle={this.handleToggle}
												/>
											</div>
										</Fragment>
									) : (
										''
									)}
									{key === 'Collections' ? (
										<Fragment>
											<div className='saved-filterHolder'>
												<Filter
													data={filtersV2Collections}
													onHandleInputChange={this.handleInputChange}
													onHandleClearSection={this.handleClearSection}
													onHandleToggle={this.handleToggle}
												/>
											</div>
										</Fragment>
									) : (
										''
									)}

									<div className='advanced-search-link-container'>
										<CDStar fill='#f98e2b' height='20' width='20' />
										<a
											href='javascript:void(0)'
											className='textUnderline gray800-14 cursorPointer'
											onClick={() => {
												googleAnalytics.recordEvent('Datasets', 'User clicked advanced search link', 'Advanced search modal opened');
												this.toggleAdvancedSearchModal();
											}}>
											Advanced Search
										</a>
									</div>
								</Col>
							) : (
								<Col sm={12} md={12} lg={3} />
							)}

							{!isResultsLoading ? (
								<Col sm={12} md={12} lg={9} className='mt-1 mb-5'>
									{!showSort ? '' : <Fragment>{!this.state.savedSearchPanel && <Row>{dropdownMenu}</Row>}</Fragment>}
									{key === 'Datasets' ? (
										datasetCount <= 0 ? (
											<NoResults type='datasets' search={search} />
										) : (
											datasetData.map(dataset => {
												let datasetPublisher;
												let datasetLogo;

												!_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.name')
													? (datasetPublisher = dataset.datasetv2.summary.publisher.name)
													: (datasetPublisher = '');

												!_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.logo')
													? (datasetLogo = dataset.datasetv2.summary.publisher.logo)
													: (datasetLogo = '');

												return (
													<RelatedObject
														key={dataset.id}
														data={dataset}
														activeLink={true}
														onSearchPage={true}
														updateOnFilterBadge={this.updateOnFilterBadge}
														datasetPublisher={datasetPublisher}
														datasetLogo={datasetLogo}
													/>
												);
											})
										)
									) : (
										''
									)}

									{key === 'Tools' ? (
										toolCount <= 0 ? (
											<NoResults type='tools' search={search} />
										) : (
											toolData.map(tool => {
												return (
													<RelatedObject
														key={tool.id}
														data={tool}
														activeLink={true}
														onSearchPage={true}
														updateOnFilterBadge={this.updateOnFilterBadge}
													/>
												);
											})
										)
									) : (
										''
									)}

									{key === 'Projects' ? (
										projectCount <= 0 ? (
											<NoResults type='projects' search={search} />
										) : (
											projectData.map(project => {
												return (
													<RelatedObject
														key={project.id}
														data={project}
														activeLink={true}
														onSearchPage={true}
														updateOnFilterBadge={this.updateOnFilterBadge}
													/>
												);
											})
										)
									) : (
										''
									)}

									{key === 'Collections' ? (
										collectionCount <= 0 ? (
											<NoResults type='collections' search={search} />
										) : (
											<Row className='mt-2'>
												{collectionData.map(collection => {
													return (
														<Col sm={12} md={12} lg={6} style={{ 'text-align': '-webkit-center' }}>
															<CollectionCard key={collection.id} data={collection} />
														</Col>
													);
												})}
											</Row>
										)
									) : (
										''
									)}

									{key === 'Papers' ? (
										paperCount <= 0 ? (
											<NoResults type='papers' search={search} />
										) : (
											paperData.map(paper => {
												return (
													<RelatedObject
														key={paper.id}
														data={paper}
														activeLink={true}
														onSearchPage={true}
														updateOnFilterBadge={this.updateOnFilterBadge}
													/>
												);
											})
										)
									) : (
										''
									)}

									{key === 'People'
										? personData.map(person => {
												return (
													<RelatedObject
														key={person.id}
														data={person}
														activeLink={true}
														onSearchPage={true}
														updateOnFilterBadge={this.updateOnFilterBadge}
													/>
												);
										  })
										: ''}

									{(() => {
										if (key === 'Courses') {
											let courseRender = [];
											if (courseCount <= 0) return <NoResults type='courses' search={search} />;
											else {
												let currentHeader = '';
												courseData.map(course => {
													let showHeader = false;

													if (!showHeader && course.courseOptions.flexibleDates && currentHeader !== 'Flexible') {
														currentHeader = 'Flexible';
														showHeader = true;
													} else if (
														!showHeader &&
														course.courseOptions.startDate &&
														currentHeader !== moment(course.courseOptions.startDate).format('MMMM')
													) {
														currentHeader = moment(course.courseOptions.startDate).format('MMMM');
														showHeader = true;
													}

													if (showHeader) {
														courseRender.push(
															<Row className='courseDateHeader'>
																<Col>
																	<span className='black-20-semibold '>{currentHeader}</span>
																</Col>
															</Row>
														);
													}

													courseRender.push(
														<RelatedObject
															key={course.id}
															data={course}
															activeLink={true}
															onSearchPage={true}
															updateOnFilterBadge={this.updateOnFilterBadge}
														/>
													);
												});
											}
											return <>{courseRender}</>;
										}
									})()}
									{/* PAGINATION */}
									<div className='text-center'>
										{key === 'Datasets' && datasetCount > maxResult ? <Pagination>{datasetPaginationItems}</Pagination> : ''}

										{key === 'Tools' && toolCount > maxResult ? <Pagination>{toolPaginationItems}</Pagination> : ''}

										{key === 'Projects' && projectCount > maxResult ? <Pagination>{projectPaginationItems}</Pagination> : ''}

										{key === 'Papers' && paperCount > maxResult ? <Pagination>{paperPaginationItems}</Pagination> : ''}

										{key === 'People' && personCount > maxResult ? <Pagination>{personPaginationItems}</Pagination> : ''}

										{key === 'Courses' && courseCount > maxResult ? <Pagination>{coursePaginationItems}</Pagination> : ''}

										{key === 'Collections' && collectionCount > maxResult ? <Pagination>{collectionPaginationItems}</Pagination> : ''}
									</div>
								</Col>
							) : (
								<Col style={{ marginTop: '30px' }} sm={12} md={12} lg={9}>
									<Loading />
								</Col>
							)}
						</Row>
					</Container>
					<NotificationContainer />
					<SideDrawer open={showDrawer} closed={this.toggleDrawer}>
						<UserMessages
							userState={userState[0]}
							closed={this.toggleDrawer}
							toggleModal={this.toggleModal}
							drawerIsOpen={this.state.showDrawer}
						/>
					</SideDrawer>

					<AdvancedSearchModal
						open={showAdvancedSearchModal}
						closed={this.toggleAdvancedSearchModal}
						userProps={userState[0]}
						startDataUtilityWizardJourney={this.openDataUtilityWizard}
					/>

					<DataUtilityWizardModal
						open={this.state.showDataUtilityWizardModal}
						closed={() => {
							this.toggleDataUtilityWizardModal();
						}}
						dataUtilityWizardSteps={this.state.dataUtilityWizardSteps}
						updateFilterStates={this.updateFilterStates}
						datasetCount={datasetCount}
						doSearchCall={this.doSearchCall}
						selectedItems={selectedV2Datasets}
						handleClearSelection={this.handleClearSelection}
						searchValue={this.state.search}
						activeStep={activeDataUtilityWizardStep}
						onWizardComplete={this.toggleDataUtilityBanner}
						onStepChange={this.onWizardStepChange}
					/>

					<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
				</div>
			</Sentry.ErrorBoundary>
		);
	}
}

export default SearchPage;
