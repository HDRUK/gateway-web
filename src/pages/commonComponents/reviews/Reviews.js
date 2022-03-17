// /ShowObjects/Reviews.js
import React, { Component, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import Rating from 'react-rating';
import { useFormik } from 'formik';

import { ReactComponent as EmptyStarIconSvg } from '../../../images/starempty.svg';
import { ReactComponent as FullStarIconSvg } from '../../../images/star.svg';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import MessageNotFound from '../MessageNotFound';
import Collapse from 'react-bootstrap/Collapse';
import './Reviews.scss';

// import {ReviewButton, ReplyButton} from './ReviewComponents';

var baseURL = require('../BaseURL').getURL();

class Reviews extends Component {
    constructor(props) {
        super(props);
        this.state.data = props.data;
        this.state.userState = props.userState;
        this.state.reviewData = props.reviewData;
    }

    // initialize our state
    state = {
        data: [],
        userState: [],
        reviewData: [],
        // isLoading: true
    };

    // here is our UI
    // it is easy to understand their functions when you
    // see them render into our screen
    render() {
        const { data, userState, reviewData } = this.state;

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return (
            <div>
                <Row className='margin-bottom-0'>
                    <Col xs={12} md={12} className='margin-top-0'>
                        <ReviewButton data={data} userState={userState} className='margin-bottom-0' />
                    </Col>
                </Row>

                {reviewData.length <= 0 ? (
                    <Row>
                        <Col xs={12}>
                            <MessageNotFound word='reviews' />
                        </Col>
                    </Row>
                ) : (
                    reviewData.map((review, index) => {
                        var updatedDate = new Date(review.date);
                        var updatedOnDate =
                            updatedDate.getDate() + ' ' + monthNames[updatedDate.getMonth()] + ' ' + updatedDate.getFullYear();
                        return (
                            <div key={index}>
                                <Row className='margin-bottom-8'>
                                    <Col>
                                        <div className='rectangle'>
                                            <Row>
                                                <Col xs={12} md={12}>
                                                    <span className='gray800-14'>"{review.review}"</span>
                                                </Col>
                                                <Col xs={6} md={6} className='mt-2'>
                                                    <span className='text-left purple-13'>
                                                        {review.person[0].firstname} {review.person[0].lastname}
                                                    </span>
                                                    <span className='text-left gray500-13'> on {updatedOnDate}</span>
                                                </Col>
                                                <Col xs={6} md={6} className='mb-1 text-right'>
                                                    <Rating
                                                        emptySymbol={<EmptyStarIconSvg />}
                                                        fullSymbol={<FullStarIconSvg />}
                                                        placeholderSymbol={<FullStarIconSvg />}
                                                        placeholderRating={review.rating}
                                                        readonly={true}
                                                    />
                                                </Col>
                                                <Col xs={12} md={12} className='text-right'>
                                                    <ReplyButton data={data} userState={userState} review={review} />
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>

                                {review.reply ? (
                                    <Row className='margin-bottom-8'>
                                        <Col md={2}></Col>
                                        <Col md={10}>
                                            <div className='rectangle'>
                                                <Row>
                                                    <Col xs={12} md={12}>
                                                        <span className='gray800-14'>"{review.reply}"</span>
                                                    </Col>
                                                    <Col xs={12} md={12} className='mt-2'>
                                                        <span className='text-left purple-13'>
                                                            {review.owner[0].firstname} {review.owner[0].lastname}
                                                        </span>
                                                        <span className='text-left gray500-13'> on {updatedOnDate}</span>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                ) : (
                                    <></>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        );
    }
}

const ReviewButton = props => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showLoginModal = () => {
        var modalID = 'myModal';
        if (props.isRequest) {
            modalID = 'myModalRequest';
        }
        document.getElementById(modalID).style.display = 'block';

        window.onclick = function (event) {
            if (event.target === document.getElementById(modalID)) {
                document.getElementById(modalID).style.display = 'none';
            }
        };
    };

    return (
        <>
            {props.userState[0].loggedIn === true ? (
                <>
                    {props.data.authors.includes(props.userState[0].id) ? (
                        ''
                    ) : (
                        <Button variant='light' id='addReviewButton' className='button-tertiary mb-3 addButton' onClick={handleShow}>
                            + Add a review
                        </Button>
                    )}
                </>
            ) : (
                <Button variant='light' id='addReviewButton' className='button-tertiary mb-3 addButton' onClick={showLoginModal}>
                    + Add a review
                </Button>
            )}

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Body>
                    <Row>
                        <Col xs={1} md={1} className='ml-5' />
                        <Col xs={11} md={11}>
                            <span className='ml-3' />
                            <span className='black-20 ml-5'>Add a review</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <span class='gray800-14'> Reviews help others understand if this tool could be useful to them..</span>
                        </Col>
                        <Col sm={1} lg={1} />
                    </Row>

                    <AddReviewForm data={props.data} userState={props.userState} handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </>
    );
};

const AddReviewForm = props => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            toolID: props.data.id,
            reviewerID: props.userState[0].id,
            rating: 0,
            projectName: '',
            showproject: false,
            review: '',
        },

        validationSchema: Yup.object({
            projectName: Yup.string(),
            review: Yup.string().required('This cannot be empty'),
        }),

        onSubmit: values => {
            axios.post(baseURL + '/api/v1/tools/review/add', values).then(res => {
                window.location.href = '/tool/' + props.data.id + '/?reviewAdded=true';
            });
        },
    });

    const handleRatingChange = rating => {
        formik.values.rating = rating;
    };

    const showProjectInput = showOrHide => {
        if (showOrHide === 'show') {
            setOpen(true);
        } else if (showOrHide === 'hide') {
            setOpen(false);
        }
    };

    const [open, setOpen] = useState(false);

    return (
        <div>
            <Row className='mt-3'>
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Label className='gray800-14'>Your score</Form.Label>
                        <Form.Group className='mb-2'>
                            <Rating
                                id='rating'
                                name='rating'
                                emptySymbol={<EmptyStarIconSvg />}
                                fullSymbol={<FullStarIconSvg />}
                                initialRating={formik.values.rating}
                                onChange={handleRatingChange}
                            />
                        </Form.Group>

                        <Form.Label className='gray800-14'>Is this review related to a specific project?</Form.Label>
                        <Form.Group className='mb-2 mt-2' style={{ display: 'flex' }}>
                            <Row>
                                <Col>
                                    <Form.Check
                                        type='radio'
                                        label='Yes'
                                        className='ml-4'
                                        name='showproject'
                                        id='showproject'
                                        value='true'
                                        onChange={() => showProjectInput('show')}
                                    />
                                </Col>
                                <Col className='ml-5'>
                                    <Form.Check
                                        type='radio'
                                        label='No'
                                        className='ml-1'
                                        name='showproject'
                                        id='showproject'
                                        value='false'
                                        onChange={() => showProjectInput('hide')}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>

                        <Collapse in={open}>
                            <Form.Group className='pb-2'>
                                <Form.Label className='gray800-14'>Project name</Form.Label>
                                <Form.Control
                                    id='projectName'
                                    name='projectName'
                                    type='text'
                                    className={
                                        formik.touched.projectName && formik.errors.projectName
                                            ? 'emptyFormInput addFormInput'
                                            : 'addFormInput'
                                    }
                                    value={formik.values.projectName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.projectName && formik.errors.projectName ? (
                                    <div className='errorMessages'>{formik.errors.projectName}</div>
                                ) : null}
                            </Form.Group>
                        </Collapse>

                        <Form.Group className='pb-2'>
                            <Form.Label className='gray800-14'>Your review</Form.Label>
                            <Form.Text className='gray700-13 mb-2'>
                                What worked or didn't work for you? What was the context? Is there anything you wish you knew before you
                                tried it?
                            </Form.Text>
                            <Form.Control
                                as='textarea'
                                id='review'
                                name='review'
                                type='text'
                                className={
                                    formik.touched.review && formik.errors.review
                                        ? 'emptyFormInput addFormInput descriptionInput'
                                        : 'addFormInput descriptionInput'
                                }
                                value={formik.values.review}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.review && formik.errors.review ? (
                                <div className='errorMessages'>{formik.errors.review}</div>
                            ) : null}
                        </Form.Group>

                        <Row className='mt-3'>
                            <Col xs={7} lg={7} />
                            <Col xs={1} lg={1} className='text-left pr-5'>
                                <Button variant='medium' className='greyCancelButton' onClick={props.handleClose}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col xs={3} lg={3} className='text-right pl-5'>
                                <Button variant='primary' type='submit' className='smallAddButton'>
                                    Add this review
                                </Button>
                            </Col>
                            <Col xs={1} lg={1} />
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

const ReplyButton = props => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            {props.userState[0].loggedIn === true && props.data.authors.includes(props.userState[0].id) && !props.review.reply ? (
                <Button variant='light' onClick={handleShow}>
                    Reply to review
                </Button>
            ) : (
                <></>
            )}

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Body>
                    <Row>
                        <Col xs={1} md={1} className='ml-5' />
                        <Col xs={11} md={11}>
                            <span className='ml-3' />
                            <span className='black-20 ml-5'>Add a reply to review</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={1} lg={1} />
                        <Col sm={10} lg={10}>
                            <span className='gray800-14'>The review</span>
                            <br />
                            <span className='gray800-14'>"{props.review.review}"</span>
                        </Col>
                        <Col sm={1} lg={1} />
                    </Row>

                    <ReplyReviewForm data={props.data} userState={props.userState} handleClose={handleClose} review={props.review} />
                </Modal.Body>
            </Modal>
        </>
    );
};

const ReplyReviewForm = props => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            reviewID: props.review.reviewID,
            replierID: props.userState[0].id,
            reply: '',
        },

        validationSchema: Yup.object({
            reply: Yup.string().required('This cannot be empty'),
        }),

        onSubmit: values => {
            axios.post(baseURL + '/api/v1/tools/reply', values).then(res => {
                window.location.href = '/tool/' + props.data.id + '/?replyAdded=true';
            });
        },
    });

    return (
        <div>
            <Row className='mt-3'>
                <Col sm={1} lg={1} />
                <Col sm={10} lg={10}>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className='pb-2'>
                            <Form.Text className='gray700-13'>Your reply to the review</Form.Text>
                            <Form.Control
                                as='textarea'
                                id='reply'
                                name='reply'
                                type='text'
                                className={
                                    formik.touched.reply && formik.errors.reply
                                        ? 'emptyFormInput addFormInput descriptionInput'
                                        : 'addFormInput descriptionInput'
                                }
                                value={formik.values.reply}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.reply && formik.errors.reply ? (
                                <div className='errorMessages'>{formik.errors.reply}</div>
                            ) : null}
                        </Form.Group>

                        <Row className='mt-3'>
                            <Col xs={7} lg={7} />
                            <Col xs={1} lg={1} className='text-left pr-5'>
                                <Button variant='medium' className='greyCancelButton' onClick={props.handleClose}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col xs={3} lg={3} className='text-right pl-5'>
                                <Button variant='primary' type='submit' className='smallAddButton'>
                                    Add this review
                                </Button>
                            </Col>
                            <Col xs={1} lg={1} />
                        </Row>
                    </Form>
                </Col>
                <Col sm={1} lg={1} />
            </Row>
        </div>
    );
};

export default Reviews;
