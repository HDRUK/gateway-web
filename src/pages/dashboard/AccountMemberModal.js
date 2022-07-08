/* eslint-disable prefer-destructuring */
import { FieldArray, Formik, useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import * as Yup from 'yup';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import serviceAuth from '../../services/auth/auth';
import serviceTeam from '../../services/teams';
import AsyncTypeAheadUsers from '../commonComponents/AsyncTypeAheadUsers';
import './AccountMemberModal.scss';

const AccountMemberModal = ({ open, close, teamId, onMemberAdded }) => {
    const [userInfo, setUserInfo] = useState([]);

    const getUserInfo = async () => {
        const res = await serviceAuth.getStatus();
        setUserInfo(res.data.data[0]);
    };
    const addTeamMembers = serviceTeam.useAddMembers();

    useEffect(() => {
        getUserInfo();
    }, []);

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
            value: 'manager',
            roleDescription: 'Can add, edit or remove members and resources. Can assign workflows and review applications.',
        },
        {
            role: 'Reviewer',
            value: 'reviewer',
            roleDescription: 'Can review applications assigned to them.',
        },
        {
            role: 'Metadata editor',
            value: 'metadata_editor',
            roleDescription: 'Can add and create new versions of datasets',
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
                        const roleValue = roleSelect.find(roleObject => roleObject.role === m.role);
                        return { memberid: m.user._id, roles: [roleValue.value] };
                    }),
                };
                const {
                    data: { members },
                } = await addTeamMembers.mutateAsync({ id: teamId, data: payload });
                onMemberAdded(members);
                close();
            } catch (err) {
                console.error(err.message);
            }
        },
    });
    return (
        <div className='container'>
            <Formik
                initialValues={initialValues}
                render={() => (
                    <>
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
                                            <>
                                                <Row sm={12} md={12}>
                                                    <Col>
                                                        <p className='margin-bottom-0'>User</p>
                                                    </Col>
                                                </Row>
                                                {formik.values.members.map((p, index) => (
                                                    <Form.Group labelKey={`members.${index}.user`}>
                                                        <Row>
                                                            <Col sm={5} md={5} className='padding-right-4'>
                                                                <AsyncTypeAheadUsers
                                                                    selectedUsers={[formik.values.members[index].user]}
                                                                    changeHandler={selected => {
                                                                        formik.values.members[index].user = selected[0];
                                                                    }}
                                                                    getUsersInfo={false}
                                                                    currentUserId={userInfo.id}
                                                                    multiple={false}
                                                                    placeholder=''
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
                                                                                onSelect={selected => {
                                                                                    formik.values.members[index].role = selected;
                                                                                }}>
                                                                                <b>{role.role}</b> &nbsp;&nbsp;&nbsp;
                                                                                {role.roleDescription}
                                                                            </Dropdown.Item>
                                                                        ))}
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                                {formik.touched.members &&
                                                                formik.touched.members[index] &&
                                                                formik.touched.members[index].role &&
                                                                (formik.values.members[index].role === '' ||
                                                                    formik.values.members[index].role === 'Member role') &&
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
                                                                    disabled={
                                                                        formik.values.members.length >= 5 ||
                                                                        index !== formik.values.members.length - 1
                                                                    }
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
                                            </>
                                        )}
                                    />
                                    {/* End of Field Array */}
                                </div>
                                <div className='accountMembersModal-footer'>
                                    <div className='accountMembersModal-footer--wrap'>
                                        <button
                                            type='button'
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
                    </>
                )}
            />
        </div>
    );
};

AccountMemberModal.propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    onMemberAdded: PropTypes.func.isRequired,
};

export default AccountMemberModal;
