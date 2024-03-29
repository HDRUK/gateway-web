import * as Sentry from '@sentry/react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import { createRef, Component, Fragment } from 'react';
import { Col, Container, Modal, Row, Tooltip } from 'react-bootstrap';
import { Button } from 'hdruk-react-core';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import 'react-tabs/style/react-tabs.css';
import Winterfell from 'winterfell';

import { generalUtils, darValidationUtils, darHelperUtils, searchBarHelperUtils, authUtils, accountUtils } from 'utils';
import { PERMISSIONS_TEAM_ROLES } from 'consts';
import { Alert, RenderMarkdown } from 'components';

import { baseURL } from '../../configs/url.config';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import googleAnalytics from '../../tracking';

import ActionBar from '../commonComponents/actionbar/ActionBar';
import AsyncTypeAheadUsers from '../commonComponents/AsyncTypeAheadUsers';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import Loading from '../commonComponents/Loading';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import SLA from '../commonComponents/sla/SLA';
import TextareaInputCustom from '../commonComponents/TextareaInputCustom/TextareaInputCustom';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import VersionSelector from '../commonComponents/versionSelector/VersionSelector';
import ActivePhaseModal from '../commonComponents/workflowActivePhase/ActivePhaseModal';
import WorkflowReviewDecisionModal from '../commonComponents/workflowReviewDecision/WorkflowReviewDecisionModal';
import WorkflowReviewStepsModal from '../commonComponents/workflowReviewStepsModal/WorkflowReviewStepsModal';
import { classSchema } from './classSchema';
import AboutApplication from './components/AboutApplication/AboutApplication';
import ActionModal from './components/ActionModal/ActionModal';
import ActionNotAllowedModal from './components/ActionNotAllowedModal/ActionNotAllowedModal';
import AmendApplicationModal from './components/AmendApplicationModal/AmendApplicationModal';
import AmendmentCount from './components/AmendmentCount/AmendmentCount';
import ApplicantActionButtons from './components/ApplicantActionButtons/ApplicantActionButtons';
import AssignWorkflowModal from './components/AssignWorkflowModal/AssignWorkflowModal';
import ConfirmSubmissionModal from './components/ConfirmSubmissionModal/ConfirmSubmissionModal';
import ContributorModal from './components/ContributorModal/ContributorModal';
import CustodianActionButtons from './components/CustodianActionButtons/CustodianActionButtons';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import DeleteDraftModal from './components/DeleteDraftModal/DeleteDraftModal';
import DoubleDropdownCustom from './components/DoubleDropdownCustom/DoubleDropdownCustom';
import DropdownCustom from './components/DropdownCustom/DropdownCustom';
import DuplicateApplicationModal from './components/DuplicateApplicationModal/DuplicateApplicationModal';
import MinorVersionBlockedModal from './components/MinorVersionBlockedModal/MinorVersionBlockedModal';
import MissingFieldsModal from './components/MissingFieldsModal/MissingFieldsModal';
import NavItem from './components/NavItem/NavItem';
import QuestionActionTabs from './components/QuestionActionTabs';
import SelectDatasetModal from './components/SelectDatasetModal/SelectDatasetModal';
import SubmitAmendmentModal from './components/SubmitAmendmentModal/SubmitAmendmentModal';
import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import UpdateRequestModal from './components/UpdateRequestModal/UpdateRequestModal';
import Uploads from './components/Uploads/Uploads';
import './DataAccessRequest.scss';

