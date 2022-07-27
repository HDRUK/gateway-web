import React from 'react';
import { Modal, Button, Form, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ReactComponent as CloseButtonSvg } from '../../../../images/close-alt.svg';
import { ReactComponent as Calendar } from '../../../../images/calendaricon.svg';
import 'react-datepicker/dist/react-datepicker.css';
import './AddNewEventModal.scss';
import DatePicker from 'react-datepicker';

const AddNewEventModal = ({ dataaccessrequest, isOpened, close, onClickAddEvent }) => {
	const versionTree = Object.values(dataaccessrequest.versionTree);
	const latestVersion = versionTree[versionTree.lastIndex];

	const formik = useFormik({
		initialValues: {
			description: '',
			selectedVersionTitle: latestVersion.detailedTitle,
			timestamp: new Date(),
		},

		validationSchema: Yup.object({
			timestamp: Yup.date().required('This cannot be empty').nullable(),
			description: Yup.string().required('This cannot be empty'),
		}),

		onSubmit: values => {
			const selectedVersion = versionTree.find(version => version.detailedTitle === values.selectedVersionTitle);
			const newEvent = {
				description: values.description,
				timestamp: values.timestamp,
				versionId: selectedVersion.iterationId ? selectedVersion.iterationId : selectedVersion.applicationId,
			};
			onClickAddEvent(newEvent);
			formik.resetForm();
		},
	});

	const onCloseModal = () => {
		formik.resetForm();
		close();
	};

	return (
		<Modal show={isOpened} onHide={onCloseModal} className='addNewEventModal'>
			<CloseButtonSvg className='addNewEventModal-close' onClick={onCloseModal} />
			<div className='addNewEventModal-header'>
				<h1 className='black-20-semibold'>Add new event</h1>
				<div className='addNewEventModal-subtitle'>
					Are you sure you want to add an event to this activity log? This will also be added to the applicants activity log.
				</div>
			</div>

			<div className='addNewEventModal-body'>
				<Form onSubmit={formik.handleSubmit}>
					<Form.Group>
						<Row className='ml-0 mr-0 mb-3'>
							<Form.Label className='mb-0 gray800-14'>Description</Form.Label>
							<Form.Control
								data-test-id='description'
								id='description'
								name='description'
								type='text'
								className={formik.touched.description && formik.errors.description ? 'emptyFormInput addFormInput' : 'addFormInput'}
								onChange={formik.handleChange}
								value={formik.values.description}
								onBlur={formik.handleBlur}
								autocomplete='off'
							/>

							{formik.touched.description && formik.errors.description ? (
								<div className='errorMessages' data-test-id='description-validation'>
									{formik.errors.description}
								</div>
							) : null}
						</Row>
					</Form.Group>
					<Row className='ml-0 mr-0 mb-3'>
						<Col className='pl-0 pr-0 mr-1'>
							<Form.Group>
								<Form.Label className='mb-0 gray800-14'>Date and time</Form.Label>
								<div>
									<DatePicker
										id='timestamp'
										name='timestamp'
										timeFormat='HH:mm'
										timeCaption='time'
										showMonthDropdown
										showYearDropdown
										dateFormat='d MMMM yyyy, h:mm aa'
										className={formik.touched.timestamp && formik.errors.timestamp ? 'emptyFormInput addFormInput' : 'addFormInput'}
										showTimeSelect
										selected={formik.values.timestamp}
										onChange={timestamp => {
											formik.values.timestamp = timestamp;
											formik.setFieldValue();
										}}
										onBlur={formik.handleBlur}
										autocomplete='off'
									/>
									<Calendar className='datePickerCalendar' />
								</div>
								{formik.touched.timestamp && formik.errors.timestamp ? (
									<div className='errorMessages' data-test-id='timestamp-validation'>
										{formik.errors.timestamp}
									</div>
								) : null}
							</Form.Group>
						</Col>
						<Col className='pl-0 pr-0 ml-1'>
							<Form.Label className='mb-0 gray800-14'>Application version</Form.Label>
							<DropdownButton
								variant='white'
								className={'custom-dropdown'}
								value={formik.values.selectedVersionTitle}
								title={formik.values.selectedVersionTitle}
								onSelect={selected => {
									formik.setFieldValue('selectedVersionTitle', selected);
								}}
								id='selectedVersionTitle'>
								{versionTree
									.map((version, i) => (
										<Dropdown.Item
											className='gray800-14 width-100'
											key={version.detailedTitle}
											eventKey={version.detailedTitle}
											data-test-id={`selectedVersionTitle-option-${i}`}>
											{version.detailedTitle}
										</Dropdown.Item>
									))
									.reverse()}
							</DropdownButton>
						</Col>
					</Row>
					<Row className='pl-0 pr-0 mt-2'>
						<div className='addNewEventModal-footer'>
							<div className='addNewEventModal-footer--wrap'>
								<Button variant='white' className='techDetailButton mr-2' onClick={onCloseModal}>
									No, nevermind
								</Button>
								<Button variant='primary' type='submit' className='white-14-semibold' data-test-id='add-event'>
									Add event
								</Button>
							</div>
						</div>
					</Row>
				</Form>
			</div>
		</Modal>
	);
};

export default AddNewEventModal;
