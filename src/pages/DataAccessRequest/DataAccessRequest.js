import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Modal, Alert, Tooltip, Button } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import Winterfell from 'winterfell';
import queryString from 'query-string';
import _ from 'lodash';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import TypeaheadMultiUser from './components/TypeaheadUser/TypeaheadMultiUser';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import Loading from '../commonComponents/Loading';
import QuestionActionTabs from './components/QuestionActionTabs';
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
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import moment from 'moment';
import AmendmentCount from './components/AmendmentCount/AmendmentCount';
import ApplicantActionButtons from './components/ApplicantActionButtons/ApplicantActionButtons';
import CustodianActionButtons from './components/CustodianActionButtons/CustodianActionButtons';
import ActionModal from './components/ActionModal/ActionModal';
import ContributorModal from './components/ContributorModal/ContributorModal';
import AssignWorkflowModal from './components/AssignWorkflowModal/AssignWorkflowModal';
import SLA from '../commonComponents/sla/SLA';
import AboutApplication from './components/AboutApplication/AboutApplication';
import Uploads from './components/Uploads/Uploads';
import UpdateRequestModal from './components/UpdateRequestModal/UpdateRequestModal';
import MissingFieldsModal from './components/MissingFieldsModal/MissingFieldsModal';
import ConfirmSubmissionModal from './components/ConfirmSubmissionModal/ConfirmSubmissionModal';
import SubmitAmendmentModal from './components/SubmitAmendmentModal/SubmitAmendmentModal';
import DeleteDraftModal from './components/DeleteDraftModal/DeleteDraftModal';
import AmendApplicationModal from './components/AmendApplicationModal/AmendApplicationModal';
import DuplicateApplicationModal from './components/DuplicateApplicationModal/DuplicateApplicationModal';
import MinorVersionBlockedModal from './components/MinorVersionBlockedModal/MinorVersionBlockedModal';
import ActionNotAllowedModal from './components/ActionNotAllowedModal/ActionNotAllowedModal';
import SelectDatasetModal from './components/SelectDatasetModal/SelectDatasetModal';
import VersionSelector from '../commonComponents/versionSelector/VersionSelector';
import googleAnalytics from '../../tracking';
import ErrorModal from '../commonComponents/errorModal';
import TextareaInputCustom from '../commonComponents/TextareaInputCustom/TextareaInputCustom';
import DropdownCustom from './components/DropdownCustom/DropdownCustom';
import DoubleDropdownCustom from './components/DoubleDropdownCustom/DoubleDropdownCustom';

class DataAccessRequest extends Component {
	constructor(props) {
		super(props);
		this.onFormSubmit = this.onFormSubmit.bind(this);
		this.onFormUpdate = this.onFormUpdate.bind(this);
		this.onHandleDataSetChange = this.onHandleDataSetChange.bind(this);
		this.onHandleActionTabChange = this.onHandleActionTabChange.bind(this);
		this.searchBar = React.createRef();

		this.state = {
			_id: '',
			activeParty: '',
			activePanelId: '',
			activeGuidance: '',
			amendmentIterations: [],
			fullAmendments: {},
			jsonSchema: {},
			questionAnswers: {},
			workflow: {},
			activeWorkflow: {},
			files: [],
			initialFilesLoad: true,
			hasRecommended: false,
			applicationStatus: '',
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
			showWorkflowReviewModal: false,
			showWorkflowReviewDecisionModal: false,
			showMinorVersionBlockedModal: false,
			showAmendNotAllowedModal: false,
			workflowReviewDecisionType: false,
			showActivePhaseModal: false,
			showContributorModal: false,
			showAssignWorkflowModal: false,
			readOnly: false,
			userType: '',
			answeredAmendments: 0,
			unansweredAmendments: 0,
			isWideForm: false,
			allowsMultipleDatasets: false,
			activeAccordionCard: 0,
			allowedNavigation: true,
			isCloneable: false,
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
				completedInviteCollaborators: false,
			},
			reviewSections: [],
			context: {},
			actionModalConfig: {},
			workflows: [],
			workflowAssigned: false,
			roles: [],
			nationalCoreStudiesProjects: [],
			inReviewMode: false,
			updateRequestModal: false,
			showEmailModal: false,
			showMissingFieldsModal: false,
			showConfirmSubmissionModal: false,
			showSubmitAmendmentModal: false,
			showDeleteDraftModal: false,
			showAmendApplicationModal: false,
			showDuplicateApplicationModal: false,
			showSelectDatasetModal: false,
			actionTabSettings: {
				key: '',
				questionSetId: '',
				questionId: '',
			},
			messageDescription: '',
			messagesCount: 0,
			notesCount: 0,
			isShared: false,
			applicationType: '',
			isLatestMinorVersion: true,
		};

