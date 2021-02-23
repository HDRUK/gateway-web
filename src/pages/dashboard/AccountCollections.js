import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';
import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';
import { EntityActionButton } from './EntityActionButton.jsx';
import { Event, initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

const AccountCollections = props => {
	const [userState] = useState(props.userState);
	const [key, setKey] = useState('active');
	const [collectionsList, setCollectionsList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeCount, setActiveCount] = useState(0);
	const [archiveCount, setArchiveCount] = useState(0);

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			initGA('UA-166025838-1');
		}
		doCollectionsCall();
	}, []);

	const handleSelect = key => {
		setKey(key);
	};

	const shouldChangeTab = () => {
		return key === 'archive' && archiveCount <= 1 ? true : false;
	};

	const doCollectionsCall = async () => {
		setIsLoading(true);
		if (userState[0].role === 'Admin') {
			await axios.get(baseURL + '/api/v1/accounts/admin/collections').then(res => {
				setCollectionsList(res.data.data);

				let activeCount = 0;
				let archiveCount = 0;

				res.data.data.forEach(collection => {
					if (collection.activeflag === 'active') activeCount++;
					else if (collection.activeflag === 'archive') archiveCount++;
				});

				setActiveCount(activeCount);
				setArchiveCount(archiveCount);
			});
		} else {
			await axios.get(baseURL + '/api/v1/accounts/collections?id=' + userState[0].id + '').then(res => {
				setCollectionsList(res.data.data);

				let activeCount = 0;
				let archiveCount = 0;

				res.data.data.forEach(collection => {
					if (collection.activeflag === 'active') activeCount++;
					else if (collection.activeflag === 'archive') archiveCount++;
				});

				setActiveCount(activeCount);
				setArchiveCount(archiveCount);
			});
		}
		setIsLoading(false);
	};

	const unarchiveCollection = id => {
		axios
			.put(baseURL + '/api/v1/collections/status', {
				id: id,
				activeflag: 'active',
			})
			.then(res => {
				doCollectionsCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	const deleteCollection = id => {
		axios.delete(baseURL + '/api/v1/collections/delete/' + id).then(res => {
			doCollectionsCall();
			if (shouldChangeTab()) {
				setKey('active');
			}
		});
	};

	const archiveCollection = id => {
		axios
			.put(baseURL + '/api/v1/collections/status', {
				id: id,
				activeflag: 'archive',
			})
			.then(res => {
				doCollectionsCall();
				if (shouldChangeTab()) {
					setKey('active');
				}
			});
	};

	if (isLoading) {
		return (
			<Row className='mt-4'>
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
								<span className='black-20'>Collections</span>
							</Row>
							<Row>
								<span className='gray700-13 '>Manage your existing collections or create new ones</span>
							</Row>
						</Col>
						<Col sm={12} md={4} style={{ textAlign: 'right' }}>
							<Button
								variant='primary'
								href='/collection/add'
								className='addButton'
								onClick={() => Event('Buttons', 'Click', 'Add a new collection')}>
								+ Create a collection
							</Button>
						</Col>
					</Row>

					<Row className='tabsBackground'>
						<Col sm={12} lg={12}>
							<Tabs data-testid='collectionTabs' className='dataAccessTabs gray700-13' activeKey={key} onSelect={handleSelect}>
								<Tab eventKey='active' title={'Active (' + activeCount + ')'}>
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
												<Col xs={2}>Last activity</Col>
												<Col xs={5}>Name</Col>
												<Col xs={2}>Author</Col>
												<Col xs={3}></Col>
											</Row>
										)}

										{activeCount <= 0 ? (
											<Row className='margin-right-15' data-testid='collectionEntryNotFound'>
												<NotFound word='collections' />
											</Row>
										) : (
											collectionsList.map(collection => {
												if (collection.activeflag !== 'active') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='collectionEntryActive'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(collection.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/collection/' + collection.id} className='black-14'>
																	{collection.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{collection.persons <= 0
																	? 'Author not listed'
																	: collection.persons.map((person, index) => {
																			return (
																				<span key={index}>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>

															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																	<Dropdown.Item href={'/collection/edit/' + collection.id} className='black-14'>
																		Edit
																	</Dropdown.Item>
																	<EntityActionButton
																		id={collection.id}
																		action={archiveCollection}
																		actionType='archive'
																		entity='collection'
																	/>
																	<EntityActionButton
																		id={collection.id}
																		action={deleteCollection}
																		actionType='delete'
																		entity='collection'
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
												<NotFound word='collections' />
											</Row>
										) : (
											collectionsList.map(collection => {
												if (collection.activeflag !== 'archive') {
													return <></>;
												} else {
													return (
														<Row className='entryBox' data-testid='collectionEntryArchive'>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{moment(collection.updatedAt).format('D MMMM YYYY HH:mm')}
															</Col>
															<Col sm={12} lg={5} className='pt-2'>
																<a href={'/collection/' + collection.id} className='black-14'>
																	{collection.name}
																</a>
															</Col>
															<Col sm={12} lg={2} className='pt-2 gray800-14'>
																{collection.persons <= 0
																	? 'Author not listed'
																	: collection.persons.map(person => {
																			return (
																				<span>
																					{person.firstname} {person.lastname} <br />
																				</span>
																			);
																	  })}
															</Col>

															<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																	<Dropdown.Item href={'/collection/edit/' + collection.id} className='black-14'>
																		Edit
																	</Dropdown.Item>
																	<EntityActionButton
																		id={collection.id}
																		action={unarchiveCollection}
																		actionType='unarchive'
																		entity='collection'
																	/>
																	<EntityActionButton
																		id={collection.id}
																		action={deleteCollection}
																		actionType='delete'
																		entity='collection'
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

export default AccountCollections;
