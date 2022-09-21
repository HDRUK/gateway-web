import { Formik } from 'formik';
import { Button } from 'hdruk-react-core';
import React, { Suspense } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { STATUS_INREVIEW, TEXTAREA_ROWS } from '../../../../configs/constants';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import datasetOnboardingService from '../../../../services/dataset-onboarding/dataset-onboarding';
import './AccountDatasetDecisionModal.scss';

const AccountDatasetApproveModal = ({ id, open, closed, goToNext, showGoToNext, handleApprove }) => {
    const { t } = useTranslation();

    const approveDataset = React.useCallback(
        async values => {
            const payload = {
                ...values,
                id,
                applicationStatus: 'approved',
            };

            await datasetOnboardingService.putDatasetOnboarding(id, payload);
        },
        [id]
    );

    const handleSubmit = React.useCallback(
        async values => {
            await approveDataset(values);

            handleApprove({
                publisher: '',
                tab: STATUS_INREVIEW,
                message: `You have approved the dataset`,
            });
        },
        [id]
    );

    return (
        <Suspense fallback={t('loading')}>
            <Modal show={open} onHide={closed} className='decisionModal' size='lg' aria-labelledby='contained-modal-title-vcenter' centered>
                <div className='decisionModal-header'>
                    <div className='decisionModal-header--wrap'>
                        <div className='decisionModal-head'>
                            <h1 className='black-20-semibold'>{t('dataset.approvalModal.title')}</h1>
                            <CloseButtonSvg className='decisionModal-head--close' onClick={closed} />
                        </div>
                    </div>
                </div>
                <Formik
                    initialValues={{
                        applicationStatusDesc: '',
                    }}
                    validationSchema={Yup.object({
                        applicationStatusDesc: Yup.string().max(1500, 'Description must be less than 1500 characters'),
                    })}
                    onSubmit={handleSubmit}>
                    {({ values, errors, isValid, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} onBlur={handleBlur}>
                            <div className='decisionModal-body'>
                                <div className='decisionModal-body--wrap'>
                                    <p data-testid='description'>{t('dataset.approvalModal.description')}</p>
                                    <Form.Group>
                                        <label htmlFor='applicationStatusDesc' className='black-14'>
                                            {t('dataset.approvalModal.applicationStatus')}
                                            <span>{values.applicationStatusDesc.length}/1500</span>
                                        </label>
                                        <Form.Control
                                            as='textarea'
                                            data-testid='dataset-reject-applicationStatusDesc'
                                            id='applicationStatusDesc'
                                            name='applicationStatusDesc'
                                            type='text'
                                            onChange={handleChange}
                                            value={values.applicationStatusDesc}
                                            onBlur={handleBlur}
                                            rows={TEXTAREA_ROWS}
                                        />
                                        {errors.applicationStatusDesc ? (
                                            <div className='errorMessages'>{errors.applicationStatusDesc}</div>
                                        ) : null}
                                    </Form.Group>
                                </div>
                            </div>
                            <div className='decisionModal-footer'>
                                <div data-testid='button-container' className='decisionModal-footer--wrap'>
                                    <Button
                                        variant='secondary'
                                        onClick={() => {
                                            closed();
                                        }}>
                                        {t('dataset.approvalModal.buttons.cancel')}
                                    </Button>
                                    <Button
                                        disabled={!isValid}
                                        type='submit'
                                        data-testid='approve-button'
                                        variant='secondary'
                                        style={{ marginLeft: '10px' }}>
                                        {t('dataset.approvalModal.buttons.approve')}
                                    </Button>
                                    <Button
                                        disabled={!showGoToNext || !isValid}
                                        variant='secondary'
                                        style={{ marginLeft: '10px' }}
                                        onClick={async () => {
                                            await approveDataset(values);

                                            goToNext();
                                        }}>
                                        {t('dataset.approvalModal.buttons.approveAndGoToNext')}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </Suspense>
    );
};

export default AccountDatasetApproveModal;
