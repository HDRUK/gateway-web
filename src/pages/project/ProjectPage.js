import { createRef, useState, useEffect } from 'react';

import axios from 'axios';
import * as Sentry from '@sentry/react';
import _ from 'lodash';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

import { generalUtils } from 'utils';
import { LayoutContent, Alert, RenderMarkdown } from 'components';
import SVGIcon from '../../images/SVGIcon';
import googleAnalytics from '../../tracking';

import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import MessageNotFound from '../commonComponents/MessageNotFound';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import Uploader from '../commonComponents/Uploader';
import DiscourseTopic from '../discourse/DiscourseTopic';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import ErrorModal from '../commonComponents/errorModal';
import CollectionCard from '../commonComponents/collectionCard/CollectionCard';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';

const baseURL = require('../commonComponents/BaseURL').getURL();

export const ProjectDetail = props => {
    const [id] = useState('');
    const [projectData, setProjectData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [projectAdded, setProjectAdded] = useState(false);
    const [projectEdited, setProjectEdited] = useState(false);
    const [searchString, setSearchString] = useState('');
    const [relatedObjects, setRelatedObjects] = useState([]);
    const [discoursePostCount, setDiscoursePostCount] = useState(0);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [context, setContext] = useState({});
    const [collections, setCollections] = useState([]);
    const [searchBar] = useState(createRef());
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

    // componentDidMount - on loading of project detail page
    useEffect(() => {
        if (window.location.search) {
            const values = generalUtils.parseQueryString(window.location.search);
            setProjectAdded(values.projectAdded);
            setProjectEdited(values.projectEdited);
        }
        getProjectDataFromDb();
    }, []);

    // componentDidUpdate - on render of project detail page were id is different
    useEffect(() => {
        if (props.match.params.projectID !== id && id !== '' && !isLoading) {
            getProjectDataFromDb();
        }
    });

    const getProjectDataFromDb = () => {
        setIsLoading(true);
        axios
            .get(`${baseURL}/api/v1/projects/${props.match.params.projectID}`)
            .then(async res => {
                if (_.isNil(res.data)) {
                    window.localStorage.setItem('redirectMsg', `Project not found for Id: ${props.match.params.projectID}`);
                    props.history.push({ pathname: '/search?search=', search: '' });
                } else {
                    const localProjectData = res.data.data[0];
                    document.title = localProjectData.name.trim();

                    const counter = !localProjectData.counter ? 1 : localProjectData.counter + 1;
                    updateCounter(props.match.params.projectID, counter);

                    if (!_.isUndefined(localProjectData.relatedObjects)) {
                        const localAdditionalObjInfo = await getAdditionalObjectInfo(localProjectData.relatedObjects);
                        await populateRelatedObjects(localProjectData, localAdditionalObjInfo);
                    }
                    setProjectData(localProjectData);
                    popluateCollections(localProjectData);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const popluateCollections = localProjectData => {
        setIsLoading(true);
        axios.get(`${baseURL}/api/v1/collections/entityid/${localProjectData.id}`).then(res => {
            setCollections(res.data.data || []);
        });
    };

    const doSearch = e => {
        // fires on enter on searchbar
        if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(searchString)}`;
    };

    const updateSearchString = searchString => {
        setSearchString(searchString);
    };

    const updateDiscoursePostCount = count => {
        setDiscoursePostCount(count);
    };

    const updateCounter = (id, counter) => {
        axios.post(`${baseURL}/api/v1/counter/update`, { id, counter });
    };

    const getAdditionalObjectInfo = async additionalObjInfo => {
        const tempObjects = [];
        if (additionalObjInfo) {
            const promises = additionalObjInfo.map(async (object, index) => {
                if (object.objectType === 'course') {
                    await axios.get(`${baseURL}/api/v1/relatedobject/course/${object.objectId}`).then(res => {
                        tempObjects.push({
                            id: object.objectId,
                            activeflag: res.data.data[0].activeflag,
                        });
                    });
                } else {
                    await axios.get(`${baseURL}/api/v1/relatedobject/${object.objectId}`).then(res => {
                        let datasetPublisher;
                        let datasetLogo;

                        !_.isEmpty(res.data.data[0].datasetv2) && _.has(res.data.data[0], 'datasetv2.summary.publisher.name')
                            ? (datasetPublisher = res.data.data[0].datasetv2.summary.publisher.name)
                            : (datasetPublisher = '');

                        !_.isEmpty(res.data.data[0].datasetv2) && _.has(res.data.data[0], 'datasetv2.summary.publisher.logo')
                            ? (datasetLogo = res.data.data[0].datasetv2.summary.publisher.logo)
                            : (datasetLogo = '');

                        tempObjects.push({
                            id: object.objectId,
                            authors: res.data.data[0].authors,
                            activeflag: res.data.data[0].activeflag,
                            datasetPublisher,
                            datasetLogo,
                        });
                    });
                }
            });
            await Promise.all(promises);
        }
        return tempObjects;
    };

    const populateRelatedObjects = (localProjectData, localAdditionalObjInfo) => {
        const tempRelatedObjects = [];
        if (localProjectData.relatedObjects && localAdditionalObjInfo) {
            localProjectData.relatedObjects.map(object =>
                localAdditionalObjInfo.forEach(item => {
                    if (object.objectId === item.id && item.activeflag === 'active') {
                        object.datasetPublisher = item.datasetPublisher;
                        object.datasetLogo = item.datasetLogo;

                        tempRelatedObjects.push(object);
                    }

                    if (object.objectId === item.id && item.activeflag === 'review' && item.authors.includes(userState[0].id)) {
                        tempRelatedObjects.push(object);
                    }
                })
            );
        }
        setRelatedObjects(tempRelatedObjects);
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

    if (isLoading) {
        return (
            <Container>
                <Loading />
            </Container>
        );
    }

    if (projectData.relatedObjects === null || typeof projectData.relatedObjects === 'undefined') {
        projectData.relatedObjects = [];
    }

    return (
        <Sentry.ErrorBoundary fallback={<ErrorModal />}>
            <div>
                <SearchBar
                    ref={searchBar}
                    searchString={searchString}
                    doSearchMethod={doSearch}
                    doUpdateSearchString={updateSearchString}
                    doToggleDrawer={toggleDrawer}
                    userState={userState}
                />
                <Container className='margin-bottom-48'>
                    {projectAdded && (
                        <LayoutContent>
                            <Alert variant='success' mt={3}>
                                Done! Someone will review your project and let you know when it goes live
                            </Alert>
                        </LayoutContent>
                    )}

                    {projectEdited && (
                        <LayoutContent>
                            <Alert variant='success' mt={3}>
                                Done! Your project has been updated
                            </Alert>
                        </LayoutContent>
                    )}

                    {projectData.activeflag === 'review' && (
                        <LayoutContent>
                            <Alert variant='warning' mt={3}>
                                Your project is pending review. Only you can see this page.
                            </Alert>
                        </LayoutContent>
                    )}

                    <Row className='mt-4'>
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <div className='rectangle'>
                                <Row>
                                    <Col data-testid='project-name' className='line-height-normal'>
                                        <span className='black-16'>{projectData.name}</span>
                                    </Col>
                                </Row>
                                <Row className='margin-top-16'>
                                    <Col xs={12}>
                                        <span className='badge-project'>
                                            <SVGIcon
                                                name='newestprojecticon'
                                                fill='#472505'
                                                className='badgeSvg mr-2'
                                                viewBox='-2 -2 22 22'
                                            />
                                            <span>Project</span>
                                        </span>

                                        {!_.isNil(projectData.categories) && (
                                            <a href={`/search?search=&tab=Projects&projectcategories=${projectData.categories.category}`}>
                                                <div className='badge-tag'>{projectData.categories.category}</div>
                                            </a>
                                        )}
                                    </Col>
                                </Row>

                                <Row className='margin-top-20'>
                                    <Col xs={12} className='line-height-normal'>
                                        <span className='gray700-14'>
                                            {projectData.counter === undefined ? 1 : projectData.counter + 1}
                                            {projectData.counter === undefined ? ' view' : ' views'}
                                        </span>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col sm={1} lg={10} />
                    </Row>

                    <Row>
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <div>
                                <Tabs
                                    className='tabsBackground gray700-13 margin-bottom-16'
                                    onSelect={key => {
                                        googleAnalytics.recordVirtualPageView(`${key} tab`);
                                        googleAnalytics.recordEvent('Projects', `Clicked ${key} tab`, `Viewing ${key}`);
                                    }}>
                                    <Tab eventKey='About' title='About'>
                                        <Row className='mt-2'>
                                            <Col sm={12} lg={12}>
                                                <div className='rectangle'>
                                                    <Row className='gray800-14-bold'>
                                                        <Col sm={12}>Description</Col>
                                                    </Row>
                                                    <Row className='mt-3'>
                                                        <Col
                                                            sm={12}
                                                            className='gray800-14 hdruk-section-body'
                                                            data-testid='project-description'>
                                                            <RenderMarkdown source={projectData.description} />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>

                                        {!_.isEmpty(projectData.resultsInsights) ? (
                                            <Row className='mt-2'>
                                                <Col sm={12} lg={12}>
                                                    <div className='rectangle'>
                                                        <Row className='gray800-14-bold'>
                                                            <Col sm={12}>Results/Insights</Col>
                                                        </Row>
                                                        <Row className='mt-3'>
                                                            <Col
                                                                sm={12}
                                                                className='gray800-14 hdruk-section-body'
                                                                data-testid='project-results'>
                                                                <RenderMarkdown source={projectData.resultsInsights} />
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : (
                                            ''
                                        )}

                                        <Row className='mt-2'>
                                            <Col sm={12}>
                                                <div className='rectangle'>
                                                    <Row className='gray800-14-bold'>
                                                        <Col sm={12}>Details</Col>
                                                    </Row>
                                                    <Row className='mt-3'>
                                                        <Col sm={2} className='gray800-14'>
                                                            URL
                                                        </Col>
                                                        <Col sm={10} data-testid='link' className='gray800-14'>
                                                            <a
                                                                href={projectData.link}
                                                                rel='noopener noreferrer'
                                                                target='_blank'
                                                                className='purple-14 text-break'>
                                                                {projectData.link}
                                                            </a>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-2'>
                                                        <Col sm={2} className='gray800-14'>
                                                            Last update
                                                        </Col>
                                                        <Col sm={10} className='gray800-14'>
                                                            {moment(projectData.updatedon).format('DD MMM YYYY')}
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-3'>
                                                        <Col sm={2}>
                                                            <span className='gray800-14'>Uploaders</span>
                                                        </Col>
                                                        <Col sm={10} className='gray800-14 overflowWrap'>
                                                            {projectData.persons.map(uploader => (
                                                                <span key={uploader.id}>
                                                                    <Uploader key={uploader.id} uploader={uploader} />
                                                                </span>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                    {projectData.authorsNew ? (
                                                        <Row className='mt-2'>
                                                            <Col sm={2}>
                                                                <span className='gray800-14'>Collaborators</span>
                                                            </Col>
                                                            <Col sm={10} className='gray800-14 overflowWrap' data-testid='project-authors'>
                                                                {projectData.authorsNew}
                                                            </Col>
                                                        </Row>
                                                    ) : (
                                                        ''
                                                    )}
                                                    {projectData.leadResearcher ? (
                                                        <Row className='mt-2'>
                                                            <Col sm={2}>
                                                                <span className='gray800-14'>Lead researcher</span>
                                                            </Col>
                                                            <Col
                                                                sm={10}
                                                                className='gray800-14 overflowWrap'
                                                                data-testid='project-leadResearcher'>
                                                                {projectData.leadResearcher}
                                                            </Col>
                                                        </Row>
                                                    ) : (
                                                        ''
                                                    )}
                                                    <Row className='mt-2'>
                                                        <Col sm={2} className='gray800-14'>
                                                            Type
                                                        </Col>
                                                        <Col sm={10} className='gray800-14' data-testid='project-type'>
                                                            <a
                                                                href={`/search?search=&tab=Projects&projectcategories=${projectData.categories.category}`}>
                                                                <div className='badge-tag'>{projectData.categories.category}</div>
                                                            </a>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-2'>
                                                        <Col sm={2} className='gray800-14'>
                                                            Keywords
                                                        </Col>
                                                        <Col sm={10} className='gray800-14'>
                                                            {!projectData.tags.features || projectData.tags.features.length <= 0 ? (
                                                                <span className='gray800-14-opacity'>Not specified</span>
                                                            ) : (
                                                                projectData.tags.features.map((keyword, i) => {
                                                                    return (
                                                                        <a
                                                                            href={`/search?search=&tab=Projects&projectfeatures=${keyword}`}
                                                                            data-testid={`keywords-${i}`}>
                                                                            <div className='badge-tag'>{keyword}</div>
                                                                        </a>
                                                                    );
                                                                })
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-2'>
                                                        <Col sm={2} className='gray800-14'>
                                                            Domain
                                                        </Col>
                                                        <Col sm={10} className='gray800-14'>
                                                            {!projectData.tags.topics || projectData.tags.topics.length <= 0 ? (
                                                                <span className='gray800-14-opacity'>Not specified</span>
                                                            ) : (
                                                                projectData.tags.topics.map((domain, i) => {
                                                                    return (
                                                                        <a
                                                                            href={`/search?search=&tab=Projects&projecttopics=${domain}`}
                                                                            data-testid={`domain-${i}`}>
                                                                            <div className='badge-tag'>{domain}</div>
                                                                        </a>
                                                                    );
                                                                })
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Tab>

                                    <Tab eventKey='Discussion' title={`Discussion (${discoursePostCount})`}>
                                        <DiscourseTopic
                                            toolId={projectData.id}
                                            topicId={projectData.discourseTopicId || 0}
                                            userState={userState}
                                            onUpdateDiscoursePostCount={updateDiscoursePostCount}
                                        />
                                    </Tab>
                                    <Tab eventKey='Related resources' title={`Related resources (${relatedObjects.length})`}>
                                        {relatedObjects.length <= 0 ? (
                                            <MessageNotFound word='related resources' />
                                        ) : (
                                            relatedObjects.map(object => (
                                                <RelatedObject
                                                    relatedObject={object}
                                                    objectType={object.objectType}
                                                    activeLink
                                                    showRelationshipAnswer
                                                    datasetPublisher={object.datasetPublisher}
                                                    datasetLogo={object.datasetLogo}
                                                />
                                            ))
                                        )}
                                    </Tab>
                                    <Tab eventKey='Collections' title={`Collections (${collections.length})`}>
                                        {!collections || collections.length <= 0 ? (
                                            <MessageNotFound text='This project has not been featured on any collections yet.' />
                                        ) : (
                                            <>
                                                <MessageNotFound text='This project appears on the collections below. A collection is a group of resources on the same theme.' />

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
                        <Col sm={1} lg={1} />
                    </Row>
                </Container>

                <SideDrawer open={showDrawer} closed={toggleDrawer}>
                    <UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
                </SideDrawer>

                <ActionBar userState={userState}>
                    <ResourcePageButtons data={projectData} userState={userState} />
                </ActionBar>

                <DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
            </div>
        </Sentry.ErrorBoundary>
    );
};

export default ProjectDetail;
