import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Event } from '../../tracking';

import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import moment from 'moment';
import RelatedResources from '../commonComponents/relatedResources/RelatedResources';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import SVGIcon from '../../images/SVGIcon';
import ToolTip from '../../images/imageURL-ToolTip.gif';
import { ReactComponent as InfoFillSVG } from '../../images/infofill.svg';
import { ReactComponent as InfoSVG } from '../../images/info.svg';
import './Paper.scss';
import _ from 'lodash';

var baseURL = require('../commonComponents/BaseURL').getURL();

const AddEditPaperForm = props => {
	// Pass the useFormik() hook initial form values and a submit function that will
	// be called when the form is submitted
	const formik = useFormik({
		initialValues: {
			id: props.data.id || '',
			type: 'paper',
			name: props.data.name || '',
			link: props.data.link || '',
			journal: props.data.journal || '',
			journalYear: props.data.journalYear || '',
			description: props.data.description || '',
			resultsInsights: props.data.resultsInsights || '',
			authors: props.data.authors || [props.userState[0].id],
			tags: props.data.tags || {
				features: [],
				topics: [],
			},
			relatedObjects: props.relatedObjects,
			isPreprint: typeof props.data.isPreprint === 'undefined' ? false : props.data.isPreprint,
		},

		validationSchema: Yup.object({
			name: Yup.string().required('This cannot be empty'),
			link: Yup.string().required('This cannot be empty'),
			description: Yup.string().max(3000, 'Maximum of 3,000 characters').required('This cannot be empty'),
			resultsInsights: Yup.string().max(3000, 'Maximum of 3,000 characters'),
			authors: Yup.string().required('This cannot be empty'),
			isPreprint: Yup.bool(),
			journal: Yup.string().when('isPreprint', {
				is: false,
				then: Yup.string().required('This cannot be empty'),
			}),
			journalYear: Yup.string().when('isPreprint', {
				is: false,
				then: Yup.string().required('Year cannot be empty'),
			}),
		}),

		onSubmit: values => {
			values.relatedObjects = props.relatedObjects;
			values.toolCreator = props.userState[0];

			if (props.isEdit) {
				axios.put(baseURL + '/api/v1/papers/' + props.data.id, values).then(res => {
					window.location.href = window.location.search + '/paper/' + props.data.id + '/?paperEdited=true';
				});
			} else {
				axios.post(baseURL + '/api/v1/papers/', values).then(res => {
					window.location.href = window.location.search + '/paper/' + res.data.response.id + '/?paperAdded=true';
				});
			}
		},
	});

	const validatePaper = async e => {
		// 1. Continue event handling for onBlur with Formik
		formik.handleBlur(e);
		// 2. Extract the link value
		const payload = { link: e.target.value };
		// 3. If a link has been entered, validate
		if (payload) {
			// 4. Use axios to call backend to check if link exists against another paper
			axios.post(baseURL + '/api/v1/papers/validate', payload).then(res => {
				const {
					data: { error },
				} = res;
				// 5. Set Formik status to include the error message returned by the backend to be displayed below the input field
				if (error) {
					formik.setStatus({ duplicateLink: error });
				} else {
					formik.setStatus({});
				}
			});
		}
	};

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

	function updateReason(id, reason, type) {
		let inRelatedObject = false;
		props.relatedObjects.map(object => {
			if (object.objectId === id) {
				inRelatedObject = true;
				object.reason = reason;
				object.user = props.userState[0].name;
				object.updated = moment().format('DD MMM YYYY');
			}
		});

		if (!inRelatedObject) {
			props.relatedObjects.push({
				objectId: id,
				reason: reason,
				objectType: type,
				user: props.userState[0].name,
				updated: moment().format('DD MMM YYYY'),
			});
		}
	}

	function descriptionCount(e) {
		var input = e.target.value;
		document.getElementById('currentCount').innerHTML = e.target.value.length;
	}

	function resultsInsightsCount(e) {
		document.getElementById('resultsInsightsCount').innerHTML = e.target.value.length;
	}

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
								<Col sm={10} lg={10}>
									<p className='black-20 margin-bottom-0 pad-bottom-8'>{props.isEdit ? 'Edit your paper' : 'Add a new paper'}</p>
								</Col>
								<Col sm={2} lg={2} className='text-right'>
									<span className='badge-paper'>
										<SVGIcon name='projecticon' fill={'#3c3c3b'} className='badgeSvg mr-2' />
										Paper
									</span>
								</Col>
							</Row>
							<p className='gray800-14 margin-bottom-0'>Papers should be articles published in a journal. Add a project if you want</p>
						</div>
					</Col>
					<Col sm={1} lg={10} />
				</Row>

				<Row className='pixelGapTop'>
					<Col sm={1} lg={1} />
					<Col sm={10} lg={10}>
						<Form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} autocomplete='off'>
							<div className='rectangle'>
								<Form.Group>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Link</p>
									<p className='gray700-13 margin-bottom-0'>Where can we find this paper?</p>
									<Form.Control
										id='link'
										name='link'
										type='text'
										className={formik.touched.link && formik.errors.link ? 'emptyFormInput addFormInput' : 'addFormInput'}
										onChange={formik.handleChange}
										value={formik.values.link}
										onBlur={validatePaper}
									/>
									{formik.touched.link && formik.errors.link ? <div className='errorMessages'>{formik.errors.link}</div> : null}
									{formik.status && formik.status.duplicateLink ? <div className='errorMessages'>{formik.status.duplicateLink}</div> : null}
								</Form.Group>

								<Form.Group>
									<span className='gray800-14'>Title</span>
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

								<Form.Group>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Authors on the Gateway</p>
									<p className='gray700-13 margin-bottom-0'>Add any authors or collaborators who have an account on this site</p>
									<Typeahead
										id='authors'
										labelKey={authors => `${authors.name}`}
										defaultSelected={listOfAuthors}
										multiple
										className={
											formik.touched.authors && formik.errors.authors
												? 'emptyFormInputTypeAhead addFormInputTypeAhead'
												: 'addFormInputTypeAhead'
										}
										options={props.combinedUsers}
										onChange={selected => {
											var tempSelected = [];
											selected.forEach(selectedItem => {
												tempSelected.push(selectedItem.id);
											});
											formik.values.authors = tempSelected;
										}}
									/>
									{formik.touched.authors && formik.errors.authors ? <div className='errorMessages'>{formik.errors.authors}</div> : null}
								</Form.Group>

								<Row className='mt-2'>
									<Col sm={12} lg={12}>
										<Form.Group>
											<Row>
												<Col sm={1} lg={1}>
													<Form.Control
														type='checkbox'
														id='isPreprint'
														name='isPreprint'
														checked={formik.values.isPreprint}
														onChange={formik.handleChange}
														value={formik.values.isPreprint}
														className='paperFormCheckbox'
														data-testid='isPreprint'
													/>
												</Col>
												<Col sm={11} lg={11} id='preprintCheckCol'>
													<span className='gray800-14'>This article is a preprint</span>

													<span className='purple-13' onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
														<InfoSVG className='paperFormSVG' />
													</span>
													{isShown && (
														<div className='preprintFormToolTip'>
															<span className='white-13-semibold'>
																A preprint is a complete scientific manuscript that an author uploads on a public server for free viewing.
																Initially it is posted without peer review, but may acquire feedback or reviews as a preprint, and may
																eventually be published in a peer-reviewed journal. The posting of preprints on public servers allows almost
																immediate dissemination and scientific feedback early in the 'publication' process.
															</span>
														</div>
													)}
												</Col>
											</Row>
										</Form.Group>
									</Col>
								</Row>

								{formik.values.isPreprint === false ? (
									<Row className='mt-2'>
										<Col sm={10}>
											<Form.Group>
												<span className='gray800-14'>Journal</span>
												<Form.Control
													id='journal'
													name='journal'
													type='text'
													className={formik.touched.journal && formik.errors.journal ? 'emptyFormInput addFormInput' : 'addFormInput'}
													onChange={formik.handleChange}
													value={formik.values.journal}
													onBlur={formik.handleBlur}
												/>
												{formik.touched.journal && formik.errors.journal ? (
													<div className='errorMessages'>{formik.errors.journal}</div>
												) : null}
												{formik.touched.journalYear && formik.errors.journalYear ? (
													<div className='errorMessages'>{formik.errors.journalYear}</div>
												) : null}
											</Form.Group>
										</Col>
										<Col sm={2}>
											<Form.Group>
												<span className='gray800-14'>Year</span>
												<Form.Control
													id='journalYear'
													name='journalYear'
													type='text'
													className={
														formik.touched.journalYear && formik.errors.journalYear ? 'emptyFormInput addFormInput' : 'addFormInput'
													}
													onChange={formik.handleChange}
													value={formik.values.journalYear}
													onBlur={formik.handleBlur}
												/>
											</Form.Group>
										</Col>
									</Row>
								) : (
									''
								)}

								<Form.Group>
									<div style={{ display: 'inline-block' }}>
										<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Abstract</p>
										<p className='gray700-13 margin-bottom-0'>Provide a brief summary of the paper</p>
									</div>
									<div style={{ display: 'inline-block', float: 'right' }}>
										<br />
										<span className='gray700-13'>
											(<span id='currentCount'>{formik.values.description.length || 0}</span>
											/3000)
										</span>
									</div>
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
										onKeyUp={descriptionCount}
										onChange={formik.handleChange}
										value={formik.values.description}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.description && formik.errors.description ? (
										<div className='errorMessages'>{formik.errors.description}</div>
									) : null}
								</Form.Group>

								<Form.Group>
									<div style={{ display: 'inline-block' }}>
										<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Results/Insights</p>
										<p className='gray700-13 margin-bottom-0'>Include any results or insights about the paper.</p>
									</div>
									<div style={{ display: 'inline-block', float: 'right' }}>
										<br />
										<span className='gray700-13'>
											(<span id='resultsInsightsCount'>{formik.values.resultsInsights.length || 0}</span>
											/3000)
										</span>
									</div>
									<Form.Control
										as='textarea'
										id='resultsInsights'
										name='resultsInsights'
										type='text'
										className={
											formik.touched.resultsInsights && formik.errors.resultsInsights
												? 'emptyFormInput addFormInput descriptionInput'
												: 'addFormInput descriptionInput'
										}
										onKeyUp={resultsInsightsCount}
										onChange={formik.handleChange}
										value={formik.values.resultsInsights}
										onBlur={formik.handleBlur}
									/>
									{formik.touched.resultsInsights && formik.errors.resultsInsights ? (
										<div className='errorMessages'>{formik.errors.resultsInsights}</div>
									) : null}
								</Form.Group>

								<Form.Group>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Keywords (optional)</p>
									<p className='gray700-13 margin-bottom-0'>
										Technological paradigms or other keywords. Eg. Rule-based, clustering, supervised machine learning
									</p>
									<Typeahead
										id='tags.features'
										labelKey='features'
										allowNew
										multiple
										className='addFormInputTypeAhead'
										options={props.combinedFeatures}
										onChange={selected => {
											var tempSelected = [];
											selected.forEach(selectedItem => {
												selectedItem.customOption === true ? tempSelected.push(selectedItem.features) : tempSelected.push(selectedItem);
											});
											formik.values.tags.features = tempSelected;
										}}
									/>
								</Form.Group>

								<Form.Group>
									<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Domain (optional)</p>
									<p className='gray700-13 margin-bottom-0'>E.g. Biogenomics, Nutrition, Blockchain</p>
									<Typeahead
										id='tags.topics'
										labelKey='topics'
										allowNew
										multiple
										className='addFormInputTypeAhead'
										options={props.combinedTopic}
										onChange={selected => {
											var tempSelected = [];
											selected.forEach(selectedItem => {
												selectedItem.customOption === true ? tempSelected.push(selectedItem.topics) : tempSelected.push(selectedItem);
											});
											formik.values.tags.topics = tempSelected;
										}}
									/>
								</Form.Group>
							</div>

							<div className='rectangle mt-2'>
								<span className='black-20'>Related resources</span>
								<span className='gray800-14'> (optional)</span>
								<br />
								<span className='gray800-14'>
									Show relationships to papers, projects, datasets and tools. Resources must be added to the Gateway first.
								</span>
							</div>

							{props.relatedObjects.length === 0 ? (
								''
							) : (
								<div className='rectangle'>
									{props.relatedObjects.map(object => {
										if (!_.isNil(object.objectId)) {
											return (
												<RelatedObject
													showRelationshipQuestion={true}
													objectId={object.objectId}
													objectType={object.objectType}
													doRemoveObject={props.doRemoveObject}
													doUpdateReason={updateReason}
													reason={object.reason}
													didDelete={props.didDelete}
													updateDeleteFlag={props.updateDeleteFlag}
												/>
											);
										}
									})}
								</div>
							)}

							<div className='rectangle flexCenter pixelGapTop'>
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
											paperData={props.paperData}
											personData={props.personData}
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
						</Form>
					</Col>
					<Col sm={1} lg={10} />
				</Row>
				<Row>
					<span className='formBottomGap'></span>
				</Row>
			</Container>

			<ActionBar userState={props.userState}>
				<a style={{ cursor: 'pointer' }} href={'/account?tab=papers'}>
					<Button variant='medium' className='cancelButton dark-14 mr-2'>
						Cancel
					</Button>
				</a>

				<Button onClick={() => relatedResourcesRef.current.showModal()} variant='white' className='techDetailButton mr-2'>
					+ Add resource
				</Button>

				<Button variant='primary' className='publishButton white-14-semibold mr-2' type='submit' onClick={formik.handleSubmit}>
					{props.isEdit ? 'Update' : 'Publish'}
				</Button>
			</ActionBar>
		</div>
	);
};

export default AddEditPaperForm;
