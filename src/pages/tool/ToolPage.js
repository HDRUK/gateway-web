import * as Sentry from '@sentry/react';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Dropdown, Row, Tab, Tabs } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Rating from 'react-rating';
import 'react-tabs/style/react-tabs.css';
import { baseURL } from '../../configs/url.config';
import { ReactComponent as FullStarIconSvg } from '../../images/star.svg';
import { ReactComponent as EmptyStarIconSvg } from '../../images/starempty.svg';
import SVGIcon from '../../images/SVGIcon';
import googleAnalytics from '../../tracking';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import CollectionCard from '../commonComponents/collectionCard/CollectionCard';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../commonComponents/errorModal';
import Loading from '../commonComponents/Loading';
import MessageNotFound from '../commonComponents/MessageNotFound';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import Reviews from '../commonComponents/reviews/Reviews';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import Uploader from '../commonComponents/Uploader';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DiscourseTopic from '../discourse/DiscourseTopic';

export const ToolDetail = props => {
	const [id] = useState('');
	const [toolData, setToolData] = useState([]);
	const [reviewData, setReviewData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
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
	const [toolAdded, setToolAdded] = useState(false);
	const [toolEdited, setToolEdited] = useState(false);
	const [reviewAdded, setReviewAdded] = useState(false);
	const [replyAdded, setReplyAdded] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [relatedObjects, setRelatedObjects] = useState([]);
	const [relatedObjectsFiltered, setRelatedObjectsFiltered] = useState([]);
	const [relatedResourcesSort, setRelatedResourcesSort] = useState([]);
	const [relatedObjectsSearchValue, setRelatedObjectsSearchValue] = useState('');
	const [sorting, setSorting] = useState('showAll');
	const [discoursePostCount, setDiscoursePostCount] = useState(0);
	const [showDrawer, setShowDrawer] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [context, setContext] = useState({});
	const [collections, setCollections] = useState([]);
	const [searchBar] = useState(React.createRef());

	//componentDidMount - on loading of tool detail page
	useEffect(() => {
		if (!!window.location.search) {
			let values = queryString.parse(window.location.search);
			setToolAdded(values.toolAdded);
			setToolEdited(values.toolEdited);
			setReviewAdded(values.reviewAdded);
			setReplyAdded(values.replyAdded);
		}
		getToolDataFromDb();
	}, []);

	//componentDidUpdate - on render of tool detail page were id is different
	useEffect(() => {
		if (props.match.params.toolID !== id && id !== '' && !isLoading) {
			getToolDataFromDb();
		}
	});

	const getToolDataFromDb = () => {
		setIsLoading(true);
		axios
			.get(baseURL + '/api/v1/tools/' + props.match.params.toolID)
			.then(async res => {
				if (_.isNil(res.data)) {
					window.localStorage.setItem('redirectMsg', `Tool not found for Id: ${props.match.params.toolID}`);
					props.history.push({ pathname: '/search?search=', search: '' });
				} else {
					const localToolData = res.data.data[0];
					document.title = localToolData.name.trim();

					let counter = !localToolData.counter ? 1 : localToolData.counter + 1;
					updateCounter(props.match.params.toolID, counter);

					if (!_.isUndefined(localToolData.relatedObjects)) {
						let localAdditionalObjInfo = await getAdditionalObjectInfo(localToolData.relatedObjects);
						await populateRelatedObjects(localToolData, localAdditionalObjInfo);
					}

					setToolData(localToolData);
					setReviewData(res.data.reviewData);
					populateCollections(localToolData);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const populateCollections = localToolData => {
		setIsLoading(true);
		axios.get(baseURL + '/api/v1/collections/entityid/' + localToolData.id).then(res => {
			setCollections(res.data.data || []);
		});
	};

	const doSearch = e => {
		//fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(searchString)}`;
	};

	const updateSearchString = searchString => {
		setSearchString(searchString);
	};

	//Update the page view counter
	const updateCounter = (id, counter) => {
		axios.post(baseURL + '/api/v1/counter/update', { id, counter });
	};

	const getAdditionalObjectInfo = async addtionalObjInfo => {
		let tempObjects = [];
		if (addtionalObjInfo) {
			const promises = addtionalObjInfo.map(async (object, index) => {
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
						let datasetPublisher;
						let datasetLogo;

						!_.isEmpty(res.data.data[0].datasetv2) && _.has(res.data.data[0], 'datasetv2.summary.publisher.name')
							? (datasetPublisher = res.data.data[0].datasetv2.summary.publisher.name)
							: (datasetPublisher = '');

						!_.isEmpty(res.data.data[0].datasetv2) && _.has(res.data.data[0], 'datasetv2.summary.publisher.logo')
							? (datasetLogo = res.data.data[0].datasetv2.summary.publisher.logo)
							: (datasetLogo = '');

						tempObjects.push({
							name: res.data.data[0].name,
							firstname: res.data.data[0].firstname || '',
							lastname: res.data.data[0].lastname || '',
							id: object.objectId,
							authors: res.data.data[0].authors,
							activeflag: res.data.data[0].activeflag,
							datasetPublisher: datasetPublisher,
							datasetLogo: datasetLogo,
						});
					});
				}
			});
			await Promise.all(promises);
		}
		return tempObjects;
	};

	const populateRelatedObjects = (localToolData, localAdditionalObjInfo) => {
		let tempRelatedObjects = [];
		if (localToolData.relatedObjects && localAdditionalObjInfo) {
			localToolData.relatedObjects.map(object =>
				localAdditionalObjInfo.forEach(item => {
					if (object.objectId === item.id && item.activeflag === 'active') {
						object['datasetPublisher'] = item.datasetPublisher;
						object['datasetLogo'] = item.datasetLogo;
						object['name'] = item.name || '';
						object['firstname'] = item.firstname || '';
						object['lastname'] = item.lastname || '';
						object['projectTitle'] = item.projectTitle || '';

						tempRelatedObjects.push(object);
					}
					if (object.objectId === item.id && item.activeflag === 'review' && item.authors.includes(userState[0].id)) {
						tempRelatedObjects.push(object);
					}
				})
			);
		}
		setRelatedObjects(tempRelatedObjects);
		setRelatedObjectsFiltered(tempRelatedObjects);
		setRelatedResourcesSort(tempRelatedObjects);
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

	const onRelatedObjectsSearch = e => {
		setRelatedObjectsSearchValue(e.target.value);
	};

	const doRelatedObjectsSearch = async e => {
		// Fires on enter on searchbar
		if (e.key === 'Enter') {
			setRelatedObjectsFiltered([]);
			setRelatedResourcesSort([]);
			setSorting('showAll');
			const filteredRelatedResourceItems = await filterRelatedResourceItems(relatedObjects, relatedObjectsSearchValue);

			let tempFilteredData = filteredRelatedResourceItems.filter(dat => {
				return dat !== '';
			});
			setRelatedObjectsFiltered(tempFilteredData);
			setRelatedResourcesSort(tempFilteredData);
		}
	};

	const filterRelatedResourceItems = (objectData, relatedObjectsSearchValue) =>
		objectData.map(object => {
			// Searching functionality - searches through object data and returns true if there is a match with the search term
			if (
				(_.has(object, 'name') ? object.name.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
				(_.has(object, 'title') ? object.title.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
				(_.has(object, 'firstname') ? object.firstname.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
				(_.has(object, 'lastname') ? object.lastname.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false) ||
				(_.has(object, 'projectTitle') ? object.projectTitle.toLowerCase().includes(relatedObjectsSearchValue.toLowerCase()) : false)
			) {
				return object;
			} else {
				return '';
			}
		});

	const handleSort = async sort => {
		setRelatedObjectsFiltered([]);
		googleAnalytics.recordEvent('Courses', `Sorted related resources by ${sort}`, 'Sort dropdown option changed');
		let tempFilteredData = [];
		if (sort === 'showAll') {
			tempFilteredData = await relatedResourcesSort;
		} else {
			tempFilteredData = await relatedResourcesSort.filter(dat => dat.objectType === sort);
		}
		setSorting(sort);
		setRelatedObjectsFiltered(tempFilteredData);
	};

	if (isLoading) {
		return (
			<Container>
				<Loading />
			</Container>
		);
	}

	if (toolData.relatedObjects === null || typeof toolData.relatedObjects === 'undefined') {
		toolData.relatedObjects = [];
	}

	let ratingsTotal = 0;
	if (reviewData && reviewData.length) {
		reviewData.forEach(review => {
			ratingsTotal = ratingsTotal + review.rating;
		});
	}
	const ratingsCount = reviewData ? reviewData.length : 0;
	const avgRating = reviewData.length > 0 ? ratingsTotal / ratingsCount : '';

	return (
		<Sentry.ErrorBoundary fallback={<ErrorModal />}>
			<div>
				<SearchBar
					ref={searchBar}
					searchString={searchString}
					doSearchMethod={doSearch}
					doUpdateSearchString={updateSearchString}
					userState={userState}
					doToggleDrawer={toggleDrawer}
				/>
				<Container className='margin-bottom-48'>
					{toolAdded ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert data-test-id='tool-added-banner' variant='success' className='mt-3'>
									Done! Someone will review your tool and let you know when it goes live
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{toolEdited ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='success' className='mt-3'>
									Done! Your tool has been updated
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{toolData.activeflag === 'review' ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert data-test-id='tool-pending-banner' variant='warning' className='mt-3'>
									Your tool is pending review. Only you can see this page.
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{reviewAdded ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='warning' className='mt-3'>
									Done! Your review is pending review.
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{replyAdded ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='success' className='mt-3'>
									Done! Your reply has been added.
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}
					<Row className='mt-4'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							<div className='rectangle'>
								<Row>
									<Col className='line-height-normal'>
										<span data-test-id='tool-name' className='black-16'>
											{toolData.name}
										</span>
									</Col>
								</Row>
								{ratingsCount === 0 ? (
									''
								) : (
									<Row className='margin-top-16'>
										<Col>
											<div className='gray500-13'>
												<Rating
													emptySymbol={<EmptyStarIconSvg />}
													fullSymbol={<FullStarIconSvg />}
													placeholderSymbol={<FullStarIconSvg />}
													placeholderRating={avgRating}
													readonly='true'
												/>
												<span style={{ paddingLeft: '20px' }}>
													{!!ratingsTotal && ratingsCount === 1 ? ratingsCount + ' review' : ratingsCount + ' reviews'}
													<span className='reviewTitleGap'>·</span>
													{avgRating === 0 ? 'No average rating' : Math.round(avgRating * 10) / 10 + ' average'}
												</span>
											</div>
										</Col>
									</Row>
								)}
								<Row className='margin-top-16'>
									<Col xs={12}>
										<span className='badge-tool'>
											<SVGIcon name='newtoolicon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
											<span>Tool</span>
										</span>

										<a href={'/search?search=&tab=Tools&toolcategories=' + toolData.categories.category}>
											<div className='badge-tag'>{toolData.categories.category}</div>
										</a>
									</Col>
								</Row>

								<Row className='margin-top-20'>
									<Col xs={12} className='line-height-normal'>
										<span className='gray800-14'>
											{toolData.counter === undefined ? 1 : toolData.counter + 1}
											{toolData.counter === undefined ? ' view' : ' views'}
										</span>
									</Col>
								</Row>
							</div>
						</Col>
						<Col sm={1} lg={10} />
					</Row>

					<Row>
						<Col sm={1} />
						<Col sm={10}>
							<div>
								<Tabs
									className='tabsBackground gray700-13 margin-bottom-16'
									onSelect={key => {
										googleAnalytics.recordVirtualPageView(`${key} tab`);
										googleAnalytics.recordEvent('Tools', `Clicked ${key} tab`, `Viewing ${key}`);
									}}>
									<Tab eventKey='About' title={'About'}>
										<Row className='mt-2'>
											<Col sm={12} lg={12}>
												<div className='rectangle'>
													<Row className='gray800-14-bold'>
														<Col sm={12}>Description</Col>
													</Row>
													<Row className='mt-3'>
														<Col sm={12} className='gray800-14 hdruk-section-body' data-test-id='tool-description'>
															<ReactMarkdown source={toolData.description} />
														</Col>
													</Row>
												</div>
											</Col>
										</Row>

										{!_.isEmpty(toolData.resultsInsights) ? (
											<Row className='mt-2'>
												<Col sm={12} lg={12}>
													<div className='rectangle'>
														<Row className='gray800-14-bold'>
															<Col sm={12}>Results/Insights</Col>
														</Row>
														<Row className='mt-3'>
															<Col sm={12} className='gray800-14 hdruk-section-body'>
																<ReactMarkdown source={toolData.resultsInsights} />
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
														<Col sm={10} className='gray800-14'>
															<a
																href={toolData.link}
																rel='noopener noreferrer'
																data-test-id='tool-page-url'
																target='_blank'
																className='purple-14 text-break'>
																{toolData.link}
															</a>
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2} className='gray800-14'>
															License
														</Col>
														{toolData.license ? (
															<Col sm={10} className='gray800-14'>
																{toolData.license}
															</Col>
														) : (
															<Col sm={10} className='gray800-14-opacity'>
																Not specified
															</Col>
														)}
													</Row>
													<Row className='mt-2'>
														<Col sm={2} className='gray800-14'>
															Last update
														</Col>
														<Col sm={10} className='gray800-14'>
															{moment(toolData.updatedon).format('DD MMM YYYY')}
														</Col>
													</Row>
													{toolData.authorsNew ? (
														<Row className='mt-2'>
															<Col sm={2}>
																<span className='gray800-14'>Authors</span>
															</Col>
															<Col sm={10} className='gray800-14 overflowWrap' data-test-id='tool-authors'>
																{toolData.authorsNew}
															</Col>
														</Row>
													) : (
														''
													)}
													<Row className='mt-3'>
														<Col sm={2}>
															<span className='gray800-14'>Uploaders</span>
														</Col>
														<Col sm={10} className='gray800-14 overflowWrap'>
															{toolData.persons.map(uploader => (
																<span key={uploader.id}>
																	<Uploader key={uploader.id} uploader={uploader} />
																</span>
															))}
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2} className='gray800-14'>
															Type
														</Col>
														<Col sm={10} className='gray800-14'>
															<a href={'/search?search=&tab=Tools&toolcategories=' + toolData.categories.category}>
																<div data-test-id='tool-type' className='badge-tag'>
																	{toolData.categories.category}
																</div>
															</a>
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2} className='gray800-14'>
															Implementation
														</Col>
														<Col sm={10} className='gray800-14'>
															{!toolData.programmingLanguage || toolData.programmingLanguage.length <= 0
																? ''
																: toolData.programmingLanguage.map((obj, i) => {
																		return obj.version !== '' ? (
																			<a href={'/search?search=&tab=Tools&toolprogrammingLanguage=' + obj.programmingLanguage}>
																				<div className='badge-version' key={i} data-test-id='tool-implementation'>
																					<span>{obj.programmingLanguage}</span>
																					<span>{obj.version}</span>
																				</div>
																			</a>
																		) : (
																			<a href={'/search?search=&tab=Tools&toolprogrammingLanguage=' + obj.programmingLanguage}>
																				<div className='badge-tag' key={i}>
																					<span>{obj.programmingLanguage}</span>
																				</div>
																			</a>
																		);
																  })}
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2} className='gray800-14'>
															Keywords
														</Col>
														<Col sm={10} className='gray800-14'>
															{!toolData.tags.features || toolData.tags.features.length <= 0 ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																toolData.tags.features.map(keyword => {
																	return (
																		<a href={'/search?search=&tab=Tools&toolfeatures=' + keyword}>
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
															{!toolData.tags.topics || toolData.tags.topics.length <= 0 ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																toolData.tags.topics.map(domain => {
																	return (
																		<a href={'/search?search=&tab=Tools&tooltopics=' + domain}>
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
									<Tab eventKey='Reviews' title={'Reviews (' + reviewData.length + ')'}>
										<Reviews data={toolData} userState={userState} reviewData={reviewData} />
									</Tab>
									<Tab eventKey='Discussion' title={`Discussion (${discoursePostCount})`}>
										<DiscourseTopic
											toolId={toolData.id}
											topicId={toolData.discourseTopicId || 0}
											userState={userState}
											onUpdateDiscoursePostCount={updateDiscoursePostCount}
										/>
									</Tab>
									<Tab eventKey='Related resources' title={'Related resources (' + relatedObjects.length + ')'}>
										<>
											<Row>
												<Col lg={8}>
													<span className='collectionsSearchBar form-control'>
														<span className='collectionsSearchIcon'>
															<SVGIcon name='searchicon' width={20} height={20} fill={'#2c8267'} stroke='none' type='submit' />
														</span>
														<span>
															<input
																id='collectionsSearchBarInput'
																type='text'
																placeholder='Search within related resources'
																onChange={onRelatedObjectsSearch}
																value={relatedObjectsSearchValue}
																onKeyDown={doRelatedObjectsSearch}
															/>
														</span>
													</span>
												</Col>

												<Col lg={4} className='text-right'>
													<Dropdown className='sorting-dropdown' alignRight onSelect={handleSort}>
														<Dropdown.Toggle variant='info' id='dropdown-menu-align-right' className='gray800-14'>
															{(() => {
																if (sorting !== 'showAll')
																	return `Show ${
																		sorting === 'dataUseRegister' ? `data uses` : sorting === 'people' ? sorting : `${sorting}s`
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
																}>
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
															{['dataset', 'tool', 'dataUseRegister', 'paper', 'course', 'person'].map(item => {
																return relatedResourcesSort.filter(dat => dat.objectType === item).length > 0 ? (
																	<Row
																		key={`ddl-item-${item}`}
																		className={
																			sorting === item
																				? 'sort-dropdown-item sort-dropdown-item-selected sortingDropdown'
																				: 'sort-dropdown-item sortingDropdown'
																		}>
																		<Col xs={12} className='p-0'>
																			<Dropdown.Item eventKey={item} className='gray800-14'>
																				Show {item === 'dataUseRegister' ? `data uses` : item === 'people' ? item : `${item}s`} (
																				{relatedResourcesSort.filter(dat => dat.objectType === item).length})
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
															})}
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
											<MessageNotFound text='This tool has not been featured on any collections yet.' />
										) : (
											<>
												<MessageNotFound text='This tool appears on the collections below. A collection is a group of resources on the same theme.' />

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
				<SideDrawer open={showDrawer} closed={toggleDrawer}>
					<UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
				</SideDrawer>

				<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />

				<ActionBar userState={userState}>
					<ResourcePageButtons data={toolData} userState={userState} />
				</ActionBar>
			</div>
		</Sentry.ErrorBoundary>
	);
};

export default ToolDetail;
