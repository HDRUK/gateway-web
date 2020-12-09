import React, { Fragment } from 'react';
import _ from 'lodash';
import { Col, Modal, Row } from 'react-bootstrap';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import axios from 'axios';
import { baseURL } from '../../configs/url.config';
import TypeaheadUser from '../DataAccessRequest/components/TypeaheadUser/TypeaheadUser';
import { Dropdown, Form } from 'react-bootstrap';
import { Formik, useFormik, FieldArray } from 'formik';
import * as Yup from 'yup';
import './AccountMemberModal.scss';
import DropdownMenu from 'react-bootstrap/DropdownMenu';

const AccountMemberModal = ({ open, close, teamId, onMemberAdded }) => {
	const initialValues = {
		members: [
			{
				user: '',
				role: '',
			},
		],
	};

	class Member {
		constructor() {
			this.user = '';
			this.role = '';
		}
	}

	const roleSelect = [
		{
			role: 'Manager',
			roleDescription: 'Can add, edit or remove members and resources. Can assign workflows and review applications.',
		},
		{
			role: 'Reviewer',
			roleDescription: 'Can review applications assigned to them.',
		},
	];

	const formik = useFormik({
		initialValues: {
			members: [
				{
					user: '',
					role: '',
				},
			],
		},

		validationSchema: Yup.object({
			members: Yup.array().of(
				Yup.object().shape({
					user: Yup.string().required('This cannot be empty'),
					role: Yup.string().required('Please specify a role'),
				})
			),
		}),

		onSubmit: async values => {
			try {
				const payload = {
					members: values.members.map(m => {
						return { memberid: m.user._id, roles: [m.role.toLowerCase()] };
					}),
				};

				await axios.post(`${baseURL}/api/v1/teams/${teamId}/members`, payload).then(res => {
					let {
						data: { members },
					} = res;
					onMemberAdded(members);
					close();
				});
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<div className={'container'}>
			<Formik
				initialValues={initialValues}
				render={() => {
					return (
						<Fragment>
							<Modal
								show={open}
								onHide={close}
								size='lg'
								aria-labelledby='contained-modal-title-vcenter'
								centered
								className='accountMembersModal'>
								<Form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} autocomplete='off'>
									<div className='accountMembersModal-header'>
										<div className='accountMembersModal-header--wrap'>
											<div className='accountMembersModal-head'>
												<h1 className='black-20-semibold'>Add members to your team</h1>
												<CloseButtonSvg className='accountMembersModal-head--close' onClick={() => close()} />
											</div>
											<p>Users that you want to add to your team must already have an account on the Gateway.</p>
										</div>
										<FieldArray
											name='member'
											render={({ remove, push }) => (
												<Fragment>
													<Row sm={12} md={12}>
														<Col>
															<p className='margin-bottom-0'>User</p>
														</Col>
													</Row>
													{formik.values.members.map((p, index) => (
														<Form.Group labelKey={`members.${index}.user`}>
															<Row>
																<Col sm={5} md={5} className='padding-right-4'>
																	<TypeaheadUser
																		id={`member-${index}`}
																		name={`member.${index}.member`}
																		labelkey={`member.${index}.member`}
																		selected={[formik.values.members[index].user]}
																		onBlur={() => formik.setFieldTouched('user', true)}
																		className={
																			formik.touched.members &&
																			formik.touched.members[index] &&
																			formik.touched.members[index].user &&
																			formik.errors &&
																			formik.errors.members &&
																			formik.errors.members[index] &&
																			formik.errors.members[index].user
																				? 'is-invalid'
																				: 'addFormInputTypeAhead'
																		}
																		onChange={selected => {
																			formik.values.members[index].user = selected;
																		}}
																	/>
																	{formik.touched.members &&
																	formik.touched.members[index] &&
																	formik.touched.members[index].user &&
																	formik.errors &&
																	formik.errors.members &&
																	formik.errors.members[index] ? (
																		<div className='errorMessages'>{formik.errors.members[index].user}</div>
																	) : null}
																</Col>
																<Col sm={5} md={5} className='padding-right-4 padding-left-4'>
																	<Dropdown
																		className={
																			(formik.touched.members &&
																				formik.touched.members[index] &&
																				formik.touched.members[index].role &&
																				formik.errors.members &&
																				formik.values.members[index].role === '') ||
																			formik.values.members[index].role === 'Member role'
																				? 'emptyFormInput  gray800-14 roleDropDown custom-dropdown padding-right-0 '
																				: 'gray700-13 custom-dropdown roleDropDown padding-right-0 '
																		}>
																		{' '}
																		<Dropdown.Toggle
																			variant='white'
																			drop='down'
																			title={formik.values.members[index].role || 'Member role'}
																			onChange={selected => {
																				formik.setFieldValue('role', selected.target.value);
																				formik.values.members[index].role = selected;
																			}}
																			value={formik.values.members[index].role}
																			onBlur={() => formik.setFieldTouched('role', true)}>
																			{formik.values.members[index].role || 'Member role'}
																		</Dropdown.Toggle>
																		<DropdownMenu className='accountMemberDropdown'>
																			{roleSelect.map((role, i) => (
																				<Dropdown.Item
																					className='gray800-14 width-100 accountMemberDropdownItem'
																					key={role.role}
																					eventKey={role.role}
																					onSelect={selected => (formik.values.members[index].role = selected)}>
																					<b>{role.role}</b> &nbsp;&nbsp;&nbsp;{role.roleDescription}
																				</Dropdown.Item>
																			))}
																		</DropdownMenu>
																	</Dropdown>
																	{formik.touched.members &&
																	formik.touched.members[index] &&
																	formik.touched.members[index].role &&
																	(formik.values.members[index].role === '' || formik.values.members[index].role === 'Member role') &&
																	formik.errors &&
																	formik.errors.members &&
																	formik.errors.members[index] &&
																	formik.errors.members[index].role ? (
																		<div className='errorMessages'>{formik.errors.members[index].role}</div>
																	) : null}
																</Col>
																<Col
																	style={{ paddingRight: '0px' }}
																	className='col-sm-6 col-md-2 d-flex justify-content-center align-items-center setHeight'>
																	<button
																		type='button'
																		className='plusMinusButton'
																		disabled={formik.values.members.length < 2}
																		onClick={() => {
																			remove(index);
																			formik.values.members.splice(index, 1);
																		}}>
																		-
																	</button>
																	<button
																		type='button'
																		className='plusMinusButton'
																		disabled={formik.values.members.length >= 5 || index !== formik.values.members.length - 1}
																		onClick={() => {
																			push(new Member());
																			formik.values.members.push({ user: '', role: '' });
																		}}>
																		+
																	</button>
																</Col>
															</Row>
														</Form.Group>
													))}
												</Fragment>
											)}
										/>
										{/*End of Field Array*/}
									</div>
									<div className='accountMembersModal-footer'>
										<div className='accountMembersModal-footer--wrap'>
											<button
												className='button-secondary'
												onClick={e => {
													e.preventDefault();
													close();
												}}>
												Cancel
											</button>
											<button variant='primary' className='button-primary' type='submit'>
												Add members
											</button>
										</div>
									</div>
								</Form>
							</Modal>
						</Fragment>
					);
				}}
			/>
		</div>
	);
};

export default AccountMemberModal;
