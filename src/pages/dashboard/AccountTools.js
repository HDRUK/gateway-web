import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import ActionModal from '../commonComponents/ActionModal/ActionModal';
import _ from 'lodash';
import { Event, initGA } from '../../tracking';
import { EntityActionButton } from './EntityActionButton.jsx';

var baseURL = require('../commonComponents/BaseURL').getURL();

export const AccountTools = props => {
	const [userState] = useState(props.userState);
	const [key, setKey] = useState('active');
	const [toolsList, setToolsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeCount, setActiveCount] = useState(0);
	const [reviewCount, setReviewCount] = useState(0);
	const [archiveCount, setArchiveCount] = useState(0);
	const [rejectedCount, setRejectedCount] = useState(0);
	const [showActionModal, setShowActionModal] = useState(false);
	const actionModalConfig = {
		title: 'Reject this Tool?',
	};

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			initGA('UA-166025838-1');
		}
		doToolsCall();
	}, []);

	const handleSelect = key => {
		setKey(key);
	};

	const doToolsCall = () => {
		setIsLoading(true);
		axios.get(baseURL + '/api/v1/tools/getList').then(res => {
			setToolsList(res.data.data);

			let activeCount = 0;
			let reviewCount = 0;
			let archiveCount = 0;
			let rejectedCount = 0;

			res.data.data.forEach(tool => {
				if (tool.activeflag === 'active') activeCount++;
				else if (tool.activeflag === 'review') reviewCount++;
				else if (tool.activeflag === 'archive') archiveCount++;
				else if (tool.activeflag === 'rejected') rejectedCount++;
			});

			setActiveCount(activeCount);
			setReviewCount(reviewCount);
			setArchiveCount(archiveCount);
			setRejectedCount(rejectedCount);
			setIsLoading(false);
		});
	};

	const approveTool = id => {
		axios
			.patch(baseURL + '/api/v1/tools/' + id, {
				id: id,
				activeflag: 'active',
			})
			.then(res => {
				doToolsCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	const rejectObject = (id, rejectionReason) => {
		axios
			.patch(baseURL + '/api/v1/tools/' + id, {
				id: id,
				activeflag: 'rejected',
				rejectionReason: rejectionReason,
			})
			.then(res => {
				doToolsCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	const archiveTool = id => {
		axios
			.patch(baseURL + '/api/v1/tools/' + id, {
				id: id,
				activeflag: 'archive',
			})
			.then(res => {
				doToolsCall();
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
		<Fragment>
			<Row>
				<Col xs={1}></Col>
				<Col xs={10}>
					<Row className='accountHeader'>
						<Col sm={12} md={8}>
							<Row>
								<span className='black-20'>Tools</span>
							</Row>
							<Row>
								<span className='gray700-13 '>Manage your existing tools or add new ones</span>
							</Row>
						</Col>
						<Col sm={12} md={4} style={{ textAlign: 'right' }}>
							<Button variant='primary' href='/tool/add' className='addButton' onClick={() => Event('Buttons', 'Click', 'Add a new tool')}>
								+ Add a new tool
							</Button>
						</Col>
					</Row>

					<Row className='tabsBackground'>
						<Col sm={12} lg={12}>
							<Tabs className='dataAccessTabs gray700-13' data-testid='toolTabs' activeKey={key} onSelect={handleSelect}>
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
												<NotFound word='tools' />
											</Row>
										) : (
											toolsList.map(tool => {
												if (tool.activeflag !== 'active') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='toolEntryActive'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(tool.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/tool/' + tool.id} className='black-14'>
																	{tool.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{tool.persons <= 0
																	? 'Author not listed'
																	: tool.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>

															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																	<Dropdown.Item href={'/tool/edit/' + tool.id} className='black-14'>
																		Edit
																	</Dropdown.Item>
																	<EntityActionButton id={tool.id} action={archiveTool} entity='tool' actionType='archive' />
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
												<NotFound word='tools' />
											</Row>
										) : (
											toolsList.map(tool => {
												if (tool.activeflag !== 'review') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='toolEntryPending'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(tool.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/tool/' + tool.id} className='black-14'>
																	{tool.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{tool.persons <= 0
																	? 'Author not listed'
																	: tool.persons.map(person => {
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
																		<Dropdown.Item href={'/tool/edit/' + tool.id} className='black-14'>
																			Edit
																		</Dropdown.Item>
																		<Dropdown.Item href='#' onClick={() => approveTool(tool.id)} className='black-14'>
																			Approve
																		</Dropdown.Item>
																		<Dropdown.Item href='#' onClick={() => toggleActionModal()} className='black-14'>
																			Reject
																		</Dropdown.Item>
																		<ActionModal
																			id={tool.id}
																			open={showActionModal}
																			context={actionModalConfig}
																			updateApplicationStatus={rejectObject}
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
												<NotFound word='tools' />
											</Row>
										) : (
											toolsList.map(tool => {
												if (tool.activeflag !== 'rejected') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='toolEntryRejected'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(tool.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/tool/' + tool.id} className='black-14'>
																	{tool.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{tool.persons <= 0
																	? 'Author not listed'
																	: tool.persons.map(person => {
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
												<NotFound word='tools' />
											</Row>
										) : (
											toolsList.map(tool => {
												if (tool.activeflag !== 'archive') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='toolEntryArchive'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(tool.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/tool/' + tool.id} className='black-14'>
																	{tool.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{tool.persons <= 0
																	? 'Author not listed'
																	: tool.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>

															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																	<Dropdown.Item href={'/tool/edit/' + tool.id} className='black-14'>
																		Edit
																	</Dropdown.Item>
																	<Dropdown.Item href='#' onClick={() => approveTool(tool.id)} className='black-14'>
																		Approve
																	</Dropdown.Item>
																	<Dropdown.Item href='#' onClick={() => toggleActionModal()} className='black-14'>
																		Reject
																	</Dropdown.Item>
																	<ActionModal
																		id={tool.id}
																		open={showActionModal}
																		context={actionModalConfig}
																		updateApplicationStatus={rejectObject}
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
		</Fragment>
	);
};

export default AccountTools;
