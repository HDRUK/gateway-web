import * as Sentry from '@sentry/react';
import { t } from 'i18next';
import { cloneDeep, isEmpty, isEqual, isNil, reduce, uniq } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import * as React from 'react';
import { Card, Col, Container, Modal, Row } from 'react-bootstrap';
import { Trans } from 'react-i18next';

import { NotificationManager } from 'react-notifications';
import { useHistory } from 'react-router-dom';
import Winterfell from 'winterfell';
import { Button, Box, P, H5, Typography, Cta, Alert } from 'hdruk-react-core';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-tabs/style/react-tabs.css';

import { authUtils, generalUtils, darHelperUtils } from 'utils';
import { Icon, Spinner, RenderMarkdown } from 'components';
import { dataAccessRequestService, publishersService, questionbankService } from 'services';
import { useAuth } from 'context/AuthContext';

import { useAccountTeamSelected, useCustodianRoles } from 'hooks';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import { ReactComponent as Clock } from '../../images/icons/blue_clock.svg';
import { ReactComponent as ClockIcon } from '../../images/icons/clock.svg';

import ActionBar from '../commonComponents/actionbar/ActionBar';
import ActionBarMenu from '../commonComponents/ActionBarMenu/ActionBarMenu';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import Loading from '../commonComponents/Loading';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import Uploads from './components/Uploads/Uploads';
import { classSchema } from './classSchema';
import AboutApplication from './components/AboutApplication/AboutApplication';
import AboutApplicationImport from './components/AboutApplicationImport/AboutApplicationImport';
import CustomiseGuidance from './components/CustomiseGuidance/CustomiseGuidance';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import NavDropdown from './components/NavDropdown/NavDropdown';
import NavItem from './components/NavItem/NavItem';
import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import UnpublishedQuestionIcon from './components/UnpublishedQuestionIcon';
import handleAnalytics from './handleAnalytics';

import TextareaInputCustom from '../commonComponents/TextareaInputCustom/TextareaInputCustom';
import DropdownCustom from '../DataAccessRequest/components/DropdownCustom/DropdownCustom';
import DoubleDropdownCustom from '../DataAccessRequest/components/DoubleDropdownCustom/DoubleDropdownCustom';

const questionActions = {
    questionActions: [{ key: 'guidanceEdit', icon: 'fas fa-pencil-alt', color: '#475da7', toolTip: 'Guidance', order: 1 }],
};

