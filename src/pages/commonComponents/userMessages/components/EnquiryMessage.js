import React, { useState, useRef, useEffect } from 'react';
import { isEmpty, has, isString } from 'lodash';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { Button } from 'hdruk-react-core';
import TypeaheadDataset from '../../../DataAccessRequest/components/TypeaheadDataset/TypeaheadDataset';

export const EnquiryMessage = ({ topic, onDatasetsRequested, onFirstMessageSubmit }) => {
    const formRef = useRef();
    const [selectedDatasets, setSelectedDatasets] = useState([]);
    const valueMapper = {
        safepeopleprimaryapplicantfullname: { title: 'Name' },
        safepeopleprimaryapplicantorganisationname: { title: 'Organisation' },
        safepeopleprimaryapplicantemail: { title: 'Email' },
        safepeopleprimaryapplicanttelephone: { title: 'Contact number' },
        safeprojectprojectdetailstitle: { title: 'Project title' },
        safeprojectprojectdetailsaimsobjectivesrationale: { title: 'Research aim or question' },
        datasetsRequested: { title: 'Datasets of interest' },
        'safedata-otherdatasetsintentiontolinkdata': {
            title: 'Are there other datasets you would like to link with the ones listed above?',
        },
        safedataotherdatasetslinkadditionaldatasetslinkagedetails: { title: 'Name or description of the linked datasets' },
        datasetsInterestedIn: { title: 'Do you know which parts of the dataset you are interested in?' },
        safedatadatafieldsdatarequiredjustification: { title: 'Parts of the dataset interested in' },
        funding: { title: 'Funding' },
        safeprojectprojectdetailspublicbenefitimpact: { title: 'Potential research benefits' },
    };

    // Funding do not map as per zeplin design
    const initalValues = {
        safepeopleprimaryapplicantfullname: '',
        safepeopleprimaryapplicantorganisationname: '',
        safepeopleprimaryapplicantemail: '',
        safepeopleprimaryapplicanttelephone: '',
        safeprojectprojectdetailstitle: '',
        safeprojectprojectdetailsaimsobjectivesrationale: '',
        datasetsRequested: selectedDatasets,
        'safedata-otherdatasetsintentiontolinkdata': '',
        safedataotherdatasetslinkadditionaldatasetslinkagedetails: '',
        datasetsInterestedIn: '',
        safedatadatafieldsdatarequiredjustification: '',
        funding: '',
        safeprojectprojectdetailspublicbenefitimpact: '',
    };

    const schema = Yup.object({
        safepeopleprimaryapplicantfullname: Yup.string().trim().required('Required'),
        safepeopleprimaryapplicantorganisationname: Yup.string().trim().required('Required'),
        safepeopleprimaryapplicantemail: Yup.string().trim().email('This must be a valid email').required('Required'),
        safepeopleprimaryapplicanttelephone: Yup.string()
            .trim()
            .matches(/((\+44(\s\(0\)\s|\s0\s|\s)?)|0)7\d{3}(\s)?\d{6}/g, {
                message: 'Invalid phone number',
            }),
        safeprojectprojectdetailstitle: Yup.string().trim().required('Required'),
        safeprojectprojectdetailsaimsobjectivesrationale: Yup.string().trim().required('Required'),
        datasetsRequested: Yup.array().required('Required').min(1, 'Required'),
        'safedata-otherdatasetsintentiontolinkdata': Yup.string().required('Select an option'),
        safedataotherdatasetslinkadditionaldatasetslinkagedetails: Yup.string().when('safedata-otherdatasetsintentiontolinkdata', {
            is: 'Yes',
            then: Yup.string().required('Required'),
        }),
        datasetsInterestedIn: Yup.string().required('Select an option'),
        safedatadatafieldsdatarequiredjustification: Yup.string().when('datasetsInterestedIn', {
            is: 'Yes',
            then: Yup.string().required('Required'),
        }),
        funding: Yup.string().trim().required('Required'),
        safeprojectprojectdetailspublicbenefitimpact: Yup.string().trim().required('Required'),
    });

    /**
     * hasErrors
     * @desc error handler for form highlight validation with red border]
     * @param   {[Obejct]}  touched  [touched]
     * @param   {[Object]}  errors   [errors]
     * @param   {[String]}  field    [field]
     *
     * @return  {[boolean]}  [return valid]
     */
    const hasErrors = (touched, errors, field) => {
        if (
            touched &&
            errors &&
            typeof errors[field] !== 'undefined' &&
            typeof touched[field] !== 'undefined' &&
            errors[field] &&
            touched[field]
        ) {
            return true;
        }
        return false;
    };

    const onHandleDataSetChange = (selected, key, setFieldValue) => {
        // set field value using formik hook - setFieldValue
        setFieldValue(key, selected);
        // update dataset selection in message header
        onDatasetsRequested(selected);
    };

    /**
     * [getFormattedValue]
     *
     * @desc formats each value based on type string | array
     * @param   {String|Array}  value  [value of the field from fromik]
     * @return  {String}  [return in string format]
     */
    const getFormattedValue = value => {
        if (isString(value) && !isEmpty(value)) return value;

        if (Array.isArray(value)) {
            return [...value].reduce((message, val, index) => {
                const { name = '' } = val;

                if (!isEmpty(name) && index !== 0) {
                    message += `, ${name}`;
                } else if (!isEmpty(name) && index === 0) {
                    message += `${name}`;
                }

                return message;
            }, '');
        }

        return '';
    };

    /**
     * handleFormSubmission
     * @desc  Handles formik valid submission, API call
     */
    const handleFormSubmission = async () => {
        const {
            current: { values },
        } = formRef;

        // new message that is formatted
        let message = '';
        // from formik get the keys of our questionIds
        const keys = Object.keys(values);
        // if keys loop and get readable values Applicant name: 'Rose Clarke'....
        if (keys.length) {
            // loop keys
            for (const key of keys) {
                // get readable quesiton
                const { title } = valueMapper[key];
                // get the value as we have different types, string...array etc
                const value = getFormattedValue(values[key]);
                // build our message with line breaks
                if (!isEmpty(value)) message += `\n ${title}: ${value}`;
            }

            const data = {
                messageDescription: message.trim(),
                firstMessage: values,
            };

            onFirstMessageSubmit(data);
        }
    };

    useEffect(() => {
        if (has(topic, 'tags') && !isEmpty(topic.tags)) {
            setSelectedDatasets(topic.tags);
        }
    }, []);

    return (
        <div className='enquiry-message-container'>
            <div className='gray700-13 text-center' data-testid='formIntroText'>
                Please provide details about your project and the data you are interested in.
            </div>
            <Formik
                enableReinitialize
                initialValues={initalValues}
                validationSchema={schema}
                innerRef={formRef}
                onSubmit={async () => {
                    await handleFormSubmission();
                }}
                data-testid='formik'>
                {({ isSubmitting, values, errors, touched, setFieldValue }) => (
                    <Form autoComplete='off'>
                        <div className='enquiry-message-form'>
                            {/* APPLICANT NAME */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safepeopleprimaryapplicantfullname' className='form-label'>
                                    Name *
                                </label>
                                <Field
                                    type='text'
                                    name='safepeopleprimaryapplicantfullname'
                                    data-testid='safepeopleprimaryapplicantfullname'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safepeopleprimaryapplicantfullname') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safepeopleprimaryapplicantfullname') ? (
                                    <div className='errorMessages'>{errors.safepeopleprimaryapplicantfullname}</div>
                                ) : null}
                            </div>

                            {/* ORGANISATION */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safepeopleprimaryapplicantorganisationname' className='form-label'>
                                    Organisation *
                                </label>
                                <Field
                                    type='text'
                                    name='safepeopleprimaryapplicantorganisationname'
                                    data-testid='safepeopleprimaryapplicantorganisationname'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safepeopleprimaryapplicantorganisationname') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safepeopleprimaryapplicantorganisationname') ? (
                                    <div className='errorMessages'>{errors.safepeopleprimaryapplicantorganisationname}</div>
                                ) : null}
                            </div>

                            {/* EMAIL */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safepeopleprimaryapplicantemail' className='form-label'>
                                    Email *<span className='gray700-13'>Where do you want the data custodian to contact you?</span>
                                </label>
                                <Field
                                    type='email'
                                    name='safepeopleprimaryapplicantemail'
                                    data-testid='safepeopleprimaryapplicantemail'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safepeopleprimaryapplicantemail') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safepeopleprimaryapplicantemail') ? (
                                    <div className='errorMessages'>{errors.safepeopleprimaryapplicantemail}</div>
                                ) : null}
                            </div>

                            {/* CONTACT NUMBER */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safepeopleprimaryapplicanttelephone' className='form-label'>
                                    Contact number (optional)
                                </label>
                                <Field
                                    type='text'
                                    name='safepeopleprimaryapplicanttelephone'
                                    data-testid='safepeoplesafepeopleprimaryapplicanttelephone'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safepeopleprimaryapplicanttelephone') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safepeopleprimaryapplicanttelephone') ? (
                                    <div className='errorMessages'>{errors.safepeopleprimaryapplicanttelephone}</div>
                                ) : null}
                            </div>

                            {/* PROJECT TITLE */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safeprojectprojectdetailstitle' className='form-label'>
                                    Project title *
                                </label>
                                <Field
                                    type='text'
                                    name='safeprojectprojectdetailstitle'
                                    data-testid='safeprojectprojectdetailstitle'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safeprojectprojectdetailstitle') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safeprojectprojectdetailstitle') ? (
                                    <div className='errorMessages'>{errors.safeprojectprojectdetailstitle}</div>
                                ) : null}
                            </div>

                            {/* PROJECT AIM */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safeprojectprojectdetailsaimsobjectivesrationale' className='form-label'>
                                    Research aim or question *
                                    <span className='gray700-13'>
                                        Please briefly explain the purpose of your research, why you require this dataset and when you
                                        intend to begin the project
                                    </span>
                                </label>
                                <Field
                                    as='textarea'
                                    name='safeprojectprojectdetailsaimsobjectivesrationale'
                                    data-testid='safeprojectprojectdetailsaimsobjectivesrationale'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safeprojectprojectdetailsaimsobjectivesrationale') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safeprojectprojectdetailsaimsobjectivesrationale') ? (
                                    <div className='errorMessages'>{errors.safeprojectprojectdetailsaimsobjectivesrationale}</div>
                                ) : null}
                            </div>

                            {/* DATASETS  REQUESTED */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='datasetsRequested' className='form-label gray800-14'>
                                    Datasets of interest *
                                </label>
                                <TypeaheadDataset
                                    selectedDatasets={topic.tags}
                                    readOnly={false}
                                    allowAllCustodians={false}
                                    only5Safes={false}
                                    onHandleDataSetChange={selected => {
                                        onHandleDataSetChange(selected, 'datasetsRequested', setFieldValue);
                                    }}
                                    typeaheadClass={`${hasErrors(touched, errors, 'datasetsRequested') ? 'is-invalid' : ''}`}
                                />
                                {hasErrors(touched, errors, 'datasetsRequested') ? (
                                    <div className='errorMessages'>{errors.datasetsRequested}</div>
                                ) : null}
                            </div>

                            {/* DATASETS LINK WITH RADIO */}
                            <div className='form-group'>
                                <label htmlFor='safedata-otherdatasetsintentiontolinkdata' className='form-label gray800-14'>
                                    Are there other datasets you would like to link with the ones listed above? *
                                </label>
                                <div className='form-check'>
                                    <Field type='radio' name='safedata-otherdatasetsintentiontolinkdata' value='Yes' />
                                    <label
                                        className={`
                        form-check-label 
                        gray800-14`}
                                        htmlFor='safedata-otherdatasetsintentiontolinkdata'>
                                        Yes
                                    </label>
                                </div>
                                <div className='form-check'>
                                    <Field type='radio' name='safedata-otherdatasetsintentiontolinkdata' value='No' />
                                    <label
                                        className={`
                        form-check-label 
                        gray800-14`}
                                        htmlFor='safedata-otherdatasetsintentiontolinkdata'>
                                        No
                                    </label>
                                </div>
                                {hasErrors(touched, errors, 'safedata-otherdatasetsintentiontolinkdata') ? (
                                    <div className='errorMessages'>{errors['safedata-otherdatasetsintentiontolinkdata']}</div>
                                ) : null}
                            </div>

                            {/* IDENTIFY NAMES OF DATASETS */}
                            {values && values['safedata-otherdatasetsintentiontolinkdata'] === 'Yes' ? (
                                <div className='form-group gray800-14'>
                                    <label htmlFor='safedataotherdatasetslinkadditionaldatasetslinkagedetails' className='form-label'>
                                        Please provide the name or description of these datasets *
                                    </label>
                                    <Field
                                        as='textarea'
                                        name='safedataotherdatasetslinkadditionaldatasetslinkagedetails'
                                        data-testid='safedataotherdatasetslinkadditionaldatasetslinkagedetails'
                                        className={`form-control gray800-14 ${
                                            hasErrors(touched, errors, 'safedataotherdatasetslinkadditionaldatasetslinkagedetails')
                                                ? 'is-invalid'
                                                : ''
                                        }`}
                                    />
                                    {hasErrors(touched, errors, 'safedataotherdatasetslinkadditionaldatasetslinkagedetails') ? (
                                        <div className='errorMessages'>
                                            {errors.safedataotherdatasetslinkadditionaldatasetslinkagedetails}
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                ''
                            )}

                            {/* PARTS OF DATASET INTERESTED IN */}
                            <div className='form-group'>
                                <label htmlFor='datasetsInterestedIn' className='form-label gray800-14'>
                                    Do you know which parts of the dataset you are interested in? *
                                </label>
                                <div className='form-check'>
                                    <Field type='radio' name='datasetsInterestedIn' value='Yes' />
                                    <label
                                        className={`
                        form-check-label 
                        gray800-14`}
                                        htmlFor='datasetsInterestedIn'>
                                        Yes
                                    </label>
                                </div>
                                <div className='form-check'>
                                    <Field type='radio' name='datasetsInterestedIn' value='No' />
                                    <label
                                        className={`
                        form-check-label 
                        gray800-14`}
                                        htmlFor='datasetsInterestedIn'>
                                        No
                                    </label>
                                </div>
                                {hasErrors(touched, errors, 'datasetsInterestedIn') ? (
                                    <div className='errorMessages'>{errors.datasetsInterestedIn}</div>
                                ) : null}
                            </div>

                            {/* EXPLAIN PARTS  OF DATASETS */}
                            {values && values.datasetsInterestedIn === 'Yes' ? (
                                <div className='form-group gray800-14'>
                                    <label htmlFor='safedatadatafieldsdatarequiredjustification' className='form-label'>
                                        Please explain which parts of the dataset *
                                    </label>
                                    <Field
                                        as='textarea'
                                        name='safedatadatafieldsdatarequiredjustification'
                                        data-testid='safedatadatafieldsdatarequiredjustification'
                                        className={`form-control gray800-14 ${
                                            hasErrors(touched, errors, 'safedatadatafieldsdatarequiredjustification') ? 'is-invalid' : ''
                                        }`}
                                    />
                                    {hasErrors(touched, errors, 'safedatadatafieldsdatarequiredjustification') ? (
                                        <div className='errorMessages'>{errors.safedatadatafieldsdatarequiredjustification}</div>
                                    ) : null}
                                </div>
                            ) : (
                                ''
                            )}

                            {/* FUNDING */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='funding' className='form-label'>
                                    Funding *
                                    <span className='gray700-13'>
                                        Please provide information on the status of funding for your project including who is expected to
                                        fund the research
                                    </span>
                                </label>
                                <Field
                                    as='textarea'
                                    name='funding'
                                    data-testid='funding'
                                    className={`form-control ${hasErrors(touched, errors, 'funding') ? 'is-invalid' : ''}`}
                                />
                                {hasErrors(touched, errors, 'funding') ? <div className='errorMessages'>{errors.funding}</div> : null}
                            </div>

                            {/* RESEARCH BENEFITS */}
                            <div className='form-group gray800-14'>
                                <label htmlFor='safeprojectprojectdetailspublicbenefitimpact' className='form-label'>
                                    Potential research benefits *
                                    <span className='gray700-13'>
                                        Please provide a short explanation of how your research would benefit the health and care system
                                    </span>
                                </label>
                                <Field
                                    as='textarea'
                                    name='safeprojectprojectdetailspublicbenefitimpact'
                                    data-testid='safeprojectprojectdetailspublicbenefitimpact'
                                    className={`form-control gray800-14 ${
                                        hasErrors(touched, errors, 'safeprojectprojectdetailspublicbenefitimpact') ? 'is-invalid' : ''
                                    }`}
                                />
                                {hasErrors(touched, errors, 'safeprojectprojectdetailspublicbenefitimpact') ? (
                                    <div className='errorMessages'>{errors.safeprojectprojectdetailspublicbenefitimpact}</div>
                                ) : null}
                            </div>

                            {/* SUBMIT */}
                            <div className='d-flex flex-row-reverse p-2'>
                                <Button variant='secondary' type='submit'>
                                    Send message
                                </Button>
                            </div>
                        </div>
                        {/* <pre>{errors ? errors : ''}</pre> */}
                    </Form>
                )}
            </Formik>
        </div>
    );
};
