import React, { Fragment } from 'react';
import _ from 'lodash';
import moment from 'moment';

export default ({ text, title, subtitle, decisionDate }) => {
    return (
        <div className='comment'>
            <h1 className='gray700-alt-13'>{title}</h1>
            <div className='comment-wrapper'>
                <div className='comment-item'>
                    <div className='comment-item-header gray700-alt-13-bold'>
                        {!_.isEmpty(subtitle) ? (
                            <Fragment>
                                <h2>{subtitle}</h2>
                                <div className='gray500-13'>{moment(decisionDate).format('DD MMM YYYY')}</div>
                            </Fragment>
                        ) : (
                            ''
                        )}
                    </div>
                    <div className='comment-item-body gray800-14'>{text}</div>
                </div>
            </div>
        </div>
    );
};