export const DataAccessRequestCustomiseForm = props => {
    const history = useHistory();
    const [searchBar] = useState(React.createRef());
    const { userState } = useAuth();
    const [schemaId, setSchemaId] = useState('');
    const [publisherDetails, setPublisherDetails] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);
    const [lastSaved, setLastSaved] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [activeGuidance, setActiveGuidance] = useState('');
    const [activeQuestion, setActiveQuestion] = useState('');
    const [unpublishedGuidance, setUnpublishedGuidance] = useState([]);
    const [context, setContext] = useState({});
    const [activePanelId, setActivePanelId] = useState('');
    const [jsonSchema, setJsonSchema] = useState({});
    const [questionAnswers] = useState({});
    const [questionStatus, setQuestionStatus] = useState({});
    const [questionSetStatus, setQuestionSetStatus] = useState({});
    const [existingQuestionStatus, setExistingQuestionStatus] = useState({});
    const [newGuidance, setNewGuidance] = useState({});
    const [existingGuidance, setExistingGuidance] = useState({});
    const [countOfChanges, setCountOfChanges] = useState({});
    const [existingCountOfChanges, setExistingCountOfChanges] = useState(0);
    const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);
    const [activeQuestionData, setActiveQuestionData] = React.useState();
    const [activePanel, setActivePanel] = React.useState();
    const [showClearModal, setShowClearModal] = React.useState(false);
    const [showClearSectionModal, setShowClearSectionModal] = React.useState(false);
    const [showSaveAlert, setShowSaveAlert] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const { teamId } = useAccountTeamSelected();
    const { isCustodianTeamAdmin } = useCustodianRoles(teamId);

    const patchSchemaRequest = dataAccessRequestService.usePatchSchema(null, {
        onError: ({ title, message }) => {
            setIsUploading(false);

            NotificationManager.error(message, title, 10000);
        },
    });

    const getMasterSchema = async panelId => {
        const {
            match: {
                params: { publisherID },
            },
        } = props;

        const {
            data: { publisher },
        } = await publishersService.getPublisher(publisherID);

        setPublisherDetails(publisher);

        const {
            data: {
                result: { masterSchema, questionStatus, questionSetStatus, guidance, countOfChanges, schemaId, unpublishedGuidance },
            },
        } = await questionbankService.getQuestionbankItem(publisherID);

        const newJsonSchema = darHelperUtils.injectReadonlyStaticContent(
            { ...masterSchema, ...classSchema, ...questionActions },
            { questionStatus, questionSetStatus, guidance },
            publisher.publisherDetails,
            userState
        );

        const newPanelId = panelId || newJsonSchema.formPanels[0].panelId;
        const pageId = darHelperUtils.findPageIdByQuestionSet(newPanelId, newJsonSchema);

        setUnpublishedGuidance(unpublishedGuidance || []);
        setSchemaId(schemaId);
        setJsonSchema(newJsonSchema);

        setUnpublishedGuidance(unpublishedGuidance || []);
        setSchemaId(schemaId);
        setQuestionStatus(questionStatus);
        setQuestionSetStatus(questionSetStatus);
        setExistingQuestionStatus(cloneDeep(questionStatus));
        setNewGuidance(guidance);
        setExistingGuidance(cloneDeep(guidance));
        setCountOfChanges(countOfChanges);
        setExistingCountOfChanges(countOfChanges);
        setActivePanelId(newPanelId);
        setIsLoading(false);

        updateNavigation(
            {
                pageId,
                panelId: newPanelId,
            },
            newJsonSchema
        );
    };

    const saveTime = () => {
        const currentTime = moment().format('DD MMM YYYY HH:mm');
        return `Last saved: ${currentTime}`;
    };

    const onQuestionsetSwitchChange = async (checked, questionSetId) => {
        const newJsonSchema = { ...jsonSchema };

        const newQuestionStatus = {
            ...questionStatus,
            ...darHelperUtils.changeStatusByQuestionSetId(checked ? 1 : 0, questionSetId, newJsonSchema),
        };

        const newQuestionSetStatus = {
            ...questionSetStatus,
            [questionSetId]: !checked ? 0 : 1,
        };

        const numberOfChangesQuestions = reduce(
            newQuestionStatus,
            (result, value, key) => {
                return isEqual(value, existingQuestionStatus[key]) ? result : result.concat(key);
            },
            []
        ).length;

        const params = {
            questionStatus: newQuestionStatus,
            countOfChanges: numberOfChangesQuestions + existingCountOfChanges,
            questionSetStatus: newQuestionSetStatus,
        };

        setCountOfChanges(params.countOfChanges);
        setJsonSchema(newJsonSchema);
        setQuestionStatus(newQuestionStatus);
        setQuestionSetStatus(newQuestionSetStatus);

        await patchSchemaRequest.mutateAsync({
            id: schemaId,
            ...params,
        });

        setLastSaved(saveTime());
        handleAnalytics(`Question Set ${questionSetId} switched`, checked ? 'On' : 'Off');
    };

    const onSwitchChange = async (questionId, value) => {
        const newJsonSchema = { ...jsonSchema };
        const questionSet = darHelperUtils.findQuestionSetByQuestionId(questionId, newJsonSchema);

        questionStatus[questionId] = value ? 1 : 0;

        const activeQuestions = questionSet.questions.filter(({ questionId }) => !!questionStatus[questionId]);

        const newQuestionSetStatus = {
            ...questionSetStatus,
            [questionSet.questionSetId]: activeQuestions.length ? 1 : 0,
        };

        setQuestionStatus(questionStatus);
        setQuestionSetStatus(newQuestionSetStatus);

        const numberOfChangesQuestions = reduce(
            questionStatus,
            (result, value, key) => {
                return isEqual(value, existingQuestionStatus[key]) ? result : result.concat(key);
            },
            []
        ).length;

        const numberOfChangesGuidance = reduce(
            newGuidance,
            (result, value, key) => {
                return isEqual(value, existingGuidance[key]) ? result : result.concat(key);
            },
            []
        ).length;

        setCountOfChanges(numberOfChangesQuestions + numberOfChangesGuidance + existingCountOfChanges);

        const params = {
            questionStatus,
            questionSetStatus: newQuestionSetStatus,
            countOfChanges: numberOfChangesQuestions + numberOfChangesGuidance + existingCountOfChanges,
        };

        await patchSchemaRequest.mutateAsync({
            id: schemaId,
            ...params,
        });

        setLastSaved(saveTime());
        handleAnalytics(`Question ${questionId} switched`, value ? 'On' : 'Off');
    };

    const onClickSave = e => {
        e.preventDefault();
        setLastSaved(saveTime());
    };

    const redirectDashboard = e => {
        e.preventDefault();
        history.push({
            pathname: `/account`,
            search: `?tab=customisedataaccessrequests_applicationform&teamType=team&teamId=${publisherDetails._id}`,
        });
    };

    const toggleDrawer = () => {
        if (showDrawer === true) {
            searchBar.current.getNumberOfUnreadMessages();
        }
        setShowDrawer(!showDrawer);
    };

    const toggleModal = (showEnquiry = false, context = {}) => {
        setShowModal(!showModal);
        setContext(context);
        setShowDrawer(showEnquiry);
    };

    const updateNavigation = (newForm, schema) => {
        const newJsonSchema = schema || jsonSchema;
        // reset scroll to 0, 0
        window.scrollTo(0, 0);
        // copy state pages
        const pages = [...newJsonSchema.pages];
        // get the index of new form
        const newPageindex = pages.findIndex(page => page.pageId === newForm.pageId);
        // reset the current state of active to false for all pages
        const newFormState = [...newJsonSchema.pages].map(item => {
            return { ...item, active: false };
        });
        // update actual object model with property of active true
        newFormState[newPageindex] = { ...pages[newPageindex], active: true };
        // get set the active panelId
        let { panelId } = newForm;
        if (isEmpty(panelId) || typeof panelId === 'undefined') {
            ({ panelId } = [...newJsonSchema.formPanels].find(p => p.pageId === newFormState[newPageindex].pageId) || '');
        }

        setJsonSchema({ ...newJsonSchema, pages: newFormState });
        setActivePanelId(panelId);
        setActiveGuidance('');
        setActiveQuestion('');
        setActiveQuestionData(null);

        setActivePanel(newForm);
    };

    const onSubmitClick = async () => {
        await questionbankService.postQuestionbankItem(schemaId);
        handleAnalytics('Clicked Publish button', 'Application form');
        history.push({
            pathname: `/account`,
            search: `?tab=customisedataaccessrequests_applicationform&teamType=team&teamId=${publisherDetails._id}`,
            state: {
                alert: {
                    message: `You have successfully published the data access application form for ${publisherDetails.publisherDetails.name} applications`,
                },
            },
        });
    };

    const onNextClick = () => {
        onNextPanel();
    };

    const onNextPanel = () => {
        // 1. Copy formpanels
        const formPanels = [...jsonSchema.formPanels];
        // 2. Get activeIdx
        let activeIdx = formPanels.findIndex(p => p.panelId === activePanelId);
        // 3. Increment idx
        const nextIdx = ++activeIdx;
        // 4. Get activePanel - make sure newIdx doesnt exceed panels length
        const { panelId, pageId } = formPanels[nextIdx > formPanels.length - 1 ? 0 : nextIdx];
        // 5. Update the navigationState
        updateNavigation({ panelId, pageId });
    };

    const onQuestionAction = async (e = '', questionSetId = '', questionId = '', key = '') => {
        const activeGuidance = getActiveQuestionGuidance(questionId);
        const questions = getQuestionsList();

        if (!isEmpty(e)) {
            removeActiveQuestionClass();
            addActiveQuestionClass(e);
        }

        setActiveGuidance(activeGuidance);
        setActiveQuestion(questionId);
        setActiveQuestionData(getActiveQuestion(questions, questionId));
    };

    const getQuestionsList = () => {
        const { questionSets } = jsonSchema;
        const questionList = [...questionSets].filter(q => q.questionSetId.includes(activePanelId)) || [];
        return questionList.map(({ questions }) => questions).flat();
    };

    const getActiveQuestionGuidance = (questionId = '') => {
        if (!isEmpty(questionId)) {
            const questions = getQuestionsList();

            if (!isEmpty(questions)) {
                // 2. loop over and find active question
                const activeQuestion = getActiveQuestion([...questions], questionId);
                if (!isEmpty(activeQuestion)) {
                    const { guidance } = activeQuestion;
                    return guidance;
                }
                return '';
            }
        }
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

    /**
     * removeActiveQuestionClass
     * @desc Removes active class on a single question
     */
    const removeActiveQuestionClass = () => {
        const fGroups = document.querySelectorAll('.question-wrap');
        fGroups.forEach(key => key.classList.remove('active-group'));
    };

    /**
     * addActiveQuestionClass
     * @desc Adds active border to question clicked upon
     * @param - (e) eventObject
     */
    const addActiveQuestionClass = e => {
        if (!isEmpty(e)) {
            const fGroup = e.target.closest('.question-wrap');
            fGroup.classList.add('active-group');
        }
    };

    const resetGuidance = () => {
        removeActiveQuestionClass();

        setActiveGuidance('');
        setActiveQuestionData(null);
        setActiveQuestion('');
    };

    const onGuidanceChange = async (questionId, changedGuidance) => {
        if (typeof newGuidance[questionId] !== 'undefined') {
            newGuidance[questionId] = changedGuidance;
        } else {
            newGuidance[questionId] = changedGuidance;
        }
        setNewGuidance(newGuidance);

        const numberOfChangesQuestions = reduce(
            questionStatus,
            (result, value, key) => {
                return isEqual(value, existingQuestionStatus[key]) ? result : result.concat(key);
            },
            []
        ).length;

        const numberOfChangesGuidance = reduce(
            newGuidance,
            (result, value, key) => {
                return isEqual(value, existingGuidance[key]) ? result : result.concat(key);
            },
            []
        ).length;

        const unpublishedGuidanceChange = uniq([...unpublishedGuidance, questionId]);

        setCountOfChanges(numberOfChangesGuidance + numberOfChangesQuestions + existingCountOfChanges);

        const params = {
            guidance: newGuidance,
            countOfChanges: numberOfChangesGuidance + numberOfChangesQuestions + existingCountOfChanges,
            unpublishedGuidance: unpublishedGuidanceChange,
        };

        await patchSchemaRequest.mutateAsync({
            id: schemaId,
            ...params,
        });

        setLastSaved(saveTime());
        setUnpublishedGuidance(unpublishedGuidanceChange);
        handleAnalytics('Updating Guidance', questionId);
    };

    const handleShowClearModal = () => {
        setShowClearModal(true);
    };

    const handleShowClearSectionModal = () => {
        setShowClearSectionModal(true);
    };

    const handleClear = React.useCallback(async () => {
        await questionbankService.patchClearAll(publisherDetails._id);

        getMasterSchema(activePanelId);

        setShowClearModal(false);

        handleAnalytics('Clearing updates', 'Entire form');
    }, [activePanelId, publisherDetails._id]);

    const handleClearSection = React.useCallback(async () => {
        const page = darHelperUtils.findPageByQuestionSet(activePanelId, jsonSchema);

        await questionbankService.patchClearSection(publisherDetails._id, page.pageId);

        getMasterSchema(activePanelId);

        setShowClearSectionModal(false);

        handleAnalytics('Clearing updates', page.title);
    }, [activePanelId, publisherDetails._id]);

    const handleModalClose = () => {
        setShowConfirmPublishModal(false);
        setShowClearModal(false);
        setShowClearSectionModal(false);
    };

    const handleImportUpload = async (
        {
            questionStatus: uploadQuestionStatus,
            questionSetStatus: uploadQuestionSetStatus,
            guidance: uploadGuidance,
            jsonSchema: uploadJsonSchema,
        },
        { reset }
    ) => {
        setIsUploading(true);

        await questionbankService.patchClearAll(publisherDetails._id);

        const {
            data: {
                result: { questionStatus, questionSetStatus, guidance },
            },
        } = await questionbankService.getQuestionbankItem(publisherDetails._id);

        const newJsonSchema = darHelperUtils.injectReadonlyStaticContent(
            { ...uploadJsonSchema, ...classSchema, ...questionActions },
            {},
            publisherDetails,
            userState
        );
        const newPanelId = newJsonSchema.formPanels[0].panelId;

        const pageId = darHelperUtils.findPageIdByQuestionSet(newPanelId, newJsonSchema);

        const updatedGuidance = generalUtils.diffObjects(guidance, uploadGuidance);
        const updatedQuestionStatus = generalUtils.diffObjects(questionStatus, uploadQuestionStatus);
        const updatedQuestionSetStatus = generalUtils.diffObjects(questionSetStatus, uploadQuestionSetStatus);

        const params = {
            countOfChanges:
                Object.keys(updatedGuidance).length +
                Object.keys(updatedQuestionStatus).length +
                Object.keys(updatedQuestionSetStatus).length,
            guidance: updatedGuidance,
            questionStatus: uploadQuestionStatus,
            questionSetStatus: uploadQuestionSetStatus,
        };

        await patchSchemaRequest.mutateAsync({
            id: schemaId,
            ...params,
        });

        setIsUploaded(true);
        setIsUploading(false);

        reset();

        setUnpublishedGuidance(unpublishedGuidance);
        setJsonSchema(newJsonSchema);
        setQuestionStatus(uploadQuestionStatus);
        setQuestionSetStatus(uploadQuestionSetStatus);
        setExistingQuestionStatus(cloneDeep(uploadQuestionStatus));
        setNewGuidance(updatedGuidance);
        setExistingGuidance(cloneDeep(updatedGuidance));
        setCountOfChanges(params.countOfChanges);
        setExistingCountOfChanges(params.countOfChanges);
        setActivePanelId(newPanelId);

        updateNavigation(
            {
                pageId,
                panelId: newPanelId,
            },
            newJsonSchema
        );
    };

    const handleSuccessClose = React.useCallback(() => {
        setIsUploaded(false);

        patchSchemaRequest.reset();
    }, []);

    const renderApp = React.useCallback(() => {
        if (isUploading) {
            return <Loading />;
        }

        if (activePanelId === 'about') {
            return (
                <AboutApplication
                    sections={[
                        'Select the datasets you need',
                        'Name your application',
                        'Invite contributors',
                        'Read the advice from the data custodian',
                        'Communicate with the data custodian',
                        'Check what approvals you might need',
                        'Understand what happens after you submit the application',
                    ]}
                />
            );
        }

        if (activePanelId === 'additionalinformationfiles-files' || activePanelId === 'files') {
            return (
                <Card>
                    <Box px={5}>
                        <Uploads />
                    </Box>
                </Card>
            );
        }

        return (
            activePanelId && (
                <Winterfell
                    schema={jsonSchema}
                    questionAnswers={questionAnswers}
                    questionStatus={questionStatus}
                    questionSetStatus={questionSetStatus}
                    panelId={activePanelId}
                    disableSubmit
                    disableValidation
                    renderRequiredAsterisk={() => <span>*</span>}
                    customiseView
                    onSwitchChange={onSwitchChange}
                    onQuestionAction={onQuestionAction}
                    onGuidanceChange={onGuidanceChange}
                    onQuestionsetSwitchChange={onQuestionsetSwitchChange}
                    messageOptionalQuestionSet={({ on }) => {
                        const includedExcluded = on ? 'INCLUDED' : 'NOT INCLUDED';

                        return (
                            <Alert variant='info' mb={3} mt={1}>
                                <P>
                                    {on && (
                                        <Trans i18nKey='DAR.customise.optionalQuestionsIncluded'>
                                            ,<strong>{{ includedExcluded }}</strong>
                                        </Trans>
                                    )}
                                    {!on && (
                                        <Trans i18nKey='DAR.customise.optionalQuestionsExcluded'>
                                            ,<strong>{{ includedExcluded }}</strong>
                                        </Trans>
                                    )}
                                </P>
                            </Alert>
                        );
                    }}
                    icons={question => (
                        <UnpublishedQuestionIcon
                            question={question}
                            unpublishedGuidance={unpublishedGuidance}
                            activeQuestion={activeQuestion}
                        />
                    )}
                />
            )
        );
    }, [activePanelId, questionStatus, questionSetStatus, questionAnswers, unpublishedGuidance, isUploading]);

    const handleClose = () => {
        setShowSaveAlert(false);
    };

    const handleExport = useCallback(() => {
        const { pages, formPanels, questionPanels, questionSets, ...outerSchema } = jsonSchema;

        const currentDate = moment().format('YYYY-MM-DD');
        const fileName = `dar-${publisherDetails.name.replaceAll(' ', '-').toLowerCase()}-${currentDate}.json`;
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify({
                jsonSchema: {
                    pages,
                    formPanels,
                    questionPanels,
                    questionSets,
                },
                ...outerSchema,
                questionStatus,
                questionSetStatus,
            })
        )}`;
        const link = document.createElement('a');
        link.href = jsonString;
        link.download = fileName;
        link.click();
    }, [jsonSchema, publisherDetails, questionStatus, questionSetStatus]);

    Winterfell.addInputType('typeaheadCustom', TypeaheadCustom);
    Winterfell.addInputType('datePickerCustom', DatePickerCustom);
    Winterfell.addInputType('typeaheadUser', TypeaheadUser);
    Winterfell.addInputType('textareaInputCustom', TextareaInputCustom);
    Winterfell.addInputType('dropdownCustom', DropdownCustom);
    Winterfell.addInputType('doubleDropdownCustom', DoubleDropdownCustom);

    Winterfell.validation.default.addValidationMethods({
        isCustomDate: value => {
            if (isEmpty(value) || isNil(value) || moment(value, 'DD/MM/YYYY').isValid()) {
                return true;
            }
            return false;
        },
    });

    useEffect(() => {
        getMasterSchema();
    }, []);

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    const page = darHelperUtils.findPageByQuestionSet(activePanelId, jsonSchema);

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal />}>
            <div>
                <SearchBar
                    ref={searchBar}
                    searchString={searchString}
                    doSearchMethod={e =>
                        e.key === 'Enter' ? (window.location.href = `/search?search=${encodeURIComponent(searchString)}`) : null
                    }
                    doUpdateSearchString={setSearchString}
                    doToggleDrawer={toggleDrawer}
                    userState={userState}
                />
                <Row className='banner'>
                    <Col sm={12} md={8} className='banner-left'>
                        <span className='white-20-semibold mr-3'>Customise Data Access Request Form</span>

                        <span className='white-16-semibold pr-5'>{publisherDetails.publisherDetails.name}</span>
                    </Col>
                    <Col sm={12} md={4} className='d-flex justify-content-end align-items-center banner-right text-white'>
                        {lastSaved && (
                            <Box mr={5} display='flex' alignItems='center'>
                                {!patchSchemaRequest.isLoading && <Icon svg={<ClockIcon />} stroke='white' size='xl' mr={2} />}
                                {patchSchemaRequest.isLoading && <Spinner stroke='white' size='xl' mr={2} />}
                                <span className='white-14-semibold'>{lastSaved}</span>
                            </Box>
                        )}
                        <Button variant='tertiary' onClick={onClickSave} size='small' mr={5}>
                            Save now
                        </Button>

                        <Cta onClick={redirectDashboard} iconRight={<CloseButtonSvg width='1.3em' fill='white' />} color='white'>
                            Close
                        </Cta>
                    </Col>
                </Row>

                <div id='darContainer' className='flex-form'>
                    <div id='darLeftCol' className='scrollable-sticky-column'>
                        {(jsonSchema.pages || []).map((item, idx) => {
                            let navHeader;

                            if (item.pageId === 'export') {
                                const panel = jsonSchema.questionPanels.find(panel => panel.panelId === 'export');

                                navHeader = (
                                    <>
                                        {panel.navDescription}
                                        <Button onClick={handleExport} mt={2}>
                                            {panel.navHeader}
                                        </Button>
                                    </>
                                );
                            }

                            return (
                                <div key={`navItem-${idx}`} className={`${item.active ? 'active-border' : ''}`}>
                                    <div>
                                        <h3
                                            className={`black-16 ${item.active ? 'section-header-active' : 'section-header'} `}
                                            onClick={e => updateNavigation(item)}>
                                            <span>{item.title}</span>
                                        </h3>
                                        {item.active && (
                                            <ul className='list-unstyled section-subheader'>
                                                <NavItem
                                                    parentForm={item}
                                                    questionPanels={jsonSchema.questionPanels}
                                                    onFormSwitchPanel={updateNavigation}
                                                    activePanelId={activePanelId}
                                                    enabled
                                                    notForReview={false}
                                                    navHeader={navHeader}
                                                />
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div id='darCenterCol'>
                        <div id='darDropdownNav'>
                            <NavDropdown
                                options={{
                                    ...jsonSchema,
                                }}
                                onFormSwitchPanel={updateNavigation}
                                enabled
                            />
                        </div>

                        <Alert variant='info' icon={<Icon svg={<Clock />} size='lg' />} onClose={handleClose} dismissable mb={2} mr={2}>
                            <P>{t('DAR.customise.saveAlert')}</P>
                        </Alert>

                        {isUploaded && (
                            <Alert variant='success' dismissable onClose={handleSuccessClose} mb={2} mr={2}>
                                <P>{t('DAR.customise.uploadAlert')}</P>
                            </Alert>
                        )}

                        {activePanelId === 'about' && (
                            <>
                                <Card>
                                    <Box p={5}>
                                        <H5>Data Applicant’s View</H5>
                                        <P color='grey800' mb={0}>
                                            This is what the data applicant will see when they begin the full data access request. Please
                                            note that this section `Before you begin` cannot be customised.
                                        </P>
                                    </Box>
                                </Card>

                                {isCustodianTeamAdmin && (
                                    <Card>
                                        <Box p={5}>
                                            <AboutApplicationImport onUpload={handleImportUpload} userState={userState} />
                                        </Box>
                                    </Card>
                                )}
                            </>
                        )}

                        <div style={{ backgroundColor: '#ffffff' }} className='dar__header'>
                            {jsonSchema.pages
                                ? [...jsonSchema.pages].map((item, idx) =>
                                      item.active ? (
                                          <Typography
                                              key={`pageContent-${idx}`}
                                              color={activePanelId === 'about' ? 'grey500' : 'inherit'}
                                              as='div'>
                                              <H5 color='inherit'>{item.active ? item.title : ''}</H5>
                                              <RenderMarkdown source={item.description} />
                                          </Typography>
                                      ) : (
                                          ''
                                      )
                                  )
                                : ''}
                        </div>
                        <div
                            className={`dar__questions ${activePanelId === 'about' ? 'p-0 mb-0' : ''}`}
                            style={{ backgroundColor: '#ffffff' }}>
                            {renderApp()}
                        </div>
                    </div>
                    <div id='darRightCol' className='scrollable-sticky-column'>
                        <div className='darTab'>
                            <>
                                {activePanel?.panelGuidance || activeQuestion ? (
                                    <>
                                        <header>
                                            <div>
                                                <i className='far fa-question-circle mr-2' />
                                                <p className='gray800-14-bold'>{activeQuestionData?.question || activePanel?.navHeader}</p>
                                            </div>
                                            {activeQuestion && (
                                                <CloseButtonSvg width='16px' height='16px' fill='#475da' onClick={resetGuidance} />
                                            )}
                                        </header>
                                        <main className='gray800-14'>
                                            <CustomiseGuidance
                                                activeGuidance={newGuidance[activeQuestion] || activeGuidance}
                                                isLocked={darHelperUtils.isQuestionLocked(questionStatus[activeQuestion])}
                                                onGuidanceChange={onGuidanceChange}
                                                activeQuestion={activeQuestion}
                                                activePanel={activePanel}
                                            />
                                        </main>
                                    </>
                                ) : (
                                    <div className='darTab-guidance'>
                                        Hover on a question and click the icon to edit or view locked guidance
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div>

                <ActionBar userState={userState}>
                    <div className='action-bar'>
                        <div className='action-bar--questions'>
                            <ActionBarMenu
                                label='Clear updates'
                                variant='tertiary'
                                options={[
                                    {
                                        actions: [
                                            { title: `Clear updates for ${page.title}`, onClick: handleShowClearSectionModal },
                                            { title: 'Clear entire form', onClick: handleShowClearModal },
                                        ],
                                    },
                                ]}
                                alignStart
                                disabled={!countOfChanges}
                            />
                        </div>
                        <div className='action-bar-actions'>
                            <div className='amendment-count mr-3'>{countOfChanges} unpublished update</div>
                            <Button
                                disabled={!!countOfChanges < 1}
                                variant='secondary'
                                onClick={() => {
                                    setShowConfirmPublishModal(true);
                                }}>
                                Publish
                            </Button>
                            <Button onClick={onNextClick}>Next</Button>
                        </div>
                    </div>{' '}
                </ActionBar>

                <SideDrawer open={showDrawer} closed={toggleDrawer}>
                    <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
                </SideDrawer>

                <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />

                <Modal
                    data-testid='confirm-publish-modal'
                    show={showConfirmPublishModal || showClearSectionModal || showClearModal}
                    aria-labelledby='contained-modal-title-vcenter'
                    size='lg'
                    centered
                    onClose={handleModalClose}>
                    <div className='removeUploaderModal-header'>
                        <div className='removeUploaderModal-header--wrap'>
                            {(showClearSectionModal || showClearModal) && <H5>{t('questionbank.modal.clearUnpublishedUpdates')}</H5>}
                            <Typography color='grey800' as='div' mb={6}>
                                {showConfirmPublishModal &&
                                    (countOfChanges > 0 ? t('questionbank.modal.publishChanges') : t('questionbank.modal.noChanges'))}
                                {showClearSectionModal && t('questionbank.modal.clearSection')}
                                {showClearModal && t('questionbank.modal.clear')}
                            </Typography>
                        </div>
                    </div>
                    <div className='removeUploaderModal-footer'>
                        <div className='removeUploaderModal-footer--wrap'>
                            {showConfirmPublishModal &&
                                (countOfChanges > 0 ? (
                                    <>
                                        <Button variant='secondary' onClick={() => setShowConfirmPublishModal(false)}>
                                            {t('buttons.neverMind')}
                                        </Button>
                                        <Button onClick={onSubmitClick}>{t('buttons.publish')}</Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setShowConfirmPublishModal(false)}>{t('buttons.close')}</Button>
                                ))}

                            {(showClearSectionModal || showClearModal) && (
                                <>
                                    <Button
                                        variant='secondary'
                                        onClick={() =>
                                            showClearSectionModal ? setShowClearSectionModal(false) : setShowClearModal(false)
                                        }>
                                        {t('buttons.neverMind')}
                                    </Button>
                                    <Button onClick={showClearSectionModal ? handleClearSection : handleClear}>
                                        {t('buttons.clearUpdates')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        </Sentry.ErrorBoundary>
    );
};

export default DataAccessRequestCustomiseForm;
