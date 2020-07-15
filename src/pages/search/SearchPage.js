import React from 'react';
import { PageView, initGA } from '../../tracking';
import queryString from 'query-string';

import { Container, Row, Col, Tabs, Tab, Pagination } from 'react-bootstrap';

import SearchBar from '../commonComponents/SearchBar';
import RelatedObject from '../commonComponents/RelatedObject';
import Loading from '../commonComponents/Loading'
import Filters from './Filters';
import NoResults from '../commonComponents/NoResults';

import { axiosIG } from '../../utils/axios.util';

class SearchPage extends React.Component {

    state = {
        searchString: '',
        datasetIndex: 0,
        toolIndex: 0,
        projectIndex: 0,
        paperIndex: 0,
        personIndex: 0,
        datasetData: [],
        toolData: [],
        projectData: [],
        paperData: [],
        personData: [],
        filterOptions: [],
        licensesSelected: [],
        sampleAvailabilitySelected: [],
        keywordsSelected: [],
        publishersSelected: [],
        ageBandsSelected: [],
        geoCoverageSelected: [],
        toolCategoriesSelected: [],
        languageSelected: [],
        featuresSelected: [],
        toolTopicsSelected: [],
        projectCategoriesSelected: [],
        projectFeaturesSelected: [],
        projectTopicsSelected: [],
        paperFeaturesSelected: [],
        paperTopicsSelected: [],
        summary: [],
        key: '',
        isLoading: true,
        userState: [{
            loggedIn: false,
            role: "Reader",
            id: null,
            name: null
        }]
    }

    constructor(props) {
        super(props);
        this.state.userState = props.userState;
        this.state.searchString = props.searchString || null;
    }

    async componentDidMount() { //fires on first time in or page is refreshed/url loaded
        if (!!window.location.search) {
            var values = queryString.parse(window.location.search);

            await Promise.all([
                this.updateFilterStates(values)
            ])

            this.doSearchCall();
            initGA('UA-166025838-1');
            PageView();
        }
        else {
            this.setState({ data: [], searchString: '', isLoading: true });
            this.doSearchCall();
            initGA('UA-166025838-1');
            PageView();
        }
    }

