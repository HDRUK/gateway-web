

import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import Winterfell from 'winterfell';
import _ from 'lodash';
import moment from 'moment';
import TypeaheadCustom from './components/TypeaheadCustom'
import DatePickerCustom from './components/DatepickerCustom';
import SearchBar from '../commonComponents/SearchBar';
import Loading from '../commonComponents/Loading';
import ToolKit from './components/Toolkit';
import NavItem from './components/NavItem';
import DarValidation from '../../utils/DarValidation.util';
import {formSchema} from './formSchema';
import {classSchema} from './classSchema';
import 'react-tabs/style/react-tabs.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import SVGIcon from "../../images/SVGIcon"

import { axiosIG } from '../../utils/axios.util';

class DataAccessRequest extends Component {

    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormUpdate = this.onFormUpdate.bind(this);
        this.onQuestionFocus = this.onQuestionFocus.bind(this);
    }
    
    state = {
        _id: '',
        schema: {},
        questionAnswers: {},
        applicationStatus: '',
        activePanelId: '',
        activeGuidance: '',
        searchString: '',
        key: 'guidance',
        totalQuestions: '',
        validationErrors: {},
        lastSaved: {
            time: '',
            ago: ''
        },
        isLoading: true,
        formSubmitted: false,
    }

    async componentDidMount() {
        try {
            let { location: { state: { dataSetId }}} = this.props;
            const response = await axiosIG.get(`/api/v1/data-access-request/dataset/${dataSetId}`);
            const { data: { data: { jsonSchema, questionAnswers, _id, applicationStatus }}} = response;
            this.setState({schema: {...jsonSchema, ...classSchema}, questionAnswers, _id, applicationStatus, activePanelId: 'applicant', isLoading: false});
            // this.setState({schema: {...formSchema}, activePanelId: 'mrcHealthDataToolkit', isLoading: false, applicationStatus: 'inProgress'});
        }
        catch (error) {
            this.setState({isLoading: false});
            console.log(error);
        }
    }
    /**
     * [TotalQuestionAnswered]
     * @desc - Sets total questions answered for each section
     */
    totalQuestionsAnswered = (panelId = '', questionAnswers = {}) => {
        let totalQuestions = 0;
        let totalAnsweredQuestions = 0;
        if(!_.isEmpty(panelId)) {
            if(_.isEmpty(questionAnswers))
                ({questionAnswers} = {...this.state})
            // 1. deconstruct state
            let {schema: {questionSets}} = {...this.state};
            // 2. omits out blank null, undefined, and [] values from this.state.answers
            questionAnswers = _.pickBy({...questionAnswers}, v => v !== null && v !== undefined && v.length != 0);
            // 3. find the relevant questionSet { questionSetId: applicant }
            let questionSet = [...questionSets].find(q => q.questionSetId === panelId) || '';
            if(!_.isEmpty(questionSet)) {
                // 4. get questions
                let { questions } = questionSet;
                // 5. total questions in panel 
                totalQuestions = questions.length;
                let totalQuestionKeys = _.map({...questions}, 'questionId');
                // 6. return count of how many questions completed 
                if(!_.isEmpty(questionAnswers)){
                    let count = Object.keys(questionAnswers).map((value) => { 
                        return totalQuestionKeys.includes(value) ? totalAnsweredQuestions++ : totalAnsweredQuestions;
                    });
                }        
                // this.setState({ totalQuestionsAnswered: `${totalAnsweredQuestions}/${totalQuestions}  questions answered in this section`});    
                return `${totalAnsweredQuestions}/${totalQuestions}  questions answered in this section`;
            }
        }
    }

    /**
     * [saveTime]
     * @desc Sets the lastSaved state on a field
     */
    saveTime = () => {
        let currentTime = moment();
        let lastUpdate = this.state.lastSaved.time;
        let ago = '';
        if(!_.isEmpty(lastUpdate)) {
            let min = moment(currentTime.diff(lastUpdate)).format('m');
            let sec = moment(currentTime.diff(lastUpdate)).format('s');
            ago = min > 0 ?  `Last saved ${min} minute(s) ago` : `Last saved ${sec} seconds ago`;
        } 
        return { time: currentTime, ago}
    }

    /**
     * [getSavedAgo]
     * @desc Returns the saved time for DAR
     */
    getSavedAgo = () => {
        let {lastSaved: {time = '', ago = ''}} = this.state;
        if(!_.isEmpty(time))
            return `${ago != '' ? ago : `Last saved ${moment(time).format('HH:mm')}`}`;
        else
            return ``;
    }

    onFormRender() {
        console.log('form render');
    }

    
    getActiveQuestion(questionsArr, questionId) {
        let child;
        
        if (!questionsArr) 
            return; 
        
        for (const questionObj of questionsArr) {
            if (questionObj.questionId === questionId) 
                return questionObj; 

            if(typeof questionObj.input === 'object' && typeof questionObj.input.options !== 'undefined') {
                questionObj.input.options
                    .filter(option => {
                        return typeof option.conditionalQuestions !== 'undefined' &&  option.conditionalQuestions.length > 0;
                    })
                    .forEach(option => {         
                        child = this.getActiveQuestion(option.conditionalQuestions, questionId);
                    });
            }

            if (child) 
                return child; 
        }
     }

    onQuestionFocus(questionId = '') {
        let questions;
        if(!_.isEmpty(questionId)) {
            let {schema: { questionSets } } = this.state;
            // 1. get active question set
            ({questions} = [...questionSets].find(q => q.questionSetId === this.state.activePanelId) || []);
            if(!_.isEmpty(questions)) {
                // 2. loop over and find active question 
                let activeQuestion = this.getActiveQuestion([...questions], questionId);
                if(!_.isEmpty(activeQuestion))
                    this.setState({activeGuidance: activeQuestion.guidance});
            }
        }
    }
    
    /**
     * [onFormUpdate]
     * @param {obj: questionAnswers}
     * @desc Callback from Winterfell sets totalQuestionsAnswered + saveTime
     */
    onFormUpdate = _.debounce((questionAnswers) => {
        const { applicationStatus } = this.state;
        let totalQuestionsAnswered = this.totalQuestionsAnswered(this.state.activePanelId, questionAnswers);
        this.setState({totalQuestions: totalQuestionsAnswered});
        if(applicationStatus === 'submitted')
            return alert('Your application has already been submitted.');

        this.onApplicationUpdate(questionAnswers);
    }, 500);

    /**
     * [Form Submit]
     * @desc Submitting data access request
     * @params  Object{questionAnswers}
     */
    onFormSubmit = async (questionAnswers = {}) => {
        let invalidQuestions = DarValidation.getQuestionPanelInvalidQuestions(Winterfell, this.state.schema.questionSets, this.state.questionAnswers);
        let validationSectionMessages = DarValidation.buildInvalidSectionMessages(Winterfell, invalidQuestions);
        let inValidMessages = DarValidation.buildInvalidMessages(Winterfell, invalidQuestions);
        let errors = DarValidation.formatValidationObj(inValidMessages, [...this.state.schema.questionPanels]);
        let isValid = Object.keys(errors).length ? false : true;
        if(this.state.applicationStatus === 'submitted')
            return alert('Your application has already been submitted.');

        if(isValid) {
            try {
                let {_id: id} = this.state;
                // 1. POST 
                const response = await axiosIG.post(`/api/v1/data-access-request/${id}`, {});
                const lastSaved = this.saveTime();
                this.setState({ lastSaved });
                // 2. Add success banner to local storage
                let message = {"type":"success", "message":"Done! Your application was submitted successfully"};
                window.localStorage.setItem('alert', JSON.stringify(message));
                this.props.history.push({pathname: "/account", search:"?tab=dataaccessrequests"});
            } catch (err) {
                console.log(err);
            }
        } else {
            let activePage               =  _.get(_.keys({...errors}), 0);
            let activePanel              =  _.get(_.keys({...errors}[activePage]), 0);
            let validationMessages       = validationSectionMessages;
            alert('Please resolve the following validation issues');
            this.updateNavigation({pageId: activePage, panelId: activePanel}, validationMessages);
        }
    }

    /**
     * [onApplicationUpdate]
     * @desc Updates answers to the questions PATCH
     * @method PATCH
     * @param {obj: questionAnswers}
     */
    onApplicationUpdate = async (questionAnswers) => {
        try {
            // 1. spread copy of data, and remove blank null undefined values
            const data = _.pickBy({...this.state.questionAnswers, ...questionAnswers}, _.identity);
            // 2. get id
            let {_id: id} = this.state;
            // 3. set up body params
            let params = {
                questionAnswers: JSON.stringify(data)
            }
            // 4. PATCH the data
            const response = await axiosIG.patch(`/api/v1/data-access-request/${id}`, params);
            // 6. get saved time
            const lastSaved = this.saveTime();
            // 5. set state
            this.setState({ questionAnswers: {...data}, lastSaved});
        } catch(err) {
            console.log(err);
        }
    }

    onNextPanel(activePanelId){
        if (activePanelId === "mrcHealthDataToolkit" || activePanelId === "adviceFromPublisher"){
            // 1. filter for the first section safePeople and get the first obj
            let {panelId, pageId} = _.head([...this.state.schema.formPanels].filter(p => {
                                        return p.pageId === 'safePeople' || p.pageId === 'safepeople'
                                    }));
            this.updateNavigation({panelId, pageId});
        }
        else {
            const formPanels = [...this.state.schema.formPanels];
            const currentPanelIndex = formPanels.findIndex(panel => panel.panelId === activePanelId);
            const newPanelIndex = currentPanelIndex + 2;
            const nextPanelIndex = formPanels.findIndex(panel => panel.index === newPanelIndex);
            if(nextPanelIndex === -1){
                console.log("at the end!")
            }
            else {
                const { panelId, pageId } = formPanels.find(panel => panel.index === newPanelIndex);;
                this.updateNavigation({panelId, pageId });
            }
        }
    }

    /**
     * [doSearch]
     * @desc - Injected from props, parent function callout
     */
    doSearch = (e) => { 
        if (e.key === 'Enter') {
          if (!!this.state.searchString) {
            window.location.href = "/search?search=" + this.state.searchString;
          }
        }
    }
    
    updateSearchString = (searchString) => {
        this.setState({ searchString: searchString });
    }

    handleSelect = (key) => {
        this.setState({ key: key });
        // this.props.history.push(window.location.pathname + '?tab=' + key);
    }

       /**
     * [UpdateNavigation]
     * @desc - Update the navigation state sidebar
     */
    updateNavigation = (newForm, validationErrors = {}) => {
        let panelId = '';
        const currentActivePage = [...this.state.schema.pages].find(p => p.active === true);
        // copy state pages
        const pages = [...this.state.schema.pages];
        // get the index of new form
        const newPageindex = pages.findIndex(page => page.pageId === newForm.pageId);
        // reset the current state of active to false for all pages
        const newFormState = [...this.state.schema.pages].map((item) => {
            return {...item, active: false}
        });
        // update actual object model with propert of active true
        newFormState[newPageindex] = {...pages[newPageindex], active: true};

        // get set the active panelId 
        ({ panelId } = newForm);
        if (_.isEmpty(panelId) || typeof panelId == 'undefined') {
            ({panelId} = [...this.state.schema.formPanels].find(p => p.pageId === newFormState[newPageindex].pageId) || '');
        } 
        let totaltotalQuestionsAnswered = this.totalQuestionsAnswered(panelId);
        this.setState({ schema: {...this.state.schema, pages: newFormState}, activePanelId: panelId, totalQuestions:totaltotalQuestionsAnswered, validationErrors});
    }

    onClickSave = (e) =>{
        e.preventDefault();
        const lastSaved = this.saveTime();
        this.setState({ lastSaved});
    }
    
    render() {
        const { searchString, activePanelId, totalQuestions, isLoading, validationErrors, activeGuidance} = this.state;
        const { userState, location:{state: {title = '', publisher='' }} } = this.props;

        Winterfell.addInputType('typeaheadCustom', TypeaheadCustom);
        Winterfell.addInputType('datePickerCustom', DatePickerCustom);

        if (isLoading) {
            return (
                <Container>
                    <Loading />
                </Container>
            );
        } 
        
        return (
            <div>
                <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />
                <Row className="banner">
                    <Col md={11}>
                        <span className="ml-3 white-20-semibold mr-5">Data Access Request</span>
                        <span className="white-16-semibold pr-5">{title} | {publisher}</span>
                        <span className="white-16-semibold ml-2">{this.getSavedAgo()}</span>
                    </Col>
                    <Col md={1}>
                        {/* <CloseIconSvg className="icon-18" /> */}
                        <SVGIcon name="closeicon" fill={'#ffffff'} className="badgeSvg mr-2" />

                    </Col>
                </Row>

                <Row className="mt-5 fillPage">
                    <Col md={2}>
                        {[...this.state.schema.pages].map((item, idx) => (
                            <div key={item.index} className={`${item.active ? "active-border" : ''}`}>
                                <div>
                                    <h1 className="black-16 mb-3 ml-3" onClick={e => this.updateNavigation(item)}>{item.title}</h1>
                                    { item.active &&
                                        <ul className="list-unstyled ml-4 pl-2 active-grey-border">
                                            <NavItem
                                                parentForm={item}
                                                questionPanels={this.state.schema.questionPanels}
                                                onFormSwitchPanel={this.updateNavigation}
                                            />
                                        </ul>
                                    }
                                </div>
                            </div>
                        ))}
                    </Col>
                    <Col md={10} className="flexColumn">
                        <Row>
                            <Col sm={7} md={8} className="pad-1">
                                <div style={{ backgroundColor: "#ffffff" }} className="dar__header">
                                    {[...this.state.schema.pages].map((item) => (
                                        item.active ?
                                            <Fragment>
                                                <p className="black-20-semibold mb-0">{item.active ? item.title : ""}</p>
                                                <p className="gray800-14">{item.active ? item.description : ""}</p>
                                            </Fragment>
                                        : ''
                                    ))}
                                </div>
                                <div className="dar__questions gray800-14" style={{ backgroundColor: "#ffffff" }} >
                                            <Col md={12}>
                                                <Winterfell
                                                    schema={this.state.schema}
                                                    questionAnswers={this.state.questionAnswers}
                                                    panelId={this.state.activePanelId}
                                                    disableSubmit={true}
                                                    validationErrors={validationErrors}
                                                    onQuestionFocus={this.onQuestionFocus}
                                                    onUpdate={this.onFormUpdate}
                                                    onSubmit={this.onFormSubmit}
                                                    onRender={this.onFormRender}
                                                />
                                            </Col>
                                        </div>
                                
                            </Col>
                            <Col sm={5} md={4} className="darTabs pr-0 pl-0">
                            <Tabs className='tabsBackground gray700-14' activeKey={this.state.key} onSelect={this.handleSelect}>
                                <Tab eventKey="guidance" title="Guidance">
                                    <div className="darTab">
                                        <Col md={12} className="gray700-13 text-center">
                                            <span>{activeGuidance ? activeGuidance : 'Active guidance for questions'}.</span>
                                        </Col>
                                    </div>
                                </Tab>
                                <Tab eventKey="answers" title="Answers">
                                    <div className="darTab">
                                        <Col md={12} className="gray700-13 mt-2">
                                            <span>Re-use answers from your previous applications</span>
                                            <br /> <br />
                                            <span className="comingSoonBadge"> Coming soon </span>
                                        </Col>
                                    </div>
                                </Tab>
                                <Tab eventKey="notes" title="Notes">
                                    <div className="darTab">
                                        <Col md={12} className="gray700-13 mt-2">
                                            <span>Data custodians cannot see your notes. </span>
                                            <br /> <br />
                                            <span>You can use notes to capture your thoughts or communicate with any other applicants you invite to collaborate.</span>
                                            <br /> <br />
                                            <span className="comingSoonBadge"> Coming soon </span>
                                        </Col>
                                    </div>
                                </Tab>
                                <Tab eventKey="messages" title="Messages">
                                    <div className="darTab">
                                        <Col md={12} className="gray700-13 mt-2">
                                            <span>Both data custodian and applicants can see messages</span>
                                            <br /> <br />
                                            <span>Use messages to seek guidance or clarify questions with the data custodian. You can send messages before or after the application is submitted. You will be notified of every new message, and so will the data custodian.</span>
                                            <br /> <br />
                                            <span className="comingSoonBadge"> Coming soon </span>
                                        </Col>
                                    </div>
                                </Tab>
                            </Tabs>
                            </Col>
                        </Row>
                        
                    </Col>
                    
                    <div className="darFooter">
                        <Col md={6} className="mt-4">
                            <span className="gray800-14">{totalQuestions}</span>
                        </Col>
                        <Col md={6} className="mt-3 text-right">
                            <Button variant="white" className="techDetailButton ml-2" onClick={this.onClickSave}>
                                Save
                            </Button>
                            <Button variant="white"  className="techDetailButton ml-3" onClick={this.onFormSubmit}>
                                Submit application
                            </Button>
                        </Col>
                    </div> 
                </Row>
            </div>
        ) 
        
    }
}


  

export default DataAccessRequest;   
   
