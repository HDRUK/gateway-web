import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Event } from '../../tracking';

import {Form, Button, Row, Col} from 'react-bootstrap';
import moment from 'moment';
import RelatedResources from '../commonComponents/RelatedResources';
import RelatedObject from '../commonComponents/RelatedObject';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import SVGIcon from '../../images/SVGIcon';

var baseURL = require('../commonComponents/BaseURL').getURL();

const AddEditPaperForm = (props) => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted

    const formik = useFormik({
        initialValues: {
            id: props.data.id || '', 
            type: 'paper',
            name: props.data.name || '',
            link: props.data.link || '',
            journal: props.data.journal || '',
            journalYear: props.data.journalYear || '',
            description: props.data.description || '',
            authors: props.data.authors || [props.userState[0].id],
            tags: props.data.tags || {
                features: [],
                topics: [],
            },
            relatedObjects: props.relatedObjects
        },

        validationSchema: Yup.object({
            name: Yup.string()
                .required('This cannot be empty'),
                link: Yup.string()
                .required('This cannot be empty'),
            description: Yup.string()
                .max(1500, 'Maximum of 1,500 characters')
                .required('This cannot be empty'),
            journal: Yup.string()
                .required('This cannot be empty'),
            journalYear: Yup.string()
                .required('Year cannot be empty'),
            authors: Yup.string().required('This cannot be empty')
        }),

        onSubmit: values => {
            values.relatedObjects = props.relatedObjects
            values.toolCreator = props.userState[0];
            if (props.isEdit) {
                axios.put(baseURL + '/api/v1/paper/' + props.data.id, values) 
                .then((res) => {
                    window.location.href = window.location.search + '/paper/' + props.data.id + '/?paperEdited=true';
                });
            }
            else {
                axios.post(baseURL + '/api/v1/paper/', values)
                    .then((res) => {
                        window.location.href = window.location.search + '/paper/' + res.data.response.id + '/?paperAdded=true';
                    });
            }
        }
    });

    var listOfAuthors = [];

    props.combinedUsers.forEach((user) => {
        if (user.id === props.userState[0].id) {
            listOfAuthors.push({ id: user.id, name: user.name + " (You)" })
            if (!user.name.includes('(You)')) {
                user.name = user.name + " (You)";
            }
        }
    });
  
    function updateReason(id, reason, type) {
        let relatedObj = props.relatedObjects.find(ro => ro.objectId === id);
        if(typeof relatedObj != "undefined") {
            relatedObj.reason = reason;
            relatedObj.user = props.userState[0].name;
            relatedObj.updated = moment().format("DD MMM YYYY");
        }
    }

    const [descriptionLength, setDescriptionLength] = useState(props.data.description.length || 0);

    const onDescKeyUp = (e) => {
        e.preventDefault();
        let { target: { value } } = e;
        setDescriptionLength(value.length);
    };
    
    return (
        <div>
            <Row className="mt-4">
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <div className="rectangle">
                        <Row>
                            <Col sm={10} lg={10}>
                             <p className="black-20">{props.isEdit ? 'Edit your paper' : 'Add a new paper'}</p>
                            </Col>
                            <Col sm={2} lg={2} className="text-right">
                                <span className="badge-paper"> 
                                    <SVGIcon name="projecticon" fill={'#3c3c3b'} className="badgeSvg mr-2" />
                                    Paper 
                                </span>
                            </Col>
                        </Row>
                        <p className="gray800-14">Papers should be articles published in a journal. Add a project if you want</p>
                    </div>
                </Col>
                <Col sm={1} lg={10} />
            </Row>

            <Row className="pixelGapTop">
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <Form onSubmit={formik.handleSubmit} onBlur={formik.handleBlur} autocomplete='off'>
                        <div className="rectangle">
                            <Form.Group>
                                <span className="gray800-14">Link</span>
                                <br />
                                <span className="gray700-13">
                                    Where can we find this paper?
                                </span>
                                <Form.Control id="link" name="link" type="text" className={formik.touched.link && formik.errors.link ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.link} onBlur={formik.handleBlur} />
                                {formik.touched.link && formik.errors.link ? <div className="errorMessages">{formik.errors.link}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <span className="gray800-14">Title</span>
                                <Form.Control id="name" name="name" type="text" className={formik.touched.name && formik.errors.name ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} />
                                {formik.touched.name && formik.errors.name ? <div className="errorMessages">{formik.errors.name}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <span className="gray800-14">Authors on the Gateway</span>
                                <br />
                                <span className="gray700-13">
                                    Add any authors or collaborators who have an account on this site
                                </span>
                                <Typeahead
                                    id="authors"
                                    labelKey={authors => `${authors.name}`}
                                    defaultSelected={listOfAuthors}
                                    multiple
                                    className={formik.touched.authors && formik.errors.authors ? "emptyFormInputTypeAhead addFormInputTypeAhead" : "addFormInputTypeAhead"}
                                    options={props.combinedUsers}
                                    onChange={(selected) => {
                                        var tempSelected = [];
                                        selected.forEach((selectedItem) => {
                                            tempSelected.push(selectedItem.id);
                                        })
                                        formik.values.authors = tempSelected;
                                    }}
                                />
                                {formik.touched.authors && formik.errors.authors ? <div className="errorMessages">{formik.errors.authors}</div> : null}
                            </Form.Group>
                            
                            <Row className="mt-2">
                                <Col sm={10}>
                                    <Form.Group>
                                        <span className="gray800-14">Journal</span>
                                        <Form.Control id="journal" name="journal" type="text" className={formik.touched.journal && formik.errors.journal ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.journal} onBlur={formik.handleBlur} />
                                        {formik.touched.journal && formik.errors.journal ? <div className="errorMessages">{formik.errors.journal}</div> : null}
                                        {formik.touched.journalYear && formik.errors.journalYear ? <div className="errorMessages">{formik.errors.journalYear}</div> : null}
                                    </Form.Group>
                                </Col>
                                <Col sm={2}>
                                    <Form.Group>
                                        <span className="gray800-14">Year</span>
                                        <Form.Control id="journalYear" name="journalYear" type="text" className={formik.touched.journalYear && formik.errors.journalYear ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.journalYear} onBlur={formik.handleBlur} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group>
                                <div style={{ display: 'inline-block' }}>
                                    <span className="gray800-14">Abstract</span>
                                    <br />
                                    <span className="gray700-13">Provide a brief summary of the paper</span>
                                </div>
                                <div style={{ display: 'inline-block', float: 'right' }}>
                                    <br />
                                    <span className="gray700-13">(<span id="currentCount">{descriptionLength}</span>/1500)</span>
                                </div>
                                <Form.Control as="textarea" id="description" name="description" type="text" className={formik.touched.description && formik.errors.description ? "emptyFormInput addFormInput descriptionInput" : "addFormInput descriptionInput"} onKeyUp={e => onDescKeyUp(e)} onChange={formik.handleChange}  value={formik.values.description} onBlur={formik.handleBlur} />
                                {formik.touched.description && formik.errors.description ? <div className="errorMessages">{formik.errors.description}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <span className="gray800-14">Keywords (optional)</span>
                                <br />
                                <span className="gray700-13">
                                Technological paradigms or other keywords. Eg. Rule-based, clustering, supervised machine learning
                                </span>
                                <Typeahead
                                    id="tags.features"
                                    labelKey="features"
                                    allowNew
                                    multiple
                                    className="addFormInputTypeAhead"
                                    options={props.combinedFeatures}
                                    onChange={(selected) => {
                                        var tempSelected = [];
                                        selected.forEach((selectedItem) => {
                                            selectedItem.customOption === true ? tempSelected.push(selectedItem.features) : tempSelected.push(selectedItem);

                                        })
                                        formik.values.tags.features = tempSelected;
                                    }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <span className="gray800-14">Domain (optional)</span>
                                <br />
                                <span className="gray700-13">
                                    E.g. Biogenomics, Nutrition, Blockchain
                                </span>
                                <Typeahead
                                    id="tags.topics"
                                    labelKey="topics"
                                    allowNew
                                    multiple
                                    className="addFormInputTypeAhead"
                                    options={props.combinedTopic}
                                    onChange={(selected) => {
                                        var tempSelected = [];
                                        selected.forEach((selectedItem) => {
                                            selectedItem.customOption === true ? tempSelected.push(selectedItem.topics) : tempSelected.push(selectedItem);
                                        })
                                        formik.values.tags.topics = tempSelected;
                                    }}
                                />
                            </Form.Group>
                        </div>

                        <div className="rectangle mt-2">
                            <span className="black-20">Related resources</span><span className="gray800-14"> (optional)</span>
                            <br/>
                            <span className="gray800-14">Show relationships to papers, projects, datasets and tools. Resources must be added to the Gateway first.</span>
                        </div>
                        
                        {props.relatedObjects.length === 0 ? '' :     
                        <div className="rectangle">
                            {props.relatedObjects.map((object) => {
                                return (
                                    <RelatedObject showRelationshipQuestion={true} objectId={object.objectId} doRemoveObject={props.doRemoveObject} doUpdateReason={updateReason} reason={object.reason} didDelete={props.didDelete} updateDeleteFlag={props.updateDeleteFlag}/>
                                )
                            })}
                        </div>}

                        <div className="rectangle flexCenter pixelGapTop">
                            <Row>
                                <Col sm={1} lg={1} />
                                <Col sm={10} lg={10}>
                                    
                                    <RelatedResources searchString={props.searchString} doSearchMethod={props.doSearchMethod} doUpdateSearchString={props.doUpdateSearchString} userState={props.userState} datasetData={props.datasetData} toolData={props.toolData} projectData={props.projectData} paperData={props.paperData} personData={props.personData} summary={props.summary} doAddToTempRelatedObjects={props.doAddToTempRelatedObjects} tempRelatedObjectIds={props.tempRelatedObjectIds} relatedObjects={props.relatedObjects} doClearRelatedObjects={props.doClearRelatedObjects} doAddToRelatedObjects={props.doAddToRelatedObjects} />
                                </Col>
                                <Col sm={1} lg={10} />
                            </Row>
                        </div>

                        <Row className="mt-3">
                            <Col xs={5} lg={9}>
                                <a style={{ cursor: 'pointer' }} href={'/account?tab=papers'}>
                                    <Button variant="medium" className="greyCancelButton dark-14 mr-2" >
                                        Cancel
                                    </Button>
                                </a>
                            </Col>
                            <Col xs={7} lg={3} className="text-right">
                                <Button variant="primary" className="white-14-semibold" type="submit" onClick={() => Event("Buttons", "Click", "Add tool form submitted")} >
                                    {props.isEdit ? 'Update' : 'Publish'}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col sm={1} lg={10} />
            </Row>
            <Row>
                <span className="formBottomGap"></span>
            </Row>
        </div>
    );                  
}

export default AddEditPaperForm;