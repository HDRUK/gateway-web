import * as Sentry from '@sentry/react';
import _, { isEmpty } from 'lodash';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row, Tab, Tabs, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NotificationManager } from 'react-notifications';
import 'react-tabs/style/react-tabs.css';
import { LayoutContent } from '../../../components/Layout';
import LayoutBox from '../../../components/LayoutBox';
import SearchControls from '../../../components/SearchControls';
import SVGIcon from '../../../images/SVGIcon';
import collectionsService from '../../../services/collections';
import dataUseRegistersService from '../../../services/data-use-registers';
import relatedObjectsService from '../../../services/related-objects';
import googleAnalytics from '../../../tracking';
import ActionBar from '../../commonComponents/actionbar/ActionBar';
import CollectionCard from '../../commonComponents/collectionCard/CollectionCard';
import DataSetModal from '../../commonComponents/dataSetModal/DataSetModal';
import ErrorModal from '../../commonComponents/errorModal/ErrorModal';
import Loading from '../../commonComponents/Loading';
import MessageNotFound from '../../commonComponents/MessageNotFound';
import RelatedObject from '../../commonComponents/relatedObject/RelatedObject';
import ResourcePageButtons from '../../commonComponents/resourcePageButtons/ResourcePageButtons';
import SearchBar from '../../commonComponents/searchBar/SearchBar';
import SideDrawer from '../../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../../commonComponents/userMessages/UserMessages';
import DiscourseTopic from '../../discourse/DiscourseTopic';
import '../DataUse.scss';
import About from './About';

