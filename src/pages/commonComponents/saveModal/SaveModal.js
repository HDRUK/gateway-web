import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, Form } from 'react-bootstrap';
import './SaveModal.scss';

var baseURL = require('../../commonComponents/BaseURL').getURL();

const SaveModal = ({ ...props }) => {
    const [, setClose] = useState(null);
    const [, setSaveSuccess] = useState(props.saveSuccess);

    const formik = useFormik({
        initialValues: {
            name: '',
            filterCriteria: {
                searchTerm: props.search || '',
                filters: props.filters || [],
                tab: props.tab || '',
                sort: props.sort || '',
            },
        },

        validationSchema: Yup.object({
            name: Yup.string().required('This cannot be empty'),
        }),

        onSubmit: values => {
            axios
                .post(baseURL + '/api/v1/search-preferences', values)
                .then(res => {
                    setClose(props.onHide);
                    props.saveName(res.data.response.name);
                    setSaveSuccess(props.saveSuccess);
                })
                .catch(err => {
                    return err;
                });
        },
    });
    return (
        <Modal show={props.show} onHide={props.onSaveHide} className='save-modal'>
            <Modal.Header closeButton>
                <h5 className='black-20-semibold'>Saved search preference</h5>
            </Modal.Header>
            <Modal.Body>
                <p className='black-14'>
                    Are you sure you want to save this search preference? If yes, please provide a title for this search.
                </p>
                <label className='black-14'>Title</label>
                <Form.Control
                    data-test-id='saved-preference-name'
                    id='name'
                    name='name'
                    type='text'
                    className={formik.touched.name && formik.errors.name && 'save-modal-input'}
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name ? <div className='errorMessages'>{formik.errors.name}</div> : null}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-primary saved-no' onClick={props.onSaveHide}>
                    No, nevermind
                </Button>
                <Button type='submit' className='save-search-button' onClick={formik.handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaveModal;
