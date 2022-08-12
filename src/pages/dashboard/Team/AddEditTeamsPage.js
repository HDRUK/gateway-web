import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Loading from '../../commonComponents/Loading';
import '../Dashboard.scss';
import { LayoutContent } from '../../../components/Layout';
import { Box } from 'hdruk-react-core';
import Switch from '../../../components/Switch';
import publishersService from '../../../services/publishers';

const baseURL = require('../../commonComponents/BaseURL').getURL();

const AddEditTeamsPage = ({
    cancelAddEdit,
    editTeamsView,
    editViewID,
    editViewMemberOf,
    editViewOrgName,
    editViewTeamManagers,
    setAlertFunction,
    questionBankEnabled,
}) => {
    // state
    const [questionBank, setQuestionBank] = useState(questionBankEnabled);
    const [isLoading, setLoading] = useState(false);
    const [combinedTeamManagers, setCombinedTeamManagers] = useState({});

    const memberOfSelect = ['ALLIANCE', 'HUB', 'OTHER', 'NCS'];

    const questionBankRequest = publishersService.usePatchQuestionBank();

    const handleMemberOfSelect = key => {
        formik.setFieldValue('memberOf', key);
    };

    const getTeamManagerData = () => {
        axios
            .get(`${baseURL}/api/v1/users`)
            .then(res => {
                const userArray = [];
                res.data.data.map(user => {
                    userArray.push({ id: user.id, name: user.name });
                });
                setCombinedTeamManagers(userArray);
            })
            .catch(err => {
                console.error(err.message);
                alert('Failed to fetch users');
            });
    };
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            name: editTeamsView && editViewOrgName ? editViewOrgName : '',
            memberOf: editTeamsView && editViewMemberOf ? editViewMemberOf : '',
            teamManagers: editTeamsView && editViewTeamManagers ? editViewTeamManagers : [],
            contactPoint: '',
        },

        validationSchema: Yup.object({
            name: Yup.string().required('Please enter an organisation name'),
            memberOf: Yup.string().required('Please select a membership'),
            teamManagers: Yup.string().required('Please select a team manager'),
            contactPoint: Yup.string().email('Please enter a valid email'),
        }),

        onSubmit: async values => {
            setLoading(true);

            await questionBankRequest.mutateAsync({
                _id: editViewID,
                enabled: questionBank,
            });

            if (editTeamsView) {
                axios.put(`${baseURL}/api/v1/teams/${editViewID}`, values).then(res => {
                    const alert = {
                        message: "You have editted the data custodian team '" + `${editViewMemberOf} > ${editViewOrgName}` + "'",
                    };
                    setAlertFunction(alert);
                    setLoading(false);
                    cancelAddEdit();
                });
            } else {
                axios.post(`${baseURL}/api/v1/teams/add`, values).then(res => {
                    const alert = {
                        message: "You have added the data custodian team '" + `${values.name}` + "'",
                    };
                    setAlertFunction(alert);
                    setLoading(false);
                    cancelAddEdit();
                });
            }
        },
    });

    const handleEnableQuestionBank = React.useCallback(({ target: { checked } }) => {
        setQuestionBank(checked);
    }, []);

    // lifecycle hook
    useEffect(() => {
        getTeamManagerData();
    }, []);

    if (isLoading) {
        return (
            <LayoutContent>
                <Loading data-testid='isLoading' />
            </LayoutContent>
        );
    }

    return (
        <LayoutContent>
            <Row className='accountHeader'>
                <Box display='flex' alignItems='flex-end' width='100%'>
                    <Box flexGrow={1}>
                        <span className='black-20'>{editTeamsView ? 'Edit ' : 'Add '} team details</span>
                    </Box>
                    <Box display='flex' justifyContent='flex-end'>
                        <Switch
                            label={
                                <>
                                    Question Bank <strong>{questionBank ? 'enabled' : 'disabled'}</strong>
                                </>
                            }
                            onChange={handleEnableQuestionBank}
                            checked={questionBank}
                        />
                    </Box>
                </Box>
                <Col sm={12} md={12}>
                    <Row>
                        <span className='gray700-13 '>
                            {editTeamsView ? 'Edit ' : 'Add '} the details of the data custodian team you wish to add to the Gateway
                        </span>
                    </Row>
                </Col>
            </Row>
            <Row className='entryBox px-1 pt-0 addEditTeamBorder'>
                <Col sm={12} lg={12}>
                    <Row className='mt-3'>
                        <Col sm={12} lg={12}>
                            <p className='gray800-14 mb-0'>Organisation name</p>
                            <p className='gray700-13 mb-0'>Please ensure the name matches the standard format for organisation names</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={12}>
                            <Form.Group className='pb-2'>
                                <Form.Control
                                    id='name'
                                    name='name'
                                    type='text'
                                    className={formik.touched.name && formik.errors.name ? 'emptyFormInput addFormInput' : 'addFormInput'}
                                    onChange={formik.handleChange}
                                    value={formik.values.name}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className='errorMessages'>{formik.errors.name}</div>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12} lg={12}>
                            <p className='gray800-14 mb-0'>Member of</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={12}>
                            <Form.Group className='pb-2'>
                                <DropdownButton
                                    variant='white'
                                    title={
                                        formik.values.memberOf ? (
                                            <>
                                                <div className='memberOfValueInFront'>
                                                    <select className='hiddenSelectBox' />
                                                </div>
                                                <div className='memberOfValue'>{formik.values.memberOf}</div>
                                            </>
                                        ) : (
                                            <select className='hiddenSelectBox' />
                                        )
                                    }
                                    className={
                                        formik.touched.memberOf && formik.errors.memberOf
                                            ? 'emptyFormInput  gray800-14 custom-dropdown margin-top-8 padding-right-0'
                                            : 'gray700-13 custom-dropdown margin-top-8 padding-right-0'
                                    }
                                    onChange={selected => {
                                        formik.setFieldValue('memberOf', selected.target.value);
                                    }}
                                    value={formik.values.memberOf}
                                    onBlur={() => formik.setFieldTouched('memberOf', true)}
                                    touched={formik.touched.memberOf}
                                    onSelect={selected => handleMemberOfSelect(selected)}>
                                    {memberOfSelect.map((mem, i) => (
                                        <Dropdown.Item className='gray800-14 width-100' key={mem} eventKey={mem}>
                                            {mem}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                                {formik.touched.memberOf && formik.errors.memberOf ? (
                                    <div className='errorMessages'>{formik.errors.memberOf}</div>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12} lg={12}>
                            <p className='gray800-14 mb-0'>Team manager</p>
                            <p className='gray700-13 mb-0'>
                                Assign at least one team manager. They will be able to manage members, create and assign workflows, review
                                applications that are assigned to them and make the final decision on data access request applications. They
                                cannot be removed once the team is published
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={12}>
                            <Form.Group className='pb-2'>
                                <Typeahead
                                    id='teamManagers'
                                    name='teamManagers'
                                    labelKey={
                                        editTeamsView
                                            ? combinedTeamManagers => `${combinedTeamManagers}`
                                            : combinedTeamManagers => `${combinedTeamManagers.name}`
                                    }
                                    defaultSelected={formik.values.teamManagers}
                                    multiple
                                    disabled={editTeamsView}
                                    options={combinedTeamManagers}
                                    className={
                                        formik.touched.teamManagers && formik.errors.teamManagers
                                            ? 'emptyFormInput  sectorTypeahead addFormInput margin-bottom-8 margin-top-8'
                                            : 'sectorTypeahead addFormInput margin-bottom-8 margin-top-8'
                                    }
                                    onBlur={() => formik.setFieldTouched('teamManagers', true)}
                                    onChange={selected => {
                                        const tempSelected = [];
                                        selected.forEach(selectedItem => {
                                            tempSelected.push(selectedItem);
                                        });
                                        formik.values.teamManagers = tempSelected;
                                        formik.setFieldTouched('teamManagers', true);
                                    }}
                                />
                                {formik.touched.teamManagers && formik.errors.teamManagers ? (
                                    <div className='errorMessages'>{formik.errors.teamManagers}</div>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={12} lg={12}>
                            <p className='gray800-14 mb-0'>Contact point (optional)</p>
                            <p className='gray700-13 mb-0'>
                                Please provide a valid email address that can be used as a default if not provided by the custodian when
                                filling in the metadata form
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={12}>
                            <Form.Group className='pb-2'>
                                <Form.Control
                                    id='contactPoint'
                                    name='contactPoint'
                                    type='text'
                                    className={
                                        formik.touched.contactPoint && formik.errors.contactPoint
                                            ? 'emptyFormInput addFormInput'
                                            : 'addFormInput'
                                    }
                                    onChange={formik.handleChange}
                                    value={formik.values.contactPoint}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.contactPoint && formik.errors.contactPoint ? (
                                    <div className='errorMessages'>{formik.errors.contactPoint}</div>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='mt-3'>
                <Col sm={12} lg={12} className='pl-0'>
                    <button onClick={cancelAddEdit} className='button-tertiary'>
                        Cancel
                    </button>
                    <button onClick={formik.handleSubmit} className='button-primary margin-right-12 floatRight'>
                        Publish
                    </button>
                </Col>
            </Row>
        </LayoutContent>
    );
};

export default AddEditTeamsPage;
