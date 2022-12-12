import React, { useState, useEffect, Fragment } from 'react';
import _ from 'lodash';
import uniqid from 'uniqid';
import { Modal } from 'react-bootstrap';
import ModalHeader from './ModalHeader';
import WorkflowReviewStep from './WorkflowReviewStep';
import { updateStepToggle } from '../../../utils/Workflows.util';
import './WorkflowReviewStepsModal.scss';

const WorkflowReviewStepsModal = ({ open, close, workflow = {} }) => {
    const [workflowObj, setWorkflow] = useState({});

    const onClickAction = (e, action = false) => {
        e.preventDefault();
        close('', action);
    };

    const buildWorkflow = () => {
        // 1. deconstruct workflow
        let { steps = [] } = workflow;
        if (!_.isEmpty(steps)) {
            const stepsArr = formatSteps(steps);
            let workflowObj = {
                ...workflow,
                steps: stepsArr,
            };
            setWorkflow(workflowObj);
        } else {
            setWorkflow(workflow);
        }
    };

    const formatSteps = steps => {
        if (!_.isEmpty(steps)) {
            return [...steps].reduce((arr, step) => {
                if (!_.isEmpty(step)) {
                    // 1. extract reviewers as own entity
                    let { reviewers, recommendations, _id, active } = step;
                    // 2. each item add expand state and reviewers expand
                    let item = {
                        ...step,
                        closed: active ? false : true,
                        reviews: buildReviews(_id, reviewers, recommendations),
                    };
                    // 3. return new array
                    arr.push(item);
                }
                return arr;
            }, []);
        }
        return [];
    };

    const buildReviews = (stepId = '', reviewers = [], recommendations = []) => {
        if (!_.isEmpty(reviewers)) {
            return [...reviewers].map(rev => {
                let comment = { approved: null, comments: '', createdDate: '' };
                let review = recommendations.find(r => r.reviewer === rev._id) || {};
                if (!_.isEmpty(review)) comment = review;

                return {
                    ...rev,
                    ...comment,
                    id: uniqid(),
                    stepId,
                    closed: true,
                };
            });
        }
        return [];
    };

    const toggleStep = (step = {}) => {
        if (!_.isEmpty(workflowObj) && !_.isEmpty(step)) {
            let steps = updateStepToggle([...workflowObj.steps], step);
            let workflow = {
                ...workflowObj,
                steps,
            };
            setWorkflow(workflow);
        }
    };

    const toggleReview = (review = {}) => {
        const steps = setToggleReview(review);
        let workflow = {
            ...workflowObj,
            steps,
        };
        setWorkflow(workflow);
    };

    const setToggleReview = (review = {}) => {
        let { steps } = workflowObj;
        let modifiedSteps = [...steps].reduce((arr, step) => {
            let modifiedReviews = [];
            let { reviews } = { ...step };
            if (!_.isEmpty(reviews)) {
                modifiedReviews = mapToggleReviews(reviews, review);
            }
            arr.push({
                ...step,
                reviews: modifiedReviews,
            });
            return arr;
        }, []);

        return modifiedSteps;
    };

    const mapToggleReviews = (reviews = [], review) => {
        if (!_.isEmpty(reviews) && !_.isEmpty(review)) {
            return [...reviews].map(r => {
                return {
                    ...r,
                    closed: r.id === review.id ? !r.closed : r.closed,
                };
            });
        }
        return [];
    };

    const renderSteps = () => {
        let { steps = [] } = workflowObj;
        if (!_.isEmpty(steps)) {
            return steps.map((step, i) => {
                return <WorkflowReviewStep key={`step-${i}`} index={i} step={step} toggleStep={toggleStep} toggleReview={toggleReview} />;
            });
        }
        return 'No Steps currently assigned';
    };

    useEffect(() => {
        if (!_.isEmpty(workflow)) buildWorkflow();
    }, [workflow]);

    return (
        <Fragment>
            <Modal show={open} onHide={close} size='lg' aria-labelledby='contained-modal-title-vcenter' centered className='workflowReview'>
                <ModalHeader workflowName={workflowObj.workflowName} onClickAction={onClickAction} />

                <div className='workflowReview-body'>{renderSteps()}</div>

                {workflowObj.canOverrideStep ? (
                    <div className='workflowReview-footer'>
                        <button className='button-tertiary' onClick={e => onClickAction(e, true)}>
                            Complete and skip to the next phase
                        </button>
                    </div>
                ) : (
                    ''
                )}
            </Modal>
        </Fragment>
    );
};

export default WorkflowReviewStepsModal;
