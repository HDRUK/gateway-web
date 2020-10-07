import React, { Component, Fragment } from 'react';
import { History } from 'react-router';
import {
	Container,
	Row,
	Col,
	Modal,
	Tabs,
	Tab,
	Accordion,
	Card,
} from 'react-bootstrap';
import Winterfell from 'winterfell';
import _ from 'lodash';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import TypeaheadMultiUser from './components/TypeaheadUser/TypeaheadMultiUser';
import TypeaheadDataset from './components/TypeaheadDataset/TypeaheadDataset';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import NavItem from './components/NavItem/NavItem';
import NavDropdown from './components/NavDropdown/NavDropdown';
import DarValidation from '../../utils/DarValidation.util';
import DarHelper from '../../utils/DarHelper.util';
import SearchBarHelperUtil from '../../utils/SearchBarHelper.util';
import { classSchema } from './classSchema';
import { baseURL } from '../../configs/url.config';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import 'react-tabs/style/react-tabs.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './DataAccessRequest.scss';
import { Link } from 'react-router-dom';
import SVGIcon from '../../images/SVGIcon';
import moment from 'moment';
import ApplicantActionButtons from './components/ApplicantActionButtons/ApplicantActionButtons';
import CustodianActionButtons from './components/CustodianActionButtons/CustodianActionButtons';
import ActionModal from './components/ActionModal/ActionModal';
import ContributorModal from './components/ContributorModal/ContributorModal';
import SLA from '../commonComponents/sla/SLA';

class DataAccessRequest extends Component {
	constructor(props) {
		super(props);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFormUpdate = this.onFormUpdate.bind(this);
		this.onQuestionFocus = this.onQuestionFocus.bind(this);
		this.onHandleDataSetChange = this.onHandleDataSetChange.bind(this);
		this.searchBar = React.createRef();

		this.state = {
			_id: '',
			jsonSchema: {},
			questionAnswers: {},
			applicationStatus: '',
			activePanelId: '',
			activeGuidance: '',
			searchString: '',
			key: 'guidance',
			totalQuestions: '',
			validationErrors: {},
			lastSaved: '',
			lookup: ['fullname'],
			isLoading: true,
			formSubmitted: false,
			datasets: [
				{
					name: '',
					datasetfields: {
						publisher: '',
					},
				},
			],
			publisher: '',
			mainApplicant: '',
			showDrawer: false,
			showModal: false,
			showMrcModal: false,
			showActionModal: false,
			showContributorModal: false,
			readOnly: false,
			userType: '',
			isWideForm: false,
			allowsMultipleDatasets: false,
			activeAccordionCard: 0,
			allowedNavigation: true,
			projectNameValid: true,
			topicContext: {},
			authorIds: [],
			projectId: '',
			aboutApplication: {
				projectName: '',
				selectedDatasets: [],
				completedDatasetSelection: false,
				completedReadAdvice: false,
				completedCommunicateAdvice: false,
				completedApprovalsAdvice: false,
				completedSubmitAdvice: false,
				completedInviteCollaborators: false,
			},
			context: {},
			actionModalConfig: {}, 
			roles: []
		};
	}

	applicationState = {
		CONFIRMAPPROVALCONDITIONS: 'approved with conditions',
		CONFIRMREJECTION: 'rejected',
		CONFIRMAPPROVAL: 'approved',
	};

	tabState = {
		CONFIRMAPPROVALCONDITIONS: 'approved',
		CONFIRMREJECTION: 'rejected',
		CONFIRMAPPROVAL: 'approved',
	};

	async componentDidMount() {
		await this.initPage();
	}

