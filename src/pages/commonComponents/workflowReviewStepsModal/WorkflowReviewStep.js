import React from 'react';
import { SlideDown } from 'react-slidedown';
import _ from 'lodash';
import SLA from '../sla/SLA';
import TimeDuration from '../timeDuration/TimeDuration';
import SVGIcon from '../../../images/SVGIcon';
import DarHelper from '../../../utils/DarHelper.util';
import WorkflowReview from './WorkflowReview';

const WorkflowReviewStep = ({ index, step, toggleStep, toggleReview }) => {
    let { stepName, sections, reviews, closed, deadlinePassed, reviewStatus = '' } = step;

    const renderSections = () => {
        if (!_.isEmpty(sections)) {
            return sections.map(s => s).join(', ');
        }
        return '';
    };

    const renderSLA = step => {
        let { active = false, completed = false } = step;

        if (active) return <SLA classProperty={DarHelper.darStatusColours.inReview} text={'Active'} />;

        if (completed) return <SLA classProperty={DarHelper.darStatusColours.approved} text={'Phase Completed'} />;

        return '';
    };

    const renderReviewStatus = () => {
        if (!_.isEmpty(reviewStatus)) {
            return <TimeDuration text={reviewStatus} />;
        }
        return '';
    };

    return (
        <div className='step'>
            <div className='step-header reviewWrap' onClick={e => toggleStep(step)} data-testid={`step-header-${index}`}>
                <div className='step-header-title'>
                    <h1 className='black-16-semibold'>
                        {++index}. {stepName}
                    </h1>
                    <span className='gray700-13'>{renderSections()}</span>
                </div>
                <div className='step-header-status'>
                    <div className={deadlinePassed ? 'app-red' : ''}>{renderReviewStatus()}</div>
                    {renderSLA(step)}
                </div>
                <SVGIcon width='20px' height='20px' name='chevronbottom' fill={'#475da7'} className={closed ? '' : 'flip180'} />
            </div>
            <SlideDown closed={step.closed}>
                <div className='step-body'>
                    <div className='step-review'>
                        <div className='step-review-wrap'>
                            <div className='step-review-wrap--reviewer'>
                                <h2 className='gray800-14-bold'>Reviewer</h2>
                            </div>
                            <div className='step-review-wrap--decision'>
                                <h2 className='gray800-14-bold'>Recommendation</h2>
                            </div>
                        </div>
                    </div>
                    {reviews.length > 0 &&
                        reviews.map((review, i) => {
                            return <WorkflowReview key={`review-${i}`} review={review} toggleReview={toggleReview} />;
                        })}
                </div>
            </SlideDown>
        </div>
    );
};

export default WorkflowReviewStep;
