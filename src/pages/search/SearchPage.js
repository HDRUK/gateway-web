import React, { Fragment } from 'react';
import axios from 'axios';
import googleAnalytics from '../../tracking';
import queryString from 'query-string';
import * as Sentry from '@sentry/react';
import { Container, Row, Col, Tabs, Tab, Pagination } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import { toTitleCase } from '../../utils/GeneralHelper.util';
import Filter from './components/Filter';
import FilterSelection from './components/FilterSelection';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import CollectionCard from '../commonComponents/collectionCard/CollectionCard';
import Loading from '../commonComponents/Loading';
import Filters from './Filters';
import NoResults from '../commonComponents/NoResults';
import { NotificationContainer } from 'react-notifications';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal/ErrorModal';
import SortDropdown from './components/SortDropdown';
import { ReactComponent as CDStar } from '../../images/cd-star.svg';
import AdvancedSearchModal from '../commonComponents/AdvancedSearchModal/AdvancedSearchModal';
import './Search.scss';

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
		showError: false,
		context: {},
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		],
		filtersV2: [],
		selectedV2: [],
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
	}

	showModal = () => {
		this.setState({ showError: true });
	};

	hideModal = () => {
		this.setState({ showError: false });
	};

	toggleAdvancedSearchModal = () => {
		this.setState(prevState => {
			return { showAdvancedSearchModal: !prevState.showAdvancedSearchModal };
		});
	};

	async componentDidMount() {
		// 1. call filters - this will need parameterised when tools, projects etc move to v2
		await this.getFilters();
		// 2. fires on first time in or page is refreshed/url loaded / has search location
		if (!!window.location.search) {
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
	 * UpdateFilterStates
	 *
	 * @desc Sets selectedStates for filters including search string
	 */
	async updateFilterStates(queryParams) {
		let filtersV2, selectedV2;
		if (!_.isEmpty(this.state.filtersV2)) {
			// 1. take copy of filters data
			filtersV2 = [...this.state.filtersV2];
			selectedV2 = [...this.state.selectedV2];
			// 2. turns keys into array for looping ['publisher', 'phenotype']
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
							// 6. loop over query values
							queryValues.forEach(node => {
								// 7. get the selected values
								let foundNode = this.findNode(filters, node);
								if (!_.isEmpty(foundNode)) {
									// 8. set check value
									foundNode.checked = !foundNode.checked;
									// 9. increment highest parent count
									parentNode.selectedCount += 1;
									// 10. prep new selected Item for selected showing
									let selectedNode = {
										parentKey: key,
										id: foundNode.id,
										label: foundNode.label,
									};
									// 11. fn for handling the *selected showing* returns new state
									let selected = this.handleSelected(selectedNode, foundNode.checked);
									// 12. update selectedV2 array with our new returned value
									selectedV2 = [...selectedV2, ...selected];
								}
							});
						}
					}
				}
				// 13. set the state of filters and selected options
				this.setState({ filtersV2, selectedV2 });
			}
		}
		// 14. original filters setting of data remove if entity moves to V2 for correct filter
		queryParams.search ? this.setState({ search: queryParams.search }) : this.setState({ search: '' });
		// V1 Tools
		queryParams.toolcategories
			? this.setState({ toolCategoriesSelected: queryParams.toolcategories.split('::') })
			: this.setState({ toolCategoriesSelected: [] });
		queryParams.toolprogrammingLanguage
			? this.setState({ toolProgrammingLanguageSelected: queryParams.toolprogrammingLanguage.split('::') })
			: this.setState({ toolProgrammingLanguageSelected: [] });
		queryParams.toolfeatures
			? this.setState({ toolFeaturesSelected: queryParams.toolfeatures.split('::') })
			: this.setState({ toolFeaturesSelected: [] });
		queryParams.tooltopics
			? this.setState({ toolTopicsSelected: queryParams.tooltopics.split('::') })
			: this.setState({ toolTopicsSelected: [] });
		// V1 Projects
		queryParams.projectcategories
			? this.setState({ projectCategoriesSelected: queryParams.projectcategories.split('::') })
			: this.setState({ projectCategoriesSelected: [] });
		queryParams.projectfeatures
			? this.setState({ projectFeaturesSelected: queryParams.projectfeatures.split('::') })
			: this.setState({ projectFeaturesSelected: [] });
		queryParams.projecttopics
			? this.setState({ projectTopicsSelected: queryParams.projecttopics.split('::') })
			: this.setState({ projectTopicsSelected: [] });
		// V1 Papers
		queryParams.paperfeatures
			? this.setState({ paperFeaturesSelected: queryParams.paperfeatures.split('::') })
			: this.setState({ paperFeaturesSelected: [] });
		queryParams.papertopics
			? this.setState({ paperTopicsSelected: queryParams.papertopics.split('::') })
			: this.setState({ paperTopicsSelected: [] });
		// V1 Courses
		queryParams.coursestartdates
			? this.setState({ courseStartDatesSelected: queryParams.coursestartdates.split('::') })
			: this.setState({ courseStartDatesSelected: [] });
		queryParams.courseprovider
			? this.setState({ courseProviderSelected: queryParams.courseprovider.split('::') })
			: this.setState({ courseProviderSelected: [] });
		queryParams.courselocation
			? this.setState({ courseLocationSelected: queryParams.courselocation.split('::') })
			: this.setState({ courseLocationSelected: [] });
		queryParams.coursestudymode
			? this.setState({ courseStudyModeSelected: queryParams.coursestudymode.split('::') })
			: this.setState({ courseStudyModeSelected: [] });
		queryParams.courseaward
			? this.setState({ courseAwardSelected: queryParams.courseaward.split('::') })
			: this.setState({ courseAwardSelected: [] });
		queryParams.courseentrylevel
			? this.setState({ courseEntryLevelSelected: queryParams.courseentrylevel.split('::') })
			: this.setState({ courseEntryLevelSelected: [] });
		queryParams.coursedomains
			? this.setState({ courseDomainsSelected: queryParams.coursedomains.split('::') })
			: this.setState({ courseDomainsSelected: [] });
		queryParams.coursekeywords
			? this.setState({ courseKeywordsSelected: queryParams.coursekeywords.split('::') })
			: this.setState({ courseKeywordsSelected: [] });
		queryParams.courseframework
			? this.setState({ courseFrameworkSelected: queryParams.courseframework.split('::') })
			: this.setState({ courseFrameworkSelected: [] });
		queryParams.coursepriority
			? this.setState({ coursePrioritySelected: queryParams.coursepriority.split('::') })
			: this.setState({ coursePrioritySelected: [] });
		// V1 Collections
		queryParams.collectionkeywords
			? this.setState({ collectionKeywordsSelected: queryParams.collectionkeywords.split('::') })
			: this.setState({ collectionKeywordsSelected: [] });
		queryParams.collectionpublisher
			? this.setState({ collectionPublisherSelected: queryParams.collectionpublisher.split('::') })
			: this.setState({ collectionPublisherSelected: [] });

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
		let filtersV2Data = [...this.state.filtersV2];
		// 2. v2 resets the filters UI tree back to default
		let filtersV2 = this.resetTreeChecked(filtersV2Data);

		this.setState(
			prevState => ({
				filtersV2,
				selectedV2: [],
				toolCategoriesSelected: [],
				toolProgrammingLanguageSelected: [],
				toolFeaturesSelected: [],
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
				collectionPublisherSelected: [],
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
				label: toTitleCase(label),
			};
			// 3. the filter will contain {label, parentKey (parentKey is defined the filters.mapper API)}
			this.handleInputChange(node, parentKey, true);
		} else if (!this.state[filterGroup].find(x => x === filter)) {
			// 4. V1 for Tools, Projects, Papers, Collections, Courses
			this.state[filterGroup].push(filter);
			this.updateOnFilter();
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

	doSearchCall(skipHistory) {
		let searchURL = '';
		let filtersV2 = [];
		let {
			userState,
			toolCategoriesSelected = [],
			toolProgrammingLanguageSelected = [],
			toolFeaturesSelected = [],
			toolTopicsSelected = [],
			projectCategoriesSelected = [],
			projectFeaturesSelected = [],
			projectTopicsSelected = [],
			paperFeaturesSelected = [],
			paperTopicsSelected = [],
			courseStartDatesSelected = [],
			courseProviderSelected = [],
			courseLocationSelected = [],
			courseStudyModeSelected = [],
			courseAwardSelected = [],
			courseEntryLevelSelected = [],
			courseDomainsSelected = [],
			courseKeywordsSelected = [],
			courseFrameworkSelected = [],
			coursePrioritySelected = [],
			collectionKeywordsSelected = [],
			collectionPublisherSelected = [],
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
		// 1. build search object from list of selected fitlers v2 only
		const searchObj = this.buildSearchObj(this.state.selectedV2);
		// 2. dynamically build the searchUrl v2 only
		searchURL = this.buildSearchUrl(searchObj);
		// 3. build up V1 Tools / early filters, no change from original implementation
		if (toolCategoriesSelected.length > 0)
			searchURL += '&toolcategories=' + encodeURIComponent(toolCategoriesSelected.toString().split(',').join('::'));
		if (toolProgrammingLanguageSelected.length > 0)
			searchURL += '&toolprogrammingLanguage=' + encodeURIComponent(toolProgrammingLanguageSelected.toString().split(',').join('::'));
		if (toolFeaturesSelected.length > 0)
			searchURL += '&toolfeatures=' + encodeURIComponent(toolFeaturesSelected.toString().split(',').join('::'));
		if (toolTopicsSelected.length > 0)
			searchURL += '&tooltopics=' + encodeURIComponent(toolTopicsSelected.toString().split(',').join('::'));
		// V1 Projects
		if (projectCategoriesSelected.length > 0)
			searchURL += '&projectcategories=' + encodeURIComponent(projectCategoriesSelected.toString().split(',').join('::'));
		if (projectFeaturesSelected.length > 0)
			searchURL += '&projectfeatures=' + encodeURIComponent(projectFeaturesSelected.toString().split(',').join('::'));
		if (projectTopicsSelected.length > 0)
			searchURL += '&projecttopics=' + encodeURIComponent(projectTopicsSelected.toString().split(',').join('::'));
		// V1 Papers
		if (paperFeaturesSelected.length > 0)
			searchURL += '&paperfeatures=' + encodeURIComponent(paperFeaturesSelected.toString().split(',').join('::'));
		if (paperTopicsSelected.length > 0)
			searchURL += '&papertopics=' + encodeURIComponent(paperTopicsSelected.toString().split(',').join('::'));
		// V1 Courses
		if (courseStartDatesSelected.length > 0)
			searchURL += '&coursestartdates=' + encodeURIComponent(courseStartDatesSelected.toString().split(',').join('::'));
		if (courseProviderSelected.length > 0)
			searchURL += '&courseprovider=' + encodeURIComponent(courseProviderSelected.toString().split(',').join('::'));
		if (courseLocationSelected.length > 0)
			searchURL += '&courselocation=' + encodeURIComponent(courseLocationSelected.toString().split(',').join('::'));
		if (courseStudyModeSelected.length > 0)
			searchURL += '&coursestudymode=' + encodeURIComponent(courseStudyModeSelected.toString().split(',').join('::'));
		if (courseAwardSelected.length > 0)
			searchURL += '&courseaward=' + encodeURIComponent(courseAwardSelected.toString().split(',').join('::'));
		if (courseEntryLevelSelected.length > 0)
			searchURL += '&courseentrylevel=' + encodeURIComponent(courseEntryLevelSelected.toString().split(',').join('::'));
		if (courseDomainsSelected.length > 0)
			searchURL += '&coursedomains=' + encodeURIComponent(courseDomainsSelected.toString().split(',').join('::'));
		if (courseKeywordsSelected.length > 0)
			searchURL += '&coursekeywords=' + encodeURIComponent(courseKeywordsSelected.toString().split(',').join('::'));
		if (courseFrameworkSelected.length > 0)
			searchURL += '&courseframework=' + encodeURIComponent(courseFrameworkSelected.toString().split(',').join('::'));
		if (coursePrioritySelected.length > 0)
			searchURL += '&coursepriority=' + encodeURIComponent(coursePrioritySelected.toString().split(',').join('::'));
		// V1 Collections
		if (collectionKeywordsSelected.length > 0)
			searchURL += '&collectionkeywords=' + encodeURIComponent(collectionKeywordsSelected.toString().split(',').join('::'));
		if (collectionPublisherSelected.length > 0)
			searchURL += '&collectionpublisher=' + encodeURIComponent(collectionPublisherSelected.toString().split(',').join('::'));
		// PageNumbers = (entityNameIndex) N.B. should be datasetPageNo, toolPageNo, projectPageNo, paperPageNo, coursePageNo
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

			this.props.history.push(`${window.location.pathname}?search=${encodeURIComponent(this.state.search)}` + searchURL);
		}

		if (this.state.key !== 'People') {
			// remove once full migration to v2 filters for all other entities 'Tools, Projects, Courses and Papers'
			const entityType = typeMapper[`${this.state.key}`];
			axios
				.get(`${baseURL}/api/v1/search/filter?search=${encodeURIComponent(this.state.search)}${searchURL}`)
				.then(res => {
					let filters = this.getFilterState(entityType, res);
					// test the type and set relevant state
					if (entityType === 'dataset') {
						let filtersV2State = this.state.filtersV2 || [];
						filtersV2 = this.setHighlightedFilters(filters, [...filtersV2State]);
						this.setState({ filtersV2 });
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
			.get(`${baseURL}/api/v1/search?search=${encodeURIComponent(this.state.search)}${searchURL}`)
			.then(res => {
				// get the correct entity type from our mapper via the selected tab ie..'Dataset, Tools'
				const entityType = typeMapper[`${this.state.key}`];
				// pull out the dynamic key : set data and filters
				let {
					[`${entityType}Results`]: { data = [] },
					summary = [],
				} = res.data;

				this.setState({
					[`${entityType}Data`]: data,
					isLoading: false,
					isResultsLoading: false,
					summary,
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
	getFilterState = (tab = '', response = {}) => {
		const {
			data: { filters = {}, allFilters = [], filterOptions = [] },
		} = response;
		if (tab === 'dataset') {
			return filters;
		} else {
			return {
				allFilters,
				filterOptions,
			};
		}
	};

	setHighlightedFilters = (filters = {}, tree) => {
		for (let key in filters) {
			// 2. find parent obj - recursive
			let parentNode = this.findParentNode(tree, key);
			// 3. if parentNode exists
			if (!_.isEmpty(parentNode) && typeof parentNode.highlighted !== 'undefined') {
				let lowerCasedFilters = filters[key].map(value => value.toLowerCase());
				parentNode.highlighted = _.uniq(lowerCasedFilters);
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
		this.setState({ key: key, isResultsLoading: true }, () => {
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
	 * @desc Get all the filters for dataset
	 */
	getFilters = async () => {
		try {
			let response = await axios.get(`${baseURL}/api/v2/filters/dataset`);
			let {
				data: { data },
			} = response;
			if (!_.isEmpty(data)) {
				this.setState({ filtersV2: data });
			}
		} catch (error) {
			console.error(error.message);
		}
	};

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
				let values = searchObj[key];
				searchUrl += `&${key}=${encodeURIComponent(values.toString().split(',').join('::'))}`;
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
		// 1. reduce over array of selected values [{id, label, parentkey}, {}...]
		return [...arr].reduce((obj, { parentKey, label, alias }) => {
			// we need to use alias here if it is defiend to use as override so names do not conflict with other tabs
			let queryParam = alias ? alias : parentKey;

			// 2. group by key { 'publisher': [] }
			if (!obj[queryParam]) obj[queryParam] = [];

			// 3. if key exists push in label value
			obj[queryParam].push(label);
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
			filtersV2 = [...this.state.filtersV2];
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
					this.setState({ filtersV2, selectedV2, isResultsLoading: true }, () => {
						// 10. callback wait for state to update
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
		let filtersV2Data = [...this.state.filtersV2];
		// 2. resets the filters UI tree back to default
		let filtersV2 = this.resetTreeChecked(filtersV2Data);
		// 3. set state and call search
		this.setState({ filtersV2, selectedV2: [], isResultsLoading: true }, () => {
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
	handleSelected = (selected = {}, checked = false) => {
		let selectedV2 = [...this.state.selectedV2];
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
		selectedV2 = [...this.state.selectedV2];
		// 1. find the filters
		if (!_.isEmpty(filters)) {
			selectedNodeFilters = filters
				.filter(nodeItem => nodeItem.checked)
				.map(node => {
					return { ...node, checked: false };
				});
			// 1. copy state - stop mutation
			filtersV2 = [...this.state.filtersV2];
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
				this.setState({ filtersV2, selectedV2, isResultsLoading: true }, () => {
					this.doSearchCall();
				});
			}
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
		let filtersV2 = [...this.state.filtersV2];
		// 2. find parent obj - recursive
		let parentNode = this.findParentNode(filtersV2, parentKey);
		if (!_.isEmpty(parentNode)) {
			// deconstruct important to take alias incase key needs overwritten for query string
			let { filters, key, alias } = parentNode;
			// 3. find checkbox obj
			let foundNode = this.findNode(filters, node.label);
			if (!_.isEmpty(foundNode)) {
				// find if the node already exists in the selectedV2 - if so we are unchecking / removing
				const exists = [...this.state.selectedV2].some(selected => selected.id === foundNode.id);
				if (!exists || (exists && foundNode.checked !== checkValue)) {
					// 4. set check value
					foundNode.checked = checkValue;
					// 5. increment highest parent count
					checkValue ? ++parentNode.selectedCount : --parentNode.selectedCount;
					// 6. set new object for handle selected *showing*
					let selectedNode = {
						parentKey: alias || key,
						id: foundNode.id,
						label: foundNode.label,
					};
					// 7. fn for handling the *selected showing* returns new state
					const selectedV2 = this.handleSelected(selectedNode, checkValue);
					// 8. set state
					this.setState({ filtersV2, selectedV2, isResultsLoading: true }, () => {
						// callback once state has updated
						this.doSearchCall();
					});
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
			let filtersV2 = [...this.state.filtersV2];
			// 2. find parent obj - recursive
			let { key } = node;
			// 3. return parent node of toggled
			parentNode = this.findParentNode(filtersV2, key);
			if (!_.isEmpty(parentNode)) {
				parentNode.closed = !parentNode.closed;
				this.setState({ filtersV2 });
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
			filterOptions,
			allFilters,
			userState,
			isLoading,
			isResultsLoading,

			toolProgrammingLanguageSelected,
			toolTopicsSelected,
			toolCategoriesSelected,
			toolFeaturesSelected,

			projectTopicsSelected,
			projectFeaturesSelected,
			projectCategoriesSelected,

			paperFeaturesSelected,
			paperTopicsSelected,

			courseStartDatesSelected,
			courseProviderSelected,
			courseLocationSelected,
			courseStudyModeSelected,
			courseAwardSelected,
			courseEntryLevelSelected,
			courseDomainsSelected,
			courseKeywordsSelected,
			courseFrameworkSelected,
			coursePrioritySelected,

			collectionKeywordsSelected,
			collectionPublisherSelected,

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

			filtersV2,
			selectedV2,

			showDrawer,
			showModal,
			showAdvancedSearchModal,
			context,

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

		return (
			<Sentry.ErrorBoundary fallback={<ErrorModal show={this.showModal} handleClose={this.hideModal} />}>
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

					<Container>
						<Row>
							{key !== 'People' ? (
								<Col sm={12} md={12} lg={3} className='mt-4 mb-5'>
									{key === 'Datasets' ? (
										<Fragment>
											<div className='filterHolder'>
												{selectedV2.length > 0 && (
													<FilterSelection
														selectedCount={selectedV2.length}
														selectedItems={selectedV2}
														onHandleClearSelection={this.handleClearSelection}
														onHandelClearAll={this.handleClearAll}
													/>
												)}
												<Filter
													data={filtersV2}
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
										<>
											<div className='filterHolder'>
												{toolCategoriesSelected.length !== 0 ||
												toolProgrammingLanguageSelected.length !== 0 ||
												toolFeaturesSelected.length !== 0 ||
												toolTopicsSelected.length !== 0 ? (
													<div className='filterCard mb-2'>
														<Row>
															<Col className='mb-2'>
																<div className='inlineBlock'>
																	<div className='gray500-13'>Showing:</div>
																</div>
																<div className='floatRight'>
																	<div className='purple-13 pointer' onClick={() => this.clearFilter('All')}>
																		Clear all
																	</div>
																</div>
															</Col>
														</Row>

														{!toolCategoriesSelected || toolCategoriesSelected.length <= 0
															? ''
															: toolCategoriesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'toolCategoriesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!toolProgrammingLanguageSelected || toolProgrammingLanguageSelected.length <= 0
															? ''
															: toolProgrammingLanguageSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'toolProgrammingLanguageSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!toolFeaturesSelected || toolFeaturesSelected.length <= 0
															? ''
															: toolFeaturesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'toolFeaturesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!toolTopicsSelected || toolTopicsSelected.length <= 0
															? ''
															: toolTopicsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'toolTopicsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}
													</div>
												) : (
													''
												)}
												<Filters
													data={filterOptions.toolCategoriesFilterOptions}
													allFilters={allFilters.toolCategoryFilter}
													updateOnFilter={this.updateOnFilter}
													selected={toolCategoriesSelected}
													title='Type'
												/>
												<Filters
													data={filterOptions.programmingLanguageFilterOptions}
													allFilters={allFilters.toolLanguageFilter}
													updateOnFilter={this.updateOnFilter}
													selected={toolProgrammingLanguageSelected}
													title='Programming language'
												/>
												<Filters
													data={filterOptions.featuresFilterOptions}
													allFilters={allFilters.toolFeatureFilter}
													updateOnFilter={this.updateOnFilter}
													selected={toolFeaturesSelected}
													title='Keywords'
												/>
												<Filters
													data={filterOptions.toolTopicsFilterOptions}
													allFilters={allFilters.toolTopicFilter}
													updateOnFilter={this.updateOnFilter}
													selected={toolTopicsSelected}
													title='Domain'
												/>
											</div>
										</>
									) : (
										''
									)}

									{key === 'Projects' ? (
										<>
											<div className='filterHolder'>
												{projectCategoriesSelected.length !== 0 ||
												projectFeaturesSelected.length !== 0 ||
												projectTopicsSelected.length !== 0 ? (
													<div className='filterCard mb-2'>
														<Row>
															<Col className='mb-2'>
																<div className='inlineBlock'>
																	<div className='gray500-13'>Showing:</div>
																</div>
																<div className='floatRight'>
																	<div className='purple-13 pointer' onClick={() => this.clearFilter('All')}>
																		Clear all
																	</div>
																</div>
															</Col>
														</Row>

														{!projectCategoriesSelected || projectCategoriesSelected.length <= 0
															? ''
															: projectCategoriesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'projectCategoriesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!projectFeaturesSelected || projectFeaturesSelected.length <= 0
															? ''
															: projectFeaturesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'projectFeaturesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!projectTopicsSelected || projectTopicsSelected.length <= 0
															? ''
															: projectTopicsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'projectTopicsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}
													</div>
												) : (
													''
												)}
												<Filters
													data={filterOptions.projectCategoriesFilterOptions}
													allFilters={allFilters.projectCategoryFilter}
													updateOnFilter={this.updateOnFilter}
													selected={projectCategoriesSelected}
													title='Type'
												/>
												<Filters
													data={filterOptions.projectFeaturesFilterOptions}
													allFilters={allFilters.projectFeatureFilter}
													updateOnFilter={this.updateOnFilter}
													selected={projectFeaturesSelected}
													title='Keywords'
												/>
												<Filters
													data={filterOptions.projectTopicsFilterOptions}
													allFilters={allFilters.projectTopicFilter}
													updateOnFilter={this.updateOnFilter}
													selected={projectTopicsSelected}
													title='Domain'
												/>
											</div>
										</>
									) : (
										''
									)}

									{key === 'Collections' ? (
										<>
											<div className='filterHolder'>
												{collectionKeywordsSelected.length !== 0 || collectionPublisherSelected.length !== 0 ? (
													<div className='filterCard mb-2'>
														<Row>
															<Col className='mb-2'>
																<div className='inlineBlock'>
																	<div className='gray500-13'>Showing:</div>
																</div>
																<div className='floatRight'>
																	<div className='purple-13 pointer' onClick={() => this.clearFilter('All')}>
																		Clear all
																	</div>
																</div>
															</Col>
														</Row>

														{!collectionKeywordsSelected || collectionKeywordsSelected.length <= 0
															? ''
															: collectionKeywordsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'collectionKeywordsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!collectionPublisherSelected || collectionPublisherSelected.length <= 0
															? ''
															: collectionPublisherSelected.map(selected => {
																	if (!_.isNil(allFilters.collectionPublisherFilter)) {
																		const collectionPublisherFilters = Object.values(allFilters.collectionPublisherFilter);

																		return collectionPublisherFilters.map(filter => {
																			if (selected === filter.result.toString()) {
																				return (
																					<div className='badge-tag'>
																						{filter.value.substr(0, 80)} {filter.value.length > 80 ? '...' : ''}{' '}
																						<span
																							className='gray800-14-opacity pointer'
																							onClick={() => this.clearFilter(selected, 'collectionPublisherSelected')}>
																							X
																						</span>
																					</div>
																				);
																			}
																		});
																	}
															  })}
													</div>
												) : (
													''
												)}
												<Filters
													data={filterOptions.collectionKeywordsFilterOptions}
													allFilters={allFilters.collectionKeywordFilter}
													updateOnFilter={this.updateOnFilter}
													selected={collectionKeywordsSelected}
													title='Keywords'
												/>
												<Filters
													data={filterOptions.collectionPublisherFilterOptions}
													allFilters={allFilters.collectionPublisherFilter}
													updateOnFilter={this.updateOnFilter}
													selected={collectionPublisherSelected}
													title='Publisher'
													isKeyValue={true}
												/>
											</div>
										</>
									) : (
										''
									)}

									{key === 'Papers' ? (
										<>
											<div className='filterHolder'>
												{paperFeaturesSelected.length !== 0 || paperTopicsSelected.length !== 0 ? (
													<div className='filterCard mb-2'>
														<Row>
															<Col className='mb-2'>
																<div className='inlineBlock'>
																	<div className='gray500-13'>Showing:</div>
																</div>
																<div className='floatRight'>
																	<div className='purple-13 pointer' onClick={() => this.clearFilter('All')}>
																		Clear all
																	</div>
																</div>
															</Col>
														</Row>

														{!paperFeaturesSelected || paperFeaturesSelected.length <= 0
															? ''
															: paperFeaturesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'paperFeaturesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!paperTopicsSelected || paperTopicsSelected.length <= 0
															? ''
															: paperTopicsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'paperTopicsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}
													</div>
												) : (
													''
												)}
												<Filters
													data={filterOptions.paperFeaturesFilterOptions}
													allFilters={allFilters.paperFeatureFilter}
													updateOnFilter={this.updateOnFilter}
													selected={paperFeaturesSelected}
													title='Keywords'
												/>
												<Filters
													data={filterOptions.paperTopicsFilterOptions}
													allFilters={allFilters.paperTopicFilter}
													updateOnFilter={this.updateOnFilter}
													selected={paperTopicsSelected}
													title='Domain'
												/>
											</div>
										</>
									) : (
										''
									)}

									{key === 'Courses' ? (
										<>
											<div className='filterHolder'>
												{courseStartDatesSelected.length !== 0 ||
												courseProviderSelected.length !== 0 ||
												courseLocationSelected.length !== 0 ||
												courseStudyModeSelected.length !== 0 ||
												courseAwardSelected.length !== 0 ||
												courseEntryLevelSelected.length !== 0 ||
												courseDomainsSelected.length !== 0 ||
												courseKeywordsSelected.length !== 0 ||
												courseFrameworkSelected.length !== 0 ||
												coursePrioritySelected.length !== 0 ? (
													<div className='filterCard mb-2'>
														<Row>
															<Col className='mb-2'>
																<div className='inlineBlock'>
																	<div className='gray500-13'>Showing:</div>
																</div>
																<div className='floatRight'>
																	<div className='purple-13 pointer' onClick={() => this.clearFilter('All')}>
																		Clear all
																	</div>
																</div>
															</Col>
														</Row>

														{!courseStartDatesSelected || courseStartDatesSelected.length <= 0
															? ''
															: courseStartDatesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseStartDatesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseProviderSelected || courseProviderSelected.length <= 0
															? ''
															: courseProviderSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseProviderSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseLocationSelected || courseLocationSelected.length <= 0
															? ''
															: courseLocationSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseLocationSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseStudyModeSelected || courseStudyModeSelected.length <= 0
															? ''
															: courseStudyModeSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseStudyModeSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseAwardSelected || courseAwardSelected.length <= 0
															? ''
															: courseAwardSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseAwardSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseEntryLevelSelected || courseEntryLevelSelected.length <= 0
															? ''
															: courseEntryLevelSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseEntryLevelSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseDomainsSelected || courseDomainsSelected.length <= 0
															? ''
															: courseDomainsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseDomainsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseKeywordsSelected || courseKeywordsSelected.length <= 0
															? ''
															: courseKeywordsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseKeywordsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!courseFrameworkSelected || courseFrameworkSelected.length <= 0
															? ''
															: courseFrameworkSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'courseFrameworkSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!coursePrioritySelected || coursePrioritySelected.length <= 0
															? ''
															: coursePrioritySelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'coursePrioritySelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}
													</div>
												) : (
													''
												)}
												<Filters
													data={filterOptions.courseStartDatesFilterOptions}
													allFilters={allFilters.courseStartDatesFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseStartDatesSelected}
													title='Start date'
												/>
												<Filters
													data={filterOptions.courseProviderFilterOptions}
													allFilters={allFilters.courseProviderFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseProviderSelected}
													title='Provider'
												/>
												<Filters
													data={filterOptions.courseLocationFilterOptions}
													allFilters={allFilters.courseLocationFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseLocationSelected}
													title='Location'
												/>
												<Filters
													data={filterOptions.courseStudyModeFilterOptions}
													allFilters={allFilters.courseStudyModeFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseStudyModeSelected}
													title='Study mode'
												/>
												<Filters
													data={filterOptions.courseAwardFilterOptions}
													allFilters={allFilters.courseAwardFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseAwardSelected}
													title='Award'
												/>
												<Filters
													data={filterOptions.courseEntryLevelFilterOptions}
													allFilters={allFilters.courseEntryLevelFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseEntryLevelSelected}
													title='Entry requirements'
												/>
												<Filters
													data={filterOptions.courseDomainsFilterOptions}
													allFilters={allFilters.courseDomainsFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseDomainsSelected}
													title='Domain'
												/>
												<Filters
													data={filterOptions.courseKeywordsFilterOptions}
													allFilters={allFilters.courseKeywordsFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseKeywordsSelected}
													title='Keywords'
												/>
												<Filters
													data={filterOptions.courseFrameworkFilterOptions}
													allFilters={allFilters.courseFrameworkFilter}
													updateOnFilter={this.updateOnFilter}
													selected={courseFrameworkSelected}
													title='Competency framework'
												/>
												<Filters
													data={filterOptions.coursePriorityFilterOptions}
													allFilters={allFilters.coursePriorityFilter}
													updateOnFilter={this.updateOnFilter}
													selected={coursePrioritySelected}
													title='National priority areas'
												/>
											</div>
										</>
									) : (
										''
									)}
									<div className='advanced-search-link-container'>
										<CDStar fill='#f98e2b' height='20' width='20' />
										<a
											href='#'
											className='textUnderline gray800-14 cursorPointer'
											onClick={() => {
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
								<Col sm={12} md={12} lg={9} className='mt-4 mb-5'>
									{!showSort ? (
										''
									) : (
										<Row>
											<Col className='text-right'>
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
											</Col>
										</Row>
									)}

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
								<Col style={{ marginTop: '60px' }} sm={12} md={12} lg={9}>
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
						context={context}
						closed={this.toggleAdvancedSearchModal}
						userProps={userState[0]}
					/>

					<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
				</div>
			</Sentry.ErrorBoundary>
		);
	}
}

export default SearchPage;
