import React from 'react';
import _ from 'lodash';
import { SlideDown } from 'react-slidedown';
import SVGIcon from '../../../images/SVGIcon';

const WorkflowReview = ({ key, review, toggleReview }) => {
    let { firstname, lastname, approved, comments, closed } = review;

    const generateIssue = () => {
        return _.isNull(approved) ? '-' : approved ? 'No issues found' : 'Issues found';
    };

    return (
        <div className='step-review' onClick={e => toggleReview(review)}>
            <div className='step-review-wrap'>
                <div className='step-review-wrap--reviewer'>
                    <SVGIcon
                        width='20px'
                        height='20px'
                        name='chevronbottom'
                        fill={'#475da7'}
                        className={closed ? 'chevron' : 'chevron flip180'}
                    />
                    <div className='gray800-14'>
                        {firstname} {lastname}
                    </div>
                </div>
                <div className='step-review-wrap--decision'>
                    <div className='gray800-14'>{generateIssue()}</div>
                </div>
            </div>
            <SlideDown closed={closed}>
                <div className='step-review-comment gray700-13-bold'>{!_.isEmpty(comments) ? comments : 'No recommendation yet'}</div>
            </SlideDown>
        </div>
    );
};

export default WorkflowReview;
