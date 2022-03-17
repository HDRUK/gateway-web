import React, { Component, Fragment, useState } from 'react';
import { OverlayTrigger, Tooltip, Container, Row, Col } from 'react-bootstrap';
import Winterfell from 'winterfell';
import * as Sentry from '@sentry/react';
import _ from 'lodash';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadAsyncCustom from './components/TypeaheadAsyncCustom';
import TypeaheadCustomKeyValue from './components/TypeaheadCustom/TypeaheadCustomKeyValue';
import TypeaheadKeywords from './components/TypeaheadKeywords/TypeaheadKeywords';
import TextareaInputCustom from '../commonComponents/TextareaInputCustom/TextareaInputCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import MultiField from './components/MultiField/MultiField';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import NavItem from './components/NavItem/NavItem';
import DatasetOnboardingValidation from '../../utils/DatasetOnboardingValidation.util';
import DatasetOnboardingHelper from '../../utils/DatasetOnboardingHelper.util';
import SearchBarHelperUtil from '../../utils/SearchBarHelper.util';
import { classSchema } from './classSchema';
import { baseURL } from '../../configs/url.config';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import 'react-tabs/style/react-tabs.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './DatasetOnboarding.scss';
import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import moment from 'moment';
import AmendmentCount from './components/AmendmentCount/AmendmentCount';
import ApplicantActionButtons from './components/ApplicantActionButtons/ApplicantActionButtons';
import CustodianActionButtons from './components/CustodianActionButtons/CustodianActionButtons';
import SLA from '../commonComponents/sla/SLA';
import BeforeYouBegin from './components/BeforeYouBegin/BeforeYouBegin';
import Guidance from './components/Guidance/Guidance';
import StructuralMetadata from './components/StructuralMetadata/StructuralMetadata';
import StatusDisplay from '../commonComponents/StatusDisplay';

import ActionModal from './components/ActionModal/ActionModal';

import Dropdown from 'react-bootstrap/Dropdown';

import { formSchema } from './formSchema';
import DatasetOnboardingHelperUtil from '../../utils/DatasetOnboardingHelper.util';
import ActionBarStatus from '../../components/ActionBarStatus';
import ErrorModal from '../commonComponents/errorModal';

/* export const DatasetOnboarding = props => {
    const [id] = useState('');
    


} */

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
        href='javascript:void(0)'
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </a>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className='list-unstyled margin-bottom-0'>
                {React.Children.toArray(children).filter(child => !value || child.props.children.toLowerCase().startsWith(value))}
            </ul>
        </div>
    );
});

