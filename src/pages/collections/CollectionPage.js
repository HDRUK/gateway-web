import * as Sentry from '@sentry/react';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Pagination, Row, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import 'react-tabs/style/react-tabs.css';
import { LayoutContent } from '../../components/Layout';
import LayoutBox from '../../components/LayoutBox';
import SearchControls from '../../components/SearchControls';
import SVGIcon from '../../images/SVGIcon';
import collectionsService from '../../services/collections';
import googleAnalytics from '../../tracking';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import Loading from '../commonComponents/Loading';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DiscourseTopic from '../discourse/DiscourseTopic';
import { filterCollectionItems, generateDropdownItems, generatePaginatedItems } from './collection.utils';
import { sortByMetadataQuality, sortByPopularity, sortByRecentlyAdded, sortByRelevance, sortByResources } from './collection.utils.sort';
import './Collections.scss';
import CourseCollectionResults from './Components/CourseCollectionResults';
import DatasetCollectionResults from './Components/DatasetCollectionResults';
import DataUseCollectionResults from './Components/DataUseCollectionResults';
import PaperCollectionResults from './Components/PaperCollectionResults';
import PersonCollectionResults from './Components/PersonCollectionResults';
import ToolCollectionResults from './Components/ToolCollectionResults';
import MessageNotFound from '../commonComponents/MessageNotFound';
import { MAXRESULTS } from './constants';

