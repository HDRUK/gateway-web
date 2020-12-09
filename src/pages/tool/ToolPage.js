// /ShowObjects.js
import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import * as Sentry from '@sentry/react';
import { Row, Col, Tabs, Tab, Container, Alert, Button } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import Reviews from '../commonComponents/reviews/Reviews';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import SearchBar from '../commonComponents/searchBar/SearchBar';
import Creators from '../commonComponents/Creators';
import DiscourseTopic from '../discourse/DiscourseTopic';
import 'react-tabs/style/react-tabs.css';
import { baseURL } from '../../configs/url.config';
import { PageView, initGA } from '../../tracking';
import ReactMarkdown from 'react-markdown';
import Rating from 'react-rating';
import moment from 'moment';
import _ from 'lodash';
import DataSetModal from '../commonComponents/dataSetModal/DataSetModal';
import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as EmptyStarIconSvg } from '../../images/starempty.svg';
import { ReactComponent as FullStarIconSvg } from '../../images/star.svg';
import SideDrawer from '../commonComponents/sidedrawer/SideDrawer';
import UserMessages from '../commonComponents/userMessages/UserMessages';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import ResourcePageButtons from '../commonComponents/resourcePageButtons/ResourcePageButtons';
import ErrorModal from '../commonComponents/errorModal/ErrorModal';

class ToolDetail extends Component {
	// initialize our state
	state = {
		id: '',
		data: [],
		reviewData: [],
		key: 'Reviews',
		activeKey: false,
		selectedItem: 'tab-1',
		isLoading: true,
		userState: [
			{
				loggedIn: false,
				role: 'Reader',
				id: null,
				name: null,
			},
		],
		toolAdded: false,
		toolEdited: false,
		reviewAdded: false,
		replyAdded: false,
		discourseTopic: null,
		searchString: '',
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
			this.setState({ toolAdded: values.toolAdded });
			this.setState({ toolEdited: values.toolEdited });
			this.setState({ reviewAdded: values.reviewAdded });
			this.setState({ replyAdded: values.replyAdded });
		}

		initGA('UA-166025838-1');
		PageView();

		this.getDataSearchFromDb();
	}

	// on loading of tool detail page were id is different
	componentDidUpdate() {
		if (this.props.match.params.toolID !== this.state.id && this.state.id !== '' && !this.state.isLoading) {
			this.getDataSearchFromDb();
		}
	}

	getDataSearchFromDb = () => {
		this.setState({ isLoading: true });
		axios
			.get(baseURL + '/api/v1/tools/' + this.props.match.params.toolID)
			.then(async res => {
				this.setState({
					data: res.data.data[0],
					reviewData: res.data.reviewData,
					discourseTopic: res.data.discourseTopic,
				});
				document.title = res.data.data[0].name.trim();

				let counter = !this.state.data.counter ? 1 : this.state.data.counter + 1;
				this.updateCounter(this.props.match.params.toolID, counter);
				if (!_.isUndefined(res.data.data[0].relatedObjects)) {
					await this.getAdditionalObjectInfo(res.data.data[0].relatedObjects);
				}
			})
			.catch(err => {
				//check if request is for a ToolID or a different route such as /add
				if (!isNaN(this.props.match.params.toolID)) {
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

	updateDiscoursePostCount = count => {
		this.setState({ discoursePostCount: count });
	};

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
			userState,
			toolAdded,
			toolEdited,
			reviewAdded,
			replyAdded,
			reviewData,
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

		let ratingsTotal = 0;
		if (reviewData && reviewData.length) {
			reviewData.forEach(review => {
				ratingsTotal = ratingsTotal + review.rating;
			});
		}
		const ratingsCount = reviewData ? reviewData.length : 0;
		const avgRating = reviewData.length > 0 ? ratingsTotal / ratingsCount : '';

		return (
			<Sentry.ErrorBoundary fallback={<ErrorModal show={this.showModal} handleClose={this.hideModal} />}>
				<div>
					<SearchBar
						ref={this.searchBar}
						searchString={searchString}
						doSearchMethod={this.doSearch}
						doUpdateSearchString={this.updateSearchString}
						userState={userState}
						doToggleDrawer={this.toggleDrawer}
					/>
					<Container className='margin-bottom-48'>
						{toolAdded ? (
							<Row className=''>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<Alert variant='success' className='mt-3'>
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

						{data.activeflag === 'review' ? (
							<Row className=''>
								<Col sm={1} lg={1} />
								<Col sm={10} lg={10}>
									<Alert variant='warning' className='mt-3'>
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
											<span className='black-16'>{data.name}</span>
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

											<a href={'/search?search=&tab=Tools&toolcategories=' + data.categories.category}>
												<div className='badge-tag'>{data.categories.category}</div>
											</a>
										</Col>
									</Row>

									<Row className='margin-top-20'>
										<Col xs={12} className='line-height-normal'>
											<span className='gray800-14'>
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
							<Col sm={1} />
							<Col sm={10}>
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
																License
															</Col>
															{data.license ? (
																<Col sm={10} className='gray800-14'>
																	{data.license}
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
																{moment(data.updatedon).format('DD MMM YYYY')}
															</Col>
														</Row>
														{data.uploader ? (
															<Row className='mt-2'>
																<Col sm={2} className='gray800-14'>
																	Uploader
																</Col>
																<Col sm={10} className='gray800-14 overflowWrap'>
																	{data.uploaderIs[0].firstname} {data.uploaderIs[0].lastname}
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
																<a href={'/search?search=&tab=Tools&toolcategories=' + data.categories.category}>
																	<div className='badge-tag'>{data.categories.category}</div>
																</a>
															</Col>
														</Row>
														<Row className='mt-2'>
															<Col sm={2} className='gray800-14'>
																Implementation
															</Col>
															<Col sm={10} className='gray800-14'>
																{!data.programmingLanguage || data.programmingLanguage.length <= 0
																	? ''
																	: data.programmingLanguage.map((obj, i) => {
																			return obj.version !== '' ? (
																				<a href={'/search?search=&tab=Tools&programmingLanguage=' + obj.programmingLanguage}>
																					<div className='badge-version' key={i}>
																						<span>{obj.programmingLanguage}</span>
																						<span>{obj.version}</span>
																					</div>
																				</a>
																			) : (
																				<a href={'/search?search=&tab=Tools&programmingLanguage=' + obj.programmingLanguage}>
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
																{!data.tags.features || data.tags.features.length <= 0 ? (
																	<span className='gray800-14-opacity'>Not specified</span>
																) : (
																	data.tags.features.map(keyword => {
																		return (
																			<a href={'/search?search=&tab=Tools&features=' + keyword}>
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
											<Row className='mt-2'>
												<Col sm={12}>
													<div className='rectangle'>
														<Row className='gray800-14-bold'>
															<Col sm={12}>Authors</Col>
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
										<Tab eventKey='Reviews' title={'Reviews (' + reviewData.length + ')'}>
											<Reviews data={data} userState={userState} reviewData={reviewData} />
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
							<Col sm={1} />
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

					<DataSetModal open={showModal} context={context} closed={this.toggleModal} userState={userState[0]} />

					<ActionBar userState={userState}>
						<ResourcePageButtons data={data} userState={userState} />
					</ActionBar>
				</div>
			</Sentry.ErrorBoundary>
		);
	}
}

export default ToolDetail;
