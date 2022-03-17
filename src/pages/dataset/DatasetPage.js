import * as Sentry from '@sentry/react';
import axios from 'axios';
import { has, isEmpty, isNil, isUndefined } from 'lodash';
import React, { Component, Fragment } from 'react';
import { Alert, Button, Col, Container, Dropdown, OverlayTrigger, Row, Tab, Tabs, Tooltip } from 'react-bootstrap/';
import Linkify from 'react-linkify';
import ReactMarkdown from 'react-markdown';
import 'react-tabs/style/react-tabs.css';
import { ReactComponent as MetadataBronze } from '../../images/bronzeNew.svg';
import { ReactComponent as GoldStar } from '../../images/cd-star.svg';
import { ReactComponent as MetadataGold } from '../../images/goldNew.svg';
import { ReactComponent as InfoSVG } from '../../images/info.svg';
import { ReactComponent as InfoFillSVG } from '../../images/infofill.svg';
import { ReactComponent as MetadataNotRated } from '../../images/notRatedNew.svg';
import { ReactComponent as MetadataPlatinum } from '../../images/platinumNew.svg';
import { ReactComponent as MetadataSilver } from '../../images/silverNew.svg';
import SVGIcon from '../../images/SVGIcon';
import googleAnalytics from '../../tracking';
import DataSetHelper from '../../utils/DataSetHelper.util';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import CollectionCard from '../commonComponents/collectionCard/CollectionCard';
import CommunicateDataCustodianModal from '../commonComponents/communicateDataCustodianModal/CommunicateDataCustodianModal';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal/ErrorModal';
import Loading from '../commonComponents/Loading';
import MessageNotFound from '../commonComponents/MessageNotFound';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DiscourseTopic from '../discourse/DiscourseTopic';
import CohortDiscoveryBanner from './components/CohortDiscoveryBanner';
import DataQuality from './components/DataQuality';
import DatasetAboutCard from './components/DatasetAboutCard';
import DataUtitlityFramework from './components/DataUtilityFramework';
import TechnicalDetailsPage from './components/TechnicalDetailsPage';
import TechnicalMetadata from './components/TechnicalMetadata';
import './Dataset.scss';
import DatasetSchema from './DatasetSchema';

var baseURL = require('../commonComponents/BaseURL').getURL();
var cmsURL = require('../commonComponents/BaseURL').getCMSURL();
const env = require('../commonComponents/BaseURL').getURLEnv();

class DatasetDetail extends Component {
    // initialize our state
    state = {
        id: '',
        data: {},
        v2data: {},
        technicalMetadata: [],
        collections: [],
        dataClassOpen: -1,
        relatedObjects: [],
        isLoading: true,
        userState: [
            {
                loggedIn: false,
                role: 'Reader',
                id: null,
                name: null,
            },
        ],
        alert: null,
        discoursePostCount: 0,
        searchString: '',
        isHovering: false,
        isHoveringPhenotypes: false,
        isHoveringShield: false,
        objects: [
            {
                id: '',
                authors: [],
                activeflag: '',
            },
        ],
        showDrawer: false,
        showModal: false,
        showCustodianModal: false,
        showAllPhenotype: false,
        showAllLinkedDatasets: false,
        showEmpty: false,
        showCitationSuccess: false,
        emptyFlagDetails: false,
        emptyFlagCoverage: false,
        emptyFlagFormats: false,
        emptyFlagProvenance: false,
        emptyFlagObservations: false,
        emptyFlagDAR: false,
        emptyFlagRelRes: false,
        emptyFieldsCount: 0,
        linkedDatasets: [],
        publisherLogoURL: '',
        isLatestVersion: true,
        isDatasetArchived: false,
        cohortProfiling: [],
        datasetHasCohortProfiling: false,
        isCohortDiscovery: false,
        relatedObjectsFiltered: [],
        relatedResourcesSort: [],
        relatedObjectsSearchValue: '',
        sorting: 'showAll',
    };

    topicContext = {};

    constructor(props) {
        super(props);
        this.doUpdateDataClassOpen = this.doUpdateDataClassOpen.bind(this);
        this.state.userState = props.userState;
        this.handleMouseHover = this.handleMouseHover.bind(this);
        this.handleMouseHoverShield = this.handleMouseHoverShield.bind(this);
        this.searchBar = React.createRef();
    }

    // on loading of tool detail page
    async componentDidMount() {
        await this.getDataset();
        this.checkAlerts();
    }

    // on loading of tool detail page were id is different
    componentDidUpdate() {
        if (this.props.match.params.datasetID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
            this.getDetailsSearchFromMDC();
        }
    }

    getDataset = async () => {
        this.setState({ isLoading: true });
        await axios.get(baseURL + '/api/v1/datasets/' + this.props.match.params.datasetID).then(async res => {
            if (isNil(res.data)) {
                window.localStorage.setItem('redirectMsg', `Dataset not found for Id: ${this.props.match.params.datasetID}`);
                this.props.history.push({ pathname: '/search?search=', search: '' });
            } else {
                this.setState({
                    data: res.data.data,
                    v2data: res.data.data.datasetv2,
                    isCohortDiscovery: res.data.data.isCohortDiscovery,
                    isLoading: false,
                    isLatestVersion: res.data.isLatestVersion,
                    isDatasetArchived: res.data.isDatasetArchived,
                });
                await this.getTechnicalMetadata();
                this.getCollections();
                if (!isEmpty(res.data.data.datasetv2)) {
                    this.updateV2Flags(res.data.data.datasetv2);
                    this.getEmptyFieldsCount(res.data.data.datasetv2);
                    this.updatePublisherLogo(res.data.data.datasetv2.summary.publisher.name);
                }
                if (!isEmpty(res.data.data.datasetv2) && !isEmpty(res.data.data.datasetv2.enrichmentAndLinkage.qualifiedRelation)) {
                    res.data.data.datasetv2.enrichmentAndLinkage.qualifiedRelation.forEach(relation => {
                        this.getLinkedDatasets(relation);
                    });
                }
                document.title = res.data.data.name.trim();
                let counter = !this.state.data.counter ? 1 : this.state.data.counter + 1;

                this.topicContext = {
                    datasets: [{ datasetId: this.state.data.datasetid, publisher: this.state.data.datasetfields.publisher }] || [],
                    tags: [this.state.data.name],
                    relatedObjectIds: [this.state.data._id] || '',
                    title: this.state.data.datasetfields.publisher || '',
                    subTitle: this.state.data.name || '',
                    contactPoint: this.state.data.datasetfields.contactPoint || '',
                    allowNewMessage: false,
                };

                this.updateCounter(this.state.data.datasetid, counter);

                if (!isUndefined(res.data.data.relatedObjects)) {
                    this.getAdditionalObjectInfo(res.data.data.relatedObjects);
                }

                if (!isEmpty(this.topicContext.title)) {
                    const publisherId = this.topicContext.title;
                    await this.getPublisherById(publisherId);
                }

                if (!res.data.isLatestVersion) {
                    this.setState({
                        alert: {
                            type: 'warning',
                            message: (
                                <Fragment>
                                    You are viewing an old version of this dataset. Click <a href={'/dataset/' + res.data.data.pid}>here</a>{' '}
                                    for the latest version.
                                </Fragment>
                            ),
                        },
                    });
                }

                if (res.data.isDatasetArchived) {
                    this.setState({
                        alert: {
                            type: 'warning',
                            message: (
                                <Fragment>The dataset that you are viewing has been archived and there is no active versions.</Fragment>
                            ),
                        },
                    });
                }
                this.setState({ isLoading: false });
            }
        });
    };