		this.onChangeDebounced = _.debounce(this.onChangeDebounced, 300);
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
			const { version } = queryString.parse(window.location.search);
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
				const datasetIdsConcat = datasetIds.map(ds => ds.datasetId).join(',');
				await this.loadMultipleDatasetMode(datasetIdsConcat);
				// Populate the question/answers count
				countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
				totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
			} else if (accessId) {
				// c/d) Data Access Request/Direct Link (To be extended for readonly mode)
				await this.loadDataAccessRequest(accessId, version);
				// Populate the question/answers count if still in progress, otherwise display project status and date last updated
				const { applicationStatus, updatedAt } = this.state;
				if (applicationStatus === 'inProgress') {
					countedQuestionAnswers = DarHelper.totalQuestionsAnswered(this);
					totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
				} else {
					totalQuestions = `Application ${DarHelper.darSLAText[applicationStatus]} on ${moment(updatedAt).format('DD MMM YYYY HH:mm')}`;
				}
			}

			// Update state to display question answer count
			this.setState({
				totalQuestions,
				versionNumber: version,
			});
		} catch (err) {
			this.setState({ isLoading: false });
			console.error(err.message);
		} finally {
			this.setState({
				roles: this.getUserRoles(),
			});
		}
	}

	loadMultipleDatasetMode = async datasetIds => {
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
						files,
						isCloneable,
						isShared,
						applicationType,
						versions,
						isLatestMinorVersion,
						formType,
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
				projectId,
				workflow,
				files,
				isCloneable,
				isShared,
				applicationType,
				versions,
				isLatestMinorVersion,
				formType,
			});
		} catch (err) {
			this.setState({ isLoading: false });
			console.error(err.message);
		}
	};

	loadSingleDatasetMode = async datasetId => {
		try {
			// 1. Make API call to find and return the json schema for this dataset's application along with any existing answers
			let response = await axios.get(`${baseURL}/api/v1/data-access-request/datasets/${datasetId}`);
			const {
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
						files,
						isCloneable,
						isShared,
						applicationType,
						isLatestMinorVersion,
						formType,
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
				datasets,
				mainApplicant,
				userId,
				authorIds,
				projectId,
				workflow,
				files,
				isCloneable,
				isShared,
				applicationType,
				isLatestMinorVersion,
				formType,
			});
		} catch (err) {
			this.setState({ isLoading: false });
			console.error(err.message);
		}
	};

	loadDataAccessRequest = async (accessId, version) => {
		try {
			// 1. Make API call to find and return the application form schema and answers matching this Id
			const response = await axios.get(`${baseURL}/api/v1/data-access-request/${accessId}${version ? `?version=${version}` : ''}`);
			// 2. Destructure backend response for this context containing details of DAR including question set and current progress
			const {
				data: { data },
			} = response;
			// 3. Set up the DAR
			this.setScreenData({ ...data });
		} catch (err) {
			this.setState({ isLoading: false });
			console.error(err.message);
		}
	};

	setScreenData = async context => {
		// 1. Destructure DAR context containing questions and any application progress
		let {
			jsonSchema,
			activeParty = '',
			questionAnswers = {},
			_id,
			hasRecommended,
			amendmentIterations = [],
			applicationStatus,
			aboutApplication = {},
			datasets,
			readOnly = false,
			userType = 'APPLICANT',
			unansweredAmendments = 0,
			answeredAmendments = 0,
			mainApplicant,
			userId,
			authorIds,
			projectId,
			inReviewMode = false,
			reviewSections = [],
			workflow,
			files,
			isCloneable,
			isShared,
			versions = [],
			applicationType,
			isLatestMinorVersion,
			formType,
			areDatasetsAmended = false,
			dateSubmitted = '',
		} = context;
		let {
			datasetfields: { publisher },
		} = datasets[0];
		let { firstname, lastname } = mainApplicant;
		let showSubmit = false;
		let submitButtonText = 'Submit application';

		let publisherId = '',
			workflowEnabled = false;
		if (datasets[0].publisher) {
			({ _id: publisherId, workflowEnabled } = datasets[0].publisher);
		}
		// 2. If user is custodian and the form is not in review, redirect the user to the DAR team dashboard
		if (userType === DarHelper.userTypes.CUSTODIAN && applicationStatus === DarHelper.darStatus.submitted) {
			const alert = {
				publisher,
				nav: `dataaccessrequests&team=${publisher}`,
				tab: 'submitted',
			};
			this.props.history.push({
				pathname: `/account`,
				search: '?tab=dataaccessrequests',
				state: { alert },
			});
		}

		// 3. If about application is empty, this is a new data access request so set up state based on passed context
		if (_.isEmpty(aboutApplication)) {
			aboutApplication.selectedDatasets = datasets.map(dataset => {
				let { _id: dataset_id, publisher: publisherObj, datasetid, name, description } = dataset;
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
		} else {
			let { isNationalCoreStudies = false } = aboutApplication;
			if (isNationalCoreStudies) {
				// 4. Fetch NCS projects list
				this.getNationalCoreStudiesProjects();
			}
		}

		// 5. Set messaging and modal context
		let topicContext = DarHelper.createTopicContext(aboutApplication.selectedDatasets);
		let modalContext = DarHelper.createModalContext(aboutApplication.selectedDatasets);
		let allowsMultipleDatasets = formType === '5 safe';

		// 6. If multiple datasets are allowed, append 'before you begin' section
		if (allowsMultipleDatasets) {
			// we need to inject About and File sections if first time running
			jsonSchema = this.injectStaticContent(jsonSchema, inReviewMode, reviewSections, userType, areDatasetsAmended);
		}
		// 7. Hide show submit application
		if (applicationStatus === DarHelper.darStatus.inProgress) {
			if (applicationType === DarHelper.darApplicationTypes.amendment) {
				submitButtonText = 'Submit amendment';
			}
			showSubmit = true;
		} else if (
			activeParty === 'applicant' &&
			((applicationStatus === DarHelper.darStatus.inReview && answeredAmendments > 0 && unansweredAmendments === 0) ||
				applicationStatus === DarHelper.darStatus.submitted)
		) {
			showSubmit = true;
			submitButtonText = 'Submit updates';
		}

		// 8. Set initial panel as selected and scroll to top of view port
		let initialPanel = jsonSchema.formPanels[0].panelId;
		window.scrollTo(0, 0);

		// 9. Set state
		this.setState({
			jsonSchema: { ...jsonSchema, ...classSchema },
			activeParty,
			datasets,
			questionAnswers,
			_id,
			hasRecommended,
			amendmentIterations,
			applicationStatus,
			activePanelId: initialPanel,
			isWideForm: initialPanel === DarHelper.darStaticPageIds.ABOUT,
			isLoading: false,
			topicContext,
			publisher,
			aboutApplication,
			allowsMultipleDatasets,
			context: modalContext,
			readOnly,
			answeredAmendments,
			unansweredAmendments,
			userType,
			userId,
			mainApplicant: `${firstname} ${lastname}${this.checkCurrentUser(userId) ? ' (you)' : ''}`,
			authorIds,
			projectId,
			showSubmit,
			submitButtonText,
			publisherId,
			workflowEnabled,
			inReviewMode,
			reviewSections,
			workflow,
			workflowAssigned: !_.isEmpty(workflow) ? true : false,
			files,
			isCloneable,
			isShared,
			versions,
			applicationType,
			isLatestMinorVersion,
			areDatasetsAmended,
			datasetsAmendedBy: `${firstname} ${lastname}`,
			datasetsAmendedDate: dateSubmitted,
		});
	};

	/**
	 * InjectStaticContent
	 * @desc Function to inject static 'about' and 'files' pages and panels into schema
	 * @returns {jsonSchmea} object
	 */
	injectStaticContent(jsonSchema = {}, inReviewMode = false, reviewSections = [], userType, areDatasetsAmended) {
		let { pages, formPanels } = { ...jsonSchema };
		// formPanel {pageId: 'safePeople', panelId:'applicant'}
		let formPanel = {};
		let currentPageIdx = 0;
		// check if About page has been injected
		let navElementsExist = [...pages].find(page => page.pageId === DarHelper.darStaticPageIds.ABOUT) || false;
		// 2. About page does not exist
		if (!navElementsExist) {
			// Append 'about' & 'files' panel and nav item
			jsonSchema.pages.unshift(DarHelper.staticContent.aboutPageNav);
			jsonSchema.pages.push(DarHelper.staticContent.filesNav);
			// Add form panel for 'about' & 'files'
			jsonSchema.formPanels.unshift(DarHelper.staticContent.aboutPanel);
			jsonSchema.formPanels.push(DarHelper.staticContent.filesPanel);
		}
		// if amendment has been made to datasets mark about application navigation with warning
		if (userType === DarHelper.userTypes.CUSTODIAN && areDatasetsAmended) {
			jsonSchema.pages[0].flag = 'WARNING';
		}

		// if activePanel, find active formPanel from formPanels, find pageId index from pages array
		if (!_.isEmpty(this.state.activePanelId)) {
			formPanel = [...formPanels].find(p => p.panelId === this.state.activePanelId);
			currentPageIdx = [...pages].findIndex(page => page.pageId === formPanel.pageId);
		}
		// set active page
		jsonSchema.pages.forEach(element => (element.active = false));
		jsonSchema.pages[currentPageIdx].active = true;

		// 7. Append review sections to jsonSchema if in review mode
		jsonSchema.pages = [...jsonSchema.pages].map(page => {
			let inReview =
				[...reviewSections].includes(page.pageId.toLowerCase()) ||
				page.pageId === DarHelper.darStaticPageIds.ABOUT ||
				page.pageId === DarHelper.darStaticPageIds.FILES;

			return { ...page, inReview: inReviewMode && inReview };
		});
		// add in the classes for winterfell, important
		jsonSchema = { ...jsonSchema, ...classSchema };

		return jsonSchema;
	}

	/**
	 * [onFormUpdate]
	 * @param {obj: questionAnswers}
	 * @desc Callback from Winterfell sets totalQuestionsAnswered + saveTime
	 */
	onFormUpdate = (id = '', questionAnswers = {}) => {
		// Populate relevant fields when contributor is selected in DropdownCustom
		if (id === 'safepeopleprimaryapplicantfullname' && typeof questionAnswers.safepeopleprimaryapplicantfullname === 'object') {
			let contributor = questionAnswers.safepeopleprimaryapplicantfullname;

			questionAnswers.safepeopleprimaryapplicantfullname = `${contributor.firstname} ${contributor.lastname}`;
			questionAnswers.safepeopleprimaryapplicantorcid = contributor.orcid;
			_.has(contributor, 'user.email')
				? (questionAnswers.safepeopleprimaryapplicantemail = contributor.user.email)
				: (questionAnswers.safepeopleprimaryapplicantemail = '');
			questionAnswers.safepeopleprimaryapplicantorganisationname = contributor.organisation;
		} else if (id.includes('safepeopleotherindividualsfullname') && typeof questionAnswers[id] === 'object') {
			let contributor = questionAnswers[id];
			let organisation =
				id.length > 34
					? `safepeopleotherindividualsorganisation`.concat(id.substring(34, id.length))
					: 'safepeopleotherindividualsorganisation';

			questionAnswers[id] = `${contributor.firstname} ${contributor.lastname}`;
			questionAnswers[organisation] = contributor.organisation;
		}

		if (!_.isEmpty(id) && !_.isEmpty(questionAnswers)) {
			let { lookup, activePanelId } = this.state;
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
			// 5. remove blank vals from questionAnswers
			let data = _.pickBy({ ...this.state.questionAnswers, ...questionAnswers }, _.identity);
			const lastSaved = DarHelper.saveTime();
			// 6. create dataObject
			let dataObj = { key: 'questionAnswers', data };
			// 7. Immediately update the state
			this.setState({ [`${dataObj.key}`]: { ...dataObj.data }, lastSaved });
			// 8. Execute the debounced onChange method API CALL
			this.onChangeDebounced(dataObj, id);
		}
	};

	onChangeDebounced = (obj = {}, updatedQuestionId) => {
		try {
			let { _id: id } = this.state;
			// 1. deconstruct
			let { key, data = {} } = obj;
			// 2. set body params
			let params = {
				[`${key}`]: data,
				updatedQuestionId,
			};
			// 3. API Patch call
			axios.patch(`${baseURL}/api/v1/data-access-request/${id}`, params).then(response => {
				let {
					data: { unansweredAmendments = 0, answeredAmendments = 0, jsonSchema = null },
				} = response;
				let { applicationStatus } = this.state;
				// 4. remove blank values from schema updates - omit values if they are blank, important for jsonSchema
				if (!_.isNil(jsonSchema))
					jsonSchema = this.injectStaticContent(
						jsonSchema,
						false,
						this.state.reviewSections,
						this.state.userType,
						this.state.areDatasetsAmended
					);
				let schemaUpdates = _.omitBy(
					{
						unansweredAmendments,
						answeredAmendments,
						showSubmit: applicationStatus === DarHelper.darStatus.inProgress || unansweredAmendments === 0,
						jsonSchema,
					},
					_.isNil
				);
				this.setState({
					...schemaUpdates,
				});
			});
		} catch (err) {
			console.error(`API PUT ERROR ${err.message}`);
		}
	};

	checkCurrentUser = userId => {
		let { userState } = this.props;
		let [user] = userState;
		let { id } = user;
		return id === userId;
	};

	onSubmitClick = () => {
		let invalidQuestions = DarValidation.getQuestionPanelInvalidQuestions(
			Winterfell,
			this.state.jsonSchema.questionSets,
			this.state.questionAnswers
		);
		let validationSectionMessages = DarValidation.buildInvalidSectionMessages(Winterfell, invalidQuestions);
		let inValidMessages = DarValidation.buildInvalidMessages(Winterfell, invalidQuestions);
		let errors = DarValidation.formatValidationObj(inValidMessages, [...this.state.jsonSchema.questionPanels]);
		let isValid = Object.keys(errors).length ? false : true;

		if (isValid) {
			// if 'amendment' show new amendment modal
			this.state.applicationType === DarHelper.darApplicationTypes.amendment &&
			this.state.unansweredAmendments === 0 &&
			this.state.answeredAmendments === 0
				? this.setState({ showSubmitAmendmentModal: true })
				: this.setState({ showConfirmSubmissionModal: true });
		} else {
			let activePage = _.get(_.keys({ ...errors }), 0);
			let activePanel = _.get(_.keys({ ...errors }[activePage]), 0);
			let validationMessages = validationSectionMessages;
			this.setState({ showMissingFieldsModal: true });
			this.updateNavigation({ pageId: activePage, panelId: activePanel }, validationMessages);
		}
	};

	/**
	 * [Form Submit]
	 * @desc Submitting data access request
	 * @params  Object{questionAnswers}
	 */
	onFormSubmit = async ({ type, description } = {}) => {
		try {
			let { _id } = this.state;
			let data = {};
			let alert = {};

			switch (type) {
				case DarHelper.darApplicationTypes.amendment:
					data.description = description;
					alert = {
						tab: 'submitted',
						message: `You have successfully submitted amendments to '${this.state.projectName || this.state.datasets[0].name}' application`,
						publisher: 'user',
					};
					break;
				default:
					alert = {
						tab: this.state.applicationStatus === DarHelper.darStatus.inProgress ? 'submitted' : 'inReview',
						message:
							this.state.applicationStatus === DarHelper.darStatus.inProgress
								? 'Your application was submitted successfully'
								: `You have successfully saved updates to '${this.state.projectName || this.state.datasets[0].name}' application`,
						publisher: 'user',
					};
					break;
			}

			await axios.post(`${baseURL}/api/v1/data-access-request/${_id}`, { ...data });

			const lastSaved = DarHelper.saveTime();
			this.setState({ lastSaved });

			this.props.history.push({
				pathname: '/account',
				search: '?tab=dataaccessrequests',
				state: { alert },
			});
		} catch (err) {
			console.error(err.message);
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
				[`${key}`]: data,
			};
			// 4. PATCH the data
			await axios.patch(`${baseURL}/api/v1/data-access-request/${id}`, params);
			// 6. Get saved time
			const lastSaved = DarHelper.saveTime();
			// 5. Set state
			this.setState({ [`${key}`]: { ...data }, lastSaved });
		} catch (err) {
			console.error(err.message);
		}
	};

	onNextClick = () => {
		// 1. If in the about panel, we go to the next step.  Otherwise next panel.
		if (this.state.activePanelId === 'about') {
			// 2. Pass no completed bool value to go to next step without modifying completed status
			this.onNextStep();
			// 3. If we have reached the end of the about accordion, reset active accordion so all are closed
			if (this.state.activeAccordionCard >= 6) {
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
		let activeIdx = formPanels.findIndex(p => p.panelId === this.state.activePanelId);
		// 3. Increment idx
		let nextIdx = ++activeIdx;
		// 4. Get activePanel - make sure newIdx doesnt exceed panels length
		let { panelId, pageId } = formPanels[nextIdx > formPanels.length - 1 ? 0 : nextIdx];
		// 5. Update the navigationState
		this.updateNavigation({ panelId, pageId });
	};

	/**
	 * [UpdateNavigation]
	 * @desc - Update the navigation state sidebar
	 */
	updateNavigation = (newForm, validationErrors = {}) => {
		if (this.state.allowedNavigation) {
			let reviewWarning = false;
			// reset scroll to 0, 0
			window.scrollTo(0, 0);
			let panelId = '';
			// copy state pages
			const pages = [...this.state.jsonSchema.pages];
			// get the index of new form
			const newPageindex = pages.findIndex(page => page.pageId === newForm.pageId);
			reviewWarning = !pages[newPageindex].inReview && this.state.inReviewMode;
			// reset the current state of active to false for all pages
			const newFormState = [...this.state.jsonSchema.pages].map(item => {
				return { ...item, active: false };
			});
			// update actual object model with property of active true
			newFormState[newPageindex] = { ...pages[newPageindex], active: true };

			// get set the active panelId
			({ panelId } = newForm);
			if (_.isEmpty(panelId) || typeof panelId == 'undefined') {
				({ panelId } = [...this.state.jsonSchema.formPanels].find(p => p.pageId === newFormState[newPageindex].pageId) || '');
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

			// reset guidance - due to on change of panel
			let jsonSchema = this.state.jsonSchema;
			this.setState({
				jsonSchema: { ...jsonSchema, pages: newFormState },
				activePanelId: panelId,
				isWideForm: panelId === 'about' || panelId === 'files',
				totalQuestions: totalQuestions,
				validationErrors,
				reviewWarning,
				activeGuidance: '',
				actionTabSettings: { key: '', questionSetId: '', questionId: '' },
			});
		}
	};

	onClickSave = e => {
		e.preventDefault();
		const lastSaved = DarHelper.saveTime();
		this.setState({ lastSaved });
	};

	/**
	 * [onQuestionSetAction]
	 * @desc Allows custom actions to be executed on specific question sets
	 *
	 * @param   {string}  questionSetId  [questionSetId]
	 * @param   {string}  questionId     [questionId]
	 */
	onQuestionSetAction = async (questionSetId = '', questionId = '') => {
		// locate question set containing button invoking action
		const questionSet = DarHelper.findQuestionSet(questionSetId, { ...this.state.jsonSchema });
		if (!_.isEmpty(questionSet) && !_.isEmpty(questionId)) {
			// deconstruct action to invoke from schema
			let {
				input: { action = '', questionIds = [], separatorText = '' },
			} = DarHelper.getActiveQuestion(questionSet.questions, questionId);
			// ensure valid action was found for question set button click
			if (_.isEmpty(action)) {
				return console.error(`Action could not be invoked for question set - ${questionSetId}, question - ${questionId}`);
			}
			// call API with action, questionId and questionSetId
			const stateObj = await this.postQuestionSetAction(questionSetId, questionId, questionIds, action, separatorText);
			// count question/answers for the current section
			const countedQuestionAnswers = DarHelper.totalQuestionsAnswered(
				this,
				this.state.activePanelId,
				this.state.questionAnswers,
				stateObj.jsonSchema
			);
			const totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered in this section`;
			// spread json schema response into state and reload static content including updated question counter
			this.setState({ ...stateObj, totalQuestions });
		} else {
			console.error(`Action could not be invoked as question set - ${questionSetId}, question - ${questionId} could not be found`);
		}
	};

	/**
	 * [postQuestionSetAction]
	 * @desc Allows custom actions to be executed on specific questions or question sets
	 *
	 * @param   {string}  questionSetId  [questionSetId]
	 * @param   {string}  questionId     [questionId]
	 * @param	{string}  mode			 [mode]
	 */
	postQuestionSetAction = async (questionSetId, questionId, questionIds = [], mode, separatorText = '') => {
		// post requested action to the API to perform an update to the application form
		let response = await axios.post(`${baseURL}/api/v1/data-access-request/${this.state._id}/actions`, {
			questionSetId,
			questionId,
			questionIds,
			mode,
			separatorText,
		});
		// deconstruct the response containing the modified schema
		let {
			accessRecord: { jsonSchema, questionAnswers },
		} = response.data;
		// add in static content to schema (includes about application, file upload panels etc.)
		jsonSchema = this.injectStaticContent(
			jsonSchema,
			this.state.inReviewMode,
			this.state.reviewSections,
			this.state.userType,
			this.state.areDatasetsAmended
		);
		// return the updated schema to allow it to be spread into state later
		return { jsonSchema, questionAnswers };
	};

	/**
	 * onQuestionAction
	 * @desc 	Event raised from Winterfell for secondary question events
	 * @params {event, questionSetId, questionId, key}
	 */
	onQuestionAction = async (e = '', questionSetId = '', questionId = '', key = '', counts = { messagesCount: 0, notesCount: 0 }) => {
		let mode, stateObj;
		this.setState({ messagesCount: counts.messagesCount, notesCount: counts.notesCount });
		//call api with question set id and question id to get msgs and notes..
		switch (key) {
			case DarHelper.actionKeys.GUIDANCE:
				const activeGuidance = this.getActiveQuestionGuidance(questionId);
				if (!_.isEmpty(e)) {
					this.removeActiveQuestionClass();
					this.addActiveQuestionClass(e);
				}
				this.setState({ activeGuidance, actionTabSettings: { key, questionSetId, questionId } });
				break;
			case DarHelper.actionKeys.MESSAGES:
				// call api with question set id and question id to get msgs
				if (!_.isEmpty(e)) {
					this.removeActiveQuestionClass();
					this.addActiveQuestionClass(e);
				}

				this.setState({ actionTabSettings: { key, questionSetId, questionId } });
				break;
			case DarHelper.actionKeys.NOTES:
				// call api with question set id and question id to get notes
				if (!_.isEmpty(e)) {
					this.removeActiveQuestionClass();
					this.addActiveQuestionClass(e);
				}
				this.setState({ actionTabSettings: { key, questionSetId, questionId } });
				break;
			case DarHelper.actionKeys.REQUESTAMENDMENT:
				mode = DarHelper.amendmentModes.ADDED;
				stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
				this.setState({ ...stateObj });
				break;
			case DarHelper.actionKeys.CANCELREQUEST:
				mode = DarHelper.amendmentModes.REMOVED;
				stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
				this.setState({ ...stateObj });
				break;
			case DarHelper.actionKeys.REVERTTOPREVIOUSANSWER:
				mode = DarHelper.amendmentModes.REVERTED;
				stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
				this.setState({ ...stateObj });
				break;
			default:
				break;
		}
	};

	/**
	 * getActiveQuestionGuidance
	 * @desc - Returns the guidance based on the active question
	 * @param   {string}  questionId
	 * @return  {string} guidance
	 */
	getActiveQuestionGuidance(questionId = '') {
		let questions;
		if (!_.isEmpty(questionId)) {
			let {
				jsonSchema: { questionSets },
			} = this.state;
			// 1. get active question set
			let questionList = [...questionSets].filter(q => q.questionSetId.includes(this.state.activePanelId)) || [];
			questions = questionList.map(({ questions }) => questions).flat();
			if (!_.isEmpty(questions)) {
				// 2. loop over and find active question
				let activeQuestion = DarHelper.getActiveQuestion([...questions], questionId);
				if (!_.isEmpty(activeQuestion)) {
					const { guidance } = activeQuestion;
					return guidance;
				}
				return '';
			}
		}
	}

	onHandleActionTabChange(settings) {
		const { key, questionId } = settings;
		const activeGuidance = this.getActiveQuestionGuidance(questionId);
		switch (key) {
			case DarHelper.actionKeys.GUIDANCE:
				this.setState({ activeGuidance, actionTabSettings: settings });
				break;
			case DarHelper.actionKeys.MESSAGES:
				// call api for messages
				this.setState({ actionTabSettings: settings });
				break;
			case DarHelper.actionKeys.NOTES:
				// call api for notes
				this.setState({ actionTabSettings: settings });
				break;
			default:
				break;
		}
	}

	postQuestionAction = async (questionSetId, questionId, mode) => {
		let response = await axios.post(`${baseURL}/api/v1/data-access-request/${this.state._id}/amendments`, {
			questionSetId,
			questionId,
			mode,
		});
		let {
			accessRecord: { jsonSchema, questionAnswers = null, answeredAmendments, unansweredAmendments, amendmentIterations },
		} = response.data;
		jsonSchema = this.injectStaticContent(
			jsonSchema,
			this.state.inReviewMode,
			this.state.reviewSections,
			this.state.userType,
			this.state.areDatasetsAmended
		);

		let stateObj = _.omitBy(
			{
				jsonSchema,
				questionAnswers,
				answeredAmendments,
				unansweredAmendments,
				amendmentIterations,
				showSubmit:
					this.state.applicationStatus === DarHelper.darStatus.inProgress ||
					(unansweredAmendments === 0 && answeredAmendments > 0 && this.state.userType === DarHelper.userTypes.APPLICANT),
			},
			_.isNil
		);

		return stateObj;
	};

	/**
	 * removeActiveQuestionClass
	 * @desc Removes active class on a single question
	 */
	removeActiveQuestionClass = () => {
		let fGroups = document.querySelectorAll('.question-wrap');
		fGroups.forEach(key => key.classList.remove('active-group'));
	};

	/**
	 * addActiveQuestionClass
	 * @desc Adds active border to question clicked upon
	 * @param - (e) eventObject
	 */
	addActiveQuestionClass = e => {
		if (!_.isEmpty(e)) {
			let fGroup = e.target.closest('.question-wrap');
			fGroup.classList.add('active-group');
		}
	};

	resetGuidance = () => {
		// remove active question class
		this.removeActiveQuestionClass();
		// reset guidance state
		this.setState({ activeGuidance: '' });
	};

	updateCount = (questionId, questionSetId, messageType) => {
		//Get the question that the count needs to be updated on
		let { jsonSchema } = this.state;
		let questionSet = DarHelper.findQuestionSet(questionSetId, jsonSchema);
		let question = DarHelper.findQuestion(questionId, questionSet.questions);

		//If question has no previous counts add in the defaults
		if (!question.counts) {
			question.counts = { messagesCount: 0, notesCount: 0 };
		}
		//Update the count based on the messageType
		if (messageType === 'message') {
			question.counts.messagesCount = question.counts.messagesCount + 1;
		} else if (messageType === 'note') {
			question.counts.notesCount = question.counts.notesCount + 1;
		}
		//Update state
		this.setState({
			jsonSchema,
			messagesCount: question.counts.messagesCount,
			notesCount: question.counts.notesCount,
		});
	};

	onHandleDataSetChange = (value = []) => {
		// 1. Deconstruct current state
		let { aboutApplication, allowedNavigation, topicContext } = { ...this.state };
		aboutApplication.selectedDatasets = [...value];

		// 3. If no datasets are passed, set invalid and incomplete step, and update message context
		if (_.isEmpty(value)) {
			let emptyTopicContext = DarHelper.createTopicContext();
			aboutApplication.completedDatasetSelection = false;
			allowedNavigation = false;
			topicContext = {
				...topicContext,
				...emptyTopicContext,
			};
		} else {
			let updatedTopicContext = DarHelper.createTopicContext(aboutApplication.selectedDatasets);
			allowedNavigation = true;
			topicContext = {
				...topicContext,
				...updatedTopicContext,
			};
			// 4. Create data object to save
			let dataObj = { key: 'aboutApplication', data: aboutApplication };
			// 5. Update application
			this.updateApplication(dataObj);
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
		let { aboutApplication, projectNameValid, ncsValid } = this.state;
		// 2. Save updates if entire step is valid
		if (projectNameValid && ncsValid) {
			// 3. Set up aboutApplication object for saving
			let dataObj = { key: 'aboutApplication', data: aboutApplication };
			// 4. Update application
			this.updateApplication(dataObj);
		}
	};

	onHandleProjectNameChange = projectName => {
		// 1. Deconstruct current state
		let { aboutApplication } = this.state;
		// 2. Update 'about application' state with project name
		aboutApplication.projectName = projectName;
		// 3. Update state to reflect change
		this.setState({
			allowedNavigation: this.isAboutApplicationValid(aboutApplication),
			aboutApplication,
		});
	};

	isAboutApplicationValid = aboutApplication => {
		let isValid = false;
		// 1. Desconstruct aboutApplication object to validate
		let { projectName = '', isNationalCoreStudies = false, nationalCoreStudiesProjectId = '' } = aboutApplication;
		// 2. Check valid state of NCS project selection
		let projectNameValid = !_.isEmpty(projectName.trim());
		let ncsValid = isNationalCoreStudies === false || (isNationalCoreStudies && !_.isEmpty(nationalCoreStudiesProjectId));
		// 3. Set individaul validation states
		this.setState({
			projectNameValid,
			ncsValid,
		});
		// 4. Determine overall valid state
		if (projectNameValid && ncsValid) {
			isValid = true;
		}
		// 5. Return result
		return isValid;
	};

	onHandleProjectIsNCSToggle = async e => {
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
			allowedNavigation: this.isAboutApplicationValid(aboutApplication),
		});
	};

	onHandleNCSProjectChange = e => {
		// 1. Deconstruct aboutApplication from state
		let { aboutApplication } = this.state;
		// 2. Update about application object
		aboutApplication.nationalCoreStudiesProjectId = e.toString();
		// 3. Set state updating validation
		this.setState({
			aboutApplication,
			allowedNavigation: this.isAboutApplicationValid(aboutApplication),
		});
	};

	getNationalCoreStudiesProjects = async () => {
		try {
			// 1. Call endpoint to retrieve NCS projects
			let response = await axios.get(`${baseURL}/api/v1/tools/project/tag/?name=NCS,National Core Study`);
			const {
				data: { entities },
			} = response;
			// 2. Store found projects in state
			this.setState({
				nationalCoreStudiesProjects: entities,
			});
		} catch (err) {
			console.error(err.message);
			return [];
		}
	};

	onNextStep = async completed => {
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
					aboutApplication.completedInviteCollaborators = completed;
					break;
				case 3:
					aboutApplication.completedReadAdvice = completed;
					break;
				case 4:
					aboutApplication.completedCommunicateAdvice = completed;
					break;
				case 5:
					aboutApplication.completedApprovalsAdvice = completed;
					break;
				case 6:
					aboutApplication.completedSubmitAdvice = completed;
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

	onCustodianAction = value => {
		if (this.state.isLatestMinorVersion) {
			value.toUpperCase() === 'ASSIGNWORKFLOW' ? this.toggleAssignWorkflowModal() : this.toggleActionModal(value);
		} else {
			this.toggleMinorVersionBlockedModal();
		}
	};

	completeActivePhase = async () => {
		await axios
			.put(`${baseURL}/api/v1/data-access-request/${this.state._id}/stepoverride`)
			.then(response => {
				this.loadDataAccessRequest(this.state._id);
				this.toggleWorkflowReviewModal();
			})
			.catch(err => {
				console.error(err.message);
			});
	};

	onDecisionReview = async (approved, comments) => {
		let params = {
			approved,
			comments,
		};
		await axios
			.put(`${baseURL}/api/v1/data-access-request/${this.state._id}/vote`, params)
			.then(response => {
				this.loadDataAccessRequest(this.state._id);
				this.toggleWorkflowReviewDecisionModal();
				// redirect to dashboard with message
				let alert = {
					publisher: this.state.publisher || '',
					nav: `dataaccessrequests&team=${this.state.publisher}`,
					tab: 'inReview',
					message: `You have successfully sent your recommendation for your assigned phase of ${this.state.aboutApplication.projectName} project`,
				};
				// 4. redirect with Publisher name, Status: reject, approved, key of tab: presubmission, inreview, approved, rejected
				this.props.history.push({
					pathname: `/account`,
					search: '?tab=dataaccessrequests',
					state: { alert },
				});
			})
			.catch(error => {
				alert(error.message);
			});
	};

	onFilesUpdate = (files, initialFilesLoad) => {
		this.setState({ files, initialFilesLoad });
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
		this.setState(prevState => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
		});
	};

	toggleModal = (showEnquiry = false, modalContext) => {
		this.setState(prevState => {
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
		this.setState(prevState => {
			return { showMrcModal: !prevState.showMrcModal };
		});
	};

	toggleActionModal = (type = '') => {
		let actionModalConfig = {};
		// 1. get basic modal config
		if (!_.isEmpty(type)) actionModalConfig = DarHelper.configActionModal(type);
		// 2. set state for hide/show/config modal
		this.setState(prevState => {
			return {
				showActionModal: !prevState.showActionModal,
				actionModalConfig,
			};
		});
	};

	toggleAssignWorkflowModal = async () => {
		let response = await axios.get(`${baseURL}/api/v1/publishers/${this.state.publisherId}/workflows`);
		let { workflows } = response.data;
		this.setState(prevState => {
			return {
				workflows,
				showAssignWorkflowModal: !prevState.showAssignWorkflowModal,
			};
		});
	};

	onEditForm = async () => {
		this.setState({
			readOnly: false,
			showSubmit: false,
			submitButtonText: 'Submit updates',
		});
	};

	toggleContributorModal = () => {
		this.setState(prevState => {
			return {
				showContributorModal: !prevState.showContributorModal,
			};
		});
	};

	toggleActivePhaseModal = () => {
		this.setState(prevState => {
			return {
				showActivePhaseModal: !prevState.showActivePhaseModal,
			};
		});
	};

	toggleWorkflowReviewModal = (e, activePhase = false) => {
		this.setState(prevState => {
			return {
				showWorkflowReviewModal: !prevState.showWorkflowReviewModal,
				showActivePhaseModal: activePhase,
			};
		});
	};

	toggleWorkflowReviewDecisionModal = (type = false) => {
		if (this.state.isLatestMinorVersion) {
			this.setState(prevState => {
				return {
					showWorkflowReviewDecisionModal: !prevState.showWorkflowReviewDecisionModal,
					workflowReviewDecisionType: type,
				};
			});
		} else {
			this.toggleMinorVersionBlockedModal();
		}
	};

	toggleMinorVersionBlockedModal = () => {
		this.setState(prevState => {
			return {
				showMinorVersionBlockedModal: !prevState.showMinorVersionBlockedModal,
			};
		});
	};

	toggleAmendNotAllowedModal = () => {
		this.setState(prevState => {
			return {
				showAmendNotAllowedModal: !prevState.showAmendNotAllowedModal,
			};
		});
	};

	goToLatestVersion = () => {
		this.setState(prevState => {
			return {
				showMinorVersionBlockedModal: !prevState.showMinorVersionBlockedModal,
			};
		});

		this.props.history.push({ pathname: `/data-access-request/${this.state._id}` });
	};

	updateContributors = contributors => {
		let updatedAuthorIds = [...contributors].map(user => user.id);
		this.setState({ updatedAuthorIds });
	};

	submitContributors = async () => {
		let { updatedAuthorIds: authorIds, _id } = this.state;
		const body = {
			authorIds,
		};
		// 1. Update action status
		await axios.put(`${baseURL}/api/v1/data-access-request/${_id}`, body);
		this.setState({ authorIds });
	};

	onClickMailDAR = async () => {
		let { _id } = this.state;
		await axios
			.post(`${baseURL}/api/v1/data-access-request/${_id}/email`, {})
			.then(response => {
				window.location.reload();
			})
			.catch(err => {
				console.error(err.message);
			});
	};

	redirectDashboard = e => {
		e.preventDefault();
		this.props.history.push({
			pathname: `/account`,
			search: '?tab=dataaccessrequests',
		});
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
					applicationStatusDesc: statusDesc,
				};
				// 1. Update action status
				await axios.put(`${baseURL}/api/v1/data-access-request/${_id}`, body);
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

	onDuplicateApplication = async (appIdToCloneInto = '', selectedDatasets = []) => {
		if (_.isEmpty(appIdToCloneInto) && _.isEmpty(selectedDatasets)) {
			return;
		}

		googleAnalytics.recordEvent('Data access request', 'Clicked duplicate application', 'Duplicated application');

		const { versionNumber } = this.state;
		let datasetIds = [];
		let datasetTitles = [];
		let publisher = '';

		if (!_.isEmpty(appIdToCloneInto)) {
			this.toggleDuplicateApplicationModal();
		} else if (!_.isEmpty(selectedDatasets)) {
			this.toggleSelectDatasetModal();
			publisher = selectedDatasets[0].publisher;
			selectedDatasets.forEach(dataset => {
				datasetIds.push(dataset.datasetId);
				datasetTitles.push(dataset.name);
			});
		}

		axios
			.post(`${baseURL}/api/v1/data-access-request/${this.state._id}/clone${versionNumber ? `?version=${versionNumber}` : ''}`, {
				datasetIds,
				datasetTitles,
				publisher,
				appIdToCloneInto,
			})
			.then(res => {
				let message = '';
				let projectName = this.state.projectName || this.state.datasets[0].name;

				if (_.isEmpty(appIdToCloneInto)) {
					message = `You have successfully duplicated your application '${projectName}' into a new application`;
				} else {
					let { aboutApplication: { projectName: projectNameCloneInto } = {} } = res.data.accessRecord;
					projectNameCloneInto = _.isNil(projectNameCloneInto) ? 'your selected application' : `'${projectNameCloneInto}'`;
					message = `You have successfully duplicated your application '${projectName}' into ${projectNameCloneInto}`;
				}

				let alert = {
					message: message,
					publisher: 'user',
				};
				this.setState({ alert, activePanelId: 'about' });
				setTimeout(() => this.setState({ alert: {} }), 10000);

				this.props.history.push({ pathname: `/data-access-request/${res.data.accessRecord._id}` });
			});
	};

	getUserRoles() {
		let { teams } = this.props.userState[0];
		let foundTeam = teams.filter(team => team.name === this.state.datasets[0].datasetfields.publisher);
		if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
			return ['applicant'];
		}
		return foundTeam[0].roles;
	}

	renderTooltip = props => (
		<Tooltip className='tool-tip' style={{ width: '240px' }}>
			{props}
		</Tooltip>
	);

	/**
	 * OnUpdateRequest
	 * @desc When Custodian clicks Submit update request
	 * 			 will open a modal
	 */
	onUpdateRequest = e => {
		let fullAmendments = {};
		let updateRequestModal = this.state.updateRequestModal;
		let { pages, questionPanels, questionSets } = { ...this.state.jsonSchema };
		let { questionAnswers } = { ...this.state };
		// Get the last amendmentIteration in the array
		let amendmentsIterations = _.last([...this.state.amendmentIterations]);
		if (!_.isEmpty(amendmentsIterations)) {
			// get the questionAnswers object {role: {}, lastName: {}}
			let { questionAnswers: updates } = { ...amendmentsIterations };
			// get all the questionIds into a iterable array from questionAnswers
			if (!_.isEmpty(updates)) {
				// set up default variables
				let questionSetId,
					section,
					pageId,
					page,
					questions,
					question = '';
				// reduce over questionanswers object using lodash
				fullAmendments = _.reduce(
					updates,
					(obj, value, key) => {
						// currentItem {questionSetId, answer}
						({ questionSetId } = updates[key]);
						const answer = questionAnswers[key];
						// find the active questionPanel ie questionPanels: [{navHeader, pageId, panelId, questionSets:[]}]
						let activeQuestionPanel = [...questionPanels].find(panel => panel.panelId === questionSetId);
						// In case of questions dynamically generated by winterfell with an arbitrary suffix on the questionSetId (i.e. applicant_eqhFL)
						if (_.isUndefined(activeQuestionPanel))
							activeQuestionPanel = [...questionPanels].find(panel => questionSetId.startsWith(panel.panelId));
						// Get the section {navHeader: panelHeader: 'Applicant', pageId: 'safePeople'}
						({ navHeader: section, pageId } = activeQuestionPanel);
						// find the active page ie pages: [{pageId: 'safepeople', title: pageTitle: 'Safe People'}]
						let activePage = [...pages].find(pageItem => pageItem.pageId === pageId);
						// Get the page title from page item
						({ title: page } = activePage);
						// Get the list of questions for questionPanelId from questionSets
						({ questions } = [...questionSets].find(questionSet => questionSet.questionSetId === questionSetId));
						// Get question checks for nested questions also
						({ question } = DarHelper.getActiveQuestion(questions, key));
						// Safe People | Applicant
						let location = `${page} | ${section}`;
						// build up our object of data for display
						if (!obj[location]) {
							obj = { ...obj, [location]: [{ question, answer }] };
						} else if (obj[location]) {
							let arr = [...obj[location], { question, answer }];
							obj[location] = arr;
						}
						return obj;
					},
					{}
				);
			}
		}
		this.setState({ updateRequestModal: !updateRequestModal, fullAmendments });
	};

	toggleUpdateRequestModal = () => {
		this.setState(prevState => {
			return {
				updateRequestModal: !prevState.updateRequestModal,
			};
		});
	};

	toggleEmailModal = showModal => {
		this.setState({ showEmailModal: showModal });
	};

	toggleMissingFieldsModal = () => {
		this.setState(prevState => {
			return {
				showMissingFieldsModal: !prevState.showMissingFieldsModal,
			};
		});
	};

	toggleConfirmSubmissionModal = () => {
		this.setState(prevState => {
			return {
				showConfirmSubmissionModal: !prevState.showConfirmSubmissionModal,
			};
		});
	};

	toggleSubmitAmendmentModal = () => {
		this.setState(prevState => {
			return {
				showSubmitAmendmentModal: !prevState.showSubmitAmendmentModal,
			};
		});
	};

	toggleAmendApplicationModal = () => {
		if (this.state.applicationStatus === DarHelper.darStatus.inReview) {
			this.toggleAmendNotAllowedModal();
		} else {
			this.setState(prevState => {
				return {
					showAmendApplicationModal: !prevState.showAmendApplicationModal,
				};
			});
		}
	};

	toggleDeleteDraftModal = () => {
		this.setState(prevState => {
			return {
				showDeleteDraftModal: !prevState.showDeleteDraftModal,
			};
		});
	};

	toggleDuplicateApplicationModal = () => {
		this.setState(prevState => {
			return {
				showDuplicateApplicationModal: !prevState.showDuplicateApplicationModal,
			};
		});
	};

	onDeleteDraft = async () => {
		try {
			let { _id } = this.state;
			let projectName = this.state.projectName || this.state.datasets[0].name;
			await axios.delete(`${baseURL}/api/v1/data-access-request/${_id}`, {});
			let alert = {
				tab: 'all',
				message: `You have deleted the data access request for '${projectName}' project`,
				publisher: 'user',
			};
			this.props.history.push({
				pathname: '/account',
				search: '?tab=dataaccessrequests',
				state: { alert },
			});
		} catch (err) {
			console.error(err.message);
		}
	};

	onAmendApplication = async () => {
		try {
			let { _id } = this.state;
			const {
				data: {
					data: { _id: newId },
				},
			} = await axios.post(`${baseURL}/api/v1/data-access-request/${_id}/amend`, {});

			this.toggleAmendApplicationModal();
			this.setState({ activePanelId: 'about' });

			this.props.history.push({ pathname: `/data-access-request/${newId}` });
		} catch (err) {
			console.error(err.message);
		}
	};

	toggleSelectDatasetModal = () => {
		this.setState(prevState => {
			return {
				showSelectDatasetModal: !prevState.showSelectDatasetModal,
			};
		});
	};

	showDatasetModal = () => {
		this.toggleSelectDatasetModal();
		this.toggleDuplicateApplicationModal();
	};

	renderApp = () => {
		let { activePanelId } = this.state;
		if (activePanelId === 'about') {
			return (
				<AboutApplication
					key={this.state._id}
					activeAccordionCard={this.state.activeAccordionCard}
					allowedNavigation={this.state.allowedNavigation}
					userType={this.state.userType}
					selectedDatasets={this.state.aboutApplication.selectedDatasets}
					readOnly={this.state.readOnly || this.state.applicationStatus !== DarHelper.darStatus.inProgress}
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
					context={this.state.context}
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
					areDatasetsAmended={this.state.areDatasetsAmended}
					datasetsAmendedBy={this.state.datasetsAmendedBy}
					datasetsAmendedDate={this.state.datasetsAmendedDate}
				/>
			);
		} else if (activePanelId === 'files') {
			return <Uploads onFilesUpdate={this.onFilesUpdate} id={this.state._id} files={this.state.files} readOnly={this.state.readOnly} />;
		} else {
			return (
				<Winterfell
					schema={this.state.jsonSchema}
					questionAnswers={this.state.questionAnswers}
					panelId={this.state.activePanelId}
					disableSubmit={true}
					readOnly={this.state.readOnly}
					validationErrors={this.state.validationErrors}
					renderRequiredAsterisk={() => <span>{'*'}</span>}
					onQuestionClick={this.onQuestionSetAction}
					onQuestionAction={this.onQuestionAction}
					onUpdate={this.onFormUpdate}
					onSubmit={this.onFormSubmit}
					applicationId={this.state._id}
				/>
			);
		}
	};

	setMessageDescription = messageDescription => {
		this.setState({ messageDescription: messageDescription });
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
			roles,
			showEmailModal,
			alert,
			versions = [],
			messageDescription,
		} = this.state;
		const { userState } = this.props;

		const selectedVersion = !_.isEmpty(versions) ? versions.find(v => v.isCurrent).displayTitle : '';

		Winterfell.addInputType('typeaheadCustom', TypeaheadCustom);
		Winterfell.addInputType('datePickerCustom', DatePickerCustom);
		Winterfell.addInputType('typeaheadUser', TypeaheadUser);
		Winterfell.addInputType('textareaInputCustom', TextareaInputCustom);
		Winterfell.addInputType('dropdownCustom', DropdownCustom);
		Winterfell.addInputType('doubleDropdownCustom', DoubleDropdownCustom);
		Winterfell.validation.default.addValidationMethods({
			isCustomDate: value => {
				if (_.isEmpty(value) || _.isNil(value) || moment(value, 'DD/MM/YYYY').isValid()) {
					return true;
				}
				return false;
			},
		});

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
						searchString={searchString}
						doSearchMethod={e => {
							SearchBarHelperUtil.doSearch(e, this);
						}}
						doUpdateSearchString={e => {
							SearchBarHelperUtil.updateSearchString(e, this);
						}}
						doToggleDrawer={e => this.toggleDrawer()}
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
							{versions.length > 1 && (
								<span className='white-16-semibold pr-5' style={{ display: 'inline-block' }}>
									<VersionSelector selectedVersion={selectedVersion} versionList={versions} displayType='smallTriangle' />
								</span>
							)}
						</Col>
						<Col sm={12} md={4} className='d-flex justify-content-end align-items-center banner-right'>
							<span className='white-14-semibold'>{DarHelper.getSavedAgo(lastSaved)}</span>
							{
								<a
									className={`linkButton white-14-semibold ml-2 ${allowedNavigation ? '' : 'disabled'}`}
									onClick={this.onClickSave}
									href='javascript:void(0)'>
									Save now
								</a>
							}
							{userType.toUpperCase() === 'APPLICANT' && !this.state.readOnly ? (
								<a
									className={`linkButton white-14-semibold ml-2 ${allowedNavigation ? '' : 'disabled'}`}
									href='javascript:;'
									onClick={e => this.toggleEmailModal(true)}>
									Email me a copy
								</a>
							) : (
								''
							)}
							<CloseButtonSvg width='16px' height='16px' fill='#fff' onClick={e => this.redirectDashboard(e)} />
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
											onClick={e => this.updateNavigation(item)}>
											<span>{item.title}</span>
											<span>{item.flag && <i className={DarHelper.flagIcons[item.flag]} />}</span>
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
							{this.state.reviewWarning && (
								<Alert variant='warning' className=''>
									<SVGIcon name='attention' width={24} height={24} fill={'#f0bb24'} viewBox='2 -9 22 22'></SVGIcon>
									You are not assigned to this section but can still view the form
								</Alert>
							)}
							{!_.isEmpty(alert) && (
								<Alert variant={'success'} className='main-alert'>
									<SVGIcon name='check' width={24} height={24} fill={'#2C8267'} /> {alert.message}
								</Alert>
							)}
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
								className={`dar__questions ${this.state.activePanelId === 'about' ? 'pad-bottom-0' : ''}`}
								style={{ backgroundColor: '#ffffff' }}>
								{this.renderApp()}
							</div>
						</div>
						{isWideForm ? null : (
							<div id='darRightCol' className='scrollable-sticky-column'>
								<div className='darTab'>
									<QuestionActionTabs
										applicationId={this.state._id}
										userState={userState}
										settings={this.state.actionTabSettings}
										activeGuidance={activeGuidance}
										onHandleActionTabChange={this.onHandleActionTabChange}
										toggleDrawer={this.toggleDrawer}
										setMessageDescription={this.setMessageDescription}
										userType={userType}
										messagesCount={this.state.messagesCount}
										notesCount={this.state.notesCount}
										isShared={this.state.isShared}
										updateCount={this.updateCount}
										publisher={datasets[0].datasetv2.summary.publisher.name}
										applicationStatus={applicationStatus}
									/>
								</div>
							</div>
						)}
					</div>

					<ActionBar userState={userState}>
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
								<AmendmentCount answeredAmendments={this.state.answeredAmendments} unansweredAmendments={this.state.unansweredAmendments} />
								{userType.toUpperCase() === 'APPLICANT' ? (
									<ApplicantActionButtons
										allowedNavigation={allowedNavigation}
										isCloneable={this.state.isCloneable}
										onNextClick={this.onNextClick}
										onSubmitClick={this.onSubmitClick}
										onShowContributorModal={this.toggleContributorModal}
										onEditForm={this.onEditForm}
										showSubmit={this.state.showSubmit}
										submitButtonText={this.state.submitButtonText}
										onDeleteDraftClick={this.toggleDeleteDraftModal}
										applicationStatus={applicationStatus}
										onDuplicateClick={this.toggleDuplicateApplicationModal}
										onShowAmendApplicationModal={this.toggleAmendApplicationModal}
									/>
								) : (
									<CustodianActionButtons
										activeParty={this.state.activeParty}
										allowedNavigation={allowedNavigation}
										unansweredAmendments={this.state.unansweredAmendments}
										onUpdateRequest={this.onUpdateRequest}
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
					</ActionBar>

					<SideDrawer open={showDrawer} closed={e => this.toggleDrawer()}>
						<UserMessages
							userState={userState[0]}
							closed={e => this.toggleDrawer()}
							toggleModal={this.toggleModal}
							drawerIsOpen={this.state.showDrawer}
							topicContext={this.state.topicContext}
							msgDescription={messageDescription}
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

					<MinorVersionBlockedModal
						open={this.state.showMinorVersionBlockedModal}
						close={this.toggleMinorVersionBlockedModal}
						confirm={this.goToLatestVersion}
					/>

					<ActionNotAllowedModal
						open={this.state.showAmendNotAllowedModal}
						close={this.toggleAmendNotAllowedModal}
						confirm={this.toggleDrawer}
						headerText='Application in review cannot be amended'
						bodyText='This application is in review so cannot be amended. However, updates can be requested by the custodian.'
					/>

					<ContributorModal
						open={showContributorModal}
						close={this.toggleContributorModal}
						mainApplicant={this.state.mainApplicant}
						handleOnSaveChanges={this.submitContributors}>
						<TypeaheadMultiUser
							onHandleContributorChange={this.updateContributors}
							selectedContributors={this.state.authorIds}
							currentUserId={this.state.userId}
						/>
					</ContributorModal>

					<AssignWorkflowModal
						open={showAssignWorkflowModal}
						close={this.toggleAssignWorkflowModal}
						applicationId={this.state._id}
						publisher={datasets[0].datasetfields.publisher}
						workflows={this.state.workflows}
					/>

					<UpdateRequestModal
						open={this.state.updateRequestModal}
						close={this.toggleUpdateRequestModal}
						publisher={this.state.publisher}
						projectName={projectName}
						applicationId={this.state._id}
						fullAmendments={this.state.fullAmendments}
						amendmentIterations={this.state.amendmentIterations}
					/>

					<Modal
						show={showMrcModal}
						onHide={e => this.toggleMrcModal()}
						size='lg'
						aria-labelledby='contained-modal-title-vcenter'
						centered
						className='darModal'>
						<iframe src='https://hda-toolkit.org/story_html5.html' className='darIframe'>
							{' '}
						</iframe>
					</Modal>

					<Modal
						show={showEmailModal}
						onHide={e => this.toggleEmailModal(false)}
						aria-labelledby='contained-modal-title-vcenter'
						centered
						className='workflowModal'>
						<div className='workflowModal-header'>
							<h1 className='black-20-semibold'>Email application</h1>
							<CloseButtonSvg className='workflowModal-header--close' onClick={e => this.toggleEmailModal(false)} />
						</div>

						<div className='workflowModal-body'>
							Are you sure you want to email yourself this application? This will be sent to the email address provided in your HDR UK
							account, where it will be available for you to print.
						</div>
						<div className='workflowModal-footer'>
							<div className='workflowModal-footer--wrap'>
								<Button variant='white' className='techDetailButton mr-2' onClick={e => this.toggleEmailModal(false)}>
									No, nevermind
								</Button>
								<Button variant='primary' className='white-14-semibold' onClick={this.onClickMailDAR}>
									Email application
								</Button>
							</div>
						</div>
					</Modal>

					<MissingFieldsModal open={this.state.showMissingFieldsModal} close={this.toggleMissingFieldsModal} />
					<ConfirmSubmissionModal
						open={this.state.showConfirmSubmissionModal}
						close={this.toggleConfirmSubmissionModal}
						confirm={this.onFormSubmit}
					/>
					<SubmitAmendmentModal
						open={this.state.showSubmitAmendmentModal}
						close={this.toggleSubmitAmendmentModal}
						onHandleSubmit={amendDescription => {
							this.onFormSubmit({ type: DarHelper.darApplicationTypes.amendment, description: amendDescription });
						}}
					/>
					<DeleteDraftModal open={this.state.showDeleteDraftModal} close={this.toggleDeleteDraftModal} confirm={this.onDeleteDraft} />

					<AmendApplicationModal
						open={this.state.showAmendApplicationModal}
						close={this.toggleAmendApplicationModal}
						confirm={this.onAmendApplication}
					/>

					<DuplicateApplicationModal
						isOpen={this.state.showDuplicateApplicationModal}
						closeModal={this.toggleDuplicateApplicationModal}
						duplicateApplication={this.onDuplicateApplication}
						showDatasetModal={this.showDatasetModal}
					/>

					<SelectDatasetModal
						isOpen={this.state.showSelectDatasetModal}
						closeModal={this.toggleSelectDatasetModal}
						duplicateApplication={this.onDuplicateApplication}
						appToCloneId={this.state._id}
					/>
				</div>
			</Sentry.ErrorBoundary>
		);
	}
}

export default DataAccessRequest;
