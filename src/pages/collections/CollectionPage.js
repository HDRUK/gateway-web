// /ShowObjects.js 
import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import queryString from 'query-string';
import {
	Row,
	Col,
	Tabs,
	Tab,
	Container,
	Alert
} from 'react-bootstrap';
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

class CollectionPage extends Component {
	// initialize our state
	state = {
		id: '',
		data: [],
		objectData: [],
		key: 'All',
		reason: '',
		updated: '',
		user: '',
		isLoading: true,
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null
			}
		],
		searchString: '',
		toolCount: 0,
		datasetCount: 0,
		personCount: 0,
		projectCount: 0,
		paperCount: 0,
		collectionAdded: false,
		collectionEdited: false,
		discourseTopic: null,
		discoursePostCount: 0,
		showDrawer: false,
		showModal: false,
		context: {}
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.searchBar = React.createRef();
	}

	componentDidMount() {
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);
			this.setState({ collectionAdded: values.collectionAdded });
			this.setState({ collectionEdited: values.collectionEdited });
		}
		this.getDataSearchFromDb();
	}

	getDataSearchFromDb = () => {
		this.setState({ isLoading: true });
		axios
			.get(
				baseURL + '/api/v1/collections/' + this.props.match.params.collectionID
			)
			.then((res) => {
				this.setState({
					data: res.data.data[0],
					discourseTopic: res.data.discourseTopic
				});
				this.getObjectData(res.data.data[0]);
				this.setState({ isLoading: false });
			});
	};

	getObjectData = async (data) => {
		data.relatedObjects.forEach((object) => {
			if (object.objectType === 'tool') {
				this.getToolData(object.objectId);
			} else if (object.objectType === 'person') {
				this.getPersonData(object.objectId);
			} else if (object.objectType === 'project') {
				this.getProjectData(object.objectId);
			} else if (object.objectType === 'dataset') {
				this.getDatasetData(object.objectId);
			} else if (object.objectType === 'paper') {
				this.getPaperData(object.objectId);
			}
		});
		this.setState({ isLoading: false });
	};

	getToolData = async (toolID) => {
		this.setState({ isLoading: true });
		await Promise.all([
			axios.get(baseURL + '/api/v1/tools/' + toolID).then((res) => {
				this.state.objectData.push(res.data.data[0]);
				if (
					res.data.data[0].activeflag === 'active' ||
					(res.data.data[0].activeflag === 'review' &&
						res.data.data[0].authors.includes(this.state.userState[0].id))
				) {
					this.state.toolCount++;
				}
			})
		]);
		this.setState({ objectData: this.state.objectData });
	};

	getPersonData = async (personID) => {
		this.setState({ isLoading: true });
		await Promise.all([
			axios.get(baseURL + '/api/v1/person/' + personID).then((res) => {
				this.state.objectData.push(res.data.data[0]);
				if (
					res.data.data[0].activeflag === 'active' ||
					(res.data.data[0].activeflag === 'review' &&
						res.data.data[0].authors.includes(this.state.userState[0].id))
				) {
					this.state.personCount++;
				}
			})
		]);
		this.setState({ objectData: this.state.objectData });
	};

	getProjectData = async (projectID) => {
		this.setState({ isLoading: true });
		await Promise.all([
			axios.get(baseURL + '/api/v1/projects/' + projectID).then((res) => {
				this.state.objectData.push(res.data.data[0]);
				if (
					res.data.data[0].activeflag === 'active' ||
					(res.data.data[0].activeflag === 'review' &&
						res.data.data[0].authors.includes(this.state.userState[0].id))
				) {
					this.state.projectCount++;
				}
			})
		]);
		this.setState({ objectData: this.state.objectData });
	};

	getDatasetData = async (datasetID) => {
		this.setState({ isLoading: true });
		await Promise.all([
			axios.get(baseURL + '/api/v1/datasets/' + datasetID).then((res) => {
				this.state.objectData.push(res.data.data[0]);
				if (
					res.data.data[0].activeflag === 'active' ||
					(res.data.data[0].activeflag === 'review' &&
						res.data.data[0].authors.includes(this.state.userState[0].id))
				) {
					this.state.datasetCount++;
				}
			})
		]);
		this.setState({ objectData: this.state.objectData });
	};

	getPaperData = async (paperID) => {
		this.setState({ isLoading: true });
		await Promise.all([
			axios.get(baseURL + '/api/v1/papers/' + paperID).then((res) => {
				this.state.objectData.push(res.data.data[0]);
				if (
					res.data.data[0].activeflag === 'active' ||
					(res.data.data[0].activeflag === 'review' &&
						res.data.data[0].authors.includes(this.state.userState[0].id))
				) {
					this.state.paperCount++;
				}
			})
		]);
		this.setState({ objectData: this.state.objectData });
	};

	doGetUsersCall() {
		return new Promise((resolve, reject) => {
			axios.get(baseURL + '/api/v1/users').then((res) => {
				this.setState({ combinedUsers: res.data.data });
				resolve();
			});
		});
	}

	handleSelect = (key) => {
		this.setState({ key: key });
	};

	doSearch = (e) => {
		//fires on enter on searchbar
		if (e.key === 'Enter')
			window.location.href = '/search?search=' + this.state.searchString;
	};

	updateSearchString = (searchString) => {
		this.setState({ searchString: searchString });
	};

	updateDiscoursePostCount = (count) => {
		this.setState({ discoursePostCount: count });
	}

	toggleDrawer = () => {
		this.setState((prevState) => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
		});
	};

	toggleModal = (showEnquiry = false, context = {}) => {
        this.setState( ( prevState ) => {
            return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
        });
    }

	render() {
		const {
			searchString,
			data,
			objectData,
			isLoading,
			userState,
			toolCount,
			datasetCount,
			personCount,
			projectCount,
			paperCount,
			collectionAdded,
			collectionEdited,
			discoursePostCount,
			showDrawer,
			showModal,
			context
		} = this.state;
		var { key } = this.state;
		var allCount =
			toolCount + datasetCount + personCount + projectCount + paperCount;

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
					ref={this.searchBar}
					searchString={searchString}
					doSearchMethod={this.doSearch}
					doUpdateSearchString={this.updateSearchString}
					doToggleDrawer={this.toggleDrawer}
					userState={userState}
				/>
				<div className='rectangle pixelGapTop pixelGapBottom'>
					<Container>
						{collectionAdded ? (
							<Row>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<Alert variant='success' className='mt-3'>
										This collection is now live. Share the collection link to allow anyone to view this page.
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

						{data.activeflag === 'archive' ? (
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

						<Row>
							<Col sm={1} lg={1} />
							
							{!data.imageLink || data.imageLink === 'https://' ? (
									<div id="defaultCollectionImage" className="margin-right-1" />
							) : (
									<img
										src={data.imageLink}
										alt='collectionLogo'
										id='collectionImage'
										className="margin-right-1"
									/>
							)}

							<Col
								className = 'titleWidth'
							> 
								<Row>
									<Col
										sm={9}
										lg={9}
										className = 'collectionTitleCard'
									>
										<span className='black-28 collectionTitleText'>
											{' '}
											{data.name}{' '}
										</span>
									</Col>
									<Col
										sm={2}
										lg={2}
										className = 'collectionDate collectionTitleCard'
									>
										<span className='gray700-13'>
											Created {moment(data.createdAt).format('MMM YYYY')}{' '}
										</span>
									</Col>
								</Row>

								<Row>
									<Col
										sm={12}
										lg={12}
										className = 'collectionTitleCard'
									>
										{data.persons.map((person, index) => {
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
								<ReactMarkdown source={data.description} />
							</Col>
							<Col sm={1} lg={1} />
						</Row>
					</Container>
				</div>

				<div>
					<Tabs
						className='tabsBackground gray700-13'
						activeKey={key}
						onSelect={this.handleSelect}
					>
						<Tab eventKey='All' title={'All (' + allCount + ')'}></Tab>
						<Tab
							eventKey='Datasets'
							title={'Datasets (' + datasetCount + ')'}
						></Tab>
						<Tab eventKey='Tools' title={'Tools (' + toolCount + ')'}></Tab>
						<Tab eventKey='Papers' title={'Papers (' + paperCount + ')'}></Tab>
						<Tab
							eventKey='Projects'
							title={'Projects (' + projectCount + ')'}
						></Tab>
						<Tab eventKey='People' title={'People (' + personCount + ')'}></Tab>
						<Tab eventKey="Collaboration" title={`Discussion (${discoursePostCount})`}>
							<Container className='resource-card'>
								<Row>
									<Col sm={1} lg={1} />
									<Col sm={10} lg={10}>
									<DiscourseTopic
										collectionId={data.id}
										topicId={data.discourseTopicId || 0}
										userState={userState}
										onUpdateDiscoursePostCount={this.updateDiscoursePostCount}>
									</DiscourseTopic>
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
							{key === 'All'
								? objectData.map((object) => {
										if (
											object.activeflag === 'active' ||
											(object.activeflag === 'review' &&
												object.authors.includes(userState[0].id))
										) {
											var reason = '';
											var updated = '';
											var user = '';
											let showAnswer = false;

											data.relatedObjects.forEach((dat) => {
												if (
													dat.objectId === object.id ||
													parseInt(dat.objectId) === object.id || 
													dat.objectId === object.datasetid
												) {
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
										} else {
											return null
										}
								  })
								: ''}

							{key === 'Datasets'
								? objectData.map((object) => {
										if (
											object.activeflag === 'active' ||
											(object.activeflag === 'review' &&
												object.authors.includes(userState[0].id))
										) {
											var reason = '';
											var updated = '';
											var user = '';
											let showAnswer = false;
											if (object.type === "dataset") {
												data.relatedObjects.forEach((dat) => {
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
													/>
												);
											} else {
												return null
											}
										} else {
											return null
										}
								  })
								: ''}

							{key === 'Tools'
								? objectData.map((object) => {
										if (
											object.activeflag === 'active' ||
											(object.activeflag === 'review' &&
												object.authors.includes(userState[0].id))
										) {
											var reason = '';
											var updated = '';
											var user = '';
											let showAnswer = false;
											if (object.type === 'tool') {
												data.relatedObjects.forEach((dat) => {
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
											} else {
												return null
											}
										} else {
											return null
										}
								  })
								: ''}

							{key === 'Projects'
								? objectData.map((object) => {
										if (
											object.activeflag === 'active' ||
											(object.activeflag === 'review' &&
												object.authors.includes(userState[0].id))
										) {
											var reason = '';
											var updated = '';
											var user = '';
											let showAnswer = false;
											if (object.type === 'project') {
												data.relatedObjects.forEach((dat) => {
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
											} else {
												return null
											}
										} else {
											return null
										}
								  })
								: ''}

							{key === 'Papers'
								? objectData.map((object) => {
										if (
											object.activeflag === 'active' ||
											(object.activeflag === 'review' &&
												object.authors.includes(userState[0].id))
										) {
											var reason = '';
											var updated = '';
											var user = '';
											let showAnswer = false;
											if (object.type === 'paper') {
												data.relatedObjects.forEach((dat) => {
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
											} else {
												return null
											}
										} else {
											return null
										}
								  })
								: ''}

							{key === 'People'
								? objectData.map((object) => {
										if (
											object.activeflag === 'active' ||
											(object.activeflag === 'review' &&
												object.authors.includes(userState[0].id))
										) {
											var reason = '';
											var updated = '';
											var user = '';
											let showAnswer = false;
											if (object.type === 'person') {
												data.relatedObjects.forEach((dat) => {
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
											} else {
												return null
											}
										} else {
											return null
										}
								  })
								: ''}
						</Col>
						<Col sm={1} lg={10} />
					</Row>
				</Container>
				<SideDrawer open={showDrawer} closed={this.toggleDrawer}>
					<UserMessages
						closed={this.toggleDrawer}
						toggleModal={this.toggleModal}
						drawerIsOpen={this.state.showDrawer}
					/>
				</SideDrawer>

				<DataSetModal 
                    open={showModal} 
                    context={context}
                    closed={this.toggleModal}
                    userState={userState[0]} 
				/>
			</div>
		);
	}
}

export default CollectionPage;
