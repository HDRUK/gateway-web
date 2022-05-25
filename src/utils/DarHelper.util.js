import _ from 'lodash';
import moment from 'moment';

const autoCompleteLookUps = { fullname: ['orcid', 'email', 'bio'] };

const userTypes = {
    CUSTODIAN: 'custodian',
    APPLICANT: 'applicant',
};

const amendmentStatuses = {
    AWAITINGUPDATES: { text: 'Awaiting updates', icon: 'cycle' },
    UPDATESSUBMITTED: { text: 'Updates submitted', icon: 'check' },
    UPDATESREQUESTED: { text: 'Updates requested', icon: 'flag' },
    UPDATESRECEIVED: { text: 'Updates received', icon: 'flag' },
};

const staticContent = {
    aboutPageNav: {
        pageId: 'about',
        active: true,
        title: 'Before you begin',
        description:
            'Preparation is key to a successful data access request. You need to be able to demonstrate how you will ensure safe use of patient data and the potential for public benefit. The steps below are intended to help you get off to a good start.',
    },
    aboutPanel: {
        panelId: 'about',
        index: 0,
        pageId: 'about',
    },
    filesPageNav: {
        pageId: 'files',
        active: true,
        title: 'Files',
        description:
            'Preparation is key to a successful data access request. You need to be able to demonstrate how you will ensure safe use of patient data and the potential for public benefit. The steps below are intended to help you get off to a good start.',
    },
    filesPanel: {
        panelId: 'files',
        index: 100,
        pageId: 'files',
    },
    additionalFilesPanel: {
        panelId: 'additionalinformationfiles-files',
        index: 24,
        pageId: 'additionalinformationfiles',
    },
    additionalFilesQuestionPanel: {
        questionPanelHeaderText: 'File uploaded',
        panelHeader:
            'Applicant should add any files requested here, as well as any additional files that could support the application. A description should be included to clarify the purpose of each document.',
        navHeader: 'Files',
        panelId: 'additionalinformationfiles-files',
        questionSets: [],
        pageId: 'additionalinformationfiles',
        panelGuidance: 'Please upload all additional documentation as requested in the DAR form.',
    },
};

const darCommentTitle = {
    approved: 'Conditions',
    'approved with conditions': 'Conditions',
    rejected: 'Reason for rejection',
};

const darStatus = {
    all: 'all',
    inProgress: 'inProgress',
    submitted: 'submitted',
    inReview: 'inReview',
    approved: 'approved',
    'approved with conditions': 'approved',
    rejected: 'rejected',
};

const darApplicationTypes = {
    inProgress: 'inProgress',
    initial: 'initial',
    resubmission: 'resubmission',
    amendment: 'amendment',
    extension: 'extension',
    renewal: 'renewal',
    update: 'update',
};

const darSLAText = {
    inProgress: 'Pre-submission',
    submitted: 'Submitted',
    inReview: 'In review',
    approved: 'Approved',
    'approved with conditions': 'Approved',
    rejected: 'Rejected',
};

const darAmendmentSLAText = {
    inProgress: 'Pre-submission amendment',
    submitted: 'Amendment submitted',
    inReview: 'Amendment in review',
};

const darStatusColours = {
    inProgress: 'gray',
    submitted: 'indigo',
    inReview: 'amber',
    approved: 'green',
    'approved with conditions': 'green',
    rejected: 'red',
};

/**
 * [applicationState acts like enum for generating Counts DAR dashboard]
 *
 */
const darStatusCounts = {
    all: 'allCount',
    inProgress: 'preSubmissionCount',
    submitted: 'submittedCount',
    inReview: 'inReviewCount',
    approved: 'approvedCount',
    'approved with conditions': 'approvedCount',
    rejected: 'rejectedCount',
};

const darStaticPageIds = {
    ABOUT: 'about',
    FILES: 'files',
    ADDITIONALFILES: 'additionalinformationfiles',
};

const actionKeys = {
    GUIDANCE: 'guidance',
    REQUESTAMENDMENT: 'requestAmendment',
    CANCELREQUEST: 'cancelRequest',
    REVERTTOPREVIOUSANSWER: 'revertToPreviousAnswer',
    MESSAGES: 'messages',
    NOTES: 'notes',
};

const amendmentModes = {
    ADDED: 'added',
    REMOVED: 'removed',
    REVERTED: 'reverted',
};

