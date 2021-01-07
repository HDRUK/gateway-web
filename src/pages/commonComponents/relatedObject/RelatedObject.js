import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import Loading from '../Loading';
import SVGIcon from '../../../images/SVGIcon';
import './RelatedObject.scss';
import moment from 'moment';
import { ReactComponent as CalendarSvg } from '../../../images/calendaricon.svg';
import _ from 'lodash';

var baseURL = require('../BaseURL').getURL();
var cmsURL = require('../BaseURL').getCMSURL();
const env = require('../BaseURL').getURLEnv();

class RelatedObject extends React.Component {
	state = {
		relatedObject: [],
		reason: '',
		// user: '',
		// updated: '' ,
		data: [],
		activeLink: true,
		onSearchPage: false,
		isLoading: true,
		didDelete: false,
		inCollection: false,
		publisherLogoURL: '',
	};

	constructor(props) {
		super(props);
		this.state.activeLink = props.activeLink;
		this.state.onSearchPage = props.onSearchPage;
		if (props.didDelete) {
			this.state.didDelete = props.didDelete;
		}
		if (props.inCollection) {
			this.state.inCollection = props.inCollection;
		}
		if (props.data) {
			this.state.data = props.data || [];
			this.state.isLoading = false;
		} else if (props.objectId) {
			this.state.relatedObject = props.relatedObject;
			this.state.reason = props.reason;
			this.getRelatedObjectFromDb(props.objectId, props.objectType);
		} else {
			this.state.relatedObject = props.relatedObject;
			this.getRelatedObjectFromDb(this.state.relatedObject.objectId, this.state.relatedObject.objectType);
		}
	}

	async componentDidMount() {
		if (this.props.datasetPublisher) {
			await this.updatePublisherLogo(this.props.datasetPublisher);
		}
	}

	updatePublisherLogo(publisher) {
		let url = env === 'local' ? 'https://uatbeta.healthdatagateway.org' : cmsURL;
		let publisherLogoURL = url + '/images/publisher/' + publisher;

		this.setState({ publisherLogoURL: publisherLogoURL });
	}

	removeCard = (id, reason, type) => {
		this.setState({
			reason: reason,
		});

		this.getRelatedObjectFromDb(id, type);
	};

	getRelatedObjectFromDb = (id, type) => {
		//need to handle error if no id is found
		this.setState({ isLoading: true });

		if (type === 'course') {
			axios.get(baseURL + '/api/v1/relatedobject/course/' + id).then(res => {
				this.setState({
					data: res.data.data[0],
					isLoading: false,
				});
			});
		} else {
			axios.get(baseURL + '/api/v1/relatedobject/' + id).then(res => {
				this.setState({
					data: res.data.data[0],
					isLoading: false,
				});
			});
		}
	};

	removeButton = () => {
		if (this.state.data.type === 'dataset') {
			// if removing an archived dataset, use the old datasetId for deletion
			let datasetId = this.state.data.oldDatasetId ? this.state.data.oldDatasetId : this.state.data.datasetid;
			this.props.doRemoveObject(this.state.data.pid, this.state.data.type, datasetId);
		} else {
			this.props.doRemoveObject(this.state.data.id, this.state.data.type);
		}
	};

	handleChange = (id, reason, type) => {
		this.setState({ reason: reason });
		this.props.doUpdateReason(id, reason, type);
	};

	updateOnFilterBadge = (filter, option) => {
		this.props.updateOnFilterBadge(filter, option);
	};