	async componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			await this.initPage();
		}
	}

	async initPage() {
		try {
			// 1. Determine the entry point to the Data Access Request
			//  a) Dataset - route will contain only the 'datasetId' from the dataset page from which they came
			//	b) Message Panel - route will contain only the 'publisherId' with historic state passed from the message panel component which includes datasetId(s)
			// 	c/d) Data Access Request User Area / Direct Link - route will contain a data access request 'accessId' which specifically links all associated data to one application
			const { datasetId, accessId, publisherId } = this.props.match.params;
			let countedQuestionAnswers = {}, totalQuestions = '';

			if (datasetId) {
				// a) Dataset
				await this.loadSingleDatasetMode(datasetId);
				// Populate the question/answers count
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
			} else if (publisherId) {
				// b) Message Panel/Modal
				// Extract datasets passed from history (provided via request access click from modal)
				const { datasets: datasetIds } = this.props.location.state;
				const datasetIdsConcat = datasetIds.map((ds) => ds.datasetId).join(',');
				await this.loadMultipleDatasetMode(datasetIdsConcat);
				// Populate the question/answers count
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
			} else if (accessId) {
				// c/d) Data Access Request/Direct Link (To be extended for readonly mode)
				await this.loadDataAccessRequest(accessId);
				// Populate the question/answers count if still in progress, otherwise display project status and date last updated
				const { applicationStatus, updatedAt } = this.state;
				if (applicationStatus === 'inProgress') {
					countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
					totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
				} else {
					totalQuestions = `Application ${applicationStatus} on ${moment(
						updatedAt
					).format('DD MMM YYYY HH:mm')}`;
				}
			}

			// Update state to display question answer count
			this.setState({
				totalQuestions,
			});
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		} finally {
			this.getRole(this.state.roles)
		}
	}

	loadMultipleDatasetMode = async (datasetIds) => {
		try {
			// 1. Make API call to find and return the json schema for this dataset's application along with any existing answers and publisher info
			let response = await axios.get(
				`${baseURL}/api/v1/data-access-request/datasets/${datasetIds}`
			);
			// 2. Destructure backend response for this context containing details of DAR including question set and current progress
			let {
				data: {
					data: {
						jsonSchema,
						questionAnswers,
						_id,
						applicationStatus,
						aboutApplication = {},
						datasets,
						mainApplicant,
						userId,
						authorIds,
						projectId
					},
				},
			} = response;

			// 3. Set up the DAR
			this.setScreenData({
				jsonSchema,
				questionAnswers,
				_id,
				applicationStatus,
				aboutApplication,
				datasets,
				mainApplicant,
				userId,
				authorIds,
				projectId
			});
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		}
	};

	loadSingleDatasetMode = async (datasetId) => {
		try {
			// 1. Make API call to find and return the json schema for this dataset's application along with any existing answers
			let response = await axios.get(
				`${baseURL}/api/v1/data-access-request/dataset/${datasetId}`
			);
			const {
				data: {
					data: {
						jsonSchema,
						questionAnswers,
						_id,
						applicationStatus,
						aboutApplication = {},
						dataset,
						mainApplicant,
						userId,
						authorIds,
						projectId
					},
				},
			} = response;

			// 2. Set DAR form
			this.setScreenData({
				jsonSchema,
				questionAnswers,
				_id,
				applicationStatus,
				aboutApplication,
				datasets: [dataset],
				mainApplicant,
				userId,
				authorIds,
				projectId
			});

			// for local test uses formSchema.json
			//  this.setState({jsonSchema: {...formSchema}, questionAnswers: {fullname: {"id":5385077600698822,"orcid":"12345678","name":"Paul McCafferty","bio":"Developer @ PA","email":"p*************y@p**************m"}, orcid:"12345678", email:"p*************y@p**************m"}, activePanelId: 'applicant', isLoading: false, applicationStatus: 'inProgress'});
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		}
	};

	loadDataAccessRequest = async (accessId) => { 
		try {
			// 1. Make API call to find and return the application form schema and answers matching this Id
			let response = await axios.get(
				`${baseURL}/api/v1/data-access-request/${accessId}` 
			);
			// 2. Destructure backend response for this context containing details of DAR including question set and current progress
			let {
				data: {
					data: {
						jsonSchema,
						questionAnswers,
						_id,
						applicationStatus,
						aboutApplication = {},
						datasets,
						readOnly,
						userType,
						mainApplicant,
						userId,
						authorIds,
						projectId
					},
				},
			} = response;
			// 3. Set up the DAR
			this.setScreenData({
				jsonSchema,
				questionAnswers,
				_id,
				applicationStatus,
				aboutApplication,
				datasets,
				readOnly,
				userType,
				mainApplicant,
				userId,
				authorIds,
				projectId
			});
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		}
	};

	setScreenData = async (context) => {
		// 1. Destructure DAR context containing questions and any application progress
		let {
			jsonSchema,
			questionAnswers,
			_id,
			applicationStatus,
			aboutApplication,
			datasets,
			readOnly = false,
			userType = 'APPLICANT',
			mainApplicant,
			userId,
			authorIds,
			projectId
		} = context;
		let {
			datasetfields: { publisher },
		} = datasets[0]
		let { firstname, lastname } = mainApplicant;
		let showSubmit = false;


		// 2. If about application is empty, this is a new data access request so set up state based on passed context
		if (_.isEmpty(aboutApplication)) {
			aboutApplication.selectedDatasets = datasets.map((dataset) => {
				let {
					_id: dataset_id,
					publisher: publisherObj,
					datasetid,
					name,
					description,
				} = dataset;
				let {
					datasetfields: { abstract, contactPoint },
				} = dataset;
				return {
					_id: dataset_id,
					datasetId: datasetid,
					name,
					description,
					abstract,
					publisher,
					contactPoint,
					publisherObj,
				};
			});
		}

		// 3. Set messaging and modal context
		let topicContext = DarHelper.createTopicContext(
			aboutApplication.selectedDatasets
		);
		let modalContext = DarHelper.createModalContext(
			aboutApplication.selectedDatasets
		);
		let allowsMultipleDatasets = topicContext.requiresModal || false;

		// 4. If multiple datasets are allowed, append 'about this application' section
		if (allowsMultipleDatasets) {
			// Append 'about' panel and nav item
			jsonSchema.pages[0].active = false;
			jsonSchema.pages.unshift(DarHelper.staticContent.aboutPageNav);
			// Add form panel
			jsonSchema.formPanels.unshift(DarHelper.staticContent.aboutPanel);
		}

		// 5. Get the first active panel
		let {
			formPanels: [initialPanel, ...rest],
		} = jsonSchema;

		// 6. Hide show submit application
		if (applicationStatus === 'inProgress') {
			showSubmit = true;
		}

		// 6. Set state
		this.setState({
			jsonSchema: { ...jsonSchema, ...classSchema },
			datasets,
			questionAnswers,
			_id,
			applicationStatus,
			activePanelId: initialPanel.panelId,
			isWideForm: initialPanel.panelId === 'about',
			isLoading: false,
			topicContext,
			publisher,
			aboutApplication,
			allowsMultipleDatasets,
			context: modalContext,
			readOnly,
			userType,
			userId,
			mainApplicant: `${firstname} ${lastname}${this.checkCurrentUser(userId) ? ' (you)':''}`,
			authorIds,
			projectId,
			showSubmit
		});
	};

	onQuestionFocus(questionId = '') {
		let questions;
		if (!_.isEmpty(questionId)) {
			let {
				jsonSchema: { questionSets },
			} = this.state;
			// 1. get active question set
			({ questions } =
				[...questionSets].find(
					(q) => q.questionSetId === this.state.activePanelId
				) || []);
			if (!_.isEmpty(questions)) {
				// 2. loop over and find active question
				let activeQuestion = DarHelper.getActiveQuestion(
					[...questions],
					questionId
				);
				if (!_.isEmpty(activeQuestion))
					this.setState({ activeGuidance: activeQuestion.guidance });
			}
		}
	}

	/**
	 * [onFormUpdate]
	 * @param {obj: questionAnswers}
	 * @desc Callback from Winterfell sets totalQuestionsAnswered + saveTime
	 */
	onFormUpdate = _.debounce((id = '', questionAnswers = {}) => {
		if (!_.isEmpty(id) && !_.isEmpty(questionAnswers)) {
			let { applicationStatus, lookup, activePanelId } = this.state;
			// 1. check for auto complete
			if (typeof id === 'string') {
				let [questionId, uniqueId] = id.split('_');
				let qId = questionId.toLowerCase();
				let lookupAutoComplete = [...lookup].includes(qId);
				if (lookupAutoComplete)
					questionAnswers = DarHelper.autoComplete(qId, uniqueId, {
						...questionAnswers,
					});
			}
			// 2. get totalQuestionAnswered
			let countedQuestionAnswers = {};
			let totalQuestions = '';

			if (activePanelId === 'about') {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
			} else {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(
					this,
					this.state.activePanelId,
					questionAnswers
				);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered in this section`;
			}

			this.setState({ totalQuestions });

			if (applicationStatus === 'submitted')
				return alert('Your application has already been submitted.');

			// 3. remove blank vals from questionAnswers
			let data = _.pickBy(
				{ ...this.state.questionAnswers, ...questionAnswers },
				_.identity
			);
			// 4. create dataObject
			let dataObj = { key: 'questionAnswers', data };
			// 5. update application
			this.updateApplication(dataObj);
		}
	}, 500);

	checkCurrentUser = (userId) =>{
		let {userState} = this.props;
		let [user] = userState;
		let {id}=user;
		return id === userId;
	};

	/**
	 * [Form Submit]
	 * @desc Submitting data access request
	 * @params  Object{questionAnswers}
	 */
	onFormSubmit = async (questionAnswers = {}) => {
		let invalidQuestions = DarValidation.getQuestionPanelInvalidQuestions(
			Winterfell,
			this.state.jsonSchema.questionSets,
			this.state.questionAnswers
		);
		let validationSectionMessages = DarValidation.buildInvalidSectionMessages(
			Winterfell,
			invalidQuestions
		);
		let inValidMessages = DarValidation.buildInvalidMessages(
			Winterfell,
			invalidQuestions
		);
		let errors = DarValidation.formatValidationObj(inValidMessages, [
			...this.state.jsonSchema.questionPanels,
		]);
		let isValid = Object.keys(errors).length ? false : true;
		if (this.state.applicationStatus === 'submitted')
			return alert('Your application has already been submitted.');

		if (isValid) {
			try {
				let { _id } = this.state;
				// 1. POST
				const response = await axios.post(
					`${baseURL}/api/v1/data-access-request/${_id}`,
					{}
				);
				const lastSaved = DarHelper.saveTime();
				this.setState({ lastSaved });
				let message = {
					type: 'success',
					message: 'Done! Your application was submitted successfully',
				};
				window.localStorage.setItem('alert', JSON.stringify(message));
				this.props.history.push({
					pathname: '/account',
					search: '?tab=dataaccessrequests',
				});
			} catch (err) {
				console.log(err);
			}
		} else {
			let activePage = _.get(_.keys({ ...errors }), 0);
			let activePanel = _.get(_.keys({ ...errors }[activePage]), 0);
			let validationMessages = validationSectionMessages;
			alert('Please resolve the following validation issues');
			this.updateNavigation(
				{ pageId: activePage, panelId: activePanel },
				validationMessages
			);
		}
	};

	updateApplication = async (obj = {}) => {
		try {
			// 1. Data = {key: jsonSchema || questionAnswers, data: { object of data}}
			let { key, data = {} } = obj;
			// 2. Id of data access request
			let { _id: id } = this.state;
			// 3. Set up body params
			let params = {
				[`${key}`]: JSON.stringify(data),
			};
			// 4. PATCH the data
			const response = await axios.patch(
				`${baseURL}/api/v1/data-access-request/${id}`,
				params
			);
			// 6. Get saved time
			const lastSaved = DarHelper.saveTime();
			// 5. Set state
			this.setState({ [`${key}`]: { ...data }, lastSaved });
		} catch (err) {
			console.log(err);
		}
	};

	onNextClick = () => {
		// 1. If in the about panel, we go to the next step.  Otherwise next panel.
		if (this.state.activePanelId === 'about') {
			// 2. Pass no completed bool value to go to next step without modifying completed status
			this.onNextStep();
			// 3. If we have reached the end of the about accordion, reset active accordion so all are closed
			if (this.state.activeAccordionCard >= 5) {
				this.setState({
					activeAccordionCard: -1,
				});
				// 4. Move to the next step
				this.onNextPanel();
			}
		} else {
			this.onNextPanel();
		}
	};

	onNextPanel = () => {
		// 1. Copy formpanels
		let formPanels = [...this.state.jsonSchema.formPanels];
		// 2. Get activeIdx
		let activeIdx = formPanels.findIndex(
			(p) => p.panelId === this.state.activePanelId
		);
		// 3. Increment idx
		let nextIdx = ++activeIdx;
		// 4. Get activePanel - make sure newIdx doesnt exceed panels length
		let { panelId, pageId } = formPanels[
			nextIdx > formPanels.length - 1 ? 0 : nextIdx
		];
		// 5. Update the navigationState
		this.updateNavigation({ panelId, pageId });
	};

	handleSelect = (key) => {
		this.setState({ key: key });
	};

	/**
	 * [UpdateNavigation]
	 * @desc - Update the navigation state sidebar
	 */
	updateNavigation = (newForm, validationErrors = {}) => {
		if (this.state.allowedNavigation) {
			// reset scroll to 0, 0
			window.scrollTo(0, 0);
			let panelId = '';
			// copy state pages
			const pages = [...this.state.jsonSchema.pages];
			// get the index of new form
			const newPageindex = pages.findIndex(
				(page) => page.pageId === newForm.pageId
			);
			// reset the current state of active to false for all pages
			const newFormState = [...this.state.jsonSchema.pages].map((item) => {
				return { ...item, active: false };
			});
			// update actual object model with propert of active true
			newFormState[newPageindex] = { ...pages[newPageindex], active: true };

			// get set the active panelId
			({ panelId } = newForm);
			if (_.isEmpty(panelId) || typeof panelId == 'undefined') {
				({ panelId } =
					[...this.state.jsonSchema.formPanels].find(
						(p) => p.pageId === newFormState[newPageindex].pageId
					) || '');
			}

			let countedQuestionAnswers = {};
			let totalQuestions = '';
			// if in the about panel, retrieve question answers count for entire application
			if (panelId === 'about') {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${
					countedQuestionAnswers.totalAnsweredQuestions || 0
				}/${countedQuestionAnswers.totalQuestions || 0}  questions answered`;
			} else {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(
					this,
					panelId
				);
				totalQuestions = `${
					countedQuestionAnswers.totalAnsweredQuestions || 0
				}/${
					countedQuestionAnswers.totalQuestions || 0
				}  questions answered in this section`;
			}
			this.setState({
				jsonSchema: { ...this.state.jsonSchema, pages: newFormState },
				activePanelId: panelId,
				isWideForm: panelId === 'about',
				totalQuestions: totalQuestions,
				validationErrors,
			});
		}
	};

	onClickSave = (e) => {
		e.preventDefault();
		const lastSaved = DarHelper.saveTime();
		this.setState({ lastSaved });
	};

	onQuestionClick = async (questionSetId = '', questionId = '') => {
		let questionSet, jsonSchema, questionAnswers, data;
		questionSet = DarHelper.findQuestionSet(questionSetId, {
			...this.state.jsonSchema,
		});

		if (!_.isEmpty(questionSet) && !_.isEmpty(questionId)) {
			let {
				input: { action },
			} = DarHelper.findQuestion(questionId, questionSet);
			switch (action) {
				case 'addApplicant':
					let duplicateQuestionSet = DarHelper.questionSetToDuplicate(
						questionSetId,
						{ ...this.state.jsonSchema }
					);
					jsonSchema = DarHelper.insertSchemaUpdates(
						questionSetId,
						duplicateQuestionSet,
						{ ...this.state.jsonSchema }
					);
					data = { key: 'jsonSchema', data: jsonSchema };
					// post to API to do of new jsonSchema
					await this.updateApplication(data);
					break;
				case 'removeApplicant':
					jsonSchema = DarHelper.removeQuestionReferences(
						questionSetId,
						questionId,
						{ ...this.state.jsonSchema }
					);
					questionAnswers = DarHelper.removeQuestionAnswers(questionId, {
						...this.state.questionAnswers,
					});
					// post to API of new jsonSchema
					await this.updateApplication({ key: 'jsonSchema', data: jsonSchema });
					await this.updateApplication({
						key: 'questionAnswers',
						data: questionAnswers,
					});
					break;
				default:
					console.log(questionSetId);
					break;
			}
		}
	};

	onHandleDataSetChange = async (e) => {
		// 1. Deconstruct current state
		let { aboutApplication, allowedNavigation, topicContext } = this.state;

		// 2. Update 'about application' state with selected datasets
		aboutApplication.selectedDatasets = e;

		// 3. If no datasets are passed, set invalid and incomplete step, and update message context
		if (_.isEmpty(e)) {
			let emptyTopicContext = DarHelper.createTopicContext();
			aboutApplication.completedDatasetSelection = false;
			allowedNavigation = false;
			topicContext = {
				...topicContext,
				...emptyTopicContext,
			};
		} else {
			let updatedTopicContext = DarHelper.createTopicContext(
				aboutApplication.selectedDatasets
			);
			allowedNavigation = true;
			topicContext = {
				...topicContext,
				...updatedTopicContext,
			};
			// 4. Create data object to save
			let dataObj = { key: 'aboutApplication', data: aboutApplication };
			// 5. Update application
			await this.updateApplication(dataObj);
		}

		// 6. Update state to reflect change
		this.setState({
			allowedNavigation,
			aboutApplication,
			topicContext,
		});
	};

	onHandleProjectNameBlur = () => {
		// 1. Deconstruct current state
		let { aboutApplication, projectNameValid, allowedNavigation } = this.state;

		// 2. Check if valid project name
		if(_.isEmpty(aboutApplication.projectName.trim())) {
			projectNameValid = false;
			allowedNavigation = false;
		} else {
			projectNameValid = true;
			allowedNavigation = true;
			// 3. Create data object to save
			let dataObj = { key: 'aboutApplication', data: aboutApplication };
			// 4. Update application
			this.updateApplication(dataObj);
		}

		// 5. Update state to reflect change
		this.setState({
			allowedNavigation,
			projectNameValid
		});
	}

	onHandleProjectNameChange = (projectName) => {
		// 1. Deconstruct current state
		let { aboutApplication, projectNameValid, allowedNavigation } = this.state;

		// 2. Update 'about application' state with project name
		aboutApplication.projectName = projectName;

		// 3. Check if valid project name passed
		if(_.isEmpty(projectName.trim())) {
			projectNameValid = false;
			allowedNavigation = false;
		} else {
			projectNameValid = true;
			allowedNavigation = true;
		}

		// 4. Update state to reflect change
		this.setState({
			allowedNavigation,
			projectNameValid,
			aboutApplication
		});
	}


	onNextStep = async (completed) => {
		// 1. Deconstruct current state
		let { aboutApplication, activeAccordionCard } = this.state;
		// 2. If a completed flag has been passed, update step during navigation
		if (!_.isUndefined(completed)) {
			switch (activeAccordionCard) {
				case 0:
					aboutApplication.completedDatasetSelection = completed;
					break;
				case 1:
					// Do nothing, valid state for project name step handled by existence of text
					break;
				case 2:
					aboutApplication.completedReadAdvice = completed;
					break;
				case 3:
					aboutApplication.completedCommunicateAdvice = completed;
					break;
				case 4:
					aboutApplication.completedApprovalsAdvice = completed;
					break;
				case 5:
					aboutApplication.completedSubmitAdvice = completed;
					break;
				case 6:
					aboutApplication.completedInviteCollaborators = completed;
					break;
				default:
					console.error('Invalid step passed');
					break;
			}
		}
		// 3. Update application
		let dataObj = { key: 'aboutApplication', data: aboutApplication };
		await this.updateApplication(dataObj);

		// 4. Set new state
		this.setState({
			activeAccordionCard: ++activeAccordionCard,
			aboutApplication,
		});
	};

	onCustodianAction = (e) => {
		let {
			target: { value },
		} = e;

		this.toggleActionModal(value);
	};

	toggleCard = (e, eventKey) => {
		e.preventDefault();
		// 1. Deconstruct current state
		let { aboutApplication, activeAccordionCard } = this.state;
		if (activeAccordionCard === eventKey) {
			eventKey = -1;
		}
		// 2. Set new state
		this.setState({
			activeAccordionCard: eventKey,
			aboutApplication,
		});
	};

	toggleDrawer = () => {
		this.setState((prevState) => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
		});
	};

	toggleModal = (showEnquiry = false, modalContext) => {
		this.setState((prevState) => {
			return {
				showModal: !prevState.showModal,
				context: modalContext,
			};
		});

		if (showEnquiry) {
			this.toggleDrawer();
		}
	};

	toggleMrcModal = () => {
		this.setState((prevState) => {
			return { showMrcModal: !prevState.showMrcModal };
		});
	};

	toggleActionModal = (type = '') => {
		let actionModalConfig = {};
		// 1. get basic modal config
		if (!_.isEmpty(type)) actionModalConfig = DarHelper.configActionModal(type);
		// 2. set state for hide/show/config modal
		this.setState((prevState) => {
			return {
				showActionModal: !prevState.showActionModal,
				actionModalConfig,
			};
		});
	};

	toggleContributorModal = () => {
		this.setState((prevState) => {
			return { 
				showContributorModal: !prevState.showContributorModal 
			};
		});
	};

	updateContributors = (contributors) => {
		let updatedAuthorIds = [...contributors].map(user => user.id);
		this.setState({ updatedAuthorIds });
	}

	submitContributors = async () => {
		debugger;
		let { updatedAuthorIds: authorIds, _id } = this.state;
		const body = {
			authorIds
		};
		// 1. Update action status
		await axios.put(
			`${baseURL}/api/v1/data-access-request/${_id}`,
			body
		);
		this.setState({ authorIds });
	}
	

	updateApplicationStatus = async (action = {}) => {
		let { type, statusDesc } = action;
		switch (type) {
			case 'CONFIRMAPPROVALCONDITIONS':
			case 'CONFIRMREJECTION':
			case 'CONFIRMAPPROVAL':
				let { _id } = this.state;
				const body = {
					applicationStatus: this.applicationState[type],
					applicationStatusDesc: statusDesc,
				};
				// 1. Update action status
				const response = await axios.put(
					`${baseURL}/api/v1/data-access-request/${_id}`,
					body
				);
				// 2. set alert object for screen
				let alert = {
					publisher: this.state.publisher || '',
					nav: `dataaccessrequests&team=${this.state.publisher}`,
					tab: this.tabState[type],
					message: `You have ${this.tabState[type]} the data access request for ${this.state.publisher}`,
				};
				// 3. hide screen modal for approve, reject, approve with comments
				this.toggleActionModal();
				// 4. redirect with Publisher name, Status: reject, approved, key of tab: presubmission, inreview, approved, rejected
				this.props.history.push({
					pathname: `/account`,
					search: '?tab=dataaccessrequests',
					state: { alert },
				});
				break;
			default:
				this.toggleActionModal();
		}
	};

	async getRole(roles) { 
		let thisteam = [];

		thisteam = this.props.userState[0].teams.filter(team => team.name === this.state.datasets[0].datasetfields.publisher);

		this.setState({
			roles : thisteam[0].roles
		});
	}

	render() {
		const {
			lastSaved,
			searchString,
			totalQuestions,
			isLoading,
			validationErrors,
			activeGuidance,
			datasets,
			showDrawer,
			showModal,
			showMrcModal,
			showActionModal,
			showContributorModal,
			isWideForm,
			activeAccordionCard,
			allowedNavigation,
			projectNameValid,
			projectId,
			applicationStatus,
			aboutApplication: {
				projectName = '',
				selectedDatasets,
				completedDatasetSelection,
				completedReadAdvice,
				completedCommunicateAdvice,
				completedApprovalsAdvice,
				completedSubmitAdvice,
				completedInviteCollaborators,
			},
			context,
			readOnly,
			userType,
			actionModalConfig,
			roles
		} = this.state;
		const { userState, location } = this.props;

		const aboutForm = (
			<div className='aboutAccordion'>
				<Accordion
					defaultActiveKey='0'
					activeKey={activeAccordionCard.toString()}
				>
					<Card className={activeAccordionCard === 0 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 0,
								allowedNavigation
							)}
							eventKey='0'
							onClick={(e) => this.toggleCard(e, 0)}
						>
							{completedDatasetSelection ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									1
								</div>
							)}
							Select the datasets you need
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='0'>
							<Card.Body className='gray800-14'>
								<div className='margin-bottom-16'>
									If you’re not sure,{' '}
									<Link
										id='messageLink'
										className={
											allowedNavigation && userType.toUpperCase() !== 'CUSTODIAN'
												? ''
												: 'disabled'
										}
										onClick={(e) => this.toggleDrawer()}
									>
										send a message to the data custodian
									</Link>{' '}
									to clarify. The datasets you select may impact the questions
									being asked in this application form. You cannot change this
									later.
								</div>
								<div>
									<span>Datasets</span>
									<div className='form-group'>
										<TypeaheadDataset
											selectedDatasets={selectedDatasets}
											onHandleDataSetChange={this.onHandleDataSetChange}
											readOnly={readOnly}
										/>
									</div>
									{_.isEmpty(selectedDatasets) ? (
										<div className='errorMessages'>
											You must select at least one dataset
										</div>
									) : null}
									<div className='panConfirmDatasets'>
										{userType.toUpperCase() === 'APPLICANT' ? (
											<button
												type='input'
												className={`button-primary ${
													allowedNavigation ? '' : 'disabled'
												}`}
												disabled={!allowedNavigation}
												onClick={() => {
													this.onNextStep(allowedNavigation);
												}}
											>
												Confirm
											</button>
										) : (
											''
										)}
									</div>
								</div>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card className={activeAccordionCard === 1 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 1,
								allowedNavigation
							)}
							eventKey='1'
							onClick={(e) => this.toggleCard(e, 1)}
						>
							{projectNameValid && !_.isEmpty(projectName.trim()) ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									2
								</div>
							)}
							Name your project
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='1'>
							<Card.Body className='gray800-14'>
								<div className='margin-bottom-16'>
									It is important to create a project title for yourself and your team.  You can edit this later.
								</div>
								<div>
									<span>Project title</span>
									<div className='form-group'>
										<input 
											className={`form-control ${!projectNameValid && _.isEmpty(projectName) ? 'emptyFormInput' : ''}`} 
											name="projectName"
											onBlur={() => this.onHandleProjectNameBlur()}
											onChange={(e) => this.onHandleProjectNameChange(e.target.value)}
											value={projectName}
											disabled={readOnly}
										/>
									</div>
									{!projectNameValid && _.isEmpty(projectName) ? (
										<div className='errorMessages'>
											This cannot be empty
										</div>
									) : null}
								</div>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card className={activeAccordionCard === 2 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 2,
								allowedNavigation
							)}
							eventKey='2'
							onClick={(e) => this.toggleCard(e, 2)}
						>
							{completedReadAdvice ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									3
								</div>
							)}
							Read the advice from the data custodian
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='2'>
							<Card.Body className='gray800-14'>
								<Fragment>
									<div className='margin-bottom-16'>
										If you haven’t already, please make sure you have read the
										advice provided by the data custodian on how to request
										access to their datasets.
									</div>
									<div className='dar-form-check-group'>
										<input
											type='checkbox'
											id='chkReadAdvice'
											checked={completedReadAdvice}
											className='dar-form-check'
											disabled={readOnly}
											onChange={(e) => {
												this.onNextStep(e.target.checked);
											}}
										/>
										<span className='dar-form-check-label'>
											I have read{' '}
											<Link
												id='howToRequestAccessLink'
												className={
													allowedNavigation && userType.toUpperCase() !== 'CUSTODIAN'
														? ''
														: 'disabled'
												}
												onClick={(e) =>
													this.toggleModal(false, {
														...this.state.context,
														showActionButtons: false,
													})
												}
											>
												how to request access
											</Link>
										</span>
									</div>
								</Fragment>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card className={activeAccordionCard === 3 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 3,
								allowedNavigation
							)}
							eventKey='3'
							onClick={(e) => this.toggleCard(e, 3)}
						>
							{completedCommunicateAdvice ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									4
								</div>
							)}
							Communicate with the data custodian
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='3'>
							<Card.Body className='gray800-14'>
								<Fragment>
									<div className='margin-bottom-16'>
										The earlier you get in touch, the better. A lot of projects
										are not eligible for data access, so it’s important you
										clarify with the custodian whether they have the data you
										need, and whether you have a chance of getting access. If
										you've not done so yet, we recommend sending a message with
										a brief description of your project and the data you are
										interested in.
									</div>
									<div className='dar-form-check-group'>
										{userType.toUpperCase() !== 'CUSTODIAN' ? (
											<button
												className='button-secondary'
												type='button'
												onClick={(e) => this.toggleDrawer()}
											>
												Send message
											</button>
										) : (
											''
										)}
										<input
											type='checkbox'
											id='chkCommunicateAdvice'
											checked={completedCommunicateAdvice}
											className='dar-form-check'
											disabled={readOnly ? true : false}
											onChange={(e) => {
												this.onNextStep(e.target.checked);
											}}
										/>
										<span className='dar-form-check-label'>
											I have completed this step
										</span>
									</div>
								</Fragment>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card className={activeAccordionCard === 4 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 4,
								allowedNavigation
							)}
							eventKey='4'
							onClick={(e) => this.toggleCard(e, 4)}
						>
							{completedApprovalsAdvice ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									5
								</div>
							)}
							Check what approvals you might need
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='4'>
							<Card.Body className='gray800-14'>
								<Fragment>
									<div className='margin-bottom-16'>
										The MRC Health Data Access tookit aims to help you
										understand what approvals might be necessary for your
										research. Many custodians request these approvals are in
										place before you start your application process.
									</div>
									<div className='dar-form-check-group'>
										<button
											className='button-secondary'
											type='button'
											onClick={(e) => this.toggleMrcModal()}
										>
											MRC Health Data Access toolkit
										</button>
										<input
											type='checkbox'
											id='chkApprovalAdvice'
											checked={completedApprovalsAdvice}
											className='dar-form-check'
											disabled={readOnly ? true : false}
											onChange={(e) => {
												this.onNextStep(e.target.checked);
											}}
										/>
										<span className='dar-form-check-label'>
											I have completed this step
										</span>
									</div>
								</Fragment>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card className={activeAccordionCard === 5 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 5,
								allowedNavigation
							)}
							eventKey='5'
							onClick={(e) => this.toggleCard(e, 5)}
						>
							{completedSubmitAdvice ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									6
								</div>
							)}
							Understand what happens after you submit the application
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='5'>
							<Card.Body className='gray800-14'>
								<Fragment>
									<div className='margin-bottom-16'>
										After you have completed the form, you can submit the
										application.
									</div>
									<div className='margin-bottom-16'>
										<ul>
											<li>
												Make sure to double-check everything before submitting
											</li>
											<li>
												You will NOT be able to edit your responses via the
												Gateway after submission (for now)
											</li>
											<li>
												If you do need to make any amendments, get in touch with
												the data custodian
											</li>
											<li>
												Both you and the data custodian will receive an email
												with a copy of the information submitted using this
												form.
											</li>
										</ul>
									</div>
									<div className='dar-form-check-group'>
										<input
											type='checkbox'
											id='chkSubmitAdvice'
											checked={completedSubmitAdvice}
											className='dar-form-check'
											disabled={readOnly ? true : false}
											onChange={(e) => {
												this.onNextStep(e.target.checked);
											}}
										/>
										<span className='dar-form-check-label'>
											I have completed this step
										</span>
									</div>
								</Fragment>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
					<Card className={activeAccordionCard === 6 ? 'activeCard' : ''}>
						<Accordion.Toggle
							as={Card.Header}
							className={DarHelper.calcAccordionClasses(
								activeAccordionCard === 6,
								allowedNavigation
							)}
							eventKey='6'
							onClick={(e) => this.toggleCard(e, 6)}
						>
							{completedInviteCollaborators ? (
								<div className='stepNumber completed'>
									<SVGIcon
										name='check'
										width={24}
										height={24}
										fill={'#ffffff'}
									/>
								</div>
							) : (
								<div
									className={`stepNumber ${
										activeAccordionCard === 0 ? 'active' : ''
									}`}
								>
									7
								</div>
							)}
							Invite contributors
						</Accordion.Toggle>
						<Accordion.Collapse eventKey='6'>
							<Card.Body className='gray800-14'>
								<Fragment>
									<div className='margin-bottom-16'>
										Applications are often a team effort, so you can add others
										to help. Contributors can exchange private notes, make
										edits, message the data custodian, invite others and submit
										the application. If they’re named in the application, you
										can fill in some of their details automatically. You can do
										this later too.
									</div>
									<div className='dar-form-check-group'>
										{userType.toUpperCase() !== 'CUSTODIAN' ? (
											<button
												className='button-secondary'
												type='button'
												onClick={(e) => this.toggleContributorModal()}
											>
												Add contributors
											</button>
										) : (
											''
										)}
										<input
											type='checkbox'
											id='chkInviteContributors'
											checked={completedInviteCollaborators}
											className='dar-form-check'
											disabled={readOnly}
											onChange={(e) => {
												this.onNextStep(e.target.checked);
											}}
										/>
										<span className='dar-form-check-label'>
											I have completed this step
										</span>
									</div>
								</Fragment>
							</Card.Body>
						</Accordion.Collapse>
					</Card>
				</Accordion>
			</div>
		);

		Winterfell.addInputType('typeaheadCustom', TypeaheadCustom); 
		Winterfell.addInputType('datePickerCustom', DatePickerCustom);
		Winterfell.addInputType('typeaheadUser', TypeaheadUser);

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
					searchString={searchString}
					doSearchMethod={(e) => {
						SearchBarHelperUtil.doSearch(e, this);
					}}
					doUpdateSearchString={(e) => {
						SearchBarHelperUtil.updateSearchString(e, this);
					}}
					doToggleDrawer={(e) => this.toggleDrawer()}
					userState={userState}
				/>
				<Row className='banner'>
					<Col sm={12} md={8} className='banner-left'>
						<span className='white-20-semibold mr-5'>Data Access Request</span>
						{this.state.allowsMultipleDatasets ? (
							<span className='white-16-semibold pr-5'>
								{datasets[0].datasetfields.publisher}
							</span>
						) : (
							<span className='white-16-semibold pr-5'>
								{datasets[0].name} | {datasets[0].datasetfields.publisher}
							</span>
						)}
					</Col>
					<Col sm={12} md={4} className='banner-right'>
						<span className='white-14-semibold'>
							{DarHelper.getSavedAgo(lastSaved)}
						</span>
						{
							<a
								className={`linkButton white-14-semibold ml-2 ${
									allowedNavigation ? '' : 'disabled'
								}`}
								onClick={this.onClickSave}
								href='!#'
							>
								Save now
							</a>
						}
					</Col>
				</Row>

				<div id='darContainer' className='flex-form'>
					<div id='darLeftCol' className='scrollable-sticky-column'>
						{[...this.state.jsonSchema.pages].map((item, idx) => (
							<div
								key={`navItem-${idx}`}
								className={`${item.active ? 'active-border' : ''}`}
							>
								<div>
									<h1
										className={`black-16 ${
											item.active ? 'section-header-active' : 'section-header'
										} ${this.state.allowedNavigation ? '' : 'disabled'}`}
										onClick={(e) => this.updateNavigation(item)}
									>
										{item.title}
									</h1>
									{item.active && (
										<ul className='list-unstyled section-subheader'>
											<NavItem
												parentForm={item}
												questionPanels={this.state.jsonSchema.questionPanels}
												onFormSwitchPanel={this.updateNavigation}
												activePanelId={this.state.activePanelId}
												enabled={allowedNavigation}
											/>
										</ul>
									)}
								</div>
							</div>
						))}
					</div>
					<div id='darCenterCol' className={isWideForm ? 'extended' : ''}>
						<div id='darDropdownNav'>
							<NavDropdown
								options={{
									...this.state.jsonSchema,
									allowsMultipleDatasets: this.state.allowsMultipleDatasets,
								}}
								onFormSwitchPanel={this.updateNavigation}
								enabled={allowedNavigation}
							/>
						</div>
						<div style={{ backgroundColor: '#ffffff' }} className='dar__header'>
							{this.state.jsonSchema.pages
								? [...this.state.jsonSchema.pages].map((item, idx) =>
										item.active ? (
											<Fragment key={`pageContent-${idx}`}>
												<p className='black-20-semibold mb-0'>
													{item.active ? item.title : ''}
												</p>
												<ReactMarkdown
													className='gray800-14'
													source={item.description}
												/>
											</Fragment>
										) : (
											''
										)
								  )
								: ''}
						</div>
						<div
							className={`dar__questions gray800-14 ${
								this.state.activePanelId === 'about' ? 'pad-bottom-0' : ''
							}`}
							style={{ backgroundColor: '#ffffff' }}
						>
							{this.state.activePanelId === 'about' ? (
								aboutForm
							) : (
								<Winterfell
									schema={this.state.jsonSchema}
									questionAnswers={this.state.questionAnswers}
									panelId={this.state.activePanelId}
									disableSubmit={true}
									readOnly={readOnly}
									validationErrors={validationErrors}
									onQuestionFocus={this.onQuestionFocus}
									onQuestionClick={this.onQuestionClick}
									onUpdate={this.onFormUpdate}
									onSubmit={this.onFormSubmit}
								/>
							)}
						</div>
					</div>
					{isWideForm ? null : (
						<div id='darRightCol' className='scrollable-sticky-column'>
							<Tabs
								className='dar-tabsBackground gray700-14'
								activeKey={this.state.key}
								onSelect={this.handleSelect}
							>
								<Tab eventKey='guidance' title='Guidance'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 text-center'>
											<span>
												{activeGuidance
													? activeGuidance
													: 'Active guidance for questions'}
												.
											</span>
										</Col>
									</div>
								</Tab>
								<Tab eventKey='answers' title='Answers'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 mt-2'>
											<span>
												Re-use answers from your previous applications
											</span>
											<br /> <br />
											<span className='comingSoonBadge'> Coming soon </span>
										</Col>
									</div>
								</Tab>
								<Tab eventKey='notes' title='Notes'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 mt-2'>
											<span>Data custodians cannot see your notes. </span>
											<br /> <br />
											<span>
												You can use notes to capture your thoughts or
												communicate with any other applicants you invite to
												collaborate.
											</span>
											<br /> <br />
											<span className='comingSoonBadge'> Coming soon </span>
										</Col>
									</div>
								</Tab>
								<Tab eventKey='messages' title='Messages'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 mt-2'>
											<span>
												Both data custodian and applicants can see messages
											</span>
											<br /> <br />
											<span>
												Use messages to seek guidance or clarify questions with
												the data custodian. You can send messages before or
												after the application is submitted. You will be notified
												of every new message, and so will the data custodian.
											</span>
											<br /> <br />
											<span className='comingSoonBadge'> Coming soon </span>
										</Col>
									</div>
								</Tab>
							</Tabs>
						</div>
					)}
				</div>

				<div className='action-bar'>
					<div className='action-bar--questions'>
						{ applicationStatus === 'inProgress' ? '' 
						: 
						<SLA 
							classProperty={DarHelper.darStatusColours[applicationStatus]} 
							text={DarHelper.darSLAText[applicationStatus]}/> 
						}
						<div className='action-bar-status'>{totalQuestions} &nbsp;|&nbsp; {projectId}</div>
					</div>
					<div className='action-bar-actions'>

						{userType.toUpperCase() === 'APPLICANT' ? (
							<ApplicantActionButtons 
								allowedNavigation={allowedNavigation}
								onNextClick={this.onNextClick}
								onFormSubmit={this.onFormSubmit}
								onShowContributorModal={this.toggleContributorModal}
								showSubmit={this.state.showSubmit}
							/>
						) : (
							<CustodianActionButtons
								allowedNavigation={allowedNavigation}
								onActionClick={this.onCustodianAction}
								onNextClick={this.onNextClick}
								applicationStatus={applicationStatus}
								roles={roles}
							/>
						)}
					</div>
				</div>

				<SideDrawer open={showDrawer} closed={(e) => this.toggleDrawer()}>
					<UserMessages
						userState={userState[0]}
						closed={(e) => this.toggleDrawer()}
						toggleModal={this.toggleModal}
						drawerIsOpen={this.state.showDrawer}
						topicContext={this.state.topicContext}
					/>
				</SideDrawer>

				<DataSetModal
					open={showModal}
					context={context}
					closed={this.toggleModal}
					userState={userState[0]}
				/>

				<ActionModal
					open={showActionModal}
					context={actionModalConfig}
					updateApplicationStatus={this.updateApplicationStatus}
					close={this.toggleActionModal}
				/>

				<ContributorModal
					open={showContributorModal}
					close={this.toggleContributorModal}
					mainApplicant={this.state.mainApplicant}
					handleOnSaveChanges={this.submitContributors}
				>
					<TypeaheadMultiUser 
						onHandleContributorChange={this.updateContributors}
						selectedContributors={this.state.authorIds} 
						currentUserId={this.state.userId} 
						readOnly={this.state.readOnly}
				/>
				</ContributorModal>

				<Modal
					show={showMrcModal}
					onHide={(e) => this.toggleMrcModal()}
					size='lg'
					aria-labelledby='contained-modal-title-vcenter'
					centered
					className='darModal'
				>
					<iframe
						src='https://hda-toolkit.org/story_html5.html'
						className='darIframe'
					>
						{' '}
					</iframe>
				</Modal>
			</div>
		);
	}
}

export default DataAccessRequest;