const flagIcons = {
    WARNING: 'fas fa-exclamation-circle warning',
    SUCCESS: 'fas fa-check success',
    DANGER: 'fas fa-exclamation-circle danger',
};

const flagPanelIcons = {
    WARNING: 'fas fa-circle warning',
    SUCCESS: 'fas fa-check success',
    DANGER: 'fas fa-circle danger',
};

const activityLogEvents = {
    APPLICATION_SUBMITTED: 'applicationSubmitted',
    REVIEW_PROCESS_STARTED: 'reviewProcessStarted',
    UPDATES_SUBMITTED: 'updatesSubmitted',
    AMENDMENT_SUBMITTED: 'amendmentSubmitted',
    APPLICATION_APPROVED: 'applicationApproved',
    APPLICATION_APPROVED_WITH_CONDITIONS: 'applicationApprovedWithConditions',
    APPLICATION_REJECTED: 'applicationRejected',
    COLLABORATOR_ADDEDD: 'collaboratorAdded',
    COLLABORATOR_REMOVED: 'collaboratorRemoved',
    UPDATE_REQUESTED: 'updateRequested',
    UPDATE_SUBMITTED: 'updateSubmitted',
    WORKFLOW_ASSIGNED: 'workflowAssigned',
    REVIEW_PHASE_STARTED: 'reviewPhaseStarted',
    RECOMMENDATION_WITH_ISSUE: 'reccomendationWithIssue',
    RECOMMENDATION_WITH_NO_ISSUE: 'reccomendationWithNoIssue',
    FINAL_DECISION_REQUIRED: 'finalDecisionRequired',
    DEADLINE_PASSED: 'deadlinePassed',
    PRESUBMISSION_MESSAGE: 'presubmissionMessage',
    MANUAL_EVENT: 'manualEvent',
    CONTEXTUAL_MESSAGE: 'contextualMessage',
    NOTE: 'note',
};

const dataUseRegisterStatus = {
    ACTIVE: 'active',
    INREVIEW: 'inReview',
    REJECTED: 'rejected',
    ARCHIVED: 'archived',
};

/**
 * [generateStatusCounts - Used in DataAccessRequest Dashboard for status counts]
 *
 * @param   {[data]}}  [DAR Objects]
 * @return  {{counts}} [return counts]
 */
const generateStatusCounts = (data = []) => {
    // 1. declare obj structure even if no data
    const counts = {
        allCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        archivedCount: 0,
        preSubmissionCount: 0,
        inReviewCount: 0,
        submittedCount: 0,
    };

    if (!_.isEmpty(data)) {
        // 2. reduce over data from API to generate structure as above counts
        const totalCounts = [...data].reduce((obj, item, i) => {
            // 3. take out applicationStatus ie, inProgress, submitted etc..
            const { applicationStatus } = item;
            // 4. if the applicationStatus not in our obj, set to 1 with key
            if (!obj[darStatusCounts[applicationStatus]]) {
                obj[darStatusCounts[applicationStatus]] = 1;
            } else {
                // 5. if found increment the count
                obj[darStatusCounts[applicationStatus]] = ++obj[darStatusCounts[applicationStatus]];
            }
            obj.allCount = ++i;
            // 6. return obj as count format
            return obj;
        }, {});
        return { ...counts, ...totalCounts };
    }
    // 7. return counts as default
    return counts;
};

const configActionModal = (type = '') => {
    let config = {};
    if (!_.isEmpty(type)) {
        switch (type.toUpperCase()) {
            case 'APPROVE':
                config = {
                    title: 'Application approval',
                    subTitle: 'Are you sure you want to approve this application?',
                    description: false,
                    buttons: {
                        cancel: {
                            label: 'No, nevermind',
                            action: 'cancel',
                            class: 'button-secondary mr-2',
                        },
                        confirmApproval: {
                            label: 'Confirm approval',
                            action: 'confirmApproval',
                            class: 'btn btn-primary addButton',
                        },
                    },
                };
                break;
            case 'REJECT':
                config = {
                    title: 'Application rejection',
                    subTitle:
                        'Are you sure you want to reject this application? If, so please provide the applicant with a reason for the failed request.',
                    description: true,
                    buttons: {
                        cancel: {
                            label: 'No, nevermind',
                            action: 'cancel',
                            class: 'button-secondary mr-2',
                        },
                        confirmReject: {
                            label: 'Confirm rejection',
                            action: 'confirmRejection',
                            class: 'btn btn-primary addButton',
                        },
                    },
                };
                break;
            case 'APPROVEWITHCONDITIONS':
                config = {
                    title: 'Application approval with conditions',
                    subTitle:
                        'Are you sure you want to apprive this application? If so, please provide the conditions of this approval to the applicant',
                    description: true,
                    buttons: {
                        cancel: {
                            label: 'No, nevermind',
                            action: 'cancel',
                            class: 'button-secondary mr-2',
                        },
                        confirmApprovalConditions: {
                            label: 'Confirm approval with conditions',
                            action: 'confirmApprovalConditions',
                            class: 'btn btn-primary addButton',
                        },
                    },
                };
                break;
            default:
                return type;
        }
    }

    return config;
};

