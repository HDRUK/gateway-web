import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import queryString from 'query-string';
import { Row, Col, Tabs, Tab, Container, Alert, Pagination } from 'react-bootstrap';
import Loading from '../commonComponents/Loading';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import 'react-tabs/style/react-tabs.css';
import DiscourseTopic from '../discourse/DiscourseTopic';
import moment from 'moment';
import _ from 'lodash';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import SVGIcon from '../../images/SVGIcon';
import './Collections.scss';
import CollectionsSearch from './CollectionsSearch';
import googleAnalytics from '../../tracking';
import { getCollectionRequest, postCollectionCounterUpdateRequest, getCollectionRelatedObjectsRequest } from '../../services/collection';
import { generatePaginatedItems } from './collection.utils';

export const CollectionPage = props => {
	const [collectionData, setCollectionData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isResultsLoading, setIsResultsLoading] = useState(true);
	const [toolCount, setToolCount] = useState(0);
	const [datasetCount, setDatasetCount] = useState(0);
	const [personCount, setPersonCount] = useState(0);
	const [projectCount, setProjectCount] = useState(0);
	const [paperCount, setPaperCount] = useState(0);
	const [courseCount, setCourseCount] = useState(0);
	const [datasetIndex, setDatasetIndex] = useState(0);
	const [toolIndex, setToolIndex] = useState(0);
	const [projectIndex, setProjectIndex] = useState(0);
	const [paperIndex, setPaperIndex] = useState(0);
	const [personIndex, setPersonIndex] = useState(0);
	const [courseIndex, setCourseIndex] = useState(0);
	const [collectionAdded, setCollectionAdded] = useState(false);
	const [collectionEdited, setCollectionEdited] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [searchCollectionsString, setCollectionsSearchString] = useState('');
	const [collectionsPageSort, setCollectionsPageSort] = useState('recentlyadded');
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
		if (!!window.location.search) {
			let values = queryString.parse(window.location.search);
			setCollectionAdded(values.collectionAdded);
			setCollectionEdited(values.collectionEdited);
		}
		getCollectionDataFromApi();
	}, []); 

	useEffect(() => {
		handleSort(collectionsPageSort);
	}, [filteredData]);

	const getCollectionDataFromApi = async () => {
		setIsLoading(true);
		await getCollectionRequest(props.match.params.collectionID).then(async res => {
			if (_.isNil(res.data)) {
				// Redirect user if invalid collection id is supplied
				window.localStorage.setItem('redirectMsg', `Collection not found for Id: ${props.match.params.collectionID}`);
				props.history.push({ pathname: '/search?search=', search: '' });
			} else {
				const localCollectionData = res.data.data[0];
				let counter = !localCollectionData.counter ? 1 : localCollectionData.counter + 1;
				updateCounter(props.match.params.collectionID, counter);

				setCollectionData(res.data.data[0]);
				getObjectData();
				setIsLoading(false);
			}
		});
	};

	const updateCounter = (id, counter) => {
		postCollectionCounterUpdateRequest({ id, counter });
	};

	const getObjectData = async () => {
		await getCollectionRelatedObjectsRequest(props.match.params.collectionID).then(async res => {
			setObjectData(res.data.data);
			setFilteredData(res.data.data);
			countEntities(res.data.data);
		});
		setIsResultsLoading(false);
	};

	const countEntities = filteredData => {
		const entityCounts = filteredData.reduce((entityCountsByType, currentValue) => {
			let type = currentValue.type;
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
		} else if (entityCounts.project > 0) {
			key = 'project';
		} else if (entityCounts.person > 0) {
			key = 'person';
		} else if (entityCounts.course > 0) {
			key = 'course';
		}
		setKey(key);

		setToolCount(entityCounts.tool || 0);
		setPersonCount(entityCounts.person || 0);
		setProjectCount(entityCounts.project || 0);
		setDatasetCount(entityCounts.dataset || 0);
		setPaperCount(entityCounts.paper || 0);
		setCourseCount(entityCounts.course || 0);
	};

	const handleSelect = key => {
		setKey(key);
	};

	const doSearch = e => {
		// Fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(searchString)}`;
	};

	const updateSearchString = searchString => {
		setSearchString(searchString);
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

	const handleSort = sort => {
		googleAnalytics.recordEvent('Collections', `Sorted collection entities by ${sort}`, 'Sort dropdown option changed');
		setCollectionsPageSort(sort);
		switch (sort) {
			case 'metadata': {
				sortByMetadataQuality();
				break;
			}
			case 'recentlyadded': {
				sortByRecentlyAdded();
				break;
			}
			case 'resources': {
				sortByResources();
				break;
			}
			case 'relevance': {
				sortByRelevance();
				break;
			}
			case 'popularity': {
				sortByPopularity();
				break;
			}
			default:
				return sort;
		}
	};

	const sortByMetadataQuality = () =>
		filteredData.sort((a, b) =>
			_.has(a, 'datasetfields.metadataquality.quality_score') && _.has(b, 'datasetfields.metadataquality.quality_score')
				? b.datasetfields.metadataquality.quality_score - a.datasetfields.metadataquality.quality_score
				: ''
		);

	const sortByRecentlyAdded = () => {
		return filteredData.sort((a, b) => b.updated - a.updated);
	};

	const sortByResources = () => {
		return filteredData.sort((a, b) => b.relatedresources - a.relatedresources);
	};

	const sortByRelevance = () => {
		filteredData.forEach(function (data) {
			if (data.type === 'course') {
				let containsSearchTermCount =
					getCountOfSearchTerm(data.title) +
					getCountOfSearchTerm(data.description) +
					getCountOfSearchTerm(data.award) +
					getCountOfSearchTerm(data.domains);
				data.searchTermInstances = containsSearchTermCount;
			} else if (data.type === 'person') {
				let containsSearchTermCount =
					getCountOfSearchTerm(data.firstname) + getCountOfSearchTerm(data.lastname) + getCountOfSearchTerm(data.bio);
				data.searchTermInstances = containsSearchTermCount;
			} else if (data.type === 'dataset') {
				let abstractOrDescriptionCount;
				if (_.has(data, 'datasetfields.abstract') && !_.isNull(data.datasetfields.abstract)) {
					abstractOrDescriptionCount = getCountOfSearchTerm(data.datasetfields.abstract);
				} else {
					abstractOrDescriptionCount = getCountOfSearchTerm(data.description);
				}

				let containsSearchTermCount =
					abstractOrDescriptionCount +
					getCountOfSearchTerm(data.name) +
					getCountOfSearchTerm(data.tags.topics) +
					getCountOfSearchTerm(data.tags.features);
				data.searchTermInstances = containsSearchTermCount;
			} else {
				//Other entities ie. Tools, Papers, Projects
				let containsSearchTermCount =
					getCountOfSearchTerm(data.name) +
					getCountOfSearchTerm(data.description) +
					getCountOfSearchTerm(data.tags.topics) +
					getCountOfSearchTerm(data.tags.features) +
					(_.has(data, 'categories.category') && getCountOfSearchTerm(data.categories.category));
				data.searchTermInstances = containsSearchTermCount;
			}
		});

		return filteredData.sort((a, b) => b.searchTermInstances - a.searchTermInstances);
	};

	const getCountOfSearchTerm = field => {
		if (_.isArray(field)) {
			return field.toString().toLowerCase().split(searchCollectionsString.toLowerCase()).length - 1;
		} else {
			return field.toLowerCase().split(searchCollectionsString.toLowerCase()).length - 1;
		}
	};

	const sortByPopularity = () => {
		return filteredData.sort((a, b) => b.counter - a.counter);
	};

	const handlePaginatedItems = index => {
		// Returns the related resources that have the same object type as the current active tab and performs a chunk on them to ensure each page returns 24 results
		let paginatedItems = _.chunk(
			filteredData.filter(object => object.type === key),
			24
		);
		// If there are items to show based on search results, display them on the currently active page
		if (paginatedItems.length > 0) {
			return paginatedItems[index];
		} else {
			return [];
		}
	};

	const doCollectionsSearch = e => {
		// Fires on enter on searchbar
		if (e.key === 'Enter') {
			let filteredCollectionItems = objectData.map(object => {
				// Searching functionality - searches through object data and returns true if there is a match with the search term
				if (
					(_.has(object, 'name') ? object.name.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
					(_.has(object, 'title') ? object.title.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
					(_.has(object, 'firstname') ? object.firstname.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
					(_.has(object, 'lastname') ? object.lastname.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
					(_.has(object, 'bio') ? object.bio.toLowerCase().includes(searchCollectionsString.toLowerCase()) : false) ||
					(_.has(object, 'description') && !_.isNull(object.description)
						? object.description.toLowerCase().includes(searchCollectionsString.toLowerCase())
						: false) ||
					(_.has(object, 'datasetfields.abstract') && !_.isNull(object.datasetfields.abstract)
						? object.datasetfields.abstract.toLowerCase().includes(searchCollectionsString.toLowerCase())
						: false) ||
					(_.has(object, 'tags.features') && object.tags.features && object.tags.features.length > 0
						? new RegExp(object.tags.features.join('|'), 'i').test(searchCollectionsString)
						: false) ||
					(_.has(object, 'tags.topics') && object.tags.topics && object.tags.topics.length > 0
						? new RegExp(object.tags.topics.join('|'), 'i').test(searchCollectionsString)
						: false) ||
					(_.has(object, 'categories.category')
						? object.categories.category.toLowerCase().includes(searchCollectionsString.toLowerCase())
						: false) ||
					(_.has(object, 'award') && object.award && object.award.length > 0
						? new RegExp(object.award.join('|'), 'i').test(searchCollectionsString)
						: false) ||
					(_.has(object, 'domains') && object.domains && object.domains.length > 0
						? new RegExp(object.domains.join('|'), 'i').test(searchCollectionsString)
						: false)
				) {
					return object;
				} else {
					return '';
				}
			});

			let tempFilteredData = filteredCollectionItems.filter(dat => {
				return dat !== '';
			});
			setFilteredData(tempFilteredData);

			countEntities(filteredCollectionItems);
			handlePagination(key, 0);
		}
	};

	const updateCollectionsSearchString = searchCollectionsString => {
		setCollectionsSearchString(searchCollectionsString);
	};

	const handlePagination = (type, page) => {
		if (type === 'dataset') {
			setDatasetIndex(page);
		} else if (type === 'tool') {
			setToolIndex(page);
		} else if (type === 'project') {
			setProjectIndex(page);
		} else if (type === 'paper') {
			setPaperIndex(page);
		} else if (type === 'person') {
			setPersonIndex(page);
		} else if (type === 'course') {
			setCourseIndex(page);
		}
		window.scrollTo(0, 0);
	};

	let datasetPublisher;
	let datasetLogo;

	const datasetPaginationItems = generatePaginatedItems('dataset', datasetCount, datasetIndex, handlePagination);
	const toolPaginationItems = generatePaginatedItems('tool', toolCount, toolIndex, handlePagination);
	const projectPaginationItems = generatePaginatedItems('project', projectCount, projectIndex, handlePagination);
	const paperPaginationItems = generatePaginatedItems('paper', paperCount, paperIndex, handlePagination);
	const personPaginationItems = generatePaginatedItems('person', personCount, personIndex, handlePagination);
	const coursePaginationItems = generatePaginatedItems('course', courseCount, courseIndex, handlePagination);

	if (isLoading) {
		return (
			<Container>
				<Loading data-testid='isLoading' />
			</Container>
		);
	}

	let dropdownItems;
	if (key === 'dataset') {
		dropdownItems = ['relevance', 'popularity', 'recentlyadded', 'resources', 'metadata'];
	} else if (key === 'person') {
		dropdownItems = ['relevance', 'popularity', 'recentlyadded'];
	} else {
		dropdownItems = ['relevance', 'popularity', 'recentlyadded', 'resources'];
	}

	return (
		<div>
			<SearchBar
				ref={searchBar}
				searchString={searchString}
				doSearchMethod={doSearch}
				doUpdateSearchString={updateSearchString}
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
									{collectionData.publicflag === true
										? 'This public collection is now live. This collection is searchable on the Gateway and can be viewed by all users.'
										: 'This private collection is now live. Only those who you share the collection link with will be able to view this page.'}
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
									{collectionData.publicflag === true
										? 'Done! Your public collection has been updated. This collection is searchable on the Gateway and can be viewed by all users.'
										: 'Done! Your private collection has been updated. Only those who you share the collection link with will be able to view this page.'}
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
								<div id='collectionImage' style={{ backgroundImage: `url(${collectionData.imageLink})` }}></div>
							)}
						</Col>
						<Col md={2} lg={1} className='privatePublicDisplayCol'>
							{collectionData.publicflag === true ? (
								<div className='privatePublicDisplay'>
									<SVGIcon name='eye' width={24} height={24} fill={'#000000'} className={'margin-right-8'} />
									<span className='deepBlack-14 alignSuper' data-testid='publicBadge'>
										Public
									</span>
								</div>
							) : (
								<div className='privatePublicDisplay'>
									<SVGIcon name='eyeCrossed' width={24} height={24} fill={'#000000'} className={'margin-right-8'} />
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
								Created {moment(collectionData.createdAt).format('MMM YYYY')}{' '}
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
										<a className='gray800-14' href={'/person/' + person.id} key={index}>
											, {person.firstname} {person.lastname}
										</a>
									);
								} else {
									return (
										<a className='gray800-14' href={'/person/' + person.id} key={index}>
											{person.firstname} {person.lastname}
										</a>
									);
								}
							})}
						</Col>
						<Col sm={1} lg={1} />
					</Row>

					<Row>
						<div className='col-sm-12 mt-3 gray800-14 text-center'>{collectionData.counter ? collectionData.counter : 0} views</div>
					</Row>

					<Row>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10} className='collectionKeywords'>
							{collectionData.keywords &&
								collectionData.keywords.length > 0 &&
								collectionData.keywords.map((keyword, index) => {
									return (
										<a href={'/search?search=&tab=Collections&collectionkeywords=' + keyword}>
											<div className='badge-tag' data-testid={`collectionKeyword${index}`}>
												{keyword}
											</div>
										</a>
									);
								})}
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

			<div>
				<Tabs
					className='tabsBackground gray700-13'
					activeKey={key}
					onSelect={key => {
						handleSelect(key);
						googleAnalytics.recordVirtualPageView(`${key} tab`);
						googleAnalytics.recordEvent('Collections', `Clicked ${key} tab`, `Viewing ${key}`);
					}}
					data-testid='collectionPageTabs'>
					<Tab eventKey='dataset' title={'Datasets (' + datasetCount + ')'}></Tab>
					<Tab eventKey='tool' title={'Tools (' + toolCount + ')'}></Tab>
					<Tab eventKey='paper' title={'Papers (' + paperCount + ')'}></Tab>
					<Tab eventKey='project' title={'Projects (' + projectCount + ')'}></Tab>
					<Tab eventKey='person' title={'People (' + personCount + ')'}></Tab>
					<Tab eventKey='course' title={'Course (' + courseCount + ')'}></Tab>
					<Tab eventKey='discussion' title={`Discussion (${discoursePostCount})`}>
						<Container className='resource-card'>
							<Row>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<DiscourseTopic
										collectionId={collectionData.id}
										topicId={collectionData.discourseTopicId || 0}
										userState={userState}
										onUpdateDiscoursePostCount={updateDiscoursePostCount}></DiscourseTopic>
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
					<CollectionsSearch
						doCollectionsSearchMethod={doCollectionsSearch}
						doUpdateCollectionsSearchString={updateCollectionsSearchString}
						isLoading={isResultsLoading}
						handleSort={handleSort}
						isCollectionsSearch={true}
						dropdownItems={dropdownItems}
						sort={collectionsPageSort === '' ? (searchCollectionsString === '' ? 'recentlyadded' : 'relevance') : collectionsPageSort}
					/>
				)}
				<Row>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						{key === 'dataset'
							? handlePaginatedItems(datasetIndex).map(object => {
									if (
										object.activeflag === 'active' ||
										(object.activeflag === 'archive' && object.type === 'dataset') ||
										(object.type === 'dataset' && object.activeflag === 'review' && object.authors.includes(userState[0].id))
									) {
										var reason = '';
										var updated = '';
										var user = '';
										let showAnswer = false;
										if (object.type === 'dataset') {
											if (object.activeflag === 'archive') {
												return (
													<div className='entity-deleted gray800-14'>The dataset '{object.name}' has been deleted by the publisher</div>
												);
											}

											!_.isEmpty(object.datasetv2) && _.has(object, 'datasetv2.summary.publisher.name')
												? (datasetPublisher = object.datasetv2.summary.publisher.name)
												: (datasetPublisher = '');

											!_.isEmpty(object.datasetv2) && _.has(object, 'datasetv2.summary.publisher.logo')
												? (datasetLogo = object.datasetv2.summary.publisher.logo)
												: (datasetLogo = '');

											collectionData.relatedObjects.map(dat => {
												if (dat.objectId === object.datasetid) {
													reason = dat.reason;
													updated = dat.updated;
													user = dat.user;
													showAnswer = !_.isEmpty(reason);
												}
											});
											return (
												<RelatedObject
													key={object.id}
													data={object}
													activeLink={true}
													showRelationshipAnswer={showAnswer}
													collectionReason={reason}
													collectionUpdated={updated}
													collectionUser={user}
													datasetPublisher={datasetPublisher}
													datasetLogo={datasetLogo}
												/>
											);
										}
									}
							  })
							: ''}

						{key === 'tool'
							? handlePaginatedItems(toolIndex).map(object => {
									if (
										object.activeflag === 'active' ||
										(object.type === 'tool' && object.activeflag === 'review' && object.authors.includes(userState[0].id))
									) {
										var reason = '';
										var updated = '';
										var user = '';
										let showAnswer = false;
										if (object.type === 'tool') {
											collectionData.relatedObjects.map(dat => {
												if (parseInt(dat.objectId) === object.id) {
													reason = dat.reason;
													updated = dat.updated;
													user = dat.user;
													showAnswer = !_.isEmpty(reason);
												}
											});
											return (
												<RelatedObject
													key={object.id}
													data={object}
													activeLink={true}
													showRelationshipAnswer={showAnswer}
													collectionReason={reason}
													collectionUpdated={updated}
													collectionUser={user}
												/>
											);
										}
									}
							  })
							: ''}

						{key === 'project'
							? handlePaginatedItems(projectIndex).map(object => {
									if (
										object.activeflag === 'active' ||
										(object.type === 'project' && object.activeflag === 'review' && object.authors.includes(userState[0].id))
									) {
										var reason = '';
										var updated = '';
										var user = '';
										let showAnswer = false;
										if (object.type === 'project') {
											collectionData.relatedObjects.map(dat => {
												if (parseInt(dat.objectId) === object.id) {
													reason = dat.reason;
													updated = dat.updated;
													user = dat.user;
													showAnswer = !_.isEmpty(reason);
												}
											});
											return (
												<RelatedObject
													key={object.id}
													data={object}
													activeLink={true}
													showRelationshipAnswer={showAnswer}
													collectionReason={reason}
													collectionUpdated={updated}
													collectionUser={user}
												/>
											);
										}
									}
							  })
							: ''}

						{key === 'paper'
							? handlePaginatedItems(paperIndex).map(object => {
									if (
										object.activeflag === 'active' ||
										(object.type === 'paper' && object.activeflag === 'review' && object.authors.includes(userState[0].id))
									) {
										var reason = '';
										var updated = '';
										var user = '';
										let showAnswer = false;
										if (object.type === 'paper') {
											collectionData.relatedObjects.map(dat => {
												if (parseInt(dat.objectId) === object.id) {
													reason = dat.reason;
													updated = dat.updated;
													user = dat.user;
													showAnswer = !_.isEmpty(reason);
												}
											});

											return (
												<RelatedObject
													key={object.id}
													data={object}
													activeLink={true}
													showRelationshipAnswer={showAnswer}
													collectionReason={reason}
													collectionUpdated={updated}
													collectionUser={user}
												/>
											);
										}
									}
							  })
							: ''}

						{key === 'person'
							? handlePaginatedItems(personIndex).map(object => {
									if (
										object.activeflag === 'active' ||
										(object.type === 'person' && object.activeflag === 'review' && object.authors.includes(userState[0].id))
									) {
										var reason = '';
										var updated = '';
										var user = '';
										let showAnswer = false;
										if (object.type === 'person') {
											collectionData.relatedObjects.map(dat => {
												if (parseInt(dat.objectId) === object.id) {
													reason = dat.reason;
													updated = dat.updated;
													user = dat.user;
													showAnswer = !_.isEmpty(reason);
												}
											});
											return (
												<RelatedObject
													key={object.id}
													data={object}
													activeLink={true}
													showRelationshipAnswer={showAnswer}
													collectionReason={reason}
													collectionUpdated={updated}
													collectionUser={user}
												/>
											);
										}
									}
							  })
							: ''}

						{key === 'course'
							? handlePaginatedItems(courseIndex).map(object => {
									if (
										object.activeflag === 'active' ||
										(object.type === 'course' && object.activeflag === 'review' && object.creator[0].id === userState[0].id)
									) {
										var reason = '';
										var updated = '';
										var user = '';
										let showAnswer = false;
										if (object.type === 'course') {
											collectionData.relatedObjects.map(dat => {
												if (parseInt(dat.objectId) === object.id) {
													reason = dat.reason;
													updated = dat.updated;
													user = dat.user;
													showAnswer = !_.isEmpty(reason);
												}
											});
											return (
												<RelatedObject
													key={object.id}
													data={object}
													activeLink={true}
													showRelationshipAnswer={showAnswer}
													collectionReason={reason}
													collectionUpdated={updated}
													collectionUser={user}
												/>
											);
										}
									}
							  })
							: ''}

						<div className='text-center'>
							{key === 'dataset' && datasetCount > maxResult ? <Pagination>{datasetPaginationItems}</Pagination> : ''}
							{key === 'tool' && toolCount > maxResult ? <Pagination>{toolPaginationItems}</Pagination> : ''}
							{key === 'project' && projectCount > maxResult ? <Pagination>{projectPaginationItems}</Pagination> : ''}
							{key === 'paper' && paperCount > maxResult ? <Pagination>{paperPaginationItems}</Pagination> : ''}
							{key === 'person' && personCount > maxResult ? <Pagination>{personPaginationItems}</Pagination> : ''}
							{key === 'course' && courseCount > maxResult ? <Pagination>{coursePaginationItems}</Pagination> : ''}
						</div>
					</Col>
					<Col sm={1} lg={10} />
				</Row>
			</Container>

			{userState[0].loggedIn &&
				(userState[0].role === 'Admin' || (collectionData.authors && collectionData.authors.includes(userState[0].id))) && (
					<ActionBar userState={userState}>
						<ResourcePageButtons data={collectionData} userState={userState} isCollection={true} />
					</ActionBar>
				)}

			<SideDrawer open={showDrawer} closed={toggleDrawer}>
				<UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
			</SideDrawer>

			<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
		</div>
	);
};

export default CollectionPage;
