import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import RelatedResources from '../commonComponents/relatedResources/RelatedResources';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import moment from 'moment';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import SVGIcon from '../../images/SVGIcon';
import ToolTip from '../../images/imageURL-ToolTip.gif';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import './Collections.scss';

var baseURL = require('../commonComponents/BaseURL').getURL();
let windowUrl = window.location.origin;

const AddEditCollectionForm = props => {
	// Pass the useFormik() hook initial form values and a submit function that will
	// be called when the form is submitted
	const formik = useFormik({
		initialValues: {
			id: props.data.id || '',
			name: props.data.name || '',
			description: props.data.description || '',
			authors: props.data.authors || [props.userState[0].id],
			imageLink: props.data.imageLink || '',
			relatedObjects: props.relatedObjects,
			publicflag: props.publicFlag || false,
			keywords: props.data.keywords || [],
		},

		validationSchema: Yup.object({
			name: Yup.string().required('This cannot be empty'),
			description: Yup.string().max(5000, 'Maximum of 5,000 characters').required('This cannot be empty'),
			authors: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.number()) : Yup.number())),
			imageLink: Yup.string().matches(/^(http|https){1}:\/\/[A-Za-z0-9-\/\._~:\?#\[\]@!\$&'\(\)\*\+,;%=]+$/, {
				message: 'Invalid URL: should start with http:// or https://',
			}),
		}),

		onSubmit: values => {
			values.relatedObjects = props.relatedObjects;
			values.collectionCreator = props.userState[0];

			if (props.isEdit) {
				axios.put(baseURL + '/api/v1/collections/edit', values).then(res => {
					window.location.href = windowUrl + '/collection/' + props.data.id + '/?collectionEdited=true';
				});
			} else {
				axios.post(baseURL + '/api/v1/collections/add', values).then(res => {
					window.location.href = windowUrl + '/collection/' + res.data.id + '/?collectionAdded=true';
				});
			}
		},
	});

	var listOfAuthors = [];

	if (props.isEdit) {
		props.data.authors.forEach(author => {
			props.combinedUsers.forEach(user => {
				if (user.id === author) {
					if (props.userState[0].id === user.id) {
						listOfAuthors.push({ id: user.id, name: user.name + ' (You)' });
						if (!user.name.includes('(You)')) {
							user.name = user.name + ' (You)';
						}
					} else {
						listOfAuthors.push({ id: user.id, name: user.name });
					}
				}
			});
		});
	} else {
		props.combinedUsers.forEach(user => {
			if (user.id === props.userState[0].id) {
				listOfAuthors.push({ id: user.id, name: user.name + ' (You)' });
				if (!user.name.includes('(You)')) {
					user.name = user.name + ' (You)';
				}
			}
		});
	}

	function updateReason(id, reason, type, pid) {
		let inRelatedObject = false;
		props.relatedObjects.map(object => {
			if (object.objectId === id) {
				inRelatedObject = true;
				object.pid = pid;
				object.reason = reason;
				object.objectType = type;
				object.user = props.userState[0].name;
				object.updated = moment().format('DD MMM YYYY');
			}
		});

		if (!inRelatedObject) {
			props.relatedObjects.push({
				objectId: id,
				pid: pid,
				reason: reason,
				objectType: type,
				user: props.userState[0].name,
				updated: moment().format('DD MMM YYYY'),
			});
		}
	}

	const updatePublicFlag = () => {
		{
			formik.setFieldValue('publicflag', !props.publicFlag);
		}
		props.updatePublicFlag(!props.publicFlag);
	};

	const [isShown, setIsShown] = useState(false);

	const relatedResourcesRef = React.useRef();

	return (
		<div>
			<Container>
				<Row className='margin-top-32'>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						<div className='rectangle'>
							<Row>
								<Col sm={12} lg={12}>
									<p className='black-20 margin-bottom-0 pad-bottom-8'>{props.isEdit ? 'Edit a collection' : 'Create a collection'}</p>
								</Col>
							</Row>
							<p className='gray800-14 margin-bottom-0'>Collections help collate varying resource types into one discovery space</p>
						</div>
					</Col>
					<Col sm={1} lg={10} />
				</Row>

				<Row className='pixelGapTop'>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						<Form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} autocomplete='off'>
							<div className='rectangle'>
								<Form.Group className='margin-bottom-24'>
									<span className='gray800-14'>Collection name</span>
									<Form.Control
										id='name'
										name='name'
										type='text'
										className={formik.touched.name && formik.errors.name ? 'emptyFormInput addFormInput' : 'addFormInput'}
										onChange={formik.handleChange}
										value={formik.values.name}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.name && formik.errors.name ? <div className='errorMessages'>{formik.errors.name}</div> : null}
								</Form.Group>

								<Form.Group className='margin-bottom-24'>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Description</p>
									<p className='gray700-13 margin-bottom-0'>Up to 5,000 characters</p>
									<Form.Control
										as='textarea'
										id='description'
										name='description'
										type='text'
										className={
											formik.touched.description && formik.errors.description
												? 'emptyFormInput addFormInput descriptionInput'
												: 'addFormInput descriptionInput'
										}
										onChange={formik.handleChange}
										value={formik.values.description}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.description && formik.errors.description ? (
										<div className='errorMessages'>{formik.errors.description}</div>
									) : null}
								</Form.Group>

								<Form.Group className='margin-bottom-24'>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Collection collaborators</p>
									<p className='gray700-13 margin-bottom-0'>Anyone added will be able to add and remove resources to this collection.</p>
									<Typeahead
										id='authors'
										labelKey={authors => `${authors.name}`}
										defaultSelected={listOfAuthors}
										multiple
										options={props.combinedUsers}
										className='addFormInput'
										onChange={selected => {
											var tempSelected = [];
											selected.forEach(selectedItem => {
												tempSelected.push(selectedItem.id);
											});
											formik.values.authors = tempSelected;
										}}
									/>
								</Form.Group>

								<Form.Group className='margin-bottom-24'>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Keywords</p>
									<p className='gray700-13 margin-bottom-0'>E.g. NCS, Charity, Disease etc.</p>
									<Typeahead
										id='keywords'
										labelKey='keywords'
										allowNew
										defaultSelected={formik.values.keywords}
										multiple
										options={props.combinedKeywords}
										className='addFormInputTypeAhead'
										onChange={selected => {
											var tempSelected = [];
											selected.forEach(selectedItem => {
												selectedItem.customOption === true ? tempSelected.push(selectedItem.keywords) : tempSelected.push(selectedItem);
											});
											formik.values.keywords = tempSelected;
										}}
									/>
								</Form.Group>

								<Form.Group className='margin-bottom-24'>
									<Row>
										<Col sm={7} lg={9}>
											<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Image URL (optional)</p>
											<p className='gray700-13 margin-bottom-0'>Paste an image address URL. Optimal image size: W700 x H466</p>
										</Col>
										<Col sm={5} lg={3} className='pl-4'>
											<span className='purple-13' onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
												How to get an image URL
											</span>
											{isShown && <img src={ToolTip} alt='' id='imageToolTip' />}
										</Col>
									</Row>
									<Form.Control
										id='imageLink'
										name='imageLink'
										type='text'
										className={formik.touched.imageLink && formik.errors.imageLink ? 'emptyFormInput addFormInput' : 'addFormInput'}
										onChange={formik.handleChange}
										value={formik.values.imageLink}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.imageLink && formik.errors.imageLink ? (
										<div className='errorMessages'>{formik.errors.imageLink}</div>
									) : null}
								</Form.Group>

								<Row className='margin-bottom-8 pad-left-16'>
									<span
										className='eyeColumn pad-right-8'
										onClick={() => {
											updatePublicFlag();
										}}>
										{formik.values.publicflag === true ? (
											<SVGIcon name='eye' width={24} height={24} fill={'#475da7'} className={'pointer'} />
										) : (
											<SVGIcon name='eyeCrossed' width={24} height={24} fill={'#475da7'} className={'pointer'} />
										)}
									</span>
									<span className='gray800-14'>
										{formik.values.publicflag === true
											? 'This collection is public, meaning anyone can view and search this collection. Click to make private.'
											: 'This collection is private. Click to make public.'}
									</span>
								</Row>
							</div>

							<div className='rectangle margin-top-16'>
								<span className='black-20'>Add resources</span>
								<br />
								<span className='gray800-14'>Link resources in the gateway to your collection page.</span>
							</div>

							<div className='relatedResourcesRectangle pixelGapTop'>
								{props.relatedObjects.map(object => {
									return (
										<div className='relatedObjectRectangle'>
											<RelatedObject
												showRelationshipQuestion={true}
												objectId={object.objectId}
												pid={object.pid}
												objectType={object.objectType}
												doRemoveObject={props.doRemoveObject}
												doUpdateReason={updateReason}
												reason={object.reason}
												didDelete={props.didDelete}
												updateDeleteFlag={props.updateDeleteFlag}
												inCollection={true}
											/>
										</div>
									);
								})}

								<div className='flexCenter pt-3 pb-3'>
									<Row>
										<Col sm={1} lg={1} />
										<Col sm={10} lg={10}>
											<RelatedResources
												ref={relatedResourcesRef}
												searchString={props.searchString}
												doSearchMethod={props.doSearchMethod}
												doUpdateSearchString={props.doUpdateSearchString}
												userState={props.userState}
												datasetData={props.datasetData}
												toolData={props.toolData}
												projectData={props.projectData}
												personData={props.personData}
												paperData={props.paperData}
												courseData={props.courseData}
												summary={props.summary}
												doAddToTempRelatedObjects={props.doAddToTempRelatedObjects}
												tempRelatedObjectIds={props.tempRelatedObjectIds}
												relatedObjects={props.relatedObjects}
												doClearRelatedObjects={props.doClearRelatedObjects}
												doAddToRelatedObjects={props.doAddToRelatedObjects}
											/>
										</Col>
										<Col sm={1} lg={10} />
									</Row>
								</div>
							</div>
						</Form>
					</Col>
					<Col sm={1} lg={10} />
				</Row>

				<Row>
					<span className='formBottomGap'></span>
				</Row>
			</Container>

			<ActionBar userState={props.userState}>
				<div className='floatRight'>
					<a style={{ cursor: 'pointer' }} href={'/account?tab=collections'}>
						<Button variant='medium' className='cancelButton dark-14 mr-2'>
							Cancel
						</Button>
					</a>

					<Button onClick={() => relatedResourcesRef.current.showModal()} variant='white' className='techDetailButton mr-2'>
						+ Add resource
					</Button>

					<Button variant='primary' className='publishButton white-14-semibold mr-2' type='submit' onClick={formik.handleSubmit}>
						Save
					</Button>
				</div>
			</ActionBar>
		</div>
	);
};

export default AddEditCollectionForm;
