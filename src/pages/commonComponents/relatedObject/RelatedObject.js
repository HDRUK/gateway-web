import React from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { has } from 'lodash';
import Loading from '../Loading';
import SVGIcon from '../../../images/SVGIcon';
import Dataset from './Dataset/Dataset';
import Tool from './Tool/Tool';
import Paper from './Paper/Paper';
import Course from './Course/Course';
import Person from './Person/Person';
import relatedObjectService from '../../../services/related-objects';
import './RelatedObject.scss';

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
		inCollection: false,
		isCohortDiscovery: false,
		publisherLogoURL: '',
	};

	constructor(props) {
		super(props);
		this.state.activeLink = props.activeLink;
		this.state.onSearchPage = props.onSearchPage;
		if (props.inCollection) {
			this.state.inCollection = props.inCollection;
		}
		// what the hell is going on here
		if (props.data) {
			this.state.isCohortDiscovery = props.data.isCohortDiscovery || false;
			this.state.data = props.data || [];
			this.state.isLoading = false;
		} else if (props.objectId) {
			this.state.relatedObject = props.relatedObject;
			this.state.reason = props.reason;
			this.getRelatedObjectFromApi(props.objectId, props.objectType);
		} else {
			this.state.relatedObject = props.relatedObject;
			this.getRelatedObjectFromApi(this.state.relatedObject.objectId, this.state.relatedObject.objectType);
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

		this.getRelatedObjectFromApi(id, type);
	};

	getRelatedObjectFromApi = (id, type) => {
		//need to handle error if no id is found
		this.setState({ isLoading: true });

		relatedObjectService.getRelatedObjectByType(id, type).then(res => {
			this.setState({
				data: res.data.data[0],
				isCohortDiscovery: res.data.data[0].isCohortDiscovery || false,
				isLoading: false,
			});
		});
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

	handleChange = (id, reason, type, pid) => {
		this.setState({ reason: reason });
		this.props.doUpdateReason(id, reason, type, pid);
	};

	updateOnFilterBadge = (filter, option) => {
		if (this.props.updateOnFilterBadge) {
			this.props.updateOnFilterBadge(filter, option);
		}
	};

	render() {
		const { data, isLoading, activeLink, onSearchPage, relatedObject, inCollection, publisherLogoURL } = this.state;

		let publisherLogo;

		if (this.props.datasetPublisher || this.props.datasetLogo) {
			publisherLogo = this.props.datasetLogo ? this.props.datasetLogo : publisherLogoURL;
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
									<Tool
										data={data}
										activeLink={activeLink ? activeLink : false}
										onSearchPage={onSearchPage ? onSearchPage : false}
										showRelationshipQuestion={this.props.showRelationshipQuestion ? this.props.showRelationshipQuestion : false}
										updateOnFilterBadge={this.updateOnFilterBadge}
										removeButton={this.removeButton}
										isLocked={this.props.isLocked}
									/>
								);
							} else if (data.type === 'dataUseRegister') {
								return (
									<Row className='noMargin'>
										<Col sm={10} lg={10} className='pad-left-24'>
											{activeLink === true ? (
												<a className='purple-bold-16' style={{ cursor: 'pointer' }} href={'/datause/' + data.id}>
													{data.projectTitle}
												</a>
											) : (
												<p className='black-bold-16 padding-bottom-4'>{data.projectTitle}</p>
											)}
											<p className='gray800-14'>{data.organisationName}</p>
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
											<span className='badge-datause'>
												<SVGIcon name='datauseicon' fill={'#fff'} className='badgeSvg mr-2' viewBox='-2 -2 22 22' />
												<span>Data use</span>
											</span>
											{data.keywords.map(word => (
												<span className='badge-tag'>{word}</span>
											))}
											<Row className='pad-top-16'>
												<Col md={3} className='gray800-14-opacity'>
													Datasets
												</Col>
												<Col md={9} className='gray800-14'>
													{data.gatewayDatasetsInfo &&
														data.gatewayDatasetsInfo.map(dataset => (
															<a href={`/dataset/${dataset.pid}`}>
																<div className='badge-tag'>{dataset.name}</div>
															</a>
														))}
													{data.nonGatewayDatasets && data.nonGatewayDatasets.join(', ')}
												</Col>
											</Row>
											<Row className='pad-bottom-24 pad-top-8'>
												<Col md={3} className='gray800-14-opacity'>
													Data custodian
												</Col>
												<Col md={9} className='gray800-14'>
													{has(data, 'publisherInfo.name') ? data.publisherInfo.name : '-'}
												</Col>
											</Row>
										</Col>
									</Row>
								);
							} else if (data.type === 'paper') {
								return (
									<Paper
										data={data}
										activeLink={activeLink ? activeLink : false}
										onSearchPage={onSearchPage ? onSearchPage : false}
										showRelationshipQuestion={this.props.showRelationshipQuestion ? this.props.showRelationshipQuestion : false}
										updateOnFilterBadge={this.updateOnFilterBadge}
										removeButton={this.removeButton}
										isLocked={this.props.isLocked}
									/>
								);
							} else if (data.type === 'person') {
								return (
									<Person
										data={data}
										activeLink={activeLink ? activeLink : false}
										showRelationshipQuestion={this.props.showRelationshipQuestion ? this.props.showRelationshipQuestion : false}
										removeButton={this.removeButton}
									/>
								);
							} else if (data.type === 'course') {
								return (
									<Course
										data={data}
										activeLink={activeLink ? activeLink : false}
										onSearchPage={onSearchPage ? onSearchPage : false}
										showRelationshipQuestion={this.props.showRelationshipQuestion ? this.props.showRelationshipQuestion : false}
										updateOnFilterBadge={this.updateOnFilterBadge}
										removeButton={this.removeButton}
									/>
								);
							} else {
								return (
									<Dataset
										data={data}
										activeLink={activeLink ? activeLink : false}
										publisherLogo={publisherLogo}
										onSearchPage={onSearchPage ? onSearchPage : false}
										showRelationshipQuestion={this.props.showRelationshipQuestion ? this.props.showRelationshipQuestion : false}
										isCohortDiscovery={this.state.isCohortDiscovery}
										updateOnFilterBadge={this.updateOnFilterBadge}
										removeButton={this.removeButton}
										isLocked={this.props.isLocked}
									/>
								);
							}
						})()}
						{(() => {
							if (
								this.props.showRelationshipQuestion &&
								!(data.type === 'dataset' && data.activeflag === 'archive') &&
								this.props.isLocked !== true
							) {
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
														this.handleChange(
															this.props.objectId,
															event.target.value,
															data.type === undefined ? 'dataset' : data.type,
															this.props.pid
														)
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
