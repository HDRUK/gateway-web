import React, { Fragment, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import {Row, Container, Col, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../commonComponents/Loading';
import SearchBar from '../commonComponents/SearchBar';
import DatePicker from "react-datepicker";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Event, initGA } from '../../tracking';
import ReactGA from 'react-ga';

var baseURL = require('../commonComponents/BaseURL').getURL();

ReactGA.initialize('UA-166025838-1');

/**
 * [ValidationSchema]
 * @desc  {Setup Formik Yup Object for validation}
 */
const validationSchema = Yup.object({
        researchAim: Yup.string()
            .required('This cannot be empty'),
        linkedDataSets: Yup.string()
            .required('Please select an answer'),
        namesOfDataSets: Yup.string().when('linkedDataSets', {
            is: 'true',
            then: Yup.string().required('This cannot be empty'),
            otherwise: Yup.string().default('').notRequired()
        }),
        dataRequirements: Yup.string().required('Please select an answer'),
        dataSetParts: Yup.string().when('dataRequirements', {
            is: 'true',
            then: Yup.string().required('This cannot be empty'),
            otherwise: Yup.string().default('').notRequired()
        }),
        icoRegistration: Yup.string()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, "This is not a valid ICO registration"),
        contactNumber: Yup.string()
            .matches(/^[0-9]*$/, 'This is not a valid number')
    });
 
