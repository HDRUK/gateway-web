import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import queryString from 'query-string';
import { Row, Col, Tabs, Tab, Container, Alert } from 'react-bootstrap';
import Loading from '../commonComponents/Loading';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import 'react-tabs/style/react-tabs.css';
import DiscourseTopic from '../discourse/DiscourseTopic';
import { baseURL } from '../../configs/url.config';
import moment from 'moment';
import _ from 'lodash';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import './Collections.scss';

export const CollectionPage = props => {
	const [collectionData, setCollectionData] = useState([]);
	const [isLoading, setIsLoading] = useState(true); 
	const [toolCount, setToolCount] = useState(0);
	const [datasetCount, setDatasetCount] = useState(0);
	const [personCount, setPersonCount] = useState(0);
	const [projectCount, setProjectCount] = useState(0);
	const [paperCount, setPaperCount] = useState(0);
	const [courseCount, setCourseCount] = useState(0);
	const [collectionAdded, setCollectionAdded] = useState(false);
	const [collectionEdited, setCollectionEdited] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [discoursePostCount, setDiscoursePostCount] = useState(0);
	const [key, setKey] = useState('Datasets'); 
	const [searchBar] = useState(React.createRef());
	const [showDrawer, setShowDrawer] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [context, setContext] = useState({});
	const [objectData, setObjectData] = useState([]);
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

	//componentDidMount - on loading of project detail page
	useEffect(() => {
		if (!!window.location.search) {
			let values = queryString.parse(window.location.search);
			setCollectionAdded(values.collectionAdded);
			setCollectionEdited(values.collectionEdited);
		}
		getCollectionDataFromDb();
	}, []);

	const getCollectionDataFromDb = async () => {
		setIsLoading(true);
		await axios.get(baseURL + '/api/v1/collections/' + props.match.params.collectionID).then(async res => {
			if (_.isNil(res.data)) {
				//redirect user if invalid collection id is supplied
				window.localStorage.setItem('redirectMsg', `Collection not found for Id: ${props.match.params.collectionID}`);
				props.history.push({ pathname: '/search?search=', search: '' });
			} else {
				setCollectionData(res.data.data[0]);
				await getObjectData(res.data.data[0]);
				countEntities();

				setIsLoading(false);
			}
		});
	}; 

	const getObjectData = async data => {
		setIsLoading(true);
		for (const object of data.relatedObjects) { 
			await genericGetEntityData(object);
		}
	};

	const genericGetEntityData = async object => {
		setIsLoading(true);
		const entityID = object.objectId;
		let entityType = object.objectType;
		let objectsToAdd = objectData;
		//Pluralise all entity types except person and course
		if (entityType !== 'person' && entityType !== 'course') {
			entityType += 's';
		}
		await axios.get(baseURL + '/api/v1/' + entityType + '/' + entityID).then(async res => {
			//extract standard result object from api
			let result = entityType === 'datasets' ? res.data.data : entityType === 'person' ? res.data.person : res.data.data[0];
			objectsToAdd.push(result);
			if (result.activeflag === 'active' || (result.activeflag === 'review' && result.authors.includes(userState[0].id))) {
				setObjectData(objectsToAdd);
			}
		});
	};

	const countEntities = () => {
		const entityCounts = objectData.reduce((entityCountsByType, currentValue) => { 
			let type = currentValue.type;
			if (!entityCountsByType.hasOwnProperty(type)) { 
				entityCountsByType[type] = 0;
			}
			entityCountsByType[type]++;
			return entityCountsByType;
		}, {});

		let key;
		if(entityCounts.dataset > 0){
			key = 'Datasets' 
		} else if (entityCounts.tool > 0){
			key = 'Tools' 
		} else if (entityCounts.paper > 0){
			key = 'Papers' 
		} else if (entityCounts.project > 0){
			key = 'Projects' 
		} else if (entityCounts.person > 0){
			key = 'People' 
		} else if (entityCounts.course > 0){
			key = 'Course' 
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
		//fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = '/search?search=' + searchString;
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

	let datasetPublisher;
	let datasetLogo;

	if (isLoading) {
		return (
			<Container>
				<Loading data-testid='isLoading' />
			</Container>
		);
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
			<div className='rectangle pixelGapTop pixelGapBottom'>
				<Container>
					{collectionAdded ? (
						<Row>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10} className='pad-left-0'>
								<Alert variant='success' className='mt-3'>
									This collection is now live. Anyone with the link can see this page.
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
								<Alert variant='success' className='mt-3'>
									Done! Your collection has been updated.
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
								<Alert variant='danger' className='mt-3'>
									This collection has been archived
								</Alert>
							</Col>
							<Col sm={1} lg={10} />
						</Row>
					) : (
						''
					)}

					<Row className='margin-top-16'>
						<Col sm={1} lg={1} />

						{!collectionData.imageLink || collectionData.imageLink === 'https://' ? (
							<div id='defaultCollectionImage' className='margin-right-1' />
						) : (
							<img src={collectionData.imageLink} alt='collectionLogo' id='collectionImage' className='margin-right-1' />
						)}

						<Col className='titleWidth'>
							<Row>
								<Col sm={9} lg={9} className='collectionTitleCard'>
									<span className='black-28 collectionTitleText' data-testid='collectionName' > {collectionData.name} </span>
								</Col>
								<Col sm={2} lg={2} className='collectionDate collectionTitleCard'>
									<span className='gray700-13' data-testid='collectionCreated'>Created {moment(collectionData.createdAt).format('MMM YYYY')} </span>
								</Col>
							</Row>

							<Row>
								<Col sm={10} lg={10} className='collectionTitleCard'>
									{collectionData.persons.map((person, index) => {
										if (index > 0) {
											return (
												<span className='gray800-14' key={index}>
													, {person.firstname} {person.lastname}
												</span>
											);
										} else {
											return (
												<span className='gray800-14' key={index}>
													{person.firstname} {person.lastname}
												</span>
											);
										} 
									})}
								</Col>
							</Row>
						</Col>
					</Row>

					<Row className='pad-top-32'>
						<Col sm={1} lg={1} />
						<Col sm={10} lg={10} className='gray800-14'>
							<ReactMarkdown source={collectionData.description} data-testid='collectionDescription' />
						</Col>
						<Col sm={1} lg={1} />
					</Row>
				</Container>
			</div>

			<div>
				<Tabs className='tabsBackground gray700-13' activeKey={key} onSelect={handleSelect} data-testid='collectionPageTabs'>
					<Tab eventKey='Datasets' title={'Datasets (' + datasetCount + ')'}></Tab>
					<Tab eventKey='Tools' title={'Tools (' + toolCount + ')'}></Tab>
					<Tab eventKey='Papers' title={'Papers (' + paperCount + ')'}></Tab>
					<Tab eventKey='Projects' title={'Projects (' + projectCount + ')'}></Tab>
					<Tab eventKey='People' title={'People (' + personCount + ')'}></Tab>
					<Tab eventKey='Course' title={'Course (' + courseCount + ')'}></Tab>
					<Tab eventKey='Collaboration' title={`Discussion (${discoursePostCount})`}>
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
				<Row>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						{key === 'Datasets'
							? objectData.map(object => {
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
											{
												!_.isEmpty(object.datasetv2) && _.has(object, 'datasetv2.summary.publisher.name')
													? (datasetPublisher = object.datasetv2.summary.publisher.name)
													: (datasetPublisher = '');
											}
											{
												!_.isEmpty(object.datasetv2) && _.has(object, 'datasetv2.summary.publisher.logo')
													? (datasetLogo = object.datasetv2.summary.publisher.logo)
													: (datasetLogo = '');
											}

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

						{key === 'Tools'
							? objectData.map(object => {
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

						{key === 'Projects'
							? objectData.map(object => {
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
													key={object.idd}
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

						{key === 'Papers'
							? objectData.map(object => {
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

						{key === 'People'
							? objectData.map(object => {
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

						{key === 'Course'
							? objectData.map(object => {
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
					</Col>
					<Col sm={1} lg={10} />
				</Row>
			</Container>
			<SideDrawer open={showDrawer} closed={toggleDrawer}>
				<UserMessages userState={userState[0]} closed={toggleDrawer} toggleModal={toggleModal} drawerIsOpen={showDrawer} />  
			</SideDrawer>

			<DataSetModal open={showModal} context={context} closed={toggleModal} userState={userState[0]} />
		</div>
	);
};

export default CollectionPage;