    async getTechnicalMetadata() {
        let tablesWithProfilingData = [];
        let cohortProfilingTechnicalMetadata = {};
        await axios
            .get(
                baseURL +
                    '/api/v1/cohortProfiling?pid=' +
                    this.props.match.params.datasetID +
                    '&fields=dataClasses.dataElements.field,dataClasses.name,dataClasses.dataElements.completeness'
            )
            .then(res => {
                const datasetHasCohortProfiling = res.data.cohortProfiling.length > 0;

                if (datasetHasCohortProfiling) {
                    cohortProfilingTechnicalMetadata = res.data.cohortProfiling[0];
                    tablesWithProfilingData = cohortProfilingTechnicalMetadata.dataClasses.map(dataClass => {
                        return dataClass.name;
                    });
                }
                this.setState({
                    datasetHasCohortProfiling,
                });
            });

        if (this.state.data) {
            const {
                datasetfields: { technicaldetails: technicalMetadata = [] },
            } = this.state.data;
            const technicalMetadataWithProfiling = technicalMetadata.map(dataClass => {
                // If cohortProfilingTechnicalMetadata exists then at least some dataClasses will have profiling data
                // 1. Find the dataClasses that have profiling data
                const dataClassProfilingData = tablesWithProfilingData.includes(dataClass.label);
                return {
                    ...dataClass,
                    elements:
                        !isEmpty(cohortProfilingTechnicalMetadata) && dataClassProfilingData
                            ? this.appendCohortProfilingCompletenessToDataElements(dataClass, cohortProfilingTechnicalMetadata)
                            : dataClass.elements,
                    hasProfilingData: dataClassProfilingData,
                };
            });
            this.setState({
                technicalMetadata: [...technicalMetadataWithProfiling],
                isLoading: false,
            });
        }
    }

    appendCohortProfilingCompletenessToDataElements(dataClass, cohortProfilingTechnicalMetadata) {
        return dataClass.elements.map(element => {
            // 2. Find which of their data elements have profiling data
            const currentElement = cohortProfilingTechnicalMetadata.dataClasses
                .find(table => {
                    return table.name === dataClass.label;
                })
                .dataElements.find(dataElement => {
                    return dataElement.field === element.label;
                });
            // 3. Find the completeness % for those data elements and include it in the return object
            const completenessForCurrentElement = has(currentElement, 'completeness') ? currentElement.completeness : undefined;

            return { ...element, completeness: completenessForCurrentElement };
        });
    }

    getCollections() {
        axios.get(baseURL + '/api/v1/collections/entityid/' + this.state.data.pid).then(res => {
            this.setState({
                collections: res.data.data || [],
            });
        });
    }

    updateV2Flags(v2data) {
        if (
            isEmpty(v2data.summary.doiName) &&
            isEmpty(v2data.provenance.temporal.distributionReleaseDate) &&
            isEmpty(v2data.provenance.temporal.accrualPeriodicity) &&
            isEmpty(v2data.issued) &&
            isEmpty(v2data.modified) &&
            isEmpty(v2data.version) &&
            isEmpty(v2data.accessibility.usage.resourceCreator)
        ) {
            this.setState({ emptyFlagDetails: true });
        }

        if (
            (isEmpty(v2data.provenance.temporal.startDate) || isEmpty(v2data.provenance.temporal.endDate)) &&
            isEmpty(v2data.provenance.temporal.timeLag) &&
            isEmpty(v2data.coverage.spatial) &&
            isEmpty(v2data.coverage.typicalAgeRange) &&
            isEmpty(v2data.coverage.physicalSampleAvailability) &&
            isEmpty(v2data.coverage.followup) &&
            isEmpty(v2data.coverage.pathway)
        ) {
            this.setState({ emptyFlagCoverage: true });
        }

        if (
            isEmpty(v2data.accessibility.formatAndStandards.vocabularyEncodingScheme) &&
            isEmpty(v2data.accessibility.formatAndStandards.conformsTo) &&
            isEmpty(v2data.accessibility.formatAndStandards.language) &&
            isEmpty(v2data.accessibility.formatAndStandards.format)
        ) {
            this.setState({ emptyFlagFormats: true });
        }

        if (
            isEmpty(v2data.provenance.origin.purpose) &&
            isEmpty(v2data.provenance.source) &&
            isEmpty(v2data.provenance.collectionSituation) &&
            isEmpty(v2data.enrichmentAndLinkage.derivation) &&
            isEmpty(v2data.observations.observedNode) &&
            isEmpty(v2data.observations.disambiguatingDescription) &&
            isEmpty(v2data.observations.measuredValue) &&
            isEmpty(v2data.observations.measuredProperty) &&
            isEmpty(v2data.observations.observationDate)
        ) {
            this.setState({ emptyFlagProvenance: true });
        }

        if (isEmpty(v2data.observations)) {
            this.setState({ emptyFlagObservations: true });
        }

        if (
            isEmpty(v2data.summary.publisher.accessRights) &&
            isEmpty(v2data.summary.publisher.deliveryLeadTime) &&
            isEmpty(v2data.summary.publisher.accessRequestCost) &&
            isEmpty(v2data.summary.publisher.accessService) &&
            isEmpty(v2data.accessibility.access.accessRequestCost) &&
            isEmpty(v2data.accessibility.access.accessRights) &&
            isEmpty(v2data.accessibility.access.deliveryLeadTime) &&
            isEmpty(v2data.accessibility.access.accessService) &&
            isEmpty(v2data.accessibility.access.jurisdiction) &&
            isEmpty(v2data.summary.publisher.accessService.dataUseLimitation) &&
            isEmpty(v2data.summary.publisher.accessService.dataUseRequirements) &&
            isEmpty(v2data.accessibility.access.dataController) &&
            isEmpty(v2data.accessibility.access.dataProcessor)
        ) {
            this.setState({ emptyFlagDAR: true });
        }

        if (
            isEmpty(v2data.accessibility.usage.isReferencedBy) &&
            isEmpty(v2data.enrichmentAndLinkage.tools) &&
            isEmpty(v2data.accessibility.usage.investigations)
        ) {
            this.setState({ emptyFlagRelRes: true });
        }

        this.setState({ showEmpty: false });
    }

    getLinkedDatasets = async relation => {
        let linkedDatasets = this.state.linkedDatasets;

        // 1. Check if relation is a URL
        if (relation.match(/\bhttps?:\/\/\S+/gi)) {
            linkedDatasets.push({
                title: relation,
                info:
                    relation.slice(0, 46) === 'https://web.www.healthdatagateway.org/dataset/'
                        ? 'Dataset on the gateway'
                        : 'Dataset not on the gateway',
                type: 'externallink',
            });
        } else {
            // 2. Check if relation is a String that matches a dataset title
            await axios.get(baseURL + '/api/v1/relatedobject/linkeddatasets/' + encodeURIComponent(relation)).then(async res => {
                const { datasetFound, pid, name, publisher } = res.data;
                if (datasetFound && !isNil(pid)) {
                    if (pid !== this.state.data.pid) {
                        linkedDatasets.unshift({
                            title: name,
                            info: publisher,
                            type: 'gatewaylink',
                            id: pid,
                        });
                    }
                } else {
                    // 3. Else determine that relation is an unrecognised dataset title
                    linkedDatasets.push({
                        title: relation,
                        info: 'Unrecognised dataset title',
                        type: 'text',
                    });
                }
            });
        }

        this.setState({ linkedDatasets });
    };