export const DataUseView = props => {
	const { t } = useTranslation();

	const [id] = useState('');
	const [dataUseData, setDataUseData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [dataUseAdded, setDataUseAdded] = useState(false);
	const [dataUseEdited, setDataUseEdited] = useState(false);
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

	const dataUseRegisterCounterQuery = dataUseRegistersService.usePatchDataUseRegisterCounter(null, {
		onError: ({ title, message }) => {
			NotificationManager.error(message, title, 10000);
		},
	});

	const dataUseRegisterQuery = dataUseRegistersService.useGetDataUseRegister(null, {
		onError: ({ title, message }) => {
			NotificationManager.error(message, title, 10000);
		},
	});

	const collectionsQuery = collectionsService.useGetCollections(null, {
		onError: ({ title, message }) => {
			NotificationManager.error(message, title, 10000);
		},
	});

	const relatedObjectByTypeQuery = relatedObjectsService.useGetRelatedObjectByType(null, {
		onError: ({ title, message }) => {
			NotificationManager.error(message, title, 10000);
		},
	});

	const relatedObjectQuery = relatedObjectsService.useGetRelatedObject(null, {
		onError: ({ title, message }) => {
			NotificationManager.error(message, title, 10000);
		},
	});

	let showError = false;

	// componentDidMount - on loading of page detail page
	useEffect(() => {
		if (window.location.search) {
			const values = queryString.parse(window.location.search);
			setDataUseAdded(values.dataUseAdded);
			setDataUseEdited(values.dataUseEdited);
		}
		getDataUseDataFromDb();
	}, []);

	// componentDidUpdate - on render of page detail page were id is different
	useEffect(() => {
		if (props.match.params.toolID !== id && id !== '' && !isLoading) {
			getDataUseDataFromDb();
		}
	});

	const showModalHandler = () => {
		showError = true;
	};

	const hideModalHandler = () => {
		showError = false;
	};

	const getDataUseDataFromDb = () => {
		setIsLoading(true);

		dataUseRegisterQuery
			.mutateAsync(props.match.params.datauseID)
			.then(async res => {
				if (_.isNil(res.data)) {
					window.localStorage.setItem('redirectMsg', `Data Use not found for Id: ${props.match.params.datauseID}`);
					props.history.push({ pathname: '/search?search=', search: '' });
				} else {
					const localDataUseData = res.data;
					document.title = localDataUseData.projectTitle.trim();

					const counter = !localDataUseData.counter ? 1 : localDataUseData.counter + 1;
					updateCounter(res.data._id, counter);

					if (!_.isUndefined(localDataUseData.relatedObjects)) {
						const localAdditionalObjInfo = await getAdditionalObjectInfo(localDataUseData.relatedObjects);
						await populateRelatedObjects(localDataUseData, localAdditionalObjInfo);
					}

					setDataUseData(localDataUseData);
					populateCollections(localDataUseData);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const populateCollections = localDataUseData => {
		setIsLoading(true);

		collectionsQuery
			.mutateAsync(localDataUseData.id)
			.then(res => {
				setCollections(res.data.data || []);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const doSearch = e => {
		// fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = `/search?search=${encodeURIComponent(searchString)}`;
	};

	const updateSearchString = searchString => {
		setSearchString(searchString);
	};

	const updateCounter = (id, counter) => {
		dataUseRegisterCounterQuery.mutateAsync({ id, counter });
	};

	const updateDiscoursePostCount = count => {
		setDiscoursePostCount(count);
	};

	const getAdditionalObjectInfo = async additionalObjInfo => {
		const tempObjects = [];
		if (additionalObjInfo) {
			const promises = additionalObjInfo.map(async (object, index) => {
				if (object.objectType === 'course') {
					return relatedObjectByTypeQuery.mutateAsync({ _id: object.objectId, type: 'course' }).then(res => {
						tempObjects.push({
							name: res.data.data[0].title,
							id: object.objectId,
							activeflag: res.data.data[0].activeflag,
						});
					});
				}
				if (object.objectType === 'dataUseRegister') {
					return relatedObjectByTypeQuery.mutateAsync({ _id: object.objectId, type: 'dataUseRegister' }).then(res => {
						tempObjects.push({
							id: object.objectId,
							activeflag: res.data.data[0].activeflag,
							projectTitle: res.data.data[0].projectTitle,
						});
					});
				}

				return relatedObjectQuery.mutateAsync(object.objectId).then(res => {
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
						datasetPublisher,
						datasetLogo,
					});
				});
			});
			await Promise.all(promises);
		}
		return tempObjects;
	};

	const populateRelatedObjects = (localDataUseData, localAdditionalObjInfo) => {
		const tempRelatedObjects = [];

		if (localDataUseData.relatedObjects && localAdditionalObjInfo) {
			localDataUseData.relatedObjects.map(object =>
				localAdditionalObjInfo.forEach(item => {
					if (object.objectId === item.id && item.activeflag === 'active') {
						object.datasetPublisher = item.datasetPublisher;
						object.datasetLogo = item.datasetLogo;
						object.name = item.name || '';
						object.firstname = item.firstname || '';
						object.lastname = item.lastname || '';
						object.projectTitle = item.projectTitle || '';

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

	const doRelatedObjectsQuery = async ({ search, sortBy }) => {
		setRelatedObjectsFiltered([]);
		setRelatedResourcesSort([]);
		setSorting(sortBy);

		const filteredRelatedResourceItems = await filterRelatedResourceItems(relatedObjects, search);

		const validData = filteredRelatedResourceItems.filter(dat => dat.objectType);
		const tempFilteredData = validData.filter(dat => dat.objectType === sortBy || sortBy === 'showAll');

		setRelatedObjectsFiltered(tempFilteredData);
		setRelatedResourcesSort(validData);
	};

	const onRelatedObjectsSearch = value => {
		setRelatedObjectsSearchValue(value);
	};

	const onRelatedObjectsSearchReset = submitForm => {
		setRelatedObjectsSearchValue('');

		submitForm();
	};

	const doRelatedObjectsSearch = React.useCallback(() => {
		doRelatedObjectsQuery({
			search: relatedObjectsSearchValue,
			sortBy: 'showAll',
		});
	}, [relatedObjectsSearchValue]);

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
			}
			return '';
		});

	const handleSort = React.useCallback(
		async (sort, submitForm) => {
			googleAnalytics.recordEvent('Courses', `Sorted related resources by ${sort}`, 'Sort dropdown option changed');

			submitForm();
		},
		[relatedResourcesSort]
	);

	const dropdownProps = {
		onSort: handleSort,
		options: [
			{
				label: t(`sortby.optionsFilters.showAll`, {
					n: relatedResourcesSort.length,
				}),
				value: 'showAll',
			},
		]
			.concat(
				['dataset', 'tool', 'paper', 'dataUseRegister', 'course', 'person'].map(
					item =>
						relatedResourcesSort.filter(dat => dat.objectType === item).length > 0 && {
							label: t(`sortby.optionsFilters.${item}`, {
								n: relatedResourcesSort.filter(dat => dat.objectType === item).length,
							}),
							value: item,
						}
				)
			)
			.filter(item => !!item),
		value: sorting,
	};

	if (isLoading) {
		return (
			<Container>
				<Loading data-testid='isLoading' />
			</Container>
		);
	}

	if (dataUseData.relatedObjects === null || typeof dataUseData.relatedObjects === 'undefined') {
		dataUseData.relatedObjects = [];
	}

	const renderTooltip = props => (
		<Tooltip className='tool-tip' style={{ width: '240px' }}>
			{props}
		</Tooltip>
	);

	console.log(dataUseData);

	return (
		<Sentry.ErrorBoundary fallback={<ErrorModal show={showModalHandler} handleClose={hideModalHandler} />}>
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
					{dataUseAdded && (
						<LayoutContent>
							<Alert data-test-id='datause-added-banner' variant='success' className='mt-3'>
								Done! Someone will review your data use and let you know when it goes live
							</Alert>
						</LayoutContent>
					)}
					{dataUseEdited && (
						<LayoutContent>
							<Alert variant='success' className='mt-3'>
								Done! Your data use has been updated
							</Alert>
						</LayoutContent>
					)}
					{dataUseData.activeflag === 'inReview' && (
						<LayoutContent>
							<Alert data-test-id='datause-pending-banner' variant='warning' className='mt-3'>
								Your data use is pending review. Only you can see this page.
							</Alert>
						</LayoutContent>
					)}
					{dataUseData.activeflag === 'archived' && (
						<LayoutContent>
							<Alert data-test-id='datause-pending-banner' variant='warning' className='mt-3'>
								Your data use is archived. Only you can see this page.
							</Alert>
						</LayoutContent>
					)}
					<Row className='mt-4'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10}>
							{isEmpty(dataUseData) && <MessageNotFound word='data use' retry />}

							{!isEmpty(dataUseData) && (
								<div className='rectangle'>
									<Row>
										<Col>
											<span data-test-id='datause-name' className='black-16' data-testid='title'>
												{dataUseData.projectTitle}
											</span>
											<br />
											<span className='gray800-14'>{dataUseData.organisationName}</span>
										</Col>
									</Row>
									<Row className='margin-top-16'>
										<Col>
											<span className='badge-datause badge-tag badge-datause-bold'>
												<SVGIcon name='datauseicon' width={12} height={12} fill='#fff' /> Data use
											</span>
											{dataUseData.keywords &&
												dataUseData.keywords.map(keyword => (
													<a href={`/search?search=&datausekeywords=${keyword}&tab=Datauses`} className='badge-tag badge-datause-bold'>
														{keyword}
													</a>
												))}
										</Col>
									</Row>
									<Row className='margin-top-16'>
										<Col xs={12}>
											<span className='gray800-14'>
												{dataUseData.counter === undefined ? 1 : dataUseData.counter + 1}
												{dataUseData.counter === undefined ? ' view' : ' views'}
											</span>
										</Col>
									</Row>
								</div>
							)}
						</Col>
						<Col sm={1} lg={10} />
					</Row>
					{!isEmpty(dataUseData) && (
						<Row>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<div>
									<Tabs
										className='tabsBackground gray700-13 margin-bottom-16'
										onSelect={key => {
											googleAnalytics.recordVirtualPageView(`${key} tab`);
											googleAnalytics.recordEvent('Data Use', `Clicked ${key} tab`, `Viewing ${key}`);
										}}>
										<Tab eventKey='about' title='About'>
											<About data={dataUseData} renderTooltip={renderTooltip} />
										</Tab>

										<Tab eventKey='Discussion' title={`Discussion (${discoursePostCount})`}>
											<DiscourseTopic
												toolId={dataUseData.id}
												topicId={dataUseData.discourseTopicId || 0}
												userState={userState}
												onUpdateDiscoursePostCount={updateDiscoursePostCount}
											/>
										</Tab>
										<Tab eventKey='Related resources' title={`Related resources (${relatedObjects.length})`}>
											<>
												<SearchControls
													onSubmit={doRelatedObjectsQuery}
													type='related resources'
													inputProps={{
														onChange: onRelatedObjectsSearch,
														value: relatedObjectsSearchValue,
														onReset: onRelatedObjectsSearchReset,
														onKeyDownEnter: doRelatedObjectsSearch,
													}}
													sortProps={dropdownProps}
												/>
												{relatedObjectsFiltered.length <= 0 ? (
													<LayoutBox mt={2}>
														<MessageNotFound word='related resources' />
													</LayoutBox>
												) : (
													relatedObjectsFiltered.map((object, index) => (
														<span key={index}>
															<RelatedObject
																relatedObject={object}
																objectType={object.objectType}
																activeLink
																showRelationshipAnswer
																datasetPublisher={object.datasetPublisher}
																datasetLogo={object.datasetLogo}
															/>
														</span>
													))
												)}
											</>
										</Tab>
										<Tab eventKey='Collections' title={`Collections (${collections.length})`}>
											{!collections || collections.length <= 0 ? (
												<MessageNotFound text='This data use has not been featured on any collections yet.' />
											) : (
												<>
													<MessageNotFound text='This data use appears on the collections below. A collection is a group of resources on the same theme.' />

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
					)}
				</Container>
				<SideDrawer open={showDrawer} closed={toggleDrawer}>
					<UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />
				</SideDrawer>

				<ActionBar userState={userState}>
					<ResourcePageButtons data={dataUseData} userState={userState} />
				</ActionBar>

				<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
			</div>
		</Sentry.ErrorBoundary>
	);
};

export default DataUseView;
