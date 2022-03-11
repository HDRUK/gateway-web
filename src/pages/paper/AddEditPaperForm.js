import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Formik, useFormik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import moment from 'moment';
import { isNil, isEmpty } from 'lodash';
import RelatedResources from '../commonComponents/relatedResources/RelatedResources';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import RemoveUploaderModal from '../commonComponents/RemoveUploaderModal';
import RemoveUploaderErrorModal from '../commonComponents/RemoveUploaderErrorModal';
import { isPDFLink, removeArrayItem } from '../../utils/GeneralHelper.util';
import googleAnalytics from '../../tracking';
import TextareaAutosize from 'react-textarea-autosize';
import AsyncTypeAheadUsers from '../commonComponents/AsyncTypeAheadUsers';
import UploaderUtil from '../../utils/Uploader.util';
import { ReactComponent as InfoSVG } from '../../images/info.svg';
import SVGIcon from '../../images/SVGIcon';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import './Paper.scss';

const baseURL = require('../commonComponents/BaseURL').getURL();
let windowUrl = window.location.origin;

const initialValues = {
	document_links: {
		doi: [''],
		pdf: [],
		html: [],
	},
};

const validateSchema = Yup.object().shape({
	document_links: Yup.array().of(
		Yup.object().shape({
			doi: Yup.array().of(Yup.string().min(5, 'This cannot be empty').required('This cannot be empty')),
		})
	),
});

