import React, { Fragment, useRef } from 'react';
import axios from 'axios';
import { Formik, useFormik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import _ from 'lodash';
import moment from 'moment';
import { Form, Button, Row, Col, InputGroup, DropdownButton, Dropdown, Container } from 'react-bootstrap';
import { SlideDown } from 'react-slidedown';
import DatePicker from 'react-datepicker';

import RelatedResources from '../commonComponents/relatedResources/RelatedResources';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import googleAnalytics from '../../tracking';

import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './Course.scss';

const baseURL = require('../commonComponents/BaseURL').getURL();
let windowUrl = window.location.origin;

class Fees {
	constructor() {
		this.feeDescription = '';
		this.feeAmount = '';
		this.feePer = '';
	}
}

class Entries {
	constructor() {
		this.level = '';
		this.subject = '';
	}
}

const initialValues = {
	courseOptions: [
		{
			fees: [
				{
					feeDescription: '',
					feeAmount: '',
					feePer: '',
				},
			],
		},
	],
	entries: [
		{
			level: '',
			subject: '',
		},
	],
};

const AddEditCourseForm = props => {
	const courseOptions = {
		flexibleDates: false,
		startDate: '',
		studyMode: '',
		studyDurationNumber: '',
		studyDurationMeasure: '',
		fees: [
			{
				feeDescription: '',
				feeAmount: '',
				feePer: '',
			},
		],
	};

	let entriesArray = props.data.entries;
	if (entriesArray.length === 0) {
		entriesArray = [
			{
				level: '',
				subject: '',
			},
		];
	}

	const formik = useFormik({
		initialValues: {
			id: props.data.id || '',
			type: 'course',
			title: props.data.title || '',
			link: props.data.link || '',
			provider: props.data.provider || '',
			description: props.data.description || '',
			courseDelivery: props.data.courseDelivery || 'campus',
			location: props.data.location || '',
			keywords: props.data.keywords || [],
			domains: props.data.domains || [],
			courseOptions: props.data.courseOptions || [
				{
					flexibleDates: false,
					startDate: '',
					studyMode: '',
					studyDurationNumber: '',
					studyDurationMeasure: '',
					fees: [
						{
							feeDescription: '',
							feeAmount: '',
							feePer: '',
						},
					],
				},
			],
			entries: entriesArray,
			restrictions: props.data.restrictions || '',
			award: props.data.award || [],
			competencyFramework: props.data.competencyFramework || '',
			nationalPriority: props.data.nationalPriority || '',
			relatedObjects: props.relatedObjects || [],
		},

		validationSchema: Yup.object({
			title: Yup.string().required('This cannot be empty'),
			link: Yup.string().required('This cannot be empty'),
			provider: Yup.string().required('This cannot be empty'),
			description: Yup.string().max(3000, 'Maximum of 3,000 characters').required('This cannot be empty'),
			courseOptions: Yup.array().of(
				Yup.object().shape({
					startDate: Yup.string()
						.when('flexibleDates', { is: false, then: Yup.string().required('This cannot be empty') })
						.nullable(),
				})
			),
		}),

		onSubmit: values => {
			if (values.courseDelivery === 'online') values.location = '';
			values.relatedObjects = props.relatedObjects;
			if (props.isEdit) {
				axios.put(baseURL + '/api/v1/course/' + props.data.id, values).then(res => {
					window.location.href = windowUrl + '/course/' + props.data.id + '/?courseEdited=true';
				});
			} else {
				axios.post(baseURL + '/api/v1/course', values).then(res => {
					window.location.href = windowUrl + '/course/' + res.data.response.id + '/?courseAdded=true';
				});
			}
		},
	});

	const formRef = useRef();

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

	const relatedResourcesRef = React.useRef();

	const removePhase = index => {
		if (!_.isEmpty(formik.values.courseOptions)) {
			let newCourseOptions = formik.values.courseOptions.filter((key, idx) => {
				return idx !== index;
			});
			formik.setFieldValue('courseOptions', newCourseOptions);
		}
	};

	const studyMode = ['Full-time', 'Part-time', 'Self-taught'];

	const studyDurationMeasure = ['Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)', 'Year(s)'];

	const feePer = ['Week', 'Month', 'Year', 'Total course'];

	const level = ['No Entry Requirements', 'Bachelors', 'Masters', 'PhD', 'Honours', 'A level'];

	const priority = ['Understanding the causes of disease', 'Clinical trials', 'Improving Public Health', 'Better Care'];

	return (
		<div>
			<Container>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					innerRef={formRef}
					render={() => {
						return (
							<div>
								<Row className='margin-top-32'>
									<Col sm={1} lg={1} />
									<Col sm={10} lg={10}>
										<div className='rectangle'>
											<Row>
												<Col sm={10} lg={10}>
													<p className='black-20 margin-bottom-0 pad-bottom-8'>{props.isEdit ? 'Edit your course' : 'Add a new course'}</p>
												</Col>
												<Col sm={2} lg={2} className='text-right'>
													<span className='badge-course'>
														<SVGIcon name='newtoolicon' fill={'#ffffff'} className='badgeSvg mr-2' />
														Course
													</span>
												</Col>
											</Row>
											<p className='gray800-14 margin-bottom-0'>
												Courses are any educational programme that users of the Gateway may find helpful
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
													<span className='gray800-14'>Course title</span>
													<Form.Control
														data-test-id='title'
														id='title'
														name='title'
														type='text'
														className={formik.touched.title && formik.errors.title ? 'emptyFormInput addFormInput' : 'addFormInput'}
														onChange={formik.handleChange}
														value={formik.values.title}
														onBlur={formik.handleBlur}
													/>
													{formik.touched.title && formik.errors.title ? <div className='errorMessages'>{formik.errors.title}</div> : null}
												</Form.Group>

												<Form.Group>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>URL</p>
													<p className='gray700-13 margin-bottom-0'>Where can users sign up and find more information about this course?</p>
													<Form.Control
														data-test-id='url'
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
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Course provider</p>
													<p className='gray700-13 margin-bottom-0'>Who is providing this course?</p>
													<Form.Control
														data-test-id='provider'
														id='provider'
														name='provider'
														type='text'
														className={formik.touched.provider && formik.errors.provider ? 'emptyFormInput addFormInput' : 'addFormInput'}
														onChange={formik.handleChange}
														value={formik.values.provider}
														onBlur={formik.handleBlur}
													/>
													{formik.touched.provider && formik.errors.provider ? (
														<div className='errorMessages'>{formik.errors.provider}</div>
													) : null}
												</Form.Group>

												<Form.Group className='pb-2 margin-bottom-0'>
													<Form.Label className='gray800-14'>Course delivery method (optional)</Form.Label>
													<br />
													<InputGroup>
														<InputGroup.Prepend>
															<Row className='margin-bottom-8'>
																<InputGroup.Radio
																	id='courseDeliveryCampus'
																	className='ml-3'
																	aria-label='On-campus'
																	name='courseDelivery'
																	defaultChecked={formik.values.courseDelivery === 'campus'}
																	onChange={e => {
																		formik.setFieldValue('courseDelivery', 'campus');
																	}}
																/>
																<span className='gray800-14 ml-3'>On-campus</span>
															</Row>
															<Row className='margin-bottom-12'>
																<InputGroup.Radio
																	id='courseDeliveryOnline'
																	className='ml-3'
																	aria-label='Online'
																	name='courseDelivery'
																	defaultChecked={formik.values.courseDelivery === 'online'}
																	onChange={e => {
																		formik.setFieldValue('courseDelivery', 'online');
																	}}
																/>
																<span className='gray800-14 ml-3'>Online</span>
															</Row>
														</InputGroup.Prepend>
													</InputGroup>
													{formik.values.courseDelivery === 'campus' ? (
														<Form.Group>
															<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Location (optional)</p>
															<p className='gray700-13 margin-bottom-0'>
																Where is this course being held? e.g. London, Manchester, Wales, Scotland
															</p>
															<Form.Control
																data-test-id='location'
																id='location'
																name='location'
																type='text'
																className='addFormInput'
																onChange={formik.handleChange}
																value={formik.values.location}
																onBlur={formik.handleBlur}
															/>
														</Form.Group>
													) : null}
												</Form.Group>

												<Form.Group>
													<div style={{ display: 'inline-block' }}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Description</p>
														<p className='gray700-13 margin-bottom-0'>Include an overview of the course</p>
													</div>
													<div style={{ display: 'inline-block', float: 'right' }}>
														<br />
														<span className='gray700-13'>
															(<span id='currentCount'>{formik.values.description.length || 0}</span>/3000)
														</span>
													</div>
													<Form.Control
														data-test-id='description'
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
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Keywords (optional)</p>
													<p className='gray700-13 margin-bottom-0'>E.g. Community, Research, Statistical Analysis</p>
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
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.keywords)
																	: tempSelected.push(selectedItem);
															});
															formik.values.keywords = tempSelected;
														}}
													/>
												</Form.Group>

												<Form.Group>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Domain (optional)</p>
													<p className='gray700-13 margin-bottom-0'>E.g. Genomics, Health Informatics, Data Science</p>
													<Typeahead
														id='domains'
														labelKey='domains'
														allowNew
														defaultSelected={formik.values.domains}
														multiple
														options={props.combinedDomains}
														className='addFormInputTypeAhead'
														onChange={selected => {
															var tempSelected = [];
															selected.forEach(selectedItem => {
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.domains)
																	: tempSelected.push(selectedItem);
															});
															formik.values.domains = tempSelected;
														}}
													/>
												</Form.Group>
											</div>

											<div className='rectangle mt-2'>
												<p className='black-20 margin-bottom-0 pad-bottom-8'>Dates and costs</p>
											</div>

											<div className='rectangle pixelGapTop'>
												<div className='main-body'>
													<FieldArray
														name='courseOptions'
														render={() => (
															<div>
																{formik.values.courseOptions.length > 0 &&
																	formik.values.courseOptions.map((node, index) => {
																		return (
																			<div key={`courseOptions-${index}`} className='main-accordion'>
																				<div
																					className='main-accordion-header'
																					onClick={e => {
																						e.preventDefault();
																						formik.setFieldValue(`courseOptions[${index}].expand`, !node.expand);
																					}}>
																					<SVGIcon name='chevronbottom' fill={'#fff'} className={node.expand ? '' : 'flip180'} />
																					<h1>{index + 1}. Course option</h1>
																				</div>
																				<SlideDown closed={node.expand}>
																					<div className='main-accordion-body'>
																						<div className='form-group'>
																							<label htmlFor={`node.${index}.sections`} className='form-label'>
																								Course start date
																							</label>
																							<small className='form-text mb-2'>
																								If the start date is flexible, for instance if it is a self-taught course that you can begin
																								at any time, select the checkbox.
																							</small>
																							<div className='row mb-2'>
																								<Form.Control
																									data-test-id='flexible-dates'
																									type='checkbox'
																									className='checker'
																									id={`courseOptions[${index}].flexibleDates`}
																									name={`courseOptions[${index}].flexibleDates`}
																									checked={formik.values.courseOptions[index].flexibleDates}
																									onChange={formik.handleChange}
																								/>
																								<span className='gray800-14 ml-4'>This course has flexible dates</span>
																							</div>
																						</div>

																						{!formik.values.courseOptions[index].flexibleDates ? (
																							<>
																								<DatePicker
																									name={`courseOptions[${index}].startDate`}
																									dateFormat='dd/MM/yyyy'
																									peekNextMonth
																									showMonthDropdown
																									showYearDropdown
																									dropdownMode='select'
																									selected={
																										formik.values.courseOptions[index].startDate
																											? new Date(formik.values.courseOptions[index].startDate)
																											: ''
																									}
																									onChange={date => {
																										formik.values.courseOptions[index].startDate = date;
																										formik.setFieldValue();
																									}}
																									onBlur={formik.handleBlur}
																								/>
																								{formik.touched.courseOptions &&
																								formik.touched.courseOptions[index] &&
																								formik.errors.courseOptions &&
																								formik.errors.courseOptions[index] &&
																								formik.touched.courseOptions[index].startDate &&
																								formik.errors.courseOptions[index].startDate ? (
																									<div className='errorMessages'>{formik.errors.courseOptions[index].startDate}</div>
																								) : null}
																							</>
																						) : (
																							''
																						)}

																						<Row className='mt-2'>
																							<Col sm={12}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Course duration (optional)</p>
																								<p className='gray700-13 margin-bottom-0'>
																									Input the duration for this course option. If this course does not have a set duration,
																									for example if it’s self-taught, please input an expected duration.
																								</p>
																							</Col>
																							<Col sm={4}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Study mode</p>
																							</Col>
																							<Col sm={4}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Duration</p>
																							</Col>
																							<Col sm={4} />
																						</Row>

																						<Row className='mt-2'>
																							<Col sm={4} className='pad-right-0'>
																								<DropdownButton
																									data-test-id='study-mode'
																									variant='white'
																									title={
																										formik.values.courseOptions[index].studyMode || (
																											<option disabled selected value></option>
																										)
																									}
																									className='gray700-13 custom-dropdown padding-right-0'
																									onChange={formik.handleChange}
																									value={formik.values.courseOptions[index].studyMode}
																									onBlur={formik.handleBlur}
																									onSelect={selected => (formik.values.courseOptions[index].studyMode = selected)}>
																									{studyMode.map((study, i) => (
																										<Dropdown.Item
																											data-test-id={`study-mode-${study}`}
																											className='gray800-14 width-100'
																											key={study}
																											eventKey={study}>
																											{study}
																										</Dropdown.Item>
																									))}
																								</DropdownButton>
																							</Col>
																							<Col sm={4} className='pad-right-0'>
																								<Form.Control
																									data-test-id='study-duration-number'
																									id={`courseOptions[${index}].studyDurationNumber`}
																									name={`courseOptions[${index}].studyDurationNumber`}
																									type='text'
																									className={
																										formik.touched.courseOptions &&
																										formik.touched.courseOptions[index] &&
																										formik.errors.courseOptions &&
																										formik.errors.courseOptions[index] &&
																										formik.touched.courseOptions[index].studyDurationNumber &&
																										formik.errors.courseOptions[index].studyDurationNumber
																											? 'emptySmallFormInput addFormInput'
																											: 'smallFormInput addFormInput'
																									}
																									onChange={formik.handleChange}
																									value={formik.values.courseOptions[index].studyDurationNumber}
																									onBlur={formik.handleBlur}
																								/>
																								{formik.touched.courseOptions &&
																								formik.touched.courseOptions[index] &&
																								formik.errors.courseOptions &&
																								formik.errors.courseOptions[index] &&
																								formik.touched.courseOptions[index].studyDurationNumber &&
																								formik.errors.courseOptions[index].studyDurationNumber ? (
																									<div className='errorMessages'>
																										{formik.errors.courseOptions[index].studyDurationNumber}
																									</div>
																								) : null}
																							</Col>
																							<Col sm={4}>
																								<DropdownButton
																									data-test-id='study-duration-measure'
																									variant='white'
																									title={
																										formik.values.courseOptions[index].studyDurationMeasure || (
																											<option disabled selected value></option>
																										)
																									}
																									className='gray700-13 custom-dropdown padding-right-0'
																									onChange={formik.handleChange}
																									value={formik.values.courseOptions[index].studyDurationMeasure}
																									onBlur={formik.handleBlur}
																									onSelect={selected =>
																										(formik.values.courseOptions[index].studyDurationMeasure = selected)
																									}>
																									{studyDurationMeasure.map((study, i) => (
																										<Dropdown.Item
																											data-test-id={`duration-measure-${study}`}
																											className='gray800-14 width-100'
																											key={study}
																											eventKey={study}>
																											{study}
																										</Dropdown.Item>
																									))}
																								</DropdownButton>
																							</Col>
																						</Row>

																						<Row className='mt-2'>
																							<Col sm={12}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Course fee (optional)</p>
																								<p className='gray700-13 margin-bottom-0'>
																									Include details of the fees for each type of applicant for this course option, as well as
																									the time frame the fee applies to.
																								</p>
																							</Col>
																							<Col sm={6}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Description</p>
																							</Col>
																							<Col sm={2}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Fee (GBP)</p>
																							</Col>
																							<Col sm={4}>
																								<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Per</p>
																							</Col>
																						</Row>

																						<Row className='mt-2'>
																							<FieldArray
																								name='fees'
																								render={({ insert, remove, push }) => (
																									<Fragment>
																										{formik.values.courseOptions[index].fees.length > 0 &&
																											formik.values.courseOptions[index].fees.map((p, indexB) => (
																												<Fragment>
																													<Col sm={6} className='pad-right-0 pad-bottom-4'>
																														<div className=''>
																															<Form.Control
																																data-test-id='fee-description'
																																id={`courseOptions[${index}].fees[${indexB}].feeDescription`}
																																name={`courseOptions[${index}].fees[${indexB}].feeDescription`}
																																type='text'
																																className='smallFormInput addFormInput'
																																onChange={formik.handleChange}
																																value={formik.values.courseOptions[index].fees[indexB].feeDescription}
																																onBlur={formik.handleBlur}
																															/>
																														</div>
																													</Col>
																													<Col sm={2} className='pad-right-0 pad-bottom-4'>
																														<div className=''>
																															<Form.Control
																																data-test-id='fee-amount'
																																id={`courseOptions[${index}].fees[${indexB}].feeAmount`}
																																name={`courseOptions[${index}].fees[${indexB}].feeAmount`}
																																type='text'
																																className={
																																	formik.touched.courseOptions &&
																																	formik.touched.courseOptions[index] &&
																																	formik.errors.courseOptions &&
																																	formik.errors.courseOptions[index] &&
																																	formik.touched.courseOptions[index].fees &&
																																	formik.errors.courseOptions[index].fees &&
																																	formik.touched.courseOptions[index].fees[indexB] &&
																																	formik.errors.courseOptions[index].fees[indexB] &&
																																	formik.touched.courseOptions[index].fees[indexB].feeAmount &&
																																	formik.errors.courseOptions[index].fees[indexB].feeAmount
																																		? 'emptySmallFormInput addFormInput'
																																		: 'smallFormInput addFormInput'
																																}
																																onChange={formik.handleChange}
																																value={formik.values.courseOptions[index].fees[indexB].feeAmount}
																																onBlur={formik.handleBlur}
																															/>
																															{formik.touched.courseOptions &&
																															formik.touched.courseOptions[index] &&
																															formik.errors.courseOptions &&
																															formik.errors.courseOptions[index] &&
																															formik.touched.courseOptions[index].fees &&
																															formik.errors.courseOptions[index].fees &&
																															formik.touched.courseOptions[index].fees[indexB] &&
																															formik.errors.courseOptions[index].fees[indexB] &&
																															formik.touched.courseOptions[index].fees[indexB].feeAmount &&
																															formik.errors.courseOptions[index].fees[indexB].feeAmount ? (
																																<div className='errorMessages'>
																																	{formik.errors.courseOptions[index].fees[indexB].feeAmount}
																																</div>
																															) : null}
																														</div>
																													</Col>
																													<Col sm={2} className='pad-right-0 pad-bottom-4'>
																														<div className=''>
																															<DropdownButton
																																data-test-id='fee-per'
																																variant='white'
																																title={
																																	formik.values.courseOptions[index].fees[indexB].feePer || (
																																		<option disabled selected value></option>
																																	)
																																}
																																className='gray700-13 custom-dropdown padding-right-0'
																																onChange={formik.handleChange}
																																value={formik.values.courseOptions[index].fees[indexB].feePer}
																																onBlur={formik.handleBlur}
																																onSelect={selected =>
																																	(formik.values.courseOptions[index].fees[indexB].feePer = selected)
																																}>
																																{feePer.map((study, i) => (
																																	<Dropdown.Item
																																		data-test-id={`fee-per-${study}`}
																																		className='gray800-14 width-100'
																																		key={study}
																																		eventKey={study}>
																																		{study}
																																	</Dropdown.Item>
																																))}
																															</DropdownButton>
																														</div>
																													</Col>

																													<Col
																														style={{ paddingRight: '0px' }}
																														className='col-sm-6 col-md-2 d-flex justify-content-center align-items-center setHeight'>
																														<button
																															type='button'
																															className='plusMinusButton'
																															disabled={formik.values.courseOptions[index].fees.length < 2}
																															onClick={() => {
																																remove(indexB);
																																formik.values.courseOptions[index].fees.splice(indexB, 1);
																															}}>
																															-
																														</button>
																														<button
																															type='button'
																															className='plusMinusButton'
																															disabled={
																																formik.values.courseOptions[index].fees.length >= 5 ||
																																indexB !== formik.values.courseOptions[index].fees.length - 1
																															}
																															onClick={() => {
																																push(new Fees());
																																formik.values.courseOptions[index].fees.push({
																																	feeDescription: '',
																																	feeAmount: '',
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

																						<div className='form-group phase-action' style={{ paddingTop: '10px' }}>
																							<button
																								className='button-tertiary'
																								disabled={formik.values.courseOptions.length < 2}
																								onClick={async e => {
																									e.preventDefault();
																									removePhase(index);
																								}}>
																								<CloseButtonSvg width='10px' height='10px' fill='#475DA7' /> Remove option
																							</button>
																						</div>
																					</div>
																				</SlideDown>
																			</div>
																		);
																	})}

																<div className='main-footer'>
																	<button
																		type='button'
																		className='button-secondary'
																		onClick={() => {
																			formik.values.courseOptions.push(courseOptions);
																			formik.setFieldValue(); /* push(courseOptions); */
																		}}>
																		+ Add course option
																	</button>
																</div>
															</div>
														)}
													/>
												</div>
											</div>

											<div className='rectangle mt-2'>
												<p className='black-20 margin-bottom-0 pad-bottom-8'>Requirements and certifications</p>
											</div>

											<div className='rectangle pixelGapTop'>
												<Row className='mt-2'>
													<Col sm={12}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Entry requirements (optional)</p>
														<p className='gray700-13 margin-bottom-0'>
															Detail the relevant requirements an applicant must hold to apply for this course option.
														</p>
													</Col>
													<Col sm={5}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Entry level</p>
														<p className='gray700-13 margin-bottom-0'>E.g. PhD, Bachelor's</p>
													</Col>
													<Col sm={7}>
														<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Entry subject</p>
														<p className='gray700-13 margin-bottom-0'>E.g. Maths, Biology, Science, STEM</p>
													</Col>
												</Row>

												<Row className='mt-2'>
													<FieldArray
														name='entry'
														render={({ remove, push }) => (
															<Fragment>
																{formik.values.entries.length > 0 &&
																	formik.values.entries.map((p, indexC) => (
																		<Fragment>
																			<Col sm={5} className='pad-right-0 pad-bottom-4'>
																				<DropdownButton
																					data-test-id='entry-level'
																					variant='white'
																					title={formik.values.entries[indexC].level || <option disabled selected value></option>}
																					className='gray700-13 custom-dropdown padding-right-0'
																					onChange={formik.handleChange}
																					value={formik.values.entries[indexC].level}
																					onBlur={formik.handleBlur}
																					onSelect={selected => (formik.values.entries[indexC].level = selected)}>
																					{level.map((l, i) => (
																						<Dropdown.Item
																							data-test-id={`entry-level-${l}`}
																							className='gray800-14 width-100'
																							key={l}
																							eventKey={l}>
																							{l}
																						</Dropdown.Item>
																					))}
																				</DropdownButton>
																			</Col>
																			<Col sm={5} className='pad-right-0 pad-bottom-4'>
																				<div className=''>
																					<Form.Control
																						data-test-id='entry-subject'
																						id={`entries[${indexC}].subject`}
																						name={`entries[${indexC}].subject`}
																						type='text'
																						className='smallFormInput addFormInput'
																						onChange={formik.handleChange}
																						value={formik.values.entries[indexC].subject}
																						onBlur={formik.handleBlur}
																					/>
																				</div>
																			</Col>

																			<Col
																				style={{ paddingRight: '0px' }}
																				sm={2}
																				className='d-flex justify-content-center align-items-center setHeight'>
																				<button
																					type='button'
																					className='plusMinusButton'
																					disabled={formik.values.entries.length < 2}
																					onClick={() => {
																						remove(indexC);
																						formik.values.entries.splice(indexC, 1);
																					}}>
																					-
																				</button>
																				<button
																					type='button'
																					className='plusMinusButton'
																					disabled={formik.values.entries.length >= 5 || indexC !== formik.values.entries.length - 1}
																					onClick={() => {
																						push(new Entries());
																						formik.values.entries.push({ level: '', subject: '' });
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
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Restrictions (optional)</p>
													<p className='gray700-13 margin-bottom-0'>
														E.g. Open/none, open to current students, open to employees, not open to visiting students
													</p>
													<Form.Control
														id='restrictions'
														name='restrictions'
														type='text'
														className='addFormInput'
														onChange={formik.handleChange}
														value={formik.values.restrictions}
														onBlur={formik.handleBlur}
													/>
												</Form.Group>

												<Form.Group>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Award (optional)</p>
													<p className='gray700-13 margin-bottom-0'>E.g. CPD, Fellowship, PhD, CPE, PGCert, PGDip, MSc, DPhil</p>
													<Typeahead
														id='award'
														labelKey='award'
														allowNew
														defaultSelected={formik.values.award}
														multiple
														options={props.combinedAwards}
														className='addFormInputTypeAhead'
														onChange={selected => {
															var tempSelected = [];
															selected.forEach(selectedItem => {
																selectedItem.customOption === true
																	? tempSelected.push(selectedItem.award)
																	: tempSelected.push(selectedItem);
															});
															formik.values.award = tempSelected;
														}}
													/>
												</Form.Group>

												<Form.Group>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>Competency framework (optional)</p>
													<Form.Control
														id='competencyFramework'
														name='competencyFramework'
														type='text'
														className='addFormInput'
														onChange={formik.handleChange}
														value={formik.values.competencyFramework}
														onBlur={formik.handleBlur}
													/>
												</Form.Group>

												<Form.Group>
													<p className='gray800-14 margin-bottom-0 pad-bottom-4'>National priority areas (optional)</p>
													<p className='gray700-13 margin-bottom-0'>
														E.g. Understanding the causes of disease, Clinical trials, Improving Public Health and Better Care
													</p>
													<DropdownButton
														variant='white'
														title={formik.values.nationalPriority || <option disabled selected value></option>}
														className='gray700-13 custom-dropdown padding-right-0'
														style={{ width: '100%' }}
														onChange={formik.handleChange}
														value={formik.values.nationalPriority}
														onBlur={formik.handleBlur}
														onSelect={selected => (formik.values.nationalPriority = selected)}>
														{priority.map((l, i) => (
															<Dropdown.Item className='gray800-14 width-100' key={l} eventKey={l}>
																{l}
															</Dropdown.Item>
														))}
													</DropdownButton>
												</Form.Group>
											</div>

											<div className='rectangle mt-2'>
												<span className='black-20'>Related resources</span>
												<span className='gray800-14'> (optional)</span>
												<br />
												<span className='gray800-14'>
													Show relationships to papers, data uses, datasets, tools and courses. Resources must be added to the Gateway
													first.
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
																	pid={object.pid}
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
					<a style={{ cursor: 'pointer' }} href={'/account?tab=courses'}>
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
						data-test-id='add-course-publish'
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

export default AddEditCourseForm;
