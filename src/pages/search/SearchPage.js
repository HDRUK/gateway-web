import React from 'react';
import axios from 'axios';
import { PageView, initGA } from '../../tracking';
import queryString from 'query-string';
import * as Sentry from '@sentry/react';
import moment from 'moment';
import _ from 'lodash';

import { Container, Row, Col, Tabs, Tab, Pagination, Dropdown } from 'react-bootstrap';

import SearchBar from '../commonComponents/searchBar/SearchBar';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import Loading from '../commonComponents/Loading';
import Filters from './Filters';
import NoResults from '../commonComponents/NoResults';
import { NotificationContainer } from 'react-notifications';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal/ErrorModal';
import './Search.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();

class SearchPage extends React.Component {
	state = {
		searchString: '',
		datasetSort: '',
		toolSort: '',
		projectSort: '',
		paperSort: '',
		personSort: '',
		courseSort: '',
		datasetIndex: 0,
		toolIndex: 0,
		projectIndex: 0,
		paperIndex: 0,
		personIndex: 0,
		courseIndex: 0,
		datasetData: [],
		toolData: [],
		projectData: [],
		paperData: [],
		personData: [],
		courseData: [],
		filterOptions: [],
		allFilters: [],
		licensesSelected: [],
		sampleAvailabilitySelected: [],
		keywordsSelected: [],
		publishersSelected: [],
		ageBandsSelected: [],
		geoCoverageSelected: [],
		phenotypesSelected: [],
		toolCategoriesSelected: [],
		languageSelected: [],
		featuresSelected: [],
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
		summary: [],
		key: 'Datasets',
		isLoading: true,
		isResultsLoading: true,
		showDrawer: false,
		showModal: false,
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
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.state.searchString = props.searchString || null;
		this.searchBar = React.createRef();
	}

	showModal = () => {
		this.setState({ showError: true });
	};

	hideModal = () => {
		this.setState({ showError: false });
	};

	async componentDidMount() {
		//fires on first time in or page is refreshed/url loaded
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);
			if (this.state.userState[0].loggedIn === true && values.loginReferrer) window.location.href = values.loginReferrer;
			else if (this.state.userState[0].loggedIn === true && values.logout === 'true') {
				axios.get(baseURL + '/api/v1/auth/logout').then(res => {
					window.location.reload();
				});
			}