const Request = (props) => {

    const {searchString = '', userState, location: {state:{title, dataSetId}}} = props;
    let history = useHistory();
    const [reqState, setDefaultState] = useState({
        userState,
        searchString
      });
    const [user, ...rest] = userState;

    /**
     * [Formik - Setup]
     * @desc  {Formik form handling for request access}
     */
    const {handleSubmit, handleChange, handleBlur, values, errors, setFieldValue, touched} = useFormik({
        initialValues: {
            researchAim: '',
            linkedDataSets: '',
            namesOfDataSets: '',
            dataRequirements: '',
            dataSetParts: '',
            startDate: '',
            icoRegistration: '',
            researchBenefits: '',
            ethicalProcessingEvidence: '',
            contactNumber: ''
        },
        validationSchema,
        onSubmit: values => {
            const vals = {...values, title, userId: user.id, dataSetId};
            if(vals.linkedDataSets === 'false')
                vals.namesOfDataSets = '';
            
            if(vals.dataRequirements === 'false')
                vals.dataSetParts = '';
            
            // post to API
            if(dataSetId) {
                let message = { type: 'error', message: 'Something went wrong!'};
                const config = {
                   headers: {
                       'Content-Type': 'application/json'
                   }
                }
                axios.post(baseURL + '/api/v1/datasets/access/request', JSON.stringify(vals), config)
                    .then(response => {
                        message = response.data.message;
                    })
                    .catch(err => {
                        message = err.response.data.message;
                    })
                    .finally(() => {
                        history.push({pathname: `/dataset/${dataSetId}`, state: {alert: {...message}}});
                    });
            }
        }
      });
    
    const doSearch = (e) => {
        if (e.key === 'Enter') {
            if (!!reqState.searchString) 
                window.location.href = `/search?search=${reqState.searchString}&type=all`;
            
        }
    };

    const updateSearchString = (searchString) => {
        setDefaultState({ ...reqState, searchString });
    };

    const onDateChange = (date, setFieldValue) => {
        values.startDate = date;
        setFieldValue('startDate', date);
    }

    const onCancel = (e) => {
        e.preventDefault();
    }

     //redirect if !logged in
     if (!user.loggedIn) {
        return <Redirect to='/' />;
    }

    return (
      <div>
        <SearchBar searchString={searchString} doSearchMethod={doSearch} doUpdateSearchString={updateSearchString} userState={userState} />

        <Container className='mt-4 mb-5'>
            {/* HEADER */}
            <div className='Rectangle mb-xs'>
                <Row>
                    <Col>
                        <h1 className='Black-20px'>Request access for</h1>
                        <p className='Gray800-14px'>{title}</p>
                    </Col>
                </Row>
            </div>
            {/* FORM */}
            <Form onSubmit={handleSubmit}>
                <div className='Rectangle'>
                <Row className='mt-2'>
                    <Col>
                        {/* RESEARCH AIM*/}
                        <Form.Group className='pb-2'>
                            <Form.Label className='Gray800-14px'>Research Aim
                            <Form.Text className='Gray700-13px mt-0'>Please briefly explain the purpose of your research and why you require this dataset.</Form.Text>
                            </Form.Label>
                            <Form.Control onChange={handleChange} onBlur={handleBlur} value={values.researchAim} name="researchAim" as='textarea' rows='3' isInvalid={!!errors.researchAim && touched.researchAim} />
                            <Form.Control.Feedback type="invalid">{errors.researchAim}</Form.Control.Feedback>
                        </Form.Group>

                        {/* LINKED datasets */}
                        <Form.Group>
                            <Form.Label className='Gray800-14px'>Linked datasets
                                <Form.Text className='Gray700-13px mt-0'>Do you have any datasets you would like to link with this one? </Form.Text>
                            </Form.Label>
                            { /* RADIOS */}
                            <Form.Group className='mb-2 mt-2' style={{ display: 'flex' }}>
                                <Row>
                                    <Col>
                                        <Form.Check 
                                            type='radio' 
                                            label='Yes' 
                                            className='ml-4' 
                                            name='linkedDataSets' 
                                            id='linkedDataSets' 
                                            value='true'
                                            onChange={handleChange}
                                            isInvalid={touched.linkedDataSets && errors.linkedDataSets} />
                                    </Col>
                                    <Col className='ml-5'>
                                        <Form.Check 
                                            type='radio' 
                                            label='No' 
                                            className='ml-1' 
                                            name='linkedDataSets' 
                                            id='linkedDataSets' 
                                            value='false'
                                            onChange={handleChange}
                                            isInvalid={touched.linkedDataSets && errors.linkedDataSets} />
                                    </Col>
                                </Row>
                            </Form.Group>
                                {errors.linkedDataSets && touched.linkedDataSets ?
                                <Fragment>
                                    <div className="hdfeedback">{errors.linkedDataSets}</div>
                                </Fragment> : null
                                }
                            { /* HIDE SHOW */}
                            {   values.linkedDataSets && values.linkedDataSets !== 'false' ?
                                <Fragment className='pb-2'>
                                    <Form.Label className='Gray700-13px'>Please identify the names of the datasets.</Form.Label>
                                    <Form.Control onChange={handleChange} onBlur={handleBlur} isInvalid={values.linkedDataSets === 'true' && touched.namesOfDataSets && values.namesOfDataSets === ''} value={values.namesOfDataSets} name="namesOfDataSets" as='textarea' rows='3' />
                                    <Form.Control.Feedback type="invalid">{errors.namesOfDataSets}</Form.Control.Feedback>
                                </Fragment> : null
                            }                       
                        </Form.Group>

                        {/* Data Requirements */}
                        <Form.Group>
                            <Form.Label className='Gray800-14px'>Data requirements <br />
                                <Form.Text className='Gray700-13px'>Do you know which parts of the dataset you are interested in?</Form.Text>
                            </Form.Label>
                            <Form.Group className='mb-2 mt-2' style={{ display: 'flex' }}>
                                <Row>
                                    <Col>
                                        <Form.Check 
                                            type='radio' 
                                            label='Yes' 
                                            className='ml-4' 
                                            name='dataRequirements' 
                                            id='dataRequirements' 
                                            value='true'
                                            onChange={handleChange}
                                            isInvalid={touched.dataRequirements && errors.dataRequirements} />
                                    </Col>
                                    <Col className='ml-5'>
                                        <Form.Check 
                                            type='radio' 
                                            label='No' 
                                            className='ml-1' 
                                            name='dataRequirements' 
                                            id='dataRequirements'
                                            value='false'
                                            onChange={handleChange}
                                            isInvalid={touched.dataRequirements && errors.dataRequirements} />
                                    </Col>
                                </Row>
                            </Form.Group>
                            {errors.dataRequirements && touched.dataRequirements ?
                                <Fragment>
                                    <div className="hdfeedback">{errors.dataRequirements}</div>
                                </Fragment> : null
                            }
                            <Row>
                            </Row>
                                {values.dataRequirements && values.dataRequirements !== 'false' ?
                                    <Fragment className='pb-2'>
                                        <Form.Label className='Gray700-13px'>Please explain which parts of the dataset.</Form.Label>
                                        <Form.Control onChange={handleChange} onBlur={handleBlur} isInvalid={values.dataRequirements === 'true' && touched.dataSetParts && values.dataSetParts === ''} value={values.dataSetParts}  name="dataSetParts" as='textarea' rows='3' />
                                        <Form.Control.Feedback type="invalid">{errors.dataSetParts}</Form.Control.Feedback>

                                    </Fragment> : null
                                }    
                        </Form.Group>

                        {/* Proposed project start Date */}
                        <Form.Group className='pb-2'>
                            <Form.Label className='Gray800-14px'>Proposed project start date (optional)</Form.Label>
                            <div>
                            <DatePicker
                                name="startDate"
                                selected={values.startDate}
                                dateFormat="dd/MM/yyyy"
                                onChange={date => onDateChange(date, setFieldValue)}
                                placeholderText="dd/mm/yyyy"
                                />
                            </div>
                        </Form.Group>

                        {/* ICO Reg */}
                        <Form.Group className='pb-2'>
                            <Form.Label className='Gray800-14px'>ICO registration (optional)
                                <Form.Text className='Gray700-13px'>This is an 8 digit alphanumeric number</Form.Text>
                            </Form.Label>
                            <Form.Control id='icoRegistration' onChange={handleChange} value={values.icoRegistration} maxLength="8" isInvalid={!!errors.icoRegistration} name="icoRegistration" className="AddFormInput" type='text' style={{ maxWidth: '480px' }} />
                            <Form.Control.Feedback type="invalid">{errors.icoRegistration}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Research Benefits */}
                        <Form.Group className='pb-2'>
                            <Form.Label className='Gray800-14px'>Research benefits (optional)
                                <Form.Text className='Gray700-13px'>Please provide evidence of how your research will benefit the health and social care system.</Form.Text>
                            </Form.Label>
                            <Form.Control id='researchBenefits' onChange={handleChange} value={values.researchBenefits}  name="researchBenefits" as='textarea' rows='3' />
                        </Form.Group>

                        {/* Ethical processing Reg */}
                        <Form.Group className='pb-2'>
                            <Form.Label className='Gray800-14px'> Ethical processing evidence (optional)
                                <Form.Text className='Gray700-13px'>Please provide a link(s) to relevant sources that showcase evidence of thee fair processing of data by your organisation.</Form.Text>
                            </Form.Label>
                            <Form.Control id='ethicalProcessingEvidence' onChange={handleChange} value={values.ethicalProcessingEvidence} name="ethicalProcessingEvidence"  as='textarea' rows='3' />
                        </Form.Group>

                        {/*Contact Number */}
                        <Form.Group className='pb-2'>
                            <Form.Label className='Gray800-14px'>Contact number (optional)</Form.Label>
                            <Form.Control id='contactNumber' onChange={handleChange} value={values.contactNumber} isInvalid={!!errors.contactNumber} name="contactNumber" type='text' className='AddFormInput' style={{ maxWidth: '480px' }} />
                            <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
                        </Form.Group>
                    </Col>
              </Row>
          </div>
            {/* BUTTONS */}
            <Row className='mt-3'>
                <Col className='text-left'>
                    <Button variant='tertiary' onClick={onCancel} type='button'>Cancel</Button>
                </Col>
                <Col className='text-right'>
                    <Button variant='primary' type='submit' className='Gray100-14px' onClick={() => Event("Buttons", "Click", "Access request - send enquiry")}>Send enquiry</Button>
                </Col>
            </Row>
            </Form>
        </Container>
      </div>
    );
}

export default Request;
