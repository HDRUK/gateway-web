import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import * as Sentry from '@sentry/react';
import { isEmpty, isNil, reduce, isEqual, cloneDeep } from 'lodash';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router-dom';

import Winterfell from 'winterfell';
import { Row, Col, Container, Modal } from 'react-bootstrap';
import ErrorModal from '../commonComponents/errorModal';
import Loading from '../commonComponents/Loading';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import SearchBarHelperUtil from '../../utils/SearchBarHelper.util';
import { baseURL } from '../../configs/url.config';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import { classSchema } from './classSchema';

import TypeaheadCustom from './components/TypeaheadCustom/TypeaheadCustom';
import TypeaheadUser from './components/TypeaheadUser/TypeaheadUser';
import DatePickerCustom from './components/DatePickerCustom/DatepickerCustom';
import NavItem from './components/NavItem/NavItem';
import NavDropdown from './components/NavDropdown/NavDropdown';
import CustomiseGuidance from './components/CustomiseGuidance/CustomiseGuidance';

import 'react-tabs/style/react-tabs.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './DataAccessRequestCustomiseForm.scss';

export const DataAccessRequestCustomiseForm = props => {
    const history = useHistory();
    const [searchBar] = useState(React.createRef());

    const [schemaId, setSchemaId] = useState('');
    const [publisherDetails, setPublisherDetails] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [userState] = useState(
        props.userState || [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ]
    );
    const [showDrawer, setShowDrawer] = useState(false);
    const [lastSaved, setLastSaved] = useState('');
    const [isWideForm, setIsWideForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeGuidance, setActiveGuidance] = useState('');
    const [activeQuestion, setActiveQuestion] = useState('');
    const [context, setContext] = useState({});
    const [activePanelId, setActivePanelId] = useState('');
    const [jsonSchema, setJsonSchema] = useState({});
    const [questionAnswers] = useState({});
    const [questionStatus, setQuestionStatus] = useState({});
    const [existingQuestionStatus, setExistingQuestionStatus] = useState({});
    const [newGuidance, setNewGuidance] = useState({});
    const [existingGuidance, setExistingGuidance] = useState({});
    const [countOfChanges, setCountOfChanges] = useState({});
    const [existingCountOfChanges, setExistingCountOfChanges] = useState(0);
    const [showConfirmPublishModal, setShowConfirmPublishModal] = useState(false);

    useEffect(() => {
        if (window.location.search) {
            const values = queryString.parse(window.location.search);
        }
        getMasterSchema();
    }, []);

    const getMasterSchema = async () => {
        await axios.get(`${baseURL}/api/v1/publishers/${props.match.params.publisherID}`).then(res => {
            setPublisherDetails(res.data.publisher);
        });
        const {
            data: {
                result: { masterSchema, questionStatus, guidance, countOfChanges, schemaId },
            },
        } = await axios.get(`${baseURL}/api/v2/questionbank/${props.match.params.publisherID}`);

        const questionActions = {
            questionActions: [
                { key: 'guidanceEdit', icon: 'fas fa-pencil-alt', color: '#475da7', toolTip: 'Guidance', order: 1 },
                { key: 'guidanceLocked', icon: 'far fa-eye', color: '#475da7', toolTip: 'View locked guidance', order: 1 },
            ],
        };

        setSchemaId(schemaId);
        setJsonSchema({ ...masterSchema, ...classSchema, ...questionActions });
        setQuestionStatus(questionStatus);
        setExistingQuestionStatus(cloneDeep(questionStatus));
        setNewGuidance(guidance);
        setExistingGuidance(cloneDeep(guidance));
        setCountOfChanges(countOfChanges);
        setExistingCountOfChanges(countOfChanges);
        setActivePanelId(masterSchema.formPanels[0].panelId);
        setIsLoading(false);
    };

    const onSwitchChange = (questionId, value) => {
        questionStatus[questionId] = value ? 1 : 0;
        setQuestionStatus(questionStatus);

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
        setLastSaved(saveTime);

        const params = {
            questionStatus,
            countOfChanges: numberOfChangesQuestions + numberOfChangesGuidance + existingCountOfChanges,
        };

        axios.patch(`${baseURL}/api/v1/data-access-request/schema/${schemaId}`, params);
    };

    const onClickSave = e => {
        e.preventDefault();
        setLastSaved(saveTime);
    };

    const saveTime = () => {
        const currentTime = moment().format('DD MMM YYYY HH:mm');
        const lastSaved = `Last saved ${currentTime}`;
        return lastSaved;
    };

    const redirectDashboard = e => {
        e.preventDefault();
        history.push({
            pathname: `/account`,
            search: '?tab=customisedataaccessrequests',
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

    const updateNavigation = newForm => {
        // reset scroll to 0, 0
        window.scrollTo(0, 0);
        // copy state pages
        const pages = [...jsonSchema.pages];
        // get the index of new form
        const newPageindex = pages.findIndex(page => page.pageId === newForm.pageId);
        // reset the current state of active to false for all pages
        const newFormState = [...jsonSchema.pages].map(item => {
            return { ...item, active: false };
        });
        // update actual object model with property of active true
        newFormState[newPageindex] = { ...pages[newPageindex], active: true };
        // get set the active panelId
        let { panelId } = newForm;
        if (isEmpty(panelId) || typeof panelId === 'undefined') {
            ({ panelId } = [...jsonSchema.formPanels].find(p => p.pageId === newFormState[newPageindex].pageId) || '');
        }

        setJsonSchema({ ...jsonSchema, pages: newFormState });
        setActivePanelId(panelId);
        setIsWideForm(panelId === 'about' || panelId === 'files');
        setActiveGuidance('');
    };

    const onSubmitClick = async () => {
        await axios.post(`${baseURL}/api/v2/questionbank/${schemaId}`);

        history.push({
            pathname: `/account`,
            search: '?tab=customisedataaccessrequests_applicationform',
            state: {
                alert: {
                    message: `You have successfully published the data access application form for ${publisherDetails.publisherDetails.name} applications`,
                },
            },
        });
    };

    const onNextClick = () => {
        // 1. If in the about panel, we go to the next step.  Otherwise next panel.
        if (activePanelId === 'about') {
            // 2. Pass no completed bool value to go to next step without modifying completed status
            this.onNextStep();
            // 3. If we have reached the end of the about accordion, reset active accordion so all are closed
            if (this.state.activeAccordionCard >= 6) {
                this.setState({
                    activeAccordionCard: -1,
                });
                // 4. Move to the next step
                onNextPanel();
            }
        } else {
            onNextPanel();
        }
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

    const onNextStep = async completed => {
        // 1. Deconstruct current state
        /* let { aboutApplication, activeAccordionCard } = this.state;
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
		}); */
    };

    const onQuestionAction = async (e = '', questionSetId = '', questionId = '', key = '') => {
        const activeGuidance = getActiveQuestionGuidance(questionId);
        if (!isEmpty(e)) {
            removeActiveQuestionClass();
            addActiveQuestionClass(e);
        }
        setActiveGuidance(activeGuidance);
        setActiveQuestion(questionId);
    };

    const getActiveQuestionGuidance = (questionId = '') => {
        let questions;
        if (!isEmpty(questionId)) {
            const { questionSets } = jsonSchema;
            // 1. get active question set
            const questionList = [...questionSets].filter(q => q.questionSetId.includes(activePanelId)) || [];
            questions = questionList.map(({ questions }) => questions).flat();
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

    let getActiveQuestion = (questionsArr, questionId) => {
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
        // remove active question class
        removeActiveQuestionClass();
        // reset guidance state
        setActiveGuidance('');
    };

    const onGuidanceChange = (questionId, changedGuidance) => {
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

        setCountOfChanges(numberOfChangesGuidance + numberOfChangesQuestions + existingCountOfChanges);
        setLastSaved(saveTime);

        const params = {
            guidance: newGuidance,
            countOfChanges: numberOfChangesGuidance + numberOfChangesQuestions + existingCountOfChanges,
        };

        axios.patch(`${baseURL}/api/v1/data-access-request/schema/${schemaId}`, params);
    };

    const renderApp = () => {
        if (activePanelId === 'about') {
            /* return (
			<AboutApplication
				key={_id}
				activeAccordionCard={activeAccordionCard}
				allowedNavigation={allowedNavigation}
				userType={userType}
				selectedDatasets={aboutApplication.selectedDatasets}
				readOnly={readOnly || applicationStatus !== DarHelper.darStatus.inProgress}
				projectNameValid={projectNameValid}
				projectName={aboutApplication.projectName}
				nationalCoreStudiesProjects={nationalCoreStudiesProjects}
				ncsValid={ncsValid}
				completedReadAdvice={aboutApplication.completedReadAdvice}
				completedCommunicateAdvice={aboutApplication.completedCommunicateAdvice}
				completedApprovalsAdvice={aboutApplication.completedApprovalsAdvice}
				completedSubmitAdvice={aboutApplication.completedSubmitAdvice}
				completedInviteCollaborators={aboutApplication.completedInviteCollaborators}
				completedDatasetSelection={aboutApplication.completedDatasetSelection}
				isNationalCoreStudies={aboutApplication.isNationalCoreStudies}
				nationalCoreStudiesProjectId={aboutApplication.nationalCoreStudiesProjectId}
				context={context}
				toggleCard={toggleCard}
				toggleDrawer={toggleDrawer}
				onHandleDataSetChange={onHandleDataSetChange}
				onNextStep={onNextStep}
				onHandleProjectNameBlur={onHandleProjectNameBlur}
				onHandleProjectNameChange={onHandleProjectNameChange}
				onHandleProjectIsNCSToggle={onHandleProjectIsNCSToggle}
				onHandleNCSProjectChange={onHandleNCSProjectChange}
				renderTooltip={renderTooltip}
				toggleModal={toggleModal}
				toggleMrcModal={toggleMrcModal}
				toggleContributorModal={toggleContributorModal}
				areDatasetsAmended={areDatasetsAmended}
				datasetsAmendedBy={datasetsAmendedBy}
				datasetsAmendedDate={datasetsAmendedDate}
			/>
		); */
        } else if (activePanelId === 'files') {
            /* return <Uploads onFilesUpdate={onFilesUpdate} id={_id} files={files} readOnly={readOnly} />; */
        } else {
            return (
                <Winterfell
                    schema={jsonSchema}
                    questionAnswers={questionAnswers}
                    questionStatus={questionStatus}
                    panelId={activePanelId}
                    disableSubmit
                    disableValidation
                    renderRequiredAsterisk={() => <span>*</span>}
                    customiseView
                    onSwitchChange={onSwitchChange}
                    onQuestionAction={onQuestionAction}
                    // readOnly={true}
                    /* onQuestionClick={onQuestionSetAction}
					onQuestionAction={onQuestionAction}
					onUpdate={onFormUpdate}
					onSubmit={onFormSubmit} */
                />
            );
        }
    };

    Winterfell.addInputType('typeaheadCustom', TypeaheadCustom);
    Winterfell.addInputType('datePickerCustom', DatePickerCustom);
    Winterfell.addInputType('typeaheadUser', TypeaheadUser);
    Winterfell.validation.default.addValidationMethods({
        isCustomDate: value => {
            if (isEmpty(value) || isNil(value) || moment(value, 'DD/MM/YYYY').isValid()) {
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
                    ref={searchBar}
                    searchString={searchString}
                    doSearchMethod={e =>
                        e.key === 'Enter' ? (window.location.href = `/search?search=${encodeURIComponent(searchString)}`) : null
                    }
                    doUpdateSearchString={searchString => setSearchString(searchString)}
                    doToggleDrawer={toggleDrawer}
                    userState={userState}
                />
                <Row className='banner'>
                    <Col sm={12} md={8} className='banner-left'>
                        <span className='white-20-semibold mr-3'>Customise Data Access Request Form</span>

                        <span className='white-16-semibold pr-5'>{publisherDetails.publisherDetails.name}</span>
                    </Col>
                    <Col sm={12} md={4} className='d-flex justify-content-end align-items-center banner-right'>
                        <span className='white-14-semibold'>{!isEmpty(lastSaved) ? lastSaved : ''}</span>
                        <a className='linkButton white-14-semibold ml-2' onClick={onClickSave} href='javascript:void(0)'>
                            Save now
                        </a>
                        <CloseButtonSvg width='16px' height='16px' fill='#fff' onClick={e => redirectDashboard(e)} />
                    </Col>
                </Row>

                <div id='darContainer' className='flex-form'>
                    <div id='darLeftCol' className='scrollable-sticky-column'>
                        {[...jsonSchema.pages].map((item, idx) => (
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
                                            />
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div id='darCenterCol' className={isWideForm ? 'extended' : ''}>
                        {/* 
						{isEmpty(alert) && (
							<Alert variant={'success'} className='main-alert'>
								<SVGIcon name='check' width={24} height={24} fill={'#2C8267'} /> {alert.message}
							</Alert>
						)} */}
                        <div id='darDropdownNav'>
                            <NavDropdown
                                options={{
                                    ...jsonSchema,
                                }}
                                onFormSwitchPanel={updateNavigation}
                                enabled
                            />
                        </div>
                        <div style={{ backgroundColor: '#ffffff' }} className='dar__header'>
                            {jsonSchema.pages
                                ? [...jsonSchema.pages].map((item, idx) =>
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
                            className={`dar__questions ${activePanelId === 'about' ? 'pad-bottom-0' : ''}`}
                            style={{ backgroundColor: '#ffffff' }}>
                            {renderApp()}
                        </div>
                    </div>
                    {isWideForm ? null : (
                        <div id='darRightCol' className='scrollable-sticky-column'>
                            <div className='darTab'>
                                <>
                                    {activeGuidance ? (
                                        <>
                                            <header>
                                                <div>
                                                    <i className='far fa-question-circle mr-2' />
                                                    <p className='gray800-14-bold'>Guidance</p>
                                                </div>
                                                <CloseButtonSvg width='16px' height='16px' fill='#475da' onClick={resetGuidance} />
                                            </header>
                                            <main className='gray800-14'>
                                                <CustomiseGuidance
                                                    activeGuidance={
                                                        typeof newGuidance[activeQuestion] !== 'undefined'
                                                            ? newGuidance[activeQuestion]
                                                            : activeGuidance
                                                    }
                                                    isLocked={
                                                        typeof questionStatus[activeQuestion] !== 'undefined'
                                                            ? questionStatus[activeQuestion] === 2
                                                            : false
                                                    }
                                                    onGuidanceChange={onGuidanceChange}
                                                    activeQuestion={activeQuestion}
                                                />
                                            </main>
                                        </>
                                    ) : (
                                        <div className='darTab-guidance'>Hover on a question to edit or view locked guidance</div>
                                    )}
                                </>
                            </div>
                        </div>
                    )}
                </div>

                <ActionBar userState={userState}>
                    <div className='action-bar'>
                        <div className='action-bar--questions'>
                            <button
                                className='button-tertiary'
                                onClick={() => {
                                    onNextClick();
                                }}>
                                Clear updates
                            </button>
                        </div>
                        <div className='action-bar-actions'>
                            <div className='amendment-count mr-3'>{countOfChanges} unpublished update</div>

                            <button
                                className='button-secondary'
                                onClick={() => {
                                    setShowConfirmPublishModal(true);
                                }}>
                                Publish
                            </button>

                            <button
                                className='button-primary'
                                onClick={() => {
                                    onNextClick();
                                }}>
                                Next
                            </button>
                        </div>
                    </div>{' '}
                </ActionBar>

                <SideDrawer open={showDrawer} closed={toggleDrawer}>
                    <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
                </SideDrawer>

                <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />

                <Modal
                    data-testid='confirm-publish-modal'
                    show={showConfirmPublishModal}
                    size='lg'
                    aria-labelledby='contained-modal-title-vcenter'
                    centered>
                    <div className='removeUploaderModal-header'>
                        <div className='removeUploaderModal-header--wrap'>
                            <div className='removeUploaderModal-head'>
                                <h1 className='black-20-semibold'>
                                    {countOfChanges > 0 ? 'Publish application form' : 'You must make an update before publishing'}
                                </h1>
                                <CloseButtonSvg
                                    className='removeUploaderModal-head--close'
                                    onClick={() => setShowConfirmPublishModal(false)}
                                />
                            </div>
                            <div className='gray700-13 new-line'>
                                {countOfChanges > 0
                                    ? 'Are you sure you want to publish your updates to this application form? Any applications which are already in process will not be updated.'
                                    : 'No changes have been made to your application form so it cannot be published.'}
                            </div>
                        </div>
                    </div>
                    <div className='removeUploaderModal-footer'>
                        {countOfChanges > 0 ? (
                            <div className='removeUploaderModal-footer--wrap'>
                                <button className='button-secondary' onClick={() => setShowConfirmPublishModal(false)}>
                                    No, nevermind
                                </button>
                                <button
                                    className='button-primary'
                                    onClick={() => {
                                        onSubmitClick();
                                    }}>
                                    Publish
                                </button>
                            </div>
                        ) : (
                            <div className='removeUploaderModal-footer--wrap'>
                                <button className='button-primary' onClick={() => setShowConfirmPublishModal(false)}>
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </Sentry.ErrorBoundary>
    );
};

export default DataAccessRequestCustomiseForm;
