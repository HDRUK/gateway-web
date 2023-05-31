import { useRef } from 'react';
import * as React from 'react';
import axios from 'axios';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import { Container } from 'react-bootstrap';

import { Button } from 'hdruk-react-core';
import ActionBar from '../commonComponents/actionbar/ActionBar';
import googleAnalytics from '../../tracking';

import './Course.scss';
import CourseForm from './CourseForm';

const baseURL = require('../commonComponents/BaseURL').getURL();

const windowUrl = window.location.origin;

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
                axios.put(`${baseURL}/api/v1/course/${props.data.id}`, values).then(res => {
                    window.location.href = `${windowUrl}/course/${props.data.id}/?courseEdited=true`;
                });
            } else {
                axios.post(`${baseURL}/api/v1/course`, values).then(res => {
                    window.location.href = `${windowUrl}/course/${res.data.response.id}/?courseAdded=true`;
                });
            }
        },
    });

    const formRef = useRef();

    const relatedResourcesRef = React.useRef();

    return (
        <div>
            <Container>
                <Formik enableReinitialize initialValues={initialValues} innerRef={formRef}>
                    {() => <CourseForm relatedResourcesRef={relatedResourcesRef} props={props} formik={formik} />}
                </Formik>
            </Container>
            <ActionBar userState={props.userState}>
                <div className='floatRight'>
                    <a style={{ cursor: 'pointer' }} href='/account?tab=courses&teamType=user'>
                        <Button variant='tertiary' mr={2}>
                            Cancel
                        </Button>
                    </a>
                    <Button
                        onClick={() => {
                            relatedResourcesRef.current.showModal();
                            googleAnalytics.recordVirtualPageView('Related resources modal');
                        }}
                        variant='secondary'
                        mr={2}>
                        + Add resource
                    </Button>
                    <Button data-testid='add-course-publish' mr={2} type='submit' onClick={formik.handleSubmit}>
                        {props.isEdit ? 'Update' : 'Publish'}
                    </Button>
                </div>
            </ActionBar>
        </div>
    );
};

export default AddEditCourseForm;