const autoComplete = (questionId, uniqueId, questionAnswers) => {
    let questionList = {};
    const lookupArr = [...autoCompleteLookUps[`${questionId}`]];
    const activeQuestionId = typeof uniqueId !== 'undefined' ? `${questionId}_${uniqueId}` : questionId;
    const answerObj = questionAnswers[`${activeQuestionId}`];

    lookupArr.map(val => {
        let key;
        let value;
        value = answerObj[val] || '';
        key = val;
        if (typeof uniqueId !== 'undefined') key = `${key}_${uniqueId}`;

        questionList = {
            ...questionList,
            [`${key}`]: value,
        };
    });
    // return questionAnswers
    return { ...questionAnswers, ...questionList };
};

const findQuestion = (questionId = '', questionsArr = []) => {
    // 1. Define child object to allow recursive calls
    let child;
    // 2. Exit from function if no children are present
    if (!questionsArr) return {};
    // 3. Iterate through questions in the current level to locate question by Id
    for (const questionObj of questionsArr) {
        // 4. Return the question if it is located
        if (questionObj.questionId === questionId) return questionObj;
        // 5. Recursively call the find question function on child elements to find question Id
        if (typeof questionObj.input === 'object' && typeof questionObj.input.options !== 'undefined') {
            questionObj.input.options
                .filter(option => {
                    return typeof option.conditionalQuestions !== 'undefined' && option.conditionalQuestions.length > 0;
                })
                .forEach(option => {
                    if (!child) {
                        child = findQuestion(questionId, option.conditionalQuestions);
                    }
                });
        }
        // 6. Return the child question
        if (child) return child;
    }
};

const findQuestionSet = (questionSetId = '', schema = {}) => {
    if (!_.isEmpty(questionSetId) && !_.isEmpty(schema)) {
        const { questionSets } = schema;
        return [...questionSets].find(q => q.questionSetId === questionSetId);
    }
    return {};
};

/**
 * [TotalQuestionAnswered]
 * @desc - Sets total questions answered for each section
 */
const totalQuestionsAnswered = (component, panelId = '', questionAnswers = {}, jsonSchema = {}) => {
    let totalQuestions = 0;
    let totalAnsweredQuestions = 0;

    if (_.isEmpty(panelId)) {
        const formPanels = [...component.state.jsonSchema.formPanels];
        const applicationQuestionAnswers = formPanels.reduce(
            (acc, val) => {
                const countObj = totalQuestionsAnswered(component, val.panelId);
                acc[0] += countObj.totalAnsweredQuestions;
                acc[1] += countObj.totalQuestions;
                return acc;
            },
            [0, 0]
        );
        return {
            totalAnsweredQuestions: applicationQuestionAnswers[0],
            totalQuestions: applicationQuestionAnswers[1],
        };
    }
    if (_.isEmpty(questionAnswers)) ({ questionAnswers } = { ...component.state });
    // 1. deconstruct schema
    if (_.isEmpty(jsonSchema)) {
        ({ jsonSchema } = { ...component.state });
    }
    const { questionPanels = [], questionSets = [] } = jsonSchema;
    // 2. omits out blank null, undefined, and [] values from this.state.answers
    questionAnswers = _.pickBy({ ...questionAnswers }, v => v !== null && v !== undefined && v.length !== 0);
    // 3. find the relevant questionSetIds within the panel
    const qPanel = questionPanels.find(qp => qp.panelId === panelId);
    if (!_.isNil(qPanel)) {
        const { questionSets: panelQuestionSets = [] } = qPanel;
        const qsIds = panelQuestionSets.map(qs => qs.questionSetId);
        // 4. find the relevant questionSets
        const qsets = questionSets.filter(qs => qsIds.includes(qs.questionSetId));
        // 5. ensure at least one was found
        if (!_.isEmpty(qsets)) {
            // 6. iterate through each question set to calculate answered and unanswered
            for (const questionSet of qsets) {
                // 7. get questions
                const { questions = [] } = questionSet;
                // 8. filter out buttons added as questions
                const filteredQuestions = filterInvalidQuestions(questions);
                // 9. Iterate through each top-level question
                for (const question of filteredQuestions) {
                    // 10. Recursively gather question status from each question path
                    const conditionalQuestions = getRecursiveQuestionCounts(question, questionAnswers);
                    totalQuestions += conditionalQuestions.questionCount;
                    totalAnsweredQuestions += conditionalQuestions.answerCount;
                }
            }
            // 11. Return question totals
            return { totalAnsweredQuestions, totalQuestions };
        }
    }
    return { totalAnsweredQuestions: 0, totalQuestions: 0 };
};