	render() {
		const { data, isLoading, activeLink, onSearchPage, relatedObject, inCollection, publisherLogoURL } = this.state;

		let publisherLogo;

		if (this.props.datasetPublisher || this.props.datasetLogo) {
			publisherLogo = !_.isEmpty(this.props.datasetLogo) ? this.props.datasetLogo : publisherLogoURL;
		}

		if (isLoading) {
			return <Loading />;
		}

		if (this.props.didDelete) {
			this.props.updateDeleteFlag();
			this.removeCard(this.props.objectId, this.props.reason, this.props.objectType);
		}

		var rectangleClassName = 'collection-rectangle';
		if (
			this.props.tempRelatedObjectIds &&
			(this.props.tempRelatedObjectIds.some(object => object.objectId === data.id) ||
				this.props.tempRelatedObjectIds.some(object => object.objectId === data.datasetid))
		) {
			rectangleClassName = 'collection-rectangle selectedBorder';
		} else if (this.props.showRelationshipQuestion) {
			rectangleClassName = 'collection-rectangleWithBorder';
		}

		return (
			<Row className='resource-card-row'>
				<Col>
					<div
						className={rectangleClassName}
						onClick={() =>
							!activeLink &&
							!this.props.showRelationshipQuestion &&
							!this.props.showRelationshipAnswer &&
							this.props.doAddToTempRelatedObjects(data.type === 'dataset' ? data.datasetid : data.id, data.type, data.pid)
						}>
						{data.activeflag === 'review' ? (
							<Row>
								<Col sm={12} lg={12}>
									<Alert variant='warning' className='ml-4 mr-4'>
										This resource is under review. It won't be visible to others until it is approved.
									</Alert>
								</Col>
							</Row>
						) : (
							''
						)}

						{(() => {
							if (data.type === 'tool') {
								return (
									<Row className='noMargin'>
										<Col sm={10} lg={10} className='pad-left-24'>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/tool/' + data.id}>
													{data.name}
												</a>
											) : (
												<span className='black-bold-16'> {data.name}</span>
											)}
											<br />
											{!data.persons || data.persons <= 0 ? (
												<span className='gray800-14'>Author not listed</span>
											) : (
												data.persons.map((person, index) => {
													if (index > 0) {
														if (activeLink === true) {
															return (
																<>
																	<span className='reviewTitleGap gray800-14'>·</span>
																	<a className='gray800-14' href={'/person/' + person.id}>
																		{person.firstname} {person.lastname}
																	</a>
																</>
															);
														} else {
															return (
																<span className='gray800-14'>
																	, {person.firstname} {person.lastname}{' '}
																</span>
															);
														}
													} else {
														if (activeLink === true) {
															return (
																<a className='gray800-14' href={'/person/' + person.id}>
																	{person.firstname} {person.lastname}
																</a>
															);
														} else {
															return (
																<span className='gray800-14'>
																	{person.firstname} {person.lastname}
																</span>
															);
														}
													}
												})
											)}
										</Col>
										<Col sm={2} lg={2} className='pad-right-24'>
											{this.props.showRelationshipQuestion ? (
												<Button variant='medium' className='soft-black-14' onClick={this.removeButton}>
													<SVGIcon name='closeicon' fill={'#979797'} className='buttonSvg mr-2' />
													Remove
												</Button>
											) : (
												''
											)}
										</Col>
										<Col className='pad-left-24 pad-right-24 pad-top-16'>
											<span className='badge-tool'>
												<SVGIcon name='newtoolicon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Tool</span>
											</span>

											{!data.categories.category ? (
												''
											) : activeLink === true ? (
												onSearchPage === true ? (
													<span
														className='pointer'
														onClick={event => this.updateOnFilterBadge('toolCategoriesSelected', data.categories.category)}>
														<div className='badge-tag'>{data.categories.category}</div>
													</span>
												) : (
													<a href={'/search?search=&tab=Tools&toolcategories=' + data.categories.category}>
														<div className='badge-tag'>{data.categories.category}</div>
													</a>
												)
											) : (
												<div className='badge-tag'>{data.categories.category}</div>
											)}

											{!data.programmingLanguage || data.programmingLanguage.length <= 0
												? ''
												: data.programmingLanguage.map((p, i) => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span
																		className='pointer'
																		onClick={event => this.updateOnFilterBadge('languageSelected', p.programmingLanguage)}>
																		<div className='badge-version' key={i}>
																			<span>{p.programmingLanguage}</span>
																			<span>{p.version}</span>
																		</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Tools&programmingLanguage=' + p.programmingLanguage}>
																		<div className='badge-version' key={i}>
																			<span>{p.programmingLanguage}</span>
																			<span>{p.version}</span>
																		</div>
																	</a>
																);
															}
														} else {
															return (
																<div className='badge-version' key={i}>
																	<span>{p.programmingLanguage}</span>
																	<span>{p.version}</span>
																</div>
															);
														}
												  })}

											{!data.tags.features || data.tags.features.length <= 0
												? ''
												: data.tags.features.map(feature => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('featuresSelected', feature)}>
																		<div className='badge-tag'>{feature}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Tools&features=' + feature}>
																		<div className='badge-tag'>{feature}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{feature}</div>;
														}
												  })}

											{!data.tags.topics || data.tags.topics.length <= 0
												? ''
												: data.tags.topics.map(topic => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('toolTopicsSelected', topic)}>
																		<div className='badge-tag'>{topic}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Tools&tooltopics=' + topic}>
																		<div className='badge-tag'>{topic}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{topic}</div>;
														}
												  })}
										</Col>
										{!this.props.showRelationshipQuestion && (
											<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-24 pad-bottom-16'>
												<span className='gray800-14'>{data.description.substr(0, 255) + (data.description.length > 255 ? '...' : '')}</span>
											</Col>
										)}
									</Row>
								);
							} else if (data.type === 'project') {
								return (
									<Row className='noMargin'>
										<Col sm={10} lg={10} className='pad-left-24'>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/project/' + data.id}>
													{data.name}
												</a>
											) : (
												<span className='black-bold-16'> {data.name}</span>
											)}
											<br />
											{!data.persons || data.persons <= 0 ? (
												<span className='gray800-14'>Author not listed</span>
											) : (
												data.persons.map((person, index) => {
													if (index > 0) {
														if (activeLink === true) {
															return (
																<>
																	<span className='reviewTitleGap gray800-14'>·</span>
																	<a className='gray800-14' href={'/person/' + person.id}>
																		{person.firstname} {person.lastname}
																	</a>
																</>
															);
														} else {
															return (
																<span className='gray800-14'>
																	, {person.firstname} {person.lastname}
																</span>
															);
														}
													} else {
														if (activeLink === true) {
															return (
																<a className='gray800-14' href={'/person/' + person.id}>
																	{person.firstname} {person.lastname}
																</a>
															);
														} else {
															return (
																<span className='gray800-14'>
																	{person.firstname} {person.lastname}
																</span>
															);
														}
													}
												})
											)}
										</Col>
										<Col sm={2} lg={2} className='pad-right-24'>
											{this.props.showRelationshipQuestion ? (
												<Button variant='medium' className='soft-black-14' onClick={this.removeButton}>
													<SVGIcon name='closeicon' fill={'#979797'} className='buttonSvg mr-2' />
													Remove
												</Button>
											) : (
												''
											)}
										</Col>
										<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
											<span className='badge-project'>
												<SVGIcon name='newestprojecticon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Project</span>
											</span>

											{!data.categories.category ? (
												''
											) : activeLink === true ? (
												onSearchPage === true ? (
													<span
														className='pointer'
														onClick={event => this.updateOnFilterBadge('projectCategoriesSelected', data.categories.category)}>
														<div className='badge-tag'>{data.categories.category}</div>
													</span>
												) : (
													<a href={'/search?search=&tab=Projects&projectcategories=' + data.categories.category}>
														<div className='badge-tag'>{data.categories.category}</div>
													</a>
												)
											) : (
												<div className='badge-tag'>{data.categories.category}</div>
											)}

											{!data.tags.features || data.tags.features.length <= 0
												? ''
												: data.tags.features.map(feature => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('projectFeaturesSelected', feature)}>
																		<div className='badge-tag'>{feature}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Projects&projectfeatures=' + feature}>
																		<div className='badge-tag'>{feature}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{feature}</div>;
														}
												  })}

											{!data.tags.topics || data.tags.topics.length <= 0
												? ''
												: data.tags.topics.map(topic => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('projectTopicsSelected', topic)}>
																		<div className='badge-tag'>{topic}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Projects&projecttopics=' + topic}>
																		<div className='badge-tag'>{topic}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{topic}</div>;
														}
												  })}
										</Col>
										{!this.props.showRelationshipQuestion && (
											<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-24 pad-bottom-16'>
												<span className='gray800-14'>{data.description.substr(0, 255) + (data.description.length > 255 ? '...' : '')}</span>
											</Col>
										)}
									</Row>
								);
							} else if (data.type === 'paper') {
								return (
									<Row className='noMargin'>
										<Col sm={10} lg={10} className='pad-left-24'>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/paper/' + data.id}>
													{data.name}
												</a>
											) : (
												<span className='black-bold-16'> {data.name}</span>
											)}
											<br />
											{!data.persons || data.persons <= 0 ? (
												<span className='gray800-14'>Author not listed</span>
											) : (
												data.persons.map((person, index) => {
													if (index > 0) {
														if (activeLink === true) {
															return (
																<>
																	<span className='reviewTitleGap gray800-14'>·</span>
																	<a className='gray800-14' href={'/person/' + person.id}>
																		{person.firstname} {person.lastname}
																	</a>
																</>
															);
														} else {
															return (
																<span className='gray800-14'>
																	, {person.firstname} {person.lastname}
																</span>
															);
														}
													} else {
														if (activeLink === true) {
															return (
																<a className='gray800-14' href={'/person/' + person.id}>
																	{person.firstname} {person.lastname}
																</a>
															);
														} else {
															return (
																<span className='gray800-14'>
																	{person.firstname} {person.lastname}
																</span>
															);
														}
													}
												})
											)}
										</Col>
										<Col sm={2} lg={2} className='pad-right-24'>
											{this.props.showRelationshipQuestion ? (
												<Button variant='medium' className='soft-black-14' onClick={this.removeButton}>
													<SVGIcon name='closeicon' fill={'#979797'} className='buttonSvg mr-2' />
													Remove
												</Button>
											) : (
												''
											)}
										</Col>
										<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
											<span className='badge-paper'>
												<SVGIcon name='newprojecticon' fill={'#3c3c3b'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Paper</span>
											</span>
											{!data.tags.features || data.tags.features.length <= 0
												? ''
												: data.tags.features.map(feature => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('paperFeaturesSelected', feature)}>
																		<div className='badge-tag'>{feature}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Papers&paperfeatures=' + feature}>
																		<div className='badge-tag'>{feature}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{feature}</div>;
														}
												  })}

											{!data.tags.topics || data.tags.topics.length <= 0
												? ''
												: data.tags.topics.map(topic => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('paperTopicsSelected', topic)}>
																		<div className='badge-tag'>{topic}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Projects&papertopics=' + topic}>
																		<div className='badge-tag'>{topic}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{topic}</div>;
														}
												  })}
										</Col>
										{!this.props.showRelationshipQuestion && (
											<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-24 pad-bottom-16'>
												<span className='gray800-14'>{data.description.substr(0, 255) + (data.description.length > 255 ? '...' : '')}</span>
											</Col>
										)}
									</Row>
								);
							} else if (data.type === 'person') {
								return (
									<Row className='noMargin pad-left-24'>
										<Col className='iconHolder noPadding widthAuto'>
											<div class='avatar-circle'>
												<span class='initials'>
													{' '}
													{data.firstname ? data.firstname.charAt(0).toUpperCase() : ''}
													{data.lastname ? data.lastname.charAt(0).toUpperCase() : ''}
												</span>
											</div>
										</Col>
										<Col className='pad-left-8' sm={8} lg={9}>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/person/' + data.id}>
													{data.firstname && data.lastname ? data.firstname + ' ' + data.lastname : ''}
												</a>
											) : (
												<span className='black-bold-16'>
													{' '}
													{data.firstname && data.lastname ? data.firstname + ' ' + data.lastname : ''}{' '}
												</span>
											)}
											<br />
											<span className='gray800-14'> {data.bio} </span>
										</Col>
										<Col sm={2} lg={2} className='pad-right-24'>
											{this.props.showRelationshipQuestion ? (
												<Button variant='medium' className='soft-black-14' onClick={this.removeButton}>
													<SVGIcon name='closeicon' fill={'#979797'} className='buttonSvg mr-2' />
													Remove
												</Button>
											) : (
												''
											)}
										</Col>
									</Row>
								);
							} else if (data.type === 'course') {
								return (
									<Row className='noMargin'>
										<Col sm={10} lg={10} className='pad-left-24'>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/course/' + data.id}>
													{data.title}
												</a>
											) : (
												<span className='black-bold-16'>{data.title}</span>
											)}
											<br />
											<span className='gray800-14'>{data.provider}</span>
											<Row className='margin-top-8'>
												<Col sm={12} lg={12}>
													<CalendarSvg className='calendarSVG' />
													<span className='gray800-14 margin-left-10'>
														{(() => {
															let courseRender = [];
															if (onSearchPage === true) {
																if ( _.has(data.courseOptions, 'startDate') && _.isObject(data.courseOptions.startDate) ) {
																	courseRender.push(
																		<span> Starts {moment(data.courseOptions.startDate).format('dddd Do MMMM YYYY')} </span>
																	);
																} else {
																	courseRender.push(<span> Flexible dates </span>);
																}
																if ( _.has(data.courseOptions, 'studyMode') && _.isString(data.courseOptions.studyMode) )
																	courseRender.push(<span> | {data.courseOptions.studyMode} </span>);
															} else {
																if ( _.has(data.courseOptions[0], 'startDate') && _.isObject(data.courseOptions[0].startDate) ) {
																	courseRender.push(
																		<span> Starts {moment(data.courseOptions[0].startDate).format('dddd Do MMMM YYYY')} </span>
																	);
																} else {
																	courseRender.push(<span> Flexible dates </span>);
																}
																if ( _.has(data.courseOptions[0], 'studyMode') && _.isString(data.courseOptions[0].studyMode) )
																	courseRender.push('|');

																!_.isEmpty(data.courseOptions[0]) &&
																	data.courseOptions.map((courseOption, index) => {
																		courseRender.push(
																			<>{index > 0 ? <span> ,{courseOption.studyMode} </span> : <span> {courseOption.studyMode} </span>}</>
																		);
																	});
															}
															return <>{courseRender}</>;
														})()}
													</span>
												</Col>
											</Row>
										</Col>
										<Col sm={2} lg={2} className='pad-right-24'>
											{this.props.showRelationshipQuestion ? (
												<Button variant='medium' className='soft-black-14' onClick={this.removeButton}>
													<SVGIcon name='closeicon' fill={'#979797'} className='buttonSvg mr-2' />
													Remove
												</Button>
											) : (
												''
											)}
										</Col>
										<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
											<span className='badge-course'>
												<SVGIcon name='educationicon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Course</span>
											</span>

											{!data.award || data.award.length <= 0
												? ''
												: data.award.map(award => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('courseAwardSelected', award)}>
																		<div className='badge-tag'>{award}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Courses&courseaward=' + award}>
																		<div className='badge-tag'>{award}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{award}</div>;
														}
												  })}

											{!data.domains || data.domains.length <= 0
												? ''
												: data.domains.map(domain => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('courseDomainsSelected', domain)}>
																		<div className='badge-tag'>{domain}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Courses&coursedomains=' + domain}>
																		<div className='badge-tag'>{domain}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{domain}</div>;
														}
												  })}
										</Col>
										{!this.props.showRelationshipQuestion && (
											<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-24 pad-bottom-16'>
												<span className='gray800-14'>{data.description.substr(0, 255) + (data.description.length > 255 ? '...' : '')}</span>
											</Col>
										)}
									</Row>
								);
							} else {
								//default to dataset
								const phenotypesSelected = queryString.parse(window.location.search).phenotypes
									? queryString.parse(window.location.search).phenotypes.split('::')
									: [];
								const searchTerm = queryString.parse(window.location.search).search ? queryString.parse(window.location.search).search : '';
								const phenotypesSeached = data.datasetfields.phenotypes.filter(
									phenotype => phenotype.name.toLowerCase() === searchTerm.toLowerCase()
								);
								return (
									<Row className='noMargin'>
										<Col sm={10} lg={10} className='pad-left-24'>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/dataset/' + data.pid}>
													{data.name}
												</a>
											) : (
												<span className='black-bold-16'> {data.name} </span>
											)}
											<br />
											{!_.isEmpty(data.datasetv2) ? (
												<>
													{!_.isNil(data.datasetv2.summary.publisher.memberOf) ? (
														<span>
															<SVGIcon name='shield' fill={'#475da7'} className='svg-16 mr-2' viewBox='0 0 16 16' />
														</span>
													) : (
														''
													)}
													<span
														className='gray800-14'
														style={{ cursor: 'pointer' }}
														onClick={() => this.updateOnFilterBadge('publishersSelected', data.datasetfields.publisher)}>
														{' '}
														{data.datasetv2.summary.publisher.name}{' '}
													</span>
												</>
											) : (
												<span
													className='gray800-14'
													style={{ cursor: 'pointer' }}
													onClick={() => this.updateOnFilterBadge('publishersSelected', data.datasetfields.publisher)}>
													{' '}
													{data.datasetfields.publisher}{' '}
												</span>
											)}
										</Col>
										<Col sm={2} lg={2} className='pad-right-24'>
											{!_.isEmpty(publisherLogo) && (
												<div
													className='datasetLogoCircle floatRight'
													style={{
														backgroundImage: `url('${publisherLogo}')`,
														backgroundRepeat: 'no-repeat',
														backgroundPosition: 'center',
														backgroundSize: 'contain',
														backgroundOrigin: 'content-box',
													}}
												/>
											)}
											{this.props.showRelationshipQuestion ? (
												<Button variant='medium' className='soft-black-14' onClick={this.removeButton}>
													<SVGIcon name='closeicon' fill={'#979797'} className='buttonSvg mr-2' />
													Remove
												</Button>
											) : (
												''
											)}
										</Col>
										<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-16'>
											<span className='badge-dataset'>
												<SVGIcon name='dataseticon' fill={'#ffffff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Dataset</span>
											</span>
											{(() => {
												if (phenotypesSeached.length > 0) {
													if (activeLink === true) {
														if (onSearchPage === true) {
															return (
																<span
																	className='pointer'
																	onClick={event => this.updateOnFilterBadge('phenotypesSelected', phenotypesSeached[0].name)}>
																	<div className='badge-phenotype'>Phenotype: {phenotypesSeached[0].name}</div>
																</span>
															);
														} else {
															return (
																<a href={'/search?search=&tab=Datasets&phenotypes=' + phenotypesSeached[0].name}>
																	<div className='badge-phenotype'>Phenotype: {phenotypesSeached[0].name}</div>
																</a>
															);
														}
													} else {
														return <div className='badge-phenotype'>Phenotype: {phenotypesSeached[0].name}</div>;
													}
												}
											})()}

											{!phenotypesSelected || phenotypesSelected.length <= 0
												? ''
												: phenotypesSelected.map(phenotype => {
														if (
															data.datasetfields.phenotypes.find(
																phenotypeCheck => phenotypeCheck.name.toLowerCase() === phenotype.toLowerCase()
															)
														) {
															if (activeLink === true) {
																if (onSearchPage === true) {
																	return (
																		<span className='pointer' onClick={event => this.updateOnFilterBadge('phenotypesSelected', phenotype)}>
																			<div className='badge-phenotype'>Phenotype: {phenotype}</div>
																		</span>
																	);
																} else {
																	return (
																		<a href={'/search?search=&tab=Datasets&phenotypes=' + phenotype}>
																			<div className='badge-phenotype'>Phenotype: {phenotype}</div>
																		</a>
																	);
																}
															} else {
																return <div className='badge-phenotype'>Phenotype: {phenotype}</div>;
															}
														}
												  })}

											{!data.tags.features || data.tags.features.length <= 0
												? ''
												: data.tags.features.map(feature => {
														if (activeLink === true) {
															if (onSearchPage === true) {
																return (
																	<span className='pointer' onClick={event => this.updateOnFilterBadge('keywordsSelected', feature)}>
																		<div className='badge-tag'>{feature}</div>
																	</span>
																);
															} else {
																return (
																	<a href={'/search?search=&tab=Datasets&keywords=' + feature}>
																		<div className='badge-tag'>{feature}</div>
																	</a>
																);
															}
														} else {
															return <div className='badge-tag'>{feature}</div>;
														}
												  })}
										</Col>
										{!this.props.showRelationshipQuestion && (
											<Col sm={12} lg={12} className='pad-left-24 pad-right-24 pad-top-24 pad-bottom-16'>
												<span className='gray800-14'>
													{(() => {
														if (!data.datasetfields.abstract || typeof data.datasetfields.abstract === 'undefined') {
															if (data.description) {
																return data.description.substr(0, 255) + (data.description.length > 255 ? '...' : '');
															}
														} else {
															return data.datasetfields.abstract.substr(0, 255) + (data.datasetfields.abstract.length > 255 ? '...' : '');
														}
													})()}
												</span>
											</Col>
										)}
									</Row>
								);
							}
						})()}
						{(() => {
							if (this.props.showRelationshipQuestion) {
								return (
									<>
										<Row className='pad-top-24 noMargin'>
											<Col xs={12} className='pad-left-24 pad-right-24'>
												{!inCollection ? (
													<span className='gray800-14 mr-2'>What's the relationship between these resources?</span>
												) : (
													<span className='gray800-14 mr-2'>What's the relationship of this entity to the collection? (optional)</span>
												)}
											</Col>
										</Row>
										<Row className='noMargin'>
											<Col xs={12} className='pad-left-24 pad-right-24'>
												<input
													className='resultsCardInput'
													value={this.state.reason}
													onChange={event =>
														this.handleChange(this.props.objectId, event.target.value, data.type === undefined ? 'dataset' : data.type)
													}
												/>
											</Col>
										</Row>
									</>
								);
							} else if (this.props.showRelationshipAnswer) {
								return (
									<>
										<Row className='noMargin'>
											<div className='relationshipBar'>
												<span className='gray800-14 mr-2'>Relationship</span>
											</div>
										</Row>
										<Row className='noMargin'>
											<Col className='pad-8' xs={12}>
												<div className='relationshipAnswer'>
													<span className='collection-card-user'>
														{relatedObject.user ? relatedObject.user : this.props.collectionUser}
													</span>
													<span className='collection-card-updated'>
														{relatedObject.updated ? relatedObject.updated : this.props.collectionUpdated}
													</span>
													<br />
													<span className='gray800-14 mr-2'>
														{relatedObject.reason ? relatedObject.reason : this.props.collectionReason}
													</span>
												</div>
											</Col>
										</Row>
									</>
								);
							}
						})()}
					</div>
				</Col>
			</Row>
		);
	}
}

export default RelatedObject;