class DataAccessRequest extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormUpdate = this.onFormUpdate.bind(this);
        this.onHandleDataSetChange = this.onHandleDataSetChange.bind(this);
        this.onHandleActionTabChange = this.onHandleActionTabChange.bind(this);
        this.searchBar = createRef();

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
            const { version } = generalUtils.parseQueryString(window.location.search);
            let countedQuestionAnswers = {},
                totalQuestions = '';

            if (datasetId) {
                // a) Dataset
                await this.loadSingleDatasetMode(datasetId);
                // Populate the question/answers count
                countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
            } else if (publisherId) {
                // b) Message Panel/Modal
                // Extract datasets passed from history (provided via request access click from modal)
                const { datasets: datasetIds } = this.props.location.state;
                const datasetIdsConcat = datasetIds.map(ds => ds.datasetId).join(',');
                await this.loadMultipleDatasetMode(datasetIdsConcat);
                // Populate the question/answers count
                countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
            } else if (accessId) {
                // c/d) Data Access Request/Direct Link (To be extended for readonly mode)
                await this.loadDataAccessRequest(accessId, version);
                // Populate the question/answers count if still in progress, otherwise display project status and date last updated
                const { applicationStatus, updatedAt } = this.state;
                if (applicationStatus === 'inProgress') {
                    countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this);
                    totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
                } else {
                    totalQuestions = `Application ${darHelperUtils.darSLAText[applicationStatus]} on ${moment(updatedAt).format(
                        'DD MMM YYYY HH:mm'
                    )}`;
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
                roles: authUtils.returnApplicantIfTeamNotFound(this.props.userState, this.state.datasets[0].datasetfields.publisher),
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
                        questionSetStatus,
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
                questionSetStatus,
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
                        questionSetStatus = {},
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
                questionSetStatus,
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
            questionSetStatus = {},
        } = context;
        let {
            datasetfields: { publisher },
        } = datasets[0];
        let { firstname, lastname } = mainApplicant || {};
        let showSubmit = false;
        let submitButtonText = 'Submit application';

        let publisherId = '',
            workflowEnabled = false;
        if (datasets[0].publisher) {
            ({ _id: publisherId, workflowEnabled } = datasets[0].publisher);
        }
        // 2. If user is custodian and the form is not in review, redirect the user to the DAR team dashboard
        if (userType === 'custodian' && applicationStatus === darHelperUtils.darStatus.submitted) {
            const alert = {
                publisher,
                tab: 'submitted',
            };
            this.props.history.push({
                pathname: `/account`,
                search: `?tab=dataaccessrequests&teamType=team&teamId=${publisherId}`,
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
        let topicContext = darHelperUtils.createTopicContext(aboutApplication.selectedDatasets);
        let modalContext = darHelperUtils.createModalContext(aboutApplication.selectedDatasets);
        let allowsMultipleDatasets = formType === '5 safe';

        jsonSchema = this.injectStaticContent(
            jsonSchema,
            inReviewMode,
            reviewSections,
            userType,
            areDatasetsAmended,
            allowsMultipleDatasets
        );

        // 7. Hide show submit application
        if (applicationStatus === darHelperUtils.darStatus.inProgress) {
            if (applicationType === darHelperUtils.darApplicationTypes.amendment) {
                submitButtonText = 'Submit amendment';
            }
            showSubmit = true;
        } else if (
            activeParty === 'applicant' &&
            ((applicationStatus === darHelperUtils.darStatus.inReview && answeredAmendments > 0 && unansweredAmendments === 0) ||
                applicationStatus === darHelperUtils.darStatus.submitted)
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
            isWideForm: initialPanel === darHelperUtils.darStaticPageIds.ABOUT,
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
            questionSetStatus,
        });
    };

    /**
     * InjectStaticContent
     * @desc Function to inject static 'about' and 'files' pages and panels into schema
     * @returns {jsonSchmea} object
     */
    injectStaticContent(jsonSchema = {}, inReviewMode = false, reviewSections = [], userType, areDatasetsAmended, allowsMultipleDatasets) {
        let { pages, formPanels } = { ...jsonSchema };
        // formPanel {pageId: 'safePeople', panelId:'applicant'}
        let formPanel = {};
        let currentPageIdx = 0;
        // check if About page has been injected

        let aboutNavElementsExist = [...pages].find(page => page.pageId === darHelperUtils.darStaticPageIds.ABOUT);
        let additionalfilesNavElementsExist = [...pages].find(page => page.pageId === darHelperUtils.darStaticPageIds.ADDITIONALFILES);

        if (!aboutNavElementsExist && allowsMultipleDatasets) {
            jsonSchema.pages.unshift(darHelperUtils.staticContent.aboutPageNav);
            jsonSchema.formPanels.unshift(darHelperUtils.staticContent.aboutPanel);
        }

        if (!additionalfilesNavElementsExist) {
            jsonSchema.pages.push(darHelperUtils.staticContent.filesPageNav);
            jsonSchema.formPanels.push(darHelperUtils.staticContent.filesPanel);
        } else {
            jsonSchema.formPanels.push(darHelperUtils.staticContent.additionalFilesPanel);
            jsonSchema.questionPanels.push(darHelperUtils.staticContent.additionalFilesQuestionPanel);
        }

        // if amendment has been made to datasets mark about application navigation with warning
        if (userType === 'custodian' && areDatasetsAmended) {
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
                page.pageId === darHelperUtils.darStaticPageIds.ABOUT ||
                page.pageId === darHelperUtils.darStaticPageIds.FILES ||
                page.pageId === darHelperUtils.darStaticPageIds.ADDITIONALFILES;

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
            let organisation = 'safepeopleotherindividualsorganisation';
            let orcid = 'safepeopleotherindividualsorcid';
            if (id.includes('_')) {
                const tempId = id.split('_')[1];
                organisation = `${organisation}_${tempId}`;
                orcid = `${orcid}_${tempId}`;
            }
            let contributor = questionAnswers[id];
            questionAnswers[id] = `${contributor.firstname} ${contributor.lastname}`;
            questionAnswers[organisation] = contributor.organisation;
            questionAnswers[orcid] = contributor.orcid;
        }

        if (!_.isEmpty(id) && !_.isEmpty(questionAnswers)) {
            let { lookup, activePanelId } = this.state;
            // 1. check for auto complete
            if (typeof id === 'string') {
                let [questionId, uniqueId] = id.split('_');
                let qId = questionId.toLowerCase();
                let lookupAutoComplete = [...lookup].includes(qId);
                if (lookupAutoComplete)
                    questionAnswers = darHelperUtils.autoComplete(qId, uniqueId, {
                        ...questionAnswers,
                    });
            }
            // 2. get totalQuestionAnswered
            let countedQuestionAnswers = {};
            let totalQuestions = '';
            // 3. total questions answered
            if (activePanelId === 'about' || activePanelId === 'additionalinformationfiles-files' || activePanelId === 'files') {
                countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
            } else {
                countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this, this.state.activePanelId, questionAnswers);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered in this section`;
            }
            // 4. set totalQuestionAnswered
            this.setState({ totalQuestions });
            // 5. remove blank vals from questionAnswers
            let data = _.pickBy({ ...this.state.questionAnswers, ...questionAnswers }, _.identity);
            const lastSaved = darHelperUtils.saveTime();
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
                        this.state.areDatasetsAmended,
                        true
                    );
                let schemaUpdates = _.omitBy(
                    {
                        unansweredAmendments,
                        answeredAmendments,
                        showSubmit: applicationStatus === darHelperUtils.darStatus.inProgress || unansweredAmendments === 0,
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
        let invalidQuestions = darValidationUtils.getQuestionPanelInvalidQuestions(
            Winterfell,
            this.state.jsonSchema.questionSets,
            this.state.questionAnswers
        );
        let validationSectionMessages = darValidationUtils.buildInvalidSectionMessages(Winterfell, invalidQuestions);
        let inValidMessages = darValidationUtils.buildInvalidMessages(Winterfell, invalidQuestions);
        let errors = darValidationUtils.formatValidationObj(inValidMessages, [...this.state.jsonSchema.questionPanels]);
        let isValid = Object.keys(errors).length ? false : true;

        if (isValid) {
            // if 'amendment' show new amendment modal
            this.state.applicationType === darHelperUtils.darApplicationTypes.amendment &&
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
                case darHelperUtils.darApplicationTypes.amendment:
                    data.description = description;
                    alert = {
                        tab: 'submitted',
                        message: `You have successfully submitted amendments to '${
                            this.state.projectName || this.state.datasets[0].name
                        }' application`,
                        publisher: 'user',
                    };
                    break;
                default:
                    alert = {
                        tab: this.state.applicationStatus === darHelperUtils.darStatus.inProgress ? 'submitted' : 'inReview',
                        message:
                            this.state.applicationStatus === darHelperUtils.darStatus.inProgress
                                ? 'Your application was submitted successfully'
                                : `You have successfully saved updates to '${
                                      this.state.projectName || this.state.datasets[0].name
                                  }' application`,
                        publisher: 'user',
                    };
                    break;
            }

            await axios.post(`${baseURL}/api/v1/data-access-request/${_id}`, { ...data });

            const lastSaved = darHelperUtils.saveTime();
            this.setState({ lastSaved });

            this.props.history.push({
                pathname: '/account',
                search: '?tab=dataaccessrequests&teamType=user',
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
            const lastSaved = darHelperUtils.saveTime();
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
        const { panelId, pageId } = darHelperUtils.findNextPanel(
            this.state.activePanelId,
            this.state.questionSetStatus,
            this.state.jsonSchema
        );

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
                const filteredPanels = [...this.state.jsonSchema.formPanels].filter((p, i) => {
                    return p.pageId === newFormState[newPageindex].pageId;
                });

                ({ panelId } = filteredPanels[0]);
            }

            let countedQuestionAnswers = {};
            let totalQuestions = '';
            // if in the about panel, retrieve question answers count for entire application
            if (panelId === 'about' || panelId === 'additionalinformationfiles-files' || panelId === 'files') {
                countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions || 0}/${
                    countedQuestionAnswers.totalQuestions || 0
                }  questions answered`;
            } else {
                countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(this, panelId);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions || 0}/${
                    countedQuestionAnswers.totalQuestions || 0
                }  questions answered in this section`;
            }

            // reset guidance - due to on change of panel
            let jsonSchema = this.state.jsonSchema;
            this.setState({
                jsonSchema: { ...jsonSchema, pages: newFormState },
                activePanelId: panelId,
                activePanelHeader: newForm.panelHeader,
                activeQuestionPanelHeaderText: newForm.questionPanelHeaderText,
                activePageId: 0,
                isWideForm: panelId === 'about' || panelId === 'files',
                totalQuestions: totalQuestions,
                validationErrors,
                reviewWarning,
                activeGuidance: '',
                activePanelGuidance: newForm.panelGuidance,
                actionTabSettings: {
                    key: '',
                    questionSetId: '',
                    questionId: '',
                    panel: {
                        panelId,
                        panelHeader: newForm.questionPanelHeaderText,
                    },
                },
            });
        }
    };

    onClickSave = e => {
        e.preventDefault();
        const lastSaved = darHelperUtils.saveTime();
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
        const questionSet = darHelperUtils.findQuestionSet(questionSetId, { ...this.state.jsonSchema });
        if (!_.isEmpty(questionSet) && !_.isEmpty(questionId)) {
            // deconstruct action to invoke from schema
            let {
                input: { action = '', questionIds = [], separatorText = '' },
            } = darHelperUtils.getActiveQuestion(questionSet.questions, questionId);
            // ensure valid action was found for question set button click
            if (_.isEmpty(action)) {
                return console.error(`Action could not be invoked for question set - ${questionSetId}, question - ${questionId}`);
            }
            // call API with action, questionId and questionSetId
            const stateObj = await this.postQuestionSetAction(questionSetId, questionId, questionIds, action, separatorText);
            // count question/answers for the current section
            const countedQuestionAnswers = darHelperUtils.totalQuestionsAnswered(
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
            this.state.areDatasetsAmended,
            true
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
            case darHelperUtils.actionKeys.GUIDANCE:
                const activeGuidance = this.getActiveQuestionGuidance(questionId);
                if (!_.isEmpty(e)) {
                    this.removeActiveQuestionClass();
                    this.addActiveQuestionClass(e);
                }
                this.setState({ activeGuidance, actionTabSettings: { key, questionSetId, questionId } });
                break;
            case darHelperUtils.actionKeys.MESSAGES:
                // call api with question set id and question id to get msgs
                if (!_.isEmpty(e)) {
                    this.removeActiveQuestionClass();
                    this.addActiveQuestionClass(e);
                }

                this.setState({ actionTabSettings: { key, questionSetId, questionId } });
                break;
            case darHelperUtils.actionKeys.NOTES:
                // call api with question set id and question id to get notes
                if (!_.isEmpty(e)) {
                    this.removeActiveQuestionClass();
                    this.addActiveQuestionClass(e);
                }
                this.setState({ actionTabSettings: { key, questionSetId, questionId } });
                break;
            case darHelperUtils.actionKeys.REQUESTAMENDMENT:
                mode = darHelperUtils.amendmentModes.ADDED;
                stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
                this.setState({ ...stateObj });
                break;
            case darHelperUtils.actionKeys.CANCELREQUEST:
                mode = darHelperUtils.amendmentModes.REMOVED;
                stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
                this.setState({ ...stateObj });
                break;
            case darHelperUtils.actionKeys.REVERTTOPREVIOUSANSWER:
                mode = darHelperUtils.amendmentModes.REVERTED;
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
                let activeQuestion = darHelperUtils.getActiveQuestion([...questions], questionId);
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
            case darHelperUtils.actionKeys.GUIDANCE:
                this.setState({ activeGuidance, actionTabSettings: settings });
                break;
            case darHelperUtils.actionKeys.MESSAGES:
                // call api for messages
                this.setState({ actionTabSettings: settings });
                break;
            case darHelperUtils.actionKeys.NOTES:
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
            this.state.areDatasetsAmended,
            true
        );

        let stateObj = _.omitBy(
            {
                jsonSchema,
                questionAnswers,
                answeredAmendments,
                unansweredAmendments,
                amendmentIterations,
                showSubmit:
                    this.state.applicationStatus === darHelperUtils.darStatus.inProgress ||
                    (unansweredAmendments === 0 && answeredAmendments > 0 && this.state.userType === PERMISSIONS_TEAM_ROLES.applicant),
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
        let { jsonSchema } = this.state;
        let questionSet = darHelperUtils.findQuestionSet(questionSetId, jsonSchema);

        if (questionId) {
            //Get the question that the count needs to be updated on

            let question = darHelperUtils.findQuestion(questionId, questionSet.questions);

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
        }
    };

    onHandleDataSetChange = (value = []) => {
        // 1. Deconstruct current state
        let { aboutApplication, allowedNavigation, topicContext } = { ...this.state };
        aboutApplication.selectedDatasets = [...value];

        // 3. If no datasets are passed, set invalid and incomplete step, and update message context
        if (_.isEmpty(value)) {
            let emptyTopicContext = darHelperUtils.createTopicContext();
            aboutApplication.completedDatasetSelection = false;
            allowedNavigation = false;
            topicContext = {
                ...topicContext,
                ...emptyTopicContext,
            };
        } else {
            let updatedTopicContext = darHelperUtils.createTopicContext(aboutApplication.selectedDatasets);
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
                    nav: 'dataaccessrequests',
                    tab: 'inReview',
                    message: `You have successfully sent your recommendation for your assigned phase of ${this.state.aboutApplication.projectName} project`,
                };

                // 4. redirect with Publisher name, Status: reject, approved, key of tab: presubmission, inreview, approved, rejected
                this.props.history.push({
                    pathname: `/account`,
                    search: `?tab=dataaccessrequests&teamType=team&teamId=${this.state.datasets[0].publisher._id}`,
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
        if (!_.isEmpty(type)) actionModalConfig = darHelperUtils.configActionModal(type);
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
            search: '?tab=dataaccessrequests&teamType=user',
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
                    nav: 'dataaccessrequests',
                    tab: this.tabState[type],
                    message: `You have ${this.tabState[type]} the data access request for ${this.state.publisher}`,
                };
                // 3. hide screen modal for approve, reject, approve with comments
                this.toggleActionModal();

                // 4. redirect with Publisher name, Status: reject, approved, key of tab: presubmission, inreview, approved, rejected
                this.props.history.push({
                    pathname: `/account`,
                    search: `?tab=dataaccessrequests&teamType=team&teamId=${this.state.datasets[0].publisher._id}`,
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
                        ({ question } = darHelperUtils.getActiveQuestion(questions, key));
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
        if (this.state.applicationStatus === darHelperUtils.darStatus.inReview) {
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
                search: '?tab=dataaccessrequests&teamType=user',
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
                    readOnly={this.state.readOnly || this.state.applicationStatus !== darHelperUtils.darStatus.inProgress}
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
        } else if (activePanelId === 'additionalinformationfiles-files' || activePanelId === 'files') {
            return (
                <Uploads
                    onFilesUpdate={this.onFilesUpdate}
                    id={this.state._id}
                    files={this.state.files}
                    readOnly={this.state.readOnly}
                    description={this.state.activePanelHeader}
                    header={this.state.activeQuestionPanelHeaderText}
                />
            );
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
            activePanelGuidance,
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
                            searchBarHelperUtils.doSearch(e, this);
                        }}
                        doUpdateSearchString={e => {
                            searchBarHelperUtils.updateSearchString(e, this);
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
                            <span className='white-14-semibold'>{darHelperUtils.getSavedAgo(lastSaved)}</span>
                            {
                                <a
                                    className={`linkButton white-14-semibold ml-2 ${allowedNavigation ? '' : 'disabled'}`}
                                    onClick={this.onClickSave}
                                    href='#'>
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
                                            className={`${
                                                !this.state.inReviewMode ? 'black-16' : item.inReview ? 'black-16' : 'section-not-inreview'
                                            }
										${item.active ? 'section-header-active' : 'section-header'} 
										${this.state.allowedNavigation ? '' : 'disabled'}`}
                                            onClick={e => this.updateNavigation(item)}>
                                            <span>{item.title}</span>
                                            <span>{item.flag && <i className={darHelperUtils.flagIcons[item.flag]} />}</span>
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
                                                    questionSetStatus={this.state.questionSetStatus}
                                                />
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div id='darCenterCol' className={isWideForm ? 'extended' : ''}>
                            {this.state.reviewWarning && (
                                <Alert variant='warning'>You are not assigned to this section but can still view the form</Alert>
                            )}
                            {!_.isEmpty(alert) && <Alert variant='success'>{alert.message}</Alert>}
                            {/* <div id='darDropdownNav'>
                                <NavDropdown
                                    options={{
                                        ...this.state.jsonSchema,
                                        allowsMultipleDatasets: this.state.allowsMultipleDatasets,
                                    }}
                                    onFormSwitchPanel={this.updateNavigation}
                                    enabled={allowedNavigation}
                                />
                            </div> */}
                            <div style={{ backgroundColor: '#ffffff' }} className='dar__header'>
                                {this.state.jsonSchema.pages
                                    ? [...this.state.jsonSchema.pages].map((item, idx) =>
                                          item.active ? (
                                              <Fragment key={`pageContent-${idx}`}>
                                                  <p className='black-20-semibold mb-0'>{item.active ? item.title : ''}</p>
                                                  <RenderMarkdown className='gray800-14' source={item.description} />
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

                        <div id='darRightCol' className='scrollable-sticky-column'>
                            <div className='darTab'>
                                <QuestionActionTabs
                                    applicationId={this.state._id}
                                    userState={userState}
                                    settings={this.state.actionTabSettings}
                                    activeGuidance={activeGuidance}
                                    activePanelGuidance={activePanelGuidance}
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
                    </div>

                    <ActionBar userState={userState}>
                        <div className='action-bar'>
                            <div className='action-bar--questions'>
                                {applicationStatus === 'inProgress' ? (
                                    ''
                                ) : (
                                    <SLA
                                        classProperty={darHelperUtils.darStatusColours[applicationStatus]}
                                        text={darHelperUtils.darSLAText[applicationStatus]}
                                    />
                                )}
                                <div className='action-bar-status'>
                                    {totalQuestions} &nbsp;|&nbsp; {projectId}
                                </div>
                            </div>
                            <div className='action-bar-actions'>
                                <AmendmentCount
                                    answeredAmendments={this.state.answeredAmendments}
                                    unansweredAmendments={this.state.unansweredAmendments}
                                />
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
                                        hasNext={
                                            !!darHelperUtils.findNextPanel(
                                                this.state.activePanelId,
                                                this.state.questionSetStatus,
                                                this.state.jsonSchema
                                            )
                                        }
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
                                        teamId={this.state.datasets[0].publisher._id}
                                        hasNext={
                                            !!darHelperUtils.findNextPanel(
                                                this.state.activePanelId,
                                                this.state.questionSetStatus,
                                                this.state.jsonSchema
                                            )
                                        }
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
                        <AsyncTypeAheadUsers
                            selectedUsers={this.state.authorIds}
                            changeHandler={this.updateContributors}
                            shouldGetUsersInfo={true}
                            currentUserId={this.state.userId}
                        />
                    </ContributorModal>

                    <AssignWorkflowModal
                        open={showAssignWorkflowModal}
                        close={this.toggleAssignWorkflowModal}
                        applicationId={this.state._id}
                        publisherId={this.state.datasets[0].publisher._id}
                        publisher={datasets[0].datasetfields.publisher}
                        workflows={this.state.workflows}
                    />

                    <UpdateRequestModal
                        open={this.state.updateRequestModal}
                        close={this.toggleUpdateRequestModal}
                        publisher={this.state.publisher}
                        publisherId={this.state.datasets[0].publisher._id}
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
                            Are you sure you want to email yourself this application? This will be sent to the email address provided in
                            your HDR UK account, where it will be available for you to print.
                        </div>
                        <div className='workflowModal-footer'>
                            <div className='workflowModal-footer--wrap'>
                                <Button variant='secondary' className='techDetailButton mr-2' onClick={e => this.toggleEmailModal(false)}>
                                    No, nevermind
                                </Button>
                                <Button onClick={this.onClickMailDAR}>Email application</Button>
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
                            this.onFormSubmit({ type: darHelperUtils.darApplicationTypes.amendment, description: amendDescription });
                        }}
                    />
                    <DeleteDraftModal
                        open={this.state.showDeleteDraftModal}
                        close={this.toggleDeleteDraftModal}
                        confirm={this.onDeleteDraft}
                    />

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