    getEmptyFieldsCount(v2data) {
        let temporalCoverage = '';
        if (!isEmpty(v2data.provenance.temporal.startDate) && !isEmpty(v2data.provenance.temporal.endDate)) {
            temporalCoverage = v2data.provenance.temporal.startDate + ' - ' + v2data.provenance.temporal.endDate;
        }

        let requiredFieldsArray = [
            v2data.summary.doiName,
            v2data.provenance.temporal.distributionReleaseDate,
            v2data.provenance.temporal.accrualPeriodicity,
            v2data.issued,
            v2data.modified,
            v2data.version,
            v2data.accessibility.usage.resourceCreator,
            temporalCoverage,
            v2data.provenance.temporal.timeLag,
            v2data.coverage.spatial,
            v2data.coverage.typicalAgeRange,
            v2data.coverage.physicalSampleAvailability,
            v2data.coverage.followup,
            v2data.coverage.pathway,
            v2data.accessibility.formatAndStandards.vocabularyEncodingScheme,
            v2data.accessibility.formatAndStandards.conformsTo,
            v2data.accessibility.formatAndStandards.language,
            v2data.accessibility.formatAndStandards.format,
            v2data.provenance.origin.purpose,
            v2data.provenance.origin.source,
            v2data.provenance.origin.collectionSituation,
            v2data.enrichmentAndLinkage.derivation,
            v2data.observations,
            v2data.accessibility.access.accessRights || v2data.summary.publisher.accessRights,
            v2data.accessibility.access.deliveryLeadTime || v2data.summary.publisher.deliveryLeadTime,
            v2data.accessibility.access.accessRequestCost || v2data.summary.publisher.accessRequestCost,
            v2data.accessibility.access.accessService || v2data.summary.publisher.accessService,
            v2data.accessibility.usage.dataUseLimitation || v2data.summary.publisher.dataUseLimitation,
            v2data.accessibility.usage.dataUseRequirements || v2data.summary.publisher.dataUseRequirements,
            v2data.accessibility.access.dataController,
            v2data.accessibility.access.dataProcessor,
            v2data.accessibility.usage.isReferencedBy,
            v2data.enrichmentAndLinkage.tools,
            v2data.accessibility.usage.investigations,
        ];
        let emptyFieldsArray = requiredFieldsArray.filter(field => isEmpty(field));
        let tempEmptyFieldsCount = emptyFieldsArray.length;

        this.setState({ emptyFieldsCount: tempEmptyFieldsCount });
    }

    updatePublisherLogo(publisher) {
        let url = env === 'local' ? 'https://uatbeta.healthdatagateway.org' : cmsURL;
        let publisherLogoURL = url + '/images/publisher/' + publisher;

        this.setState({ publisherLogoURL: publisherLogoURL });
    }

    showHideAllEmpty() {
        if (this.state.showEmpty === false) {
            this.setState({
                emptyFlagDetails: false,
                emptyFlagCoverage: false,
                emptyFlagFormats: false,
                emptyFlagProvenance: false,
                emptyFlagObservations: false,
                emptyFlagDAR: false,
                emptyFlagRelRes: false,
                showEmpty: true,
            });
        }

        if (this.state.showEmpty === true) {
            this.updateV2Flags(this.state.v2data);
        }
    }

    doUpdateDataClassOpen(index) {
        this.setState({
            dataClassOpen: index,
        });
    }

    doSearch = e => {
        //fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(this.state.searchString)}`;
    };

    checkAlerts = () => {
        const { state } = this.props.location;
        if (typeof state !== 'undefined' && typeof state.alert !== 'undefined') {
            const { alert } = state;
            this.setState({ alert });
        }
    };

    updateSearchString = searchString => {
        this.setState({ searchString: searchString });
    };

    updateCounter = (id, counter) => {
        axios.post(baseURL + '/api/v1/counter/update', { id, counter });
    };

    handleMouseHover() {
        this.setState(this.toggleHoverState);
    }

    toggleHoverState(state) {
        return {
            isHovering: !state.isHovering,
            isHoveringPhenotypes: !state.isHoveringPhenotypes,
        };
    }

    handleMouseHoverShield() {
        this.setState(this.toggleHoverStateShield);
    }

    toggleHoverStateShield(state) {
        return {
            isHoveringShield: !state.isHoveringShield,
        };
    }

    getAdditionalObjectInfo = async data => {
        let tempObjects = [];
        const promises = data.map(async (object, index) => {
            if (object.objectType === 'course') {
                await axios.get(baseURL + '/api/v1/relatedobject/course/' + object.objectId).then(res => {
                    tempObjects.push({
                        name: res.data.data[0].title,
                        id: object.objectId,
                        activeflag: res.data.data[0].activeflag,
                    });
                });
            } else if (object.objectType === 'dataUseRegister') {
                await axios.get(baseURL + '/api/v1/relatedobject/dataUseRegister/' + object.objectId).then(res => {
                    tempObjects.push({
                        id: object.objectId,
                        activeflag: res.data.data[0].activeflag,
                        projectTitle: res.data.data[0].projectTitle,
                    });
                });
            } else {
                await axios.get(baseURL + '/api/v1/relatedobject/' + object.objectId).then(res => {
                    tempObjects.push({
                        name: res.data.data[0].name,
                        firstname: res.data.data[0].firstname || '',
                        lastname: res.data.data[0].lastname || '',
                        id: object.objectId,
                        authors: res.data.data[0].authors,
                        activeflag: res.data.data[0].activeflag,
                    });
                });
            }
        });
        await Promise.all(promises);
        this.setState({ objects: tempObjects });

        this.getRelatedObjects();
    };

    getRelatedObjects = () => {
        let tempRelatedObjects = [];
        this.state.data.relatedObjects.map(object =>
            this.state.objects.forEach(item => {
                if (object.objectId === item.id && item.activeflag === 'active') {
                    object['name'] = item.name || '';
                    object['firstname'] = item.firstname || '';
                    object['lastname'] = item.lastname || '';
                    object['projectTitle'] = item.projectTitle || '';
                    tempRelatedObjects.push(object);
                }

                if (object.objectId === item.id && item.activeflag === 'review' && item.authors.includes(this.state.userState[0].id)) {
                    tempRelatedObjects.push(object);
                }
            })
        );
        this.setState({
            relatedObjects: tempRelatedObjects,
            relatedObjectsFiltered: tempRelatedObjects,
            relatedResourcesSort: tempRelatedObjects,
        });
    };

    updateDiscoursePostCount = count => {
        this.setState({ discoursePostCount: count });
    };

    getPublisherById = async publisherId => {
        await axios
            .get(`${baseURL}/api/v1/publishers/${publisherId}`)
            .then(response => {
                const {
                    data: {
                        publisher: { dataRequestModalContent = {}, allowsMessaging = false },
                    },
                } = response;
                const stateObj = {
                    allowNewMessage: allowsMessaging && isEmpty(dataRequestModalContent) ? true : false,
                    allowsMessaging,
                    dataRequestModalContent,
                };
                this.topicContext = {
                    ...this.topicContext,
                    ...stateObj,
                };
                this.setState({ ...stateObj });
            })
            .catch(err => {
                console.error(err.message);
            });
    };

    showLoginModal = title => {
        DataSetHelper.showLoginPanel(window, title);
    };

    toggleDrawer = () => {
        this.setState(prevState => {
            if (prevState.showDrawer === true) {
                this.searchBar.current.getNumberOfUnreadMessages();
            }
            return { showDrawer: !prevState.showDrawer };
        });
    };

    toggleModal = action => {
        this.setState(prevState => {
            return { showModal: !prevState.showModal };
        });

        if (action === 'SUBMIT_APPLICATION') {
            this.toggleCustodianModal();
        } else if (action === 'ENQUIRY') {
            this.topicContext = {
                ...this.topicContext,
                allowNewMessage: true,
            };
            this.toggleDrawer();
        }
    };

    toggleCustodianModal = (action = '') => {
        this.setState(prevState => {
            return { showCustodianModal: !prevState.showCustodianModal };
        });

        if (action === 'ENQUIRY') {
            console.log('Show message drawer');
            this.topicContext = {
                ...this.topicContext,
                allowNewMessage: true,
            };
            this.toggleDrawer();
        } else if (action === 'SUBMIT_APPLICATION') {
            console.log('Take user to application');
            const { publisher } = this.topicContext.datasets[0];
            googleAnalytics.recordEvent('Data access request', 'Start application', 'Modal button clicked');
            this.props.history.push({ pathname: `/data-access-request/publisher/${publisher}` }, { datasets: this.topicContext.datasets });
        }
    };