class DatasetOnboarding extends Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormUpdate = this.onFormUpdate.bind(this);
        //this.onHandleDataSetChange = this.onHandleDataSetChange.bind(this);
        this.searchBar = React.createRef();

        this.state = {
            _id: '',
            activePanelId: '',
            activeGuidance: '',
            amendmentIterations: [],
            jsonSchema: {},
            questionAnswers: {},
            structuralMetadataErrors: [],
            structuralMetadata: [],
            listOfDatasets: [],
            applicationStatus: '',
            searchString: '',
            totalQuestions: '',
            validationErrors: {},
            lastSaved: '',
            lookup: [],
            isLoading: true,
            name: '',
            datasetVersion: '',
            activeflag: '',
            publisher: '',
            showDrawer: false,
            showActionModal: false,
            actionModalConfig: {},

            readOnly: false,
            userType: '',
            answeredAmendments: 0,
            unansweredAmendments: 0,
            isWideForm: false,
            isTableForm: false,
            activeAccordionCard: 0,
            allowedNavigation: true,
            topicContext: {},
            reviewSections: [],
            roles: [],
            inReviewMode: false,
            updateRequestModal: false,
            completion: {},
        };

        this.onChangeDebounced = _.debounce(this.onChangeDebounced, 300);
    }

    applicationState = {
        CONFIRMAPPROVALCONDITIONS: 'approved with conditions',
        CONFIRMREJECTION: 'rejected',
        CONFIRMAPPROVAL: 'approved',
        ARCHIVE: 'archive',
        UNARCHIVE: 'unarchive',
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
            const { id: _id } = this.props.match.params;
            let countedQuestionAnswers = {},
                totalQuestions = '';

            try {
                // 1. Make API call to find and return the application form schema and answers matching this Id
                let response = await axios.get(`${baseURL}/api/v1/dataset-onboarding/${_id}`);
                // 2. Destructure backend response for this context containing details of DAR including question set and current progress
                let {
                    data: {
                        data,
                        data: {
                            dataset: { questionAnswers, structuralMetadata },
                        },
                        listOfDatasets,
                    },
                } = response;
                // 3. Set up the DAR
                this.setScreenData({
                    ...data,
                    _id,
                    questionAnswers,
                    structuralMetadata,
                    listOfDatasets,
                    jsonSchema: { ...formSchema },
                    applicationStatus: data.dataset.activeflag,
                });
            } catch (error) {
                this.setState({ isLoading: false });
                console.error(error);
            }

            countedQuestionAnswers = DatasetOnboardingHelperUtil.totalQuestionsAnswered(this);
            totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
            let percentageCompleted = DatasetOnboardingHelperUtil.getCompletionPercentages(this);
            if (!_.isEmpty(this.state.structuralMetadata) && _.isEmpty(this.state.structuralMetadataErrors))
                percentageCompleted.updatedCompletion.structural = 100;
            else percentageCompleted.updatedCompletion.structural = 0;

            // Update state to display question answer count
            this.setState({
                totalQuestions,
                completion: percentageCompleted.updatedCompletion,
            });
        } catch (error) {
            this.setState({ isLoading: false });
            console.error(error);
        }
    }

    //builder for the data for the form

    setScreenData = async context => {
        // 1. Destructure DAR context containing questions and any application progress
        let {
            jsonSchema,
            questionAnswers = {},
            structuralMetadata = [],
            listOfDatasets = [],
            _id,
            amendmentIterations = [],
            applicationStatus,
            dataset,
            readOnly = false,
            userType = 'EDITOR',
            unansweredAmendments = 0,
            answeredAmendments = 0,
            inReviewMode = false,
            reviewSections = [],
        } = context;

        let { name, datasetVersion, activeflag } = dataset;

        let showSubmit = false;
        let submitButtonText = 'Submit for review';
        let showCreateNewVersion = false;
        let showArchive = false;
        let showUnArchive = false;
        let showDeleteDraft = false;

        let publisher = dataset.datasetv2.summary.publisher.identifier;

        this.setState({ roles: this.getUserRoles() });
        if (this.state.roles.includes('admin') && applicationStatus === DatasetOnboardingHelper.datasetStatus.inReview) userType = 'ADMIN';

        jsonSchema = this.injectStaticContent(jsonSchema, inReviewMode, reviewSections);
        jsonSchema = this.injectObservations(jsonSchema, questionAnswers);

        let isLatestVersion = listOfDatasets[0]._id === _id ? true : false;
        let isThereALiveVersion = listOfDatasets.filter(x => x.activeflag === 'active').length > 0 ? true : false;

        if (applicationStatus === DatasetOnboardingHelper.datasetStatus.draft) {
            showSubmit = true;
            showDeleteDraft = true;
            //if (isLatestVersion) showArchive = true;
        } else if (applicationStatus === DatasetOnboardingHelper.datasetStatus.rejected) {
            if (isLatestVersion) showCreateNewVersion = true;
            readOnly = true;
        } else if (applicationStatus === DatasetOnboardingHelper.datasetStatus.archive) {
            if (!isThereALiveVersion && isLatestVersion) showCreateNewVersion = true;
            readOnly = true;
        } else if (applicationStatus !== DatasetOnboardingHelper.datasetStatus.inReview) {
            if (isLatestVersion) showCreateNewVersion = true;
            showArchive = true;
            readOnly = true;
        }

        let initialPanel = jsonSchema.formPanels[0].panelId;

        // 9. Set state
        this.setState({
            jsonSchema: { ...jsonSchema, ...classSchema },
            dataset,
            questionAnswers,
            structuralMetadata,
            listOfDatasets,
            _id,
            amendmentIterations,
            applicationStatus,
            activePanelId: initialPanel,
            isWideForm: initialPanel === DatasetOnboardingHelper.darStaticPageIds.BEFOREYOUBEGIN,
            isTableForm: initialPanel === DatasetOnboardingHelper.darStaticPageIds.STRUCTURAL,
            isLoading: false,
            name,
            datasetVersion,
            activeflag,
            publisher,
            readOnly,
            answeredAmendments,
            unansweredAmendments,
            userType,
            showSubmit,
            submitButtonText,
            showCreateNewVersion,
            showArchive,
            showUnArchive,
            showDeleteDraft,
            inReviewMode,
            reviewSections,
        });
    };

    /**
     * injectObservations
     * @desc Function to inject observation questions into schema
     * @returns {jsonSchmea} object
     */
    injectObservations(jsonSchema = {}, questionAnswers = {}) {
        let { questions } = DatasetOnboardingHelperUtil.findQuestionSet('observations', {
            ...jsonSchema,
        });
        let listOfObservationFields = questions.map(x => x.questionId).flat();

        let listOfObservationUniqueIds = [];
        listOfObservationFields.forEach(field => {
            Object.keys(questionAnswers).some(function (key) {
                let regex = new RegExp(field.toLowerCase().replace(/\//g, '\\/') + '_', 'g');
                if (key.toLowerCase().match(regex)) {
                    let [, uniqueId] = key.split('_');
                    if (!_.isEmpty(uniqueId) && !listOfObservationUniqueIds.find(x => x === uniqueId)) {
                        listOfObservationUniqueIds.push(uniqueId);
                    }
                }
            });
        });

        listOfObservationUniqueIds.forEach(uniqueId => {
            let duplicateQuestionSet = DatasetOnboardingHelperUtil.questionSetToDuplicate('add-observations', { ...jsonSchema }, uniqueId);
            jsonSchema = DatasetOnboardingHelperUtil.insertSchemaUpdates('add-observations', duplicateQuestionSet, { ...jsonSchema });
        });

        return jsonSchema;
    }

    /**
     * InjectStaticContent
     * @desc Function to inject static 'about' and 'files' pages and panels into schema
     * @returns {jsonSchmea} object
     */
    injectStaticContent(jsonSchema = {}, inReviewMode = false, reviewSections = []) {
        let { pages, formPanels } = { ...jsonSchema };
        // formPanel {pageId: 'safePeople', panelId:'applicant'}
        let formPanel = {};
        let currentPageIdx = 0;
        // check if About page has been injected
        let navElementsExist = [...pages].find(page => page.pageId === DatasetOnboardingHelper.darStaticPageIds.BEFOREYOUBEGIN) || false;
        // 2. About page does not exist
        if (!navElementsExist) {
            // Append 'about' & 'files' panel and nav item
            jsonSchema.pages.unshift(DatasetOnboardingHelper.staticContent.beforeYouBeginPageNav);
            jsonSchema.pages.push(DatasetOnboardingHelper.staticContent.structuralPageNav);
            // Add form panel for 'about' & 'files'
            jsonSchema.formPanels.unshift(DatasetOnboardingHelper.staticContent.beforeYouBeginPanel);
            jsonSchema.formPanels.push(DatasetOnboardingHelper.staticContent.structuralPanel);
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
                page.pageId === DatasetOnboardingHelper.darStaticPageIds.BEFOREYOUBEGIN ||
                page.pageId === DatasetOnboardingHelper.darStaticPageIds.STRUCTURAL;

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
        if (!_.isEmpty(id) && !_.isEmpty(questionAnswers) && !this.state.readOnly) {
            let { lookup, activePanelId } = this.state;
            // 1. check for auto complete
            if (typeof id === 'string') {
                let [questionId, uniqueId] = id.split('_');
                let qId = questionId.toLowerCase();
                let lookupAutoComplete = [...lookup].includes(qId);
                if (lookupAutoComplete)
                    questionAnswers = DatasetOnboardingHelper.autoComplete(qId, uniqueId, {
                        ...questionAnswers,
                    });
            }
            // 2. get totalQuestionAnswered
            let countedQuestionAnswers = {};
            let totalQuestions = '';
            // 3. total questions answered
            if (activePanelId === 'beforeYouBegin' || activePanelId === 'structural') {
                countedQuestionAnswers = DatasetOnboardingHelperUtil.totalQuestionsAnswered(this);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered`;
            } else {
                countedQuestionAnswers = DatasetOnboardingHelperUtil.totalQuestionsAnswered(
                    this,
                    this.state.activePanelId,
                    questionAnswers
                );
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions}/${countedQuestionAnswers.totalQuestions}  questions answered in this section`;
            }
            let percentageCompleted = DatasetOnboardingHelperUtil.getCompletionPercentages(this);
            if (!_.isEmpty(this.state.structuralMetadata) && _.isEmpty(this.state.structuralMetadataErrors))
                percentageCompleted.updatedCompletion.structural = 100;
            else percentageCompleted.updatedCompletion.structural = 0;
            // 4. set totalQuestionAnswered
            this.setState({ totalQuestions, completion: percentageCompleted.updatedCompletion });
            // 5. remove blank vals from questionAnswers
            let data = _.pickBy({ ...this.state.questionAnswers, ...questionAnswers }, _.identity);
            const lastSaved = DatasetOnboardingHelper.saveTime();
            // 6. create dataObject
            let dataObj = { key: 'questionAnswers', data };
            // 7. Immediately update the state
            this.setState({ [`${dataObj.key}`]: { ...dataObj.data }, lastSaved });
            // 8. Execute the debounced onChange method API CALL
            this.onChangeDebounced(dataObj, id, percentageCompleted.updatedCompletion);
        }
    };

    onChangeDebounced = (obj = {}, updatedQuestionId, percentageCompleted) => {
        try {
            let { _id: id } = this.state;
            // 1. deconstruct
            let { key, data = {} } = obj;
            // 2. set body params
            let params = {
                [`${key}`]: JSON.stringify(data),
                updatedQuestionId,
                percentageCompleted,
            };
            // 3. API Patch call
            //axios.patch(`${baseURL}/api/v1/dataset-onboarding/${pid}/${datasetId}`, params).then(response => {
            axios.patch(`${baseURL}/api/v1/dataset-onboarding/${id}`, params).then(response => {
                if (response.data.name) this.setState({ name: response.data.name });
                /* let {
					data: { unansweredAmendments = 0, answeredAmendments = 0, jsonSchema = null },
				} = response;
				let { applicationStatus } = this.state;
				// 4. remove blank values from schema updates - omit values if they are blank, important for jsonSchema
				if(!_.isNil(jsonSchema))
					jsonSchema = this.injectStaticContent(jsonSchema, false, this.state.reviewSections);

				let schemaUpdates = 	_.omitBy({
					unansweredAmendments,
					answeredAmendments,
					showSubmit: applicationStatus === DatasetOnboardingHelper.datasetStatus.inProgress || answeredAmendments > 0,
					jsonSchema
				}, _.isNil);

				this.setState({
					...schemaUpdates
				}); */
            });
        } catch (error) {
            console.log(`API PUT ERROR ${error}`);
        }
    };

    /**
     * [Form Submit]
     * @desc Submitting data access request
     * @params  Object{questionAnswers}
     */
    onFormSubmit = async () => {
        let invalidQuestions = DatasetOnboardingValidation.getQuestionPanelInvalidQuestions(
            Winterfell,
            this.state.jsonSchema.questionSets,
            this.state.questionAnswers
        );

        let validationSectionMessages = DatasetOnboardingValidation.buildInvalidSectionMessages(Winterfell, invalidQuestions);
        let inValidMessages = DatasetOnboardingValidation.buildInvalidMessages(Winterfell, invalidQuestions);
        let errors = DatasetOnboardingValidation.formatValidationObj(inValidMessages, [...this.state.jsonSchema.questionPanels]);
        let isValid = Object.keys(errors).length ? false : true;

        if (isValid) {
            this.toggleActionModal('SUBMITFORREVIEW');
        } else if (this.userRoleIsAdmin(this.state.publisher)) {
            this.toggleActionModal('VALIDATIONERRORSADMIN');
        } else {
            let activePage = _.get(_.keys({ ...errors }), 0);
            let activePanel = _.get(_.keys({ ...errors }[activePage]), 0);
            let validationMessages = validationSectionMessages;

            this.toggleActionModal('VALIDATIONERRORS');

            //alert('Some validation issues have been found. Please see all items highlighted in red on this page.');
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
                [`${key}`]: JSON.stringify(data),
            };
            // 4. PATCH the data
            const response = await axios.patch(`${baseURL}/api/v1/dataset-onboarding/${id}`, params);
            // 6. Get saved time
            const lastSaved = DatasetOnboardingHelper.saveTime();
            // 5. Set state
            this.setState({ [`${key}`]: { ...data }, lastSaved });
        } catch (err) {
            console.log(err);
        }
    };

    onNextClick = () => {
        // 1. If in the about panel, we go to the next step.  Otherwise next panel.
        if (this.state.activePanelId === 'beforeYouBegin') {
            // 2. Set new state
            let currentActiveAccordionCard = this.state.activeAccordionCard;
            this.setState({
                activeAccordionCard: ++currentActiveAccordionCard,
            });

            // 3. If we have reached the end of the about accordion, reset active accordion so all are closed
            if (this.state.activeAccordionCard >= 4) {
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
            // reset scroll to 0, 0
            window.scrollTo(0, 0);
            let panelId = '';
            // copy state pages
            const pages = [...this.state.jsonSchema.pages];
            // get the index of new form
            const newPageindex = pages.findIndex(page => page.pageId === newForm.pageId);
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
            if (panelId === 'beforeYouBegin' || panelId === 'structural') {
                countedQuestionAnswers = DatasetOnboardingHelperUtil.totalQuestionsAnswered(this);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions || 0}/${
                    countedQuestionAnswers.totalQuestions || 0
                }  questions answered`;
            } else {
                countedQuestionAnswers = DatasetOnboardingHelperUtil.totalQuestionsAnswered(this, panelId);
                totalQuestions = `${countedQuestionAnswers.totalAnsweredQuestions || 0}/${
                    countedQuestionAnswers.totalQuestions || 0
                }  questions answered in this section`;
            }
            let percentageCompleted = DatasetOnboardingHelperUtil.getCompletionPercentages(this);
            if (!_.isEmpty(this.state.structuralMetadata) && _.isEmpty(this.state.structuralMetadataErrors))
                percentageCompleted.updatedCompletion.structural = 100;
            else percentageCompleted.updatedCompletion.structural = 0;

            // reset guidance - due to on change of panel
            let jsonSchema = this.state.jsonSchema;
            this.setState({
                jsonSchema: { ...jsonSchema, pages: newFormState },
                activePanelId: panelId,
                isWideForm: panelId === 'beforeYouBegin',
                isTableForm: panelId === 'structural',
                totalQuestions: totalQuestions,
                validationErrors,
                activeGuidance: '',
                completion: percentageCompleted.updatedCompletion,
            });
        }
    };

    onClickSave = e => {
        e.preventDefault();
        const lastSaved = DatasetOnboardingHelper.saveTime();
        this.setState({ lastSaved });
    };

    /**
     * [onQuestionClick]
     * @desc Add's or Removes applicants dynamically
     *
     * @param   {string}  questionSetId  [questionSetId]
     * @param   {string}  questionId     [questionId]
     */
    onQuestionClick = async (questionSetId = '', questionId = '') => {
        let questionSet, jsonSchema, questionAnswers, schema;

        questionSet = DatasetOnboardingHelperUtil.findQuestionSet(questionSetId, {
            ...this.state.jsonSchema,
        });

        if (!_.isEmpty(questionSet) && !_.isEmpty(questionId)) {
            // remove about and files from pages to stop duplicate, about / files added to DAR on init
            schema = DatasetOnboardingHelperUtil.removeStaticPages({ ...this.state.jsonSchema });

            let {
                input: { action },
            } = DatasetOnboardingHelperUtil.findQuestion(questionId, questionSet);
            switch (action) {
                case 'addObservation':
                    let duplicateQuestionSet = DatasetOnboardingHelperUtil.questionSetToDuplicate(questionSetId, { ...schema });
                    jsonSchema = DatasetOnboardingHelperUtil.insertSchemaUpdates(questionSetId, duplicateQuestionSet, { ...schema });
                    this.setState({
                        jsonSchema,
                    });
                    break;
                case 'removeObservation':
                    jsonSchema = DatasetOnboardingHelperUtil.removeQuestionReferences(questionSetId, questionId, { ...schema });
                    questionAnswers = DatasetOnboardingHelperUtil.removeQuestionAnswers(questionId, { ...this.state.questionAnswers });
                    await this.updateApplication({ key: 'questionAnswers', data: questionAnswers });
                    break;
                default:
                    console.log(questionSetId);
                    break;
            }
        }
    };

    /**
     * onQuestionAction
     * @desc 	Event raised from Winterfell for secondary question events
     * @params {event, questionSetId, questionId, key}
     */
    onQuestionAction = async (e = '', questionSetId = '', questionId = '', key = '') => {
        let mode, stateObj;
        switch (key) {
            case DatasetOnboardingHelper.actionKeys.GUIDANCE:
                const activeGuidance = this.getActiveQuestionGuidance(questionId);
                if (!_.isEmpty(e)) {
                    this.removeActiveQuestionClass();
                    this.addActiveQuestionClass(e);
                }
                this.setState({ activeGuidance });
                break;
            case DatasetOnboardingHelper.actionKeys.REQUESTAMENDMENT:
                mode = DatasetOnboardingHelper.amendmentModes.ADDED;
                stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
                this.setState({ ...stateObj });
                break;
            case DatasetOnboardingHelper.actionKeys.CANCELREQUEST:
                mode = DatasetOnboardingHelper.amendmentModes.REMOVED;
                stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
                this.setState({ ...stateObj });
                break;
            case DatasetOnboardingHelper.actionKeys.REVERTTOPREVIOUSANSWER:
                mode = DatasetOnboardingHelper.amendmentModes.REVERTED;
                stateObj = await this.postQuestionAction(questionSetId, questionId, mode);
                this.setState({ ...stateObj });
                break;
            default:
                console.log(questionId);
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
                let activeQuestion = DatasetOnboardingHelper.getActiveQuestion([...questions], questionId);
                if (!_.isEmpty(activeQuestion)) {
                    const { guidance } = activeQuestion;
                    return guidance;
                }
                return '';
            }
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
        jsonSchema = this.injectStaticContent(jsonSchema, this.state.inReviewMode, this.state.reviewSections);

        let stateObj = _.omitBy(
            {
                jsonSchema,
                questionAnswers,
                answeredAmendments,
                unansweredAmendments,
                amendmentIterations,
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

    onCustodianAction = value => {
        this.toggleActionModal(value);
    };

    onStructuralMetaDataUpdate = (structuralMetadata, structuralMetadataErrors) => {
        let percentageCompleted = DatasetOnboardingHelperUtil.getCompletionPercentages(this);
        if (!_.isEmpty(structuralMetadata) && _.isEmpty(structuralMetadataErrors)) percentageCompleted.updatedCompletion.structural = 100;
        else percentageCompleted.updatedCompletion.structural = 0;
        this.setState({
            structuralMetadata,
            structuralMetadataErrors,
            completion: percentageCompleted.updatedCompletion,
        });
    };

    toggleCard = (e, eventKey) => {
        e.preventDefault();
        // 1. Deconstruct current state
        let { activeAccordionCard } = this.state;
        if (activeAccordionCard === eventKey) {
            eventKey = -1;
        }
        // 2. Set new state
        this.setState({
            activeAccordionCard: eventKey,
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

    onEditForm = async () => {
        this.setState({
            readOnly: false,
            showSubmit: false,
            submitButtonText: 'Submit updates',
        });
    };

    toggleCreateNewVersionModal = () => {
        this.toggleActionModal('CREATENEWVERSION');
    };

    toggleArchiveModal = () => {
        this.toggleActionModal('ARCHIVE');
    };

    toggleUnArchiveModal = () => {
        this.toggleActionModal('UNARCHIVE');
    };

    toggleDeleteDraftModal = () => {
        this.toggleActionModal('DELETEDRAFT');
    };

    toggleDuplicateModal = () => {
        this.toggleActionModal('DUPLICATE');
    };

    toggleActionModal = (type = '') => {
        let actionModalConfig = {};
        // 1. get basic modal config
        if (!_.isEmpty(type)) actionModalConfig = DatasetOnboardingHelper.configActionModal(type);
        // 2. set state for hide/show/config modal
        this.setState(prevState => {
            return {
                showActionModal: !prevState.showActionModal,
                actionModalConfig,
            };
        });
    };

    redirectDashboard = e => {
        e.preventDefault();
        this.props.history.push({
            pathname: `/account`,
            search: '?tab=datasets',
            state: { team: this.state.publisher },
        });
    };

    datasetVersionAction = async (action = {}) => {
        let { type, statusDesc } = action;

        switch (type) {
            case 'CONFIRMNEWVERSION':
                try {
                    if (!_.isEmpty(this.state.dataset.pid) && !_.isEmpty(this.state.publisher)) {
                        axios
                            .post(baseURL + '/api/v1/dataset-onboarding', {
                                publisherID: this.state.publisher,
                                pid: this.state.dataset.pid,
                                currentVersionId: this.state._id,
                            })
                            .then(res => {
                                let { id } = res.data.data;
                                this.props.history.push({ pathname: `/dataset-onboarding/${id}` });

                                //history.push({ pathname: `/dataset-onboarding/${id}` });
                                this.toggleActionModal();
                            });
                    }
                } catch (err) {
                    console.log(err);
                }
                break;
            case 'CONFIRMSUBMISSION':
                try {
                    let { _id } = this.state;
                    // 1. POST
                    await axios.post(`${baseURL}/api/v1/dataset-onboarding/${_id}`, {});
                    const lastSaved = DatasetOnboardingHelper.saveTime();
                    this.setState({ lastSaved });

                    let alert = {
                        tab: 'inReview',
                        message:
                            'You have successfully submitted your dataset for review. You will be notified when a decision has been made.',
                    };
                    this.props.history.push({
                        pathname: '/account',
                        search: '?tab=datasets',
                        state: { alert, team: this.state.publisher },
                    });
                } catch (err) {
                    console.log(err);
                }
                break;
            case 'CONFIRMAPPROVALCONDITIONS':
            case 'CONFIRMREJECTION':
            case 'CONFIRMAPPROVAL':
                let { _id } = this.state;
                const body = {
                    applicationStatus: this.applicationState[type],
                    applicationStatusDesc: statusDesc,
                };

                // 1. Update action status
                await axios.put(`${baseURL}/api/v1/dataset-onboarding/${_id}`, body);

                let alert = {
                    tab: 'inReview',
                    message: type !== 'CONFIRMREJECTION' ? 'You have approved the dataset.' : 'You have rejected the dataset.',
                };

                this.props.history.push({
                    pathname: '/account',
                    search: '?tab=datasets',
                    state: { alert, team: 'admin' },
                });
                break;
            case 'ARCHIVE':
                try {
                    let { _id } = this.state;
                    const body = {
                        applicationStatus: this.applicationState[type],
                    };
                    // 1. Update action status
                    await axios.put(`${baseURL}/api/v1/dataset-onboarding/${_id}`, body);

                    let alert = {
                        tab: 'archive',
                        message: 'You have successfully submitted archived your dataset.',
                    };
                    this.props.history.push({
                        pathname: '/account',
                        search: '?tab=datasets',
                        state: { alert, team: this.state.publisher },
                    });
                } catch (err) {
                    console.log(err);
                }
                break;
            case 'UNARCHIVE':
                try {
                    let { _id } = this.state;
                    const body = {
                        applicationStatus: this.applicationState[type],
                    };
                    // 1. Update action status
                    const response = await axios.put(`${baseURL}/api/v1/dataset-onboarding/${_id}`, body);
                } catch (err) {
                    console.log(err);
                }
                break;
            case 'DELETEDRAFT':
                try {
                    let id = this.state._id;
                    let draftDatasetName;

                    await axios.delete(`${baseURL}/api/v1/dataset-onboarding/delete/${id}`).then(res => {
                        draftDatasetName = res.data.data;
                    });

                    let alert = {
                        tab: 'active',
                        message: `You have deleted ${draftDatasetName} draft dataset`,
                    };

                    this.props.history.push({
                        pathname: '/account',
                        search: '?tab=datasets',
                        state: { alert, team: this.state.publisher },
                    });
                } catch (err) {
                    console.log(err);
                }

                break;
            case 'DUPLICATE':
                try {
                    let { _id } = this.state;
                    let duplicateDataset;

                    await axios.post(`${baseURL}/api/v1/dataset-onboarding/duplicate/${_id}`).then(res => {
                        duplicateDataset = res.data.datasetName;
                    });

                    let alert = {
                        tab: 'active',
                        message: `You have successfully duplicated ${duplicateDataset}`,
                    };

                    this.props.history.push({
                        pathname: '/account',
                        search: '?tab=datasets',
                        state: { alert, team: this.state.publisher },
                    });
                } catch (err) {
                    console.log(err);
                }
                break;
            default:
                this.toggleActionModal();
        }
    };

    updateApplicationStatus = async (action = {}) => {
        let { type } = action;
        switch (type) {
            case 'CONFIRMAPPROVALCONDITIONS':
            case 'CONFIRMREJECTION':
            case 'CONFIRMAPPROVAL':
                //let { _id } = this.state;
                /*const body = {
					applicationStatus: this.applicationState[type],
					applicationStatusDesc: statusDesc,
				};*/

                /* // 1. Update action status
				const response = await axios.put(`${baseURL}/api/v1/data-access-request/${_id}`, body);
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
				}); */
                break;
            default:
                this.toggleActionModal();
        }
    };

    getUserRoles() {
        let { teams } = this.props.userState[0];

        let foundAdmin = teams.filter(x => x.type === 'admin');
        if (!_.isEmpty(foundAdmin)) {
            return ['admin'];
        }

        let foundTeam = teams.filter(team => team.name === this.state.publisher);
        if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
            return ['applicant'];
        }

        /* let { teams } = props.userState[0];
		let foundAdmin = teams.filter(x => x.type === team);
		if (!_.isEmpty(foundAdmin)) {
			return 'admin';
		}
		let foundTeam = teams.filter(x => x.name === team);
		if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
			return ['applicant']; //pass back to user
		}

		return foundTeam[0]._id; */
    }

    userHasRole = (teamId, role) => {
        const team = this.props.userState[0].teams.filter(t => {
            return t._id === teamId;
        })[0];
        return team && team.roles.includes(role);
    };

    userRoleIsAdmin = teamId => {
        const team = this.props.userState[0].teams.filter(t => {
            return t._id === teamId;
        })[0];
        return team && team.isAdmin;
    };

    /* renderTooltip = props => (
		<Tooltip className='tool-tip' style={{ width: '240px' }}>
			{props}
		</Tooltip>
	); */

    /**
     * OnUpdateRequest
     * @desc When Custodian clicks Submit update request
     * 			 will open a modal
     */
    onUpdateRequest = e => {
        let fullAmendments = {};
        let updateRequestModal = this.state.updateRequestModal;
        let { pages, questionPanels, questionSets } = { ...this.state.jsonSchema };
        // Get the last amendmentIteration in the array
        let amendmentsIterations = _.last([...this.state.amendmentIterations]);
        if (!_.isEmpty(amendmentsIterations)) {
            // get the questionAnswers object {role: {}, lastName: {}}
            let { questionAnswers } = { ...amendmentsIterations };
            // get all the questionIds into a iterable array from questionAnswers
            if (!_.isEmpty(questionAnswers)) {
                // set up default variables
                let questionSetId,
                    answer,
                    section,
                    pageId,
                    page,
                    questions,
                    question = '';
                // reduce over questionanswers object using lodash
                fullAmendments = _.reduce(
                    questionAnswers,
                    (obj, value, key) => {
                        // currentItem {questionSetId, answer}
                        ({ questionSetId, answer } = questionAnswers[key]);
                        // find the active questionPanel ie questionPanels: [{navHeader, pageId, panelId, questionSets:[]}]
                        let activeQuestionPanel = [...questionPanels].find(panel => panel.panelId === questionSetId);
                        // Get the section {navHeader: panelHeader: 'Applicant', pageId: 'safePeople'}
                        ({ navHeader: section, pageId } = activeQuestionPanel);
                        // find the active page ie pages: [{pageId: 'safepeople', title: pageTitle: 'Safe People'}]
                        let activePage = [...pages].find(pageItem => pageItem.pageId === pageId);
                        // Get the page title from page item
                        ({ title: page } = activePage);
                        // Get the list of questions for questionPanelId from questionSets
                        ({ questions } = [...questionSets].find(questionSet => questionSet.questionSetId === questionSetId));
                        // Get question checks for nested questions also
                        ({ question } = DatasetOnboardingHelper.getActiveQuestion(questions, key));
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

    checkUniqueTitle = async title => {
        let result = await axios.get(`${baseURL}/api/v1/dataset-onboarding/checkUniqueTitle?pid=${this.state.dataset.pid}&&title=${title}`);
        return result.data.isUniqueTitle;
    };

    renderApp = () => {
        let { activePanelId } = this.state;
        if (activePanelId === 'beforeYouBegin') {
            return (
                <BeforeYouBegin
                    activeAccordionCard={this.state.activeAccordionCard}
                    allowedNavigation={this.state.allowedNavigation}
                    toggleCard={this.toggleCard}
                />
            );
        } else if (activePanelId === 'structural') {
            return (
                //Structural
                <StructuralMetadata
                    onStructuralMetaDataUpdate={this.onStructuralMetaDataUpdate}
                    structuralMetadata={this.state.structuralMetadata}
                    structuralMetadataErrors={this.state.structuralMetadataErrors}
                    currentVersionId={this.state._id}
                    readOnly={this.state.readOnly}
                    percentageCompleted={this.state.completion}
                />
            );
        } else {
            console.log('this.state.jsonSchema', this.state.jsonSchema);
            return (
                <Winterfell
                    schema={this.state.jsonSchema}
                    questionAnswers={this.state.questionAnswers}
                    panelId={this.state.activePanelId}
                    disableSubmit={true}
                    readOnly={this.state.readOnly}
                    validationErrors={this.state.validationErrors}
                    renderRequiredAsterisk={() => <span>{'*'}</span>}
                    onQuestionClick={this.onQuestionClick}
                    onQuestionAction={this.onQuestionAction}
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
            name,
            datasetVersion,
            activeflag,
            listOfDatasets,
            showDrawer,
            showActionModal,
            actionModalConfig,
            isWideForm,
            isTableForm,
            allowedNavigation,
            applicationStatus,
            userType,
            roles,
            completion,
            dataset,
        } = this.state;
        const { userState } = this.props;

        Winterfell.addInputType('typeaheadCustom', TypeaheadCustom);
        Winterfell.addInputType('typeaheadAsyncCustom', TypeaheadAsyncCustom);
        Winterfell.addInputType('typeaheadCustomKeyValue', TypeaheadCustomKeyValue);
        Winterfell.addInputType('typeaheadKeywords', TypeaheadKeywords);
        Winterfell.addInputType('datePickerCustom', DatePickerCustom);
        Winterfell.addInputType('typeaheadUser', TypeaheadUser);
        Winterfell.addInputType('multiField', MultiField);
        Winterfell.addInputType('textareaInputCustom', TextareaInputCustom);

        Winterfell.validation.default.addValidationMethods({
            isCustomDate: value => {
                if (_.isEmpty(value) || value === 'Invalid date') return true;
                return moment(value, 'DD/MM/YYYY').isValid();
            },
            isCustomDateRequired: value => {
                return moment(value, 'DD/MM/YYYY').isValid();
            },
            isValidDoiName: value => {
                return _.isEmpty(value) || !!value.match(/\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/gm);
            },
            isAtLeastOneKeywordSelected: value => {
                return !_.isEmpty(value);
            },
            isAtLeastOneSelected: value => {
                return !_.isEmpty(value);
            },
            isURLValid: value => {
                if (_.isEmpty(value)) return true;
                return !!value.match(/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i);
            },
            isMultiFieldRequired: value => {
                if (!_.isArray(value)) return !_.isEmpty(value);
                else {
                    let isNoError = true;
                    value.forEach(entry => {
                        if (_.isEmpty(entry)) isNoError = false;
                    });
                    return isNoError;
                }
            },
            isMultiFieldURLRequired: value => {
                const isMultiFieldURLRegEx =
                    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|in progress$/i;
                if (!_.isArray(value)) return !_.isEmpty(value) && !!value.match(isMultiFieldURLRegEx);

                let isNoError = true;
                value.forEach(url => {
                    if (!url.match(isMultiFieldURLRegEx)) isNoError = false;
                });
                return isNoError;
            },
            isMultiFieldURL: value => {
                if (!_.isArray(value)) return _.isEmpty(value) || !!value.match(/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i);

                let isNoError = true;
                value.forEach(url => {
                    if (!_.isEmpty(url) && !url.match(/^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i)) isNoError = false;
                });
                return isNoError;
            },
            isAgeRangeValid: value => {
                return (
                    _.isEmpty(value) ||
                    !!value.match(/(150|1[0-4][0-9]|[0-9]|[1-8][0-9]|9[0-9])-(150|1[0-4][0-9]|[0-9]|[1-8][0-9]|9[0-9])/i)
                );
            },
            isSelectedRequired: value => {
                return !_.isEmpty(value) && value !== 'undefined';
            },
            isTitleUnique: async value => {
                let isTitleUnique = await this.checkUniqueTitle(value);
                return isTitleUnique;
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
                            <span className='white-20-semibold mr-5'>Dataset</span>
                            <span className='white-16-semibold pr-5'>{name}</span>
                            <span className='white-16-semibold pr-5' style={{ display: 'inline-block' }}>
                                <Dropdown>
                                    <Dropdown.Toggle as={CustomToggle}>
                                        <span className='listOfVersionsButton'>
                                            {datasetVersion}
                                            {activeflag === 'draft' ? ' (Draft)' : ''}
                                            {activeflag === 'active' ? ' (Live)' : ''}
                                            {activeflag === 'rejected' ? ' (Rejected)' : ''}
                                            {activeflag === 'inReview' ? ' (Pending)' : ''}
                                        </span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu as={CustomMenu} className='listOfVersionsDropdown'>
                                        {listOfDatasets.map(dat => {
                                            return (
                                                <Dropdown.Item href={`/dataset-onboarding/${dat._id}`} className='black-14'>
                                                    {dat.datasetVersion}
                                                    {dat.activeflag === 'draft' ? ' (Draft)' : ''}
                                                    {dat.activeflag === 'active' ? ' (Live)' : ''}
                                                    {dat.activeflag === 'rejected' ? ' (Rejected)' : ''}
                                                    {dat.activeflag === 'inReview' ? ' (Pending)' : ''}

                                                    {this.state._id === dat._id ? (
                                                        <SVGIcon
                                                            className='collectionCheckSvg'
                                                            name='checkicon'
                                                            width={16}
                                                            height={16}
                                                            viewbox='0 0 16 16'
                                                            fill={'#2c8267'}
                                                        />
                                                    ) : (
                                                        ''
                                                    )}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </span>
                        </Col>
                        <Col sm={12} md={4} className='d-flex justify-content-end align-items-center banner-right'>
                            <span className='white-14-semibold'>{DatasetOnboardingHelper.getSavedAgo(lastSaved)}</span>
                            {
                                <a
                                    className={`linkButton white-14-semibold ml-2 ${allowedNavigation ? '' : 'disabled'}`}
                                    onClick={this.onClickSave}
                                    href='javascript:void(0)'
                                >
                                    Save now
                                </a>
                            }
                            <CloseButtonSvg width='16px' height='16px' fill='#fff' onClick={e => this.redirectDashboard(e)} />
                        </Col>
                    </Row>

                    <div id='darContainer' className='flex-form'>
                        <div id='darLeftCol' className='scrollable-sticky-column'>
                            {[...this.state.jsonSchema.pages].map((item, idx) => (
                                <div key={`navItem-${idx}`} className={`${item.active ? 'active-border' : ''}`}>
                                    <div>
                                        <span
                                            className={`${
                                                !this.state.inReviewMode ? 'black-16' : item.inReview ? 'black-16' : 'section-not-inreview'
                                            }
										${item.active ? 'section-header-active' : 'section-header'} 
										${this.state.allowedNavigation ? '' : 'disabled'}`}
                                            onClick={e => this.updateNavigation(item)}
                                        >
                                            <div>
                                                <div className='completionIconHolder'>
                                                    {item.title === 'Before you begin' ? (
                                                        <div className='completionIconGap'></div>
                                                    ) : (
                                                        <OverlayTrigger
                                                            key={item.title}
                                                            placement='top'
                                                            overlay={
                                                                <Tooltip id={`tooltip-top`}>
                                                                    {item.title}: {completion[item.pageId]}%
                                                                </Tooltip>
                                                            }
                                                        >
                                                            <div>
                                                                <StatusDisplay section={item.title} status={completion[item.pageId]} />
                                                            </div>
                                                        </OverlayTrigger>
                                                    )}
                                                </div>
                                                <div className='titleHolder'>{item.title}</div>

                                                {(() => {
                                                    let isSubPanel = false;
                                                    [...this.state.jsonSchema.questionPanels].map((item2, index) => {
                                                        if (item.pageId === item2.pageId && item2.navHeader) {
                                                            console.log(item.pageId + ' === ' + item2.pageId + ' && ' + item2.navHeader);
                                                            isSubPanel = true;
                                                        }
                                                    });
                                                    if (isSubPanel)
                                                        return (
                                                            <SVGIcon
                                                                name='chevronbottom'
                                                                width={14}
                                                                height={14}
                                                                fill={'#3c4e8c'}
                                                                className={item.active ? 'padding-left-4' : 'padding-left-4 flip180'}
                                                            />
                                                        );
                                                })()}

                                                <div> {item.flag && <i className={DatasetOnboardingHelper.flagIcons[item.flag]} />}</div>
                                            </div>
                                        </span>
                                        {item.active && (
                                            <ul className='list-unstyled section-subheader'>
                                                <NavItem
                                                    parentForm={item}
                                                    questionPanels={this.state.jsonSchema.questionPanels}
                                                    onFormSwitchPanel={this.updateNavigation}
                                                    activePanelId={this.state.activePanelId}
                                                    enabled={allowedNavigation}
                                                    notForReview={!item.inReview && this.state.inReviewMode}
                                                    completion={completion}
                                                />
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div id='darCenterCol' className={isWideForm ? 'extended' : '' || isTableForm ? 'table' : ''}>
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
                                className={`dar__questions ${this.state.activePanelId === 'beforeYouBegin' ? 'pad-bottom-0' : ''}
														${this.state.activePanelId === 'structural' ? 'margin-top-0 noPadding' : ''}`}
                                style={{ backgroundColor: '#ffffff' }}
                            >
                                {this.renderApp()}
                            </div>
                        </div>
                        {isWideForm || isTableForm ? null : (
                            <div id='darRightCol' className='scrollable-sticky-column'>
                                <div className='darTab'>
                                    <Guidance activeGuidance={activeGuidance} resetGuidance={this.resetGuidance} />
                                </div>
                            </div>
                        )}
                    </div>

                    <ActionBar userState={userState}>
                        <div className='action-bar'>
                            <div className='action-bar--questions'>
                                <SLA
                                    classProperty={DatasetOnboardingHelper.datasetStatusColours[applicationStatus]}
                                    text={DatasetOnboardingHelper.datasetSLAText[applicationStatus]}
                                />
                                <ActionBarStatus status={applicationStatus} totalQuestions={totalQuestions} dataset={dataset} />
                            </div>
                            <div className='action-bar-actions'>
                                <AmendmentCount
                                    answeredAmendments={this.state.answeredAmendments}
                                    unansweredAmendments={this.state.unansweredAmendments}
                                />
                                {userType.toUpperCase() === 'EDITOR' ? (
                                    <ApplicantActionButtons
                                        allowedNavigation={allowedNavigation}
                                        onNextClick={this.onNextClick}
                                        onFormSubmit={this.onFormSubmit}
                                        onShowArchiveModal={this.toggleArchiveModal}
                                        onShowUnArchiveModal={this.toggleUnArchiveModal}
                                        onShowCreateNewVersionModal={this.toggleCreateNewVersionModal}
                                        showSubmit={this.state.showSubmit}
                                        submitButtonText={this.state.submitButtonText}
                                        showCreateNewVersion={this.state.showCreateNewVersion}
                                        showArchive={this.state.showArchive}
                                        showUnArchive={this.state.showUnArchive}
                                        showDeleteDraft={this.state.showDeleteDraft}
                                        onShowDeleteDraftModal={this.toggleDeleteDraftModal}
                                        onShowDuplicateModal={this.toggleDuplicateModal}
                                    />
                                ) : (
                                    <CustodianActionButtons
                                        allowedNavigation={allowedNavigation}
                                        onActionClick={this.onCustodianAction}
                                        onNextClick={this.onNextClick}
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
                        />
                    </SideDrawer>

                    <ActionModal
                        open={showActionModal}
                        context={actionModalConfig}
                        datasetVersionAction={this.datasetVersionAction}
                        close={this.toggleActionModal}
                    />
                </div>
            </Sentry.ErrorBoundary>
        );
    }
}

export default DatasetOnboarding;
