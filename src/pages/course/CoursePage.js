import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import _ from 'lodash';
import queryString from 'query-string';
import { Container, Row, Col, Tabs, Tab, Alert, Dropdown } from 'react-bootstrap';
import moment from 'moment';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import MessageNotFound from '../commonComponents/MessageNotFound';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import SVGIcon from '../../images/SVGIcon';
import DiscourseTopic from '../discourse/DiscourseTopic';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import ErrorModal from '../commonComponents/errorModal';
import CollectionCard from '../commonComponents/collectionCard/CollectionCard';
import './Course.scss';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import googleAnalytics from '../../tracking';

let baseURL = require('../commonComponents/BaseURL').getURL();

export const CourseDetail = props => {
	const [courseData, setCourseData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [courseAdded, setCourseAdded] = useState(false);
	const [courseEdited, setCourseEdited] = useState(false);
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

	//componentDidMount - on loading of course detail page
	useEffect(() => {
		if (!!window.location.search) {
			let values = queryString.parse(window.location.search);
			setCourseAdded(values.courseAdded);
			setCourseEdited(values.courseEdited);
		}
		async function invokeCourseDataCall() {
			await getCourseDataFromDb();
		}
		invokeCourseDataCall();
	}, []);

	const getCourseDataFromDb = async () => {
		setIsLoading(true);
		await axios
			.get(baseURL + '/api/v1/course/' + props.match.params.courseID)
			.then(async res => {
				if (_.isNil(res.data)) {
					window.localStorage.setItem('redirectMsg', `Course not found for Id: ${props.match.params.courseID}`);
					props.history.push({ pathname: '/search?search=', search: '' });
				} else {
					let localCourseData = res.data.data[0];
					document.title = localCourseData.title.trim();

					let counter = !localCourseData.counter ? 1 : localCourseData.counter + 1;
					updateCounter(props.match.params.courseID, counter);

					if (!_.isUndefined(localCourseData.relatedObjects)) {
						let localAdditionalInfo = await getAdditionalObjectInfo(localCourseData.relatedObjects);
						await populateRelatedObjects(localCourseData, localAdditionalInfo);
					}

					setCourseData(localCourseData);
					populateCollections(localCourseData);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const populateCollections = localCourseData => {
		setIsLoading(true);
		axios.get(baseURL + '/api/v1/collections/entityid/' + localCourseData.id).then(res => {
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

	const updateDiscoursePostCount = count => {
		setDiscoursePostCount(count);
	};

	const updateCounter = (id, counter) => {
		axios.post(baseURL + '/api/v1/coursecounter/update', { id, counter });
	};

	const getAdditionalObjectInfo = async additionalObjInfo => {
		let tempObjects = [];
		if (additionalObjInfo) {
			const promises = additionalObjInfo.map(async (object, index) => {
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

	const populateRelatedObjects = async (localCourseData, localAdditionalInfo) => {
		let tempRelatedObjects = [];
		if (localCourseData.relatedObjects && localAdditionalInfo) {
			localCourseData.relatedObjects.forEach(relatedObject =>
				localAdditionalInfo.forEach(item => {
					if (relatedObject.objectId === item.id && item.activeflag === 'active') {
						relatedObject['datasetPublisher'] = item.datasetPublisher;
						relatedObject['datasetLogo'] = item.datasetLogo;
						relatedObject['name'] = item.name || '';
						relatedObject['firstname'] = item.firstname || '';
						relatedObject['lastname'] = item.lastname || '';
						relatedObject['projectTitle'] = item.projectTitle || '';

						tempRelatedObjects.push(relatedObject);
					}

					if (relatedObject.objectId === item.id && item.activeflag === 'review' && item.authors.includes(userState[0].id)) {
						tempRelatedObjects.push(relatedObject);
					}
				})
			);
		}
		setRelatedObjects(tempRelatedObjects);
		setRelatedObjectsFiltered(tempRelatedObjects);
		setRelatedResourcesSort(tempRelatedObjects);
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

	if (courseData.relatedObjects === null || typeof courseData.relatedObjects === 'undefined') {
		courseData.relatedObjects = [];
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
					{courseAdded ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='success' className='mt-3'>
									Done! Someone will review your course and let you know when it goes live
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{courseEdited ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='success' className='mt-3'>
									Done! Your course has been updated
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{courseData.activeflag === 'review' ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='warning' className='mt-3'>
									Your course is pending review. Only you can see this page.
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
									<Col>
										<span data-test-id='course-title' className='black-16'>
											{courseData.title}
										</span>
									</Col>
								</Row>
								<Row>
									<Col>
										<span data-test-id='course-provider' className='black-14'>
											{courseData.provider}
										</span>
									</Col>
								</Row>
								<Row className='margin-top-16'>
									<Col xs={12}>
										<span className='badge-course'>
											<SVGIcon name='educationicon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
											<span>Course</span>
										</span>

										{courseData.award
											? courseData.award.map(award => {
													return (
														<a href={'/search?search=&tab=Courses&courseaward=' + award}>
															<div className='badge-tag'>{award}</div>
														</a>
													);
											  })
											: ''}

										{courseData.domains
											? courseData.domains.map(domain => {
													return (
														<a href={'/search?search=&tab=Courses&coursedomains=' + domain}>
															<div className='badge-tag'>{domain}</div>
														</a>
													);
											  })
											: ''}
									</Col>
								</Row>

								<Row className='margin-top-16'>
									<Col xs={12}>
										<span className='gray700-14'>
											{courseData.counter === undefined ? 1 : courseData.counter + 1}
											{courseData.counter === undefined ? ' view' : ' views'}
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
										googleAnalytics.recordEvent('Courses', `Clicked ${key} tab`, `Viewing ${key}`);
									}}>
									<Tab eventKey='About' title={'About'}>
										<Row>
											<Col sm={12} lg={12}>
												<div className='rectangle'>
													<Row className='gray800-14-bold'>
														<Col sm={12}>Description</Col>
													</Row>
													<Row className='mt-3'>
														<Col sm={12} data-test-id='course-description' className='gray800-14 hdruk-section-body'>
															<ReactMarkdown source={courseData.description} />
														</Col>
													</Row>
												</div>
											</Col>
										</Row>

										{!_.isEmpty(courseData.resultsInsights) ? (
											<Row className='mt-2'>
												<Col sm={12} lg={12}>
													<div className='rectangle'>
														<Row className='gray800-14-bold'>
															<Col sm={12}>Results/Insights</Col>
														</Row>
														<Row className='mt-3'>
															<Col sm={12} className='gray800-14 hdruk-section-body'>
																<ReactMarkdown source={courseData.resultsInsights} />
															</Col>
														</Row>
													</div>
												</Col>
											</Row>
										) : (
											''
										)}

										<Row className='margin-top-8'>
											<Col sm={12}>
												<div className='rectangle'>
													<Row className='gray800-14-bold pad-bottom-8'>
														<Col sm={12}>Details</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															URL
														</Col>
														<Col sm={10} className='gray800-14'>
															<a
																data-test-id='course-url'
																href={courseData.link}
																rel='noopener noreferrer'
																target='_blank'
																className='purple-14 text-break'>
																{courseData.link}
															</a>
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															Course provider
														</Col>
														<Col sm={10} className='gray-deep-14 overflowWrap'>
															{courseData.provider}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															Uploader
														</Col>
														<Col sm={10} className='purple-14 overflowWrap'>
															<a
																href={'/person/' + courseData.creator[0].id}
																rel='noopener noreferrer'
																target='_blank'
																className='purple-14'>
																{courseData.creator[0].firstname} {courseData.creator[0].lastname}
															</a>
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															Course delivery
														</Col>
														<Col sm={10} className='gray-deep-14 overflowWrap'>
															{courseData.courseDelivery ? (
																courseData.courseDelivery === 'campus' ? (
																	'On campus'
																) : (
																	'Online'
																)
															) : (
																<span className='gray800-14-opacity'>Not specified</span>
															)}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															Course location
														</Col>
														<Col sm={10} className='gray-deep-14 overflowWrap' data-test-id='course-location'>
															{courseData.location ? courseData.location : <span className='gray800-14-opacity'>Not specified</span>}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															Keywords
														</Col>
														<Col sm={10} className='gray800-14'>
															{!courseData.keywords || courseData.keywords.length <= 0 ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																courseData.keywords.map(keyword => {
																	return (
																		<a href={'/search?search=&tab=Courses&coursekeywords=' + keyword}>
																			<div className='badge-tag'>{keyword}</div>
																		</a>
																	);
																})
															)}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={2} className='gray800-14'>
															Domain
														</Col>
														<Col sm={10} className='gray800-14'>
															{!courseData.domains || courseData.domains.length <= 0 ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																courseData.domains.map(domain => {
																	return (
																		<a href={'/search?search=&tab=Courses&coursedomains=' + domain}>
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

										<Row className='margin-top-8'>
											<Col sm={12}>
												<div className='rectangle'>
													<Row className='gray800-14-bold'>
														<Col sm={12}>Dates and costs</Col>
													</Row>
													{courseData.courseOptions.map(courseOption => {
														return (
															<div className='margin-top-24'>
																<Row className='gray800-14-opacity'>
																	<Col sm={12} data-test-id='course-date'>
																		{courseOption.flexibleDates ? 'Flexible' : moment(courseOption.startDate).format('dddd Do MMMM YYYY')}
																	</Col>
																</Row>
																<Row className='pad-top-16'>
																	<Col sm={2} className='gray800-14'>
																		Course duration
																	</Col>
																	{courseOption.studyMode && courseOption.studyDurationNumber ? (
																		<Col sm={10} className='gray-deep-14 overflowWrap' data-test-id='course-duration'>
																			{courseOption.studyMode} | {courseOption.studyDurationNumber} {courseOption.studyDurationMeasure}
																		</Col>
																	) : (
																		<Col sm={10} className='gray-deep-14 overflowWrap'>
																			<span className='gray800-14-opacity'>Not specified</span>
																		</Col>
																	)}
																</Row>
																<Row className='pad-top-16'>
																	<Col sm={2} className='gray800-14'>
																		Course fees
																	</Col>
																	{courseOption.fees && courseOption.fees[0].feeDescription && courseOption.fees[0].feeAmount ? (
																		courseOption.fees.map((fee, index) =>
																			fee.feeDescription && fee.feeAmount ? (
																				<>
																					{index > 0 ? <Col sm={2} /> : ''}
																					<Col sm={10} className='gray-deep-14 overflowWrap' data-test-id='course-fees'>
																						{fee.feeDescription} | £{fee.feeAmount} {fee.feePer ? <>per {fee.feePer.toLowerCase()}</> : ''}
																					</Col>
																				</>
																			) : (
																				''
																			)
																		)
																	) : (
																		<Col sm={10} className='gray-deep-14 overflowWrap'>
																			<span className='gray800-14-opacity'>Not specified</span>
																		</Col>
																	)}
																</Row>
															</div>
														);
													})}
												</div>
											</Col>
										</Row>

										<Row className='margin-top-8'>
											<Col sm={12} className='mb-5'>
												<div className='rectangle'>
													<Row className='gray800-14-bold pad-bottom-8'>
														<Col sm={12}>Requirements and certifications</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={3} className='gray800-14'>
															Entry requirements
														</Col>
														<Col sm={9} className='gray800-14'>
															{courseData.entries && courseData.entries[0].level ? (
																courseData.entries.map((entry, index) =>
																	entry.level && entry.subject ? (
																		<a href={'/search?search=&tab=Courses&courseentrylevel=' + entry.level}>
																			<div className='badge-version'>
																				<span data-test-id='entry-level'>{entry.level}</span>
																				<span data-test-id='entry-subject'>{entry.subject}</span>
																			</div>
																		</a>
																	) : entry.level && !entry.subject ? (
																		<a href={'/search?search=&tab=Courses&courseentrylevel=' + entry.level}>
																			<div className='badge-tag'>
																				<span>{entry.level}</span>
																			</div>
																		</a>
																	) : (
																		''
																	)
																)
															) : (
																<span className='gray800-14-opacity'>Not specified</span>
															)}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={3} className='gray800-14'>
															Restrictions
														</Col>
														<Col sm={9} className='gray800-14'>
															{!courseData.restrictions ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																<div className='badge-tag'>{courseData.restrictions}</div>
															)}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={3} className='gray800-14'>
															Award
														</Col>
														<Col sm={9} className='gray800-14'>
															{!courseData.award || courseData.award.length <= 0 ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																courseData.award.map(award => {
																	return (
																		<a href={'/search?search=&tab=Courses&courseaward=' + award}>
																			<div className='badge-tag'>{award}</div>
																		</a>
																	);
																})
															)}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={3} className='gray800-14'>
															Competency framework
														</Col>
														<Col sm={9} className='gray800-14'>
															{!courseData.competencyFramework ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																<a href={'/search?search=&tab=Courses&courseframework=' + courseData.competencyFramework}>
																	<div className='badge-tag'>{courseData.competencyFramework}</div>
																</a>
															)}
														</Col>
													</Row>
													<Row className='pad-top-16'>
														<Col sm={3} className='gray800-14'>
															National priority areas
														</Col>
														<Col sm={9} className='gray800-14'>
															{!courseData.nationalPriority ? (
																<span className='gray800-14-opacity'>Not specified</span>
															) : (
																<a href={'/search?search=&tab=Courses&coursepriority=' + courseData.nationalPriority}>
																	<div className='badge-tag'>{courseData.nationalPriority}</div>
																</a>
															)}
														</Col>
													</Row>
												</div>
											</Col>
										</Row>
									</Tab>

									<Tab eventKey='Discussion' title={`Discussion (${discoursePostCount})`}>
										<DiscourseTopic
											toolId={courseData.id}
											topicId={courseData.discourseTopicId || 0}
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
											<MessageNotFound text='This course has not been featured on any collections yet.' />
										) : (
											<>
												<MessageNotFound text='This course appears on the collections below. A collection is a group of resources on the same theme.' />

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
					<ResourcePageButtons data={courseData} userState={userState} />
				</ActionBar>

				<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
			</div>
		</Sentry.ErrorBoundary>
	);
};

export default CourseDetail;
