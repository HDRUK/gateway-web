import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

import { Row, Col, Button, Modal, Tabs, Tab, DropdownButton, Dropdown } from 'react-bootstrap';

import NotFound from '../commonComponents/NotFound';
import Loading from '../commonComponents/Loading';
import './Dashboard.scss';

import { Event, initGA } from '../../tracking';

var baseURL = require('../commonComponents/BaseURL').getURL();

class AccountCollections extends React.Component {
	constructor(props) {
		super(props);
		this.state.userState = props.userState;
	}

	// initialize our state
	state = {
		userState: [],
		key: 'active',
		data: [],
		isLoading: true,
		activeCount: 0,
		archiveCount: 0,
	};

	handleSelect = key => {
		this.setState({ key: key });
	};

	componentDidMount() {
		if (process.env.NODE_ENV === 'production') {
			initGA('UA-166025838-1');
		}
		this.doCollectionsCall();
	}

	doCollectionsCall() {
		this.setState({ isLoading: true });
		if (this.state.userState[0].role === 'Admin') {
			axios.get(baseURL + '/api/v1/accounts/admin/collections').then(res => {
				this.setState({ data: res.data.data, isLoading: false });

				let activeCount = 0;
				let archiveCount = 0;

				res.data.data.forEach(collection => {
					if (collection.activeflag === 'active') activeCount++;
					else if (collection.activeflag === 'archive') archiveCount++;
				});

				this.setState({ activeCount: activeCount });
				this.setState({ archiveCount: archiveCount });
			});
		} else {
			axios.get(baseURL + '/api/v1/accounts/collections?id=' + this.state.userState[0].id + '').then(res => {
				this.setState({ data: res.data.data, isLoading: false });

				let activeCount = 0;
				let archiveCount = 0;

				res.data.data.forEach(collection => {
					if (collection.activeflag === 'active') activeCount++;
					else if (collection.activeflag === 'archive') archiveCount++;
				});

				this.setState({ activeCount: activeCount });
				this.setState({ archiveCount: archiveCount });
			});
		}
	}

	unArchiveObject = id => {
		axios
			.put(baseURL + '/api/v1/collections/status', {
				id: id,
				activeflag: 'active',
			})
			.then(res => {
				this.doCollectionsCall();
				if (shouldChangeTab(this.state)) {
					this.setState({ key: 'active' });
				}
			});
	};

	deleteObject = id => {
		axios.delete(baseURL + '/api/v1/collections/delete/' + id).then(res => {
			this.doCollectionsCall();
			if (shouldChangeTab(this.state)) {
				this.setState({ key: 'active' });
			}
		});
	};

	render() {
		const { userState, key, isLoading, data, activeCount, archiveCount } = this.state;

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
									href='/addcollection'
									className='addButton'
									onClick={() => Event('Buttons', 'Click', 'Add a new collection')}>
									+ Create a collection
								</Button>
							</Col>
						</Row>

						<Row className='tabsBackground'>
							<Col sm={12} lg={12}>
								<Tabs className='dataAccessTabs gray700-13' activeKey={this.state.key} onSelect={this.handleSelect}>
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
													<Col xs={2}>Updated</Col>
													<Col xs={5}>Name</Col>
													<Col xs={2}>Author</Col>
													<Col xs={3}></Col>
												</Row>
											)}

											{activeCount <= 0 ? (
												<Row className='margin-right-15'>
													<NotFound word='collections' />
												</Row>
											) : (
												data.map(dat => {
													if (dat.activeflag !== 'active') {
														return <></>;
													} else {
														return (
															<Row className='entryBox' data-testid='collectionEntry'>
																<Col sm={12} lg={2} className='pt-2 gray800-14'>
																	{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}
																</Col>
																<Col sm={12} lg={5} className='pt-2'>
																	<a href={'/collection/' + dat.id} className='black-14'>
																		{dat.name}
																	</a>
																</Col>
																<Col sm={12} lg={2} className='pt-2 gray800-14'>
																	{dat.persons <= 0
																		? 'Author not listed'
																		: dat.persons.map((person, index) => {
																				return (
																					<span key={index}>
																						{person.firstname} {person.lastname} <br />
																					</span>
																				);
																		  })}
																</Col>

																<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																	<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																		<Dropdown.Item href={'/editcollection/' + dat.id} className='black-14'>
																			Edit
																		</Dropdown.Item>
																		<ArchiveButton id={dat.id} />
																		<DeleteButton id={dat.id} deleteObject={this.deleteObject} />
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
													<Col xs={2}>Updated</Col>
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
												data.map(dat => {
													if (dat.activeflag !== 'archive') {
														return <></>;
													} else {
														return (
															<Row className='entryBox' data-testid='collectionEntry'>
																<Col sm={12} lg={2} className='pt-2 gray800-14'>
																	{moment(dat.updatedAt).format('D MMMM YYYY HH:mm')}
																</Col>
																<Col sm={12} lg={5} className='pt-2'>
																	<a href={'/collection/' + dat.id} className='black-14'>
																		{dat.name}
																	</a>
																</Col>
																<Col sm={12} lg={2} className='pt-2 gray800-14'>
																	{dat.persons <= 0
																		? 'Author not listed'
																		: dat.persons.map(person => {
																				return (
																					<span>
																						{person.firstname} {person.lastname} <br />
																					</span>
																				);
																		  })}
																</Col>

																<Col sm={12} lg={3} style={{ textAlign: 'right' }} className='toolsButtons'>
																	<DropdownButton variant='outline-secondary' alignRight title='Actions' className='floatRight'>
																		<Dropdown.Item href={'/editcollection/' + dat.id} className='black-14'>
																			Edit
																		</Dropdown.Item>
																		<UnarchiveButton id={dat.id} unArchiveObject={this.unArchiveObject} />
																		<DeleteButton id={dat.id} deleteObject={this.deleteObject} />
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
	}
}

function ArchiveButton(props) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const archiveObject = () => {
		axios
			.put(baseURL + '/api/v1/collections/status', {
				id: props.id,
				activeflag: 'archive',
			})
			.then(res => {
				window.location.href = '/account?tab=collections&collectionArchived=true';
			});
	};

	return (
		<>
			<Dropdown.Item href='#' onClick={handleShow} className='black-14'>
				Archive
			</Dropdown.Item>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Archive this collection?</Modal.Title>
				</Modal.Header>
				<Modal.Body>This collection will be archived from the directory.</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						No, nevermind
					</Button>
					<Button variant='primary' onClick={archiveObject}>
						Yes, archive
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

function UnarchiveButton(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const unArchiveObject = () => props.unArchiveObject(props.id);

	return (
		<>
			<Dropdown.Item href='#' onClick={handleShow} className='black-14'>
				Unarchive
			</Dropdown.Item>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Unarchive this collection?</Modal.Title>
				</Modal.Header>
				<Modal.Body>This collection will be unarchived from the directory.</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						No, nevermind
					</Button>
					<Button variant='primary' onClick={unArchiveObject}>
						Yes, unarchive
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

function DeleteButton(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	const deleteObject = () => props.deleteObject(props.id);

	return (
		<>
			<Dropdown.Item href='#' onClick={handleShow} className='black-14'>
				Delete
			</Dropdown.Item>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Delete this collection?</Modal.Title>
				</Modal.Header>
				<Modal.Body>This collection will be deleted from the directory.</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						No, nevermind
					</Button>
					<Button variant='primary' onClick={deleteObject}>
						Yes, delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}

function shouldChangeTab(state) {
	return state.key === 'archive' && state.archiveCount <= 1 ? true : false;
}

export default AccountCollections;
