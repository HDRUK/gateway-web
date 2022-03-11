import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Formik, useFormik, FieldArray } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { isNil, isEmpty } from 'lodash';
import RemoveUploaderModal from '../commonComponents/RemoveUploaderModal';
import RemoveUploaderErrorModal from '../commonComponents/RemoveUploaderErrorModal';
import RelatedResources from '../commonComponents/relatedResources/RelatedResources';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import googleAnalytics from '../../tracking';
import TextareaAutosize from 'react-textarea-autosize';
import AsyncTypeAheadUsers from '../commonComponents/AsyncTypeAheadUsers';
import UploaderUtil from '../../utils/Uploader.util';
import SVGIcon from '../../images/SVGIcon';
import './Tool.scss';

const baseURL = require('../commonComponents/BaseURL').getURL();
let windowUrl = window.location.origin;

const initialValues = {
	programmingLanguage: [{ programmingLanguage: '', version: '' }],
};

class ProgrammingLanguage {
	constructor() {
		this.programmingLanguage = '';
		this.version = '';
	}
}

const validateSchema = Yup.object().shape({
	programmingLanguage: Yup.array().of(
		Yup.object().shape({
			programmingLanguage: Yup.string().required('This cannot be empty'),
		})
	),
});

const AddEditToolForm = props => {
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

	const formik = useFormik({
		initialValues: {
			id: props.data.id || '',
			type: 'tool',
			name: props.data.name || '',
			link: props.data.link || '',
			description: props.data.description || '',
			resultsInsights: props.data.resultsInsights || '',
			authorsNew: props.data.authorsNew || '',
			categories: props.data.categories || {
				category: '',
			},
			programmingLanguage: props.data.programmingLanguage || [
				{
					programmingLanguage: '',
					version: '',
				},
			],
			license: props.data.license || '',
			authors: props.data.authors || [props.userState[0].id],
			tags: props.data.tags || {
				features: [],
				topics: [],
			},
			relatedObjects: props.relatedObjects || [],
		},

		validationSchema: Yup.object({
			name: Yup.string().required('This cannot be empty'),
			link: Yup.string().required('This cannot be empty'),
			description: Yup.string().max(1500, 'Maximum of 1,500 characters').required('This cannot be empty'),
			resultsInsights: Yup.string().max(3000, 'Maximum of 3,000 characters'),
			categories: Yup.object().shape({
				category: Yup.string().required('This cannot be empty'),
			}),
			programmingLanguage: Yup.array().of(
				Yup.object().shape({
					programmingLanguage: Yup.string().required('This cannot be empty'),
				})
			),
			authors: Yup.string().required('This cannot be empty'),
		}),

		onSubmit: values => {
			values.relatedObjects = props.relatedObjects;
			values.toolCreator = props.userState[0];
			values.authors = uploadersList.map(uploader => uploader.id);
			if (props.isEdit) {
				axios.put(baseURL + '/api/v1/tools/' + props.data.id, values).then(res => {
					window.location.href = windowUrl + '/tool/' + props.data.id + '/?toolEdited=true';
				});
			} else {
				axios.post(baseURL + '/api/v1/tools', values).then(res => {
					window.location.href = windowUrl + '/tool/' + res.data.response.id + '/?toolAdded=true';
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
		document.getElementById('resultsInsightsCurrentCount').innerHTML = e.target.value.length;
	}

	const relatedResourcesRef = React.useRef();

	return (
		<div>
			<div className={'container'}>
				<RemoveUploaderModal
					open={showRemoveUploaderModal}
					cancelUploaderRemoval={cancelUploaderRemoval}
					confirmUploaderRemoval={confirmUploaderRemoval}
					entityType={'tool'}
					userState={props.userState}
					uploaderToBeRemoved={uploaderToBeRemoved}></RemoveUploaderModal>

				<RemoveUploaderErrorModal
					open={showRemoveUploaderErrorModal}
					cancelUploaderRemoval={cancelUploaderRemoval}
					entityType={'tool'}
					uploaderToBeRemoved={uploaderToBeRemoved}
					removingOriginalUploader={removingOriginalUploader}></RemoveUploaderErrorModal>
				<Formik
					initialValues={initialValues}
					validationSchema={validateSchema}
					render={({ values, errors, touched, handleReset, setFieldValue }) => {
						return (
							<div>
								<Row className='margin-top-32'>
									<Col sm={1} lg={1} />
									<Col sm={10} lg={10}>
										<div className='rectangle'>
											<Row>
												<Col sm={10} lg={10}>
													<p className='black-20 margin-bottom-0 pad-bottom-8'>
														{props.isEdit ? 'Edit your tool or resource' : 'Add a new tool or resource'}
													</p>
												</Col>
												<Col sm={2} lg={2} className='text-right'>
													<span className='badge-tool'>
														<SVGIcon name='newtoolicon' fill={'#ffffff'} className='badgeSvg mr-2' />
														Tool
													</span>
												</Col>
											</Row>
											<p className='gray800-14 margin-bottom-0'>
												Tools can be anything you or someone else created or used during a research project
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
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Link</p>
													<p className='gray700-13 margin-bottom-0'>Where can we find this tool or resource?</p>
													<Form.Control
														id='link'
														name='link'
														type='text'
														className={formik.touched.link && formik.errors.link ? 'emptyFormInput addFormInput' : 'addFormInput'}
														onChange={formik.handleChange}
														value={formik.values.link}
														onBlur={formik.handleBlur}
													/>
													{formik.touched.link && formik.errors.link ? <div className='errorMessages'>{formik.errors.link}</div> : null}
												</Form.Group>

												<Form.Group>
													<span className='gray800-14'>Name</span>
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

												<Form.Group data-test-id='txtType'>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Type</p>
													<p className='gray700-13 margin-bottom-0'>Select from existing or enter a new one.</p>
													<Typeahead
														id='categories.category'
														labelKey='category'
														allowNew
														defaultSelected={[formik.values.categories.category]}
														options={props.combinedCategories}
														className={
															formik.touched.categories &&
															formik.errors.categories &&
															typeof formik.errors.categories.category !== 'undefined'
																? 'emptyFormInputTypeAhead addFormInputTypeAhead'
																: 'addFormInputTypeAhead'
														}
														onChange={selected => {
															var tempSelected = [];
															selected.forEach(selectedItem => {
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.category)
																	: tempSelected.push(selectedItem);
															});
															tempSelected.length > 0
																? (formik.values.categories.category = tempSelected[0])
																: (formik.values.categories.category = '');
														}}
													/>
													{formik.touched.categories &&
													formik.errors.categories &&
													typeof formik.errors.categories.category !== 'undefined' ? (
														<div className='errorMessages'>{formik.errors.categories.category}</div>
													) : null}
												</Form.Group>

												<Form.Group data-test-id='description'>
													<div style={{ display: 'inline-block' }}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Description</p>
														<p className='gray700-13 margin-bottom-0'>Include the tool purpose and objective.</p>
													</div>
													<div style={{ display: 'inline-block', float: 'right' }}>
														<br />
														<span className='gray700-13'>
															(<span id='currentCount'>{formik.values.description.length || 0}</span>/1500)
														</span>
													</div>
													<TextareaAutosize
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
														<p className='gray700-13 margin-bottom-0'>Include any results or insights about the tool.</p>
													</div>
													<div style={{ display: 'inline-block', float: 'right' }}>
														<br />
														<span className='gray700-13'>
															(<span id='resultsInsightsCurrentCount'>{formik.values.resultsInsights.length || 0}</span>
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

												<span className='gray800-14'>Authors (optional)</span>
												<p className='gray700-13 margin-bottom-0'>
													Please add the names of the people who authored this tool, using a comma to separate the names
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

												<Row className='mt-2'>
													<Col sm={12} md={8}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Implementation</p>
														<p className='gray700-13 margin-bottom-0'>
															Programming languages, formalisms or frameworks. E.g. Python, RDF, GATE
														</p>
													</Col>
													<Col sm={6} md={3}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Version (optional)</p>
														<p className='gray700-13 margin-bottom-0'>i.e. 3.6.1</p>
													</Col>
												</Row>

												<Row className='mt-2'>
													<FieldArray
														name='programmingLanguage'
														render={({ insert, remove, push }) => (
															<Fragment>
																{formik.values.programmingLanguage.length > 0 &&
																	formik.values.programmingLanguage.map((p, index) => (
																		<Fragment>
																			<Col sm={12} md={8}>
																				<Form.Group
																					data-test-id={`programmingLanguage.${index}.programmingLanguage`}
																					labelKey={`programmingLanguage.${index}.programmingLanguage`}>
																					<Typeahead
																						id={`programmingLanguage-${index}`}
																						name={`programmingLanguage.${index}.programmingLanguage`}
																						labelkey={`programmingLanguage.${index}.programmingLanguage`}
																						options={props.combinedLanguages}
																						selected={[formik.values.programmingLanguage[index].programmingLanguage]}
																						allowNew
																						className={
																							formik.values.programmingLanguage[index].programmingLanguage === '' &&
																							formik.touched.programmingLanguage &&
																							formik.errors.programmingLanguage &&
																							formik.errors.programmingLanguage[index] &&
																							typeof formik.errors.programmingLanguage[index] !== 'undefined' &&
																							formik.touched.programmingLanguage[index] &&
																							formik.touched.programmingLanguage[index].version
																								? 'emptyFormInputTypeAhead addFormInputTypeAhead'
																								: 'addFormInputTypeAhead'
																						}
																						onChange={selected => {
																							var tempSelected = [];
																							selected.forEach(selectedItem => {
																								selectedItem.customOption === true
																									? tempSelected.push(selectedItem.label)
																									: tempSelected.push(selectedItem);
																							});
																							tempSelected.length > 0
																								? (formik.values.programmingLanguage[index].programmingLanguage = tempSelected[0])
																								: (formik.values.programmingLanguage[index].programmingLanguage = '');
																						}}
																					/>
																					{formik.values.programmingLanguage[index].programmingLanguage === '' &&
																					formik.touched.programmingLanguage &&
																					formik.errors.programmingLanguage &&
																					formik.errors.programmingLanguage[index] &&
																					typeof formik.errors.programmingLanguage[index] !== 'undefined' &&
																					formik.touched.programmingLanguage[index] &&
																					formik.touched.programmingLanguage[index].version ? (
																						<div className='errorMessages'>
																							{formik.errors.programmingLanguage[index].programmingLanguage}
																						</div>
																					) : null}
																				</Form.Group>
																			</Col>
																			<Col sm={6} md={2} style={{ paddingRight: '0px' }}>
																				<div className=''>
																					<Form.Control
																						id={`programmingLanguage.${index}.version`}
																						name={`programmingLanguage.${index}.version`}
																						type='text'
																						className='smallFormInput addFormInput'
																						onChange={formik.handleChange}
																						value={[formik.values.programmingLanguage[index].version]}
																						onBlur={formik.handleBlur}
																					/>
																				</div>
																			</Col>

																			<Col
																				style={{ paddingRight: '0px' }}
																				className='col-sm-6 col-md-2 d-flex justify-content-center align-items-center setHeight'>
																				<button
																					type='button'
																					className='plusMinusButton'
																					disabled={formik.values.programmingLanguage.length < 2}
																					onClick={() => {
																						remove(index);
																						formik.values.programmingLanguage.splice(index, 1);
																					}}>
																					-
																				</button>
																				<button
																					type='button'
																					className='plusMinusButton'
																					disabled={
																						formik.values.programmingLanguage.length >= 5 ||
																						index !== formik.values.programmingLanguage.length - 1
																					}
																					onClick={() => {
																						push(new ProgrammingLanguage());
																						formik.values.programmingLanguage.push({
																							programmingLanguage: '',
																							version: '',
																						});
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
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>License (optional)</p>
													<p className='gray700-13 margin-bottom-0'>Select from existing or enter a new one</p>
													<Typeahead
														id='license'
														labelKey='license'
														allowNew
														defaultSelected={[formik.values.license]}
														options={props.combinedLicenses}
														className='addFormInputTypeAhead'
														onChange={selected => {
															var tempSelected = [];
															selected.forEach(selectedItem => {
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.license)
																	: tempSelected.push(selectedItem);
															});
															tempSelected.length > 0 ? (formik.values.license = tempSelected[0]) : (formik.values.license = '');
														}}
													/>
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
														defaultSelected={formik.values.tags.features}
														multiple
														options={props.combinedFeatures}
														className='addFormInputTypeAhead'
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

												<Form.Group>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Domain (optional)</p>
													<p className='gray700-13 margin-bottom-0'>E.g. Biogenomics, Nutrition, Blockchain</p>
													<Typeahead
														id='tags.topics'
														labelKey='topics'
														allowNew
														defaultSelected={formik.values.tags.topics}
														multiple
														options={props.combinedTopic}
														className='addFormInputTypeAhead'
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
													<p className='gray700-13 margin-bottom-0'>Uploaders are Gateway members with editing rights on this tool.</p>
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
			</div>
			<ActionBar userState={props.userState}>
				<div className='floatRight'>
					<a style={{ cursor: 'pointer' }} href={'/account?tab=tools'}>
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
						data-test-id='add-tool-publish'
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

export default AddEditToolForm;
