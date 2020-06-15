

import React, { Component } from 'react';
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
import { ReactComponent as CloseIconSvg } from '../../images/close.svg';
import axios from 'axios';
import {classSchema} from './classSchema';
import {formSchema} from './formSchema';
import { baseURL } from '../../configs/url.config';
import 'react-tabs/style/react-tabs.css';

class DataAccessRequest extends Component {

    constructor(props) {
        super(props);
        this.onFormSwitchPanel = this.onFormSwitchPanel.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormUpdate = this.onFormUpdate.bind(this);
    }
    
    state = {
        _id: '',
        schema: {},
        questionAnswers: {},
        applicationStatus: '',
        activePanelId: '',
        searchString: '',
        key: 'guidance',
        totalAnsweredQuestions: '',
        lastSaved: {
            time: '',
            ago: ''
        },
        isLoading: true
    }

    async componentDidMount() {
        try {
            let { location: { state: { dataSetId }}} = this.props;
            const response = await axios.get(`${baseURL}/api/v1/data-access-request/${dataSetId}`);
            const { data: { data: { jsonSchema, questionAnswers, _id, applicationStatus }}} = await response;
            this.setState({schema: {...jsonSchema, ...classSchema}, questionAnswers, _id, applicationStatus, activePanelId: 'mrcHealthDataToolkit', isLoading: false});
            // this.setState({schema: {...formSchema}, activePanelId: 'mrcHealthDataToolkit', isLoading: false});
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
    totalQuestionsAnswered = (panelId = '') => {
        let totalQuestions = 0;
        let totalAnsweredQuestions = 0;
        if(!_.isEmpty(panelId)) {
            // 1. deconstruct state
            let {schema: {questionSets}, questionAnswers} = this.state;
            // 2. omits out blank null undefined values from this.state.answers
            questionAnswers  =  _.pickBy({...questionAnswers }, _.identity);
            let questionSet = [...questionSets].find(q => q.questionSetId === panelId) || '';
            if(!_.isEmpty(questionSet)) {
                let { questions } = questionSet;
                totalQuestions = questions.length;
                let totalQuestionKeys = _.map({...questions}, 'questionId');
                if(!_.isEmpty(questionAnswers)){
                   let count = Object.keys(questionAnswers).map((value) => { 
                       return totalQuestionKeys.includes(value) ? totalAnsweredQuestions++ : totalAnsweredQuestions;
                    });
                }                
                this.setState({ totalAnsweredQuestions: `${totalAnsweredQuestions}/${totalQuestions}  questions answered in this section`});
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
        this.setState({lastSaved: {time: currentTime, ago}})
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
    
    /**
     * [onFormUpdate]
     * @param {obj: questionAnswers}
     * @desc Callback from Winterfell sets totalQuestionsAnswered + saveTime
     */
    onFormUpdate = _.debounce((questionAnswers) => {
        this.totalQuestionsAnswered(this.state.activePanelId);
        this.onApplicationUpdate(questionAnswers);
    }, 500);

    onFormSwitchPanel(panelId) {
        if(!_.isEmpty(panelId)) {
            this.setState({ activePanelId: panelId});
            this.totalQuestionsAnswered(panelId);
        }
    }

    onFormSubmit = async (questionAnswers = {}, target = '') => {
        if(!_.isEmpty(this.state.questionAnswers)) {
            try {
                let {_id: id} = this.state;
                // 1. POST 
                const response = await axios.post(`${baseURL}/api/v1/data-access-request/${id}`, {});
                alert(`Application saved on ${moment().format('DD/MM/YYYY HH:mm:sss')}`);
                this.saveTime();
            } catch (err) {
                console.log(err);
            }
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
            debugger;
            // 4. PATCH the data
            const response = await axios.patch(`${baseURL}/api/v1/data-access-request/${id}`, params);
            // 5. set state
            this.setState({ questionAnswers: {...data}});
            // 6. show / set save time
            this.saveTime();
        } catch(err) {
            console.log(err);
        }
    }

    onParentNavClick(item) {
        this.updateNavigation(item);
    }

    /**
     * [onSwitchedPanel]
     * @desc - Winterfell callback for formPanel update
     */
    onSwitchedPanel = (newForm) => {
        this.updateNavigation(newForm);
    }

    onNextPanel(activePanelId){
        if (activePanelId === "mrcHealthDataToolkit" || activePanelId === "adviceFromPublisher"){
            this.onFormSwitchPanel("applicant")
            this.onSwitchedPanel({"index":3,"panelId":"applicant","pageId":"safePeople"})
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
                const newForm = formPanels.find(panel => panel.index === newPanelIndex);
                this.onFormSwitchPanel(newForm.panelId);
                const formPages = [...this.state.schema.pages];
                const newPage = formPages.find(page => page.pageId === newForm.pageId);
                this.onParentNavClick(newPage);
            }
        }
    }

    /**
     * [UpdateNavigation]
     * @desc - Update the navigation state sidebar
     */
    updateNavigation = (newForm) => {
        const currentActivePage = [...this.state.schema.pages].find(p => p.active === true);
        if(currentActivePage.pageId !== newForm.pageId) {
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
            // get the activepanel and panelId Property
            let { panelId } = [...this.state.schema.formPanels].find(p => p.pageId === newFormState[newPageindex].pageId) || '';
            if (!_.isEmpty(panelId) || typeof panel !== 'undefined') {
                this.setState({ schema: {...this.state.schema, pages: newFormState}, activePanelId: panelId});
                this.totalQuestionsAnswered(panelId);
            } 
            else {
                this.setState({ schema: {...this.state.schema, pages: newFormState}});
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
    
    render() {
        const { searchString, activePanelId, totalAnsweredQuestions, isLoading} = this.state;
        const { userState, location:{state: {title, publisher }} } = this.props;

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
                <Row className="Banner">
                    <Col md={11}>
                        <span className="ml-3 White-20px mr-5">Data Access Request</span>
                        <span className="White-16px pr-5">{title} | {publisher}</span>
                        <span className="White-16px ml-2">{this.getSavedAgo()}</span>
                    </Col>
                    <Col md={1}>
                        <CloseIconSvg className="Icon-18px" />
                    </Col>
                </Row>

                <div className="darForm">
                <Row className="mt-5 ml-1 FillPage">
                    <Col md={2}>
                        {[...this.state.schema.pages].map((item, idx) => (
                            <div key={item.index} className={`${item.active ? "active-border" : ''}`}>
                                <div>
                                    <h1 className="Black-16px mb-3 ml-3" onClick={() => { this.onParentNavClick(item) }}>{item.title}</h1>
                                    { item.active &&
                                        <ul className="list-unstyled ml-4 pl-2 active-grey-border">
                                            <NavItem
                                                parentForm={item}
                                                questionPanels={this.state.schema.questionPanels}
                                                onFormSwitchPanel={this.onFormSwitchPanel}
                                            />
                                        </ul>
                                    }
                                </div>
                            </div>
                        ))}
                    </Col>
                    <Col md={7} className="FlexColumn">
                        <Row style={{ backgroundColor: "#ffffff" }} className="pl-4">
                            {[...this.state.schema.pages].map((item, idx) => (
                                <div >
                                    <p className="Black-20px">{item.active ? item.title : ""}</p>
                                    <p className="Gray800-14px">{item.active ? item.description : ""}</p>
                                </div>
                            ))}
                        </Row>
                        { activePanelId === "mrcHealthDataToolkit" || activePanelId === "adviceFromPublisher" ?
                            <div>
                                <Row className="mt-2 pt-3 pl-3 pb-3 Gray800-14px White">
                                    <Col md={12}>
                                        <Row className="Black-17px-Bold">
                                            MRC Health Data Access toolkit
                                    </Row>
                                        <Row className="Gray800-15px mt-2">
                                            This toolkit aims to help you understand what approvals are necessary for your research.
                                    </Row>
                                        <Row className="mr-2 mt-3 mb-3">
                                            <ToolKit />
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className="mt-2 pt-3 pl-3 pb-3 Gray800-14px White">
                                    <Col md={12}>
                                        <Row className="Black-17px-Bold">
                                            Advice from {publisher}
                                    </Row>
                                        <Row className="Gray800-15px mt-2">
                                            We highly recommend getting in touch with us as early as possible. We may be able to help you shape the various approvals, such as ethics, minimising the risk of having to apply more than once.
                                    </Row>
                                    </Col>
                                </Row>
                            </div>
                            : 
                                <Row className="mt-2 pt-3 pl-3 pb-3 Gray800-14px" style={{ backgroundColor: "#ffffff" }} >
                                    <Col md={11}>
                                        <Winterfell
                                            schema={this.state.schema}
                                            questionAnswers={this.state.questionAnswers}
                                            panelId={this.state.activePanelId}
                                            disableSubmit={true}
                                            onUpdate={this.onFormUpdate}
                                            onSwitchPanel={this.onSwitchedPanel}
                                            onSubmit={this.onFormSubmit}
                                            onRender={this.onFormRender}
                                        />
                                    </Col>
                                </Row>
                            }
                        <Row className="BottomCard mt-2 mb-2"  />
                    </Col>
                    <Col md={3} className="darTabs">
                            <Tabs className='TabsBackground Gray700-14px' activeKey={this.state.key} onSelect={this.handleSelect}>
                                <Tab eventKey="guidance" title="Guidance">
                                    <Row className="darTab toolsButtons ml-1 mr-1 mt-2">
                                        <Col md={12} className="Gray700-13px mt-2">
                                            <span>There is question-by-question guidance throughout the application process, or you can view everything in one go.</span>
                                            <br /> <br />
                                            <Button variant="light" className="Dark-14px Width100"  >
                                                View all guidance in a new window
                                        </Button>
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="answers" title="Answers">
                                    <Row className="darTab toolsButtons ml-1 mr-1 mt-2">
                                        <Col md={12} className="Gray700-13px mt-2">
                                            <span>Re-use answers from your previous applications</span>
                                            <br /> <br />
                                            <span className="ComingSoonBadge"> Coming soon </span>
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="notes" title="Notes">
                                    <Row className="darTab toolsButtons ml-1 mr-1 mt-2">
                                        <Col md={12} className="Gray700-13px mt-2">
                                            <span>Data custodians cannot see your notes. </span>
                                            <br /> <br />
                                            <span>You can use notes to capture your thoughts or communicate with any other applicants you invite to collaborate.</span>
                                            <br /> <br />
                                            <span className="ComingSoonBadge"> Coming soon </span>
                                        </Col>
                                    </Row>
                                </Tab>
                                <Tab eventKey="messages" title="Messages">
                                    <Row className="darTab toolsButtons ml-1 mt-2">
                                        <Col md={12} className="Gray700-13px mt-2">
                                            <span>Both data custodian and applicants can see messages</span>
                                            <br /> <br />
                                            <span>Use messages to seek guidance or clarify questions with the data custodian. You can send messages before or after the application is submitted. You will be notified of every new message, and so will the data custodian.</span>
                                            <br /> <br />
                                            <span className="ComingSoonBadge"> Coming soon </span>
                                        </Col>
                                    </Row>
                                </Tab>
                            </Tabs>
                    </Col>
                    <Col md={12}>
                        <Row className="darFooter">
                            <Col md={6} className="mt-4">
                                <span className="Gray800-14px">{totalAnsweredQuestions}</span>
                            </Col>
                            <Col md={6} className="mt-3 text-right">
                                <Button variant="white" className="TechDetailButton ml-2" onClick={this.onFormSubmit}>
                                    Save
                                </Button>
                                <Button variant="white"  className="TechDetailButton ml-3" >
                                    Submit application
                                </Button>
                                <Button variant="primary" className="White-14px ml-3" onClick={() => { this.onNextPanel(activePanelId) }}>
                                    {activePanelId === "mrcHealthDataToolkit" || activePanelId === "adviceFromPublisher" ? "Go to Safe People" : "Go to next section" }
                                </Button>   
                            </Col>
                        </Row> 
                    </Col>
                </Row>
                </div>
            </div>
        )
        
        
    }
}


  

export default DataAccessRequest;   
   