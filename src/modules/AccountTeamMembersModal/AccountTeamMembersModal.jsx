/* eslint-disable prefer-destructuring */
import { FieldArray, FormikProvider, useFormik } from 'formik';
import { Button } from 'hdruk-react-core';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import pLimit from 'p-limit';

import { MultiSelect } from 'components';

import { ROLES_REVIEWER, ROLES_METADATA_EDITOR, ROLES_TEAM_ADMIN, ROLES_DAR_MANAGER, ROLES_METADATA_MANAGER } from 'configs';
import { authService, teamService } from 'services';

import { useCustodianRoles } from 'hooks';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import AsyncTypeAheadUsers from '../../pages/commonComponents/AsyncTypeAheadUsers';
import './AccountTeamMembersModal.scss';

const limit = pLimit(1);

const AccountTeamMembersModal = ({ isOpen, onClose, teamId, onMembersAdded, onMembersFailed }) => {
    const [userInfo, setUserInfo] = useState([]);
    const { isCustodianDarManager, isCustodianMetadataManager, isCustodianTeamAdmin } = useCustodianRoles(teamId);

    const getUserInfo = async () => {
        const res = await authService.getStatus();
        setUserInfo(res.data.data[0]);
    };

    const addTeamMembers = teamService.useAddMembers();

    const formik = useFormik({
        initialValues: {
            members: [
                {
                    user: '',
                    roles: [],
                },
            ],
        },

        validationSchema: Yup.object({
            members: Yup.array().of(
                Yup.object().shape({
                    user: Yup.string().required('This cannot be empty'),
                    roles: Yup.array().of(Yup.string()).required('Please select at least one role'),
                })
            ),
        }),

        onSubmit: async values => {
            try {
                const promises = values.members.map(async member => {
                    const user = { memberId: member.user._id, name: member.user.name, roles: member.roles.map(role => role.value) };
                    return limit(() => addTeamMembers.mutateAsync({ id: teamId, data: user }));
                });

                const responses = await Promise.allSettled(promises);

                onMembersAdded(responses);
                onClose();
            } catch (err) {
                onMembersFailed();
                onClose();
                console.error(err.message);
            }
        },
    });

    useEffect(() => {
        getUserInfo().catch(console.error);
    }, []);

    useEffect(() => {
        if (isOpen) return;
        formik.resetForm();
    }, [isOpen]);

    const validRoles = useMemo(() => {
        let roles = [];

        if (isCustodianTeamAdmin) {
            return [ROLES_TEAM_ADMIN, ROLES_METADATA_MANAGER, ROLES_METADATA_EDITOR, ROLES_DAR_MANAGER, ROLES_REVIEWER];
        }

        if (isCustodianDarManager) {
            roles = [...roles, ROLES_DAR_MANAGER, ROLES_REVIEWER];
        }

        if (isCustodianMetadataManager) {
            roles = [...roles, ROLES_METADATA_MANAGER, ROLES_METADATA_EDITOR];
        }

        return roles;
    }, [isCustodianTeamAdmin, isCustodianDarManager, isCustodianMetadataManager]);

    return (
        <div className='container'>
            <FormikProvider value={formik}>
                <Modal
                    show={isOpen}
                    onHide={onClose}
                    size='lg'
                    aria-labelledby='contained-modal-title-vcenter'
                    centered
                    className='accountMembersModal'>
                    <Form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} autocomplete='off'>
                        <div className='accountMembersModal-header'>
                            <div className='accountMembersModal-header--wrap'>
                                <div className='accountMembersModal-head'>
                                    <h1 className='black-20-semibold'>Add members to your team</h1>
                                    <CloseButtonSvg className='accountMembersModal-head--close' onClick={() => onClose()} />
                                </div>
                                <p>Users that you want to add to your team must already have an account on the Gateway</p>
                            </div>
                            <FieldArray
                                name='members'
                                render={({ remove, push }) =>
                                    formik.values.members.map((p, index) => (
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
                                                        placeholder='Enter 3 characters to search user'
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
                                                    <MultiSelect
                                                        onChange={selected => {
                                                            formik.values.members[index].roles = selected;
                                                        }}
                                                        options={validRoles}
                                                    />
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
                                                            push({ user: '', roles: [] });
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
                                        onClose();
                                    }}>
                                    Cancel
                                </Button>
                                <Button type='submit'>Add member(s)</Button>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </FormikProvider>
        </div>
    );
};

AccountTeamMembersModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    teamId: PropTypes.string.isRequired,
    onMembersAdded: PropTypes.func.isRequired,
    onMembersFailed: PropTypes.func.isRequired,
};

AccountTeamMembersModal.defaultProps = {
    isOpen: false,
};

export default AccountTeamMembersModal;