    showAllPhenotypes = () => {
        this.setState({ showAllPhenotype: true });
    };

    showAllLinkedDatasets = () => {
        this.setState({ showAllLinkedDatasets: true });
    };

    exportCitation = () => {
        const data = this.state.data;
        const year = new Date(data.datasetv2.provenance.temporal.distributionReleaseDate).getFullYear();
        navigator.clipboard.writeText(
            data.datasetv2.summary.publisher.name +
                '(' +
                year +
                ').' +
                data.name +
                '.' +
                data.datasetVersion +
                '.' +
                data.type +
                '.' +
                data.datasetv2.summary.doiName
        );
        this.setState({ showCitationSuccess: true });
    };

    onRelatedObjectsSearch = e => {
        this.setState({ relatedObjectsSearchValue: e.target.value });
    };

    doRelatedObjectsSearch = async e => {
        // Fires on enter on searchbar
        if (e.key === 'Enter') {
            this.setState({ relatedObjectsFiltered: [], relatedResourcesSort: [], sorting: 'showAll' });

            const filteredRelatedResourceItems = await this.filterRelatedResourceItems(
                this.state.relatedObjects,
                this.state.relatedObjectsSearchValue
            );

            let tempFilteredData = filteredRelatedResourceItems.filter(dat => {
                return dat !== '';
            });
            this.setState({ relatedObjectsFiltered: tempFilteredData, relatedResourcesSort: tempFilteredData });
        }
    };

