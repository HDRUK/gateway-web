/* eslint-disable prefer-destructuring */
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { Button } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Col, Dropdown, Form, Modal, Row } from 'react-bootstrap';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import * as Yup from 'yup';

import { authService, teamService } from 'services';
import { isEmpty } from 'lodash';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';

import AsyncTypeAheadUsers from '../commonComponents/AsyncTypeAheadUsers';
import './AccountMemberModal.scss';

const AccountMemberModal = ({ open, close, teamId, onMemberAdded }) => {
    const [userInfo, setUserInfo] = useState([]);

    const getUserInfo = async () => {
        const res = await authService.getStatus();
        setUserInfo(res.data.data[0]);
    };
    const addTeamMembers = teamService.useAddMembers();

    useEffect(() => {
        getUserInfo().catch(console.error);
    }, []);

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
            role: 'Metadata Editor',
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
            <FormikProvider value={formik}>
                <Modal
                    show={open}
                    onHide={close}
                    size='lg'
                    aria-labelledby='contained-modal-title-vcenter'
                    centered
                    className='accountMembersModal'>
                    <Form onSubmit={formik.handleSubmit} autocomplete='off'>
                        <div className='accountMembersModal-header'>
                            <div className='accountMembersModal-header--wrap'>
                                <div className='accountMembersModal-head'>
                                    <h1 className='black-20-semibold'>Add members to your team</h1>
                                    <CloseButtonSvg className='accountMembersModal-head--close' onClick={() => close()} />
                                </div>
                                <p>Users that you want to add to your team must already have an account on the Gateway.</p>
                            </div>
                            <FieldArray
                                name='members'
                                render={({ remove, push }) =>
                                    formik.values.members.map((p, index) => (
                                        // eslint-disable-next-line react/no-array-index-key
                                        <Form.Group key={index} labelKey={`members.${index}.user`}>
                                            <Row>
                                                <Col sm={5} md={5} className='padding-right-4'>
                                                    <AsyncTypeAheadUsers
                                                        selectedUsers={[formik.values.members[index].user]}
                                                        changeHandler={selected => {
                                                            if (!isEmpty(selected)) {
                                                                formik.values.members[index].user = selected[0];
                                                            }
                                                        }}
                                                        currentUserId={userInfo.id}
                                                        multiple={false}
                                                        placeholder='Search user'
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
                                                        }}>
                                                        -
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className='plusMinusButton'
                                                        disabled={
                                                            formik.values.members.length >= 5 || index !== formik.values.members.length - 1
                                                        }
                                                        onClick={() => {
                                                            push({
                                                                user: '',
                                                                role: '',
                                                            });
                                                        }}>
                                                        +
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    ))
                                }
                            />
                            {/* End of Field Array */}
                        </div>
                        <div className='accountMembersModal-footer'>
                            <div className='accountMembersModal-footer--wrap'>
                                <Button
                                    variant='secondary'
                                    onClick={e => {
                                        e.preventDefault();
                                        close();
                                    }}>
                                    Cancel
                                </Button>
                                <Button type='submit'>Add members</Button>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </FormikProvider>
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