let filterInvalidQuestions = questions => {
    const filteredQuestions = [...questions].filter(q => {
        const { input = {} } = q;
        return !_.isEmpty(input) && input.type !== 'buttonInput';
    });
    return filteredQuestions;
};

let getRecursiveQuestionCounts = (question, questionAnswers) => {
    let questionCount = 0;
    let answerCount = 0;
    // 1. Count parent question
    questionCount++;
    // 2. Count parent question if it has been answered
    if (_.has(questionAnswers, question.questionId)) {
        answerCount++;
        // 3. Check if the question has children/conditional questions
        if (_.has(question, 'input.options')) {
            // 4. Check if question allows multiple answers
            let conditionalQuestions = [];
            const answeredOptions = question.input.options.filter(opt => {
                return (
                    (Array.isArray(questionAnswers[question.questionId]) && questionAnswers[question.questionId].includes(opt.value)) ||
                    questionAnswers[question.questionId] === opt.value
                );
            });
            if (!_.isEmpty(answeredOptions)) {
                answeredOptions.forEach(answeredOption => {
                    ({ conditionalQuestions = [] } = answeredOption);
                    // 4. Recursively iterate through conditional questions
                    conditionalQuestions.forEach(function iter(currentQuestion) {
                        // 5. Ensure valid question type (remove buttons)
                        const { input = {} } = currentQuestion;
                        if (!_.isEmpty(input) && input.type !== 'buttonInput') {
                            // 6. Increment question count
                            questionCount++;
                            // 7. Increment answer count if answer found
                            if (_.has(questionAnswers, currentQuestion.questionId)) {
                                answerCount++;
                                // 8. Call next level of recursion if answer has been provided
                                if (_.has(currentQuestion, 'input.options')) {
                                    // 9. Find option based on answer provided
                                    let recursiveConditionalQuestions = [];
                                    const answeredRecursiveOptions = currentQuestion.input.options.filter(opt => {
                                        return (
                                            (Array.isArray(questionAnswers[currentQuestion.questionId]) &&
                                                questionAnswers[currentQuestion.questionId].includes(opt.value)) ||
                                            questionAnswers[currentQuestion.questionId] === opt.value
                                        );
                                    });
                                    if (!_.isEmpty(answeredRecursiveOptions)) {
                                        answeredRecursiveOptions.forEach(answeredRecursiveOption => {
                                            ({ conditionalQuestions: recursiveConditionalQuestions = [] } = answeredRecursiveOption);
                                            // 10. Repeat function call
                                            if (!_.isEmpty(recursiveConditionalQuestions)) {
                                                Array.isArray(recursiveConditionalQuestions) && recursiveConditionalQuestions.forEach(iter);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    });
                });
            }
        }
    }
    return { questionCount, answerCount };
};

/**
 * [saveTime]
 * @desc Sets the lastSaved state on a field
 */
const saveTime = () => {
    const currentTime = moment().format('DD MMM YYYY HH:mm');
    const lastSaved = `Last saved ${currentTime}`;
    return lastSaved;
};

/**
 * [getSavedAgo]
 * @desc Returns the saved time for DAR
 */
const getSavedAgo = lastSaved => {
    if (!_.isEmpty(lastSaved)) return lastSaved;
    return ``;
};

const getActiveQuestion = (questionsArr, questionId) => {
    let child;

    if (!questionsArr) return;

    for (const questionObj of questionsArr) {
        if (questionObj.questionId === questionId) return questionObj;

        if (typeof questionObj.input === 'object' && typeof questionObj.input.options !== 'undefined') {
            questionObj.input.options
                .filter(option => {
                    return typeof option.conditionalQuestions !== 'undefined' && option.conditionalQuestions.length > 0;
                })
                .forEach(option => {
                    if (!child) {
                        child = getActiveQuestion(option.conditionalQuestions, questionId);
                    }
                });
        }

        if (child) return child;
    }
};

const calcAccordionClasses = (active, allowedNavigation) => {
    let classes = ['black-16'];
    if (!allowedNavigation) classes = [...classes, 'disabled'];

    if (active) classes = [...classes, 'active'];

    return classes;
};

const createTopicContext = (datasets = []) => {
    if (_.isEmpty(datasets)) {
        return {
            datasets: [],
            tags: [],
            relatedObjectIds: [],
            subTitle: '',
            allowNewMessage: false,
        };
    }
    let dataRequestModalContent = {};
    let allowsMessaging = false;
    let requiresModal = false;
    let allowNewMessage = false;
    const { publisherObj = {}, contactPoint = '', publisher = '' } = datasets[0];
    if (!_.isEmpty(publisherObj)) {
        dataRequestModalContent = publisherObj.dataRequestModalContent;
        allowsMessaging = publisherObj.allowsMessaging;
        requiresModal = !_.isEmpty(publisherObj.dataRequestModalContent);
        allowNewMessage = publisherObj.allowsMessaging;
    }
    return {
        requiresModal,
        allowNewMessage,
        allowsMessaging,
        dataRequestModalContent,
        datasets:
            datasets.map(dataset => {
                const { datasetId } = dataset;
                return { datasetId, publisher };
            }) || [],
        tags: datasets.map(dataset => dataset.name) || [],
        relatedObjectIds: datasets.map(dataset => dataset._id),
        title: publisher || '',
        subTitle: datasets.map(dataset => dataset.name).join(' '),
        contactPoint,
    };
};

const createModalContext = (datasets = []) => {
    let dataRequestModalContent = {};
    let allowsMessaging = false;
    let requiresModal = false;
    let allowNewMessage = false;
    const { publisherObj = {}, contactPoint = '', publisher = '' } = datasets[0];
    if (!_.isEmpty(publisherObj)) {
        dataRequestModalContent = publisherObj.dataRequestModalContent;
        allowsMessaging = publisherObj.allowsMessaging;
        requiresModal = !_.isEmpty(publisherObj.dataRequestModalContent);
        allowNewMessage = publisherObj.allowsMessaging;
    }
    return {
        requiresModal,
        allowNewMessage,
        allowsMessaging,
        dataRequestModalContent,
        datasets,
        contactPoint,
        title: publisher,
    };
};

/**
 * [removeStaticPages]
 * @desc 		Removes the static pageId to stop Nav from duplicating
 * @param   {[object]}  schema  [schema]
 * @return  {[object]}          [return schema]
 */
const removeStaticPages = (schema = {}) => {
    const { pages, formPanels } = { ...schema };
    // filter pageId within pages
    const originalPages = _.uniqBy(pages, 'pageId');
    // unique panelId within form panels
    const originalFormPanels = _.uniqBy(formPanels, 'panelId');
    // return updated schema
    return {
        ...schema,
        pages: originalPages,
        formPanels: originalFormPanels,
    };
};

const isQuestionLocked = questionStatus => {
    return questionStatus === 2;
};

const isQuestionOn = questionStatus => {
    return questionStatus === 1;
};

const isQuestionOff = questionStatus => {
    return questionStatus === 0;
};

export default {
    findQuestionSet,
    findQuestion,
    autoComplete,
    totalQuestionsAnswered,
    saveTime,
    getSavedAgo,
    getActiveQuestion,
    calcAccordionClasses,
    createTopicContext,
    createModalContext,
    configActionModal,
    generateStatusCounts,
    staticContent,
    darStatus,
    darStatusColours,
    darSLAText,
    darAmendmentSLAText,
    darCommentTitle,
    darStaticPageIds,
    darApplicationTypes,
    actionKeys,
    amendmentModes,
    flagIcons,
    flagPanelIcons,
    userTypes,
    amendmentStatuses,
    removeStaticPages,
    activityLogEvents,
    dataUseRegisterStatus,
    isQuestionLocked,
    isQuestionOn,
    isQuestionOff,
};
