// /ShowObjects.js

import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import _ from 'lodash';
import queryString from 'query-string';
import { Container, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import moment from 'moment';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import NotFound from '../commonComponents/NotFound';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Loading from '../commonComponents/Loading';
import Creators from '../commonComponents/Creators';
import SVGIcon from '../../images/SVGIcon';
import DiscourseTopic from '../discourse/DiscourseTopic';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import ErrorModal from '../commonComponents/errorModal/ErrorModal';

// import ReactGA from 'react-ga';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import { PageView, initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class ProjectDetail extends Component {
	// initialize our state
	state = {
		searchString: '',
		id: '',
		data: [],
		isLoading: true,
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		],
		projectAdded: false,
		projectEdited: false,
		discourseTopic: null,
		objects: [
			{
				id: '',
				authors: [],
				activeflag: '',
			},
		],
		relatedObjects: [],
		discoursePostCount: 0,
		showDrawer: false,
		showModal: false,
		showError: false,
		context: {},
	};

	constructor(props) {
		super(props);
		this.state.userState = props.userState;
		this.searchBar = React.createRef();
	}

	showModal = () => {
		this.setState({ showError: true });
	};

	hideModal = () => {
		this.setState({ showError: false });
	};

	// on loading of tool detail page
	componentDidMount() {
		if (!!window.location.search) {
			var values = queryString.parse(window.location.search);
			this.setState({ projectAdded: values.projectAdded });
			this.setState({ projectEdited: values.projectEdited });
		}
		this.getDataSearchFromDb();
		initGA('UA-166025838-1');
		PageView();
	}

	// on loading of tool detail page were id is different
	componentDidUpdate() {
		if (this.props.match.params.projectID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
			this.getDataSearchFromDb();
		}
	}

	getDataSearchFromDb = () => {
		this.setState({ isLoading: true });
		axios
			.get(baseURL + '/api/v1/projects/' + this.props.match.params.projectID)
			.then(async res => {
				this.setState({
					data: res.data.data[0],
					discourseTopic: res.data.discourseTopic,
				});
				document.title = res.data.data[0].name.trim();

				let counter = !this.state.data.counter ? 1 : this.state.data.counter + 1;
				this.updateCounter(this.props.match.params.projectID, counter);

				if (!_.isUndefined(res.data.data[0].relatedObjects)) {
					await this.getAdditionalObjectInfo(res.data.data[0].relatedObjects);
				}
			})
			.catch(err => {
				//check if request is for a ProjectID or a different route such as /add
				if (!isNaN(this.props.match.params.projectID)) {
					window.localStorage.setItem('redirectMsg', err.response.data);
				}
				this.props.history.push({ pathname: '/search?search=', search: '' });
			})
			.finally(() => {
				this.setState({ isLoading: false });
			});
	};

	doSearch = e => {
		//fires on enter on searchbar
		if (e.key === 'Enter') window.location.href = '/search?search=' + this.state.searchString;
	};

	updateSearchString = searchString => {
		this.setState({ searchString: searchString });
	};

	updateDiscoursePostCount = count => {
		this.setState({ discoursePostCount: count });
	};

	updateCounter = (id, counter) => {
		axios.post(baseURL + '/api/v1/counter/update', { id, counter });
	};

	getAdditionalObjectInfo = async data => {
		let tempObjects = [];
		if (data) {
			const promises = data.map(async (object, index) => {
				if (object.objectType === 'course') {
					await axios.get(baseURL + '/api/v1/relatedobject/course/' + object.objectId).then(res => {
						tempObjects.push({
							id: object.objectId,
							activeflag: res.data.data[0].activeflag,
						});
					});
				} else {
					await axios.get(baseURL + '/api/v1/relatedobject/' + object.objectId).then(res => {
						let datasetPublisher;
						let datasetLogo;

						{
							!_.isEmpty(res.data.data[0].datasetv2) && _.has(res.data.data[0], 'datasetv2.summary.publisher.name')
								? (datasetPublisher = res.data.data[0].datasetv2.summary.publisher.name)
								: (datasetPublisher = '');
						}
						{
							!_.isEmpty(res.data.data[0].datasetv2) && _.has(res.data.data[0], 'datasetv2.summary.publisher.logo')
								? (datasetLogo = res.data.data[0].datasetv2.summary.publisher.logo)
								: (datasetLogo = '');
						}

						tempObjects.push({
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
		this.setState({ objects: tempObjects });

		this.getRelatedObjects();
	};

	getRelatedObjects() {
		let tempRelatedObjects = [];

		if (this.state.data.relatedObjects && this.state.objects) {
			this.state.data.relatedObjects.map(object =>
				this.state.objects.forEach(item => {
					if (object.objectId === item.id && item.activeflag === 'active') {
						object['datasetPublisher'] = item.datasetPublisher;
						object['datasetLogo'] = item.datasetLogo;

						tempRelatedObjects.push(object);
					}

					if (object.objectId === item.id && item.activeflag === 'review' && item.authors.includes(this.state.userState[0].id)) {
						tempRelatedObjects.push(object);
					}
				})
			);
		}

		this.setState({ relatedObjects: tempRelatedObjects });
	}

	toggleDrawer = () => {
		this.setState(prevState => {
			if (prevState.showDrawer === true) {
				this.searchBar.current.getNumberOfUnreadMessages();
			}
			return { showDrawer: !prevState.showDrawer };
		});
	};

	toggleModal = (showEnquiry = false, context = {}) => {
		this.setState(prevState => {
			return { showModal: !prevState.showModal, context, showDrawer: showEnquiry };
		});
	};

	render() {
		const {
			searchString,
			data,
			isLoading,
			projectAdded,
			projectEdited,
			userState,
			relatedObjects,
			discoursePostCount,
			showDrawer,
			showModal,
			context,
		} = this.state;

		if (isLoading) {
			return (
				<Container>
					<Loading />
				</Container>
			);
		}

		if (data.relatedObjects === null || typeof data.relatedObjects === 'undefined') {
			data.relatedObjects = [];
		}

		return (
			<Sentry.ErrorBoundary fallback={<ErrorModal show={this.showModal} handleClose={this.hideModal} />}>
				<div>
					<SearchBar
						ref={this.searchBar}
						searchString={searchString}
						doSearchMethod={this.doSearch}
						doUpdateSearchString={this.updateSearchString}
						doToggleDrawer={this.toggleDrawer}
						userState={userState}
					/>
					<Container className='margin-bottom-48'>
						{projectAdded ? (
							<Row className=''>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<Alert variant='success' className='mt-3'>
										Done! Someone will review your project and let you know when it goes live
									</Alert>
								</Col>
								<Col sm={1} lg={10} />
							</Row>
						) : (
							''
						)}

						{projectEdited ? (
							<Row className=''>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<Alert variant='success' className='mt-3'>
										Done! Your project has been updated
									</Alert>
								</Col>
								<Col sm={1} lg={10} />
							</Row>
						) : (
							''
						)}

						{data.activeflag === 'review' ? (
							<Row className=''>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<Alert variant='warning' className='mt-3'>
										Your project is pending review. Only you can see this page.
									</Alert>
								</Col>
								<Col sm={1} lg={10} />
							</Row>
						) : (
							''
						)}

						{/* <ProjectTitle data={data} activeLink={true}/> */}

						<Row className='mt-4'>
							<Col sm={1} lg={1} />
							<Col sm={10} lg={10}>
								<div className='rectangle'>
									<Row>
										<Col className='line-height-normal'>
											<span className='black-16'>{data.name}</span>
										</Col>
									</Row>
									<Row className='margin-top-16'>
										<Col xs={12}>
											<span className='badge-project'>
												<SVGIcon name='newestprojecticon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Project</span>
											</span>

											<a href={'/search?search=&tab=Projects&projectcategories=' + data.categories.category}>
												<div className='badge-tag'>{data.categories.category}</div>
											</a>
										</Col>
									</Row>

									<Row className='margin-top-20'>
										<Col xs={12} className='line-height-normal'>
											<span className='gray700-14'>
												{data.counter === undefined ? 1 : data.counter + 1}
												{data.counter === undefined ? ' view' : ' views'}
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
									<Tabs className='tabsBackground gray700-13 margin-bottom-16'>
										<Tab eventKey='About' title={'About'}>
											<Row className='mt-2'>
												<Col sm={12} lg={12}>
													<div className='rectangle'>
														<Row className='gray800-14-bold'>
															<Col sm={12}>Description</Col>
														</Row>
														<Row className='mt-3'>
															<Col sm={12} className='gray800-14'>
																<ReactMarkdown source={data.description} />
															</Col>
														</Row>
													</div>
												</Col>
											</Row>

											{!_.isEmpty(data.resultsInsights) ? (
												<Row className='mt-2'>
													<Col sm={12} lg={12}>
														<div className='rectangle'>
															<Row className='gray800-14-bold'>
																<Col sm={12}>Results/Insights</Col>
															</Row>
															<Row className='mt-3'>
																<Col sm={12} className='gray800-14'>
																	<ReactMarkdown source={data.resultsInsights} />
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
																<a href={data.link} rel='noopener noreferrer' target='_blank' className='purple-14'>
																	{data.link}
																</a>
															</Col>
														</Row>
														<Row className='mt-2'>
															<Col sm={2} className='gray800-14'>
																Last update
															</Col>
															<Col sm={10} className='gray800-14'>
																{moment(data.updatedon).format('DD MMM YYYY')}
															</Col>
														</Row>
														{data.uploader ? (
															<Row className='mt-2'>
																<Col sm={2} className='gray800-14'>
																	Uploader
																</Col>
																<Col sm={10} className='gray800-14 overflowWrap'>
																	{data.uploader}
																</Col>
															</Row>
														) : (
															''
														)}
														<Row className='mt-2'>
															<Col sm={2} className='gray800-14'>
																Type
															</Col>
															<Col sm={10} className='gray800-14'>
																<a href={'/search?search=&tab=Projects&projectcategories=' + data.categories.category}>
																	<div className='badge-tag'>{data.categories.category}</div>
																</a>
															</Col>
														</Row>
														<Row className='mt-2'>
															<Col sm={2} className='gray800-14'>
																Keywords
															</Col>
															<Col sm={10} className='gray800-14'>
																{!data.tags.features || data.tags.features.length <= 0 ? (
																	<span className='gray800-14-opacity'>Not specified</span>
																) : (
																	data.tags.features.map(keyword => {
																		return (
																			<a href={'/search?search=&tab=Projects&projectfeatures=' + keyword}>
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
																{!data.tags.topics || data.tags.topics.length <= 0 ? (
																	<span className='gray800-14-opacity'>Not specified</span>
																) : (
																	data.tags.topics.map(domain => {
																		return (
																			<a href={'/search?search=&tab=Projects&projecttopics=' + domain}>
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

											<Row className='mt-2'>
												<Col sm={12}>
													<div className='rectangle'>
														<Row className='gray800-14-bold'>
															<Col sm={12}>Collaborators</Col>
														</Row>
														<Row className='mt-3'>
															{data.persons.map(author => (
																<Col sm={6} key={author.id}>
																	<Creators key={author.id} author={author} />
																</Col>
															))}
														</Row>
													</div>
												</Col>
											</Row>
										</Tab>

										<Tab eventKey='Collaboration' title={`Discussion (${discoursePostCount})`}>
											<DiscourseTopic
												toolId={data.id}
												topicId={data.discourseTopicId || 0}
												userState={userState}
												onUpdateDiscoursePostCount={this.updateDiscoursePostCount}
											/>
										</Tab>
										<Tab eventKey='Projects' title={'Related resources (' + relatedObjects.length + ')'}>
											{relatedObjects.length <= 0 ? (
												<NotFound word='related resources' />
											) : (
												relatedObjects.map(object => (
													<RelatedObject
														relatedObject={object}
														activeLink={true}
														showRelationshipAnswer={true}
														datasetPublisher={object.datasetPublisher}
														datasetLogo={object.datasetLogo}
													/>
												))
											)}
										</Tab>
									</Tabs>
								</div>
							</Col>
							<Col sm={1} lg={1} />
						</Row>
					</Container>

					<SideDrawer open={showDrawer} closed={this.toggleDrawer}>
						<UserMessages
							userState={userState[0]}
							closed={this.toggleDrawer}
							toggleModal={this.toggleModal}
							drawerIsOpen={this.state.showDrawer}
						/>
					</SideDrawer>

					<ActionBar userState={userState}>
						<ResourcePageButtons data={data} userState={userState} />
					</ActionBar>

					<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />
				</div>
			</Sentry.ErrorBoundary>
		);
	}
}

export default ProjectDetail;
