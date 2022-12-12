import { FieldArray } from 'formik';
import _ from 'lodash';
import { Form, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { SlideDown } from 'react-slidedown';
import { Button } from 'hdruk-react-core';
import SVGIcon from '../../images/SVGIcon';
import { ReactComponent as CloseButtonSvg } from '../../images/close-alt.svg';
import './Course.scss';
import Fees from './Fees';

const studyDurationMeasure = ['Hour(s)', 'Day(s)', 'Week(s)', 'Month(s)', 'Year(s)'];

const studyMode = ['Full-time', 'Part-time', 'Self-taught'];

const feePer = ['Week', 'Month', 'Year', 'Total course'];

const courseOptions = {
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
};

const CourseOptionsFieldArray = ({ formik }) => {
    const removePhase = index => {
        if (!_.isEmpty(formik.values.courseOptions)) {
            const newCourseOptions = formik.values.courseOptions.filter((key, idx) => {
                return idx !== index;
            });
            formik.setFieldValue('courseOptions', newCourseOptions);
        }
    };

    return (
        <div>
            {formik.values.courseOptions.length > 0 &&
                formik.values.courseOptions.map((node, index) => {
                    return (
                        <div key={`courseOptions-${index}`} className='main-accordion'>
                            <div
                                className='main-accordion-header'
                                onClick={e => {
                                    e.preventDefault();
                                    formik.setFieldValue(`courseOptions[${index}].expand`, !node.expand);
                                }}>
                                <SVGIcon name='chevronbottom' fill='#fff' className={node.expand ? '' : 'flip180'} />
                                <h1>{index + 1}. Course option</h1>
                            </div>
                            <SlideDown closed={node.expand}>
                                <div className='main-accordion-body'>
                                    <div className='form-group'>
                                        <label htmlFor={`node.${index}.sections`} className='form-label'>
                                            Course start date
                                        </label>
                                        <small className='form-text mb-2'>
                                            If the start date is flexible, for instance if it is a self-taught course that you can begin at
                                            any time, select the checkbox.
                                        </small>
                                        <div className='row mb-2'>
                                            <Form.Control
                                                data-test-id='flexible-dates'
                                                type='checkbox'
                                                className='checker'
                                                id={`courseOptions[${index}].flexibleDates`}
                                                name={`courseOptions[${index}].flexibleDates`}
                                                checked={formik.values.courseOptions[index].flexibleDates}
                                                onChange={formik.handleChange}
                                            />
                                            <span className='gray800-14 ml-4'>This course has flexible dates</span>
                                        </div>
                                    </div>

                                    {!formik.values.courseOptions[index].flexibleDates ? (
                                        <>
                                            <DatePicker
                                                name={`courseOptions[${index}].startDate`}
                                                dateFormat='dd/MM/yyyy'
                                                peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode='select'
                                                selected={
                                                    formik.values.courseOptions[index].startDate
                                                        ? new Date(formik.values.courseOptions[index].startDate)
                                                        : ''
                                                }
                                                onChange={date => {
                                                    formik.values.courseOptions[index].startDate = date;
                                                    formik.setFieldValue();
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.courseOptions &&
                                            formik.touched.courseOptions[index] &&
                                            formik.errors.courseOptions &&
                                            formik.errors.courseOptions[index] &&
                                            formik.touched.courseOptions[index].startDate &&
                                            formik.errors.courseOptions[index].startDate ? (
                                                <div className='errorMessages'>{formik.errors.courseOptions[index].startDate}</div>
                                            ) : null}
                                        </>
                                    ) : (
                                        ''
                                    )}

                                    <Row className='mt-2'>
                                        <Col sm={12}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Course duration (optional)</p>
                                            <p className='gray700-13 margin-bottom-0'>
                                                Input the duration for this course option. If this course does not have a set duration, for
                                                example if it’s self-taught, please input an expected duration.
                                            </p>
                                        </Col>
                                        <Col sm={4}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Study mode</p>
                                        </Col>
                                        <Col sm={4}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Duration</p>
                                        </Col>
                                        <Col sm={4} />
                                    </Row>

                                    <Row className='mt-2'>
                                        <Col sm={4} className='pad-right-0'>
                                            <DropdownButton
                                                data-test-id='study-mode'
                                                variant='white'
                                                title={formik.values.courseOptions[index].studyMode || <option disabled selected value />}
                                                className='gray700-13 custom-dropdown padding-right-0'
                                                onChange={formik.handleChange}
                                                value={formik.values.courseOptions[index].studyMode}
                                                onBlur={formik.handleBlur}
                                                onSelect={selected => (formik.values.courseOptions[index].studyMode = selected)}>
                                                {studyMode.map((study, i) => (
                                                    <Dropdown.Item
                                                        data-test-id={`study-mode-${study}`}
                                                        className='gray800-14 width-100'
                                                        key={study}
                                                        eventKey={study}>
                                                        {study}
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </Col>
                                        <Col sm={4} className='pad-right-0'>
                                            <Form.Control
                                                data-test-id='study-duration-number'
                                                id={`courseOptions[${index}].studyDurationNumber`}
                                                name={`courseOptions[${index}].studyDurationNumber`}
                                                type='text'
                                                className={
                                                    formik.touched.courseOptions &&
                                                    formik.touched.courseOptions[index] &&
                                                    formik.errors.courseOptions &&
                                                    formik.errors.courseOptions[index] &&
                                                    formik.touched.courseOptions[index].studyDurationNumber &&
                                                    formik.errors.courseOptions[index].studyDurationNumber
                                                        ? 'emptySmallFormInput addFormInput'
                                                        : 'smallFormInput addFormInput'
                                                }
                                                onChange={formik.handleChange}
                                                value={formik.values.courseOptions[index].studyDurationNumber}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.courseOptions &&
                                            formik.touched.courseOptions[index] &&
                                            formik.errors.courseOptions &&
                                            formik.errors.courseOptions[index] &&
                                            formik.touched.courseOptions[index].studyDurationNumber &&
                                            formik.errors.courseOptions[index].studyDurationNumber ? (
                                                <div className='errorMessages'>
                                                    {formik.errors.courseOptions[index].studyDurationNumber}
                                                </div>
                                            ) : null}
                                        </Col>
                                        <Col sm={4}>
                                            <DropdownButton
                                                data-test-id='study-duration-measure'
                                                variant='white'
                                                title={
                                                    formik.values.courseOptions[index].studyDurationMeasure || (
                                                        <option disabled selected value />
                                                    )
                                                }
                                                className='gray700-13 custom-dropdown padding-right-0'
                                                onChange={formik.handleChange}
                                                value={formik.values.courseOptions[index].studyDurationMeasure}
                                                onBlur={formik.handleBlur}
                                                onSelect={selected => (formik.values.courseOptions[index].studyDurationMeasure = selected)}>
                                                {studyDurationMeasure.map((study, i) => (
                                                    <Dropdown.Item
                                                        data-test-id={`duration-measure-${study}`}
                                                        className='gray800-14 width-100'
                                                        key={study}
                                                        eventKey={study}>
                                                        {study}
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </Col>
                                    </Row>

                                    <Row className='mt-2'>
                                        <Col sm={12}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Course fee (optional)</p>
                                            <p className='gray700-13 margin-bottom-0'>
                                                Include details of the fees for each type of applicant for this course option, as well as
                                                the time frame the fee applies to.
                                            </p>
                                        </Col>
                                        <Col sm={6}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Description</p>
                                        </Col>
                                        <Col sm={2}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Fee (GBP)</p>
                                        </Col>
                                        <Col sm={4}>
                                            <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Per</p>
                                        </Col>
                                    </Row>

                                    <Row className='mt-2'>
                                        <FieldArray name='fees'>
                                            {({ remove, push }) => (
                                                <>
                                                    {formik.values.courseOptions[index].fees.length > 0 &&
                                                        formik.values.courseOptions[index].fees.map((p, indexB) => (
                                                            <>
                                                                <Col sm={6} className='pad-right-0 pad-bottom-4'>
                                                                    <div className=''>
                                                                        <Form.Control
                                                                            data-test-id='fee-description'
                                                                            id={`courseOptions[${index}].fees[${indexB}].feeDescription`}
                                                                            name={`courseOptions[${index}].fees[${indexB}].feeDescription`}
                                                                            type='text'
                                                                            className='smallFormInput addFormInput'
                                                                            onChange={formik.handleChange}
                                                                            value={
                                                                                formik.values.courseOptions[index].fees[indexB]
                                                                                    .feeDescription
                                                                            }
                                                                            onBlur={formik.handleBlur}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col sm={2} className='pad-right-0 pad-bottom-4'>
                                                                    <div className=''>
                                                                        <Form.Control
                                                                            data-test-id='fee-amount'
                                                                            id={`courseOptions[${index}].fees[${indexB}].feeAmount`}
                                                                            name={`courseOptions[${index}].fees[${indexB}].feeAmount`}
                                                                            type='text'
                                                                            className={
                                                                                formik.touched.courseOptions &&
                                                                                formik.touched.courseOptions[index] &&
                                                                                formik.errors.courseOptions &&
                                                                                formik.errors.courseOptions[index] &&
                                                                                formik.touched.courseOptions[index].fees &&
                                                                                formik.errors.courseOptions[index].fees &&
                                                                                formik.touched.courseOptions[index].fees[indexB] &&
                                                                                formik.errors.courseOptions[index].fees[indexB] &&
                                                                                formik.touched.courseOptions[index].fees[indexB]
                                                                                    .feeAmount &&
                                                                                formik.errors.courseOptions[index].fees[indexB].feeAmount
                                                                                    ? 'emptySmallFormInput addFormInput'
                                                                                    : 'smallFormInput addFormInput'
                                                                            }
                                                                            onChange={formik.handleChange}
                                                                            value={
                                                                                formik.values.courseOptions[index].fees[indexB].feeAmount
                                                                            }
                                                                            onBlur={formik.handleBlur}
                                                                        />
                                                                        {formik.touched.courseOptions &&
                                                                        formik.touched.courseOptions[index] &&
                                                                        formik.errors.courseOptions &&
                                                                        formik.errors.courseOptions[index] &&
                                                                        formik.touched.courseOptions[index].fees &&
                                                                        formik.errors.courseOptions[index].fees &&
                                                                        formik.touched.courseOptions[index].fees[indexB] &&
                                                                        formik.errors.courseOptions[index].fees[indexB] &&
                                                                        formik.touched.courseOptions[index].fees[indexB].feeAmount &&
                                                                        formik.errors.courseOptions[index].fees[indexB].feeAmount ? (
                                                                            <div className='errorMessages'>
                                                                                {formik.errors.courseOptions[index].fees[indexB].feeAmount}
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </Col>
                                                                <Col sm={2} className='pad-right-0 pad-bottom-4'>
                                                                    <div className=''>
                                                                        <DropdownButton
                                                                            data-test-id='fee-per'
                                                                            variant='white'
                                                                            title={
                                                                                formik.values.courseOptions[index].fees[indexB].feePer || (
                                                                                    <option disabled selected value />
                                                                                )
                                                                            }
                                                                            className='gray700-13 custom-dropdown padding-right-0'
                                                                            onChange={formik.handleChange}
                                                                            value={formik.values.courseOptions[index].fees[indexB].feePer}
                                                                            onBlur={formik.handleBlur}
                                                                            onSelect={selected =>
                                                                                (formik.values.courseOptions[index].fees[indexB].feePer =
                                                                                    selected)
                                                                            }>
                                                                            {feePer.map((study, i) => (
                                                                                <Dropdown.Item
                                                                                    data-test-id={`fee-per-${study}`}
                                                                                    className='gray800-14 width-100'
                                                                                    key={study}
                                                                                    eventKey={study}>
                                                                                    {study}
                                                                                </Dropdown.Item>
                                                                            ))}
                                                                        </DropdownButton>
                                                                    </div>
                                                                </Col>

                                                                <Col
                                                                    style={{
                                                                        paddingRight: '0px',
                                                                    }}
                                                                    className='col-sm-6 col-md-2 d-flex justify-content-center align-items-center setHeight'>
                                                                    <button
                                                                        type='button'
                                                                        className='plusMinusButton'
                                                                        disabled={formik.values.courseOptions[index].fees.length < 2}
                                                                        onClick={() => {
                                                                            remove(indexB);
                                                                            formik.values.courseOptions[index].fees.splice(indexB, 1);
                                                                        }}>
                                                                        -
                                                                    </button>
                                                                    <button
                                                                        type='button'
                                                                        className='plusMinusButton'
                                                                        disabled={
                                                                            formik.values.courseOptions[index].fees.length >= 5 ||
                                                                            indexB !== formik.values.courseOptions[index].fees.length - 1
                                                                        }
                                                                        onClick={() => {
                                                                            push(new Fees());
                                                                            formik.values.courseOptions[index].fees.push({
                                                                                feeDescription: '',
                                                                                feeAmount: '',
                                                                            });
                                                                        }}>
                                                                        +
                                                                    </button>
                                                                </Col>
                                                            </>
                                                        ))}
                                                </>
                                            )}
                                        </FieldArray>
                                    </Row>

                                    <div className='form-group phase-action' style={{ paddingTop: '10px' }}>
                                        <button
                                            className='button-tertiary'
                                            disabled={formik.values.courseOptions.length < 2}
                                            onClick={async e => {
                                                e.preventDefault();
                                                removePhase(index);
                                            }}>
                                            <CloseButtonSvg width='10px' height='10px' fill='#475DA7' /> Remove option
                                        </button>
                                    </div>
                                </div>
                            </SlideDown>
                        </div>
                    );
                })}

            <div className='main-footer'>
                <Button
                    variant='secondary'
                    onClick={() => {
                        formik.values.courseOptions.push(courseOptions);
                        formik.setFieldValue(); /* push(courseOptions); */
                    }}>
                    + Add course option
                </Button>
            </div>
        </div>
    );
};

export default CourseOptionsFieldArray;
