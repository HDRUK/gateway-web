import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import MessageNotFound from '../commonComponents/MessageNotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import ActionModal from '../commonComponents/ActionModal/ActionModal';
import googleAnalytics from '../../tracking';
import { EntityActionButton } from './EntityActionButton.jsx';
import { PaginationHelper } from '../commonComponents/PaginationHelper';
import { LayoutContent } from '../../components/Layout';

var baseURL = require('../commonComponents/BaseURL').getURL();

export const AccountTools = props => {
	const [userState] = useState(props.userState);
	const [key, setKey] = useState('active');
	const [toolsList, setToolsList] = useState([]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [pendingIndex, setPendingIndex] = useState(0);
	const [rejectedIndex, setRejectedIndex] = useState(0);
	const [archiveIndex, setArchiveIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isResultsLoading, setIsResultsLoading] = useState(true);
	const [activeCount, setActiveCount] = useState(0);
	const [reviewCount, setReviewCount] = useState(0);
	const [rejectedCount, setRejectedCount] = useState(0);
	const [archiveCount, setArchiveCount] = useState(0);
	const [showActionModal, setShowActionModal] = useState(false);
	const actionModalConfig = {
		title: 'Reject this Tool?',
	};
	const maxResults = 40;

	useEffect(() => {
		doToolsCall('active', true, 0, true);
	}, []);

	const handleSelect = key => {
		setKey(key);

		let index;
		if (key === 'active') {
			index = activeIndex;
		} else if (key === 'pending') {
			index = pendingIndex;
		} else if (key === 'rejected') {
			index = rejectedIndex;
		} else if (key === 'archive') {
			index = archiveIndex;
		}

		doToolsCall(key, false, index);
	};

	const doToolsCall = (key, updateCounts, index, firstLoad) => {
		if (key === 'pending') {
			key = 'review';
		}
		if (firstLoad === true) {
			setIsLoading(true);
		}
		setIsResultsLoading(true);

		let apiUrl;
		if (typeof index === 'undefined') {
			apiUrl = baseURL + `/api/v1/tools/getList?status=${key}`;
		} else {
			apiUrl = baseURL + `/api/v1/tools/getList?status=${key}&offset=${index}&limit=${maxResults}`;
		}

		axios.get(apiUrl).then(res => {
			setToolsList(res.data.data[0]);
			if (updateCounts === true) {
				setActiveCount(res.data.data[1].activeCount);
				setReviewCount(res.data.data[1].reviewCount);
				setArchiveCount(res.data.data[1].archiveCount);
				setRejectedCount(res.data.data[1].rejectedCount);
			}
			if (firstLoad === true) {
				setIsLoading(false);
			}
			setIsResultsLoading(false);
		});
		window.scrollTo(0, 0);
	};

	const approveTool = (id, key, index, count) => {
		axios
			.patch(baseURL + '/api/v1/tools/' + id, {
				activeflag: 'active',
			})
			.then(res => {
				if (shouldChangeTab()) {
					setKey('active');
					doToolsCall('active', true);
				} else if (!shouldChangeTab() && count - (index + maxResults) <= 0 && count % maxResults === 1) {
					if (key === 'pending') {
						setPendingIndex(index - maxResults);
					} else if (key === 'archive') {
						setArchiveIndex(index - maxResults);
					}
					doToolsCall(key, true, index - maxResults);
				} else if (!shouldChangeTab()) {
					doToolsCall(key, true, index);
				}
			});
	};

	const rejectTool = (id, rejectionReason, key, index, count) => {
		axios
			.patch(baseURL + '/api/v1/tools/' + id, {
				id: id,
				activeflag: 'rejected',
				rejectionReason: rejectionReason,
			})
			.then(res => {
				if (shouldChangeTab()) {
					setKey('active');
					doToolsCall('active', true);
				} else if (!shouldChangeTab() && count - (index + maxResults) <= 0 && count % maxResults === 1) {
					if (key === 'pending') {
						setPendingIndex(index - maxResults);
					} else if (key === 'archive') {
						setArchiveIndex(index - maxResults);
					}
					doToolsCall(key, true, index - maxResults);
				} else if (!shouldChangeTab()) {
					doToolsCall(key, true, index);
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
				setKey('active');
				if (activeCount - (activeIndex + maxResults) <= 0 && activeCount % maxResults === 1 && activeCount !== 1) {
					setActiveIndex(activeIndex - maxResults);
					doToolsCall(key, true, activeIndex - maxResults);
				} else {
					doToolsCall('active', true, activeIndex);
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
			<LayoutContent>
				<Loading data-testid='isLoading' />
			</LayoutContent>
		);
	}

	return (
		<Fragment>
			<LayoutContent>
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
						<Button
							data-test-id='add-tool-btn'
							variant='primary'
							href='/tool/add'
							className='addButton'
							onClick={() => googleAnalytics.recordEvent('Tools', 'Add a new tool', 'Tools dashboard button clicked')}>
							+ Add a new tool
						</Button>
					</Col>
				</Row>

				<Row className='tabsBackground'>
					<Col sm={12} lg={12}>
						<Tabs className='dataAccessTabs gray700-13' data-testid='toolTabs' activeKey={key} onSelect={handleSelect}>
							<Tab eventKey='active' data-testid='activeTab' title={'Active (' + activeCount + ')'}>
								{' '}
							</Tab>
							<Tab eventKey='pending' data-testid='pendingTab' title={'Pending approval (' + reviewCount + ')'}>
								{' '}
							</Tab>
							<Tab eventKey='rejected' data-testid='rejectedTab' title={'Rejected (' + rejectedCount + ')'}>
								{' '}
							</Tab>
							<Tab eventKey='archive' data-testid='archiveTab' title={'Archive (' + archiveCount + ')'}>
								{' '}
							</Tab>
						</Tabs>
					</Col>
				</Row>

				{isResultsLoading && (
					<Row className='width-100'>
						<Col xs={12} className='noPadding'>
							<Loading />
						</Col>
					</Row>
				)}

				{!isResultsLoading &&
					(() => {
						switch (key) {
							case 'active':
								return (
									<div>
										{activeCount <= 0 ? (
											''
										) : (
											<Row className='subHeader mt-3 gray800-14-bold'>
												<Col xs={2}>Last activity</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Uploader(s)</Col>
												<Col xs={3}></Col>
											</Row>
										)}

										{activeCount <= 0 ? (
											<Row className='margin-right-15'>
												<MessageNotFound word='tools' />
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
												<Col xs={2}>Last activity</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}

										{reviewCount <= 0 ? (
											<Row className='margin-right-15'>
												<MessageNotFound word='tools' />
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
																		<Dropdown.Item
																			href='#'
																			onClick={() => approveTool(tool.id, key, pendingIndex, reviewCount)}
																			className='black-14'>
																			Approve
																		</Dropdown.Item>
																		<Dropdown.Item href='#' onClick={() => toggleActionModal()} className='black-14'>
																			Reject
																		</Dropdown.Item>
																		<ActionModal
																			id={tool.id}
																			entityKey={'pending'}
																			entityIndex={pendingIndex}
																			entityCount={reviewCount}
																			open={showActionModal}
																			context={actionModalConfig}
																			updateApplicationStatus={rejectTool}
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
												<Col xs={2}>Last activity</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}

										{rejectedCount <= 0 ? (
											<Row className='margin-right-15'>
												<MessageNotFound word='tools' />
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
												<Col xs={2}>Last activity</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}

										{archiveCount <= 0 ? (
											<Row className='margin-right-15'>
												<MessageNotFound word='tools' />
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
																{userState[0].role === 'Admin' ? (
																	<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																		<Dropdown.Item href={'/tool/edit/' + tool.id} className='black-14'>
																			Edit
																		</Dropdown.Item>
																		<Dropdown.Item
																			href='#'
																			onClick={() => approveTool(tool.id, key, archiveIndex, archiveCount)}
																			className='black-14'>
																			Approve
																		</Dropdown.Item>
																		<Dropdown.Item href='#' onClick={() => toggleActionModal()} className='black-14'>
																			Reject
																		</Dropdown.Item>
																		<ActionModal
																			id={tool.id}
																			entityKey={'archive'}
																			entityIndex={archiveIndex}
																			entityCount={archiveCount}
																			open={showActionModal}
																			context={actionModalConfig}
																			updateApplicationStatus={rejectTool}
																			close={toggleActionModal}
																		/>
																	</DropdownButton>
																) : (
																	<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																		<Dropdown.Item href={'/tool/edit/' + tool.id} className='black-14'>
																			Edit
																		</Dropdown.Item>
																	</DropdownButton>
																)}
															</Col>
														</Row>
													);
												}
											})
										)}
									</div>
								);
							default:
								return key;
						}
					})()}

				{!isResultsLoading && (
					<div className='text-center entityDashboardPagination'>
						{key === 'active' && activeCount > maxResults ? (
							<PaginationHelper
								doEntitiesCall={doToolsCall}
								entityCount={activeCount}
								statusKey={key}
								paginationIndex={activeIndex}
								setPaginationIndex={setActiveIndex}
								maxResults={maxResults}></PaginationHelper>
						) : (
							''
						)}
						{key === 'pending' && reviewCount > maxResults ? (
							<PaginationHelper
								doEntitiesCall={doToolsCall}
								entityCount={reviewCount}
								statusKey={key}
								paginationIndex={pendingIndex}
								setPaginationIndex={setPendingIndex}
								maxResults={maxResults}></PaginationHelper>
						) : (
							''
						)}
						{key === 'rejected' && rejectedCount > maxResults ? (
							<PaginationHelper
								doEntitiesCall={doToolsCall}
								entityCount={rejectedCount}
								statusKey={key}
								paginationIndex={rejectedIndex}
								setPaginationIndex={setRejectedIndex}
								maxResults={maxResults}></PaginationHelper>
						) : (
							''
						)}
						{key === 'archive' && archiveCount > maxResults ? (
							<PaginationHelper
								doEntitiesCall={doToolsCall}
								entityCount={archiveCount}
								statusKey={key}
								paginationIndex={archiveIndex}
								setPaginationIndex={setArchiveIndex}
								maxResults={maxResults}></PaginationHelper>
						) : (
							''
						)}
					</div>
				)}
			</LayoutContent>
		</Fragment>
	);
};

export default AccountTools;