    async componentWillReceiveProps() {
        if (!!window.location.search) {
            var values = queryString.parse(window.location.search);

            if (values.search !== this.state.searchString
                || (((typeof values.license === "undefined" && this.state.licensesSelected.length !== 0) || (typeof values.license !== "undefined" && this.state.licensesSelected.length === 0)) && !this.state.licensesSelected.includes(values.license))
                || (((typeof values.sampleavailability === "undefined" && this.state.sampleAvailabilitySelected.length !== 0) || (typeof values.sampleavailability !== "undefined" && this.state.sampleAvailabilitySelected.length === 0)) && !this.state.sampleAvailabilitySelected.includes(values.sampleavailability))
                || (((typeof values.keywords === "undefined" && this.state.keywordsSelected.length !== 0) || (typeof values.keywords !== "undefined" && this.state.keywordsSelected.length === 0)) && !this.state.keywordsSelected.includes(values.keywords))
                || (((typeof values.publisher === "undefined" && this.state.publishersSelected.length !== 0) || (typeof values.publisher !== "undefined" && this.state.publishersSelected.length === 0)) && !this.state.publishersSelected.includes(values.publisher))
                || (((typeof values.ageband === "undefined" && this.state.ageBandsSelected.length !== 0) || (typeof values.ageband !== "undefined" && this.state.ageBandsSelected.length === 0)) && !this.state.ageBandsSelected.includes(values.ageband))
                || (((typeof values.geographiccover === "undefined" && this.state.geoCoverageSelected.length !== 0) || (typeof values.geographiccover !== "undefined" && this.state.geoCoverageSelected.length === 0)) && !this.state.geoCoverageSelected.includes(values.geographiccover))
                
                || (((typeof values.toolcategories === "undefined" && this.state.toolCategoriesSelected.length !== 0) || (typeof values.toolcategories !== "undefined" && this.state.toolCategoriesSelected.length === 0)) && !this.state.toolCategoriesSelected.includes(values.toolcategories))
                || (((typeof values.programmingLanguage === "undefined" && this.state.languageSelected.length !== 0) || (typeof values.programmingLanguage !== "undefined" && this.state.languageSelected.length === 0)) && !this.state.languageSelected.includes(values.programmingLanguage))
                || (((typeof values.features === "undefined" && this.state.featuresSelected.length !== 0) || (typeof values.features !== "undefined" && this.state.featuresSelected.length === 0)) && !this.state.featuresSelected.includes(values.features))
                || (((typeof values.tooltopics === "undefined" && this.state.toolTopicsSelected.length !== 0) || (typeof values.tooltopics !== "undefined" && this.state.toolTopicsSelected.length === 0)) && !this.state.toolTopicsSelected.includes(values.tooltopics))
                
                || (((typeof values.projectcategories === "undefined" && this.state.projectCategoriesSelected.length !== 0) || (typeof values.projectcategories !== "undefined" && this.state.projectCategoriesSelected.length === 0)) && !this.state.projectCategoriesSelected.includes(values.projectcategories))
                || (((typeof values.projectfeatures === "undefined" && this.state.projectFeaturesSelected.length !== 0) || (typeof values.projectfeatures !== "undefined" && this.state.projectFeaturesSelected.length === 0)) && !this.state.projectFeaturesSelected.includes(values.projectfeatures))
                || (((typeof values.projecttopics === "undefined" && this.state.projectTopicsSelected.length !== 0) || (typeof values.projecttopics !== "undefined" && this.state.projectTopicsSelected.length === 0)) && !this.state.projectTopicsSelected.includes(values.projecttopics))
                
                || (((typeof values.paperfeatures === "undefined" && this.state.paperFeaturesSelected.length !== 0) || (typeof values.paperfeatures !== "undefined" && this.state.paperFeaturesSelected.length === 0)) && !this.state.paperFeaturesSelected.includes(values.paperfeatures))
                || (((typeof values.papertopics === "undefined" && this.state.paperTopicsSelected.length !== 0) || (typeof values.papertopics !== "undefined" && this.state.paperTopicsSelected.length === 0)) && !this.state.paperTopicsSelected.includes(values.papertopics))
                
                || (((typeof values.datasetIndex === "undefined" && this.state.datasetIndex !== 0) || (typeof values.datasetIndex !== "undefined" && this.state.datasetIndex === 0)) && this.state.datasetIndex !== values.datasetIndex)
                || (((typeof values.toolIndex === "undefined" && this.state.toolIndex !== 0) || (typeof values.toolIndex !== "undefined" && this.state.toolIndex === 0)) && this.state.toolIndex !== values.toolIndex)
                || (((typeof values.projectIndex === "undefined" && this.state.projectIndex !== 0) || (typeof values.projectIndex !== "undefined" && this.state.projectIndex === 0)) && this.state.projectIndex !== values.projectIndex)
                || (((typeof values.personIndex === "undefined" && this.state.personIndex !== 0) || (typeof values.personIndex !== "undefined" && this.state.personIndex === 0)) && this.state.personIndex !== values.personIndex)
            ) {
                await Promise.all([
                    this.updateFilterStates(values)
                ])
                this.doSearchCall(true);
            }
            else if (this.state.key !== values.tab) {
                this.setState({ key: values.tab });
            }
        }
        else {
            this.setState({ data: [], searchString: '', isLoading: true });
            this.doSearchCall();
        }
    }

    doSearch = async (e) => { //fires on enter on searchbar
        if (e.key === 'Enter') {
            await Promise.all([
                this.clearFilterStates()
            ])

            if (!!this.state.searchString) {
                this.doSearchCall();
            }
        }
    }

