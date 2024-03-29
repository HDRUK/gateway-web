import { Fragment } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'hdruk-react-core';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './AdvancedSearchTAndCsModal.scss';
import AdvancedSearchTAndCsContent from './AdvancedSearchTAndCsContent';

const AdvancedSearchTAndCsModal = ({ open, close, updateUserAcceptedAdvancedSearchTerms }) => {
    const formik = useFormik({
        initialValues: {
            terms: false,
        },
        validationSchema: Yup.object({
            terms: Yup.bool().oneOf([true], 'To agree the terms of use, this cannot be empty'),
        }),

        onSubmit: async () => {
            // Append role to user in db
            await updateUserAcceptedAdvancedSearchTerms();
        },
    });

    return (
        <>
            <Modal
                show={open}
                onHide={close}
                size='lg'
                aria-labelledby='contained-modal-title-vcenter'
                centered
                className='advancedSearchTAndCModal'>
                <Form onSubmit={formik.handleSubmit}>
                    <div className='advancedSearchTAndCModal-header'>
                        <div className='advancedSearchTAndCModal-header--wrap'>
                            <div className='advancedSearchTAndCModal-head'>
                                <h1 className='black-20-semibold'>HDR Discovery Tool Terms of Use</h1>
                                <CloseButtonSvg className='advancedSearchTAndCModal-head--close' onClick={() => close()} />
                            </div>
                            <Modal.Body>
                                <p>PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE ACCEPTING THEM</p>

                                <AdvancedSearchTAndCsContent showFormValidation formik={formik} />
                            </Modal.Body>
                        </div>
                    </div>

                    <div className='advancedSearchTAndCModal-footer'>
                        <div className='advancedSearchTAndCModal-footer--wrap'>
                            <Button variant='secondary' onClick={() => close()}>
                                Cancel
                            </Button>
                            <Button
                                data-testid='agree-to-terms'
                                type='submit'
                                onClick={() => {
                                    const elmnt = document.getElementById('accept-terms');
                                    if (elmnt && elmnt.scrollIntoView) elmnt.scrollIntoView();
                                }}>
                                Yes, I agree
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default AdvancedSearchTAndCsModal;
