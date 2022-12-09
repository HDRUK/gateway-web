import { FieldArray } from 'formik';
import { Typeahead } from 'react-bootstrap-typeahead';
import _ from 'lodash';
import moment from 'moment';
import { Form, Row, Col, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import CourseOptionsFieldArray from './CourseOptionsFieldArray';
import SVGIcon from '../../images/SVGIcon';
import './Course.scss';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import EntryFieldArray from './EntryFieldArray';
import RelatedResources from '../commonComponents/relatedResources/RelatedResources';

const CourseForm = ({ props, formik, relatedResourcesRef }) => {
    function descriptionCount(e) {
        document.getElementById('currentCount').innerHTML = e.target.value.length;
    }

    const level = ['No Entry Requirements', 'Bachelors', 'Masters', 'PhD', 'Honours', 'A level'];

    const priority = ['Understanding the causes of disease', 'Clinical trials', 'Improving Public Health', 'Better Care'];

    function updateReason(id, reason, type, pid) {
        let inRelatedObject = false;
        props.relatedObjects.map(object => {
            if (object.objectId === id) {
                inRelatedObject = true;
                object.pid = pid;
                object.reason = reason;
                object.objectType = type;
                object.user = props.userState[0].name;
                object.updated = moment().format('DD MMM YYYY');
            }
        });

        if (!inRelatedObject) {
            props.relatedObjects.push({
                objectId: id,
                pid,
                reason,
                objectType: type,
                user: props.userState[0].name,
                updated: moment().format('DD MMM YYYY'),
            });
        }
    }

    return (
        <div>
            <Row className='margin-top-32'>
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <div className='rectangle'>
                        <Row>
                            <Col sm={10} lg={10}>
                                <p className='black-20 margin-bottom-0 pad-bottom-8'>
                                    {props.isEdit ? 'Edit your course' : 'Add a new course'}
                                </p>
                            </Col>
                            <Col sm={2} lg={2} className='text-right'>
                                <span className='badge-course'>
                                    <SVGIcon name='newtoolicon' fill='#ffffff' className='badgeSvg mr-2' />
                                    Course
                                </span>
                            </Col>
                        </Row>
                        <p className='gray800-14 margin-bottom-0'>
                            Courses are any educational programme that users of the Gateway may find helpful
                        </p>
                    </div>
                </Col>
                <Col sm={1} lg={10} />
            </Row>

            <Row className='pixelGapTop'>
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <Form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} autocomplete='off'>
                        <div className='rectangle'>
                            <Form.Group>
                                <span className='gray800-14'>Course title</span>
                                <Form.Control
                                    data-test-id='title'
                                    id='title'
                                    name='title'
                                    type='text'
                                    className={formik.touched.title && formik.errors.title ? 'emptyFormInput addFormInput' : 'addFormInput'}
                                    onChange={formik.handleChange}
                                    value={formik.values.title}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.title && formik.errors.title ? (
                                    <div className='errorMessages'>{formik.errors.title}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>URL</p>
                                <p className='gray700-13 margin-bottom-0'>
                                    Where can users sign up and find more information about this course?
                                </p>
                                <Form.Control
                                    data-test-id='url'
                                    id='link'
                                    name='link'
                                    type='text'
                                    className={formik.touched.link && formik.errors.link ? 'emptyFormInput addFormInput' : 'addFormInput'}
                                    onChange={formik.handleChange}
                                    value={formik.values.link}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.link && formik.errors.link ? (
                                    <div className='errorMessages'>{formik.errors.link}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Course provider</p>
                                <p className='gray700-13 margin-bottom-0'>Who is providing this course?</p>
                                <Form.Control
                                    data-test-id='provider'
                                    id='provider'
                                    name='provider'
                                    type='text'
                                    className={
                                        formik.touched.provider && formik.errors.provider ? 'emptyFormInput addFormInput' : 'addFormInput'
                                    }
                                    onChange={formik.handleChange}
                                    value={formik.values.provider}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.provider && formik.errors.provider ? (
                                    <div className='errorMessages'>{formik.errors.provider}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group className='pb-2 margin-bottom-0'>
                                <Form.Label className='gray800-14'>Course delivery method (optional)</Form.Label>
                                <br />
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <Row className='margin-bottom-8'>
                                            <InputGroup.Radio
                                                id='courseDeliveryCampus'
                                                className='ml-3'
                                                aria-label='On-campus'
                                                name='courseDelivery'
                                                defaultChecked={formik.values.courseDelivery === 'campus'}
                                                onChange={e => {
                                                    formik.setFieldValue('courseDelivery', 'campus');
                                                }}
                                            />
                                            <span className='gray800-14 ml-3'>On-campus</span>
                                        </Row>
                                        <Row className='margin-bottom-12'>
                                            <InputGroup.Radio
                                                id='courseDeliveryOnline'
                                                className='ml-3'
                                                aria-label='Online'
                                                name='courseDelivery'
                                                defaultChecked={formik.values.courseDelivery === 'online'}
                                                onChange={e => {
                                                    formik.setFieldValue('courseDelivery', 'online');
                                                }}
                                            />
                                            <span className='gray800-14 ml-3'>Online</span>
                                        </Row>
                                    </InputGroup.Prepend>
                                </InputGroup>
                                {formik.values.courseDelivery === 'campus' ? (
                                    <Form.Group>
                                        <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Location (optional)</p>
                                        <p className='gray700-13 margin-bottom-0'>
                                            Where is this course being held? e.g. London, Manchester, Wales, Scotland
                                        </p>
                                        <Form.Control
                                            data-test-id='location'
                                            id='location'
                                            name='location'
                                            type='text'
                                            className='addFormInput'
                                            onChange={formik.handleChange}
                                            value={formik.values.location}
                                            onBlur={formik.handleBlur}
                                        />
                                    </Form.Group>
                                ) : null}
                            </Form.Group>

                            <Form.Group>
                                <div style={{ display: 'inline-block' }}>
                                    <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Description</p>
                                    <p className='gray700-13 margin-bottom-0'>Include an overview of the course</p>
                                </div>
                                <div style={{ display: 'inline-block', float: 'right' }}>
                                    <br />
                                    <span className='gray700-13'>
                                        (<span id='currentCount'>{formik.values.description.length || 0}</span>/3000)
                                    </span>
                                </div>
                                <TextareaAutosize
                                    data-test-id='description'
                                    as='textarea'
                                    id='description'
                                    name='description'
                                    type='text'
                                    className={
                                        formik.touched.description && formik.errors.description
                                            ? 'emptyFormInput addFormInput descriptionInput textarea-addEditForm'
                                            : 'addFormInput descriptionInput textarea-addEditForm'
                                    }
                                    onKeyUp={descriptionCount}
                                    onChange={formik.handleChange}
                                    value={formik.values.description}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.description && formik.errors.description ? (
                                    <div className='errorMessages'>{formik.errors.description}</div>
                                ) : null}
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Keywords (optional)</p>
                                <p className='gray700-13 margin-bottom-0'>E.g. Community, Research, Statistical Analysis</p>

                                <Typeahead
                                    id='keywords'
                                    labelKey='keywords'
                                    allowNew
                                    defaultSelected={formik.values.keywords}
                                    multiple
                                    options={props.combinedKeywords}
                                    className='addFormInputTypeAhead'
                                    onChange={selected => {
                                        const tempSelected = [];
                                        selected.forEach(selectedItem => {
                                            selectedItem.customOption === true
                                                ? tempSelected.push(selectedItem.keywords)
                                                : tempSelected.push(selectedItem);
                                        });
                                        formik.values.keywords = tempSelected;
                                    }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Domain (optional)</p>
                                <p className='gray700-13 margin-bottom-0'>E.g. Genomics, Health Informatics, Data Science</p>

                                <Typeahead
                                    id='domains'
                                    labelKey='domains'
                                    allowNew
                                    defaultSelected={formik.values.domains}
                                    multiple
                                    options={props.combinedDomains}
                                    className='addFormInputTypeAhead'
                                    onChange={selected => {
                                        const tempSelected = [];
                                        selected.forEach(selectedItem => {
                                            selectedItem.customOption === true
                                                ? tempSelected.push(selectedItem.domains)
                                                : tempSelected.push(selectedItem);
                                        });
                                        formik.values.domains = tempSelected;
                                    }}
                                />
                            </Form.Group>
                        </div>

                        <div className='rectangle mt-2'>
                            <p className='black-20 margin-bottom-0 pad-bottom-8'>Dates and costs</p>
                        </div>

                        <div className='rectangle pixelGapTop'>
                            <div className='main-body'>
                                <FieldArray name='courseOptions'>{() => <CourseOptionsFieldArray formik={formik} />}</FieldArray>
                            </div>
                        </div>

                        <div className='rectangle mt-2'>
                            <p className='black-20 margin-bottom-0 pad-bottom-8'>Requirements and certifications</p>
                        </div>

                        <div className='rectangle pixelGapTop'>
                            <Row className='mt-2'>
                                <Col sm={12}>
                                    <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Entry requirements (optional)</p>
                                    <p className='gray700-13 margin-bottom-0'>
                                        Detail the relevant requirements an applicant must hold to apply for this course option.
                                    </p>
                                </Col>
                                <Col sm={5}>
                                    <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Entry level</p>
                                    <p className='gray700-13 margin-bottom-0'>E.g. PhD, Bachelor's</p>
                                </Col>
                                <Col sm={7}>
                                    <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Entry subject</p>
                                    <p className='gray700-13 margin-bottom-0'>E.g. Maths, Biology, Science, STEM</p>
                                </Col>
                            </Row>

                            <Row className='mt-2'>
                                <FieldArray name='entry'>
                                    {({ remove, push }) => <EntryFieldArray level={level} remove={remove} push={push} formik={formik} />}
                                </FieldArray>
                            </Row>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Restrictions (optional)</p>
                                <p className='gray700-13 margin-bottom-0'>
                                    E.g. Open/none, open to current students, open to employees, not open to visiting students
                                </p>
                                <Form.Control
                                    id='restrictions'
                                    name='restrictions'
                                    type='text'
                                    className='addFormInput'
                                    onChange={formik.handleChange}
                                    value={formik.values.restrictions}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Award (optional)</p>
                                <p className='gray700-13 margin-bottom-0'>E.g. CPD, Fellowship, PhD, CPE, PGCert, PGDip, MSc, DPhil</p>

                                <Typeahead
                                    id='award'
                                    labelKey='award'
                                    allowNew
                                    defaultSelected={formik.values.award}
                                    multiple
                                    options={props.combinedAwards}
                                    className='addFormInputTypeAhead'
                                    onChange={selected => {
                                        const tempSelected = [];
                                        selected.forEach(selectedItem => {
                                            selectedItem.customOption === true
                                                ? tempSelected.push(selectedItem.award)
                                                : tempSelected.push(selectedItem);
                                        });
                                        formik.values.award = tempSelected;
                                    }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>Competency framework (optional)</p>

                                <Form.Control
                                    id='competencyFramework'
                                    name='competencyFramework'
                                    type='text'
                                    className='addFormInput'
                                    onChange={formik.handleChange}
                                    value={formik.values.competencyFramework}
                                    onBlur={formik.handleBlur}
                                />
                            </Form.Group>

                            <Form.Group>
                                <p className='gray800-14 margin-bottom-0 pad-bottom-4'>National priority areas (optional)</p>
                                <p className='gray700-13 margin-bottom-0'>
                                    E.g. Understanding the causes of disease, Clinical trials, Improving Public Health and Better Care
                                </p>
                                <DropdownButton
                                    variant='white'
                                    title={formik.values.nationalPriority || <option disabled selected value />}
                                    className='gray700-13 custom-dropdown padding-right-0'
                                    style={{ width: '100%' }}
                                    onChange={formik.handleChange}
                                    value={formik.values.nationalPriority}
                                    onBlur={formik.handleBlur}
                                    onSelect={selected => (formik.values.nationalPriority = selected)}>
                                    {priority.map((l, i) => (
                                        <Dropdown.Item className='gray800-14 width-100' key={l} eventKey={l}>
                                            {l}
                                        </Dropdown.Item>
                                    ))}
                                </DropdownButton>
                            </Form.Group>
                        </div>

                        <div className='rectangle mt-2'>
                            <span className='black-20'>Related resources</span>
                            <span className='gray800-14'> (optional)</span>
                            <br />
                            <span className='gray800-14'>
                                Show relationships to papers, data uses, datasets, tools and courses. Resources must be added to the Gateway
                                first.
                            </span>
                        </div>

                        {props.relatedObjects.length === 0 ? (
                            ''
                        ) : (
                            <div className='rectangle'>
                                {props.relatedObjects.map(object => {
                                    if (!_.isNil(object.objectId)) {
                                        return (
                                            <RelatedObject
                                                showRelationshipQuestion
                                                objectId={object.objectId}
                                                pid={object.pid}
                                                objectType={object.objectType}
                                                doRemoveObject={props.doRemoveObject}
                                                doUpdateReason={updateReason}
                                                reason={object.reason}
                                                didDelete={props.didDelete}
                                                updateDeleteFlag={props.updateDeleteFlag}
                                            />
                                        );
                                    }
                                })}
                            </div>
                        )}

                        <div className='rectangle flexCenter pixelGapTop'>
                            <Row>
                                <Col sm={1} lg={1} />

                                <Col sm={10} lg={10}>
                                    <RelatedResources
                                        ref={relatedResourcesRef}
                                        searchString={props.searchString}
                                        doSearchMethod={props.doSearchMethod}
                                        doUpdateSearchString={props.doUpdateSearchString}
                                        userState={props.userState}
                                        datasetData={props.datasetData}
                                        toolData={props.toolData}
                                        datauseData={props.datauseData}
                                        paperData={props.paperData}
                                        personData={props.personData}
                                        courseData={props.courseData}
                                        summary={props.summary}
                                        doAddToTempRelatedObjects={props.doAddToTempRelatedObjects}
                                        tempRelatedObjectIds={props.tempRelatedObjectIds}
                                        relatedObjects={props.relatedObjects}
                                        doClearRelatedObjects={props.doClearRelatedObjects}
                                        doAddToRelatedObjects={props.doAddToRelatedObjects}
                                    />
                                </Col>
                                <Col sm={1} lg={10} />
                            </Row>
                        </div>
                    </Form>
                </Col>
                <Col sm={1} lg={10} />
            </Row>
            <Row>
                <span className='formBottomGap' />
            </Row>
        </div>
    );
};

export default CourseForm;