    updateFilterStates(values) {
        values.search ? this.setState({ searchString: values.search }) : this.setState({ searchString: '' })
        values.license ? this.setState({ licensesSelected: [values.license] }) : this.setState({ licensesSelected: [] })
        values.sampleavailability ? this.setState({ sampleAvailabilitySelected: [values.sampleavailability] }) : this.setState({ sampleAvailabilitySelected: [] })
        values.keywords ? this.setState({ keywordsSelected: [values.keywords] }) : this.setState({ keywordsSelected: [] })
        values.publisher ? this.setState({ publishersSelected: [values.publisher] }) : this.setState({ publishersSelected: [] })
        values.ageband ? this.setState({ ageBandsSelected: [values.ageband] }) : this.setState({ ageBandsSelected: [] })
        values.geographiccover ? this.setState({ geoCoverageSelected: [values.geographiccover] }) : this.setState({ geoCoverageSelected: [] })

        values.toolcategories ? this.setState({ toolCategoriesSelected: [values.toolcategories] }) : this.setState({ toolCategoriesSelected: [] })
        values.programmingLanguage ? this.setState({ languageSelected: [values.programmingLanguage] }) : this.setState({ languageSelected: [] })
        values.features ? this.setState({ featuresSelected: [values.features] }) : this.setState({ featuresSelected: [] })
        values.tooltopics ? this.setState({ toolTopicsSelected: [values.tooltopics] }) : this.setState({ toolTopicsSelected: [] })

        values.projectcategories ? this.setState({ projectCategoriesSelected: [values.projectcategories] }) : this.setState({ projectCategoriesSelected: [] })
        values.projectfeatures ? this.setState({ projectFeaturesSelected: [values.projectfeatures] }) : this.setState({ projectFeaturesSelected: [] })
        values.projecttopics ? this.setState({ projectTopicsSelected: [values.projecttopics] }) : this.setState({ projectTopicsSelected: [] })

        values.paperfeatures ? this.setState({ paperFeaturesSelected: [values.paperfeatures] }) : this.setState({ paperFeaturesSelected: [] })
        values.papertopics ? this.setState({ paperTopicsSelected: [values.papertopics] }) : this.setState({ paperTopicsSelected: [] })

        values.tab ? this.setState({ key: values.tab }) : this.setState({ key: '' })
        values.datasetIndex ? this.setState({ datasetIndex: values.datasetIndex }) : this.setState({ datasetIndex: 0 })
        values.toolIndex ? this.setState({ toolIndex: values.toolIndex }) : this.setState({ toolIndex: 0 })
        values.projectIndex ? this.setState({ projectIndex: values.projectIndex }) : this.setState({ projectIndex: 0 })
        values.personIndex ? this.setState({ personIndex: values.personIndex }) : this.setState({ personIndex: 0 })
    }

    clearFilterStates() {
        this.setState({ licensesSelected: [] })
        this.setState({ sampleAvailabilitySelected: [] })
        this.setState({ keywordsSelected: [] })
        this.setState({ publishersSelected: [] })
        this.setState({ ageBandsSelected: [] })
        this.setState({ geoCoverageSelected: [] })

        this.setState({ toolCategoriesSelected: [] })
        this.setState({ languageSelected: [] })
        this.setState({ featuresSelected: [] })
        this.setState({ toolTopicsSelected: [] })

        this.setState({ projectCategoriesSelected: [] })
        this.setState({ projectFeaturesSelected: [] })
        this.setState({ projectTopicsSelected: [] })
        
        this.setState({ paperFeaturesSelected: [] })
        this.setState({ paperTopicsSelected: [] })

        this.setState({ key: "" })
        this.setState({ datasetIndex: 0 })
        this.setState({ toolIndex: 0 })
        this.setState({ projectIndex: 0 })
        this.setState({ paperIndex: 0 })
        this.setState({ personIndex: 0 })
    }

    updateOnFilter = () => {
        this.doSearchCall();
    }