			await Promise.all([this.updateFilterStates(values)]);
			this.doSearchCall();
			initGA('UA-166025838-1');
			PageView();
		} else {
			this.setState({ data: [], searchString: '', isLoading: true });
			this.doSearchCall();
			initGA('UA-166025838-1');
			PageView();
		}
	}

	async componentWillReceiveProps() {
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);

			if (
				values.search !== this.state.searchString ||
				(((typeof values.license === 'undefined' && this.state.licensesSelected.length !== 0) ||
					(typeof values.license !== 'undefined' && this.state.licensesSelected.length === 0)) &&
					!this.state.licensesSelected.includes(values.license)) ||
				(((typeof values.sampleavailability === 'undefined' && this.state.sampleAvailabilitySelected.length !== 0) ||
					(typeof values.sampleavailability !== 'undefined' && this.state.sampleAvailabilitySelected.length === 0)) &&
					!this.state.sampleAvailabilitySelected.includes(values.sampleavailability)) ||
				(((typeof values.keywords === 'undefined' && this.state.keywordsSelected.length !== 0) ||
					(typeof values.keywords !== 'undefined' && this.state.keywordsSelected.length === 0)) &&
					!this.state.keywordsSelected.includes(values.keywords)) ||
				(((typeof values.publisher === 'undefined' && this.state.publishersSelected.length !== 0) ||
					(typeof values.publisher !== 'undefined' && this.state.publishersSelected.length === 0)) &&
					!this.state.publishersSelected.includes(values.publisher)) ||
				(((typeof values.ageband === 'undefined' && this.state.ageBandsSelected.length !== 0) ||
					(typeof values.ageband !== 'undefined' && this.state.ageBandsSelected.length === 0)) &&
					!this.state.ageBandsSelected.includes(values.ageband)) ||
				(((typeof values.geographiccover === 'undefined' && this.state.geoCoverageSelected.length !== 0) ||
					(typeof values.geographiccover !== 'undefined' && this.state.geoCoverageSelected.length === 0)) &&
					!this.state.geoCoverageSelected.includes(values.geographiccover)) ||
				(((typeof values.phenotypes === 'undefined' && this.state.phenotypesSelected.length !== 0) ||
					(typeof values.phenotypes !== 'undefined' && this.state.phenotypesSelected.length === 0)) &&
					!this.state.phenotypesSelected.includes(values.phenotypes)) ||
				(((typeof values.toolcategories === 'undefined' && this.state.toolCategoriesSelected.length !== 0) ||
					(typeof values.toolcategories !== 'undefined' && this.state.toolCategoriesSelected.length === 0)) &&
					!this.state.toolCategoriesSelected.includes(values.toolcategories)) ||
				(((typeof values.programmingLanguage === 'undefined' && this.state.languageSelected.length !== 0) ||
					(typeof values.programmingLanguage !== 'undefined' && this.state.languageSelected.length === 0)) &&
					!this.state.languageSelected.includes(values.programmingLanguage)) ||
				(((typeof values.features === 'undefined' && this.state.featuresSelected.length !== 0) ||
					(typeof values.features !== 'undefined' && this.state.featuresSelected.length === 0)) &&
					!this.state.featuresSelected.includes(values.features)) ||
				(((typeof values.tooltopics === 'undefined' && this.state.toolTopicsSelected.length !== 0) ||
					(typeof values.tooltopics !== 'undefined' && this.state.toolTopicsSelected.length === 0)) &&
					!this.state.toolTopicsSelected.includes(values.tooltopics)) ||
				(((typeof values.projectcategories === 'undefined' && this.state.projectCategoriesSelected.length !== 0) ||
					(typeof values.projectcategories !== 'undefined' && this.state.projectCategoriesSelected.length === 0)) &&
					!this.state.projectCategoriesSelected.includes(values.projectcategories)) ||
				(((typeof values.projectfeatures === 'undefined' && this.state.projectFeaturesSelected.length !== 0) ||
					(typeof values.projectfeatures !== 'undefined' && this.state.projectFeaturesSelected.length === 0)) &&
					!this.state.projectFeaturesSelected.includes(values.projectfeatures)) ||
				(((typeof values.projecttopics === 'undefined' && this.state.projectTopicsSelected.length !== 0) ||
					(typeof values.projecttopics !== 'undefined' && this.state.projectTopicsSelected.length === 0)) &&
					!this.state.projectTopicsSelected.includes(values.projecttopics)) ||
				(((typeof values.paperfeatures === 'undefined' && this.state.paperFeaturesSelected.length !== 0) ||
					(typeof values.paperfeatures !== 'undefined' && this.state.paperFeaturesSelected.length === 0)) &&
					!this.state.paperFeaturesSelected.includes(values.paperfeatures)) ||
				(((typeof values.papertopics === 'undefined' && this.state.paperTopicsSelected.length !== 0) ||
					(typeof values.papertopics !== 'undefined' && this.state.paperTopicsSelected.length === 0)) &&
					!this.state.paperTopicsSelected.includes(values.papertopics)) ||
				(((typeof values.coursestartdates === 'undefined' && this.state.courseStartDatesSelected.length !== 0) ||
					(typeof values.coursestartdates !== 'undefined' && this.state.courseStartDatesSelected.length === 0)) &&
					!this.state.courseStartDatesSelected.includes(values.coursestartdates)) ||
				(((typeof values.courseprovider === 'undefined' && this.state.courseProviderSelected.length !== 0) ||
					(typeof values.courseprovider !== 'undefined' && this.state.courseProviderSelected.length === 0)) &&
					!this.state.courseProviderSelected.includes(values.courseprovider)) ||
				(((typeof values.courselocation === 'undefined' && this.state.courseLocationSelected.length !== 0) ||
					(typeof values.courselocation !== 'undefined' && this.state.courseLocationSelected.length === 0)) &&
					!this.state.courseLocationSelected.includes(values.courselocation)) ||
				(((typeof values.coursestudymode === 'undefined' && this.state.courseStudyModeSelected.length !== 0) ||
					(typeof values.coursestudymode !== 'undefined' && this.state.courseStudyModeSelected.length === 0)) &&
					!this.state.courseStudyModeSelected.includes(values.coursestudymode)) ||
				(((typeof values.courseaward === 'undefined' && this.state.courseAwardSelected.length !== 0) ||
					(typeof values.courseaward !== 'undefined' && this.state.courseAwardSelected.length === 0)) &&
					!this.state.courseAwardSelected.includes(values.courseaward)) ||
				(((typeof values.courseentrylevel === 'undefined' && this.state.courseEntryLevelSelected.length !== 0) ||
					(typeof values.courseentrylevel !== 'undefined' && this.state.courseEntryLevelSelected.length === 0)) &&
					!this.state.courseEntryLevelSelected.includes(values.courseentrylevel)) ||
				(((typeof values.coursedomains === 'undefined' && this.state.courseDomainsSelected.length !== 0) ||
					(typeof values.coursedomains !== 'undefined' && this.state.courseDomainsSelected.length === 0)) &&
					!this.state.courseDomainsSelected.includes(values.coursedomains)) ||
				(((typeof values.coursekeywords === 'undefined' && this.state.courseKeywordsSelected.length !== 0) ||
					(typeof values.coursekeywords !== 'undefined' && this.state.courseKeywordsSelected.length === 0)) &&
					!this.state.courseKeywordsSelected.includes(values.coursekeywords)) ||
				(((typeof values.courseframework === 'undefined' && this.state.courseFrameworkSelected.length !== 0) ||
					(typeof values.courseframework !== 'undefined' && this.state.courseFrameworkSelected.length === 0)) &&
					!this.state.courseFrameworkSelected.includes(values.courseframework)) ||
				(((typeof values.coursepriority === 'undefined' && this.state.coursePrioritySelected.length !== 0) ||
					(typeof values.coursepriority !== 'undefined' && this.state.coursePrioritySelected.length === 0)) &&
					!this.state.coursePrioritySelected.includes(values.coursepriority)) ||
				(((typeof values.datasetIndex === 'undefined' && this.state.datasetIndex !== 0) ||
					(typeof values.datasetIndex !== 'undefined' && this.state.datasetIndex === 0)) &&
					this.state.datasetIndex !== values.datasetIndex) ||
				(((typeof values.toolIndex === 'undefined' && this.state.toolIndex !== 0) ||
					(typeof values.toolIndex !== 'undefined' && this.state.toolIndex === 0)) &&
					this.state.toolIndex !== values.toolIndex) ||
				(((typeof values.projectIndex === 'undefined' && this.state.projectIndex !== 0) ||
					(typeof values.projectIndex !== 'undefined' && this.state.projectIndex === 0)) &&
					this.state.projectIndex !== values.projectIndex) ||
				(((typeof values.paperIndex === 'undefined' && this.state.paperIndex !== 0) ||
					(typeof values.paperIndex !== 'undefined' && this.state.paperIndex === 0)) &&
					this.state.paperIndex !== values.paperIndex) ||
				(((typeof values.personIndex === 'undefined' && this.state.personIndex !== 0) ||
					(typeof values.personIndex !== 'undefined' && this.state.personIndex === 0)) &&
					this.state.personIndex !== values.personIndex) ||
				(((typeof values.courseIndex === 'undefined' && this.state.courseIndex !== 0) ||
					(typeof values.courseIndex !== 'undefined' && this.state.courseIndex === 0)) &&
					this.state.courseIndex !== values.courseIndex) ||
				(((typeof values.datasetSort === 'undefined' && this.state.datasetSort !== '') ||
					(typeof values.datasetSort !== 'undefined' && this.state.datasetSort === '')) &&
					this.state.datasetSort !== values.datasetSort) ||
				(((typeof values.toolSort === 'undefined' && this.state.toolSort !== '') ||
					(typeof values.toolSort !== 'undefined' && this.state.toolSort === '')) &&
					this.state.toolSort !== values.toolSort) ||
				(((typeof values.projectSort === 'undefined' && this.state.projectSort !== '') ||
					(typeof values.projectSort !== 'undefined' && this.state.projectSort === '')) &&
					this.state.projectSort !== values.projectSort) ||
				(((typeof values.paperSort === 'undefined' && this.state.paperSort !== '') ||
					(typeof values.paperSort !== 'undefined' && this.state.paperSort === '')) &&
					this.state.paperSort !== values.paperSort) ||
				(((typeof values.personSort === 'undefined' && this.state.personSort !== '') ||
					(typeof values.personSort !== 'undefined' && this.state.personSort === '')) &&
					this.state.personSort !== values.personSort) ||
				(((typeof values.courseSort === 'undefined' && this.state.courseSort !== '') ||
					(typeof values.courseSort !== 'undefined' && this.state.courseSort === '')) &&
					this.state.courseSort !== values.courseSort)
			) {
				await Promise.all([this.updateFilterStates(values)]);
				this.doSearchCall(true);
			} else if (this.state.key !== values.tab) {
				this.setState({ key: values.tab });
			}
		} else {
			this.setState({ data: [], searchString: '', isLoading: true });
			this.doSearchCall();
		}
	}

	doSearch = async e => {
		//fires on enter on searchbar
		if (e.key === 'Enter') {
			this.setState({ isResultsLoading: true });
			await Promise.all([this.clearFilterStates()]);

			this.doSearchCall();
		}
	};

	doClear = async e => {
		this.setState({ isResultsLoading: true, searchString: '' });
		await Promise.all([this.clearFilterStates()]);
		this.doSearchCall();
	};

	updateFilterStates(values) {
		values.search ? this.setState({ searchString: values.search }) : this.setState({ searchString: '' });

		values.license ? this.setState({ licensesSelected: values.license.split('::') }) : this.setState({ licensesSelected: [] });
		values.sampleavailability
			? this.setState({ sampleAvailabilitySelected: values.sampleavailability.split('::') })
			: this.setState({ sampleAvailabilitySelected: [] });
		values.keywords ? this.setState({ keywordsSelected: values.keywords.split('::') }) : this.setState({ keywordsSelected: [] });
		values.publisher ? this.setState({ publishersSelected: values.publisher.split('::') }) : this.setState({ publishersSelected: [] });
		values.ageband ? this.setState({ ageBandsSelected: values.ageband.split('::') }) : this.setState({ ageBandsSelected: [] });
		values.geographiccover
			? this.setState({ geoCoverageSelected: values.geographiccover.split('::') })
			: this.setState({ geoCoverageSelected: [] });
		values.phenotypes ? this.setState({ phenotypesSelected: values.phenotypes.split('::') }) : this.setState({ phenotypesSelected: [] });

		values.toolcategories
			? this.setState({ toolCategoriesSelected: values.toolcategories.split('::') })
			: this.setState({ toolCategoriesSelected: [] });
		values.programmingLanguage
			? this.setState({ languageSelected: values.programmingLanguage.split('::') })
			: this.setState({ languageSelected: [] });
		values.features ? this.setState({ featuresSelected: values.features.split('::') }) : this.setState({ featuresSelected: [] });
		values.tooltopics ? this.setState({ toolTopicsSelected: values.tooltopics.split('::') }) : this.setState({ toolTopicsSelected: [] });

		values.projectcategories
			? this.setState({ projectCategoriesSelected: values.projectcategories.split('::') })
			: this.setState({ projectCategoriesSelected: [] });
		values.projectfeatures
			? this.setState({ projectFeaturesSelected: values.projectfeatures.split('::') })
			: this.setState({ projectFeaturesSelected: [] });
		values.projecttopics
			? this.setState({ projectTopicsSelected: values.projecttopics.split('::') })
			: this.setState({ projectTopicsSelected: [] });

		values.paperfeatures
			? this.setState({ paperFeaturesSelected: values.paperfeatures.split('::') })
			: this.setState({ paperFeaturesSelected: [] });
		values.papertopics
			? this.setState({ paperTopicsSelected: values.papertopics.split('::') })
			: this.setState({ paperTopicsSelected: [] });

		values.coursestartdates
			? this.setState({ courseStartDatesSelected: values.coursestartdates.split('::') })
			: this.setState({ courseStartDatesSelected: [] });
		values.courseprovider
			? this.setState({ coursePrioritySelected: values.courseprovider.split('::') })
			: this.setState({ coursePrioritySelected: [] });
		values.courselocation
			? this.setState({ courseLocationSelected: values.courselocation.split('::') })
			: this.setState({ courseLocationSelected: [] });
		values.coursestudymode
			? this.setState({ courseStudyModeSelected: values.coursestudymode.split('::') })
			: this.setState({ courseStudyModeSelected: [] });
		values.courseaward
			? this.setState({ courseAwardSelected: values.courseaward.split('::') })
			: this.setState({ courseAwardSelected: [] });
		values.courseentrylevel
			? this.setState({ courseEntryLevelSelected: values.courseentrylevel.split('::') })
			: this.setState({ courseEntryLevelSelected: [] });
		values.coursedomains
			? this.setState({ courseDomainsSelected: values.coursedomains.split('::') })
			: this.setState({ courseDomainsSelected: [] });
		values.coursekeywords
			? this.setState({ courseKeywordsSelected: values.coursekeywords.split('::') })
			: this.setState({ courseKeywordsSelected: [] });
		values.courseframework
			? this.setState({ courseFrameworkSelected: values.courseframework.split('::') })
			: this.setState({ courseFrameworkSelected: [] });
		values.coursepriority
			? this.setState({ coursePrioritySelected: values.coursepriority.split('::') })
			: this.setState({ coursePrioritySelected: [] });

		values.tab ? this.setState({ key: values.tab }) : this.setState({ key: 'Datasets' });
		values.datasetIndex ? this.setState({ datasetIndex: values.datasetIndex }) : this.setState({ datasetIndex: 0 });
		values.toolIndex ? this.setState({ toolIndex: values.toolIndex }) : this.setState({ toolIndex: 0 });
		values.projectIndex ? this.setState({ projectIndex: values.projectIndex }) : this.setState({ projectIndex: 0 });
		values.paperIndex ? this.setState({ paperIndex: values.paperIndex }) : this.setState({ paperIndex: 0 });
		values.personIndex ? this.setState({ personIndex: values.personIndex }) : this.setState({ personIndex: 0 });
		values.courseIndex ? this.setState({ courseIndex: values.courseIndex }) : this.setState({ projectIndex: 0 });

		values.datasetSort ? this.setState({ datasetSort: values.datasetSort }) : this.setState({ datasetSort: '' });
		values.toolSort ? this.setState({ toolSort: values.toolSort }) : this.setState({ toolSort: '' });
		values.projectSort ? this.setState({ projectSort: values.projectSort }) : this.setState({ projectSort: '' });
		values.paperSort ? this.setState({ paperSort: values.paperSort }) : this.setState({ paperSort: '' });
		values.personSort ? this.setState({ personSort: values.personSort }) : this.setState({ personSort: '' });
		values.courseSort ? this.setState({ courseSort: values.courseSort }) : this.setState({ courseSort: '' });
	}

	clearFilterStates() {
		this.setState({ licensesSelected: [] });
		this.setState({ sampleAvailabilitySelected: [] });
		this.setState({ keywordsSelected: [] });
		this.setState({ publishersSelected: [] });
		this.setState({ ageBandsSelected: [] });
		this.setState({ geoCoverageSelected: [] });
		this.setState({ phenotypesSelected: [] });

		this.setState({ toolCategoriesSelected: [] });
		this.setState({ languageSelected: [] });
		this.setState({ featuresSelected: [] });
		this.setState({ toolTopicsSelected: [] });

		this.setState({ projectCategoriesSelected: [] });
		this.setState({ projectFeaturesSelected: [] });
		this.setState({ projectTopicsSelected: [] });

		this.setState({ paperFeaturesSelected: [] });
		this.setState({ paperTopicsSelected: [] });

		this.setState({ courseStartDatesSelected: [] });
		this.setState({ courseProviderSelected: [] });
		this.setState({ courseLocationSelected: [] });
		this.setState({ courseStudyModeSelected: [] });
		this.setState({ courseAwardSelected: [] });
		this.setState({ courseEntryLevelSelected: [] });
		this.setState({ courseDomainsSelected: [] });
		this.setState({ courseKeywordsSelected: [] });
		this.setState({ courseFrameworkSelected: [] });
		this.setState({ coursePrioritySelected: [] });

		this.setState({ datasetIndex: 0 });
		this.setState({ toolIndex: 0 });
		this.setState({ projectIndex: 0 });
		this.setState({ paperIndex: 0 });
		this.setState({ personIndex: 0 });
		this.setState({ courseIndex: 0 });

		this.setState({ datasetSort: '' });
		this.setState({ toolSort: '' });
		this.setState({ projectSort: '' });
		this.setState({ paperSort: '' });
		this.setState({ personSort: '' });
		this.setState({ courseSort: '' });
	}

	updateOnFilterBadge = async (filterGroup, filter) => {
		if (!this.state[filterGroup].find(x => x === filter)) {
			this.state[filterGroup].push(filter);
			this.updateOnFilter();
		}
	};

	updateOnFilter = async () => {
		await Promise.all([
			this.setState({ datasetIndex: 0 }),
			this.setState({ toolIndex: 0 }),
			this.setState({ projectIndex: 0 }),
			this.setState({ paperIndex: 0 }),
			this.setState({ personIndex: 0 }),
			this.setState({ courseIndex: 0 }),
		]);
		this.doSearchCall();
		this.setState({ isResultsLoading: true });
	};

	clearFilter = async (filter, filterGroup) => {
		if (filter === 'All') {
			await Promise.all([this.clearFilterStates()]);
		} else {
			this.state[filterGroup].splice(this.state[filterGroup].indexOf(filter), 1);
		}

		this.doSearchCall();
		this.setState({ isResultsLoading: true });
	};

	doSearchCall(skipHistory) {
		var searchURL = '';

		if (this.state.licensesSelected.length > 0)
			searchURL += '&license=' + encodeURIComponent(this.state.licensesSelected.toString().split(',').join('::'));
		if (this.state.sampleAvailabilitySelected.length > 0)
			searchURL += '&sampleavailability=' + encodeURIComponent(this.state.sampleAvailabilitySelected.toString().split(',').join('::'));
		if (this.state.keywordsSelected.length > 0)
			searchURL += '&keywords=' + encodeURIComponent(this.state.keywordsSelected.toString().split(',').join('::'));
		if (this.state.publishersSelected.length > 0)
			searchURL += '&publisher=' + encodeURIComponent(this.state.publishersSelected.toString().split(',').join('::'));
		if (this.state.ageBandsSelected.length > 0)
			searchURL += '&ageband=' + encodeURIComponent(this.state.ageBandsSelected.toString().split(',').join('::'));
		if (this.state.geoCoverageSelected.length > 0)
			searchURL += '&geographiccover=' + encodeURIComponent(this.state.geoCoverageSelected.toString().split(',').join('::'));
		if (this.state.phenotypesSelected.length > 0)
			searchURL += '&phenotypes=' + encodeURIComponent(this.state.phenotypesSelected.toString().split(',').join('::'));

		if (this.state.toolCategoriesSelected.length > 0)
			searchURL += '&toolcategories=' + encodeURIComponent(this.state.toolCategoriesSelected.toString().split(',').join('::'));
		if (this.state.languageSelected.length > 0)
			searchURL += '&programmingLanguage=' + encodeURIComponent(this.state.languageSelected.toString().split(',').join('::'));
		if (this.state.featuresSelected.length > 0)
			searchURL += '&features=' + encodeURIComponent(this.state.featuresSelected.toString().split(',').join('::'));
		if (this.state.toolTopicsSelected.length > 0)
			searchURL += '&tooltopics=' + encodeURIComponent(this.state.toolTopicsSelected.toString().split(',').join('::'));

		if (this.state.projectCategoriesSelected.length > 0)
			searchURL += '&projectcategories=' + encodeURIComponent(this.state.projectCategoriesSelected.toString().split(',').join('::'));
		if (this.state.projectFeaturesSelected.length > 0)
			searchURL += '&projectfeatures=' + encodeURIComponent(this.state.projectFeaturesSelected.toString().split(',').join('::'));
		if (this.state.projectTopicsSelected.length > 0)
			searchURL += '&projecttopics=' + encodeURIComponent(this.state.projectTopicsSelected.toString().split(',').join('::'));

		if (this.state.paperFeaturesSelected.length > 0)
			searchURL += '&paperfeatures=' + encodeURIComponent(this.state.paperFeaturesSelected.toString().split(',').join('::'));
		if (this.state.paperTopicsSelected.length > 0)
			searchURL += '&papertopics=' + encodeURIComponent(this.state.paperTopicsSelected.toString().split(',').join('::'));

		if (this.state.courseStartDatesSelected.length > 0)
			searchURL += '&coursestartdates=' + encodeURIComponent(this.state.courseStartDatesSelected.toString().split(',').join('::'));
		if (this.state.courseProviderSelected.length > 0)
			searchURL += '&courseprovider=' + encodeURIComponent(this.state.courseProviderSelected.toString().split(',').join('::'));
		if (this.state.courseLocationSelected.length > 0)
			searchURL += '&courselocation=' + encodeURIComponent(this.state.courseLocationSelected.toString().split(',').join('::'));
		if (this.state.courseStudyModeSelected.length > 0)
			searchURL += '&coursestudymode=' + encodeURIComponent(this.state.courseStudyModeSelected.toString().split(',').join('::'));
		if (this.state.courseAwardSelected.length > 0)
			searchURL += '&courseaward=' + encodeURIComponent(this.state.courseAwardSelected.toString().split(',').join('::'));
		if (this.state.courseEntryLevelSelected.length > 0)
			searchURL += '&courseentrylevel=' + encodeURIComponent(this.state.courseEntryLevelSelected.toString().split(',').join('::'));
		if (this.state.courseDomainsSelected.length > 0)
			searchURL += '&coursedomains=' + encodeURIComponent(this.state.courseDomainsSelected.toString().split(',').join('::'));
		if (this.state.courseKeywordsSelected.length > 0)
			searchURL += '&coursekeywords=' + encodeURIComponent(this.state.courseKeywordsSelected.toString().split(',').join('::'));
		if (this.state.courseFrameworkSelected.length > 0)
			searchURL += '&courseframework=' + encodeURIComponent(this.state.courseFrameworkSelected.toString().split(',').join('::'));
		if (this.state.coursePrioritySelected.length > 0)
			searchURL += '&coursepriority=' + encodeURIComponent(this.state.coursePrioritySelected.toString().split(',').join('::'));

		if (this.state.datasetIndex > 0) searchURL += '&datasetIndex=' + encodeURIComponent(this.state.datasetIndex);
		if (this.state.toolIndex > 0) searchURL += '&toolIndex=' + encodeURIComponent(this.state.toolIndex);
		if (this.state.projectIndex > 0) searchURL += '&projectIndex=' + encodeURIComponent(this.state.projectIndex);
		if (this.state.paperIndex > 0) searchURL += '&paperIndex=' + encodeURIComponent(this.state.paperIndex);
		if (this.state.personIndex > 0) searchURL += '&personIndex=' + encodeURIComponent(this.state.personIndex);
		if (this.state.courseIndex > 0) searchURL += '&courseIndex=' + encodeURIComponent(this.state.courseIndex);

		if (this.state.datasetSort !== '') searchURL += '&datasetSort=' + encodeURIComponent(this.state.datasetSort);
		if (this.state.toolSort !== '') searchURL += '&toolSort=' + encodeURIComponent(this.state.toolSort);
		if (this.state.projectSort !== '') searchURL += '&projectSort=' + encodeURIComponent(this.state.projectSort);
		if (this.state.paperSort !== '') searchURL += '&paperSort=' + encodeURIComponent(this.state.paperSort);
		if (this.state.personSort !== '') searchURL += '&personSort=' + encodeURIComponent(this.state.personSort);
		if (this.state.courseSort !== '') searchURL += '&courseSort=' + encodeURIComponent(this.state.courseSort);

		if (this.state.userState[0].loggedIn === false) {
			var values = queryString.parse(window.location.search);
			if (values.showLogin === 'true' && values.loginReferrer !== '')
				searchURL += '&loginReferrer=' + encodeURIComponent(values.loginReferrer);
			else if (values.showLogin === 'true' && document.referrer !== '')
				searchURL += '&loginReferrer=' + encodeURIComponent(document.referrer);
		}

		if (!skipHistory) {
			if (this.state.key) searchURL += '&tab=' + this.state.key;
			this.props.history.push(`${window.location.pathname}?search=${this.state.searchString}` + searchURL);
		}

		if (this.state.key !== 'People') {
			axios.get(baseURL + '/api/v1/search/filter?search=' + this.state.searchString + searchURL).then(res => {
				this.setState({
					allFilters: res.data.allFilters || [],
					filterOptions: res.data.filterOptions || [],
				});
			});
		}

		axios.get(baseURL + '/api/v1/search?search=' + this.state.searchString + searchURL).then(res => {
			this.setState({
				datasetData: res.data.datasetResults || [],
				toolData: res.data.toolResults || [],
				projectData: res.data.projectResults || [],
				paperData: res.data.paperResults || [],
				personData: res.data.personResults || [],
				courseData: res.data.courseResults || [],
				summary: res.data.summary || [],
				isLoading: false,
				isResultsLoading: false,
			});
		});
	}

	updateSearchString = searchString => {
		this.setState({ searchString });
	};

	handleSelect = async key => {
		await Promise.all([this.setState({ key: key, isResultsLoading: true })]);
		var values = queryString.parse(window.location.search);
		values.tab = key;
		this.props.history.push(window.location.pathname + '?' + queryString.stringify(values));

		this.doSearchCall();
	};

	handleSort = async sort => {
		await new Promise((resolve, reject) => {
			if (this.state.key === 'Datasets') this.setState({ datasetSort: sort, isResultsLoading: true });
			else if (this.state.key === 'Tools') this.setState({ toolSort: sort, isResultsLoading: true });
			else if (this.state.key === 'Projects') this.setState({ projectSort: sort, isResultsLoading: true });
			else if (this.state.key === 'Papers') this.setState({ paperSort: sort, isResultsLoading: true });
			else if (this.state.key === 'People') this.setState({ personSort: sort, isResultsLoading: true });
			else if (this.state.key === 'Courses') this.setState({ courseSort: sort, isResultsLoading: true });
			resolve();
		});

		this.doSearchCall();
	};

	handlePagination = async (type, page) => {
		if (type === 'dataset') {
			await Promise.all([this.setState({ datasetIndex: page })]);
		} else if (type === 'tool') {
			await Promise.all([this.setState({ toolIndex: page })]);
		} else if (type === 'project') {
			await Promise.all([this.setState({ projectIndex: page })]);
		} else if (type === 'paper') {
			await Promise.all([this.setState({ paperIndex: page })]);
		} else if (type === 'person') {
			await Promise.all([this.setState({ personIndex: page })]);
		} else if (type === 'course') {
			await Promise.all([this.setState({ courseIndex: page })]);
		}
		this.doSearchCall();
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
			summary,
			searchString,
			datasetData,
			toolData,
			projectData,
			paperData,
			personData,
			courseData,
			filterOptions,
			allFilters,
			userState,
			isLoading,
			isResultsLoading,

			publishersSelected,
			licensesSelected,
			geoCoverageSelected,
			sampleAvailabilitySelected,
			keywordsSelected,
			phenotypesSelected,

			languageSelected,
			toolTopicsSelected,
			toolCategoriesSelected,
			featuresSelected,

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

			datasetIndex,
			toolIndex,
			projectIndex,
			paperIndex,
			personIndex,
			courseIndex,

			datasetSort,
			toolSort,
			projectSort,
			paperSort,
			personSort,

			showDrawer,
			showModal,
			context,
		} = this.state;

		var { key } = this.state;

		if (isLoading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}

		var datasetCount = summary.datasets || 0;
		var toolCount = summary.tools || 0;
		var projectCount = summary.projects || 0;
		var paperCount = summary.papers || 0;
		var personCount = summary.persons || 0;
		var courseCount = summary.courses || 0;

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
			} else {
				key = 'Datasets';
			}
		}

		var showSort = true;
		if ((key === '' || key === 'Datasets') && datasetCount === 0) showSort = false;
		if (key === 'Tools' && toolCount === 0) showSort = false;
		if (key === 'Projects' && projectCount === 0) showSort = false;
		if (key === 'Papers' && paperCount === 0) showSort = false;
		if (key === 'People' && personCount === 0) showSort = false;
		if (key === 'Courses') showSort = false;

		let datasetPaginationItems = [];
		let toolPaginationItems = [];
		let projectPaginationItems = [];
		let paperPaginationItems = [];
		let personPaginationItems = [];
		let coursePaginationItems = [];
		var maxResult = 40;
		for (let i = 1; i <= Math.ceil(datasetCount / maxResult); i++) {
			datasetPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === datasetIndex / maxResult + 1}
					onClick={() => this.handlePagination('dataset', (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		for (let i = 1; i <= Math.ceil(toolCount / maxResult); i++) {
			toolPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === toolIndex / maxResult + 1}
					onClick={() => this.handlePagination('tool', (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		for (let i = 1; i <= Math.ceil(projectCount / maxResult); i++) {
			projectPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === projectIndex / maxResult + 1}
					onClick={() => this.handlePagination('project', (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		for (let i = 1; i <= Math.ceil(paperCount / maxResult); i++) {
			paperPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === paperIndex / maxResult + 1}
					onClick={() => this.handlePagination('paper', (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		for (let i = 1; i <= Math.ceil(personCount / maxResult); i++) {
			personPaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === personIndex / maxResult + 1}
					onClick={() => this.handlePagination('person', (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}
		for (let i = 1; i <= Math.ceil(courseCount / maxResult); i++) {
			coursePaginationItems.push(
				<Pagination.Item
					key={i}
					active={i === courseIndex / maxResult + 1}
					onClick={() => this.handlePagination('course', (i - 1) * maxResult)}>
					{i}
				</Pagination.Item>
			);
		}

		return (
			<Sentry.ErrorBoundary fallback={<ErrorModal show={this.showModal} handleClose={this.hideModal} />}>
				<div>
					<SearchBar
						ref={this.searchBar}
						searchString={searchString}
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
								<Tab eventKey='Courses' title={'Courses (' + courseCount + ')'} />
								<Tab eventKey='Papers' title={'Papers (' + paperCount + ')'} />
								<Tab eventKey='People' title={'People (' + personCount + ')'}>
									{personCount <= 0 && !isResultsLoading ? <NoResults type='profiles' searchString={searchString} /> : ''}
								</Tab>
							</Tabs>
						</div>
					</div>

					<Container>
						<Row>
							{key !== 'People' ? (
								<Col sm={12} md={12} lg={3} className='mt-4'>
									{key === 'Datasets' ? (
										<>
											<div className='filterHolder'>
												{publishersSelected.length !== 0 ||
												licensesSelected.length !== 0 ||
												keywordsSelected.length !== 0 ||
												geoCoverageSelected.length !== 0 ||
												sampleAvailabilitySelected.length !== 0 ||
												phenotypesSelected.length !== 0 ? (
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

														{!publishersSelected || publishersSelected.length <= 0
															? ''
															: publishersSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'publishersSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!licensesSelected || licensesSelected.length <= 0
															? ''
															: licensesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'licensesSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!keywordsSelected || keywordsSelected.length <= 0
															? ''
															: keywordsSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'keywordsSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!geoCoverageSelected || geoCoverageSelected.length <= 0
															? ''
															: geoCoverageSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'geoCoverageSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!sampleAvailabilitySelected || sampleAvailabilitySelected.length <= 0
															? ''
															: sampleAvailabilitySelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'sampleAvailabilitySelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!phenotypesSelected || phenotypesSelected.length <= 0
															? ''
															: phenotypesSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'phenotypesSelected')}>
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
													data={filterOptions.publisherFilterOptions}
													allFilters={allFilters.publisherFilter}
													updateOnFilter={this.updateOnFilter}
													selected={publishersSelected}
													title='Publisher'
												/>
												<Filters
													data={filterOptions.licenseFilterOptions}
													allFilters={allFilters.licenseFilter}
													updateOnFilter={this.updateOnFilter}
													selected={licensesSelected}
													title='License'
												/>
												<Filters
													data={filterOptions.datasetFeaturesFilterOptions}
													allFilters={allFilters.datasetFeatureFilter}
													updateOnFilter={this.updateOnFilter}
													selected={keywordsSelected}
													title='Keywords'
												/>
												<Filters
													data={filterOptions.geographicCoverageFilterOptions}
													allFilters={allFilters.geographicCoverageFilter}
													updateOnFilter={this.updateOnFilter}
													selected={geoCoverageSelected}
													title='Geographic coverage'
												/>
												<Filters
													data={filterOptions.sampleFilterOptions}
													allFilters={allFilters.sampleFilter}
													updateOnFilter={this.updateOnFilter}
													selected={sampleAvailabilitySelected}
													title='Physical sample availability'
												/>
												<Filters
													data={filterOptions.phenotypesOptions}
													allFilters={allFilters.phenotypesFilter}
													updateOnFilter={this.updateOnFilter}
													selected={phenotypesSelected}
													title='Phenotype'
												/>
												{/* <Filters data={filterOptions.ageBandFilterOptions} updateOnFilter={this.updateOnFilter} selected={ageBandsSelected} title="Age Bands" /> */}
											</div>
										</>
									) : (
										''
									)}

									{key === 'Tools' ? (
										<>
											<div className='filterHolder'>
												{toolCategoriesSelected.length !== 0 ||
												languageSelected.length !== 0 ||
												featuresSelected.length !== 0 ||
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

														{!languageSelected || languageSelected.length <= 0
															? ''
															: languageSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'languageSelected')}>
																				X
																			</span>
																		</div>
																	);
															  })}

														{!featuresSelected || featuresSelected.length <= 0
															? ''
															: featuresSelected.map(selected => {
																	return (
																		<div className='badge-tag'>
																			{selected.substr(0, 80)} {selected.length > 80 ? '...' : ''}{' '}
																			<span
																				className='gray800-14-opacity pointer'
																				onClick={() => this.clearFilter(selected, 'featuresSelected')}>
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
													selected={languageSelected}
													title='Programming language'
												/>
												<Filters
													data={filterOptions.featuresFilterOptions}
													allFilters={allFilters.toolFeatureFilter}
													updateOnFilter={this.updateOnFilter}
													selected={featuresSelected}
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
								</Col>
							) : (
								<Col sm={12} md={12} lg={3} />
							)}

							{!isResultsLoading ? (
								<Col sm={12} md={12} lg={9} className='mt-4'>
									{!showSort ? (
										''
									) : (
										<Row>
											<Col className='text-right'>
												<Dropdown alignRight onSelect={this.handleSort}>
													<Dropdown.Toggle variant='info' id='dropdown-menu-align-right' className='gray800-14'>
														{(() => {
															if (key === 'Datasets') {
																if (datasetSort === 'popularity') return 'Sort by popularity';
																else if (datasetSort === 'metadata') return 'Sort by metadata quality';
																else return 'Sort by relevance';
															} else if (key === 'Tools') {
																if (toolSort === 'popularity') return 'Sort by popularity';
																else return 'Sort by relevance';
															} else if (key === 'Projects') {
																if (projectSort === 'popularity') return 'Sort by popularity';
																else return 'Sort by relevance';
															} else if (key === 'Papers') {
																if (paperSort === 'popularity') return 'Sort by popularity';
																else return 'Sort by relevance';
															} else if (key === 'People') {
																if (personSort === 'popularity') return 'Sort by popularity';
																else return 'Sort by relevance';
															}
														})()}
														&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
													</Dropdown.Toggle>

													<Dropdown.Menu>
														<Dropdown.Item eventKey='relevance' className='gray800-14 '>
															Sort by relevance
														</Dropdown.Item>
														<Dropdown.Item eventKey='popularity' className='gray800-14'>
															Sort by popularity
														</Dropdown.Item>
														{key === 'Datasets' ? (
															<Dropdown.Item eventKey='metadata' className='gray800-14'>
																Sort by metadata quality
															</Dropdown.Item>
														) : (
															''
														)}
													</Dropdown.Menu>
												</Dropdown>
											</Col>
										</Row>
									)}
									{key === 'Datasets' ? (
										datasetCount <= 0 && !isResultsLoading ? (
											<NoResults type='datasets' searchString={searchString} />
										) : (
											datasetData.map(dataset => {
												let datasetPublisher;
												let datasetLogo;
												{
													!_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.name')
														? (datasetPublisher = dataset.datasetv2.summary.publisher.name)
														: (datasetPublisher = '');
												}
												{
													!_.isEmpty(dataset.datasetv2) && _.has(dataset, 'datasetv2.summary.publisher.logo')
														? (datasetLogo = dataset.datasetv2.summary.publisher.logo)
														: (datasetLogo = '');
												}

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
										toolCount <= 0 && !isResultsLoading ? (
											<NoResults type='tools' searchString={searchString} />
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
										projectCount <= 0 && !isResultsLoading ? (
											<NoResults type='projects' searchString={searchString} />
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

									{key === 'Papers' ? (
										paperCount <= 0 && !isResultsLoading ? (
											<NoResults type='papers' searchString={searchString} />
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
											if (courseCount <= 0 && !isResultsLoading) return <NoResults type='courses' searchString={searchString} />;
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

									<div className='text-center'>
										{key === 'Datasets' && datasetCount > maxResult ? <Pagination>{datasetPaginationItems}</Pagination> : ''}

										{key === 'Tools' && toolCount > maxResult ? <Pagination>{toolPaginationItems}</Pagination> : ''}

										{key === 'Projects' && projectCount > maxResult ? <Pagination>{projectPaginationItems}</Pagination> : ''}

										{key === 'Papers' && paperCount > maxResult ? <Pagination>{paperPaginationItems}</Pagination> : ''}

										{key === 'People' && personCount > maxResult ? <Pagination>{personPaginationItems}</Pagination> : ''}

										{key === 'Courses' && courseCount > maxResult ? <Pagination>{coursePaginationItems}</Pagination> : ''}
									</div>
								</Col>
							) : (
								<Col sm={12} md={12} lg={9}>
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

					<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
				</div>
			</Sentry.ErrorBoundary>
		);
	}
}

export default SearchPage;