const AddEditPaperForm = props => {
	const [isPreprintToolTipShown, setPreprintToolTipIsShown] = useState(false);
	const [uploadersList, setUploadersList] = useState([]);
	const [uploaderToBeRemoved, setUploaderToBeRemoved] = useState({});
	const [showRemoveUploaderModal, setShowRemoveUploaderModal] = useState(false);
	const [showRemoveUploaderErrorModal, setShowRemoveUploaderErrorModal] = useState(false);
	const [removingOriginalUploader, setRemovingOriginalUploader] = useState(false);
	const originalUploader = props.isEdit ? props.data.uploader : props.userState[0].id;
	useEffect(() => {
		async function getUploaderData() {
			setUploadersList(await UploaderUtil.buildListOfUploaders(props.data.authors, props.userState[0]));
		}
		getUploaderData();
	}, []);

	// Pass the useFormik() hook initial form values and a submit function that will
	// be called when the form is submitted
	const formik = useFormik({
		initialValues: {
			id: props.data.id || '',
			type: 'paper',
			name: props.data.name || '',
			document_links: props.data.document_links
				? {
						doi: [].concat(...Object.values(props.data.document_links)),
						pdf: [],
						html: [],
				  }
				: {
						doi: [''],
						pdf: [],
						html: [],
				  },
			authorsNew: props.data.authorsNew || '',
			journal: props.data.journal || '',
			journalYear: props.data.journalYear || '',
			description: props.data.description || '',
			resultsInsights: props.data.resultsInsights || '',
			tags: props.data.tags || {
				features: [],
				topics: [],
			},
			relatedObjects: props.relatedObjects,
			isPreprint: typeof props.data.isPreprint === 'undefined' ? false : props.data.isPreprint,
		},

		validationSchema: Yup.object({
			name: Yup.string().required('This cannot be empty'),
			description: Yup.string().max(3000, 'Maximum of 3,000 characters').required('This cannot be empty'),
			document_links: Yup.object().shape({
				doi: Yup.array().of(Yup.string().min(5, 'This cannot be empty').required('This cannot be empty')),
			}),
			resultsInsights: Yup.string().max(3000, 'Maximum of 3,000 characters'),
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
			for (var i = 0; i < values.document_links.doi.length; i++) {
				if (isPDFLink(values.document_links.doi[i])) {
					values.document_links.pdf.push(values.document_links.doi[i]);
					removeArrayItem(values.document_links.doi, values.document_links.doi[i]);
				}
			}
			values.authors = uploadersList.map(uploader => uploader.id);
			if (props.isEdit) {
				axios.put(baseURL + '/api/v1/papers/' + props.data.id, values).then(res => {
					window.location.href = windowUrl + '/paper/' + props.data.id + '/?paperEdited=true';
				});
			} else {
				axios.post(baseURL + '/api/v1/papers/', values).then(res => {
					window.location.href = windowUrl + '/paper/' + res.data.response.id + '/?paperAdded=true';
				});
			}
		},
	});

	const uploaderHandler = selectedOptions => {
		// 1. Check if removing any uploader
		const removedUploader = uploadersList.filter(uploader => !selectedOptions.map(selectedOpt => selectedOpt.id).includes(uploader.id))[0];
		if (!isEmpty(removedUploader)) {
			// 2. Check if removing original uploader
			if (removedUploader.id === originalUploader) {
				setRemovingOriginalUploader(true);
				setShowRemoveUploaderErrorModal(true);
			}
			// 3. Check if removing last uploader
			else if (isEmpty(selectedOptions)) {
				setUploaderToBeRemoved(removedUploader);
				setShowRemoveUploaderErrorModal(true);
			} else {
				// 4. If removing a regular uploader show regular remove uploader modal
				setUploaderToBeRemoved(removedUploader);
				setShowRemoveUploaderModal(true);
			}
		} else {
			// 5. If not removing uploader, user is adding uploader
			const addedUploader = selectedOptions
				.filter(selectedOpt => !uploadersList.map(uploader => uploader.id).includes(selectedOpt.id))
				.map(newUploader => {
					return { id: newUploader.id, name: newUploader.name };
				})[0];
			if (!isEmpty(addedUploader)) {
				setUploadersList([...uploadersList, addedUploader]);
			}
		}
		return uploadersList;
	};

	const cancelUploaderRemoval = () => {
		setUploaderToBeRemoved({});
		setRemovingOriginalUploader(false);
		setShowRemoveUploaderModal(false);
		setShowRemoveUploaderErrorModal(false);
	};

	const confirmUploaderRemoval = () => {
		setUploadersList(uploadersList.filter(uploader => uploader.id !== uploaderToBeRemoved.id));
		setUploaderToBeRemoved({});
		setShowRemoveUploaderModal(false);
	};

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

	function descriptionCount(e) {
		document.getElementById('currentCount').innerHTML = e.target.value.length;
	}

	function resultsInsightsCount(e) {
		document.getElementById('resultsInsightsCount').innerHTML = e.target.value.length;
	}

	const relatedResourcesRef = React.useRef();
	return (
		<div>
			<Container>
				<RemoveUploaderModal
					open={showRemoveUploaderModal}
					cancelUploaderRemoval={cancelUploaderRemoval}
					confirmUploaderRemoval={confirmUploaderRemoval}
					entityType={'paper'}
					userState={props.userState}
					uploaderToBeRemoved={uploaderToBeRemoved}></RemoveUploaderModal>

				<RemoveUploaderErrorModal
					open={showRemoveUploaderErrorModal}
					cancelUploaderRemoval={cancelUploaderRemoval}
					entityType={'paper'}
					uploaderToBeRemoved={uploaderToBeRemoved}
					removingOriginalUploader={removingOriginalUploader}></RemoveUploaderErrorModal>
				<Formik
					initialValues={initialValues}
					validationSchema={validateSchema}
					render={() => {
						return (
							<div>
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
											<p className='gray800-14 margin-bottom-0'>
												Papers should be articles published in a journal. Add a data use if you want
											</p>
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

												<Row className='mt-2'>
													<Col sm={12} lg={8}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>DOI and other links</p>
														<p className='gray700-13 margin-bottom-0'>
															If you don’t have a DOI please add an alternative URL or PDF full text link. You may add several.
														</p>
													</Col>
												</Row>

												<Row className='mt-2'>
													<FieldArray
														name='document_links'
														render={({ insert, remove, push }) => (
															<Fragment>
																{formik.values.document_links.doi.length > 0 &&
																	formik.values.document_links.doi.map((d, index) => (
																		<Fragment>
																			<Col sm={12} lg={10}>
																				<Form.Group labelKey={`document_links.doi`}>
																					<Form.Control
																						id={`document_links.doi.${index}`}
																						name={`document_links.doi.${index}`}
																						type='text'
																						onChange={e => {
																							formik.setFieldValue(`document_links.doi.${index}`, e.target.value);
																						}}
																						className={
																							formik.touched.document_links &&
																							formik.errors.document_links &&
																							formik.touched.document_links.doi &&
																							formik.errors.document_links.doi &&
																							formik.values.document_links.doi[0] === ''
																								? 'emptyFormInput addFormInput'
																								: 'addFormInput'
																						}
																						value={[formik.values.document_links.doi[index]]}
																						onBlur={formik.handleBlur}
																					/>
																					{formik.touched.document_links &&
																					formik.errors.document_links &&
																					typeof formik.errors.document_links !== 'undefined' &&
																					formik.touched.document_links.doi &&
																					formik.values.document_links.doi[0] === '' ? (
																						<div className='errorMessages'>{formik.errors.document_links.doi[0]}</div>
																					) : null}
																				</Form.Group>
																			</Col>

																			<Col
																				style={{ paddingRight: '0px' }}
																				className='col-sm-6 col-md-2 d-flex justify-content-center align-items-center setHeight'>
																				<button
																					type='button'
																					className='plusMinusButton'
																					disabled={formik.values.document_links.doi.length < 2}
																					onClick={() => {
																						remove(index);
																						formik.values.document_links.doi.splice(index, 1);
																					}}>
																					-
																				</button>
																				<button
																					data-test-id={`add-link-${index}`}
																					type='button'
																					className='plusMinusButton'
																					onClick={() => {
																						push('');
																						formik.values.document_links.doi.push('');
																					}}>
																					+
																				</button>
																			</Col>
																		</Fragment>
																	))}
															</Fragment>
														)}
													/>
												</Row>

												<Form.Group>
													<span className='gray800-14'>Authors (optional)</span>
													<p className='gray700-13 margin-bottom-0'>
														Please add the names of the people who authored this paper, using a comma to separate the names
													</p>
													<Form.Control
														id='authorsNew'
														data-test-id='authors'
														name='authorsNew'
														type='text'
														className='addFormInput gray700-13'
														onChange={formik.handleChange}
														value={formik.values.authorsNew}
													/>
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

																	<span
																		className='purple-13'
																		onMouseEnter={() => setPreprintToolTipIsShown(true)}
																		onMouseLeave={() => setPreprintToolTipIsShown(false)}>
																		<InfoSVG className='paperFormSVG' />
																	</span>
																	{isPreprintToolTipShown && (
																		<div className='preprintFormToolTip'>
																			<span className='white-13-semibold'>
																				A preprint is a complete scientific manuscript that an author uploads on a public server for free
																				viewing. Initially it is posted without peer review, but may acquire feedback or reviews as a
																				preprint, and may eventually be published in a peer-reviewed journal. The posting of preprints on
																				public servers allows almost immediate dissemination and scientific feedback early in the
																				'publication' process.
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
																	className={
																		formik.touched.journal && formik.errors.journal ? 'emptyFormInput addFormInput' : 'addFormInput'
																	}
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
													<TextareaAutosize
														data-test-id='abstract'
														as='textarea'
														id='description'
														name='description'
														type='text'
														className={
															formik.touched.description && formik.errors.description
																? 'emptyFormInput addFormInput descriptionInput textarea-addEditForm'
																: 'addFormInput descriptionInput textarea-addEditForm'
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
													<TextareaAutosize
														as='textarea'
														id='resultsInsights'
														name='resultsInsights'
														type='text'
														className={
															formik.touched.resultsInsights && formik.errors.resultsInsights
																? 'emptyFormInput addFormInput descriptionInput textarea-addEditForm'
																: 'addFormInput descriptionInput textarea-addEditForm'
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

												<Form.Group data-test-id='keywords'>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Keywords (optional)</p>
													<p className='gray700-13 margin-bottom-0'>
														Technological paradigms or other keywords. Eg. Rule-based, clustering, supervised machine learning
													</p>
													<Typeahead
														id='tags.features'
														labelKey='features'
														allowNew
														defaultSelected={formik.values.tags.features}
														multiple
														className='addFormInputTypeAhead'
														options={props.combinedFeatures}
														onChange={selected => {
															var tempSelected = [];
															selected.forEach(selectedItem => {
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.features)
																	: tempSelected.push(selectedItem);
															});
															formik.values.tags.features = tempSelected;
														}}
													/>
												</Form.Group>

												<Form.Group data-test-id='domain'>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Domain (optional)</p>
													<p className='gray700-13 margin-bottom-0'>E.g. Biogenomics, Nutrition, Blockchain</p>
													<Typeahead
														id='tags.topics'
														labelKey='topics'
														allowNew
														defaultSelected={formik.values.tags.topics}
														multiple
														className='addFormInputTypeAhead'
														options={props.combinedTopic}
														onChange={selected => {
															var tempSelected = [];
															selected.forEach(selectedItem => {
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.topics)
																	: tempSelected.push(selectedItem);
															});
															formik.values.tags.topics = tempSelected;
														}}
													/>
												</Form.Group>

												<Form.Group data-test-id='uploaders'>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Uploaders</p>
													<p className='gray700-13 margin-bottom-0'>Uploaders are Gateway members with editing rights on this paper.</p>
													<AsyncTypeAheadUsers
														selectedUsers={uploadersList}
														showAuthor={true}
														currentUserId={props.userState[0].id}
														changeHandler={uploaderHandler}
													/>
												</Form.Group>
											</div>

											<div className='rectangle mt-2'>
												<span className='black-20'>Related resources</span>
												<span className='gray800-14'> (optional)</span>
												<br />
												<span className='gray800-14'>
													Show relationships to papers, data uses, datasets and tools. Resources must be added to the Gateway first.
												</span>
											</div>

											{props.relatedObjects.length === 0 ? (
												''
											) : (
												<div className='rectangle'>
													{props.relatedObjects.map(object =>
														!isNil(object.objectId) ? (
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
															/>
														) : (
															''
														)
													)}
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
															datauseData={props.datauseData}
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
							</div>
						);
					}}
				/>
			</Container>

			<ActionBar userState={props.userState}>
				<div className='floatRight'>
					<a style={{ cursor: 'pointer' }} href={'/account?tab=papers'}>
						<Button variant='medium' className='cancelButton dark-14 mr-2'>
							Cancel
						</Button>
					</a>

					<Button
						onClick={() => {
							relatedResourcesRef.current.showModal();
							googleAnalytics.recordVirtualPageView('Related resources modal');
						}}
						variant='white'
						className='techDetailButton mr-2'>
						+ Add resource
					</Button>

					<Button
						data-test-id='add-paper-publish'
						variant='primary'
						className='publishButton white-14-semibold mr-2'
						type='submit'
						onClick={formik.handleSubmit}>
						{props.isEdit ? 'Update' : 'Publish'}
					</Button>
				</div>
			</ActionBar>
		</div>
	);
};

export default AddEditPaperForm;
