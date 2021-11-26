import React, { Suspense } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import datasetOnboardingService from '../../../../services/dataset-onboarding/dataset-onboarding';
import { TEXTAREA_ROWS } from '../../../../configs/constants';
import './AccountDatasetDecisionModal.scss';

const AccountDatasetApproveModal = ({
	id,
	open,
	closed,
	goToNext,
	showGoToNext,
	handleApprove
}) => {
	const { t } = useTranslation();

	const {
			handleSubmit,
			handleChange,
			handleBlur,
			values,
			errors
		} = useFormik({
		initialValues: {
			applicationStatusDesc: ''
		},
		validationSchema: Yup.object({
			applicationStatusDesc: Yup.string().max(1500, 'Description must be less than 1500 characters'),
		}),
		onSubmit: async values => {
			const payload = {
				...values,
				id,
				applicationStatus: 'approved'
			};
			datasetOnboardingService.putDatasetOnboarding(id, payload);
		},
	});

	return (
		<Suspense fallback={t('loading')}>
			<Modal
				show={open}
				onHide={closed}
				className='decisionModal'
				size='lg'
				aria-labelledby='contained-modal-title-vcenter'
				centered>
				<div className='decisionModal-header'>
					<div className='decisionModal-header--wrap'>
						<div className='decisionModal-head'>
							<h1 className='black-20-semibold'>{t('dataset.approvalModal.title')}</h1>
							<CloseButtonSvg className='decisionModal-head--close' onClick={closed} />
						</div>
					</div>
				</div>

				<Form onSubmit={handleSubmit} onBlur={handleBlur}>
					<div className='decisionModal-body'>
						<div className='decisionModal-body--wrap'>
							<p data-testid='description'>{t('dataset.approvalModal.description')}</p>
							<Form.Group>
								<label for="applicationStatusDesc" className='black-14'>{t('dataset.approvalModal.applicationStatus')}</label>
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
								{errors.applicationStatusDesc ? <div className='errorMessages'>{errors.applicationStatusDesc}</div> : null}
							</Form.Group>
						</div>
					</div>
					<div className='decisionModal-footer'>
						<div data-testid='button-container'
							className='decisionModal-footer--wrap'>
							<Button
								className='button-secondary'
								onClick={() => {
									closed();
								}}>
								{t('dataset.approvalModal.buttons.cancel')}
							</Button>
							<Button
								disabled={errors.applicationStatusDesc}
								data-testid='approve-button'
								className='button-secondary'
								style={{ marginLeft: '10px' }}
								onClick={async () => {
									handleSubmit();
									handleApprove({
										publisher: '',
										tab: 'inReview',
										message: `You have approved the dataset`
									});
								}}>
								{t('dataset.approvalModal.buttons.approve')}
							</Button>
							<Button
								disabled={!showGoToNext || errors.applicationStatusDesc}
								className='button-secondary'
								style={{ marginLeft: '10px' }}
								onClick={async () => {
									handleSubmit();
									goToNext();
								}}>
								{t('dataset.approvalModal.buttons.approveAndGoToNext')}
							</Button>
						</div>
					</div>
				</Form>
			</Modal>
		</Suspense>
	);
};

export default AccountDatasetApproveModal;
