import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Row, Button, Tabs, Tab, Alert } from 'react-bootstrap';
import { Event, initGA } from '../../tracking';
import _ from 'lodash';
import Loading from '../commonComponents/Loading';
import DatasetCard from '../commonComponents/DatasetCard';
import NotFound from '../commonComponents/NotFound';
import SVGIcon from '../../images/SVGIcon';
import './Dashboard.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();

const AccountDatasets = props => {
	const [key, setKey] = useState(!_.isEmpty(props.alert.tab) ? props.alert.tab : 'active');
	const [datasetList, setDatasetList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeCount, setActiveCount] = useState(0);
	const [reviewCount, setReviewCount] = useState(0);
	const [archiveCount, setArchiveCount] = useState(0);
	const [rejectedCount, setRejectedCount] = useState(0);
	const [alert] = useState(props.alert);
	const [team, setTeam, getTeam] = useState(props.team);
	const [publisherID, setPublisherID] = useState('');

	useEffect(() => {
		setTeam(props.team);
	}, [props]);

	useEffect(() => {
		initGA('UA-166025838-1');
		setIsLoading(true);
		doDatasetsCall();
	}, [team]);

	const doDatasetsCall = async () => {
		setIsLoading(true);
		let isPublisher = getPublisherID();
		setPublisherID(isPublisher);

		await axios.get(baseURL + `/api/v1/dataset-onboarding/publisher/${isPublisher}`).then(res => {
			if (_.has(res, 'data.data.listOfDatasets')) {
				setDatasetList(res.data.data.listOfDatasets);

				let activeCount = 0;
				let reviewCount = 0;
				let archiveCount = 0;
				let rejectedCount = 0;

				res.data.data.listOfDatasets.forEach(dataset => {
					if (dataset.activeflag === 'active' || dataset.activeflag === 'draft') activeCount++;
					else if (dataset.activeflag === 'inReview') reviewCount++;
					else if (dataset.activeflag === 'archive') archiveCount++;
					else if (dataset.activeflag === 'rejected') rejectedCount++;
				});

				setActiveCount(activeCount);
				setReviewCount(reviewCount);
				setArchiveCount(archiveCount);
				setRejectedCount(rejectedCount);
			}
			if (isPublisher === 'admin') setKey('inReview');
			setIsLoading(false);
		});
	};

	const getPublisherID = () => {
		let { teams } = props.userState[0];
		let foundAdmin = teams.filter(x => x.type === team);
		if (!_.isEmpty(foundAdmin)) {
			return 'admin';
		}
		let foundTeam = teams.filter(x => x._id === team);
		if (_.isEmpty(teams) || _.isEmpty(foundTeam)) {
			return ['applicant']; //pass back to user
		}

		return foundTeam[0]._id;
	};

	const createNewDataset = e => {
		e.preventDefault();
		//call to API to create new dataset
		setIsLoading(true);
		let isPublisher = getPublisherID();
		axios.post(baseURL + '/api/v1/dataset-onboarding', { publisherID: isPublisher }).then(res => {
			let { id } = res.data.data;
			//load dataset onboarding page
			if (!_.isUndefined(id)) window.location.href = `/dataset-onboarding/${id}`;
			else {
				//show error message
				setIsLoading(false);
			}
		});
	};

	const handleSelect = key => {
		setKey(key);
	};

	const generateAlert = () => {
		let { message = '' } = alert;
		return (
			<Row className='mt-3'>
				<Col xs={1}></Col>
				<Col xs={10}>
					<Alert variant={'success'} className='col-sm-12 main-alert'>
						<SVGIcon name='check' width={18} height={18} fill={'#2C8267'} /> {message}
					</Alert>
				</Col>
				<Col xs={1}></Col>
			</Row>
		);
	};

	if (isLoading) {
		return (
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<Loading />
				</Col>
				<Col xs={1}></Col>
			</Row>
		);
	}

	return (
		<div>
			<>{!_.isEmpty(alert) ? generateAlert() : ''}</>
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<div className='accountHeader'>
						<Row>
							<Col sm={12} md={8}>
								<div>
									<span className='black-20'>Datasets</span>
								</div>
								<div>
									<span className='gray700-13 '>
										{publisherID !== 'admin'
											? 'View, add, edit, archive and check the status of your datasets.'
											: 'Approve or reject pending datasets'}
									</span>
								</div>
							</Col>
							<Col sm={12} md={4} style={{ textAlign: 'right' }}>
								<Button
									variant='primary'
									className='addButton'
									onClick={(() => Event('Buttons', 'Click', 'Add a new paper'), createNewDataset)}>
									+ Add a new dataset
								</Button>
							</Col>
						</Row>
					</div>
					<div className='tabsBackground'>
						<Row>
							<Col sm={12} lg={12}>
								{team === 'admin' ? (
									<Tabs className='dataAccessTabs gray700-13' activeKey={key} onSelect={handleSelect}>
										<Tab eventKey='inReview' title={'Pending approval (' + reviewCount + ')'}>
											{' '}
										</Tab>
									</Tabs>
								) : (
									<Tabs className='dataAccessTabs gray700-13' activeKey={key} onSelect={handleSelect}>
										<Tab eventKey='active' title={'Active (' + activeCount + ')'}>
											{' '}
										</Tab>
										<Tab eventKey='inReview' title={'Pending approval (' + reviewCount + ')'}>
											{' '}
										</Tab>
										<Tab eventKey='rejected' title={'Rejected (' + rejectedCount + ')'}>
											{' '}
										</Tab>
										<Tab eventKey='archive' title={'Archived (' + archiveCount + ')'}>
											{' '}
										</Tab>
									</Tabs>
								)}
							</Col>
						</Row>
					</div>

					{(() => {
						switch (key) {
							case 'active':
								return (
									<div>
										{activeCount <= 0 ? (
											<NotFound word='datasets' />
										) : (
											datasetList.map(dataset => {
												if (dataset.activeflag !== 'active' && dataset.activeflag !== 'draft') {
													return <></>;
												} else {
													return (
														<DatasetCard
															id={dataset._id}
															title={dataset.name}
															publisher={dataset.datasetv2.summary.publisher.name}
															version={dataset.datasetVersion}
															isDraft={true}
															datasetStatus={dataset.activeflag}
															timeStamps={dataset.timestamps}
															completion={dataset.percentageCompleted}
															listOfVersions={dataset.listOfVersions}
														/>
													);
												}
											})
										)}
									</div>
								);
							case 'inReview':
								return (
									<div>
										{reviewCount <= 0 ? (
											<NotFound word='datasets' />
										) : (
											datasetList.map(dataset => {
												if (dataset.activeflag !== 'inReview') {
													return <></>;
												} else {
													return (
														<DatasetCard
															id={dataset._id}
															title={dataset.name}
															publisher={dataset.datasetv2.summary.publisher.name}
															version={dataset.datasetVersion}
															isDraft={true}
															datasetStatus={dataset.activeflag}
															timeStamps={dataset.timestamps}
															completion={dataset.percentageCompleted}
															listOfVersions={dataset.listOfVersions}
														/>
													);
												}
											})
										)}
									</div>
								);
							case 'rejected':
								return (
									<div>
										{rejectedCount <= 0 ? (
											<NotFound word='datasets' />
										) : (
											datasetList.map(dataset => {
												if (dataset.activeflag !== 'rejected') {
													return <></>;
												} else {
													return (
														<DatasetCard
															id={dataset._id}
															title={dataset.name}
															publisher={dataset.datasetv2.summary.publisher.name}
															version={dataset.datasetVersion}
															isDraft={true}
															datasetStatus={dataset.activeflag}
															timeStamps={dataset.timestamps}
															completion={dataset.percentageCompleted}
															rejectionText={dataset.applicationStatusDesc}
															rejectionAuthor={dataset.applicationStatusAuthor}
															listOfVersions={dataset.listOfVersions}
														/>
													);
												}
											})
										)}
									</div>
								);
							case 'archive':
								return (
									<div>
										{archiveCount <= 0 ? (
											<NotFound word='datasets' />
										) : (
											datasetList.map(dataset => {
												if (dataset.activeflag !== 'archive') {
													return <></>;
												} else {
													return (
														<DatasetCard
															id={dataset._id}
															title={dataset.name}
															//publisher={dataset.datasetv2.summary.publisher.name}
															version={dataset.datasetVersion}
															isDraft={true}
															datasetStatus={dataset.activeflag}
															timeStamps={dataset.timestamps}
															completion={dataset.percentageCompleted}
															listOfVersions={dataset.listOfVersions}
														/>
													);
												}
											})
										)}
									</div>
								);
						}
					})()}
				</Col>
				<Col xs={1}></Col>
			</Row>
		</div>
	);
};

export default AccountDatasets;
