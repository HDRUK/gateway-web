import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import ActionModal from '../commonComponents/ActionModal/ActionModal';
import _ from 'lodash';
import { EntityActionButton } from './EntityActionButton.jsx';
import { Event, initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

export const AccountPapers = props => {
	const [userState] = useState(props.userState);
	const [key, setKey] = useState('active');
	const [papersList, setPapersList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeCount, setActiveCount] = useState(0);
	const [reviewCount, setReviewCount] = useState(0);
	const [archiveCount, setArchiveCount] = useState(0);
	const [rejectedCount, setRejectedCount] = useState(0);
	const [showActionModal, setShowActionModal] = useState(false);
	const actionModalConfig = {
		title: 'Reject this Paper?',
	};

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			initGA('UA-166025838-1');
		}
		doPapersCall();
	}, []);

	const handleSelect = key => {
		setKey(key);
	};

	const doPapersCall = () => {
		setIsLoading(true);
		axios.get(baseURL + '/api/v1/papers/getList').then(res => {
			setPapersList(res.data.data);

			let activeCount = 0;
			let reviewCount = 0;
			let archiveCount = 0;
			let rejectedCount = 0;

			res.data.data.forEach(paper => {
				if (paper.activeflag === 'active') activeCount++;
				else if (paper.activeflag === 'review') reviewCount++;
				else if (paper.activeflag === 'archive') archiveCount++;
				else if (paper.activeflag === 'rejected') rejectedCount++;
			});

			setActiveCount(activeCount);
			setReviewCount(reviewCount);
			setArchiveCount(archiveCount);
			setRejectedCount(rejectedCount);
			setIsLoading(false);
		});
	};

	const approvePaper = id => {
		axios
			.patch(baseURL + '/api/v1/papers/' + id, {
				activeflag: 'active',
			})
			.then(res => {
				doPapersCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	const rejectPaper = (id, rejectionReason) => {
		axios
			.patch(baseURL + '/api/v1/papers/' + id, {
				id: id,
				activeflag: 'rejected',
				rejectionReason: rejectionReason,
			})
			.then(res => {
				doPapersCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	const archivePaper = id => {
		axios
			.patch(baseURL + '/api/v1/papers/' + id, {
				id: id,
				activeflag: 'archive',
			})
			.then(res => {
				doPapersCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	const toggleActionModal = () => {
		setShowActionModal(!showActionModal);
	};

	const shouldChangeTab = () => {
		return (key === 'pending' && reviewCount <= 1) || (key === 'archive' && archiveCount <= 1) ? true : false;
	};

	if (isLoading) {
		return (
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<Loading data-testid='isLoading' />
				</Col>
				<Col xs={1}></Col>
			</Row>
		);
	}

	return (
		<div>
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<Row className='accountHeader'>
						<Col sm={12} md={8}>
							<Row>
								<span className='black-20'>Papers</span>
							</Row>
							<Row>
								<span className='gray700-13 '>Manage your existing papers or add new ones</span>
							</Row>
						</Col>
						<Col sm={12} md={4} style={{ textAlign: 'right' }}>
							<Button
								variant='primary'
								href='/paper/add'
								className='addButton'
								onClick={() => Event('Buttons', 'Click', 'Add a new paper')}>
								+ Add a new paper
							</Button>
						</Col>
					</Row>
					<Row className='tabsBackground'>
						<Col sm={12} lg={12}>
							<Tabs className='dataAccessTabs gray700-13' data-testid='paperTabs' activeKey={key} onSelect={handleSelect}>
								<Tab eventKey='active' title={'Active (' + activeCount + ')'}>
									{' '}
								</Tab>
								<Tab eventKey='pending' title={'Pending approval (' + reviewCount + ')'}>
									{' '}
								</Tab>
								<Tab eventKey='rejected' title={'Rejected (' + rejectedCount + ')'}>
									{' '}
								</Tab>
								<Tab eventKey='archive' title={'Archive (' + archiveCount + ')'}>
									{' '}
								</Tab>
							</Tabs>
						</Col>
					</Row>

					{(() => {
						switch (key) {
							case 'active':
								return (
									<div>
										{activeCount <= 0 ? (
											''
										) : (
											<Row className='subHeader mt-3 gray800-14-bold'>
												<Col xs={2}>Updated</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}
										{activeCount <= 0 ? (
											<Row className='margin-right-15'>
												<NotFound word='papers' />
											</Row>
										) : (
											papersList.map((paper, i) => {
												if (paper.activeflag !== 'active') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='paperEntryActive' key={i}>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(paper.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/paper/' + paper.id} className='black-14'>
																	{paper.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{paper.persons <= 0
																	? 'Author not listed'
																	: paper.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>
															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																	<Dropdown.Item href={'/paper/edit/' + paper.id} className='black-14'>
																		Edit
																	</Dropdown.Item>
																	<EntityActionButton id={paper.id} action={archivePaper} entity='paper' actionType='archive' />
																</DropdownButton>
															</Col>
														</Row>
													);
												}
											})
										)}
									</div>
								);
							case 'pending':
								return (
									<div>
										{reviewCount <= 0 ? (
											''
										) : (
											<Row className='subHeader mt-3 gray800-14-bold'>
												<Col xs={2}>Updated</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}
										{reviewCount <= 0 ? (
											<Row className='margin-right-15'>
												<NotFound word='papers' />
											</Row>
										) : (
											papersList.map(paper => {
												if (paper.activeflag !== 'review') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='paperEntryPending'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(paper.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/paper/' + paper.id} className='black-14'>
																	{paper.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{paper.persons <= 0
																	? 'Author not listed'
																	: paper.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>
															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																{userState[0].role === 'Admin' ? (
																	<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																		<Dropdown.Item href={'/paper/edit/' + paper.id} className='black-14'>
																			Edit
																		</Dropdown.Item>
																		<Dropdown.Item href='#' onClick={() => approvePaper(paper.id)} className='black-14'>
																			Approve
																		</Dropdown.Item>
																		<Dropdown.Item href='#' onClick={() => toggleActionModal()} className='black-14'>
																			Reject
																		</Dropdown.Item>
																		<ActionModal
																			id={paper.id}
																			open={showActionModal}
																			context={actionModalConfig}
																			updateApplicationStatus={rejectPaper}
																			close={toggleActionModal}
																		/>
																	</DropdownButton>
																) : (
																	''
																)}
															</Col>
														</Row>
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
											''
										) : (
											<Row className='subHeader mt-3 gray800-14-bold'>
												<Col xs={2}>Updated</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}
										{rejectedCount <= 0 ? (
											<Row className='margin-right-15'>
												<NotFound word='papers' />
											</Row>
										) : (
											papersList.map(paper => {
												if (paper.activeflag !== 'rejected') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='paperEntryRejected'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(paper.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/paper/' + paper.id} className='black-14'>
																	{paper.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{paper.persons <= 0
																	? 'Author not listed'
																	: paper.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>
															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'></Col>
														</Row>
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
											''
										) : (
											<Row className='subHeader mt-3 gray800-14-bold'>
												<Col xs={2}>Updated</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}
										{archiveCount <= 0 ? (
											<Row className='margin-right-15'>
												<NotFound word='papers' />
											</Row>
										) : (
											papersList.map(paper => {
												if (paper.activeflag !== 'archive') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='paperEntryArchive'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(paper.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/paper/' + paper.id} className='black-14'>
																	{paper.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{paper.persons <= 0
																	? 'Author not listed'
																	: paper.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>
															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																	<Dropdown.Item href={'/paper/edit/' + paper.id} className='black-14'>
																		Edit
																	</Dropdown.Item>
																	<Dropdown.Item href='#' onClick={() => approvePaper(paper.id)} className='black-14'>
																		Approve
																	</Dropdown.Item>
																	<Dropdown.Item href='#' onClick={() => toggleActionModal()} className='black-14'>
																		Reject
																	</Dropdown.Item>
																	<ActionModal
																		id={paper.id}
																		open={showActionModal}
																		context={actionModalConfig}
																		updateApplicationStatus={rejectPaper}
																		close={toggleActionModal}
																	/>
																</DropdownButton>
															</Col>
														</Row>
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

export default AccountPapers;