    doSearchCall(skipHistory) {
        var searchURL = '';

        if (this.state.licensesSelected.length > 0) searchURL += '&license=' + this.state.licensesSelected;
        if (this.state.sampleAvailabilitySelected.length > 0) searchURL += '&sampleavailability=' + this.state.sampleAvailabilitySelected;
        if (this.state.keywordsSelected.length > 0) searchURL += '&keywords=' + this.state.keywordsSelected;
        if (this.state.publishersSelected.length > 0) searchURL += '&publisher=' + this.state.publishersSelected;
        if (this.state.ageBandsSelected.length > 0) searchURL += '&ageband=' + this.state.ageBandsSelected;
        if (this.state.geoCoverageSelected.length > 0) searchURL += '&geographiccover=' + this.state.geoCoverageSelected;

        if (this.state.toolCategoriesSelected.length > 0) searchURL += '&toolcategories=' + this.state.toolCategoriesSelected;
        if (this.state.languageSelected.length > 0) searchURL += '&programmingLanguage=' + this.state.languageSelected;
        if (this.state.featuresSelected.length > 0) searchURL += '&features=' + this.state.featuresSelected;
        if (this.state.toolTopicsSelected.length > 0) searchURL += '&tooltopics=' + this.state.toolTopicsSelected;

        if (this.state.projectCategoriesSelected.length > 0) searchURL += '&projectcategories=' + this.state.projectCategoriesSelected;
        if (this.state.projectFeaturesSelected.length > 0) searchURL += '&projectfeatures=' + this.state.projectFeaturesSelected;
        if (this.state.projectTopicsSelected.length > 0) searchURL += '&projecttopics=' + this.state.projectTopicsSelected;
        
        if (this.state.paperFeaturesSelected.length > 0) searchURL += '&paperfeatures=' + this.state.paperFeaturesSelected;
        if (this.state.paperTopicsSelected.length > 0) searchURL += '&papertopics=' + this.state.paperTopicsSelected;

        if (this.state.datasetIndex > 0) searchURL += '&datasetIndex=' + this.state.datasetIndex;
        if (this.state.toolIndex > 0) searchURL += '&toolIndex=' + this.state.toolIndex;
        if (this.state.projectIndex > 0) searchURL += '&projectIndex=' + this.state.projectIndex;
        if (this.state.paperIndex > 0) searchURL += '&paperIndex=' + this.state.paperIndex;
        if (this.state.personIndex > 0) searchURL += '&personIndex=' + this.state.personIndex;

        if (!skipHistory) {
            if (this.state.key) {
                this.props.history.push(`${window.location.pathname}?search=${this.state.searchString}&tab=${this.state.key}` + searchURL);
            }
            else {
                this.props.history.push(`${window.location.pathname}?search=${this.state.searchString}` + searchURL);
            }
        } 
        
        this.setState({ isLoading: true });
        axiosIG.get('/api/v1/search?search=' + this.state.searchString + searchURL)
            .then((res) => {
                this.setState({
                    datasetData: res.data.datasetResults || [],
                    toolData: res.data.toolResults || [],
                    projectData: res.data.projectResults || [],
                    paperData: res.data.paperResults || [],
                    personData: res.data.personResults || [],
                    summary: res.data.summary || [],
                    filterOptions: res.data.filterOptions || [],
                    isLoading: false
                });
            })
    }

    updateSearchString = (searchString) => {
        this.setState({ searchString });
    }

    handleSelect = (key) => {
        this.setState({ key: key });
        var values = queryString.parse(window.location.search);
        values.tab = key;
        this.props.history.push(window.location.pathname + '?' + queryString.stringify(values))
    }

    handlePagination = async (type, page) => {
        if (type === 'dataset') {
            await Promise.all([
                this.setState({ datasetIndex: page })
            ])
        }
        else if (type === 'tool') {
            await Promise.all([
                this.setState({ toolIndex: page })
            ])
        }
        else if (type === 'project') {
            await Promise.all([
                this.setState({ projectIndex: page })
            ])
        }
        else if (type === 'paper') {
            await Promise.all([
                this.setState({ paperIndex: page })
            ])
        }
        else if (type === 'person') {
            await Promise.all([
                this.setState({ personIndex: page })
            ])
        }
        this.doSearchCall()
    }