export const CollectionPage = props => {
    const { t } = useTranslation();

    const [collectionData, setCollectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isResultsLoading, setIsResultsLoading] = useState(true);
    const [toolCount, setToolCount] = useState(0);
    const [datasetCount, setDatasetCount] = useState(0);
    const [personCount, setPersonCount] = useState(0);
    const [dataUseRegisterCount, setDataUseRegisterCount] = useState(0);
    const [paperCount, setPaperCount] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [datasetIndex, setDatasetIndex] = useState(0);
    const [toolIndex, setToolIndex] = useState(0);
    const [paperIndex, setPaperIndex] = useState(0);
    const [dataUseRegisterIndex, setDataUseRegisterIndex] = useState(0);
    const [personIndex, setPersonIndex] = useState(0);
    const [courseIndex, setCourseIndex] = useState(0);
    const [collectionAdded, setCollectionAdded] = useState(false);
    const [collectionEdited, setCollectionEdited] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [sort, setSort] = useState('recentlyadded');
    const [discoursePostCount, setDiscoursePostCount] = useState(0);
    const [key, setKey] = useState('dataset');
    const [searchBar] = useState(React.createRef());
    const [showDrawer, setShowDrawer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [context, setContext] = useState({});
    const [objectData, setObjectData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
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

    useEffect(() => {
        if (window.location.search) {
            const values = queryString.parse(window.location.search);
            setCollectionAdded(values.collectionAdded);
            setCollectionEdited(values.collectionEdited);
        }
        getCollectionDataFromApi();
    }, []);

    const getCollectionDataFromApi = async () => {
        setIsLoading(true);
        await collectionsService.getCollectionRequest(props.match.params.collectionID).then(async res => {
            if (_.isNil(res.data)) {
                // Redirect user if invalid collection id is supplied
                window.localStorage.setItem('redirectMsg', `Collection not found for Id: ${props.match.params.collectionID}`);
                props.history.push({ pathname: '/search?search=', search: '' });
            } else {
                const localCollectionData = res.data.data[0];
                const counter = !localCollectionData.counter ? 1 : localCollectionData.counter + 1;
                collectionsService.postCollectionCounterUpdateRequest({ id: props.match.params.collectionID, counter });

                setCollectionData(res.data.data[0]);
                getObjectData();
                setIsLoading(false);
            }
        });
    };

    const getObjectData = async () => {
        await collectionsService.getCollectionRelatedObjectsRequest(props.match.params.collectionID).then(async res => {
            setObjectData(res.data.data);
            setFilteredData(res.data.data);
            countEntities(res.data.data);
        });
        setIsResultsLoading(false);
    };

    const countEntities = filteredData => {
        const entityCounts = filteredData.reduce((entityCountsByType, currentValue) => {
            const { type } = currentValue;
            if (!entityCountsByType.hasOwnProperty(type)) {
                entityCountsByType[type] = 0;
            }
            entityCountsByType[type]++;
            return entityCountsByType;
        }, {});

        let key;
        if (entityCounts.dataset > 0) {
            key = 'dataset';
        } else if (entityCounts.tool > 0) {
            key = 'tool';
        } else if (entityCounts.paper > 0) {
            key = 'paper';
        } else if (entityCounts.dataUseRegister > 0) {
            key = 'dataUseRegister';
        } else if (entityCounts.person > 0) {
            key = 'person';
        } else if (entityCounts.course > 0) {
            key = 'course';
        }
        setKey(key);

        setToolCount(entityCounts.tool || 0);
        setPersonCount(entityCounts.person || 0);
        setDatasetCount(entityCounts.dataset || 0);
        setPaperCount(entityCounts.paper || 0);
        setDataUseRegisterCount(entityCounts.dataUseRegister || 0);
        setCourseCount(entityCounts.course || 0);
    };

    const updateDiscoursePostCount = count => {
        setDiscoursePostCount(count);
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

    const getSortedData = (sort, data, value) => {
        switch (sort) {
            case 'metadata': {
                return sortByMetadataQuality(data);
            }
            case 'recentlyadded': {
                return sortByRecentlyAdded(data);
            }
            case 'resources': {
                return sortByResources(data);
            }
            case 'relevance': {
                return sortByRelevance(data, value);
            }
            case 'popularity': {
                return sortByPopularity(data);
            }
            default:
                return data;
        }
    };

    const handleSort = React.useCallback(({ value }, submitForm) => {
        submitForm();

        setSort(value);

        googleAnalytics.recordEvent('Collections', `Sorted collection entities by ${value}`, 'Sort dropdown option changed');
    }, []);

    const handleReset = React.useCallback(() => {
        setSort('recentlyadded');
        setSearchString('');

        doCollectionsSearch({
            search: '',
            sortyBy: 'recentlyadded',
        });
    }, [key, objectData]);

    const handleKeyDownEnter = React.useCallback(submitForm => {
        submitForm();
    }, []);

    const handlePaginatedItems = index => {
        const paginatedItems = _.chunk(
            filteredData.filter(object => object.type === key),
            24
        );

        if (paginatedItems.length > 0) {
            return paginatedItems[index];
        }
        return [];
    };

    const doCollectionsSearch = React.useCallback(
        ({ search, sortBy }) => {
            const filteredCollectionItems = filterCollectionItems(objectData, search);

            const tempFilteredData = filteredCollectionItems.filter(dat => dat !== '');

            setFilteredData(getSortedData(sortBy, tempFilteredData, search));

            countEntities(filteredCollectionItems);
            handlePagination(key, 0);
        },
        [key, objectData]
    );

    const setIndexByType = page => ({
        dataset: () => setDatasetIndex(page),
        tool: () => setToolIndex(page),
        dataUseRegister: () => setDataUseRegisterIndex(page),
        paper: () => setPaperIndex(page),
        person: () => setPersonIndex(page),
        course: () => setCourseIndex(page),
    });

    const handlePagination = (type, page) => {
        setIndexByType(page)[type]();
        window.scrollTo(0, 0);
    };

    const datasetPaginationItems = generatePaginatedItems('dataset', datasetCount, datasetIndex, handlePagination);
    const toolPaginationItems = generatePaginatedItems('tool', toolCount, toolIndex, handlePagination);
    const dataUseRegisterPaginationItems = generatePaginatedItems(
        'dataUseRegister',
        dataUseRegisterCount,
        dataUseRegisterIndex,
        handlePagination
    );
    const paperPaginationItems = generatePaginatedItems('paper', paperCount, paperIndex, handlePagination);
    const personPaginationItems = generatePaginatedItems('person', personCount, personIndex, handlePagination);
    const coursePaginationItems = generatePaginatedItems('course', courseCount, courseIndex, handlePagination);

    const dropdownItems = generateDropdownItems(key);
    const { relatedObjects } = collectionData;
    const userId = userState[0].id;

    if (isLoading) {
        return (
            <Container>
                <Loading data-testid='outerLoadingSpinner' />
            </Container>
        );
    }

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal />}>
            <div data-testid='collection-container'>
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
                <div className='collectionHeader pixelGapTop pixelGapBottom'>
                    <Container>
                        {collectionAdded ? (
                            <Row>
                                <Col sm={1} lg={1} />
                                <Col sm={10} lg={10} className='pad-left-0'>
                                    <Alert data-test-id='collection-added-banner' variant='success' className='mb-3'>
                                        {collectionData.publicflag ? `${t('collection.public.live')}` : `${t('collection.private.live')}`}
                                    </Alert>
                                </Col>
                                <Col sm={1} lg={10} />
                            </Row>
                        ) : (
                            ''
                        )}

                        {collectionEdited ? (
                            <Row>
                                <Col sm={1} lg={1} />
                                <Col sm={10} lg={10}>
                                    <Alert data-test-id='collection-added-banner' variant='success' className='mb-3'>
                                        {collectionData.publicflag
                                            ? `${t('collection.public.updated')}`
                                            : `${t('collection.private.updated')}`}
                                    </Alert>
                                </Col>
                                <Col sm={1} lg={10} />
                            </Row>
                        ) : (
                            ''
                        )}

                        {collectionData.activeflag === 'archive' ? (
                            <Row>
                                <Col sm={1} lg={1} />
                                <Col sm={10} lg={10}>
                                    <Alert variant='danger' className='mb-3'>
                                        This collection has been archived
                                    </Alert>
                                </Col>
                                <Col sm={1} lg={10} />
                            </Row>
                        ) : (
                            ''
                        )}

                        <Row>
                            <Col md={3} lg={2} />
                            <Col md={6} lg={8} className='flexCenter'>
                                {!collectionData.imageLink || collectionData.imageLink === 'https://' ? (
                                    <div id='defaultCollectionImage' className='margin-right-1' />
                                ) : (
                                    <div id='collectionImage' style={{ backgroundImage: `url(${collectionData.imageLink})` }} />
                                )}
                            </Col>
                            <Col md={2} lg={1} className='privatePublicDisplayCol'>
                                {collectionData.publicflag === true ? (
                                    <div className='privatePublicDisplay'>
                                        <SVGIcon name='eye' width={24} height={24} fill='#000000' className='margin-right-8' />
                                        <span className='deepBlack-14 alignSuper' data-testid='publicBadge'>
                                            Public
                                        </span>
                                    </div>
                                ) : (
                                    <div className='privatePublicDisplay'>
                                        <SVGIcon name='eyeCrossed' width={24} height={24} fill='#000000' className='margin-right-8' />
                                        <span className='deepBlack-14 alignSuper' data-testid='privateBadge'>
                                            Private
                                        </span>
                                    </div>
                                )}
                            </Col>
                            <Col md={1} lg={1} />
                        </Row>
                        <Row>
                            <Col sm={12} lg={12} className='collectionCreatedDate'>
                                <span className='gray700-13' data-testid='collectionCreated'>
                                    {`${t('collection.created')} ${moment(collectionData.createdAt).format('MMM YYYY')}`}
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} lg={12} className='centerText'>
                                <span className='black-28' data-test-id='collectionName'>
                                    {collectionData.name}{' '}
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className='centerText'>
                                {collectionData.persons.map((person, index) => {
                                    if (index > 0) {
                                        return (
                                            <a className='gray800-14' href={`/person/${person.id}`} key={index}>
                                                , {person.firstname} {person.lastname}
                                            </a>
                                        );
                                    }
                                    return (
                                        <a className='gray800-14' href={`/person/${person.id}`} key={index}>
                                            {person.firstname} {person.lastname}
                                        </a>
                                    );
                                })}
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row>
                            <div className='col-sm-12 mt-3 gray800-14 text-center'>
                                {collectionData.counter ? collectionData.counter : 0} views
                            </div>
                        </Row>

                        <Row>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} className='collectionKeywords'>
                                {collectionData.keywords &&
                                    collectionData.keywords.length > 0 &&
                                    collectionData.keywords.map((keyword, index) => (
                                        <a href={`/search?search=&tab=Collections&collectionkeywords=${keyword}`}>
                                            <div className='badge-tag' data-testid={`collectionKeyword${index}`}>
                                                {keyword}
                                            </div>
                                        </a>
                                    ))}
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>

                        <Row className='pad-top-24'>
                            <Col sm={1} lg={1} />
                            <Col sm={10} lg={10} data-test-id='collection-description' className='gray800-14 hdruk-section-body'>
                                <ReactMarkdown source={collectionData.description} data-testid='collectionDescription' />
                            </Col>
                            <Col sm={1} lg={1} />
                        </Row>
                    </Container>
                </div>
            </div>

            <div>
                <Tabs
                    className='tabsBackground gray700-13'
                    activeKey={key}
                    onSelect={key => {
                        setKey(key);
                        googleAnalytics.recordVirtualPageView(`${key} tab`);
                        googleAnalytics.recordEvent('Collections', `Clicked ${key} tab`, `Viewing ${key}`);
                    }}
                    data-testid='collectionPageTabs'
                >
                    <Tab eventKey='dataset' title={`Datasets (${datasetCount})`} />
                    <Tab eventKey='tool' title={`Tools (${toolCount})`} />
                    <Tab eventKey='paper' title={`Papers (${paperCount})`} />
                    <Tab eventKey='dataUseRegister' title={`Data Uses (${dataUseRegisterCount})`} />
                    <Tab eventKey='person' title={`People (${personCount})`} />
                    <Tab eventKey='course' title={`Course (${courseCount})`} />
                    <Tab eventKey='discussion' title={`Discussion (${discoursePostCount})`}>
                        <Container className='resource-card'>
                            <Row>
                                <Col sm={1} lg={1} />
                                <Col sm={10} lg={10}>
                                    <DiscourseTopic
                                        collectionId={collectionData.id}
                                        topicId={collectionData.discourseTopicId || 0}
                                        userState={userState}
                                        onUpdateDiscoursePostCount={updateDiscoursePostCount}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Tab>
                </Tabs>
            </div>

            <Container className='resource-card'>
                {isResultsLoading && (
                    <Row className='width-100'>
                        <Col xs={12} className='noPadding'>
                            <Loading />
                        </Col>
                    </Row>
                )}
                {key !== 'discussion' && (
                    <LayoutContent>
                        <SearchControls
                            onSubmit={doCollectionsSearch}
                            isLoading={isResultsLoading}
                            inputProps={{
                                onChange: setSearchString,
                                onReset: handleReset,
                                onKeyDownEnter: handleKeyDownEnter,
                                value: searchString,
                            }}
                            sortProps={{
                                options: dropdownItems,
                                value: sort,
                                onSort: handleSort,
                            }}
                            type='collection'
                        />
                    </LayoutContent>
                )}
                <Row>
                    <Col sm={1} lg={1} />
                    <Col sm={10} lg={10}>
                        {!key && (
                            <LayoutBox mt={2}>
                                <MessageNotFound />
                            </LayoutBox>
                        )}
                        {key === 'dataset' ? (
                            <DatasetCollectionResults
                                searchResults={handlePaginatedItems(datasetIndex)}
                                relatedObjects={relatedObjects}
                                userId={userId}
                            />
                        ) : null}
                        {key === 'tool' ? (
                            <ToolCollectionResults
                                searchResults={handlePaginatedItems(toolIndex)}
                                relatedObjects={relatedObjects}
                                userId={userId}
                            />
                        ) : null}
                        {key === 'dataUseRegister' ? (
                            <DataUseCollectionResults
                                searchResults={handlePaginatedItems(dataUseRegisterIndex)}
                                relatedObjects={relatedObjects}
                                userId={userId}
                            />
                        ) : null}
                        {key === 'paper' ? (
                            <PaperCollectionResults
                                searchResults={handlePaginatedItems(paperIndex)}
                                relatedObjects={relatedObjects}
                                userId={userId}
                            />
                        ) : null}
                        {key === 'person' ? (
                            <PersonCollectionResults
                                searchResults={handlePaginatedItems(personIndex)}
                                relatedObjects={relatedObjects}
                                userId={userId}
                            />
                        ) : null}
                        {key === 'course' ? (
                            <CourseCollectionResults
                                searchResults={handlePaginatedItems(courseIndex)}
                                relatedObjects={relatedObjects}
                                userId={userId}
                            />
                        ) : null}

                        <div className='text-center'>
                            {key === 'dataset' && datasetCount > MAXRESULTS ? <Pagination>{datasetPaginationItems}</Pagination> : ''}
                            {key === 'tool' && toolCount > MAXRESULTS ? <Pagination>{toolPaginationItems}</Pagination> : ''}
                            {key === 'dataUseRegister' && dataUseRegisterCount > MAXRESULTS ? (
                                <Pagination>{dataUseRegisterPaginationItems}</Pagination>
                            ) : (
                                ''
                            )}
                            {key === 'paper' && paperCount > MAXRESULTS ? <Pagination>{paperPaginationItems}</Pagination> : ''}
                            {key === 'person' && personCount > MAXRESULTS ? <Pagination>{personPaginationItems}</Pagination> : ''}
                            {key === 'course' && courseCount > MAXRESULTS ? <Pagination>{coursePaginationItems}</Pagination> : ''}
                        </div>
                    </Col>
                    <Col sm={1} lg={10} />
                </Row>
            </Container>

            {userState[0].loggedIn &&
                (userState[0].role === 'Admin' || (collectionData.authors && collectionData.authors.includes(userState[0].id))) && (
                    <ActionBar userState={userState}>
                        <ResourcePageButtons data={collectionData} userState={userState} isCollection />
                    </ActionBar>
                )}

            <SideDrawer open={showDrawer} closed={toggleDrawer}>
                <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
            </SideDrawer>

            <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
        </Sentry.ErrorBoundary>
    );
};

export default CollectionPage;
