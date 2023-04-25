import { useCallback, useState } from 'react';
import { Row, Col, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import NotificationManager from 'react-notifications';
import { Box } from 'hdruk-react-core';

import { LayoutContent, Switch } from 'components';
import { publishersService, usersService } from 'services';

import '../Dashboard.scss';
import Loading from '../../commonComponents/Loading';

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
    dataUseWidgetEnabled,
}) => {
    // state
    const [questionBank, setQuestionBank] = useState(questionBankEnabled);
    const [dataUseWidget, setDataUseWidget] = useState(dataUseWidgetEnabled);
    const [isLoading, setIsLoading] = useState(false);
    const [isAsyncLoading, setIsAsyncLoading] = useState(false);
    const [combinedTeamManagers, setCombinedTeamManagers] = useState([]);

    const memberOfSelect = ['ALLIANCE', 'HUB', 'OTHER', 'NCS'];

    const questionBankRequest = publishersService.usePatchQuestionBank();
    const dataUseWidgetRequest = publishersService.usePatchPublisherDataUseWidget({
        onError: ({ title, message }) => {
            NotificationManager.error(message, title, 10000);
        },
    });

    const handleMemberOfSelect = key => {
        formik.setFieldValue('memberOf', key);
    };

    const handleSearch = async searchValue => {
        setIsAsyncLoading(true);
        const users = await usersService.searchUsers(encodeURI(searchValue));
        setCombinedTeamManagers(users.data.data);
        setIsAsyncLoading(false);
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
            teamManagers: Yup.string().required('Please select a team admin'),
            contactPoint: Yup.string().email('Please enter a valid email'),
        }),

        onSubmit: async values => {
            setIsLoading(true);

            let publisherId = editViewID;
            let alertText;

            if (editTeamsView) {
                await axios.put(`${baseURL}/api/v1/teams/${editViewID}`, values);

                alertText = {
                    message: "You have edited the data custodian team '" + `${editViewMemberOf} > ${editViewOrgName}` + "'",
                };
            } else {
                const newTeam = await axios.post(`${baseURL}/api/v1/teams/add`, values);

                alertText = {
                    message: "You have added the data custodian team '" + `${values.name}` + "'",
                };

                publisherId = newTeam.data._id;
            }

            await questionBankRequest.mutateAsync({
                _id: publisherId,
                enabled: questionBank,
            });

            await dataUseWidgetRequest.mutateAsync({
                _id: publisherId,
                data: {
                    enabled: dataUseWidget,
                },
            });

            setIsLoading(false);
            setAlertFunction(alertText);

            cancelAddEdit();
        },
    });

    const handleEnableQuestionBank = useCallback(({ target: { checked } }) => {
        setQuestionBank(checked);
    }, []);

    const handleEnableDataUseWidget = useCallback(({ target: { checked } }) => {
        setDataUseWidget(checked);
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
                    <Box display='flex' justifyContent='flex-end' gap={3}>
                        <Switch
                            label={
                                <>
                                    Question Bank <strong>{questionBank ? 'enabled' : 'disabled'}</strong>
                                </>
                            }
                            onChange={handleEnableQuestionBank}
                            checked={questionBank}
                        />
                        <Switch
                            label={
                                <>
                                    Data use widget <strong>{dataUseWidget ? 'enabled' : 'disabled'}</strong>
                                </>
                            }
                            onChange={handleEnableDataUseWidget}
                            checked={dataUseWidget}
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
                            <p className='gray800-14 mb-0'>Team admin</p>
                            <p className='gray700-13 mb-0'>
                            Can manage the existing members of your team, add new members, manage the teams notifications preferences like adding and editing the team email address
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} lg={12}>
                            <Form.Group className='pb-2'>
                                <AsyncTypeahead
                                    id='teamManagers'
                                    isLoading={isAsyncLoading}
                                    filterBy={() => true}
                                    minLength={3}
                                    name='teamManagers'
                                    placeholder='Enter 3 characters to search'
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
                                    onSearch={handleSearch}
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