    render() {
        const { 
            summary, 
            searchString, 
            datasetData, 
            toolData, 
            projectData, 
            paperData, 
            personData, 
            filterOptions, 
            userState, 
            isLoading, 
            
            publishersSelected, 
            licensesSelected, 
            geoCoverageSelected, 
            sampleAvailabilitySelected, 
            keywordsSelected, 

            languageSelected, 
            toolTopicsSelected, 
            toolCategoriesSelected, 
            featuresSelected, 
            
            projectTopicsSelected, 
            projectFeaturesSelected,
            projectCategoriesSelected, 
            
            paperFeaturesSelected, 
            paperTopicsSelected, 
            
            datasetIndex, 
            toolIndex, 
            projectIndex, 
            paperIndex, 
            personIndex 
        } = this.state;

        var { key } = this.state;
        
        if (isLoading) {
            return <Container><Loading /></Container>;
        }

        var datasetCount = summary.datasets || 0;
        var toolCount = summary.tools || 0;
        var projectCount = summary.projects || 0;
        var paperCount = summary.papers || 0;
        var personCount = summary.persons || 0;

        if (key === '' || typeof key === "undefined") {
            if (datasetCount > 0) {
                key = 'Datasets'
            }
            else if (toolCount > 0) {
                key = 'Tools'
            }
            else if (projectCount > 0) {
                key = 'Projects'
            }
            else if (paperCount > 0) {
                key = 'Papers'
            }
            else if (personCount > 0) {
                key = 'People'
            }
            else {
                key = 'Datasets'
            }
        }

        let datasetPaginationItems = [];
        let toolPaginationItems = [];
        let projectPaginationItems = [];
        let paperPaginationItems = [];
        let personPaginationItems = [];
        var maxResult = 40;
        for (let i = 1; i <= Math.ceil(datasetCount / maxResult); i++) {
            datasetPaginationItems.push(
                <Pagination.Item key={i} active={i === (datasetIndex/maxResult)+1} onClick={() => this.handlePagination("dataset", ((i-1)*(maxResult)))}>{i}</Pagination.Item>,
            );
        }
        for (let i = 1; i <= Math.ceil(toolCount / maxResult); i++) {
            toolPaginationItems.push(
                <Pagination.Item key={i} active={i === (toolIndex/maxResult)+1} onClick={() => this.handlePagination("tool", ((i-1)*(maxResult)))}>{i}</Pagination.Item>,
            );
        }
        for (let i = 1; i <= Math.ceil(projectCount / maxResult); i++) {
            projectPaginationItems.push(
                <Pagination.Item key={i} active={i === (projectIndex/maxResult)+1} onClick={() => this.handlePagination("project", ((i-1)*(maxResult)))}>{i}</Pagination.Item>,
            );
        }
        for (let i = 1; i <= Math.ceil(paperCount / maxResult); i++) {
            paperPaginationItems.push(
                <Pagination.Item key={i} active={i === (paperIndex/maxResult)+1} onClick={() => this.handlePagination("paper", ((i-1)*(maxResult)))}>{i}</Pagination.Item>,
            );
        }
        for (let i = 1; i <= Math.ceil(personCount / maxResult); i++) {
            personPaginationItems.push(
                <Pagination.Item key={i} active={i === (personIndex/maxResult)+1} onClick={() => this.handlePagination("person", ((i-1)*(maxResult)))}>{i}</Pagination.Item>,
            );
        }

        return (
            <div>

                <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />

                <div className="searchTabsHolder">
                        <div>
                            <Tabs className='tabsBackground gray700-13' activeKey={key} onSelect={this.handleSelect}>
                                <Tab eventKey="Datasets" title={'Datasets (' + datasetCount + ')'}>
                                    {datasetCount <= 0 ? <NoResults type='datasets' searchString={searchString} /> : ''}
                                </Tab>
                                <Tab eventKey="Tools" title={'Tools (' + toolCount + ')'}>
                                    {toolCount <= 0 ? <NoResults type='tools' searchString={searchString} /> : ''}
                                </Tab>
                                <Tab eventKey="Projects" title={'Projects (' + projectCount + ')'}>
                                    {projectCount <= 0 ? <NoResults type='projects' searchString={searchString} /> : ''}
                                </Tab>
                                <Tab eventKey="Papers" title={'Papers (' + paperCount + ')'}>
                                    {paperCount <= 0 ? <NoResults type='papers' searchString={searchString} /> : ''}
                                </Tab>
                                <Tab eventKey="People" title={'People (' + personCount + ')'}>
                                    {personCount <= 0 ? <NoResults type='profiles' searchString={searchString} /> : ''}
                                </Tab>
                            </Tabs>
                        </div>
                </div>

                <Container>
                    <Row>
                        {key !== 'People' ?
                            <Col sm={12} md={12} lg={3}>
                                {key === 'Datasets' ? <Filters data={filterOptions.publisherFilterOptions} updateOnFilter={this.updateOnFilter} selected={publishersSelected} title="Publisher" /> : ''}
                                {key === 'Datasets' ? <Filters data={filterOptions.licenseFilterOptions} updateOnFilter={this.updateOnFilter} selected={licensesSelected} title="License" /> : ''}
                                {key === 'Datasets' ? <Filters data={filterOptions.keywordsFilterOptions} updateOnFilter={this.updateOnFilter} selected={keywordsSelected} title="Keywords" /> : ''}
                                {key === 'Datasets' ? <Filters data={filterOptions.geographicCoverageFilterOptions} updateOnFilter={this.updateOnFilter} selected={geoCoverageSelected} title="Geographic coverage" /> : ''}
                                {key === 'Datasets' ? <Filters data={filterOptions.sampleFilterOptions} updateOnFilter={this.updateOnFilter} selected={sampleAvailabilitySelected} title="Physical sample availability" /> : ''}
                                {/* {key === 'Datasets' ? <Filters data={filterOptions.ageBandFilterOptions} updateOnFilter={this.updateOnFilter} selected={ageBandsSelected} title="Age Bands" /> : ''} */}
                                
                                {key === 'Tools' ? <Filters data={filterOptions.toolCategoriesFilterOptions} updateOnFilter={this.updateOnFilter} selected={toolCategoriesSelected} title="Type" /> : ''}
                                {key === 'Tools' ? <Filters data={filterOptions.programmingLanguageFilterOptions} updateOnFilter={this.updateOnFilter} selected={languageSelected} title="Programming language" /> : ''}
                                {key === 'Tools' ? <Filters data={filterOptions.featuresFilterOptions} updateOnFilter={this.updateOnFilter} selected={featuresSelected} title="Keywords" /> : ''}
                                {key === 'Tools' ? <Filters data={filterOptions.toolTopicsFilterOptions} updateOnFilter={this.updateOnFilter} selected={toolTopicsSelected} title="Domain" /> : ''}
                                
                                {key === 'Projects' ? <Filters data={filterOptions.projectCategoriesFilterOptions} updateOnFilter={this.updateOnFilter} selected={projectCategoriesSelected} title="Type" /> : ''}
                                {key === 'Projects' ? <Filters data={filterOptions.projectFeaturesFilterOptions} updateOnFilter={this.updateOnFilter} selected={projectFeaturesSelected} title="Keywords" /> : ''}
                                {key === 'Projects' ? <Filters data={filterOptions.projectTopicsFilterOptions} updateOnFilter={this.updateOnFilter} selected={projectTopicsSelected} title="Domain" /> : ''}

                                {key === 'Papers' ? <Filters data={filterOptions.paperFeaturesFilterOptions} updateOnFilter={this.updateOnFilter} selected={paperFeaturesSelected} title="Keywords" /> : ''}
                                {key === 'Papers' ? <Filters data={filterOptions.paperTopicsFilterOptions} updateOnFilter={this.updateOnFilter} selected={paperTopicsSelected} title="Domain" /> : ''}
                            </Col>
                            : <Col sm={12} md={12} lg={3} />}

                        <Col sm={12} md={12} lg={9}>
                            {key === 'Datasets' ?
                                datasetData.map((dataset) => {
                                    return <RelatedObject key={dataset.id} data={dataset} activeLink={true} />
                                })
                                : ''}

                            {key === 'Tools' ?
                                toolData.map((tool) => {
                                    return <RelatedObject key={tool.id} data={tool} activeLink={true} />
                                })
                                : ''}

                            {key === 'Projects' ?
                                projectData.map((project) => {
                                    return <RelatedObject key={project.id} data={project} activeLink={true}/>
                                })
                                : ''}
                            
                            {key === 'Papers' ?
                                paperData.map((paper) => {
                                    return <RelatedObject key={paper.id} data={paper} activeLink={true}/>
                                })
                                : ''}

                            {key === 'People' ?
                                personData.map((person) => {
                                    return <RelatedObject key={person.id} data={person} activeLink={true} />
                                })
                                : ''}

                            <div className='text-center'>
                            {key === 'Datasets' && datasetCount > maxResult ?
                                <Pagination>
                                    {datasetPaginationItems}
                                </Pagination>
                                : ''}

                            {key === 'Tools' && toolCount > maxResult ?
                                <Pagination>
                                    {toolPaginationItems}
                                </Pagination>
                                : ''}

                            {key === 'Projects' && projectCount > maxResult ?
                                <Pagination>
                                    {projectPaginationItems}
                                </Pagination>
                                : ''}

                            {key === 'Papers' && paperCount > maxResult ?
                                <Pagination>
                                    {paperPaginationItems}
                                </Pagination>
                                : ''}

                            {key === 'People' && personCount > maxResult ?
                                <Pagination>
                                    {personPaginationItems}
                                </Pagination>
                                : ''}
                                </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default SearchPage;
