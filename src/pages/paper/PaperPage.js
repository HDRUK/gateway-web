import * as Sentry from '@sentry/react';
import axios from 'axios';
import _ from 'lodash';
import queryString from 'query-string';
import React, { Fragment, useEffect, useState } from 'react';
import { Alert, Col, Container, Dropdown, Row, Tab, Tabs } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import 'react-tabs/style/react-tabs.css';
import { baseURL } from '../../configs/url.config';
import { ReactComponent as InfoSVG } from '../../images/info.svg';
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
import SearchBar from '../commonComponents/searchBar/SearchBar';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import Uploader from '../commonComponents/Uploader';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DiscourseTopic from '../discourse/DiscourseTopic';
import './Paper.scss';

export const PaperDetail = props => {
	const [id] = useState('');
	const [paperData, setPaperData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [paperAdded, setPaperAdded] = useState(false);
	const [paperEdited, setPaperEdited] = useState(false);
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
	const [isHovering, setIsHovering] = useState(false);
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

	//componentDidMount - on loading of page detail page
	useEffect(() => {
		if (!!window.location.search) {
			let values = queryString.parse(window.location.search);
			setPaperAdded(values.toolAdded);
			setPaperEdited(values.toolEdited);
		}
		getPaperDataFromDb();
	}, []);

	//componentDidUpdate - on render of page detail page were id is different
	useEffect(() => {
		if (props.match.params.toolID !== id && id !== '' && !isLoading) {
			getPaperDataFromDb();
		}
	});

	const getPaperDataFromDb = () => {
		setIsLoading(true);
		axios
			.get(baseURL + '/api/v1/papers/' + props.match.params.paperID)
			.then(async res => {
				if (_.isNil(res.data)) {
					window.localStorage.setItem('redirectMsg', `Paper not found for Id: ${props.match.params.paperID}`);
					props.history.push({ pathname: '/search?search=', search: '' });
				} else {
					const localPaperData = res.data.data[0];
					document.title = localPaperData.name.trim();

					let counter = !localPaperData.counter ? 1 : localPaperData.counter + 1;
					updateCounter(props.match.params.paperID, counter);

					if (!_.isUndefined(localPaperData.relatedObjects)) {
						let localAdditionalObjInfo = await getAdditionalObjectInfo(localPaperData.relatedObjects);
						await populateRelatedObjects(localPaperData, localAdditionalObjInfo);
					}
					setPaperData(localPaperData);
					populateCollections(localPaperData);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const populateCollections = localPaperData => {
		setIsLoading(true);
		axios.get(baseURL + '/api/v1/collections/entityid/' + localPaperData.id).then(res => {
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

	const updateCounter = (id, counter) => {
		axios.post(baseURL + '/api/v1/counter/update', { id, counter });
	};

	const updateDiscoursePostCount = count => {
		setDiscoursePostCount(count);
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

	const populateRelatedObjects = (localPaperData, localAdditionalObjInfo) => {
		let tempRelatedObjects = [];

		if (localPaperData.relatedObjects && localAdditionalObjInfo) {
			localPaperData.relatedObjects.map(object =>
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

	const handleMouseHover = () => {
		setIsHovering(!isHovering);
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
				<Loading data-testid='isLoading' />
			</Container>
		);
	}

	if (paperData.relatedObjects === null || typeof paperData.relatedObjects === 'undefined') {
		paperData.relatedObjects = [];
	}

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
					{paperAdded ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert data-test-id='paper-added-banner' variant='success' className='mt-3'>
									Done! Someone will review your tool and let you know when it goes live
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{paperEdited ? (
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

					{paperData.activeflag === 'review' ? (
						<Row className=''>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert data-test-id='paper-pending-banner' variant='warning' className='mt-3'>
									Your paper is pending review. Only you can see this page.
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					{paperData.isPreprint ? (
						<Row className='mt-4'>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<Alert variant='warning' className='mt-3' data-testid='preprintAlert'>
									This article is a preprint. It may not have been peer reviewed.
									<span onMouseEnter={handleMouseHover} onMouseLeave={handleMouseHover} className='floatRight'>
										<InfoSVG />
									</span>
									{isHovering && (
										<div className='preprintToolTip'>
											<span className='white-13-semibold'>
												A preprint is a complete scientific manuscript that an author uploads on a public server for free viewing. Initially
												it is posted without peer review, but may acquire feedback or reviews as a preprint, and may eventually be published
												in a peer-reviewed journal. The posting of preprints on public servers allows almost immediate dissemination and
												scientific feedback early in the 'publication' process.
											</span>
										</div>
									)}
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
										<span data-test-id='paper-name' className='black-16' data-testid='title'>
											{paperData.name}
										</span>
									</Col>
								</Row>
								<Row className='margin-top-16'>
									<Col>
										<span className='badge-paper'>
											<SVGIcon name='projecticon' fill={'#3c3c3b'} className='badgeSvg mr-2' viewBox='-2 0 18 18' />
											<span>Paper</span>
										</span>
									</Col>
								</Row>
								<Row className='margin-top-16'>
									<Col xs={12}>
										<span className='gray800-14'>
											{paperData.counter === undefined ? 1 : paperData.counter + 1}
											{paperData.counter === undefined ? ' view' : ' views'}
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
										googleAnalytics.recordEvent('Papers', `Clicked ${key} tab`, `Viewing ${key}`);
									}}>
									<Tab eventKey='about' title={'About'}>
										<Row className='mt-2'>
											<Col>
												<div className='rectangle'>
													<Row>
														<Col>
															<span className='gray800-14-bold'>Details</span>
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2}>
															<span className='gray800-14'>URL</span>
														</Col>
														<Col sm={10}>
															<div>
																{paperData.document_links ? (
																	paperData.document_links.doi.map((paperDoi, i) => (
																		<a
																			data-test-id={`document-links-doi-${i}`}
																			href={paperDoi}
																			rel='noopener noreferrer'
																			target='_blank'
																			className='purple-14 text-break paper-links'>
																			{paperDoi}
																		</a>
																	))
																) : (
																	<a href={paperData.link} rel='noopener noreferrer' target='_blank' className='purple-14 text-break'>
																		{paperData.link}
																	</a>
																)}
																{paperData.document_links &&
																	paperData.document_links.pdf &&
																	paperData.document_links.pdf.map((paperPdf, i) => (
																		<a
																			data-test-id={`document-links-pdf-${i}`}
																			href={paperPdf}
																			rel='noopener noreferrer'
																			target='_blank'
																			className='purple-14 text-break paper-links'>
																			{paperPdf}
																		</a>
																	))}
																{paperData.document_links &&
																	paperData.document_links.html &&
																	paperData.document_links.html.map((paperHtml, i) => (
																		<a
																			data-test-id={`document-links-html-${i}`}
																			href={paperHtml}
																			rel='noopener noreferrer'
																			target='_blank'
																			className='purple-14 text-break paper-links'>
																			{paperHtml}
																		</a>
																	))}
															</div>
														</Col>
													</Row>
													{paperData.isPreprint ? (
														''
													) : (
														<Fragment>
															<Row className='mt-2'>
																<Col sm={2}>
																	<span className='gray800-14'>Journal</span>
																</Col>
																<Col sm={10}>
																	<span data-test-id='paper-journal' className='gray800-14'>
																		{paperData.journal}
																	</span>
																</Col>
															</Row>
															<Row className='mt-2'>
																<Col sm={2}>
																	<span className='gray800-14'>Year</span>
																</Col>
																<Col sm={10}>
																	<span data-test-id='paper-year' className='gray800-14'>
																		{paperData.journalYear}
																	</span>
																</Col>
															</Row>
														</Fragment>
													)}
													{paperData.authorsNew ? (
														<Row className='mt-2'>
															<Col sm={2}>
																<span className='gray800-14'>Authors</span>
															</Col>
															<Col sm={10} className='gray800-14 overflowWrap' data-test-id='paper-authors'>
																{paperData.authorsNew}
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
															{paperData.persons.map(uploader => (
																<span key={uploader.id}>
																	<Uploader key={uploader.id} uploader={uploader} />
																</span>
															))}
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2}>
															<span className='gray800-14'>Keywords</span>
														</Col>
														<Col sm={10}>
															<span className='gray800-14'>
																{!paperData.tags.features || paperData.tags.features.length <= 0
																	? ''
																	: paperData.tags.features.map((feature, i) => {
																			return (
																				<div className='badge-tag' key={i}>
																					<a
																						data-test-id={`keywords-${i}`}
																						className='gray800-14'
																						href={'/search?search=&tab=Papers&paperfeatures=' + feature + '&type=all'}>
																						{feature}
																					</a>
																				</div>
																			);
																	  })}
															</span>
														</Col>
													</Row>
													<Row className='mt-2'>
														<Col sm={2}>
															<span className='gray800-14'>Domain</span>
														</Col>
														<Col sm={10}>
															<span className='gray800-14'>
																{!paperData.tags.topics || paperData.tags.topics.length <= 0
																	? ''
																	: paperData.tags.topics.map((topic, i) => {
																			return (
																				<div className='badge-tag' key={i}>
																					<a
																						data-test-id={`domain-${i}`}
																						className='gray800-14'
																						href={'/search?search=&tab=Papers&papertopics=' + topic + '&type=all'}>
																						{topic}
																					</a>
																				</div>
																			);
																	  })}
															</span>
														</Col>
													</Row>
												</div>
											</Col>
										</Row>
										<Row className='mt-2'>
											<Col>
												<div className='rectangle'>
													<Row>
														<Col>
															<span className='gray800-14-bold'>Abstract</span>
														</Col>
													</Row>
													<Row className='mt-3'>
														<Col>
															<span data-test-id='paper-abstract' className='gray800-14 hdruk-section-body'>
																<ReactMarkdown source={paperData.description} />
															</span>
														</Col>
													</Row>
												</div>
											</Col>
										</Row>

										{!_.isEmpty(paperData.resultsInsights) ? (
											<Row className='mt-2'>
												<Col>
													<div className='rectangle'>
														<Row>
															<Col>
																<span className='gray800-14-bold'>Results/Insights</span>
															</Col>
														</Row>
														<Row className='mt-3'>
															<Col>
																<span data-test-id='paper-results' className='gray800-14 hdruk-section-body'>
																	<ReactMarkdown source={paperData.resultsInsights} />
																</span>
															</Col>
														</Row>
													</div>
												</Col>
											</Row>
										) : (
											''
										)}
									</Tab>

									<Tab eventKey='Discussion' title={`Discussion (${discoursePostCount})`}>
										<DiscourseTopic
											toolId={paperData.id}
											topicId={paperData.discourseTopicId || 0}
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
											<MessageNotFound text='This paper has not been featured on any collections yet.' />
										) : (
											<>
												<MessageNotFound text='This paper appears on the collections below. A collection is a group of resources on the same theme.' />

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
					<ResourcePageButtons data={paperData} userState={userState} />
				</ActionBar>

				<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
			</div>
		</Sentry.ErrorBoundary>
	);
};

export default PaperDetail;
