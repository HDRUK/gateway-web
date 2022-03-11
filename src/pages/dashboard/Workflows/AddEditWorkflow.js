import React, { Fragment, useState, useRef } from 'react';
import _ from 'lodash';
import * as Yup from 'yup';
import { Formik, Field, Form, FieldArray } from 'formik';
import axios from 'axios';
import { SlideDown } from 'react-slidedown';
import WorkflowModal from './WorkflowModal';
import SVGIcon from '../../../images/SVGIcon';
import { ReactComponent as CloseButtonSvg } from '../../../images/close-alt.svg';
import { ReactComponent as CheckSVG } from '../../../images/check.svg';
import TypaheadMultiUser from '../../DataAccessRequest/components/TypeaheadUser/TypeaheadMultiUser';
import { baseURL } from '../../../configs/url.config';
import { modalactions, defaultModal, modalConfigWorkflow } from '../../../utils/Workflows.util';
import './Workflows.scss';
import 'react-slidedown/lib/slidedown.css';

const AddEditWorkflow = props => {
	const { step, workflow, team, switchWorkflowView, updateWorkflow } = props;

	const formRef = useRef();
	const [editWorkflowName, setWorkflowNameEditState] = useState(false);
	const [savedSuccess, setSavedSuccess] = useState(false);
	const [modalConfig, setModalConfig] = useState(defaultModal);
	const [modalVisible, setModelVisible] = useState(false);
	const [phaseIndex, setPhaseIndex] = useState(-1);

	const onClickWorkFlowName = e => {
		e.preventDefault();
		setWorkflowNameEditState(!editWorkflowName);
	};

	const returnToWorkflows = e => {
		e.preventDefault();
		// 1. Formik current values
		const {
			current: { values },
		} = { ...formRef };
		// 2. Compare workflow from state to current form value
		const equalFormValues = _.isEqual(values, workflow);
		// 3. redirect back to workflows dashboard
		if (equalFormValues) {
			switchWorkflowView();
		} else {
			// setUnsavedValues(true);
			toggleModal(modalactions.SAVEWORKFLOW);
		}
	};

	const toggleModal = async (type = '', action = {}) => {
		let {
			current: { values, setValues },
		} = formRef;
		if (!_.isEmpty(type)) {
			let config = getModalConfig(type);
			setModalConfig(config);
			setModelVisible(!modalVisible);
		}
		if (!_.isEmpty(action)) {
			let { actionName = 'CANCEL', redirect = false } = action;
			switch (actionName.toUpperCase()) {
				case modalactions.CANCEL:
					setModelVisible(!modalVisible);
					if (redirect) switchWorkflowView();
					break;
				case modalactions.SAVEWORKFLOW:
					await handleFormSubmission();
					setModelVisible(!modalVisible);
					if (redirect) switchWorkflowView();
					break;
				case modalactions.DELETEPHASE:
					const formValues = deletePhase(values);
					setValues(formValues);
					setModelVisible(!modalVisible);
					break;
				case modalactions.DELETEWORKFLOW:
					await axios.delete(`${baseURL}/api/v1/workflows/${values._id}`);
					setModelVisible(!modalVisible);
					if (redirect) switchWorkflowView();
					break;
				default:
					return actionName;
			}
		}
	};

	const getModalConfig = type => {
		return modalConfigWorkflow(type);
	};

	const deletePhase = values => {
		let { steps } = { ...values };
		if (!_.isEmpty(steps)) {
			let newSteps = [...steps].filter((key, idx) => {
				return idx !== phaseIndex;
			});
			setPhaseIndex(-1);
			return {
				...values,
				steps: newSteps,
			};
		}
		return values;
	};

	const handleFormSubmission = async () => {
		let {
			current: { values, setSubmitting },
		} = formRef;
		let { workflowName, steps, _id = '' } = values;
		let existingWorkflow = !_.isEmpty(_id) ? true : false;
		let params = {
			workflowName,
			steps,
			publisher: team,
		};
		// setSubmitting state disable button
		setSubmitting(true);
		// New Workflow
		if (existingWorkflow) {
			await axios.put(`${baseURL}/api/v1/workflows/${_id}`, values);
			// set saved success green button
			setSavedSuccess(true);
			// update with latest values so compare on return to dashboard works
			updateWorkflow(values);
		} else {
			// get the new workflow from API
			const {
				data: { workflow },
			} = await axios.post(`${baseURL}/api/v1/workflows`, params);
			// set savedSuccess button state
			setSavedSuccess(true);
			// if success return setworkflow
			if (!_.isEmpty(workflow)) updateWorkflow(workflow);
		}
		// Set default button and submitting back after 5s
		setTimeout(() => {
			setSavedSuccess(false);
			setSubmitting(false);
		}, 5000);
	};

	const removePhase = index => {
		// setPhase index value
		setPhaseIndex(index);
		// toggleModal with RemovePhase action
		toggleModal(modalactions.DELETEPHASE);
	};

	const hasErrors = (touched, errors, index, field) => {
		if (
			touched &&
			errors &&
			typeof errors.steps !== 'undefined' &&
			typeof touched.steps !== 'undefined' &&
			typeof errors.steps[`${index}`] !== 'undefined' &&
			typeof touched.steps[`${index}`] !== 'undefined' &&
			typeof errors.steps[`${index}`][field] !== 'undefined' &&
			typeof touched.steps[`${index}`][field] !== 'undefined' &&
			errors.steps[`${index}`][field] &&
			touched.steps[`${index}`][field]
		) {
			return true;
		}
		return false;
	};

	return (
		<Fragment>
			<Formik
				enableReinitialize
				initialValues={workflow}
				innerRef={formRef}
				validationSchema={Yup.object({
					workflowName: Yup.string().trim().required('Required'),
					steps: Yup.array().of(
						Yup.object().shape({
							stepName: Yup.string().trim().required('This cannot be empty'),
							reviewers: Yup.array().of(Yup.string()).required('You must select at least one reviewer'),
							sections: Yup.array().of(Yup.string()).required('You must select at least one section'),
							deadline: Yup.number()
								.integer('You must enter a number')
								.min(4, 'You must enter a number greater than 3')
								.required('This cannot be empty'),
						})
					),
				})}
				onSubmit={async () => {
					await handleFormSubmission();
				}}>
				{({ isSubmitting, values, errors, touched, setFieldValue }) => (
					<Form autoComplete='off'>
						<div className='row justify-content-md-center'>
							<div className='col-sm-12 col-md-10'>
								<div className='main-card'>
									<div className='main-header'>
										<div className='main-header-desc'>
											<div>
												{editWorkflowName ? (
													<Fragment>
														<Field
															name='workflowName'
															type='text'
															className={`form-control ${errors.workflowName && touched.workflowName ? 'is-invalid' : ''}`}
														/>
														{errors.workflowName && touched.workflowName ? (
															<div className='errorMessages'>{errors.workflowName}</div>
														) : null}
													</Fragment>
												) : (
													<h1 className='black-20-semibold'>{values.workflowName}</h1>
												)}
											</div>
											<div className='soft-black-14'>
												Workflows are the frameworks used by your team to respond to data access request applications.
											</div>
										</div>
										{/* CLOSE HEADER-DESCRIPTION */}
										<div className='main-header-action'>
											<button className='button-tertiary mr-2' type='button' onClick={e => onClickWorkFlowName(e)}>
												{editWorkflowName ? 'Save name' : 'Edit name'}
											</button>
											<button className='button-tertiary' type='button' onClick={e => toggleModal(modalactions.DELETEWORKFLOW)}>
												Delete
											</button>
										</div>
										{/* CLOSE MAIN-HEADER-ACTION */}
									</div>
									{/* CLOSE MAIN-HEADER */}
									<div className='main-body'>
										<FieldArray
											name='steps'
											render={({ push }) => (
												<div>
													{values.steps.length > 0 &&
														values.steps.map((node, index) => {
															return (
																<div key={`step-${index}`} className='main-accordion'>
																	<div
																		className='main-accordion-header'
																		onClick={e => {
																			e.preventDefault();
																			setFieldValue(`steps[${index}].expand`, !node.expand);
																		}}>
																		<SVGIcon name='chevronbottom' fill={'#fff'} className={node.expand ? '' : 'flip180'} />
																		<h1>
																			{index + 1}. {node.stepName}
																		</h1>
																	</div>
																	<SlideDown closed={node.expand}>
																		<div className='main-accordion-body'>
																			<div className='form-group'>
																				<label htmlFor={`steps[${index}].stepName`} className='form-label'>
																					Phase Name
																				</label>
																				<Field
																					type='text'
																					name={`steps[${index}].stepName`}
																					id={`steps[${index}].stepName`}
																					className={`form-control control-name ${
																						hasErrors(touched, errors, index, 'stepName') ? 'is-invalid' : ''
																					}`}
																				/>
																				{hasErrors(touched, errors, index, 'stepName') ? (
																					<div className='errorMessages'>{errors.steps[index].stepName}</div>
																				) : null}
																			</div>
																			<div className='form-group'>
																				<label htmlFor={`steps[${index}].reviewers`} className='form-label'>
																					Reviewers
																				</label>
																				<small className='form-text mb-2'>Only members of your team can be added as reviewers.</small>
																				<TypaheadMultiUser
																					apiCall='teams'
																					team={team}
																					onHandleContributorChange={selected => {
																						setFieldValue(`steps[${index}].reviewers`, selected);
																					}}
																					selectedContributors={[...values.steps[index].reviewers]}
																					typeaheadId={`steps[${index}].reviewers`}
																					typeaheadName={`steps[${index}].reviewers`}
																					typeaheadClass={`${
																						hasErrors(touched, errors, index, 'reviewers') ? 'addFormInputTypeAhead is-invalid' : ''
																					}`}
																				/>
																				{hasErrors(touched, errors, index, 'reviewers') ? (
																					<div className='errorMessages'>{errors.steps[index].reviewers}</div>
																				) : null}
																			</div>
																			<div className='form-group'>
																				<label htmlFor={`node.${index}.sections`} className='form-label'>
																					What sections of the application can be reviewed?
																				</label>
																				<small className='form-text mb-2'>
																					Reviewers can see all sections of the application, but can only interact with and review their
																					assigned sections
																				</small>
																				<div className='row mb-2'>
																					<Field
																						type='checkbox'
																						name={`steps[${index}].sections`}
																						value='safepeople'
																						className={`checker ${hasErrors(touched, errors, index, 'sections') ? 'is-invalid' : ''}`}
																					/>
																					<span className='gray800-14 ml-4'>Safe people</span>
																				</div>
																				<div className='row mb-2'>
																					<Field
																						type='checkbox'
																						name={`steps[${index}].sections`}
																						value='safesettings'
																						className={`checker ${hasErrors(touched, errors, index, 'sections') ? 'is-invalid' : ''}`}
																					/>
																					<span className='gray800-14 ml-4'>Safe settings</span>
																				</div>
																				<div className='row mb-2'>
																					<Field
																						type='checkbox'
																						name={`steps[${index}].sections`}
																						value='safeproject'
																						className={`checker ${hasErrors(touched, errors, index, 'sections') ? 'is-invalid' : ''}`}
																					/>
																					<span className='gray800-14 ml-4'>Safe project</span>
																				</div>
																				<div className='row mb-2'>
																					<Field
																						type='checkbox'
																						name={`steps[${index}].sections`}
																						value='safeoutputs'
																						className={`checker ${hasErrors(touched, errors, index, 'sections') ? 'is-invalid' : ''}`}
																					/>
																					<span className='gray800-14 ml-4'>Safe outputs</span>
																				</div>
																				<div className='row mb-2'>
																					<Field
																						type='checkbox'
																						name={`steps[${index}].sections`}
																						value='safedata'
																						className={`checker ${hasErrors(touched, errors, index, 'sections') ? 'is-invalid' : ''}`}
																					/>
																					<span className='gray800-14 ml-4'>Safe data</span>
																				</div>
																				{hasErrors(touched, errors, index, 'sections') ? (
																					<div className='errorMessages'>{errors.steps[index].sections}</div>
																				) : null}
																			</div>
																			<div className='form-group'>
																				<label htmlFor={`node[${index}].start`} className='form-label'>
																					When will this phase start and end?
																				</label>
																				<small className='form-text'>
																					The first phase will begin once the workflow manager has started the review. The following phases
																					begin once a decision has been made by all reviewers on the previous phase, or once the manager
																					has progressed the review to the next phase. Reviewers will be notified when their assigned phase
																					has begun.
																				</small>
																			</div>
																			<div className='form-group'>
																				<label htmlFor={`node[${index}].deadline`} className='form-label'>
																					Deadline
																				</label>
																				<small className='form-text mb-2'>
																					Reviewers will be notified 3 day before the deadline. The manager can progress the
																					application to the next phase at any time.
																				</small>
																				<div className='form-inline'>
																					<Field
																						type='text'
																						id={`steps[${index}].deadline`}
																						name={`steps[${index}].deadline`}
																						className={`form-control control-deadline ${
																							hasErrors(touched, errors, index, 'deadline') ? 'is-invalid' : ''
																						}`}
																					/>
																					<small className='ml-2'>days after the start of this phase</small>
																				</div>
																				{hasErrors(touched, errors, index, 'deadline') ? (
																					<div className='errorMessages'>{errors.steps[index].deadline}</div>
																				) : null}
																			</div>
																			<div className='form-group phase-action'>
																				<button
																					className='button-tertiary'
																					onClick={async e => {
																						e.preventDefault();
																						removePhase(index);
																					}}>
																					<CloseButtonSvg width='10px' height='10px' fill='#475DA7' /> Remove phase
																				</button>
																			</div>
																		</div>
																	</SlideDown>
																</div>
															);
														})}
													<div className='main-footer'>
														<button type='button' className='button-secondary' onClick={e => push(step)}>
															+ Add another phase
														</button>
													</div>
													{/* CLOSE FOOTER */}
												</div>
											)}
										/>
										{/* CLOSE FIELD-ARRAY */}
									</div>
									{/* CLOSE MAIN-BODY */}
								</div>
								{/* CLOSE MAIN-CARD */}
								<div className='workflow-action-bar'>
									<button className='button-tertiary' onClick={e => returnToWorkflows(e)}>
										Return to all workflows
									</button>
									<button className={savedSuccess ? 'button-teal' : 'button-primary'} type='submit' disabled={isSubmitting}>
										{' '}
										{savedSuccess ? (
											<div>
												<CheckSVG fill='#fff' className='submitClose' /> Saved
											</div>
										) : (
											'Save'
										)}
									</button>
								</div>
							</div>
						</div>
					</Form>
				)}
			</Formik>

			<WorkflowModal open={modalVisible} context={modalConfig} close={toggleModal} />
		</Fragment>
	);
};

export default AddEditWorkflow;
