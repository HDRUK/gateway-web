import React, { Component, Fragment } from 'react';
import { History } from 'react-router';
import { Container, Row, Col, Modal, Tabs, Tab, Alert, Tooltip } from 'react-bootstrap';
import Winterfell from 'winterfell';
import _ from 'lodash';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import TypeaheadMultiUser from './components/TypeaheadUser/TypeaheadMultiUser';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import NavItem from './components/NavItem/NavItem';
import NavDropdown from './components/NavDropdown/NavDropdown';
import WorkflowReviewStepsModal from '../commonComponents/workflowReviewStepsModal/WorkflowReviewStepsModal';
import ActivePhaseModal from '../commonComponents/workflowActivePhase/ActivePhaseModal';
import WorkflowReviewDecisionModal from '../commonComponents/workflowReviewDecision/WorkflowReviewDecisionModal';
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
import SVGIcon from '../../images/SVGIcon';
import moment from 'moment';
import ApplicantActionButtons from './components/ApplicantActionButtons/ApplicantActionButtons';
import CustodianActionButtons from './components/CustodianActionButtons/CustodianActionButtons';
import ActionModal from './components/ActionModal/ActionModal';
import ContributorModal from './components/ContributorModal/ContributorModal';
import AssignWorkflowModal from './components/AssignWorkflowModal/AssignWorkflowModal';
import SLA from '../commonComponents/sla/SLA';
import AboutApplication from './components/AboutApplication/AboutApplication'
import Uploads from './components/Uploads/Uploads';

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
			workflow: {},
			activeWorkflow: {},
			files: [],
			initialFilesLoad: true,
			hasRecommended: false,
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
						publisher: ''
					}
				}
			],
			publisher: '',
			mainApplicant: '',
			showDrawer: false,
			showModal: false,
			showMrcModal: false,
			showActionModal: false,
			showWorkflowReviewModal: false,
			showWorkflowReviewDecisionModal: false,
			workflowReviewDecisionType: false,
			showActivePhaseModal: false,
			showContributorModal: false,
			showAssignWorkflowModal: false,
			readOnly: false,
			userType: '',
			isWideForm: false,
			allowsMultipleDatasets: false,
			activeAccordionCard: 0,
			allowedNavigation: true,
			projectNameValid: true,
			ncsValid: true,
			topicContext: {},
			authorIds: [],
			projectId: '',
			aboutApplication: {
				projectName: '',
				isNationalCoreStudies: false,
				nationalCoreStudiesProjectId: '',
				selectedDatasets: [],
				completedDatasetSelection: false,
				completedReadAdvice: false,
				completedCommunicateAdvice: false,
				completedApprovalsAdvice: false,
				completedSubmitAdvice: false,
				completedInviteCollaborators: false
			},
			context: {},
			actionModalConfig: {},
			workflows: [],
			workflowAssigned: false,
			roles: [],
			nationalCoreStudiesProjects: []
		};

		this.onChangeDebounced = _.debounce(this.onChangeDebounced, 300);
	}

	applicationState = {
		CONFIRMAPPROVALCONDITIONS: 'approved with conditions',
		CONFIRMREJECTION: 'rejected',
		CONFIRMAPPROVAL: 'approved'
	};

	tabState = {
		CONFIRMAPPROVALCONDITIONS: 'approved',
		CONFIRMREJECTION: 'rejected',
		CONFIRMAPPROVAL: 'approved'
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
			let countedQuestionAnswers = {},
				totalQuestions = '';

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
					totalQuestions = `Application ${applicationStatus} on ${moment(updatedAt).format('DD MMM YYYY HH:mm')}`;
				}
			}

			// Update state to display question answer count
			this.setState({
				totalQuestions
			});
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		} finally {
			this.setState({
				roles: this.getUserRoles()
			});
		}
	}

	loadMultipleDatasetMode = async (datasetIds) => {
		try {
			// 1. Make API call to find and return the json schema for this dataset's application along with any existing answers and publisher info
			let response = await axios.get(`${baseURL}/api/v1/data-access-request/datasets/${datasetIds}`);
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
						projectId,
						workflow,
						files
					}
				}
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
				projectId,
				workflow,
				files
			});
		} catch (error) {
			this.setState({ isLoading: false });
			console.error(error);
		}
	};

	loadSingleDatasetMode = async (datasetId) => {
		try {
			// 1. Make API call to find and return the json schema for this dataset's application along with any existing answers
			let response = await axios.get(`${baseURL}/api/v1/data-access-request/dataset/${datasetId}`);
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
						projectId,
						workflow,
						files
					}
				}
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
				projectId,
				workflow,
				files
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
			let response = await axios.get(`${baseURL}/api/v1/data-access-request/${accessId}`);
			// 2. Destructure backend response for this context containing details of DAR including question set and current progress
			let {
				data: {
					data: {
						jsonSchema,
						questionAnswers,
						_id,
						hasRecommended,
						applicationStatus,
						aboutApplication = {},
						datasets,
						readOnly,
						userType,
						mainApplicant,
						userId,
						authorIds,
						projectId,
						inReviewMode,
						reviewSections,
						workflow,
						files
					}
				}
			} = response;
			// 3. Set up the DAR
			this.setScreenData({
				jsonSchema,
				questionAnswers,
				_id,
				hasRecommended,
				applicationStatus,
				aboutApplication,
				datasets,
				readOnly,
				userType,
				mainApplicant,
				userId,
				authorIds,
				projectId,
				inReviewMode,
				reviewSections,
				workflow,
				files
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
			hasRecommended,
			applicationStatus,
			aboutApplication,
			datasets,
			readOnly = false,
			userType = 'APPLICANT',
			mainApplicant,
			userId,
			authorIds,
			projectId,
			inReviewMode = false,
			reviewSections = [],
			workflow,
			files
		} = context;
		let {
			datasetfields: { publisher }
		} = datasets[0];
		let { firstname, lastname } = mainApplicant;
		let showSubmit = false;

		let publisherId = '',
			workflowEnabled = false;
		if (datasets[0].publisher) {
			({ _id: publisherId, workflowEnabled } = datasets[0].publisher);
		}

		// 2. If about application is empty, this is a new data access request so set up state based on passed context
		if (_.isEmpty(aboutApplication)) {
			aboutApplication.selectedDatasets = datasets.map((dataset) => {
				let { _id: dataset_id, publisher: publisherObj, datasetid, name, description } = dataset;
				let {
					datasetfields: { abstract, contactPoint }
				} = dataset;
				return {
					_id: dataset_id,
					datasetId: datasetid,
					name,
					description,
					abstract,
					publisher,
					contactPoint,
					publisherObj
				};
			});
		} else {
			let { isNationalCoreStudies = false } = aboutApplication;
			if (isNationalCoreStudies) {
				// 3. Fetch NCS projects list
				this.getNationalCoreStudiesProjects();
			}
		}

		// 4. Set messaging and modal context
		let topicContext = DarHelper.createTopicContext(aboutApplication.selectedDatasets);
		let modalContext = DarHelper.createModalContext(aboutApplication.selectedDatasets);
		let allowsMultipleDatasets = topicContext.requiresModal || false;

		// 5. If multiple datasets are allowed, append 'about this application' section
		if (allowsMultipleDatasets) {
			// Append 'about' panel and nav item
			jsonSchema.pages[0].active = false;
			jsonSchema.pages.unshift(DarHelper.staticContent.aboutPageNav);
			jsonSchema.pages.push(DarHelper.staticContent.filesNav);
			// Add form panel
			jsonSchema.formPanels.unshift(DarHelper.staticContent.aboutPanel);
			jsonSchema.formPanels.push(DarHelper.staticContent.filesPanel);
		}

		// 6. Get the first active panel
		let {
			formPanels: [initialPanel, ...rest]
		} = jsonSchema;

		// 7. Append review sections to jsonSchema if in review mode
		if (inReviewMode) {
			jsonSchema.pages = jsonSchema.pages.map((page) => {
				let inReview = reviewSections.includes(page.pageId.toLowerCase()) || page.pageId === 'about' || page.pageId === 'files';
				return { ...page, inReview };
			});
		}

		// 8. Hide show submit application
		if (applicationStatus === 'inProgress') {
			showSubmit = true;
		}

		// 9. Set state
		this.setState({
			jsonSchema: { ...jsonSchema, ...classSchema },
			datasets,
			questionAnswers,
			_id,
			hasRecommended,
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
			mainApplicant: `${firstname} ${lastname}${this.checkCurrentUser(userId) ? ' (you)' : ''}`,
			authorIds,
			projectId,
			showSubmit,
			publisherId,
			workflowEnabled,
			inReviewMode,
			workflow,
			workflowAssigned: !_.isEmpty(workflow) ? true : false,
			files
		});
	};

	onQuestionFocus(questionId = '') {
		let questions;
		if (!_.isEmpty(questionId)) {
			let {
				jsonSchema: { questionSets }
			} = this.state;
			// 1. get active question set
			({ questions } = [...questionSets].find((q) => q.questionSetId === this.state.activePanelId) || []);
			if (!_.isEmpty(questions)) {
				// 2. loop over and find active question
				let activeQuestion = DarHelper.getActiveQuestion([...questions], questionId);
				if (!_.isEmpty(activeQuestion)) this.setState({ activeGuidance: activeQuestion.guidance });
			}
		}
	}

	/**
	 * [onFormUpdate]
	 * @param {obj: questionAnswers}
	 * @desc Callback from Winterfell sets totalQuestionsAnswered + saveTime
	 */
	onFormUpdate = (id = '', questionAnswers = {}) => {
		if (!_.isEmpty(id) && !_.isEmpty(questionAnswers)) {
			let { applicationStatus, lookup, activePanelId } = this.state;
			// 1. check for auto complete
			if (typeof id === 'string') {
				let [questionId, uniqueId] = id.split('_');
				let qId = questionId.toLowerCase();
				let lookupAutoComplete = [...lookup].includes(qId);
				if (lookupAutoComplete)
					questionAnswers = DarHelper.autoComplete(qId, uniqueId, {
						...questionAnswers
					});
			}
			// 2. get totalQuestionAnswered
			let countedQuestionAnswers = {};
			let totalQuestions = '';

			// 3. total questions answered
			if (activePanelId === 'about' || activePanelId === 'files') {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
			} else {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this, this.state.activePanelId, questionAnswers);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered in this section`;
			}

			// 4. set totalQuestionAnswered
			this.setState({ totalQuestions });

			if (applicationStatus === 'submitted') return alert('Your application has already been submitted.');

			// 5. remove blank vals from questionAnswers
			let data = _.pickBy({ ...this.state.questionAnswers, ...questionAnswers }, _.identity);
			const lastSaved = DarHelper.saveTime();
			// 6. create dataObject
			let dataObj = { key: 'questionAnswers', data };
			// 7. Immediately update the state
			this.setState({ [`${dataObj.key}`]: { ...dataObj.data }, lastSaved });
			// 8. Execute the debounced onChange method API CALL
			this.onChangeDebounced(dataObj);
		}
	};

	onChangeDebounced = (obj = {}) => {
		try {
			let { _id: id } = this.state;
			// 1. deconstruct
			let { key, data = {} } = obj;
			// 2. set body params
			let params = {
				[`${key}`]: JSON.stringify(data)
			};
			// 3. API Patch call
			axios.patch(`${baseURL}/api/v1/data-access-request/${id}`, params);
		} catch (error) {
			console.log(`API PUT ERROR ${error}`);
		}
	};

	checkCurrentUser = (userId) => {
		let { userState } = this.props;
		let [user] = userState;
		let { id } = user;
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
		let validationSectionMessages = DarValidation.buildInvalidSectionMessages(Winterfell, invalidQuestions);
		let inValidMessages = DarValidation.buildInvalidMessages(Winterfell, invalidQuestions);
		let errors = DarValidation.formatValidationObj(inValidMessages, [...this.state.jsonSchema.questionPanels]);
		let isValid = Object.keys(errors).length ? false : true;
		if (this.state.applicationStatus === 'submitted') return alert('Your application has already been submitted.');

		if (isValid) {
			try {
				let { _id } = this.state;
				// 1. POST
				const response = await axios.post(`${baseURL}/api/v1/data-access-request/${_id}`, {});
				const lastSaved = DarHelper.saveTime();
				this.setState({ lastSaved });
				let message = {
					type: 'success',
					message: 'Done! Your application was submitted successfully'
				};
				window.localStorage.setItem('alert', JSON.stringify(message));

				let alert = {
					tab: 'submitted',
					message: 'Your application was submitted successfully',
					publisher: 'user'
				};
				this.props.history.push({
					pathname: '/account',
					search: '?tab=dataaccessrequests',
					state: { alert }
				});
			} catch (err) {
				console.log(err);
			}
		} else {
			let activePage = _.get(_.keys({ ...errors }), 0);
			let activePanel = _.get(_.keys({ ...errors }[activePage]), 0);
			let validationMessages = validationSectionMessages;
			alert('Please resolve the following validation issues');
			this.updateNavigation({ pageId: activePage, panelId: activePanel }, validationMessages);
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
				[`${key}`]: JSON.stringify(data)
			};
			// 4. PATCH the data
			const response = await axios.patch(`${baseURL}/api/v1/data-access-request/${id}`, params);
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
					activeAccordionCard: -1
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
		let activeIdx = formPanels.findIndex((p) => p.panelId === this.state.activePanelId);
		// 3. Increment idx
		let nextIdx = ++activeIdx;
		// 4. Get activePanel - make sure newIdx doesnt exceed panels length
		let { panelId, pageId } = formPanels[nextIdx > formPanels.length - 1 ? 0 : nextIdx];
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
			const newPageindex = pages.findIndex((page) => page.pageId === newForm.pageId);
			let reviewWarning = !pages[newPageindex].inReview && this.state.inReviewMode;
			// reset the current state of active to false for all pages
			const newFormState = [...this.state.jsonSchema.pages].map((item) => {
				return { ...item, active: false };
			});
			// update actual object model with propert of active true
			newFormState[newPageindex] = { ...pages[newPageindex], active: true };

			// get set the active panelId
			({ panelId } = newForm);
			if (_.isEmpty(panelId) || typeof panelId == 'undefined') {
				({ panelId } = [...this.state.jsonSchema.formPanels].find((p) => p.pageId === newFormState[newPageindex].pageId) || '');
			}

			let countedQuestionAnswers = {};
			let totalQuestions = '';
			// if in the about panel, retrieve question answers count for entire application
			if (panelId === 'about' || panelId === 'files') {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions || 0}/${
					countedQuestionAnswers.totalQuestions || 0
				}  questions answered`;
			} else {
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this, panelId);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions || 0}/${
					countedQuestionAnswers.totalQuestions || 0
				}  questions answered in this section`;
			}
			this.setState({
				jsonSchema: { ...this.state.jsonSchema, pages: newFormState },
				activePanelId: panelId,
				isWideForm: panelId === 'about' || panelId === 'files',
				totalQuestions: totalQuestions,
				validationErrors,
				reviewWarning
			});
		}
	};

	onClickSave = (e) => {
		e.preventDefault();
		const lastSaved = DarHelper.saveTime();
		this.setState({ lastSaved });
	};

	onQuestionClick = async (questionSetId = '', questionId = '') => {
		debugger;
		let questionSet, jsonSchema, questionAnswers, data;
		questionSet = DarHelper.findQuestionSet(questionSetId, {
			...this.state.jsonSchema
		});

		if (!_.isEmpty(questionSet) && !_.isEmpty(questionId)) {
			let {
				input: { action }
			} = DarHelper.findQuestion(questionId, questionSet);
			switch (action) {
				case 'addApplicant':
					let duplicateQuestionSet = DarHelper.questionSetToDuplicate(questionSetId, { ...this.state.jsonSchema });
					jsonSchema = DarHelper.insertSchemaUpdates(questionSetId, duplicateQuestionSet, { ...this.state.jsonSchema });
					data = { key: 'jsonSchema', data: jsonSchema };
					// post to API to do of new jsonSchema
					await this.updateApplication(data);
					break;
				case 'removeApplicant':
					jsonSchema = DarHelper.removeQuestionReferences(questionSetId, questionId, { ...this.state.jsonSchema });
					questionAnswers = DarHelper.removeQuestionAnswers(questionId, {
						...this.state.questionAnswers
					});
					// post to API of new jsonSchema
					await this.updateApplication({ key: 'jsonSchema', data: jsonSchema });
					await this.updateApplication({
						key: 'questionAnswers',
						data: questionAnswers
					});
					break;
				default:
					console.log(questionSetId);
					break;
			}
		}
	};
	
	/**
	 * [onActionChange Winterfell onActionChange handler]
	 *
	 * @param   {string}  pageId         [pageId]
	 * @param   {string}  questionSetId  [questionSetId]
	 * @param   {string}  questionId     [questionId]
	 * @param   {string}  action         [action]
	 *
	 * @return  {[type]}                 [return description]
	 */
	onActionChange = (panelId = '', questionSetId = '', questionId = '', action = '') => {
		console.log(panelId, questionSetId, questionId, action);
	}


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
				...emptyTopicContext
			};
		} else {
			let updatedTopicContext = DarHelper.createTopicContext(aboutApplication.selectedDatasets);
			allowedNavigation = true;
			topicContext = {
				...topicContext,
				...updatedTopicContext
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
			topicContext
		});
	};

	onHandleProjectNameBlur = () => {
		// 1. Deconstruct current state
		let { aboutApplication, projectNameValid, ncsValid } = this.state;
		// 2. Save updates if entire step is valid
		if (projectNameValid && ncsValid) {
			// 3. Set up aboutApplication object for saving
			let dataObj = { key: 'aboutApplication', data: aboutApplication };
			// 4. Update application
			this.updateApplication(dataObj);
		}
	};

	onHandleProjectNameChange = (projectName) => {
		// 1. Deconstruct current state
		let { aboutApplication } = this.state;
		// 2. Update 'about application' state with project name
		aboutApplication.projectName = projectName;
		// 3. Update state to reflect change
		this.setState({
			allowedNavigation: this.isAboutApplicationValid(aboutApplication),
			aboutApplication
		});
	};

	isAboutApplicationValid = (aboutApplication) => {
		let isValid = false;
		// 1. Desconstruct aboutApplication object to validate
		let { projectName = '', isNationalCoreStudies = false, nationalCoreStudiesProjectId = '' } = aboutApplication;
		// 2. Check valid state of NCS project selection
		let projectNameValid = !_.isEmpty(projectName.trim());
		let ncsValid = isNationalCoreStudies === false || (isNationalCoreStudies && !_.isEmpty(nationalCoreStudiesProjectId));
		// 3. Set individaul validation states
		this.setState({
			projectNameValid,
			ncsValid
		});
		// 4. Determine overall valid state
		if (projectNameValid && ncsValid) {
			isValid = true;
		}
		// 5. Return result
		return isValid;
	};

	onHandleProjectIsNCSToggle = async (e) => {
		// 1. Deconstruct aboutApplication from state
		let { aboutApplication } = this.state;
		// 2. Update about application object
		aboutApplication.isNationalCoreStudies = e.target.checked;
		aboutApplication.nationalCoreStudiesProjectId = '';
		// 3. If toggle is checked, get NCS tagged projects
		this.getNationalCoreStudiesProjects();
		// 4. Save validation state, disable navigation if toggle was checked until project is selected, remove previous selected project
		this.setState({
			aboutApplication,
			allowedNavigation: this.isAboutApplicationValid(aboutApplication)
		});
	};

	onHandleNCSProjectChange = (e) => {
		// 1. Deconstruct aboutApplication from state
		let { aboutApplication } = this.state;
		// 2. Update about application object
		aboutApplication.nationalCoreStudiesProjectId = e;
		// 3. Set state updating validation
		this.setState({
			aboutApplication,
			allowedNavigation: this.isAboutApplicationValid(aboutApplication)
		});
	};

	getNationalCoreStudiesProjects = async () => {
		try {
			// 1. Call endpoint to retrieve NCS projects
			let response = await axios.get(`${baseURL}/api/v1/tools/project/tag/NCS`);
			const {
				data: { entities }
			} = response;
			// 2. Store found projects in state
			this.setState({
				nationalCoreStudiesProjects: entities
			});
		} catch (err) {
			console.error(err);
			return [];
		}
	};

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
			aboutApplication
		});
	};

	onCustodianAction = (e) => {
		let {
			target: { value }
		} = e;
		value === 'AssignWorkflow' ? this.toggleAssignWorkflowModal() : this.toggleActionModal(value);
	};

	completeActivePhase = async () => {
		await axios
			.put(`${baseURL}/api/v1/data-access-request/${this.state._id}/stepoverride`)
			.then((response) => {
				this.loadDataAccessRequest(this.state._id);
				this.toggleWorkflowReviewModal();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	onDecisionReview = async (approved, comments) => {
		let params = {
			approved,
			comments
		};
		await axios
			.put(`${baseURL}/api/v1/data-access-request/${this.state._id}/vote`, params)
			.then((response) => {
				this.loadDataAccessRequest(this.state._id);
				this.toggleWorkflowReviewDecisionModal();
				// redirect to dashboard with message
				let alert = {
					publisher: this.state.publisher || '',
					nav: `dataaccessrequests&team=${this.state.publisher}`,
					tab: 'inReview',
					message: `You have successfully sent your recommendation for your assigned phase of ${this.state.aboutApplication.projectName} project`
				};
				// 4. redirect with Publisher name, Status: reject, approved, key of tab: presubmission, inreview, approved, rejected
				this.props.history.push({
					pathname: `/account`,
					search: '?tab=dataaccessrequests',
					state: { alert }
				});
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	onFilesUpdate = (files, initialFilesLoad) => {
		this.setState({ files, initialFilesLoad });
	}

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
			aboutApplication
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
				context: modalContext
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
				actionModalConfig
			};
		});
	};

	toggleAssignWorkflowModal = async () => {
		let response = await axios.get(`${baseURL}/api/v1/publishers/${this.state.publisherId}/workflows`);
		let { workflows } = response.data;
		this.setState((prevState) => {
			return {
				workflows,
				showAssignWorkflowModal: !prevState.showAssignWorkflowModal
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

	toggleActivePhaseModal = () => {
		this.setState((prevState) => {
			return {
				showActivePhaseModal: !prevState.showActivePhaseModal
			};
		});
	};

	toggleWorkflowReviewModal = (e, activePhase = false) => {
		this.setState((prevState) => {
			return {
				showWorkflowReviewModal: !prevState.showWorkflowReviewModal,
				showActivePhaseModal: activePhase
			};
		});
	};

	toggleWorkflowReviewDecisionModal = (type = false) => {
		this.setState((prevState) => {
			return {
				showWorkflowReviewDecisionModal: !prevState.showWorkflowReviewDecisionModal,
				workflowReviewDecisionType: type
			};
		});
	};

	updateContributors = (contributors) => {
		let updatedAuthorIds = [...contributors].map((user) => user.id);
		this.setState({ updatedAuthorIds });
	};

	submitContributors = async () => {
		let { updatedAuthorIds: authorIds, _id } = this.state;
		const body = {
			authorIds
		};
		// 1. Update action status
		await axios.put(`${baseURL}/api/v1/data-access-request/${_id}`, body);
		this.setState({ authorIds });
	};

	updateApplicationStatus = async (action = {}) => {
		let { type, statusDesc } = action;
		switch (type) {
			case 'CONFIRMAPPROVALCONDITIONS':
			case 'CONFIRMREJECTION':
			case 'CONFIRMAPPROVAL':
				let { _id } = this.state;
				const body = {
					applicationStatus: this.applicationState[type],
					applicationStatusDesc: statusDesc
				};
				// 1. Update action status
				const response = await axios.put(`${baseURL}/api/v1/data-access-request/${_id}`, body);
				// 2. set alert object for screen
				let alert = {
					publisher: this.state.publisher || '',
					nav: `dataaccessrequests&team=${this.state.publisher}`,
					tab: this.tabState[type],
					message: `You have ${this.tabState[type]} the data access request for ${this.state.publisher}`
				};
				// 3. hide screen modal for approve, reject, approve with comments
				this.toggleActionModal();
				// 4. redirect with Publisher name, Status: reject, approved, key of tab: presubmission, inreview, approved, rejected
				this.props.history.push({
					pathname: `/account`,
					search: '?tab=dataaccessrequests',
					state: { alert }
				});
				break;
			default:
				this.toggleActionModal();
		}
	};

	getUserRoles() {
		let { teams } = this.props.userState[0];
		let foundTeam = teams.filter((team) => team.name === this.state.datasets[0].datasetfields.publisher);
		if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
			return ['applicant'];
		}
		return foundTeam[0].roles;
	}

	renderTooltip = (props) => (
		<Tooltip className='tool-tip' style={{ width: '240px' }}>
			{props}
		</Tooltip>
	);

	renderApp = () => {
		let { activePanelId } = this.state;
		if (activePanelId === 'about') {
			return (
				<AboutApplication
					activeAccordionCard={this.state.activeAccordionCard}
					allowedNavigation={this.state.allowedNavigation}
					userType={this.state.userType}
					selectedDatasets={this.state.aboutApplication.selectedDatasets}
					readOnly={this.state.readOnly}
					projectNameValid={this.state.projectNameValid}
					projectName={this.state.aboutApplication.projectName}
					nationalCoreStudiesProjects={this.state.nationalCoreStudiesProjects}
					ncsValid={this.state.ncsValid}
					completedReadAdvice={this.state.aboutApplication.completedReadAdvice}
					completedCommunicateAdvice={this.state.aboutApplication.completedCommunicateAdvice}
					completedApprovalsAdvice={this.state.aboutApplication.completedApprovalsAdvice}
					completedSubmitAdvice={this.state.aboutApplication.completedSubmitAdvice}
					completedInviteCollaborators={this.state.aboutApplication.completedInviteCollaborators}
					completedDatasetSelection={this.state.aboutApplication.completedDatasetSelection}
					isNationalCoreStudies={this.state.aboutApplication.isNationalCoreStudies}
					nationalCoreStudiesProjectId={this.state.aboutApplication.nationalCoreStudiesProjectId}
					toggleCard={this.toggleCard}
					toggleDrawer={this.toggleDrawer}
					onHandleDataSetChange={this.onHandleDataSetChange}
					onNextStep={this.onNextStep}
					onHandleProjectNameBlur={this.onHandleProjectNameBlur}
					onHandleProjectNameChange={this.onHandleProjectNameChange}
					onHandleProjectIsNCSToggle={this.onHandleProjectIsNCSToggle}
					onHandleNCSProjectChange={this.onHandleNCSProjectChange}
					renderTooltip={this.renderTooltip}
					toggleModal={this.toggleModal}
					toggleMrcModal={this.toggleMrcModal}
					toggleContributorModal={this.toggleContributorModal}
				/>
			);
		} else if (activePanelId === 'files') {
			return (<Uploads 
							onFilesUpdate={this.onFilesUpdate}
							id={this.state._id} 
							files={this.state.files}
							initialFilesLoad={this.state.initialFilesLoad} />
						);
		} else {
			return (
				<Winterfell
					schema={this.state.jsonSchema}
					questionAnswers={this.state.questionAnswers}
					panelId={this.state.activePanelId}
					disableSubmit={true}
					inReviewMode={true}
					readOnly={this.state.readOnly}
					validationErrors={this.state.validationErrors}
					onQuestionFocus={this.onQuestionFocus}
					onQuestionClick={this.onQuestionClick}
					onActionChange={this.onActionChange}
					onUpdate={this.onFormUpdate}
					onSubmit={this.onFormSubmit}
				/>
			);
		}
	};

	render() {
		const {
			lastSaved,
			searchString,
			totalQuestions,
			isLoading,
			activeGuidance,
			datasets,
			showDrawer,
			showModal,
			showMrcModal,
			showActionModal,
			showContributorModal,
			showAssignWorkflowModal,
			isWideForm,
			allowedNavigation,
			applicationStatus,
			aboutApplication: { projectName = '', selectedDatasets },
			context,
			projectId,
			userType,
			actionModalConfig,
			roles
		} = this.state;
		const { userState, location } = this.props;

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
							<span className='white-16-semibold pr-5'>{datasets[0].datasetfields.publisher}</span>
						) : (
							<span className='white-16-semibold pr-5'>
								{datasets[0].name} | {datasets[0].datasetfields.publisher}
							</span>
						)}
					</Col>
					<Col sm={12} md={4} className='banner-right'>
						<span className='white-14-semibold'>{DarHelper.getSavedAgo(lastSaved)}</span>
						{
							<a
								className={`linkButton white-14-semibold ml-2 ${allowedNavigation ? '' : 'disabled'}`}
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
							<div key={`navItem-${idx}`} className={`${item.active ? 'active-border' : ''}`}>
								<div>
									<h3
										className={`${!this.state.inReviewMode ? 'black-16' : item.inReview ? 'black-16' : 'section-not-inreview'}
										${item.active ? 'section-header-active' : 'section-header'} 
										${this.state.allowedNavigation ? '' : 'disabled'}`}
										onClick={(e) => this.updateNavigation(item)}
									>
										{item.title}
									</h3>
									{item.active && (
										<ul className='list-unstyled section-subheader'>
											<NavItem
												parentForm={item}
												questionPanels={this.state.jsonSchema.questionPanels}
												onFormSwitchPanel={this.updateNavigation}
												activePanelId={this.state.activePanelId}
												enabled={allowedNavigation}
												notForReview={!item.inReview && this.state.inReviewMode}
											/>
										</ul>
									)}
								</div>
							</div>
						))}
					</div>
					<div id='darCenterCol' className={isWideForm ? 'extended' : ''}>
						{this.state.reviewWarning ? (
							<Alert variant='warning' className=''>
								<SVGIcon name='attention' width={24} height={24} fill={'#f0bb24'} viewBox='2 -9 22 22'></SVGIcon>
								You are not assigned to this section but can still view the form
							</Alert>
						) : (
							''
						)}
						<div id='darDropdownNav'>
							<NavDropdown
								options={{
									...this.state.jsonSchema,
									allowsMultipleDatasets: this.state.allowsMultipleDatasets
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
												<p className='black-20-semibold mb-0'>{item.active ? item.title : ''}</p>
												<ReactMarkdown className='gray800-14' source={item.description} />
											</Fragment>
										) : (
											''
										)
								  )
								: ''}
						</div>
						<div
							className={`dar__questions gray800-14 ${this.state.activePanelId === 'about' ? 'pad-bottom-0' : ''}`}
							style={{ backgroundColor: '#ffffff' }}
						>
							{this.renderApp()}
						</div>
					</div>
					{isWideForm ? null : (
						<div id='darRightCol' className='scrollable-sticky-column'>
							<Tabs className='dar-tabsBackground gray700-14' activeKey={this.state.key} onSelect={this.handleSelect}>
								<Tab eventKey='guidance' title='Guidance'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 text-center'>
											<span>{activeGuidance ? activeGuidance : 'Active guidance for questions'}.</span>
										</Col>
									</div>
								</Tab>
								<Tab eventKey='answers' title='Answers'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 mt-2'>
											<span>Re-use answers from your previous applications</span>
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
												You can use notes to capture your thoughts or communicate with any other applicants you invite to collaborate.
											</span>
											<br /> <br />
											<span className='comingSoonBadge'> Coming soon </span>
										</Col>
									</div>
								</Tab>
								<Tab eventKey='messages' title='Messages'>
									<div className='darTab'>
										<Col md={12} className='gray700-13 mt-2'>
											<span>Both data custodian and applicants can see messages</span>
											<br /> <br />
											<span>
												Use messages to seek guidance or clarify questions with the data custodian. You can send messages before or after
												the application is submitted. You will be notified of every new message, and so will the data custodian.
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
						{applicationStatus === 'inProgress' ? (
							''
						) : (
							<SLA classProperty={DarHelper.darStatusColours[applicationStatus]} text={DarHelper.darSLAText[applicationStatus]} />
						)}
						<div className='action-bar-status'>
							{totalQuestions} &nbsp;|&nbsp; {projectId}
						</div>
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
								onWorkflowReview={this.toggleWorkflowReviewModal}
								onWorkflowReviewDecisionClick={this.toggleWorkflowReviewDecisionModal}
								onNextClick={this.onNextClick}
								workflowEnabled={this.state.workflowEnabled}
								workflowAssigned={this.state.workflowAssigned}
								inReviewMode={this.state.inReviewMode}
								hasRecommended={this.state.hasRecommended}
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

				<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />

				<ActionModal
					open={showActionModal}
					context={actionModalConfig}
					updateApplicationStatus={this.updateApplicationStatus}
					close={this.toggleActionModal}
				/>

				<WorkflowReviewStepsModal
					open={this.state.showWorkflowReviewModal}
					close={this.toggleWorkflowReviewModal}
					workflow={this.state.workflow}
				/>

				<ActivePhaseModal
					open={this.state.showActivePhaseModal}
					close={this.toggleActivePhaseModal}
					workflow={this.state.workflow}
					projectName={projectName}
					dataSets={selectedDatasets}
					completeActivePhase={this.completeActivePhase}
				/>

				<WorkflowReviewDecisionModal
					open={this.state.showWorkflowReviewDecisionModal}
					close={this.toggleWorkflowReviewDecisionModal}
					onDecisionReview={this.onDecisionReview}
					approved={this.state.workflowReviewDecisionType}
					workflow={this.state.workflow}
					projectName={projectName}
					dataSets={selectedDatasets}
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

				<AssignWorkflowModal
					open={showAssignWorkflowModal}
					close={this.toggleAssignWorkflowModal}
					applicationId={this.state._id}
					publisher={datasets[0].datasetfields.publisher}
					workflows={this.state.workflows}
				/>

				<Modal
					show={showMrcModal}
					onHide={(e) => this.toggleMrcModal()}
					size='lg'
					aria-labelledby='contained-modal-title-vcenter'
					centered
					className='darModal'
				>
					<iframe src='https://hda-toolkit.org/story_html5.html' className='darIframe'>
						{' '}
					</iframe>
				</Modal>
			</div>
		);
	}
}

export default DataAccessRequest;
