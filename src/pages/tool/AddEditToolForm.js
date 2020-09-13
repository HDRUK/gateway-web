import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typeahead } from 'react-bootstrap-typeahead'; 
import moment from 'moment';
import {Form, Button, Row, Col} from 'react-bootstrap';

import RelatedResources from '../commonComponents/relatedResources/RelatedResources';
import RelatedObject from '../commonComponents/relatedObject/RelatedObject';
import ActionBar from '../commonComponents/actionbar/ActionBar';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import SVGIcon from '../../images/SVGIcon';
import './Tool.scss'; 

var baseURL = require('../commonComponents/BaseURL').getURL();

const AddEditToolForm = (props) => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
 
    const formik = useFormik({
        initialValues: {
            id: props.data.id || '', 
            type: 'tool',
            name: props.data.name || '',
            link: props.data.link || '',
            description: props.data.description || '',
            resultsInsights: props.data.resultsInsights || '',
            categories: props.data.categories  || { 
                category: '',
                programmingLanguage: [],
                programmingLanguageVersion: ''
            },
            license: props.data.license || '',
            authors: props.data.authors || [props.userState[0].id],
            tags: props.data.tags || {
                features: [],
                topics: [],
            },
            relatedObjects: props.relatedObjects || []
        },

        validationSchema: Yup.object({
            name: Yup.string()
                .required('This cannot be empty'),
            link: Yup.string()
                .required('This cannot be empty'),
            description: Yup.string()
                .max(1500, 'Maximum of 1,500 characters')
                .required('This cannot be empty'),
            resultsInsights: Yup.string()
                .max(3000, 'Maximum of 3,000 characters'),
            categories: Yup.object().shape({
                category: Yup.string().required('This cannot be empty'),
                programmingLanguage: Yup.string().required('This cannot be empty'),
            }),
            authors: Yup.string().required('This cannot be empty')
        }),

        onSubmit: values => {
            values.relatedObjects = props.relatedObjects
            values.toolCreator = props.userState[0];
            if (props.isEdit) {
                axios.put(baseURL + '/api/v1/tools/' + props.data.id, values) 
                    .then((res) => {
                        window.location.href = window.location.search + '/tool/' + props.data.id + '/?toolEdited=true';
                    });
            }
            else {
                axios.post(baseURL + '/api/v1/tools', values) 
                    .then((res) => {
                        window.location.href = window.location.search + '/tool/' + res.data.response.id + '/?toolAdded=true';
                    });
            }
        }
    });

    var listOfAuthors = [];

    if (props.isEdit) {
        props.data.authors.forEach((author) => {
            props.combinedUsers.forEach((user) => {
                if (user.id === author) {
                    if (props.userState[0].id === user.id) {
                        listOfAuthors.push({ id: user.id, name: user.name + " (You)" })
                        if (!user.name.includes('(You)')) {
                            user.name = user.name + " (You)";
                        }
                    }
                    else {
                        listOfAuthors.push({ id: user.id, name: user.name })
                    }
                }
            });
        });
    }
    else {
        props.combinedUsers.forEach((user) => {
            if (user.id === props.userState[0].id) {
                listOfAuthors.push({ id: user.id, name: user.name + " (You)" })
                if (!user.name.includes('(You)')) {
                    user.name = user.name + " (You)";
                }
            }
        });
    }

    function updateReason(id, reason, type) {
        let inRelatedObject = false;
        props.relatedObjects.forEach((object) => {
            if(object.objectId===id){
                inRelatedObject = true;
                object.reason = reason;
                object.user = props.userState[0].name;
                object.updated = moment().format("DD MMM YYYY");
            }
        });

        if(!inRelatedObject){
            props.relatedObjects.push({'objectId':id, 'reason':reason, 'objectType': type, 'user': props.userState[0].name, 'updated':moment().format("DD MMM YYYY")})
        }
    }

    function descriptionCount(e) {
        document.getElementById("currentCount").innerHTML=e.target.value.length
    }

    function resultsInsightsCount(e) {
        document.getElementById("resultsInsightsCurrentCount").innerHTML=e.target.value.length
    }

    const relatedResourcesRef = React.useRef()
    
    return (
        <div>
            <Row className="margin-top-32">  
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <div className="rectangle">
                        <Row>
                            <Col sm={10} lg={10}>
                             <p className="black-20 margin-bottom-0 pad-bottom-8">{props.isEdit ? 'Edit your tool or resource' : 'Add a new tool or resource'}</p>
                            </Col>
                            <Col sm={2} lg={2} className="text-right">
                                <span className="badge-tool"> 
                                    <SVGIcon name="newtoolicon" fill={'#ffffff'} className="badgeSvg mr-2" />
                                    Tool 
                                </span>
                            </Col>
                        </Row>
                        <p className="gray800-14 margin-bottom-0">Tools can be anything you or someone else created or used during a research project</p>
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
                                <p className="gray800-14 margin-bottom-0 pad-bottom-4">Link</p>
                                <p className="gray700-13 margin-bottom-0">Where can we find this tool or resource?</p>
                                <Form.Control id="link" name="link" type="text" className={formik.touched.link && formik.errors.link ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.link} onBlur={formik.handleBlur} />
                                {formik.touched.link && formik.errors.link ? <div className="errorMessages">{formik.errors.link}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <span className="gray800-14">Name</span>
                                <Form.Control id="name" name="name" type="text" className={formik.touched.name && formik.errors.name ? "emptyFormInput addFormInput" : "addFormInput"} onChange={formik.handleChange} value={formik.values.name} onBlur={formik.handleBlur} />
                                {formik.touched.name && formik.errors.name ? <div className="errorMessages">{formik.errors.name}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <p className="gray800-14 margin-bottom-0 pad-bottom-4">Type</p>
                                <p className="gray700-13 margin-bottom-0">Select from existing or enter a new one.</p>
                                <Typeahead 
                                    id="categories.category"
                                    labelKey="category"
                                    allowNew
                                    defaultSelected={[formik.values.categories.category]}
                                    options={props.combinedCategories}
                                    className={formik.touched.categories && (formik.errors.categories && typeof formik.errors.categories.category !== "undefined") ? "emptyFormInputTypeAhead addFormInputTypeAhead" : "addFormInputTypeAhead"}
                                    onChange={(selected) => {
                                        var tempSelected = [];
                                        selected.forEach((selectedItem) => {
                                            selectedItem.customOption === true ? tempSelected.push(selectedItem.category) : tempSelected.push(selectedItem);
                                        })
                                        tempSelected.length > 0 ? formik.values.categories.category = tempSelected[0] : formik.values.categories.category = ""
                                    }}
                                />
                                {formik.touched.categories && (formik.errors.categories && typeof formik.errors.categories.category !== "undefined")
                                    ? <div className="errorMessages">{formik.errors.categories.category}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <div style={{ display: 'inline-block' }}>
                                    <p className="gray800-14 margin-bottom-0 pad-bottom-4">Description</p>
                                    <p className="gray700-13 margin-bottom-0">Include the tool purpose and objective.</p>
                                </div>
                                <div style={{ display: 'inline-block', float: 'right' }}>
                                    <br />
                                    <span className="gray700-13">(<span id="currentCount">{formik.values.description.length || 0}</span>/1500)</span>
                                </div>
                                <Form.Control as="textarea" id="description" name="description" type="text" className={formik.touched.description && formik.errors.description ? "emptyFormInput addFormInput descriptionInput" : "addFormInput descriptionInput"} onKeyUp={descriptionCount} onChange={formik.handleChange}  value={formik.values.description} onBlur={formik.handleBlur} />
                                {formik.touched.description && formik.errors.description ? <div className="errorMessages">{formik.errors.description}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <div style={{ display: 'inline-block' }}>
                                    <p className="gray800-14 margin-bottom-0 pad-bottom-4">Results/Insights</p>
                                    <p className="gray700-13 margin-bottom-0">Include any results or insights about the tool.</p>
                                </div>
                                <div style={{ display: 'inline-block', float: 'right' }}>
                                    <br />
                                    <span className="gray700-13">(<span id="resultsInsightsCurrentCount">{formik.values.resultsInsights.length || 0}</span>/3000)</span>
                                </div>
                                <Form.Control as="textarea" id="resultsInsights" name="resultsInsights" type="text" className={formik.touched.resultsInsights && formik.errors.resultsInsights ? "emptyFormInput addFormInput descriptionInput" : "addFormInput descriptionInput"} onKeyUp={resultsInsightsCount} onChange={formik.handleChange}  value={formik.values.resultsInsights} onBlur={formik.handleBlur} />
                                {formik.touched.resultsInsights && formik.errors.resultsInsights ? <div className="errorMessages">{formik.errors.resultsInsights}</div> : null}
                            </Form.Group>

                            <Form.Group>
                                <span className="gray800-14">Authors on the Gateway</span>
                                <Typeahead
                                    id="authors"
                                    labelKey={authors => `${authors.name}`}
                                    defaultSelected={listOfAuthors}
                                    multiple
                                    options={props.combinedUsers}
                                    className={formik.touched.authors && formik.errors.authors ? "emptyFormInputTypeAhead addFormInputTypeAhead" : "addFormInputTypeAhead"}
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
                                <Col sm={9}>
                                    <Form.Group>
                                        <p className="gray800-14 margin-bottom-0 pad-bottom-4">Implementation</p>
                                        <p className="gray700-13 margin-bottom-0">
                                            Programming languages, formalisms or frameworks. E.g. Python, RDF, GATE
                                        </p>
                                        <Typeahead
                                            id="categories.programmingLanguage"
                                            labelKey="programmingLanguage"
                                            allowNew
                                            defaultSelected={formik.values.categories.programmingLanguage}
                                            multiple
                                            options={props.combinedLanguages}
                                            className={formik.touched.categories && (formik.errors.categories && typeof formik.errors.categories.programmingLanguage !== "undefined") ? "emptyFormInputTypeAhead addFormInputTypeAhead" : "addFormInputTypeAhead"}
                                            onChange={(selected) => {
                                                var tempSelected = [];
                                                selected.forEach((selectedItem) => {
                                                    selectedItem.customOption === true ? tempSelected.push(selectedItem.programmingLanguage) : tempSelected.push(selectedItem);

                                                })
                                                formik.values.categories.programmingLanguage = tempSelected;
                                            }}
                                        />
                                        {formik.touched.categories && (formik.errors.categories && typeof formik.errors.categories.programmingLanguage !== "undefined")
                                            ? <div className="errorMessages">{formik.errors.categories.programmingLanguage}</div> : null}
                                    </Form.Group>
                                </Col>
                                <Col sm={3}>

                                    <Form.Group>
                                        <p className="gray800-14 margin-bottom-0 pad-bottom-4">Version (optional)</p>
                                        <p className="gray700-13 margin-bottom-0">
                                            i.e. 3.6.1 
                                        </p>
                                        <Form.Control id="categories.programmingLanguageVersion" name="categories.programmingLanguageVersion" type="text" className="smallFormInput addFormInput" onChange={formik.handleChange} value={formik.values.categories.programmingLanguageVersion} onBlur={formik.handleBlur} />
                                    </Form.Group>
                                    {/* <Col sm={2}></Col> */}
                                </Col>
                            </Row>
                            
                            <Form.Group>
                                <p className="gray800-14 margin-bottom-0 pad-bottom-4">License (optional)</p>
                                <p className="gray700-13 margin-bottom-0">
                                    Select from existing or enter a new one
                                </p>
                                <Typeahead 
                                    id="license"
                                    labelKey="license"
                                    allowNew
                                    defaultSelected={[formik.values.license]}
                                    options={props.combinedLicenses}
                                    className="addFormInputTypeAhead"
                                    onChange={(selected) => {
                                        var tempSelected = [];
                                        selected.forEach((selectedItem) => {
                                            selectedItem.customOption === true ? tempSelected.push(selectedItem.license) : tempSelected.push(selectedItem);
                                        })
                                        tempSelected.length > 0 ? formik.values.license = tempSelected[0] : formik.values.license = ""
                                    }}
                                />
                            </Form.Group>

                            <Form.Group>
                                <p className="gray800-14 margin-bottom-0 pad-bottom-4">Keywords (optional)</p>
                                <p className="gray700-13 margin-bottom-0">
                                    Technological paradigms or other keywords. Eg. Rule-based, clustering, supervised machine learning
                                </p>
                                <Typeahead
                                    id="tags.features"
                                    labelKey="features"
                                    allowNew
                                    defaultSelected={formik.values.tags.features}
                                    multiple
                                    options={props.combinedFeatures}
                                    className="addFormInputTypeAhead"
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
                                <p className="gray800-14 margin-bottom-0 pad-bottom-4">Domain (optional)</p>
                                <p className="gray700-13 margin-bottom-0">
                                    E.g. Biogenomics, Nutrition, Blockchain
                                </p>

                                <Typeahead
                                    id="tags.topics"
                                    labelKey="topics"
                                    allowNew
                                    defaultSelected={formik.values.tags.topics}
                                    multiple
                                    options={props.combinedTopic}
                                    className="addFormInputTypeAhead"
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
                                    
                                    <RelatedResources ref={relatedResourcesRef} searchString={props.searchString} doSearchMethod={props.doSearchMethod} doUpdateSearchString={props.doUpdateSearchString} userState={props.userState} datasetData={props.datasetData} toolData={props.toolData} projectData={props.projectData} paperData={props.paperData} personData={props.personData} summary={props.summary} doAddToTempRelatedObjects={props.doAddToTempRelatedObjects} tempRelatedObjectIds={props.tempRelatedObjectIds} relatedObjects={props.relatedObjects} doClearRelatedObjects={props.doClearRelatedObjects} doAddToRelatedObjects={props.doAddToRelatedObjects} />
                                </Col>
                                <Col sm={1} lg={10} />
                            </Row>
                        </div>

                        <ActionBar userState={props.userState}> 
                                <a style={{ cursor: 'pointer' }} href={'/account?tab=tools'}>
                                    <Button variant="medium" className="cancelButton dark-14 mr-2" >
                                        Cancel
                                    </Button>
                                </a> 

                                <Button onClick={() => relatedResourcesRef.current.showModal()} variant='white' className="techDetailButton mr-2">
                                    + Add resource
                                </Button>
                                
                                <Button variant="primary" className="publishButton white-14-semibold mr-2" type="submit" >
                                    {props.isEdit ? 'Update' : 'Publish'}
                                </Button>
                        </ActionBar> 

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

export default AddEditToolForm;