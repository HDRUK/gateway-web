import React, { Fragment } from 'react';
import _ from 'lodash';
import { SlideDown } from 'react-slidedown';
import SVGIcon from '../../../images/SVGIcon';

const WorkflowStep = ({ steps, toggleSection }) => {
    const renderReviewers = reviewers => {
        if (!_.isEmpty(reviewers)) {
            return reviewers.map(reviewer => `${reviewer.firstname} ${reviewer.lastname}`).join(', ');
        }
        return '-';
    };

    const renderSections = sections => {
        if (!_.isEmpty(sections)) {
            return sections.map(s => s).join(', ');
        }
        return '-';
    };

    return (
        <Fragment>
            {steps.length > 0 &&
                steps.map((step, index) => {
                    return (
                        <div className='workflow-step' key={`step-${index}`} onClick={e => toggleSection(step)}>
                            <h1>
                                {++index}. {step.stepName}{' '}
                                <SVGIcon
                                    name='chevronbottom'
                                    width={16}
                                    height={16}
                                    fill={'#3c4e8c'}
                                    className={step.closed ? '' : 'flip180'}
                                />
                            </h1>
                            <SlideDown closed={step.closed}>
                                <div className='workflow-step-body'>
                                    <div className='box gray200-14'>Reviewers</div>
                                    <div className='box gray800-14'>{renderReviewers(step.reviewers)}</div>
                                    <div className='box gray200-14'>Sections</div>
                                    <div className='box gray800-14'>{renderSections(step.displaySections)}</div>
                                    <div className='box gray200-14'>Deadline</div>
                                    <div className='box gray800-14'>{step.deadline} days after the start of the phase</div>
                                </div>
                            </SlideDown>
                        </div>
                    );
                })}
        </Fragment>
    );
};

export default WorkflowStep;
