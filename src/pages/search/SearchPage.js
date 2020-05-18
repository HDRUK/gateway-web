import React from 'react';
import axios from 'axios';
// import ReactGA from 'react-ga';
import {PageView, initGA} from '../../tracking';


import queryString from 'query-string';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import SearchBar from '../commonComponents/SearchBar';
import Project from '../commonComponents/Project';
import Tool from '../commonComponents/Tool';
import Person from '../commonComponents/Person';
import DataSet from '../commonComponents/DataSet';
import Loading from '../commonComponents/Loading'
import KeywordsFilter from './KeywordsFilter';
import ProgrammingLanguageFilter from './ProgrammingLanguageFilter';
import CategoryFilterTool from './CategoryFilterTool';
import CategoryFilterProject from './CategoryFilterProject';
import FeaturesFilter from './FeaturesFilter';
import TopicsFilter from './TopicsFilter';
import DatasetFilterPublisher from './DatasetFilterPublisher';
import DatasetFilterLicense from './DatasetFilterLicense';
import DatasetFilterGeoCoverage from './DatasetFilterGeoCoverage';
import DatasetFilterAgeBand from './DatasetFilterAgeBand';
import DatasetFilterSampleAvailability from './DatasetFilterSampleAvailability';
import DatasetFilterKeywords from './DatasetFilterKeywords';
import NoResultsTool from '../commonComponents/NoResultsTools';
import NoResultsProjects from '../commonComponents/NoResultsProjects';
import NoResultsPeople from '../commonComponents/NoResultsPeople';
import NoResultsDatasets from '../commonComponents/NoResultsDatasets';

var baseURL = require('../commonComponents/BaseURL').getURL();

class SearchPage extends React.Component {

    state = {
        searchString: null,
        typeString: null,
        data: [],

        datasetData: [],
        key: "Datasets",

        publisherData: [],
        licenseData: [],
        geographicCoverageData: [],
        ageBandData: [],
        physicalSampleAvailabilityData: [],
        keywordsData:[],

        summary: [],
        combinedLanguages: [],
        languageSelected: [],
        // combinedCategories: [],
        combinedToolCategories: [],
        combinedProjectCategories: [],

        categoriesSelected: [],
        combinedFeatures: [],
        featuresSelected: [],
        // combinedTopic: [],
        combinedToolTopic: [],
        combinedProjectTopic: [],

        topicsSelected: [],
        publishersSelected: [],
        publishersFilter: '',
        licensesSelected: [],
        licensesFilter: '',
        geoCoverageSelected: [],
        geoCoverageFilter: '',
        sampleAvailabilitySelected: [],
        sampleAvailabilityFilter: '',
        keywordsSelected: [],
        keywordsFilter: '',
        ageBandsSelected: [],
        ageBandsFilter: '',
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
    }