    filterRelatedResourceItems = (objectData, relatedObjectsSearchValue) =>
        objectData.map(object => {
            // Searching functionality - searches through object data and returns true if there is a match with the search term
            if (
                (has(object, 'name') ? object.name.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
                (has(object, 'title') ? object.title.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
                (has(object, 'firstname') ? object.firstname.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
                (has(object, 'lastname') ? object.lastname.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
                (has(object, 'projectTitle') ? object.projectTitle.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false)
            ) {
                return object;
            } else {
                return '';
            }
        });

    handleSort = async sort => {
        this.setState({ relatedObjectsFiltered: [] });
        googleAnalytics.recordEvent('Collections', `Sorted related resources by ${sort}`, 'Sort dropdown option changed');
        let tempFilteredData = [];
        if (sort === 'showAll') {
            tempFilteredData = await this.state.relatedResourcesSort;
        } else {
            tempFilteredData = await this.state.relatedResourcesSort.filter(dat => dat.objectType === sort);
        }
        this.setState({ sorting: sort, relatedObjectsFiltered: tempFilteredData });
    };

    render() {
        const {
            searchString,
            data,
            v2data,
            technicalMetadata,
            isLoading,
            userState,
            alert = null,
            dataClassOpen,
            relatedObjects,
            discoursePostCount,
            showDrawer,
            showModal,
            showCustodianModal,
            showAllPhenotype,
            showAllLinkedDatasets,
            collections,
            emptyFlagDetails,
            emptyFlagCoverage,
            emptyFlagFormats,
            emptyFlagProvenance,
            emptyFlagObservations,
            emptyFlagDAR,
            emptyFlagRelRes,
            showEmpty,
            emptyFieldsCount,
            linkedDatasets,
            publisherLogoURL,
            sorting,
            relatedResourcesSort,
            relatedObjectsFiltered,
            relatedObjectsSearchValue,
        } = this.state;

        let publisherLogo = !isEmpty(v2data) && !isEmpty(v2data.summary.publisher.logo) ? v2data.summary.publisher.logo : publisherLogoURL;

        const componentDecorator = (href, text, key) => (
            <span>
                <a href={href} key={key} target='_blank' rel='noopener noreferrer' className='gray800-14-bold pointer overflowWrap'>
                    {' '}
                    {text}
                </a>
            </span>
        );

        const formatLinks = source => {
            const reUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
            return source.replace(reUrl, '[$1]($1) ');
        };

        if (isLoading) {
            return (
                <Container>
                    <Loading data-testid='isLoading' />
                </Container>
            );
        }

        if (isNil(data.relatedObjects)) {
            data.relatedObjects = [];
        }
        if (has(data, 'datasetfields.phenotypes') && data.datasetfields.phenotypes.length > 0) {
            data.datasetfields.phenotypes.sort((a, b) =>
                a.name.toLowerCase() > b.name.toLowerCase() ? 1 : b.name.toLowerCase() > a.name.toLowerCase() ? -1 : 0
            );
        }

        function Metadata() {
            var rating = 'Not Rated';

            if (data.datasetfields.metadataquality && !isNil(data.datasetfields.metadataquality.weighted_quality_rating)) {
                rating = data.datasetfields.metadataquality.weighted_quality_rating;
            } else {
                return (
                    <Fragment>
                        <div style={{ lineHeight: 1 }}>
                            <MetadataNotRated className='' />
                        </div>
                    </Fragment>
                );
            }

            const renderTooltip = props => (
                <Tooltip className='metadataOverlay' {...props}>
                    Metadata richness score: {Math.trunc(data.datasetfields.metadataquality.weighted_quality_score)}
                    <br />
                    <br />
                    The score relates to the amount of information available about the dataset, and not to the quality of the actual
                    datasets.
                    <br />
                    <br />
                    Click to read more about how the score is calculated.
                    <br />
                    <br />
                    {Math.trunc(data.datasetfields.metadataquality.weighted_completeness_percent)} Weighted completeness %
                    <br />
                    {Math.trunc(data.datasetfields.metadataquality.weighted_error_percent)} Weighted error %
                </Tooltip>
            );

            return (
                <Fragment>
                    <OverlayTrigger placement='bottom' delay={{ show: 100, hide: 400 }} overlay={renderTooltip}>
                        <div
                            className='text-center'
                            onClick={() =>
                                window.open(
                                    'https://github.com/HDRUK/datasets/tree/master/reports#hdr-uk-data-documentation-scores',
                                    '_blank',
                                    'noopener, noreferrer'
                                )
                            }
                        >
                            <div style={{ cursor: 'pointer' }}>
                                <div style={{ lineHeight: 1 }}>
                                    {(() => {
                                        if (rating === 'Not Rated') return <MetadataNotRated />;
                                        else if (rating === 'Bronze') return <MetadataBronze />;
                                        else if (rating === 'Silver') return <MetadataSilver />;
                                        else if (rating === 'Gold') return <MetadataGold />;
                                        else if (rating === 'Platinum') return <MetadataPlatinum />;
                                    })()}
                                </div>
                            </div>
                        </div>
                    </OverlayTrigger>
                </Fragment>
            );
        }

        return (
            <Sentry.ErrorBoundary fallback={<ErrorModal />}>
                <Fragment>
                    <DatasetSchema data={data} />

                    <SearchBar
                        ref={this.searchBar}
                        searchString={searchString}
                        doSearchMethod={this.doSearch}
                        doUpdateSearchString={this.updateSearchString}
                        userState={userState}
                        doToggleDrawer={this.toggleDrawer}
                    />
                    <Container className='margin-bottom-48'>
                        <Row className='mt-4'>
                            <Col sm={1} />
                            <Col sm={10}>
                                {this.state.showCitationSuccess && (
                                    <Alert variant='success' className='citation-banner green-banner'>
                                        <Row>
                                            <Col>Citation has been copied to clipboard.</Col>
                                        </Row>
                                    </Alert>
                                )}
                                {alert ? <Alert variant={alert.type}>{alert.message}</Alert> : null}
                                <div className='rectangle'>
                                    <Row>
                                        <Col xs={1} md={1}>
                                            <div
                                                className='datasetImageCircle'
                                                style={{
                                                    backgroundImage: `url('${publisherLogo}')`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundPosition: 'center',
                                                    backgroundSize: 'contain',
                                                    backgroundOrigin: 'content-box',
                                                }}
                                            />
                                        </Col>
                                        <Col xs={7} md={9} className='datasetTitle'>
                                            <span className='black-16'> {data.name} </span>
                                            <br />
                                            <span>
                                                {!isEmpty(v2data.summary.publisher.memberOf) ? (
                                                    <>
                                                        <span
                                                            onMouseEnter={this.handleMouseHoverShield}
                                                            onMouseLeave={this.handleMouseHoverShield}
                                                        >
                                                            <SVGIcon
                                                                name='shield'
                                                                fill={'#475da7'}
                                                                className='svg-16 mr-2'
                                                                viewBox='0 0 16 16'
                                                            />
                                                        </span>

                                                        {this.state.isHoveringShield && (
                                                            <div className='dataShieldToolTip'>
                                                                <span className='white-13-semibold'>
                                                                    {v2data.summary.publisher.memberOf.charAt(0).toUpperCase() +
                                                                        v2data.summary.publisher.memberOf.slice(1).toLowerCase()}{' '}
                                                                    member
                                                                </span>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    ''
                                                )}
                                                {!isEmpty(v2data.summary.publisher.name) ? (
                                                    <span className='gray800-14'>{v2data.summary.publisher.name}</span>
                                                ) : (
                                                    <span className='gray800-14-opacity'>Not specified</span>
                                                )}
                                            </span>
                                        </Col>
                                        <Col xs={4} md={2} className='text-right'>
                                            <Metadata />
                                        </Col>
                                    </Row>
                                    <Row className='mt-2'>
                                        <Col xs={12}>
                                            <span className='badge-dataset'>
                                                <SVGIcon
                                                    name='dataseticon'
                                                    fill={'#113328'}
                                                    className='badgeSvg mr-2'
                                                    viewBox='-2 -2 22 22'
                                                />
                                                <span>Dataset</span>
                                            </span>
                                            {this.state.isCohortDiscovery ? (
                                                <span className='badge-project'>
                                                    <SVGIcon
                                                        name='cohorticon'
                                                        fill={'#472505'}
                                                        className='badgeSvg mr-2'
                                                        width='22'
                                                        height='22'
                                                        viewBox='0 0 10 10'
                                                    />
                                                    <span>Cohort Discovery</span>
                                                </span>
                                            ) : (
                                                ''
                                            )}
                                            {!data.tags.features || data.tags.features.length <= 0
                                                ? ''
                                                : data.tags.features.map((keyword, index) => {
                                                      return (
                                                          <a
                                                              key={`tag-${index}`}
                                                              href={`/search?search=&tab=Datasets&datasetfeatures=${keyword}`}
                                                          >
                                                              <div className='ml-2 badge-tag'>{keyword}</div>
                                                          </a>
                                                      );
                                                  })}
                                        </Col>
                                    </Row>
                                    <Row className='mt-2'>
                                        <Col sm={6}>
                                            <span className='gray800-14'>
                                                {data.counter === undefined ? 1 : data.counter + 1}
                                                {data.counter === undefined ? ' view' : ' views'}
                                            </span>
                                        </Col>

                                        {this.state.isLatestVersion && !this.state.isDatasetArchived && (
                                            <Col sm={6} className='text-right'>
                                                <button
                                                    data-test-id='dataset-request-access-btn'
                                                    className='btn btn-primary addButton pointer float-right'
                                                    onClick={() => {
                                                        this.toggleModal();
                                                        googleAnalytics.recordEvent(
                                                            'Data access request',
                                                            'How to request access',
                                                            'Dataset page primary button clicked'
                                                        );
                                                    }}
                                                >
                                                    How to request access
                                                </button>
                                            </Col>
                                        )}
                                    </Row>
                                </div>
                            </Col>
                            <Col sm={1} />
                        </Row>

                        <Row>
                            <Col sm={1} />
                            <Col sm={10}>
                                <div>
                                    <Tabs
                                        className='tabsBackground gray700-13 margin-bottom-16'
                                        onSelect={key => {
                                            googleAnalytics.recordVirtualPageView(`${key} tab`);
                                            googleAnalytics.recordEvent('Datasets', `Clicked ${key} tab`, `Viewing ${key}`);
                                        }}
                                    >
                                        <Tab eventKey='About' title={'About'}>
                                            {!isEmpty(v2data.summary.abstract) ? (
                                                <Row className='mt-1'>
                                                    <Col sm={12}>
                                                        <div className='rectangle'>
                                                            <Row className='gray800-14-bold'>
                                                                <Col sm={12}>Abstract</Col>
                                                            </Row>
                                                            <Row className='mt-3'>
                                                                <Col sm={12} className='gray800-14'>
                                                                    <span className='gray800-14'>{v2data.summary.abstract}</span>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                ''
                                            )}

                                            {!isEmpty(v2data.documentation.description) ? (
                                                <Row className='mt-1'>
                                                    <Col sm={12}>
                                                        <div className='rectangle'>
                                                            <Row className='gray800-14-bold'>
                                                                <Col sm={12}>Description</Col>
                                                            </Row>
                                                            <Row className='mt-3'>
                                                                <Col sm={12} className='gray800-14 overflowWrap'>
                                                                    <span className='gray800-14'>
                                                                        <ReactMarkdown
                                                                            source={formatLinks(v2data.documentation.description)}
                                                                        />
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                ''
                                            )}

                                            {emptyFlagDetails === false ? (
                                                <DatasetAboutCard section='Details' v2data={v2data} showEmpty={showEmpty} />
                                            ) : (
                                                ''
                                            )}
                                            {emptyFlagCoverage === false ? (
                                                <DatasetAboutCard section='Coverage' v2data={v2data} showEmpty={showEmpty} />
                                            ) : (
                                                ''
                                            )}
                                            {emptyFlagFormats === false ? (
                                                <DatasetAboutCard section='Formats and standards' v2data={v2data} showEmpty={showEmpty} />
                                            ) : (
                                                ''
                                            )}
                                            {emptyFlagProvenance === false ? (
                                                <DatasetAboutCard section='Provenance' v2data={v2data} showEmpty={showEmpty} />
                                            ) : (
                                                ''
                                            )}
                                            {emptyFlagObservations === false ? (
                                                <DatasetAboutCard section='Observations' v2data={v2data} showEmpty={showEmpty} />
                                            ) : (
                                                ''
                                            )}
                                            {emptyFlagDAR === false ? (
                                                <DatasetAboutCard
                                                    section='Data access request'
                                                    v2data={v2data}
                                                    showEmpty={showEmpty}
                                                    toggleModal={this.toggleModal}
                                                    showLoginModal={() => {
                                                        this.showLoginModal(data.name);
                                                    }}
                                                    datasetid={this.state.data.datasetid}
                                                    loggedIn={this.state.userState[0].loggedIn}
                                                />
                                            ) : (
                                                ''
                                            )}
                                            {emptyFlagRelRes === false ? (
                                                <DatasetAboutCard section='Related resources' v2data={v2data} showEmpty={showEmpty} />
                                            ) : (
                                                ''
                                            )}

                                            {!isNil(data.datasetfields.phenotypes) && data.datasetfields.phenotypes.length > 0 ? (
                                                <Fragment>
                                                    <Row className='mt-1'>
                                                        <Col sm={12}>
                                                            <div className='rectangle'>
                                                                <Row className='gray800-14-bold'>
                                                                    <Col sm={12}>
                                                                        <span className='mr-3'>Phenotypes</span>

                                                                        <span
                                                                            onMouseEnter={this.handleMouseHover}
                                                                            onMouseLeave={this.handleMouseHover}
                                                                        >
                                                                            {this.state.isHoveringPhenotypes ? (
                                                                                <InfoFillSVG />
                                                                            ) : (
                                                                                <InfoSVG />
                                                                            )}
                                                                        </span>

                                                                        {this.state.isHoveringPhenotypes && (
                                                                            <div className='dataClassToolTip'>
                                                                                <span className='white-13-semibold'>
                                                                                    When patients interact with physicians, or are admitted
                                                                                    into hospital, information is collected electronically
                                                                                    on their symptoms, diagnoses, laboratory test results,
                                                                                    and prescriptions and stored in Electronic Health
                                                                                    Records (EHR). EHR are a valuable resource for
                                                                                    researchers and clinicians for improving health and
                                                                                    healthcare. Phenotyping algorithms are complex computer
                                                                                    programs that extract useful information from EHR so
                                                                                    they can be used for health research.
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </Col>
                                                                </Row>
                                                                <Row className='mt-2'>
                                                                    <Col sm={12} className='gray800-14'>
                                                                        Below are the phenotypes identified in this dataset through a
                                                                        phenotyping algorithm.
                                                                    </Col>
                                                                </Row>
                                                                <Row className='mt-3'>
                                                                    {!showAllPhenotype
                                                                        ? data.datasetfields.phenotypes.slice(0, 20).map(phenotype => {
                                                                              return (
                                                                                  <Fragment>
                                                                                      <Col xs={6} lg={3} className='mb-2'>
                                                                                          <a
                                                                                              href={phenotype.url}
                                                                                              rel='noopener noreferrer'
                                                                                              className='purple-14'
                                                                                          >
                                                                                              {phenotype.name}
                                                                                          </a>
                                                                                      </Col>
                                                                                      <Col xs={6} lg={3} className='gray800-14-opacity'>
                                                                                          {phenotype.type}
                                                                                      </Col>
                                                                                  </Fragment>
                                                                              );
                                                                          })
                                                                        : data.datasetfields.phenotypes.map(phenotype => {
                                                                              return (
                                                                                  <Fragment>
                                                                                      <Col xs={6} lg={3} className='mb-2'>
                                                                                          <a
                                                                                              href={phenotype.url}
                                                                                              rel='noopener noreferrer'
                                                                                              className='purple-14'
                                                                                          >
                                                                                              {phenotype.name}
                                                                                          </a>
                                                                                      </Col>
                                                                                      <Col xs={6} lg={3} className='gray800-14-opacity'>
                                                                                          {phenotype.type}
                                                                                      </Col>
                                                                                  </Fragment>
                                                                              );
                                                                          })}
                                                                </Row>
                                                                {!showAllPhenotype && data.datasetfields.phenotypes.length > 20 ? (
                                                                    <Row className='mt-3 text-center'>
                                                                        <Col sm={12} className='purple-14'>
                                                                            <span
                                                                                onClick={() => this.showAllPhenotypes()}
                                                                                style={{ cursor: 'pointer' }}
                                                                            >
                                                                                Show all phenotypes
                                                                            </span>
                                                                        </Col>
                                                                    </Row>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Fragment>
                                            ) : (
                                                ''
                                            )}

                                            {!isEmpty(v2data) && !isEmpty(v2data.enrichmentAndLinkage.qualifiedRelation) ? (
                                                <Fragment>
                                                    <Row className='mt-1'>
                                                        <Col sm={12}>
                                                            <div className='rectangle'>
                                                                <Row className='gray800-14-bold'>
                                                                    <Col sm={12}>
                                                                        <span className='gray800-14-bold'>Linked datasets</span>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    {!showAllLinkedDatasets
                                                        ? linkedDatasets.slice(0, 10).map((relation, index) => {
                                                              return (
                                                                  <Row className='pixelGapTop' key={`linkedDatasets-${index}`}>
                                                                      <Col sm={12} m={12}>
                                                                          <div className='rectangle'>
                                                                              <Row className='gray800-14-bold'>
                                                                                  <Col sm={9} m={9} lg={9}>
                                                                                      <Row>
                                                                                          <Col sm={1} m={1} lg={1}>
                                                                                              <SVGIcon
                                                                                                  name={
                                                                                                      relation.type === 'gatewaylink'
                                                                                                          ? 'dataseticon'
                                                                                                          : relation.type === 'externallink'
                                                                                                          ? 'externallink'
                                                                                                          : 'searchicon'
                                                                                                  }
                                                                                                  fill={'#475da7'}
                                                                                                  className='svg-16 mr-2'
                                                                                                  viewBox='-2 -2 20 20'
                                                                                              />
                                                                                          </Col>
                                                                                          <Col
                                                                                              sm={11}
                                                                                              m={11}
                                                                                              lg={11}
                                                                                              className='datasetLinked'
                                                                                          >
                                                                                              {relation.type === 'gatewaylink' ? (
                                                                                                  <span>
                                                                                                      <a
                                                                                                          href={'/dataset/' + relation.id}
                                                                                                          target='_blank'
                                                                                                          rel='noopener noreferrer'
                                                                                                          className='gray800-14-bold pointer overflowWrap'
                                                                                                      >
                                                                                                          {relation.title}
                                                                                                      </a>
                                                                                                  </span>
                                                                                              ) : relation.type === 'externallink' ? (
                                                                                                  <Linkify
                                                                                                      componentDecorator={
                                                                                                          componentDecorator
                                                                                                      }
                                                                                                  >
                                                                                                      {relation.title}
                                                                                                  </Linkify>
                                                                                              ) : (
                                                                                                  <span className='gray800-14-bold overflowWrap'>
                                                                                                      {relation.title}
                                                                                                  </span>
                                                                                              )}
                                                                                          </Col>
                                                                                      </Row>
                                                                                      <Row>
                                                                                          <Col sm={1} m={1} lg={1} />
                                                                                          <Col
                                                                                              sm={11}
                                                                                              m={11}
                                                                                              lg={11}
                                                                                              className='datasetLinked'
                                                                                          >
                                                                                              <span className='gray800-14'>
                                                                                                  {relation.info}
                                                                                              </span>
                                                                                          </Col>
                                                                                      </Row>
                                                                                  </Col>
                                                                                  <Col sm={3} m={3} lg={3}>
                                                                                      {relation.type === 'text' ? (
                                                                                          <Button
                                                                                              variant='white'
                                                                                              href={'/search?search=' + relation.title}
                                                                                              target='_blank'
                                                                                              className='gatewaySearchButton floatRightLinkedDataset'
                                                                                          >
                                                                                              Search on gateway
                                                                                          </Button>
                                                                                      ) : (
                                                                                          ''
                                                                                      )}
                                                                                  </Col>
                                                                              </Row>
                                                                          </div>
                                                                      </Col>
                                                                  </Row>
                                                              );
                                                          })
                                                        : linkedDatasets.map(relation => {
                                                              return (
                                                                  <Row className='pixelGapTop'>
                                                                      <Col sm={12} m={12}>
                                                                          <div className='rectangle'>
                                                                              <Row className='gray800-14-bold'>
                                                                                  <Col sm={9} m={9} lg={9}>
                                                                                      <Row>
                                                                                          <Col sm={1} m={1} lg={1}>
                                                                                              <SVGIcon
                                                                                                  name={
                                                                                                      relation.type === 'gatewaylink'
                                                                                                          ? 'dataseticon'
                                                                                                          : relation.type === 'externallink'
                                                                                                          ? 'externallink'
                                                                                                          : 'searchicon'
                                                                                                  }
                                                                                                  fill={'#475da7'}
                                                                                                  className='svg-16 mr-2'
                                                                                                  viewBox='-2 -2 20 20'
                                                                                              />
                                                                                          </Col>
                                                                                          <Col
                                                                                              sm={11}
                                                                                              m={11}
                                                                                              lg={11}
                                                                                              className='datasetLinked'
                                                                                          >
                                                                                              {relation.type === 'gatewaylink' ? (
                                                                                                  <span>
                                                                                                      <a
                                                                                                          href={'/dataset/' + relation.id}
                                                                                                          target='_blank'
                                                                                                          rel='noopener noreferrer'
                                                                                                          className='gray800-14-bold pointer overflowWrap'
                                                                                                      >
                                                                                                          {relation.title}
                                                                                                      </a>
                                                                                                  </span>
                                                                                              ) : relation.type === 'externallink' ? (
                                                                                                  <Linkify
                                                                                                      componentDecorator={
                                                                                                          componentDecorator
                                                                                                      }
                                                                                                  >
                                                                                                      {relation.title}
                                                                                                  </Linkify>
                                                                                              ) : (
                                                                                                  <span className='gray800-14-bold overflowWrap'>
                                                                                                      {relation.title}
                                                                                                  </span>
                                                                                              )}
                                                                                          </Col>
                                                                                      </Row>
                                                                                      <Row>
                                                                                          <Col sm={1} m={1} lg={1} />
                                                                                          <Col
                                                                                              sm={11}
                                                                                              m={11}
                                                                                              lg={11}
                                                                                              className='datasetLinked'
                                                                                          >
                                                                                              <span className='gray800-14'>
                                                                                                  {relation.info}
                                                                                              </span>
                                                                                          </Col>
                                                                                      </Row>
                                                                                  </Col>
                                                                                  <Col sm={3} m={3} lg={3}>
                                                                                      {relation.type === 'text' ? (
                                                                                          <Button
                                                                                              variant='white'
                                                                                              href={'/search?search=' + relation.title}
                                                                                              target='_blank'
                                                                                              className='gatewaySearchButton floatRightLinkedDataset'
                                                                                          >
                                                                                              Search on gateway
                                                                                          </Button>
                                                                                      ) : (
                                                                                          ''
                                                                                      )}
                                                                                  </Col>
                                                                              </Row>
                                                                          </div>
                                                                      </Col>
                                                                  </Row>
                                                              );
                                                          })}

                                                    {!showAllLinkedDatasets && linkedDatasets.length > 10 ? (
                                                        <Row className='pixelGapTop text-center'>
                                                            <Col sm={12} className='purple-14'>
                                                                <div className='rectangle'>
                                                                    <span
                                                                        onClick={() => this.showAllLinkedDatasets()}
                                                                        style={{ cursor: 'pointer' }}
                                                                    >
                                                                        Show all linked datasets
                                                                    </span>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ) : (
                                                        ''
                                                    )}
                                                </Fragment>
                                            ) : (
                                                ''
                                            )}

                                            {!isEmpty(v2data) ? (
                                                <>
                                                    <Row>
                                                        <Col sm={12} lg={12} className='gray800-14 datasetEmptyInfo'>
                                                            Data custodians are responsible for providing information about each dataset.
                                                            Not all fields have been completed in this case. We hide empty fields to make
                                                            the page easier to read, but you can choose to view them.
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col sm={12} lg={12} className='centerText'>
                                                            <Button
                                                                onClick={() => this.showHideAllEmpty()}
                                                                variant='medium'
                                                                className='datasetEmptyButton dark-14 mr-2'
                                                            >
                                                                {showEmpty === false
                                                                    ? `Show all empty fields (${emptyFieldsCount})`
                                                                    : `Hide all empty fields (${emptyFieldsCount})`}
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                </>
                                            ) : (
                                                ''
                                            )}
                                        </Tab>

                                        <Tab
                                            eventKey='Technical details'
                                            title={
                                                this.state.datasetHasCohortProfiling ? (
                                                    <span style={{ display: 'flex' }}>
                                                        <GoldStar
                                                            fill={'#f98e2b'}
                                                            height='16'
                                                            width='16'
                                                            viewBox='0 0 21 21'
                                                            className='mr-2'
                                                        />{' '}
                                                        Technical details
                                                    </span>
                                                ) : (
                                                    `Technical details`
                                                )
                                            }
                                        >
                                            {dataClassOpen === -1 ? (
                                                <Fragment>
                                                    {this.state.isCohortDiscovery ? <CohortDiscoveryBanner userProps={userState[0]} /> : ''}
                                                    <Col sm={12} lg={12} className='subHeader gray800-14-bold pad-bottom-24 pad-top-24'>
                                                        <span className='black-16-semibold mr-3'>Data Classes</span>
                                                        <span onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover}>
                                                            {this.state.isHovering ? <InfoFillSVG /> : <InfoSVG />}
                                                        </span>

                                                        {this.state.isHovering && (
                                                            <div className='dataClassToolTip'>
                                                                <span className='white-13-semibold'>
                                                                    A Dataset contains a number of Data Classes: groupings or collections of
                                                                    data points that share some common context: for example appearing in the
                                                                    same table of a database, or the same section in a form. A data class
                                                                    has a name, a description, some aliases, and may contain further (sub-)
                                                                    data classes.
                                                                </span>
                                                            </div>
                                                        )}
                                                    </Col>

                                                    <Row style={{ width: '-webkit-fill-available' }}>
                                                        <Col
                                                            sm={12}
                                                            lg={12}
                                                            className={
                                                                technicalMetadata && technicalMetadata.length > 0
                                                                    ? 'margin-left-15 width-100'
                                                                    : 'width-100'
                                                            }
                                                        >
                                                            {technicalMetadata && technicalMetadata.length > 0 ? (
                                                                technicalMetadata.map((techMetadata, index) => (
                                                                    <TechnicalMetadata
                                                                        key={`techMetadata-${index}`}
                                                                        technicalMetadata={techMetadata}
                                                                        index={index}
                                                                        doUpdateDataClassOpen={this.doUpdateDataClassOpen}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <MessageNotFound word='technical details' />
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Fragment>
                                            ) : (
                                                <Row style={{ width: '-webkit-fill-available' }}>
                                                    <Col sm={12} lg={12}>
                                                        <TechnicalDetailsPage
                                                            datasetID={this.props.match.params.datasetID}
                                                            technicalMetadata={technicalMetadata[dataClassOpen]}
                                                            doUpdateDataClassOpen={this.doUpdateDataClassOpen}
                                                        />
                                                    </Col>
                                                </Row>
                                            )}
                                        </Tab>

                                        <Tab eventKey='Data utility' title={`Data utility`}>
                                            <Row className='mt-2'>
                                                <Col sm={12}>
                                                    <div className='rectangle pad-bottom-16'>
                                                        <Row>
                                                            <Col sm={12} lg={12} className='pad-left-14'>
                                                                <span className='pad-top-24 pad-bottom-16  gray800-14-bold mr-3'>
                                                                    Data utility
                                                                </span>

                                                                <DataUtitlityFramework />
                                                            </Col>
                                                        </Row>

                                                        <Row className='mt-3'>
                                                            <Col sm={12} className='gray-deep-14'>
                                                                <span className='gray-deep-14'>
                                                                    The Data Utility Framework scores datasets on 5 categories and a range
                                                                    of dimensions, and is used to refer to the usefulness of a dataset for a
                                                                    given purpose. This framework enables:
                                                                </span>
                                                                <ul className='gray-deep-14 margin-top-8'>
                                                                    <li>
                                                                        Data custodians to communicate the utility of their dataset, and
                                                                        improvements made in the dataset
                                                                    </li>
                                                                    <li>
                                                                        Users to identify datasets that meet the minimum requirements for
                                                                        their specific purpose
                                                                    </li>
                                                                    <li>
                                                                        Systems leaders and funders to identify where to invest in data
                                                                        utility improvements, and to evaluate what improvements have
                                                                        happened as a result of their investments
                                                                    </li>
                                                                </ul>
                                                                <span>
                                                                    Some datasets will not yet have a data utility rating and some may only
                                                                    have a rating for metadata richness.
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <DataQuality datasetUtility={data.datasetfields.datautility} />
                                                </Col>
                                            </Row>
                                        </Tab>

                                        <Tab eventKey='Discussion' title={`Discussion (${discoursePostCount})`}>
                                            <DiscourseTopic
                                                toolId={data.id}
                                                topicId={data.discourseTopicId || 0}
                                                userState={userState}
                                                onUpdateDiscoursePostCount={this.updateDiscoursePostCount}
                                            />
                                        </Tab>

                                        <Tab eventKey='Related resources' title={'Related resources (' + relatedObjects.length + ')'}>
                                            <>
                                                <Row>
                                                    <Col lg={8}>
                                                        <span className='collectionsSearchBar form-control'>
                                                            <span className='collectionsSearchIcon'>
                                                                <SVGIcon
                                                                    name='searchicon'
                                                                    width={20}
                                                                    height={20}
                                                                    fill={'#2c8267'}
                                                                    stroke='none'
                                                                    type='submit'
                                                                />
                                                            </span>
                                                            <span>
                                                                <input
                                                                    id='collectionsSearchBarInput'
                                                                    type='text'
                                                                    placeholder='Search within related resources'
                                                                    onChange={this.onRelatedObjectsSearch}
                                                                    value={relatedObjectsSearchValue}
                                                                    onKeyDown={this.doRelatedObjectsSearch}
                                                                />
                                                            </span>
                                                        </span>
                                                    </Col>

                                                    <Col lg={4} className='text-right'>
                                                        <Dropdown className='sorting-dropdown' alignRight onSelect={this.handleSort}>
                                                            <Dropdown.Toggle
                                                                variant='info'
                                                                id='dropdown-menu-align-right'
                                                                className='gray800-14'
                                                            >
                                                                {(() => {
                                                                    if (sorting !== 'showAll')
                                                                        return `Show ${
                                                                            sorting === 'dataUseRegister'
                                                                                ? `data uses`
                                                                                : sorting === 'people'
                                                                                ? sorting
                                                                                : `${sorting}s`
                                                                        } (
																	${relatedResourcesSort.filter(dat => dat.objectType === sorting).length})`;
                                                                    else return `Show all resources (${relatedResourcesSort.length})`;
                                                                })()}
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Row
                                                                    key={`ddl-item-showall`}
                                                                    className={
                                                                        sorting === 'showAll'
                                                                            ? 'sort-dropdown-item sort-dropdown-item-selected sortingDropdown'
                                                                            : 'sort-dropdown-item sortingDropdown'
                                                                    }
                                                                >
                                                                    <Col xs={12} className='p-0'>
                                                                        <Dropdown.Item eventKey={'showAll'} className='gray800-14'>
                                                                            Show all resources ({relatedResourcesSort.length})
                                                                        </Dropdown.Item>
                                                                    </Col>
                                                                    <div className='p-0 sortingCheckmark'>
                                                                        {sorting === 'showAll' ? (
                                                                            <SVGIcon
                                                                                name='check'
                                                                                width={20}
                                                                                height={20}
                                                                                visble='true'
                                                                                style={{
                                                                                    float: 'right',
                                                                                    fill: '#3db28c',
                                                                                    marginTop: '5px',
                                                                                }}
                                                                                fill={'#3db28c'}
                                                                                stroke='none'
                                                                            />
                                                                        ) : null}
                                                                    </div>
                                                                </Row>
                                                                {['dataset', 'tool', 'dataUseRegister', 'paper', 'course', 'person'].map(
                                                                    item => {
                                                                        return relatedResourcesSort.filter(dat => dat.objectType === item)
                                                                            .length > 0 ? (
                                                                            <Row
                                                                                key={`ddl-item-${item}`}
                                                                                className={
                                                                                    sorting === item
                                                                                        ? 'sort-dropdown-item sort-dropdown-item-selected sortingDropdown'
                                                                                        : 'sort-dropdown-item sortingDropdown'
                                                                                }
                                                                            >
                                                                                <Col xs={12} className='p-0'>
                                                                                    <Dropdown.Item eventKey={item} className='gray800-14'>
                                                                                        Show{' '}
                                                                                        {item === 'dataUseRegister'
                                                                                            ? `data uses`
                                                                                            : item === 'people'
                                                                                            ? item
                                                                                            : `${item}s`}{' '}
                                                                                        (
                                                                                        {
                                                                                            relatedResourcesSort.filter(
                                                                                                dat => dat.objectType === item
                                                                                            ).length
                                                                                        }
                                                                                        )
                                                                                    </Dropdown.Item>
                                                                                </Col>
                                                                                <div className='p-0 sortingCheckmark'>
                                                                                    {sorting === item ? (
                                                                                        <SVGIcon
                                                                                            name='check'
                                                                                            width={20}
                                                                                            height={20}
                                                                                            visble='true'
                                                                                            style={{
                                                                                                float: 'right',
                                                                                                fill: '#3db28c',
                                                                                                marginTop: '5px',
                                                                                            }}
                                                                                            fill={'#3db28c'}
                                                                                            stroke='none'
                                                                                        />
                                                                                    ) : null}
                                                                                </div>
                                                                            </Row>
                                                                        ) : (
                                                                            ''
                                                                        );
                                                                    }
                                                                )}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Col>
                                                </Row>
                                                {relatedObjectsFiltered.length <= 0 ? (
                                                    <MessageNotFound word='related resources' />
                                                ) : (
                                                    relatedObjectsFiltered.map((object, index) => (
                                                        <span key={index}>
                                                            <RelatedObject
                                                                relatedObject={object}
                                                                objectType={object.objectType}
                                                                activeLink={true}
                                                                showRelationshipAnswer={true}
                                                                datasetPublisher={object.datasetPublisher}
                                                                datasetLogo={object.datasetLogo}
                                                            />
                                                        </span>
                                                    ))
                                                )}
                                            </>
                                        </Tab>

                                        <Tab eventKey='Collections' title={'Collections (' + collections.length + ')'}>
                                            {!collections || collections.length <= 0 ? (
                                                <MessageNotFound text='This dataset has not been featured on any collections yet.' />
                                            ) : (
                                                <>
                                                    <MessageNotFound text='This dataset appears on the collections below. A collection can be a group of resources on the same theme or a Trusted Research Environment where this dataset can be accessed.' />

                                                    <Row>
                                                        {collections.map(collection => (
                                                            <Col sm={12} md={12} lg={6} className='flexCenter'>
                                                                <CollectionCard data={collection} />
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                </>
                                            )}
                                        </Tab>
                                    </Tabs>
                                </div>
                            </Col>
                            <Col sm={1} />
                        </Row>
                    </Container>

                    <SideDrawer open={showDrawer} closed={this.toggleDrawer}>
                        <UserMessages
                            userState={userState[0]}
                            closed={this.toggleDrawer}
                            toggleModal={this.toggleModal}
                            drawerIsOpen={showDrawer}
                            topicContext={this.topicContext}
                            is5Safes={data.is5Safes}
                        />
                    </SideDrawer>

                    <ActionBar userState={userState} showOverride={true}>
                        <ResourcePageButtons data={data} userState={userState} exportCitation={this.exportCitation} />
                    </ActionBar>

                    <DataSetModal
                        open={showModal}
                        closed={this.toggleModal}
                        context={this.topicContext}
                        userState={userState[0]}
                        showLoginModal={() => {
                            this.showLoginModal(this.state.data.name);
                        }}
                        is5Safes={data.is5Safes}
                    />

                    <CommunicateDataCustodianModal open={showCustodianModal} closed={this.toggleCustodianModal} />
                </Fragment>
            </Sentry.ErrorBoundary>
        );
    }
}

export default DatasetDetail;