    componentDidMount() { //fires on first time in or page is refreshed/url loaded
        if (!!window.location.search) {
            var values = queryString.parse(window.location.search);



            this.doSearchCall(values.search, values.type, this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
            this.setState({ searchString: values.search });
            this.setState({ typeString: values.type });
            this.getDatasetFilters(values.search);
            initGA('UA-166025838-1');
            PageView();

        }
        else {
            this.setState({ data: [], searchString: '', typeString: 'all', isLoading: true });
            this.doSearchCall("", "all", [], [], [], []);
            this.getDatasetFilters(values.search);
            initGA('UA-166025838-1');
            PageView();
        }

    }

    /**
     * [getDatasetFilters]
     * @desc Returns filters for dataset
     * @return  {[object]}  [{}]
     */
    getDatasetFilters = (searchString) => {
        debugger;
        axios.get(baseURL + '/api/v1/datasets/filters?search=' + searchString)
            .then((response) => {
                const {data: { success, data, error}} = response;
                if(success) {
                    this.setState({
                        publisherData: data.publisher,
                        licenseData: data.license,
                        geographicCoverageData: data.geographicCoverage,
                        ageBandData: data.ageBand,
                        physicalSampleAvailabilityData: data.physicalSampleAvailability,
                        keywordsData: data.keywords
                    });
                } else {
                    console.log(error);
                }
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    componentWillReceiveProps() {
        if (!!window.location.search) {
            var values = queryString.parse(window.location.search);
            if (values.search !== this.state.searchString
                || values.type !== this.state.typeString) {
                this.doSearchCall(values.search, values.type, this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
                this.setState({ searchString: values.search });
                this.setState({ typeString: values.type });
                this.getDatasetFilters(values.search);

            }
        }
        else {
            this.setState({ data: [], searchString: '', typeString: 'all', isLoading: true });
            this.doSearchCall("", "all", [], [], [], []);
            this.getDatasetFilters(this.state.searchString);

        }
    }

    doSearch = (e) => { //fires on enter on searchbar
        if (e.key === 'Enter') {

            if (!!this.state.searchString && !!this.state.typeString) {
                this.props.history.push(this.getFullUrl());
                this.doSearchCall(this.state.searchString, this.state.typeString, this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
                this.getDatasetFilters(this.state.searchString);
            }
            else if (!!this.state.searchString && !this.state.typeString) {
                this.props.history.push(this.getFullUrl());
                this.doSearchCall(this.state.searchString, "", this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
                this.getDatasetFilters(this.state.searchString);
            }
        }
    }

    callTypeString = (typeString) => {
        this.props.history.push(this.getFullUrl());
        this.doSearchCall(this.state.searchString, typeString, this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
    }

    doSearchCall(searchString, typeString, languageSelected, categoriesSelected, featuresSelected, topicsSelected) {
        // tools project and people
        var searchURL = baseURL + '/api/v1/search?search=' + searchString + '&type=' + typeString;

        languageSelected.forEach(language => {
            searchURL += '&programmingLanguage=' + language;
        });

        categoriesSelected.forEach(category => {

            searchURL += '&category=' + category;
        });

        featuresSelected.forEach(features => {

            searchURL += '&features=' + features;
        });

        topicsSelected.forEach(topics => {

            searchURL += '&topics=' + topics;
        });

        this.setState({ isLoading: true });
        axios.get(searchURL)
            .then((res) => {
                if (res.data.data.length > 0) {
                    var tempCategoriesToolArray = [];
                    var tempCategoriesProjectArray = [];

                    var tempProgrammingLanguageArray = [];
                    var tempFeaturesArray = [];
                    var tempToolTopicsArray = [];
                    var tempProjectTopicsArray = [];

                    res.data.data.forEach((dat) => {
                        if (dat.categories && dat.categories.category && dat.categories.category !== '' && !tempCategoriesToolArray.includes(dat.categories.category) && dat.type === 'tool') {
                            tempCategoriesToolArray.push(dat.categories.category);
                        }
                        if (dat.categories && dat.categories.category && dat.categories.category !== '' && !tempCategoriesProjectArray.includes(dat.categories.category) && dat.type === 'project') {
                            tempCategoriesProjectArray.push(dat.categories.category);
                        }

                        if (dat.categories && dat.categories.programmingLanguage && dat.categories.programmingLanguage.length > 0) {
                            dat.categories.programmingLanguage.forEach((pl) => {
                                if (!tempProgrammingLanguageArray.includes(pl) && pl !== '') {
                                    tempProgrammingLanguageArray.push(pl);
                                }
                            });
                        }

                        if (dat.tags.features && dat.tags.features.length > 0) {
                            dat.tags.features.forEach((fe) => {
                                if (!tempFeaturesArray.includes(fe) && fe !== '') {
                                    tempFeaturesArray.push(fe);
                                }
                            });
                        }

                        if (dat.tags.topics && dat.tags.topics.length > 0 && dat.type === 'tool') {
                            dat.tags.topics.forEach((to) => {
                                if (!tempToolTopicsArray.includes(to) && to !== '') {
                                    tempToolTopicsArray.push(to);
                                }
                            });
                        }
                        if (dat.tags.topics && dat.tags.topics.length > 0 && dat.type === 'project') {
                            dat.tags.topics.forEach((to) => {
                                if (!tempProjectTopicsArray.includes(to) && to !== '') {
                                    tempProjectTopicsArray.push(to);
                                }
                            });
                        }
                    });
                }

                this.setState({ combinedToolCategories: tempCategoriesToolArray, combinedProjectCategories: tempCategoriesProjectArray, combinedLanguages: tempProgrammingLanguageArray, combinedFeatures: tempFeaturesArray, combinedToolTopic: tempToolTopicsArray, combinedProjectTopic: tempProjectTopicsArray });
                this.setState({ data: !res.data.data ? '' : res.data.data, summary: !res.data.summary ? '' : Object.entries(res.data.summary ) });
                // datasets 
                axios.get(baseURL + '/api/v1/datasets/filteredsearch?search=' + this.state.searchString + this.state.publishersFilter + this.state.licensesFilter + this.state.geoCoverageFilter + this.state.sampleAvailabilityFilter + this.state.keywordsFilter + this.state.ageBandsFilter)
                .then((res) => {
                    var TempDataSetData = res.data.data.results;
                    
                    if(!!res.data.data.results){
                            TempDataSetData.forEach((dat) => {
                            this.state.data.push(dat)
                        })
                    }
                    this.setState({ datasetData: !res.data.data.results ? '' : res.data.data.results , isLoading: false });
                })
            })
    }

    getFullUrl = () => {
        return  `${window.location.pathname}?search=${this.state.searchString}&type=${this.state.typeString}&tab=${this.state.key}&toolcategory=${this.state.categoriesSelected}&programminglanguage=${this.state.languageSelected}&features=${this.state.featuresSelected}&topics=${this.state.topicsSelected}&license=${this.state.licensesSelected}&sampleavailability=${this.state.sampleAvailabilitySelected}&keywords=${this.state.keywordsSelected}'&publisher=${this.state.publishersSelected}&ageband=${this.state.ageBandsSelected}&geographiccover=${this.state.geoCoverageSelected}`;
    }

    updateSearchString = (searchString) => {
        this.setState({ searchString });
    }

    updateTypeString = (typeString) => {
        this.setState({ typeString });
    }

    updateCombinedLanguages = (languageSelected) => {
        this.setState({ languageSelected });
        this.props.history.push(this.getFullUrl());
        this.doSearchCall(this.state.searchString, this.state.typeString, languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
    }

    updateCombinedCategories = (categoriesSelected) => {
        this.setState({ categoriesSelected });
        this.props.history.push(this.getFullUrl());
        this.doSearchCall(this.state.searchString, this.state.typeString, this.state.languageSelected, categoriesSelected, this.state.featuresSelected, this.state.topicsSelected);
    }

    updateCombinedFeatures = (featuresSelected) => {
        this.setState({ featuresSelected });
        this.props.history.push(this.getFullUrl());
        this.doSearchCall(this.state.searchString, this.state.typeString, this.state.languageSelected, this.state.categoriesSelected, featuresSelected, this.state.topicsSelected);
    }

    updateCombinedTopics = (topicsSelected) => {
        this.setState({ topicsSelected });
        this.props.history.push(this.getFullUrl());
        this.doSearchCall(this.state.searchString, this.state.typeString, this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, topicsSelected);
    }

    updatePublisher = (publishersSelected) => {
        this.setState({ publishersSelected })
        this.props.history.push(this.getFullUrl());
        this.filteredSearch(this.state.searchString, publishersSelected, this.state.licensesSelected, this.state.geoCoverageSelected, this.state.sampleAvailabilitySelected, this.state.keywordsSelected, this.state.ageBandsSelected);

    }
    updateLicenses = (licensesSelected) => {
        this.setState({ licensesSelected })
        this.props.history.push(this.getFullUrl());
        this.filteredSearch(this.state.searchString, this.state.publishersSelected, licensesSelected, this.state.geoCoverageSelected, this.state.sampleAvailabilitySelected, this.state.keywordsSelected, this.state.ageBandsSelected);

    }
    updateGeoCoverage = (geoCoverageSelected) => {
        this.setState({ geoCoverageSelected })
        this.props.history.push(this.getFullUrl());
        this.filteredSearch(this.state.searchString, this.state.publishersSelected, this.state.licensesSelected, geoCoverageSelected, this.state.sampleAvailabilitySelected, this.state.keywordsSelected, this.state.ageBandsSelected);
    }

    updateSampleAvailability = (sampleAvailabilitySelected) => {
        this.setState({ sampleAvailabilitySelected })
        this.props.history.push(this.getFullUrl());
        this.filteredSearch(this.state.searchString, this.state.publishersSelected, this.state.licensesSelected, this.state.geoCoverageSelected, sampleAvailabilitySelected, this.state.keywordsSelected, this.state.ageBandsSelected);
    }

    updateKeywords = (keywordsSelected) => {
        this.setState({ keywordsSelected })
        this.props.history.push(this.getFullUrl());
        this.filteredSearch(this.state.searchString, this.state.publishersSelected, this.state.licensesSelected, this.state.geoCoverageSelected, this.state.sampleAvailabilitySelected, keywordsSelected, this.state.ageBandsSelected);
    }

    updateAgeBands = (ageBandsSelected) => {
        this.setState({ ageBandsSelected })
        this.props.history.push(this.getFullUrl());
        this.filteredSearch(this.state.searchString, this.state.publishersSelected, this.state.licensesSelected, this.state.geoCoverageSelected, this.state.sampleAvailabilitySelected, this.state.keywordsSelected, ageBandsSelected);
    }

    filteredSearch = (searchString, publishersSelected, licensesSelected, geoCoverageSelected, sampleAvailabilitySelected, keywordsSelected, ageBandsSelected) => {

        var publishersFilter = "";
        var licensesFilter = "";
        var geoCoverageFilter = "";
        var sampleAvailabilityFilter = "";
        var keywordsFilter = "";
        var ageBandsFilter = "";

        publishersSelected.map((pub) => {
                publishersFilter = publishersFilter + '&publisher=' + pub;
        })

        licensesSelected.map((lic) => {
            licensesFilter = licensesFilter + '&license=' + lic;
         })

         geoCoverageSelected.map((geo) => {
            geoCoverageFilter = geoCoverageFilter + '&geographicCoverage=' + geo;
         })

         sampleAvailabilitySelected.map((samp) => {
            sampleAvailabilityFilter = sampleAvailabilityFilter + '&physicalSampleAvailability=' + samp;
         })

         keywordsSelected.map((key) => {
            keywordsFilter = keywordsFilter + '&keywords=' + key;
         })

         ageBandsSelected.map((age) => {
            ageBandsFilter = ageBandsFilter + '&ageBand=' + age;
         })

        this.setState({publishersFilter, licensesFilter, geoCoverageFilter, sampleAvailabilityFilter, sampleAvailabilityFilter, ageBandsFilter});

        this.doSearchCall(this.state.searchString, this.state.typeString, this.state.languageSelected, this.state.categoriesSelected, this.state.featuresSelected, this.state.topicsSelected, publishersFilter, licensesFilter, geoCoverageFilter, sampleAvailabilityFilter, keywordsFilter, ageBandsFilter);
  }

    handleSelect = (key) => {
        this.setState({ key: key });
        this.props.history.push(window.location.pathname + '?search=' + this.state.searchString + '&type=' + this.state.typeString + '&tab=' + key + '&toolcategory=' + this.state.categoriesSelected + '&programminglanguage=' + this.state.languageSelected + '&features=' + this.state.featuresSelected + '&topics=' + this.state.topicsSelected+ '&license=' + this.state.licensesSelected + '&sampleavailability=' + this.state.sampleAvailabilitySelected + '&keywords=' + this.state.keywordsSelected + '&publisher=' + this.state.publishersSelected + '&ageband=' + this.state.ageBandsSelected + '&geographiccover=' + this.state.geoCoverageSelected)
    }

    render() {
        const { searchString, data, key, userState, isLoading, combinedLanguages, languageSelected, combinedToolCategories, combinedProjectCategories, categoriesSelected, combinedFeatures, featuresSelected, combinedToolTopic, combinedProjectTopic, topicsSelected, datasetData, publishersSelected, licensesSelected, geoCoverageSelected, sampleAvailabilitySelected, keywordsSelected, ageBandsSelected, publisherData, licenseData, geographicCoverageData, ageBandData, physicalSampleAvailabilityData, keywordsData } = this.state;

        var toolCount = 0;
        var projectCount = 0;
        var personCount = 0;

        if (!!data && (data.length-datasetData.length) > 0) {
            data.map((dat) => {
                if (data && dat.type === 'tool') {
                    toolCount++
                }
                else if (data && dat.type === 'project') {
                    projectCount+=1

                }
                else if (data && dat.type === 'person') {
                    personCount++

                }
            })
        }


        if (isLoading) {
            return <Container><Loading /></Container>;
        }

        return (
            <div>

                <SearchBar searchString={searchString} doSearchMethod={this.doSearch} doUpdateSearchString={this.updateSearchString} userState={userState} />

                <Container>
                    <Row className="mt-1">
                        <Col sm={12} lg={12}>
                            <div>
                                <Tabs className='TabsBackground Gray700-13px' activeKey={this.state.key} onSelect={this.handleSelect}>

                                    <Tab eventKey="Datasets" title={'Datasets (' + datasetData.length + ')'}>
                                        {data && key === 'Datasets' && datasetData.length <= 0 ? <NoResultsDatasets searchString={searchString} /> : ''}
                                    </Tab>
                                    <Tab eventKey="Tools" title={'Tools (' + toolCount + ')'}> 
                                        {data && key === 'Tools' && toolCount <= 0 ? <NoResultsTool searchString={searchString} /> : ''}
                                    </Tab>
                                    <Tab eventKey="Projects" title={'Projects (' + projectCount + ')'}>
                                        {data && key === 'Projects' && projectCount <= 0 ? <NoResultsProjects searchString={searchString} /> : ''}
                                    </Tab>
                                    <Tab eventKey="People" title={'People (' + personCount + ')'}> 
                                        {data && key === 'People' && personCount <= 0 ? <NoResultsPeople searchString={searchString} /> : ''}
                                    </Tab>
                                </Tabs>
                            </div>
                        </Col>
                    </Row> 

                    <Row>

                        {key === 'Tools' || key === 'Projects' || key === 'Datasets' ?
                        <Col sm={12} md={12} lg={3}>
                            {key === 'Tools' ? <CategoryFilterTool combinedToolCategories={combinedToolCategories} doUpdateCombinedCategories={this.updateCombinedCategories} categoriesSelected={categoriesSelected} /> : ''}
                            {key === 'Projects' ? <CategoryFilterProject combinedProjectCategories={combinedProjectCategories} doUpdateCombinedCategories={this.updateCombinedCategories} categoriesSelected={categoriesSelected} /> : ''}
                            {key === 'Tools' ? <ProgrammingLanguageFilter combinedLanguages={combinedLanguages} doUpdateCombinedLanguages={this.updateCombinedLanguages} languageSelected={languageSelected} /> : ''}
                            {key === 'Tools' ? <FeaturesFilter combinedFeatures={combinedFeatures} doUpdateCombinedFeatures={this.updateCombinedFeatures} featuresSelected={featuresSelected} /> : ''}
                            {key === 'Tools' ? <TopicsFilter combinedToolTopic={combinedToolTopic} doUpdateCombinedTopics={this.updateCombinedTopics} topicsSelected={topicsSelected} /> : ''}
                            {key === 'Projects' ? <KeywordsFilter combinedProjectTopic={combinedProjectTopic} doUpdateCombinedTopics={this.updateCombinedTopics} topicsSelected={topicsSelected} /> : ''}
                            {key === 'Datasets' ? <DatasetFilterLicense searchString={searchString} licenseData={licenseData} doFilteredSearch={this.updateLicenses} licensesSelected={licensesSelected}/> : ''}
                            {key === 'Datasets' ? <DatasetFilterSampleAvailability searchString={searchString} physicalSampleAvailabilityData={physicalSampleAvailabilityData} doFilteredSearch={this.updateSampleAvailability} sampleAvailabilitySelected={sampleAvailabilitySelected} /> : ''}
                            {key === 'Datasets' ? <DatasetFilterKeywords searchString={searchString} keywordsData={keywordsData} doFilteredSearch={this.updateKeywords} keywordsSelected={keywordsSelected} /> : ''}
                            {key === 'Datasets' ? <DatasetFilterPublisher searchString={searchString} publisherData={publisherData} doFilteredSearch={this.updatePublisher} publishersSelected={publishersSelected} /> : ''}
                            {key === 'Datasets' ? <DatasetFilterAgeBand searchString={searchString} ageBandData={ageBandData} doFilteredSearch={this.updateAgeBands} ageBandsSelected={ageBandsSelected} /> : ''}
                            {key === 'Datasets' ? <DatasetFilterGeoCoverage searchString={searchString} geographicCoverageData={geographicCoverageData} doFilteredSearch={this.updateGeoCoverage} geoCoverageSelected={geoCoverageSelected} /> : ''}
                        </Col>
                        : <Col sm={1} md={1} lg={1} />}


                        <Col sm={12} md={12} lg={9}>
                            {data.length <= 0 ?  '' :        
                            data.map((dat) => {
                                if (dat.type === 'tool' && key === 'Tools' && toolCount >= 1) {
                                    return <Tool key={dat.id} data={dat} />
                                }
                                else if (dat.type === 'project' && key === 'Projects') {
                                    return <Project key={dat.id} data={dat} />
                                }
                                else if (dat.type === 'person' && key === 'People') {
                                     return <div> 
                                                <Row>
                                                    <Col sm={2} lg={2} />
                                                    <Col sm={10} lg={10}>
                                                        <Person key={dat.id} data={dat} /> 
                                                    </Col>
                                                </Row>
                                            </div>                                  
                                }
                                else if (dat.type === undefined && key === 'Datasets')
                                {
                                    return <DataSet key={dat.id} data={dat} />
                                }
                            })}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

// class SearchSummary extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state.data = props.data;
//         this.state.datasetData = props.datasetData;

//     }

//     // initialize our state
//     state = {
//         data: [],
//         datasetData: []
//     };

//     render() {
//         const { data, datasetData } = this.state;

//         var total = 0;
//         data.map(summ => total += summ[1]);
//         total += datasetData.length;
    
//         return (
//             <Row className="mt-2">
//                 <Col>
//                     <div className="Rectangle">
//                         <div className="Gray800-14px" style={{ textAlign: 'center' }}>
//                             Showing {data.map(summ => summ[1] + ' ' + summ[0] + (summ[1] > 1 ? 's' : '')).join(", ")} {data.length == 0 ? '' : ', '} {!datasetData ? '' : datasetData.length == 1 ? datasetData.length + ' dataset ' : datasetData.length + ' datasets '} ({total} total)
//                         </div>
//                     </div>
//                 </Col>
//             </Row>
//         )
//     }
// }

export default SearchPage;